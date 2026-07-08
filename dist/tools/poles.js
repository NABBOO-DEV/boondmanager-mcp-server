import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "pôle",
    entityNamePlural: "pôles",
    apiPath: "/poles",
    prefix: "boond_poles",
};
export function registerPoleTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=poles.js.map