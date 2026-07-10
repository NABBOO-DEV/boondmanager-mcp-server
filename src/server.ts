import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerCandidateTools,
  registerResourceTools,
  registerContactTools,
  registerCompanyTools,
  registerOpportunityTools,
  registerActionTools,
  registerTimesheetTools,
  registerProjectTools,
  registerInvoiceTools,
  registerOrderTools,
  registerDeliveryTools,
  registerAbsenceTools,
  registerExpenseTools,
  registerProductTools,
  registerPositioningTools,
  registerPaymentTools,
  registerAdvantageTools,
  registerApplicationTools,
  registerContractTools,
  registerPurchaseTools,
  registerProviderInvoiceTools,
  registerAccountTools,
  registerAgencyTools,
  registerBusinessUnitTools,
  registerRoleTools,
  registerLogTools,
  registerNotificationTools,
  registerThreadTools,
  registerTodolistTools,
  registerFlagTools,
  registerCalendarTools,
  registerWebhookTools,
  registerValidationTools,
  registerPoleTools,
  registerReportingTools,
  registerPlanningAbsenceTools,
  registerDocumentTools,
  registerWorkflowTools,
  registerExtractBiTools,
} from "./tools/index.js";
import { registerAllPrompts } from "./prompts/index.js";
import { registerAllResources } from "./resources/index.js";
import type { DomainName } from "./constants.js";
import { resolveAccessPolicy, isDomainAllowed, withPolicy, type AccessPolicy } from "./config/access-policy.js";

// Re-exported for the catalogue generator and tests that import it from here.
export { REGISTERED_DOMAINS } from "./constants.js";
export type { DomainName } from "./constants.js";

export const SERVER_NAME = "boondmanager-mcp-server";

/**
 * Read the package version from `package.json` so the value advertised over
 * MCP `initialize` always matches the published artefact. CI already enforces
 * version parity between `package.json`, `manifest.json`, and `server.json`,
 * so resolving from `package.json` is sufficient.
 *
 * The compiled file lives at `dist/server.js`, mirroring `src/server.ts`,
 * so `../package.json` is correct in both layouts.
 */
function readPackageVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = resolve(here, "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: unknown };
    if (typeof pkg.version === "string" && pkg.version.length > 0) return pkg.version;
  } catch {
    // Fall through to the placeholder — surface a recognisable value rather
    // than crashing the server on a missing package.json.
  }
  return "0.0.0-unknown";
}

export const SERVER_VERSION = readPackageVersion();

/**
 * Domain → registration function, in the canonical order of REGISTERED_DOMAINS.
 * Coupling the domain name to its registrar lets the access policy filter by
 * domain WITHOUT parsing tool names (no fragile regex on multi-word domains
 * like `provider-invoices`). Each registrar accepts an optional policy; only
 * `registerWorkflowTools` uses it (to mirror the prompt-level domain filter),
 * the others ignore the extra argument.
 *
 * Exported so the TOOLS.md generator can reuse the exact same list/order
 * instead of duplicating it.
 */
export const TOOL_REGISTRARS: ReadonlyArray<readonly [DomainName, (server: McpServer, policy?: AccessPolicy) => void]> =
  [
    ["candidates", registerCandidateTools],
    ["resources", registerResourceTools],
    ["contacts", registerContactTools],
    ["companies", registerCompanyTools],
    ["opportunities", registerOpportunityTools],
    ["actions", registerActionTools],
    ["timesheets", registerTimesheetTools],
    ["projects", registerProjectTools],
    ["invoices", registerInvoiceTools],
    ["orders", registerOrderTools],
    ["deliveries", registerDeliveryTools],
    ["absences", registerAbsenceTools],
    ["expenses", registerExpenseTools],
    ["products", registerProductTools],
    ["positionings", registerPositioningTools],
    ["payments", registerPaymentTools],
    ["advantages", registerAdvantageTools],
    ["application", registerApplicationTools],
    ["contracts", registerContractTools],
    ["purchases", registerPurchaseTools],
    ["provider-invoices", registerProviderInvoiceTools],
    ["accounts", registerAccountTools],
    ["agencies", registerAgencyTools],
    ["business-units", registerBusinessUnitTools],
    ["roles", registerRoleTools],
    ["logs", registerLogTools],
    ["notifications", registerNotificationTools],
    ["threads", registerThreadTools],
    ["todolists", registerTodolistTools],
    ["flags", registerFlagTools],
    ["calendars", registerCalendarTools],
    ["webhooks", registerWebhookTools],
    ["validations", registerValidationTools],
    ["poles", registerPoleTools],
    ["reporting", registerReportingTools],
    ["planning-absences", registerPlanningAbsenceTools],
    ["documents", registerDocumentTools],
    ["workflows", registerWorkflowTools],
    ["extractbi", registerExtractBiTools],
  ];

/**
 * Register the full (policy-filtered) tool/prompt/resource surface onto a
 * server. Extracted from createMcpServer so tests can exercise the exact same
 * wiring against a stub server with an arbitrary policy.
 *
 * - `target` is either the server itself (no operation filter) or a Proxy that
 *   drops disallowed-operation tools at registration time.
 * - Tool domains are skipped wholesale when the domain is disallowed.
 * - Prompts are domain-filtered (a prompt is cut if any domain it orchestrates
 *   is disallowed, so the runbook never points at missing tools).
 * - Resources (reference dictionaries) are left intact (the lookup substrate).
 */
export function registerAll(server: McpServer, policy: AccessPolicy): void {
  const target = withPolicy(server, policy);

  for (const [domain, register] of TOOL_REGISTRARS) {
    // `workflows` is the tool-form mirror of the MCP prompts (1:1). It is
    // therefore gated like the prompts themselves: each workflow tool is kept
    // only when its source prompt's domains are all allowed (that per-prompt
    // filter lives inside registerWorkflowTools), and is NOT subject to
    // allow-list membership, so a prompt and its mirror tool always appear or
    // disappear together. An explicit deny (`BOOND_MCP_EXCLUDE_DOMAINS=workflows`)
    // still suppresses the whole tool-form mirror (e.g. "prompts only").
    const allowed = domain === "workflows" ? !policy.excludedDomains.has("workflows") : isDomainAllowed(policy, domain);
    if (allowed) register(target, policy);
  }

  registerAllPrompts(target, policy);
  registerAllResources(target);
}

/**
 * Usage guidance surfaced to the model at `initialize` (MCP `instructions`).
 * Encodes a "lazy pattern" so the model reaches for the cheapest correct path
 * and never falls into N+1 loops for aggregates.
 */
const USAGE_INSTRUCTIONS = `Serveur BoondManager en LECTURE SEULE (aucune écriture possible : outils de lecture uniquement). Tu disposes ici des outils pour interroger BoondManager : dès qu'une demande porte sur des consultants, CRA/temps, candidats, sociétés, contacts, opportunités, factures, commandes ou staffing, sers-toi de ces outils — ne réponds pas de mémoire.

Pattern paresseux — pour TOUTE demande de données Boond, procède dans cet ordre :

RÈGLE DE CHOIX API vs SQL (la plus importante) : l'API (endpoints REST) est le défaut ; le SQL ExtractBI ne se justifie QUE pour une AGRÉGATION (COUNT/SUM/AVG/GROUP BY) ou une jointure PROFONDE (plus de 2 relations à traverser). En dessous de ce seuil, un endpoint existe et il est préférable (plus contrôlable, périmètre appliqué, pas de contexte SQL à écrire).

1. OUTIL SIMPLE (défaut). Si un outil direct couvre le besoin (boond_<domaine>_search / boond_<domaine>_get / onglets), utilise-le. Pour lister ou consulter des fiches individuelles, c'est toujours le bon choix.

2. RÉSOUDRE UN ID EXTERNE = PAS DE SQL. Le nom du responsable, de l'agence, du pôle, de la société d'une fiche… n'exige AUCUNE requête : la fiche (boond_*_get et onglets) renvoie déjà chaque relation résolue — un champ « label » est ajouté à côté de l'« id » dans « relationships » (via le tableau JSON:API « included »). Lis le label. Idem pour une jointure simple (1 à 2 relations). N'écris PAS de JOIN SQL pour un simple libellé.

3. AGRÉGAT / JOINTURE PROFONDE → ExtractBI. Dès qu'il faut COMPTER, SOMMER, MOYENNER, un « X par Y » (candidats par responsable, CA par société, nb de Y par mois), ou traverser plus de 2 relations, NE fais PAS un appel par élément (anti-pattern N+1). D'abord une requête ENREGISTRÉE : boond_extractbi_list (mots-clés) → éventuellement boond_extractbi_get → boond_extractbi_run (CSV agrégé côté serveur, UN appel). Préfère ExtractBI à boond_reporting_* / boond_workflow_* pour un comptage ad hoc « par X ».

4. SQL AD HOC (boond_extractbi_query). Si aucune requête enregistrée ne couvre l'agrégat, écris le SELECT et exécute-le avec boond_extractbi_query (lecture seule). Découvre tables et colonnes avec boond_extractbi_schema (référence locale) — ne va PAS sur le web. Le JOIN SQL sert à AGRÉGER/FILTRER sur un libellé à grande échelle (COUNT par responsable), pas à obtenir un libellé unique (étape 2). Résultat plafonné à 10 lignes par appel → agrège (GROUP BY) pour tenir en ≤ 10 lignes, ou pagine par keyset (WHERE id > dernier_id ORDER BY id — LIMIT/OFFSET ignorés). Si la requête resservira, propose de l'enregistrer dans l'UI ExtractBI. Le N+1 (relation fiche par fiche) reste un dernier recours pour de petits volumes.`;

export function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    { instructions: USAGE_INSTRUCTIONS }
  );

  // Operator-configured restrictions (env-driven). Absent config = full surface.
  registerAll(server, resolveAccessPolicy());

  return server;
}
