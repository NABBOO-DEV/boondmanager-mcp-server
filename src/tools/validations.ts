import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { IdSchema, SearchSchema } from "../schemas/index.js";
import { apiRequest, buildSearchQuery, formatListResponse, formatDetailResponse } from "../services/boond-client.js";

export function registerValidationTools(server: McpServer): void {
  server.registerTool(
    "boond_validations_search",
    {
      title: "Rechercher des validations",
      description: `Recherche des validations en attente dans BoondManager (absences, notes de frais, feuilles de temps...).

Returns: Liste des validations correspondantes.`,
      inputSchema: SearchSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      const query = buildSearchQuery(params);
      const response = await apiRequest("/validations", "GET", undefined, query);
      return {
        content: [{ type: "text" as const, text: formatListResponse(response, "validation") }],
      };
    }
  );

  server.registerTool(
    "boond_validations_get",
    {
      title: "Détails d'une validation",
      description: `Récupère les informations détaillées d'une validation par son ID.`,
      inputSchema: IdSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const response = await apiRequest(`/validations/${params.id}`);
      return {
        content: [{ type: "text" as const, text: formatDetailResponse(response) }],
      };
    }
  );
}
