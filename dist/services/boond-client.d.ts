import type { BoondAuthProvider, JsonApiResource, JsonApiResponse, SearchParams } from "../types.js";
/**
 * Auth provider for the HTTP transport: reads the Bearer token from the
 * per-request AsyncLocalStorage populated by the transport layer and
 * forwards it verbatim to BoondManager as `Authorization: Bearer …`.
 *
 * Errors out clearly if called outside a request context — which would
 * indicate that the transport layer forgot to wrap the request in
 * `oauthContext.run(...)`.
 */
export declare const oauthContextAuth: BoondAuthProvider;
/**
 * Build the BoondManager HS256 JWT. By default the payload is exactly
 * `{ userToken, clientToken }` (BoondManager's documented scheme). When
 * `expiresInSeconds` is provided, standard `iat`/`exp` claims are added so the
 * generated token is no longer replayable forever if it leaks — this requires
 * regenerating the token per request (see `jwtAuth`). Opt-in because not every
 * BoondManager deployment is known to honour `exp`.
 */
export declare function buildJwt(userToken: string, clientToken: string, clientKey: string, options?: {
    expiresInSeconds?: number;
    nowSeconds?: number;
}): string;
export declare const JWT_HEADER_NAME = "X-Jwt-Client-Boondmanager";
export declare function initClient(): void;
/**
 * True when env-based credentials (JWT components, API token, or BasicAuth) are
 * configured. Used by the HTTP transport to decide whether static-auth mode is
 * possible without attempting a full `initClient()` call.
 */
export declare function hasEnvCredentials(): boolean;
/**
 * Install a custom auth provider — used by the HTTP transport bootstrap to
 * wire in an OAuth2 token source (where the access token is refreshed
 * transparently per request rather than baked in at startup).
 */
export declare function initClientWithAuth(auth: BoondAuthProvider, baseUrl?: string): void;
/** Test helper — reset the cached config so the next call re-initialises. */
export declare function resetClientForTests(): void;
export type QueryValue = string | number | Array<string | number> | undefined;
/**
 * Pull the human-readable bits out of a BoondManager error body.
 *
 * Boond returns JSON:API errors of the form:
 *   { "errors": [ { "status": "422", "code": "422", "detail": "...", "title": "..." } ] }
 *
 * Surfacing `detail` (and `title` when present) gives the model a focused
 * message like `422 - password mismatch` instead of the full ~500-char body
 * dump that previously made it hard for the LLM to reason about the failure.
 *
 * Exported for unit testing.
 */
export declare function parseBoondErrorBody(body: string): string | null;
/**
 * Resolve the per-request HTTP timeout in milliseconds.
 *
 * Reads BOOND_HTTP_TIMEOUT_MS at call time so tests / runtime overrides take
 * effect without restarting the process. Falls back to the default for
 * unset, non-numeric, or non-positive values.
 *
 * Exported for unit testing.
 */
export declare function resolveTimeoutMs(): number;
export interface RetryConfig {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
}
/** Resolve retry configuration from env, with safe fallbacks. Exported for tests. */
export declare function resolveRetryConfig(): RetryConfig;
/**
 * Decide whether a failed attempt is worth retrying.
 *
 * Retry policy is intentionally conservative for non-idempotent verbs to avoid
 * silently duplicating writes when the server's response was lost or delayed:
 *   - 429 (Too Many Requests) is always retried — the server explicitly
 *     rejected the request before processing it, so it is safe regardless of
 *     verb.
 *   - For GET only, 5xx responses, network failures, and timeouts are retried
 *     because GET is idempotent.
 *   - 4xx responses (other than 429) are never retried — the client must change
 *     the request before another attempt makes sense.
 *
 * Exported for unit testing.
 */
export declare function isRetryable(method: string, status: number | undefined, isNetworkOrTimeout: boolean): boolean;
/**
 * Parse a `Retry-After` header value into milliseconds.
 *
 * Accepts either a non-negative number of seconds or an HTTP-date. Returns
 * null when the value is absent or unparseable. Negative computed delays are
 * clamped to 0. Exported for unit testing.
 */
export declare function parseRetryAfter(value: string | null, now?: number): number | null;
/**
 * Compute the next backoff delay using full jitter:
 *   delay = random(0, min(maxMs, baseMs * 2^attempt))
 *
 * Full jitter (vs. exponential-only) reduces thundering-herd risk when many
 * clients retry in lockstep. Exported for unit testing.
 */
export declare function computeBackoffMs(attempt: number, baseMs: number, maxMs: number, random?: () => number): number;
export interface RateLimitConfig {
    rps: number;
    burst: number;
}
/**
 * Read rate-limit env vars. `rps` of 0 (or non-numeric) disables rate
 * limiting entirely. `burst` falls back to `rps * 2` when unset, mirroring
 * the documented default behaviour. Exported for unit testing.
 */
export declare function resolveRateLimitConfig(): RateLimitConfig | null;
/**
 * Reset the cached rate limiter so the next request re-reads env vars.
 * Intended for tests that toggle `BOOND_HTTP_RATE_LIMIT_*` between cases.
 */
export declare function resetRateLimiterForTests(): void;
/** Build the Error message for a non-2xx HTTP response. Exported for testing. */
export declare function formatApiError(status: number, statusText: string, method: string, path: string, body: string): string;
/**
 * Defense-in-depth against path traversal / query injection through entity
 * ids interpolated into API paths at ~40 call sites. Even though the id
 * schemas are now numeric-only, a future tool could forget to validate, so we
 * assert here that the path is well-formed: it must start with `/`, carry no
 * query (`?`) or fragment (`#`) — those arrive via `queryParams`, never the
 * path — and contain no traversal (`..`) or percent/backslash escapes. Built
 * paths only ever combine static segments with numeric ids and hyphenated tab
 * names, so this rejects nothing legitimate. Exported for unit testing.
 */
export declare function assertSafeApiPath(path: string): void;
/**
 * Validates `path` and resolves it against `baseUrl`, returning the
 * constructed URL. Throws if the path is unsafe (see `assertSafeApiPath`) or
 * if the resolved URL escapes the configured API base origin/path. Centralises
 * the guard shared by apiRequest / apiDownload / apiUploadForm. Exported for
 * unit testing.
 */
export declare function resolveApiUrl(baseUrl: string, path: string): URL;
export declare function apiRequest(path: string, method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown, queryParams?: Record<string, QueryValue>): Promise<JsonApiResponse>;
/**
 * Parse the filename out of a `Content-Disposition` header. Handles the
 * common `filename="…"`/`filename=…` forms and the RFC 5987
 * `filename*=UTF-8''…` form. Returns undefined when absent. Exported for
 * unit testing.
 */
export declare function parseContentDispositionFilename(header: string | null): string | undefined;
export interface DownloadedDocument {
    data: Buffer;
    contentType: string;
    filename?: string;
}
/**
 * Download a binary payload (documents, justificatifs…) from the BoondManager
 * API. Same auth/safety/rate-limit plumbing as `apiRequest`, but the body is
 * returned raw instead of being parsed as JSON:API. Single attempt: document
 * downloads are interactive one-offs, not worth a retry loop.
 */
export declare function apiDownload(path: string): Promise<DownloadedDocument>;
/**
 * Guard for the single sanctioned POST of this read-only fork (see
 * `apiExtractBiSql`): assert that `sql` is one read-only SELECT statement.
 *
 * BoondManager already rejects non-SELECT statements server-side on
 * `/apps/extractbi/test` (probed: UPDATE/DELETE → 422 before execution), so
 * this is defense in depth, mirroring the GET-only guard philosophy: even if
 * the server-side validation regressed, no write could be smuggled through.
 * Exported for unit testing.
 */
export declare function assertReadOnlySql(sql: string): void;
/** Result of an ad-hoc ExtractBI SQL execution. */
export interface ExtractBiSqlResult {
    isValid: boolean;
    preview: Array<Record<string, unknown>>;
    /** Total row count before the server's 10-row preview cap (when reported). */
    total?: number;
}
/**
 * READ-ONLY FORK (NABBOO-DEV): the single sanctioned POST. BoondManager's
 * `/apps/extractbi/test` endpoint executes an ad-hoc **SELECT** and returns a
 * preview (max 10 rows, LIMIT/OFFSET rewritten server-side). Although the HTTP
 * verb is POST, the operation is semantically a read: the server refuses any
 * non-SELECT statement at validation time (probed), and `assertReadOnlySql`
 * re-checks client-side. The path is hard-wired — this function cannot be
 * repurposed to reach any other endpoint — and `apiRequest` stays GET-only.
 */
export declare function apiExtractBiSql(sql: string): Promise<ExtractBiSqlResult>;
/**
 * POST a multipart/form-data payload to the BoondManager API (document
 * upload). Form values are simple string fields — the file itself travels by
 * reference via the `fileUrl` field (Boond downloads it server-side), so the
 * MCP server never buffers file bytes.
 */
export declare function apiUploadForm(path: string, _fields: Record<string, string>): Promise<JsonApiResponse>;
export declare function buildSearchQuery(params: SearchParams): Record<string, QueryValue>;
export declare function formatEntitySummary(entity: unknown): string;
/**
 * Index the `included` array by `type:id` → label. BoondManager returns related
 * entities inline (JSON:API `included`); this turns them into a fast lookup so
 * relationship refs can be resolved to names in the SAME response.
 */
export declare function buildIncludedIndex(included?: JsonApiResource[]): Map<string, string>;
/**
 * Return a copy of `relationships` where each `data` ref (single or array) is
 * enriched with its `label` from the included index. Untouched when there is
 * nothing to resolve, so the guard is free on responses without `included`.
 */
export declare function enrichRelationships(relationships: JsonApiResource["relationships"], index: Map<string, string>): JsonApiResource["relationships"];
export declare function formatListResponse(response: JsonApiResponse, entityType: string, fields?: string[]): string;
/**
 * Formate la réponse d'un endpoint d'onglet (ex: /resources/{id}/positionings).
 * Contrairement à formatDetailResponse, un tableau est restitué en entier :
 * certains onglets renvoient plusieurs entités (positionnements, contacts...)
 * et n'afficher que la première masquait les autres.
 */
export declare function formatTabResponse(response: JsonApiResponse): string;
export declare function formatDetailResponse(response: JsonApiResponse): string;
//# sourceMappingURL=boond-client.d.ts.map