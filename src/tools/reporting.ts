import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SearchSchema } from "../schemas/index.js";
import { apiRequest, buildSearchQuery, formatListResponse } from "../services/boond-client.js";

export function registerReportingTools(server: McpServer): void {
  const reportingEndpoints = [
    { name: "companies", path: "/reporting-companies", title: "Reporting sociétés", description: "Recherche le reporting des sociétés (CA, marge, activité...).", entity: "reporting société" },
    { name: "projects", path: "/reporting-projects", title: "Reporting projets", description: "Recherche le reporting des projets (CA, marge, rentabilité...).", entity: "reporting projet" },
    { name: "resources", path: "/reporting-resources", title: "Reporting ressources", description: "Recherche le reporting des ressources (taux d'occupation, CA, productivité...).", entity: "reporting ressource" },
    { name: "synthesis", path: "/reporting-synthesis", title: "Reporting synthèse", description: "Recherche le reporting de synthèse globale.", entity: "reporting synthèse" },
    { name: "production_plans", path: "/reporting-production-plans", title: "Reporting plans de production", description: "Recherche le reporting des plans de production.", entity: "reporting plan de production" },
  ];

  for (const ep of reportingEndpoints) {
    server.registerTool(
      `boond_reporting_${ep.name}`,
      {
        title: ep.title,
        description: `${ep.description}

Args:
  - keywords (string, optional): Termes de recherche
  - page, pageSize: Pagination

Returns: Données de reporting.`,
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
        const response = await apiRequest(ep.path, "GET", undefined, query);
        return {
          content: [{ type: "text" as const, text: formatListResponse(response, ep.entity) }],
        };
      }
    );
  }
}
