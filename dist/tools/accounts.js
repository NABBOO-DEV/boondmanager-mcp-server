import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "compte utilisateur",
    entityNamePlural: "comptes utilisateurs",
    apiPath: "/accounts",
    prefix: "boond_accounts",
};
export function registerAccountTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=accounts.js.map