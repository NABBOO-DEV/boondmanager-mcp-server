import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DomainName } from "../constants.js";
import { type AccessPolicy } from "../config/access-policy.js";
export interface PromptDefinition {
    name: string;
    title: string;
    description: string;
    argsSchema: z.ZodRawShape;
    /**
     * Business domains this prompt's runbook orchestrates. Used by the access
     * policy: the prompt (and its mirror workflow tool in `tools/workflows.ts`)
     * is cut when ANY of these domains is filtered out, so a surfaced runbook
     * never points the model at tools that aren't registered. Optional
     * name-resolution helpers (e.g. resolving a manager name via
     * `boond_resources_search`) are intentionally NOT listed: if their domain
     * is filtered, the user simply passes a numeric id instead.
     */
    domains: readonly DomainName[];
    build: (args: Record<string, string | undefined>) => string;
}
export declare const PROMPTS: PromptDefinition[];
export declare function registerAllPrompts(server: McpServer, policy?: AccessPolicy): void;
/** Exposed for tests so we can assert names/coverage without instantiating a server. */
export declare const REGISTERED_PROMPTS: {
    name: string;
    title: string;
    description: string;
    argKeys: string[];
}[];
//# sourceMappingURL=index.d.ts.map