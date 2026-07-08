import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "webhook",
    entityNamePlural: "webhooks",
    apiPath: "/webhooks",
    prefix: "boond_webhooks",
};
export function registerWebhookTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=webhooks.js.map