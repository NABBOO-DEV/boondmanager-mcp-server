import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ProjectCreateSchema, ProjectUpdateSchema, IdSchema } from "../schemas/index.js";
import type { IdInput } from "../schemas/index.js";
import {
  registerSearchTool,
  registerGetTool,
  registerCreateTool,
  registerUpdateTool,
  registerDeleteTool,
  buildJsonApiBody,
} from "./crud-factory.js";
import { apiRequest, formatDetailResponse } from "../services/boond-client.js";

const OPTS = {
  entityName: "projet",
  entityNamePlural: "projets",
  apiPath: "/projects",
  prefix: "boond_projects",
};

const TAB_TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

interface TabDefinition {
  name: string;
  tab: string;
  title: string;
  description: string;
}

const PROJECT_TABS: TabDefinition[] = [
  {
    name: "information",
    tab: "information",
    title: "Informations générales d'un projet",
    description: `Récupère les informations générales d'un projet (client, dates, état, description, responsable...).

Args:
  - id (string): ID du projet

Returns: Données générales du projet.`,
  },
  {
    name: "actions",
    tab: "actions",
    title: "Actions liées à un projet",
    description: `Récupère les actions (appels, emails, RDV, notes) associées à un projet.

Args:
  - id (string): ID du projet

Returns: Liste des actions liées au projet.`,
  },
  {
    name: "simulation",
    tab: "simulation",
    title: "Simulation financière d'un projet",
    description: `Récupère la simulation financière d'un projet (marge, CA, coûts, rentabilité...).

Args:
  - id (string): ID du projet

Returns: Données de simulation financière du projet.`,
  },
  {
    name: "deliveries_groupments",
    tab: "deliveries-groupments",
    title: "Livraisons d'un projet",
    description: `Récupère les livraisons (CRA) et groupements associés à un projet.

Args:
  - id (string): ID du projet

Returns: Liste des livraisons du projet.`,
  },
  {
    name: "orders",
    tab: "orders",
    title: "Bons de commande d'un projet",
    description: `Récupère les bons de commande associés à un projet.

Args:
  - id (string): ID du projet

Returns: Liste des bons de commande du projet.`,
  },
  {
    name: "purchases",
    tab: "purchases",
    title: "Achats/sous-traitance d'un projet",
    description: `Récupère les achats et la sous-traitance associés à un projet.

Args:
  - id (string): ID du projet

Returns: Liste des achats du projet.`,
  },
  {
    name: "productivity",
    tab: "productivity",
    title: "Productivité d'un projet",
    description: `Récupère les données de productivité d'un projet (temps passé, jours consommés...).

Args:
  - id (string): ID du projet

Returns: Données de productivité du projet.`,
  },
];

export function registerProjectTools(server: McpServer): void {
  registerSearchTool(server, OPTS);
  registerGetTool(server, OPTS);

  registerCreateTool(server, OPTS, ProjectCreateSchema, (params) => {
    const { companyId, contactId, opportunityId, ...attrs } = params;
    const body = buildJsonApiBody("project", attrs);
    const relationships: Record<string, unknown> = {};
    if (companyId) relationships.company = { data: { id: companyId, type: "company" } };
    if (contactId) relationships.contact = { data: { id: contactId, type: "contact" } };
    if (opportunityId) relationships.opportunity = { data: { id: opportunityId, type: "opportunity" } };
    if (Object.keys(relationships).length > 0) {
      (body as Record<string, Record<string, unknown>>).data.relationships = relationships;
    }
    return body;
  });

  registerUpdateTool(server, OPTS, ProjectUpdateSchema, (params) => {
    const { id, ...attrs } = params;
    return buildJsonApiBody("project", attrs, id as string);
  });

  registerDeleteTool(server, OPTS);

  // Register one tool per project tab
  for (const tab of PROJECT_TABS) {
    server.registerTool(
      `boond_projects_${tab.name}`,
      {
        title: tab.title,
        description: tab.description,
        inputSchema: IdSchema,
        annotations: TAB_TOOL_ANNOTATIONS,
      },
      async (params: IdInput) => {
        const response = await apiRequest(`/projects/${params.id}/${tab.tab}`);
        const text = formatDetailResponse(response);
        return {
          content: [{ type: "text" as const, text }],
        };
      }
    );
  }
}
