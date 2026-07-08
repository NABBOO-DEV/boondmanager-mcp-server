import { apiRequest } from "./boond-client.js";
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour
function resolveTtlMs() {
    const raw = process.env["BOOND_DICTIONARY_TTL_MS"];
    if (!raw)
        return DEFAULT_TTL_MS;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_TTL_MS;
}
let cache = null;
let inFlight = null;
/**
 * Returns the full BoondManager dictionary payload, fetching once per TTL.
 * Concurrent calls share the same in-flight request.
 */
export async function getDictionary(opts = {}) {
    const language = opts.language ?? "fr";
    const now = Date.now();
    if (!opts.force && cache !== null && cache.language === language && now - cache.fetchedAt < resolveTtlMs()) {
        return cache;
    }
    if (inFlight)
        return inFlight;
    inFlight = (async () => {
        try {
            const payload = await apiRequest("/application/dictionary", "GET", undefined, {
                language,
            });
            cache = { payload, fetchedAt: Date.now(), language };
            return cache;
        }
        finally {
            inFlight = null;
        }
    })();
    return inFlight;
}
/**
 * Resolves a dotted path inside the dictionary `data` object.
 *
 * Examples:
 *   "setting.state.resource"       → array of resource states
 *   "setting.tool"                 → array of tools / technos
 *   "country"                      → array of countries
 *   "languages"                    → array of UI languages
 *   "setting.state.resource[0]"    → not supported (no bracket notation; pass plain dotted path)
 *
 * Returns `undefined` if any segment is missing.
 */
export function resolveDictionaryPath(payload, path) {
    const trimmed = path.trim();
    if (!trimmed)
        return undefined;
    const parts = trimmed.split(".");
    // The dictionary payload is `{ meta, data: { setting, country, languages, ... } }`.
    // We always look under `data` so callers don't have to repeat it.
    const root = payload.data;
    let node = root ?? payload;
    for (const part of parts) {
        if (node === null || typeof node !== "object")
            return undefined;
        node = node[part];
        if (node === undefined)
            return undefined;
    }
    return node;
}
/** Reset the cache. Exposed for tests. */
export function resetDictionaryCacheForTests() {
    cache = null;
    inFlight = null;
}
//# sourceMappingURL=dictionary.js.map