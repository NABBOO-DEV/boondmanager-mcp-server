import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { JsonApiResponse } from "../types.js";
interface CrudToolOptions {
    entityName: string;
    entityNamePlural: string;
    apiPath: string;
    prefix: string;
}
interface SearchToolOverrides {
    schema?: z.ZodType;
    title?: string;
    description?: string;
}
export declare const SearchOutputSchema: z.ZodObject<{
    total: z.ZodOptional<z.ZodNumber>;
    count: z.ZodNumber;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const MutationOutputSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const DeleteOutputSchema: z.ZodObject<{
    id: z.ZodString;
    deleted: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Build the compact structured payload for a search result page. Exported for unit testing. */
export declare function buildListStructured(response: JsonApiResponse, fields?: string[]): z.infer<typeof SearchOutputSchema>;
/**
 * Ask the end user to confirm a destructive delete through MCP elicitation
 * (spec 2025-06-18). Clients that don't declare the `elicitation` capability
 * keep the legacy behaviour (delete proceeds — `destructiveHint` already lets
 * hosts gate the call). A failed elicitation round-trip (e.g. stateless HTTP
 * quirks) also falls back to legacy rather than breaking deletes; only an
 * explicit decline/cancel/`confirm=false` aborts.
 */
export declare function confirmDeletion(server: McpServer, entityName: string, id: string): Promise<{
    confirmed: boolean;
    reason?: string;
}>;
export declare function registerSearchTool(server: McpServer, opts: CrudToolOptions, overrides?: SearchToolOverrides): void;
interface GetToolOverrides {
    /**
     * When false, registers a plain id-only get tool (no `tab` parameter).
     * Use for reference/admin domains that have no tab endpoints. Defaults to
     * true (tab-aware), as used by the major entities.
     */
    withTab?: boolean;
    title?: string;
    description?: string;
}
export declare function registerGetTool(server: McpServer, opts: CrudToolOptions, overrides?: GetToolOverrides): void;
export declare function registerCreateTool(server: McpServer, opts: CrudToolOptions, schema: z.ZodType, buildBody: (params: Record<string, unknown>) => unknown): void;
interface UpdateToolOverrides {
    /** HTTP verb for the update call. A few BoondManager endpoints expect PUT
     * (e.g. /expenses-reports) rather than the JSON:API-conventional PATCH. */
    method?: "PATCH" | "PUT";
    /** Sub-resource segment appended to `${apiPath}/${id}` for the update call
     * (e.g. "information" → PUT /opportunities/{id}/information). Some entities
     * only accept updates on their `/information` sub-resource and return 405 on
     * PATCH/PUT against the base resource (see issue #124). */
    pathSuffix?: string;
}
export declare function registerUpdateTool(server: McpServer, opts: CrudToolOptions, schema: z.ZodType, buildBody: (params: Record<string, unknown>) => unknown, overrides?: UpdateToolOverrides): void;
interface DeleteToolOverrides {
    title?: string;
    description?: string;
}
export declare function registerDeleteTool(server: McpServer, opts: CrudToolOptions, overrides?: DeleteToolOverrides): void;
/**
 * Builds a JSON:API `{ data: { type, attributes[, id][, relationships] } }`
 * payload. `undefined` attributes are dropped (so PATCH only touches the
 * fields the caller actually supplied). `relationships` maps a relation name
 * to a `{ id, type }` resource identifier and is wrapped in the JSON:API
 * `{ data: ... }` envelope; entries are skipped when their value is undefined.
 */
export declare function buildJsonApiBody(type: string, attributes: Record<string, unknown>, id?: string, relationships?: Record<string, {
    id: string;
    type: string;
} | undefined>): unknown;
export {};
//# sourceMappingURL=crud-factory.d.ts.map