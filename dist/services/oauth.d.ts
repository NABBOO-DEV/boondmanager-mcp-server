import { AsyncLocalStorage } from "node:async_hooks";
/**
 * OAuth2 plumbing for the HTTP transport.
 *
 * Architecture (corrected): the MCP server is a **OAuth2 protected resource**,
 * not an OAuth client. The MCP client (Claude Desktop, Claude Code, an MCP
 * gateway, …) performs the OAuth dance against BoondManager directly,
 * receives an access token, and forwards it as `Authorization: Bearer <token>`
 * on every MCP request. This server:
 *
 *   1. Validates the presence of a Bearer token on every request.
 *   2. Stores it in a per-request AsyncLocalStorage context.
 *   3. Forwards it verbatim when calling the BoondManager API
 *      (boond-client.ts reads the context via `oauthContextAuth`).
 *   4. Publishes RFC 9728 protected-resource metadata at
 *      `/.well-known/oauth-protected-resource` so MCP clients can discover
 *      the authorization server (BoondManager) automatically.
 *
 * The server holds **no secrets** related to OAuth: no client_secret, no
 * refresh token, no token store. Each user's session lives entirely on the
 * MCP client side. Multi-tenant by construction — each MCP user's Boond
 * actions are attributed to *that* user in Boond's audit log.
 */
export interface OAuthRequestContext {
    /** Bearer access token received from the MCP client (forwarded verbatim to Boond). */
    accessToken: string;
}
/**
 * Per-request context, populated by the HTTP transport before dispatching
 * to the MCP SDK and read by `oauthContextAuth` (boond-client) when an API
 * call is about to be issued. Stdio transport never uses this — it relies
 * on env-var credentials.
 */
export declare const oauthContext: AsyncLocalStorage<OAuthRequestContext>;
/**
 * Extract a Bearer token from an HTTP `Authorization` header.
 * Returns `null` for missing, malformed, or non-Bearer auth schemes.
 *
 * Implemented with plain string operations rather than a regex to stay
 * O(n) on hostile inputs (e.g. an `Authorization` header full of spaces).
 * A naive `/^Bearer\s+(.+)$/i` is flagged by CodeQL `js/polynomial-redos`
 * because the greedy `\s+` and `.+` can backtrack against each other on
 * adversarial whitespace-only suffixes. The implementation below has no
 * backtracking surface.
 */
export declare function extractBearerToken(header: string | string[] | undefined): string | null;
/** Default BoondManager OAuth authorization server (issuer). */
export declare const DEFAULT_AUTHORIZATION_SERVER = "https://ui.boondmanager.com";
export interface ProtectedResourceMetadataOptions {
    /** Canonical URL of this protected resource — e.g. `https://mcp.example.com/mcp`. */
    resource: string;
    /** Issuer URL(s) of the authorization server — e.g. `https://ui.boondmanager.com`. */
    authorizationServers: string[];
    /** Optional scope hints exposed to MCP clients. */
    scopesSupported?: string[];
}
/**
 * Build an RFC 9728 *OAuth 2.0 Protected Resource Metadata* document.
 * Served at `/.well-known/oauth-protected-resource` (and the path-suffixed
 * variant matching MCP_HTTP_PATH) so MCP clients can auto-discover where
 * to send the user for authorization.
 */
export declare function buildProtectedResourceMetadata(opts: ProtectedResourceMetadataOptions): Record<string, unknown>;
/**
 * Resolve the authorization server URL surfaced in the discovery metadata.
 * Configurable so dedicated BoondManager instances (custom hostnames) can
 * advertise the right issuer.
 */
export declare function resolveAuthorizationServer(): string;
/**
 * Optional scope list advertised in the discovery metadata. Lets the MCP
 * client request appropriate scopes when initiating the OAuth flow.
 */
export declare function resolveAdvertisedScopes(): string[];
//# sourceMappingURL=oauth.d.ts.map