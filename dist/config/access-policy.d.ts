import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
/**
 * Access policy: operator-side restriction of what the MCP server exposes,
 * driven entirely by environment variables. Two orthogonal axes:
 *
 *  1. Domain filtering (allow-list + deny-list): restrict the server to a
 *     subset of business domains (e.g. accounting only).
 *  2. Operation filtering: restrict which kinds of action are exposed
 *     (`read` / `create` / `update` / `delete`), e.g. read-only mode.
 *
 * ⚠️ This is NOT a hard security boundary. The server keeps using the
 * configured BoondManager credentials; if those credentials may write, this
 * filter only HIDES the tools from the model; it does not revoke anything
 * API-side. The real boundary is the BoondManager account/role rights. The
 * two are complementary: Boond rights = hard wall; this filter = ergonomics,
 * token economy, and a guard-rail against accidental actions.
 *
 * Env vars (all optional; absent = no restriction = current behaviour):
 *  - `BOOND_MCP_DOMAINS`         CSV allow-list of domains. Absent = all.
 *  - `BOOND_MCP_EXCLUDE_DOMAINS` CSV deny-list. Applied AFTER the allow-list.
 *  - `BOOND_MCP_OPERATIONS`      CSV of `read,create,update,delete`. Absent = all.
 *  - `BOOND_MCP_READ_ONLY`       Boolean shortcut, equivalent to OPERATIONS=read.
 */
export type Operation = "read" | "create" | "update" | "delete";
export declare const ALL_OPERATIONS: readonly Operation[];
/** Subset of the MCP tool annotations we use to classify a tool's operation. */
export interface ToolAnnotations {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
}
export interface AccessPolicy {
    /** `null` = all domains allowed (no allow-list). Otherwise the set of allowed canonical (dash) domain names. */
    allowedDomains: Set<string> | null;
    /** Canonical (dash) domain names explicitly denied. Applied after the allow-list. */
    excludedDomains: Set<string>;
    /** Operations the server is allowed to expose. */
    operations: Set<Operation>;
}
/**
 * Build the effective access policy from the environment. Resilient: unknown
 * domains/operations are warned-and-ignored, never fatal.
 */
export declare function resolveAccessPolicy(env?: NodeJS.ProcessEnv): AccessPolicy;
/** Is a business domain allowed by the policy? (deny-list wins over allow-list.) */
export declare function isDomainAllowed(policy: AccessPolicy, domain: string): boolean;
/**
 * Classify a tool into a single operation from its MCP annotations.
 * Order matters: read-only first, then destructive (delete), then idempotent
 * writes (update), else non-idempotent writes (create). A tool with no
 * `readOnlyHint:true` is treated as a write (the safe default in read-only mode).
 */
export declare function operationOf(annotations: ToolAnnotations | undefined): Operation;
/** Is a tool (by its annotations) allowed under the policy's operation set? */
export declare function isOperationAllowed(policy: AccessPolicy, annotations: ToolAnnotations | undefined): boolean;
/**
 * Wrap an McpServer so that `registerTool` silently drops tools whose operation
 * is not allowed by the policy. Implemented as a Proxy (no mutation of the
 * instance, typing preserved). Methods are bound to the real target so the
 * SDK's private fields keep working. Other methods (`registerPrompt`,
 * `registerResource`, …) pass straight through.
 *
 * Fast path: when all operations are allowed, the original server is returned
 * untouched (zero overhead in the default, unrestricted case).
 */
export declare function withPolicy(server: McpServer, policy: AccessPolicy): McpServer;
//# sourceMappingURL=access-policy.d.ts.map