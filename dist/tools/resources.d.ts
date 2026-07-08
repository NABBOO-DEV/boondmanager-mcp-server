import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export declare function mergeTechnicalData(current: Record<string, unknown>, input: Record<string, unknown>): Record<string, unknown>;
type EmbeddedReference = Record<string, unknown> & {
    id?: string | number;
};
export declare function normalizeReferenceForApi(ref: EmbeddedReference): EmbeddedReference;
export declare function registerResourceTools(server: McpServer): void;
export {};
//# sourceMappingURL=resources.d.ts.map