import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "todolist",
    entityNamePlural: "todolists",
    apiPath: "/todolists",
    prefix: "boond_todolists",
};
export function registerTodolistTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=todolists.js.map