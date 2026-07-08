import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DomainName } from "./constants.js";
import { type AccessPolicy } from "./config/access-policy.js";
export { REGISTERED_DOMAINS } from "./constants.js";
export type { DomainName } from "./constants.js";
export declare const SERVER_NAME = "boondmanager-mcp-server";
export declare const SERVER_VERSION: string;
/**
 * Domain → registration function, in the canonical order of REGISTERED_DOMAINS.
 * Coupling the domain name to its registrar lets the access policy filter by
 * domain WITHOUT parsing tool names (no fragile regex on multi-word domains
 * like `provider-invoices`). Each registrar accepts an optional policy; only
 * `registerWorkflowTools` uses it (to mirror the prompt-level domain filter),
 * the others ignore the extra argument.
 *
 * Exported so the TOOLS.md generator can reuse the exact same list/order
 * instead of duplicating it.
 */
export declare const TOOL_REGISTRARS: ReadonlyArray<readonly [DomainName, (server: McpServer, policy?: AccessPolicy) => void]>;
/**
 * Register the full (policy-filtered) tool/prompt/resource surface onto a
 * server. Extracted from createMcpServer so tests can exercise the exact same
 * wiring against a stub server with an arbitrary policy.
 *
 * - `target` is either the server itself (no operation filter) or a Proxy that
 *   drops disallowed-operation tools at registration time.
 * - Tool domains are skipped wholesale when the domain is disallowed.
 * - Prompts are domain-filtered (a prompt is cut if any domain it orchestrates
 *   is disallowed, so the runbook never points at missing tools).
 * - Resources (reference dictionaries) are left intact (the lookup substrate).
 */
export declare function registerAll(server: McpServer, policy: AccessPolicy): void;
export declare function createMcpServer(): McpServer;
//# sourceMappingURL=server.d.ts.map