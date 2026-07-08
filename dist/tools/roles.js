import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "rôle",
    entityNamePlural: "rôles",
    apiPath: "/roles",
    prefix: "boond_roles",
};
export function registerRoleTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=roles.js.map