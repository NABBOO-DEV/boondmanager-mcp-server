import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "calendrier",
    entityNamePlural: "calendriers",
    apiPath: "/calendars",
    prefix: "boond_calendars",
};
export function registerCalendarTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=calendars.js.map