import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
/** Exposed for tests; lets us assert the catalog without booting a server. */
export declare const REGISTERED_RESOURCES: {
    name: string;
    uri: string;
    title: string;
}[];
export declare function registerAllResources(server: McpServer): void;
//# sourceMappingURL=index.d.ts.map