import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CandidateCreateSchema, CandidateUpdateSchema, IdSchema } from "../schemas/index.js";
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
  entityName: "candidat",
  entityNamePlural: "candidats",
  apiPath: "/candidates",
  prefix: "boond_candidates",
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

const CANDIDATE_TABS: TabDefinition[] = [
  {
    name: "information",
    tab: "information",
    title: "Informations générales d'un candidat",
    description: `Récupère les informations générales d'un candidat (coordonnées, adresse, état civil, photo, tags, source...).

Args:
  - id (string): ID du candidat

Returns: Données personnelles et administratives du candidat.`,
  },
  {
    name: "technical_data",
    tab: "technical-data",
    title: "Compétences techniques d'un candidat",
    description: `Récupère le profil technique d'un candidat (compétences, expériences, formations, certifications, langues, CV...).

Args:
  - id (string): ID du candidat

Returns: Données techniques et compétences du candidat.`,
  },
  {
    name: "administrative",
    tab: "administrative",
    title: "Données administratives d'un candidat",
    description: `Récupère les informations administratives d'un candidat.

Args:
  - id (string): ID du candidat

Returns: Données administratives du candidat.`,
  },
  {
    name: "actions",
    tab: "actions",
    title: "Actions liées à un candidat",
    description: `Récupère les actions (appels, emails, RDV, notes) associées à un candidat.

Args:
  - id (string): ID du candidat

Returns: Liste des actions liées au candidat.`,
  },
  {
    name: "positionings",
    tab: "positionings",
    title: "Positionnements d'un candidat",
    description: `Récupère les positionnements (placements sur des opportunités/projets) d'un candidat.

Args:
  - id (string): ID du candidat

Returns: Liste des positionnements du candidat.`,
  },
];

export function registerCandidateTools(server: McpServer): void {
  registerSearchTool(server, OPTS);
  registerGetTool(server, OPTS);

  registerCreateTool(server, OPTS, CandidateCreateSchema, (params) => {
    const { ...attrs } = params;
    return buildJsonApiBody("candidate", attrs);
  });

  registerUpdateTool(server, OPTS, CandidateUpdateSchema, (params) => {
    const { id, ...attrs } = params;
    return buildJsonApiBody("candidate", attrs, id as string);
  });

  registerDeleteTool(server, OPTS);

  // Register one tool per candidate tab
  for (const tab of CANDIDATE_TABS) {
    server.registerTool(
      `boond_candidates_${tab.name}`,
      {
        title: tab.title,
        description: tab.description,
        inputSchema: IdSchema,
        annotations: TAB_TOOL_ANNOTATIONS,
      },
      async (params: IdInput) => {
        const response = await apiRequest(`/candidates/${params.id}/${tab.tab}`);
        const text = formatDetailResponse(response);
        return {
          content: [{ type: "text" as const, text }],
        };
      }
    );
  }
}
