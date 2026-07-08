import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "agence",
    entityNamePlural: "agences",
    apiPath: "/agencies",
    prefix: "boond_agencies",
};
export function registerAgencyTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=agencies.js.map