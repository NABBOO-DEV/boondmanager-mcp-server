import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DictionaryGetSchema } from "../schemas/index.js";
import type { DictionaryGetInput } from "../schemas/index.js";
import { apiRequest, formatDetailResponse } from "../services/boond-client.js";

export function registerApplicationTools(server: McpServer): void {
  // Get dictionary
  server.registerTool(
    "boond_application_dictionary",
    {
      title: "Récupérer un dictionnaire BoondManager",
      description: `Récupère un dictionnaire de référence de l'application BoondManager (types d'actions, types d'absences, états des entités, pays, devises, langues...).

Args:
  - dictionaryType (string): Type de dictionnaire. Exemples :
    - "typeOf/actions" : types d'actions
    - "typeOf/absences" : types d'absences
    - "typeOf/expenses" : types de frais
    - "states/candidates" : états des candidats
    - "states/resources" : états des ressources
    - "states/opportunities" : états des opportunités
    - "states/projects" : états des projets
    - "states/invoices" : états des factures
    - "states/orders" : états des bons de commande
    - "countries" : liste des pays
    - "currencies" : liste des devises
    - "languages" : liste des langues

Returns: Données du dictionnaire (clé/valeur).`,
      inputSchema: DictionaryGetSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: DictionaryGetInput) => {
      const response = await apiRequest(`/application/dictionaries/${params.dictionaryType}`);
      const text = formatDetailResponse(response);
      return {
        content: [{ type: "text" as const, text }],
      };
    }
  );

  // Get current user / application info
  server.registerTool(
    "boond_application_current_user",
    {
      title: "Utilisateur courant BoondManager",
      description: `Récupère les informations de l'utilisateur actuellement connecté à l'API BoondManager (profil, permissions, agence...).

Returns: Données JSON de l'utilisateur courant.`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const response = await apiRequest("/application/current-user");
      const text = formatDetailResponse(response);
      return {
        content: [{ type: "text" as const, text }],
      };
    }
  );
}
