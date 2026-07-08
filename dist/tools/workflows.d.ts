import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type AccessPolicy } from "../config/access-policy.js";
/**
 * Workflow tools — same runbooks as the MCP prompts in `src/prompts/index.ts`,
 * but exposed via `tools/list` instead of `prompts/list`.
 *
 * Why both? Some MCP clients (notably claude.ai's "Cowork" connector menu)
 * mishandle the `prompts/get` response: instead of injecting the returned
 * user message into the conversation, they treat it as a virtual file
 * attachment named `{prompt_name}_text` and the model then tries to `Read`
 * it from the uploads folder, finds nothing, and asks the user to upload
 * the file. Tools, on the other hand, are universally well-supported:
 * the result content is fed back into the model the same way as any
 * other tool call.
 *
 * Implementation: each prompt is mirrored 1:1 as a tool that calls the
 * same `build()` function. Tool name pattern: `boond_workflow_{prompt_name}`.
 * Same args, same output. The runbook returned in the tool result is
 * exactly the text the prompt would have produced.
 */
export declare function registerWorkflowTools(server: McpServer, policy?: AccessPolicy): void;
//# sourceMappingURL=workflows.d.ts.map