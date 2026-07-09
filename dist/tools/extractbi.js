import { z } from "zod";
import { CHARACTER_LIMIT } from "../constants.js";
import { apiRequest, apiDownload, apiExtractBiSql } from "../services/boond-client.js";
import { BOOND_DB_SCHEMA } from "../resources/boond-db-schema.js";
import { BOOND_SCHEMA_NOTES } from "../resources/boond-schema-notes.js";
/**
 * ExtractBI: saved SQL "reports" stored in BoondManager, plus ad-hoc SELECT.
 *  - list  : discover saved requests (id + name + description)          (GET)
 *  - get   : inspect one request's SQL (SELECT/FROM/WHERE)              (GET)
 *  - run   : execute a saved request and return its CSV result          (GET)
 *  - query : execute an ad-hoc read-only SELECT (max 10 rows preview)   (POST, see below)
 *
 * This is the efficient path for aggregates (COUNT, GROUP BY, JOINs) that the
 * per-entity search tools cannot express: a single query aggregates
 * server-side instead of forcing N+1 detail calls.
 *
 * `query` is the single sanctioned POST of this read-only fork: BoondManager's
 * `/apps/extractbi/test` runs one SELECT and rejects any write statement at
 * validation time (`apiExtractBiSql` re-checks client-side). The broader ad-hoc
 * endpoint `/application/read-database` stays unreachable (403 server-side).
 */
const READ = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
};
function truncate(text) {
    return text.length > CHARACTER_LIMIT ? text.substring(0, CHARACTER_LIMIT) + "\n\n[Résultat tronqué...]" : text;
}
export function registerExtractBiTools(server) {
    // 1) List saved BI requests -------------------------------------------------
    server.registerTool("boond_extractbi_list", {
        title: "Lister les requêtes ExtractBI enregistrées",
        description: `Liste les requêtes SQL ExtractBI ENREGISTRÉES dans BoondManager (reportings pré-écrits, ex. "nouveaux candidats par manager", "consultants", "provenance des candidats"). Lecture seule.

Utilisez ceci pour trouver une requête existante à exécuter avec \`boond_extractbi_run\` — une seule requête SQL agrège côté serveur (COUNT, GROUP BY, jointures) et évite de multiplier les appels de recherche (pas de N+1).

Args:
  - keywords (string, optionnel): filtre sur le nom/description (insensible à la casse).

Retourne: { total, requests: [{ id, name, description }] }.`,
        inputSchema: { keywords: z.string().optional().describe("Filtre sur le nom/description") },
        annotations: READ,
    }, async (params) => {
        const resp = await apiRequest("/apps/extractbi/requests", "GET", undefined, { maxResults: 500 });
        const rows = Array.isArray(resp.data) ? resp.data : [];
        let items = rows.map((r) => ({
            id: r.id,
            name: r.attributes?.name ?? "",
            description: r.attributes?.description ?? "",
        }));
        const kw = params.keywords?.toLowerCase().trim();
        if (kw)
            items = items.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(kw));
        const text = JSON.stringify({ total: items.length, requests: items }, null, 2);
        return { content: [{ type: "text", text: truncate(text) }] };
    });
    // 2) Inspect one request's SQL ----------------------------------------------
    server.registerTool("boond_extractbi_get", {
        title: "Détail d'une requête ExtractBI (SQL)",
        description: `Récupère le détail d'une requête ExtractBI enregistrée : nom, description et le SQL (SELECT / FROM / WHERE / ORDER). Lecture seule. Utile pour comprendre ce qu'une requête renvoie avant de l'exécuter.

Args:
  - id (string): identifiant de la requête (voir \`boond_extractbi_list\`).`,
        inputSchema: { id: z.string().describe("ID de la requête ExtractBI") },
        annotations: READ,
    }, async (params) => {
        const resp = await apiRequest(`/apps/extractbi/requests/${encodeURIComponent(params.id)}`);
        const row = (resp.data ?? {});
        const a = row.attributes ?? {};
        const detail = {
            id: row.id,
            name: a.name,
            description: a.description,
            sql: { select: a.sqlSelect, from: a.sqlFrom, where: a.sqlWhere, order: a.sqlOrder, id: a.sqlId },
            frequency: a.frequency,
            encoding: a.encoding,
        };
        return { content: [{ type: "text", text: truncate(JSON.stringify(detail, null, 2)) }] };
    });
    // 3) Execute a saved request -> CSV -----------------------------------------
    server.registerTool("boond_extractbi_run", {
        title: "Exécuter une requête ExtractBI (résultat CSV)",
        description: `EXÉCUTE une requête ExtractBI enregistrée (telle qu'enregistrée, sans paramètre dynamique) et renvoie son résultat en CSV (séparateur ';'). Lecture seule.

C'est LE moyen efficace d'obtenir des agrégats (comptages, GROUP BY, jointures) en un seul appel, au lieu de multiplier les recherches et de recomposer côté client.

Args:
  - id (string): identifiant de la requête (voir \`boond_extractbi_list\`).

Retourne: le CSV du résultat (tronqué si volumineux).`,
        inputSchema: { id: z.string().describe("ID de la requête ExtractBI à exécuter") },
        annotations: READ,
    }, async (params) => {
        const doc = await apiDownload(`/apps/extractbi/requests/${encodeURIComponent(params.id)}/download`);
        const csv = doc.data.toString("utf8");
        return { content: [{ type: "text", text: truncate(csv) }] };
    });
    // 4) Ad-hoc read-only SELECT --------------------------------------------------
    server.registerTool("boond_extractbi_query", {
        title: "Exécuter un SELECT SQL ad hoc (lecture seule)",
        description: `Exécute UN SELECT SQL ad hoc en LECTURE SEULE sur la base BoondManager et renvoie les lignes de résultat. À utiliser quand aucune requête ExtractBI enregistrée (\`boond_extractbi_list\`) ne couvre le besoin : agrégats, comptages, jointures, filtres « WHERE » dynamiques (période, manager, agence…).

Contraintes (IMPORTANTES — les respecter évite de tâtonner) :
  - Un seul SELECT complet avec FROM (\`SELECT 1\` seul est rejeté). Écritures impossibles (refusées serveur ET client).
  - \`SELECT *\` INTERDIT → énumère explicitement les colonnes.
  - Plafond = 10 LIGNES DE RÉSULTAT renvoyées (PAS 10 enregistrements : une ligne peut agréger des milliers de fiches). La requête s'exécute sur toute la base → les agrégats (COUNT/GROUP BY…) sont EXACTS même à 10 lignes affichées. \`totalRows\` = nb total de lignes de résultat.
  - LIMIT/OFFSET ignorés ; la pagination par keyset (\`WHERE cle > derniere_vue ORDER BY cle\`) marche mais AVEC PARCIMONIE. Décide selon totalRows (connu dès le 1er appel) : ≤10 → complet ; 10–50 → paginer par keyset (max 5 appels) ; >50 → NE PAS paginer 10 par 10, AGRÉGER (GROUP BY par pôle/mois/responsable) ou proposer une requête ExtractBI enregistrée (download CSV complet en 1 appel). Jamais plus de 5 appels de pagination.
  - Pas de point-virgule ni de commentaire SQL.
  - AVANT d'écrire : lis \`boond_extractbi_schema\` (sans argument = guide + tables clés + JOINs canoniques + mappings ; avec table/keywords = détail). Référence LOCALE, instantanée. NE va JAMAIS chercher la doc sur le web.
  - Préfère UNE requête avec JOIN plutôt que plusieurs appels : ramène les libellés dans le même SELECT (ex. nom du responsable via JOIN TAB_USER→TAB_PROFIL, agence via JOIN TAB_SOCIETE) au lieu de renvoyer des IDs à mapper après coup.

Args:
  - sql (string): le SELECT à exécuter.

Retourne: JSON { isValid, rowCount, totalRows, rows } — rows = max 10 lignes de RÉSULTAT ; totalRows = nombre TOTAL de lignes de résultat (pas d'enregistrements). Si totalRows > rowCount, applique la règle de décision ci-dessus.`,
        inputSchema: { sql: z.string().describe("Le SELECT complet à exécuter (lecture seule, 10 lignes max)") },
        annotations: READ,
    }, async (params) => {
        const result = await apiExtractBiSql(params.sql);
        const payload = {
            isValid: result.isValid,
            rowCount: result.preview.length,
            ...(result.total !== undefined ? { totalRows: result.total } : {}),
            rows: result.preview,
        };
        return { content: [{ type: "text", text: truncate(JSON.stringify(payload, null, 2)) }] };
    });
    // 5) Local schema reference (no network) --------------------------------------
    server.registerTool("boond_extractbi_schema", {
        title: "Schéma de la base BoondManager (référence locale)",
        description: `Référence LOCALE du schéma de la base BoondManager (152 tables TAB_*, colonnes, types, descriptions et relations [→ TAB_X]). Aucun appel réseau — à utiliser AVANT d'écrire un SELECT pour \`boond_extractbi_query\`, au lieu d'aller chercher la doc sur le web.

Les marqueurs [→ TAB_X] indiquent les clés étrangères : utilise-les pour construire des JOINs qui ramènent les libellés (noms, agences…) dans la même requête.

Args (au moins un recommandé ; sans argument → liste des 152 tables) :
  - table (string, optionnel): nom exact d'une table (ex. TAB_PROFIL) → toutes ses colonnes.
  - keywords (string, optionnel): recherche dans les noms de tables, colonnes et descriptions (ex. "manager", "candidat", "facture").

Retourne: les tables/colonnes correspondantes.`,
        inputSchema: {
            table: z.string().optional().describe("Nom exact de table (ex. TAB_PROFIL)"),
            keywords: z.string().optional().describe("Mots-clés (tables, colonnes, descriptions)"),
        },
        annotations: READ,
    }, async (params) => {
        const tableName = params.table?.trim().toUpperCase();
        if (tableName) {
            const key = tableName.startsWith("TAB_") ? tableName : `TAB_${tableName}`;
            const entry = BOOND_DB_SCHEMA[key];
            if (!entry) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Table inconnue : ${key}. Utilise le paramètre keywords pour chercher, ou sans argument pour lister les tables.`,
                        },
                    ],
                };
            }
            const lines = [`# ${key}${entry.d ? ` — ${entry.d}` : ""}`];
            for (const [col, info] of Object.entries(entry.c))
                lines.push(`${col}: ${info}`);
            return { content: [{ type: "text", text: truncate(lines.join("\n")) }] };
        }
        const kw = params.keywords?.trim().toLowerCase();
        if (kw) {
            const lines = [];
            for (const [name, entry] of Object.entries(BOOND_DB_SCHEMA)) {
                const tableHit = name.toLowerCase().includes(kw) || entry.d.toLowerCase().includes(kw);
                const colHits = Object.entries(entry.c).filter(([col, info]) => col.toLowerCase().includes(kw) || info.toLowerCase().includes(kw));
                if (!tableHit && colHits.length === 0)
                    continue;
                lines.push(`# ${name}${entry.d ? ` — ${entry.d}` : ""}`);
                // On a table-name hit, show all columns only if few; otherwise matched columns.
                const shown = tableHit && colHits.length === 0 ? Object.entries(entry.c).slice(0, 15) : colHits.slice(0, 25);
                for (const [col, info] of shown)
                    lines.push(`  ${col}: ${info}`);
            }
            const text = lines.length > 0 ? lines.join("\n") : `Aucune table/colonne ne correspond à « ${params.keywords} ».`;
            return { content: [{ type: "text", text: truncate(text) }] };
        }
        const list = Object.entries(BOOND_DB_SCHEMA).map(([name, entry]) => `${name}${entry.d ? ` — ${entry.d.slice(0, 90)}` : ""}`);
        // No-arg call = "start here": the hand-curated Nabboo guide first, then
        // the exhaustive table list. The guide is what prevents trial-and-error.
        const text = `${BOOND_SCHEMA_NOTES}\n## Les 152 tables\n${list.join("\n")}`;
        return { content: [{ type: "text", text: truncate(text) }] };
    });
}
//# sourceMappingURL=extractbi.js.map