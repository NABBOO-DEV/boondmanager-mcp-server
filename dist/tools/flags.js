import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "drapeau",
    entityNamePlural: "drapeaux",
    apiPath: "/flags",
    prefix: "boond_flags",
};
export function registerFlagTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=flags.js.map