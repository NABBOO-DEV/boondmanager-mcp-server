import { REGISTERED_DOMAINS } from "../constants.js";
import { logger } from "../services/logger.js";
export const ALL_OPERATIONS = ["read", "create", "update", "delete"];
// --- Env parsing helpers (mirroring the patterns already used across the
// codebase: see transports/http.ts, services/oauth.ts, services/update-checker.ts) ---
function readEnv(env, key) {
    const raw = env[key];
    if (raw === undefined)
        return undefined;
    // Ignore unresolved placeholders like "${SOMETHING}" (same guard as http.ts).
    if (raw.startsWith("${"))
        return undefined;
    return raw;
}
/** Split a CSV / whitespace-separated env value into trimmed, non-empty tokens. */
function parseList(raw) {
    if (!raw)
        return [];
    return raw
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
/** Normalise a user-supplied domain to the canonical (dash, lowercase) form. */
function normalizeDomain(domain) {
    return domain.toLowerCase().trim().replace(/_/g, "-");
}
function normalizeAndValidateDomains(items, known, varName, log) {
    const out = new Set();
    for (const raw of items) {
        const norm = normalizeDomain(raw);
        if (known.has(norm)) {
            out.add(norm);
        }
        else {
            log.warn({ value: raw, normalized: norm, var: varName }, `${varName}: unknown domain "${raw}" ignored (not one of the ${known.size} known domains)`);
        }
    }
    return out;
}
/**
 * Build the effective access policy from the environment. Resilient: unknown
 * domains/operations are warned-and-ignored, never fatal.
 */
export function resolveAccessPolicy(env = process.env) {
    const log = logger.child({ component: "access-policy" });
    const known = new Set(REGISTERED_DOMAINS);
    // --- Domains ---
    const allowItems = parseList(readEnv(env, "BOOND_MCP_DOMAINS"));
    const excludeItems = parseList(readEnv(env, "BOOND_MCP_EXCLUDE_DOMAINS"));
    const allowedDomains = allowItems.length > 0 ? normalizeAndValidateDomains(allowItems, known, "BOOND_MCP_DOMAINS", log) : null;
    const excludedDomains = normalizeAndValidateDomains(excludeItems, known, "BOOND_MCP_EXCLUDE_DOMAINS", log);
    // --- Operations: READ-ONLY FORK (NABBOO-DEV) hard invariant ----------------
    // This fork NEVER exposes write tools. `operations` is hard-wired to {read},
    // so withPolicy() never registers create/update/delete tools — and no env var
    // (BOOND_MCP_OPERATIONS / BOOND_MCP_READ_ONLY) can re-enable them. The HTTP
    // client (services/boond-client.ts) additionally refuses any non-GET request
    // as an immutable backstop. Domain filtering (BOOND_MCP_DOMAINS) still applies.
    const operations = new Set(["read"]);
    const policy = { allowedDomains, excludedDomains, operations };
    // --- Surface the effective policy + a guard-rail warning for `application` ---
    const restricted = allowedDomains !== null || excludedDomains.size > 0 || operations.size !== ALL_OPERATIONS.length;
    if (restricted) {
        if (!isDomainAllowed(policy, "application")) {
            log.warn("Domain `application` is filtered out; dictionary lookups (state/type labels) and current-user resolution will be unavailable, degrading many tools/resources");
        }
        log.info({
            allowedDomains: allowedDomains ? [...allowedDomains] : "all",
            excludedDomains: [...excludedDomains],
            operations: [...operations],
        }, "Access policy active: the exposed tool/prompt surface is restricted");
    }
    return policy;
}
/** Is a business domain allowed by the policy? (deny-list wins over allow-list.) */
export function isDomainAllowed(policy, domain) {
    const norm = normalizeDomain(domain);
    if (policy.excludedDomains.has(norm))
        return false;
    if (policy.allowedDomains !== null && !policy.allowedDomains.has(norm))
        return false;
    return true;
}
/**
 * Classify a tool into a single operation from its MCP annotations.
 * Order matters: read-only first, then destructive (delete), then idempotent
 * writes (update), else non-idempotent writes (create). A tool with no
 * `readOnlyHint:true` is treated as a write (the safe default in read-only mode).
 */
export function operationOf(annotations) {
    if (annotations?.readOnlyHint === true)
        return "read";
    if (annotations?.destructiveHint === true)
        return "delete";
    if (annotations?.idempotentHint === true)
        return "update";
    return "create";
}
/** Is a tool (by its annotations) allowed under the policy's operation set? */
export function isOperationAllowed(policy, annotations) {
    return policy.operations.has(operationOf(annotations));
}
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
export function withPolicy(server, policy) {
    if (policy.operations.size === ALL_OPERATIONS.length)
        return server;
    return new Proxy(server, {
        get(target, prop) {
            // receiver = target so any getters/private fields resolve against the real instance.
            const value = Reflect.get(target, prop, target);
            if (typeof value !== "function")
                return value;
            if (prop === "registerTool") {
                return (...args) => {
                    const config = args[1];
                    if (!isOperationAllowed(policy, config?.annotations)) {
                        return undefined; // skip registration; callers ignore the return value
                    }
                    return value.apply(target, args);
                };
            }
            // Bind every other method to the real target (avoids private-field errors
            // that occur when an unbound method runs with `this` = Proxy).
            return value.bind(target);
        },
    });
}
//# sourceMappingURL=access-policy.js.map