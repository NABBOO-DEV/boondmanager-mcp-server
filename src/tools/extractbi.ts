import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CHARACTER_LIMIT } from "../constants.js";
import { apiRequest, apiDownload } from "../services/boond-client.js";

/**
 * ExtractBI: saved SQL "reports" stored in BoondManager. All read-only (GET):
 *  - list  : discover saved requests (id + name + description)
 *  - get   : inspect one request's SQL (SELECT/FROM/WHERE)
 *  - run   : execute a saved request and return its CSV result
 *
 * This is the efficient path for aggregates (COUNT, GROUP BY, JOINs) that the
 * per-entity search tools cannot express: a single saved query aggregates
 * server-side instead of forcing N+1 detail calls. Queries run exactly as saved
 * (no dynamic SQL parameter) — the ad-hoc `/application/read-database` endpoint
 * is a POST and stays blocked by this fork's read-only guard.
 */

const READ = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

function truncate(text: string): string {
  return text.length > CHARACTER_LIMIT ? text.substring(0, CHARACTER_LIMIT) + "\n\n[Résultat tronqué...]" : text;
}

interface BiRow {
  id?: string;
  attributes?: {
    name?: string;
    description?: string;
    sqlSelect?: string;
    sqlFrom?: string;
    sqlWhere?: string;
    sqlOrder?: string;
    sqlId?: string;
    frequency?: unknown;
    encoding?: string;
  };
}

export function registerExtractBiTools(server: McpServer): void {
  // 1) List saved BI requests -------------------------------------------------
  server.registerTool(
    "boond_extractbi_list",
    {
      title: "Lister les requêtes ExtractBI enregistrées",
      description: `Liste les requêtes SQL ExtractBI ENREGISTRÉES dans BoondManager (reportings pré-écrits, ex. "nouveaux candidats par manager", "consultants", "provenance des candidats"). Lecture seule.

Utilisez ceci pour trouver une requête existante à exécuter avec \`boond_extractbi_run\` — une seule requête SQL agrège côté serveur (COUNT, GROUP BY, jointures) et évite de multiplier les appels de recherche (pas de N+1).

Args:
  - keywords (string, optionnel): filtre sur le nom/description (insensible à la casse).

Retourne: { total, requests: [{ id, name, description }] }.`,
      inputSchema: { keywords: z.string().optional().describe("Filtre sur le nom/description") },
      annotations: READ,
    },
    async (params: { keywords?: string }) => {
      const resp = await apiRequest("/apps/extractbi/requests", "GET", undefined, { maxResults: 500 });
      const rows: BiRow[] = Array.isArray(resp.data) ? (resp.data as BiRow[]) : [];
      let items = rows.map((r) => ({
        id: r.id,
        name: r.attributes?.name ?? "",
        description: r.attributes?.description ?? "",
      }));
      const kw = params.keywords?.toLowerCase().trim();
      if (kw) items = items.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(kw));
      const text = JSON.stringify({ total: items.length, requests: items }, null, 2);
      return { content: [{ type: "text" as const, text: truncate(text) }] };
    }
  );

  // 2) Inspect one request's SQL ----------------------------------------------
  server.registerTool(
    "boond_extractbi_get",
    {
      title: "Détail d'une requête ExtractBI (SQL)",
      description: `Récupère le détail d'une requête ExtractBI enregistrée : nom, description et le SQL (SELECT / FROM / WHERE / ORDER). Lecture seule. Utile pour comprendre ce qu'une requête renvoie avant de l'exécuter.

Args:
  - id (string): identifiant de la requête (voir \`boond_extractbi_list\`).`,
      inputSchema: { id: z.string().describe("ID de la requête ExtractBI") },
      annotations: READ,
    },
    async (params: { id: string }) => {
      const resp = await apiRequest(`/apps/extractbi/requests/${encodeURIComponent(params.id)}`);
      const row = (resp.data ?? {}) as BiRow;
      const a = row.attributes ?? {};
      const detail = {
        id: row.id,
        name: a.name,
        description: a.description,
        sql: { select: a.sqlSelect, from: a.sqlFrom, where: a.sqlWhere, order: a.sqlOrder, id: a.sqlId },
        frequency: a.frequency,
        encoding: a.encoding,
      };
      return { content: [{ type: "text" as const, text: truncate(JSON.stringify(detail, null, 2)) }] };
    }
  );

  // 3) Execute a saved request -> CSV -----------------------------------------
  server.registerTool(
    "boond_extractbi_run",
    {
      title: "Exécuter une requête ExtractBI (résultat CSV)",
      description: `EXÉCUTE une requête ExtractBI enregistrée (telle qu'enregistrée, sans paramètre dynamique) et renvoie son résultat en CSV (séparateur ';'). Lecture seule.

C'est LE moyen efficace d'obtenir des agrégats (comptages, GROUP BY, jointures) en un seul appel, au lieu de multiplier les recherches et de recomposer côté client.

Args:
  - id (string): identifiant de la requête (voir \`boond_extractbi_list\`).

Retourne: le CSV du résultat (tronqué si volumineux).`,
      inputSchema: { id: z.string().describe("ID de la requête ExtractBI à exécuter") },
      annotations: READ,
    },
    async (params: { id: string }) => {
      const doc = await apiDownload(`/apps/extractbi/requests/${encodeURIComponent(params.id)}/download`);
      const csv = doc.data.toString("utf8");
      return { content: [{ type: "text" as const, text: truncate(csv) }] };
    }
  );
}
