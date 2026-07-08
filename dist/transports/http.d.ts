import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export interface HttpTransportOptions {
    host: string;
    port: number;
    path: string;
    stateless: boolean;
    enableJsonResponse: boolean;
    /** Idle timeout for stateful sessions, in ms. Defaults to 30 min. */
    sessionTtlMs?: number;
    /** How often to sweep idle sessions, in ms. Defaults to 5 min. */
    sessionSweepIntervalMs?: number;
    /** Max concurrent stateful sessions before new inits are rejected with 503. */
    maxSessions?: number;
    /**
     * Allow-list of Host header hostnames (port-agnostic) for DNS rebinding
     * protection. Empty array = validation disabled. Use `["*"]` to opt out
     * explicitly. When undefined, a localhost default is applied if bound
     * to a loopback interface.
     */
    allowedHosts?: string[];
    /**
     * Public URL clients use to reach this MCP endpoint — used as the
     * `resource` field of the protected-resource metadata and in the
     * `WWW-Authenticate` challenge. Defaults to `http://{host}:{port}{path}`
     * which is only correct for local / loopback deployments. Behind a
     * reverse proxy, set `MCP_HTTP_PUBLIC_URL` explicitly.
     */
    publicUrl?: string;
    /**
     * Skip the OAuth2 Bearer check and use the env-based credentials configured
     * via `initClient()` (BOOND_USER_TOKEN + BOOND_CLIENT_TOKEN + BOOND_CLIENT_KEY,
     * or BOOND_API_TOKEN, or BasicAuth). Intended for single-tenant / self-hosted
     * deployments where the operator owns both the server and the credentials.
     * Set `BOOND_HTTP_STATIC_AUTH=true` to enable via `resolveHttpOptions()`.
     */
    staticAuth?: boolean;
}
export interface HttpServerHandle {
    close: () => Promise<void>;
    address: {
        host: string;
        port: number;
        path: string;
    };
    /** Current count of live stateful sessions (always 0 in stateless mode). */
    sessionCount: () => number;
    /** Manually trigger an idle sweep; returns the number of sessions reaped. */
    sweepIdleSessions: () => Promise<number>;
}
/**
 * Resolves the effective Host header allow-list given user options and the
 * bound listen interface. Returns an empty array when validation is disabled
 * (either explicitly via `["*"]` or implicitly when bound to a non-loopback
 * interface without an explicit list).
 */
export declare function resolveAllowedHosts(configured: string[] | undefined, host: string): string[];
export declare function resolveHttpOptions(): HttpTransportOptions;
export declare function startHttpTransport(createServerFactory: () => McpServer, options: HttpTransportOptions): Promise<HttpServerHandle>;
//# sourceMappingURL=http.d.ts.map