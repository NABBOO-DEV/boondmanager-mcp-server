import { registerSearchTool, registerGetTool } from "./crud-factory.js";
const OPTS = {
    entityName: "business unit",
    entityNamePlural: "business units",
    apiPath: "/business-units",
    prefix: "boond_business_units",
};
export function registerBusinessUnitTools(server) {
    registerSearchTool(server, OPTS);
    registerGetTool(server, OPTS, { withTab: false });
}
//# sourceMappingURL=business-units.js.map