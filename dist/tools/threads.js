import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "fil de discussion",
    entityNamePlural: "fils de discussion",
    apiPath: "/threads",
    prefix: "boond_threads",
};
export function registerThreadTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=threads.js.map