import { AsyncLocalStorage } from "node:async_hooks";
/**
 * Per-request context, populated by the HTTP transport before dispatching
 * to the MCP SDK and read by `oauthContextAuth` (boond-client) when an API
 * call is about to be issued. Stdio transport never uses this — it relies
 * on env-var credentials.
 */
export const oauthContext = new AsyncLocalStorage();
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
export function extractBearerToken(header) {
    if (!header)
        return null;
    const value = Array.isArray(header) ? header[0] : header;
    if (typeof value !== "string")
        return null;
    const trimmed = value.trim();
    // "Bearer x" minimum length — scheme (6) + separator (1) + 1-char token.
    if (trimmed.length < 8)
        return null;
    if (trimmed.slice(0, 6).toLowerCase() !== "bearer")
        return null;
    // RFC 6750 §2.1 specifies a single space, but be liberal: accept tab too
    // since plenty of clients tab-separate. Reject anything else (covers
    // "Bearer-something" and other accidental matches of the prefix).
    const sep = trimmed.charCodeAt(6);
    if (sep !== 0x20 /* SP */ && sep !== 0x09 /* HT */)
        return null;
    const token = trimmed.slice(7).trim();
    return token.length > 0 ? token : null;
}
/** Default BoondManager OAuth authorization server (issuer). */
export const DEFAULT_AUTHORIZATION_SERVER = "https://ui.boondmanager.com";
/**
 * Build an RFC 9728 *OAuth 2.0 Protected Resource Metadata* document.
 * Served at `/.well-known/oauth-protected-resource` (and the path-suffixed
 * variant matching MCP_HTTP_PATH) so MCP clients can auto-discover where
 * to send the user for authorization.
 */
export function buildProtectedResourceMetadata(opts) {
    const doc = {
        resource: opts.resource,
        authorization_servers: opts.authorizationServers,
        bearer_methods_supported: ["header"],
    };
    if (opts.scopesSupported && opts.scopesSupported.length > 0) {
        doc["scopes_supported"] = opts.scopesSupported;
    }
    return doc;
}
function envOrUndefined(key) {
    const v = process.env[key];
    if (!v || v.startsWith("${"))
        return undefined;
    return v;
}
/**
 * Resolve the authorization server URL surfaced in the discovery metadata.
 * Configurable so dedicated BoondManager instances (custom hostnames) can
 * advertise the right issuer.
 */
export function resolveAuthorizationServer() {
    return envOrUndefined("BOOND_OAUTH_AUTHORIZATION_SERVER") ?? DEFAULT_AUTHORIZATION_SERVER;
}
/**
 * Optional scope list advertised in the discovery metadata. Lets the MCP
 * client request appropriate scopes when initiating the OAuth flow.
 */
export function resolveAdvertisedScopes() {
    const raw = envOrUndefined("BOOND_OAUTH_SCOPES");
    if (!raw)
        return [];
    return raw.split(/[\s,]+/).filter((s) => s.length > 0);
}
//# sourceMappingURL=oauth.js.map