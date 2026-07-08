import type { JsonApiResponse } from "../types.js";
/**
 * Cache du dictionnaire BoondManager.
 *
 * L'API BoondManager expose **un seul endpoint** `GET /application/dictionary`
 * qui retourne l'intégralité des dictionnaires (états, types, pays, devises,
 * langues, outils, expertises, …) en une seule réponse JSON. La structure
 * pertinente pour les outils du serveur est `data.setting.*` et
 * `data.{country,languages}` (cf. RAML `schemas/application/dictionary.json`).
 *
 * Sans cache, chaque lecture de ressource ou appel à `boond_application_dictionary`
 * forcerait un appel HTTP de plusieurs centaines de Ko, alors que le contenu
 * change rarement (libellés d'états, types métier, …). On cache donc en mémoire
 * pour la durée du process, avec un TTL configurable.
 *
 * Concurrent fetches sont dédupliqués via une promesse partagée pour éviter
 * de marteler l'API quand plusieurs ressources sont lues en parallèle au
 * démarrage d'une session MCP.
 */
export type DictionaryLanguage = "fr" | "en" | "es";
interface CacheEntry {
    payload: JsonApiResponse;
    fetchedAt: number;
    language: DictionaryLanguage;
}
export interface GetDictionaryOptions {
    language?: DictionaryLanguage;
    /** Bypass the cache and re-fetch. */
    force?: boolean;
}
/**
 * Returns the full BoondManager dictionary payload, fetching once per TTL.
 * Concurrent calls share the same in-flight request.
 */
export declare function getDictionary(opts?: GetDictionaryOptions): Promise<CacheEntry>;
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
export declare function resolveDictionaryPath(payload: JsonApiResponse, path: string): unknown;
/** Reset the cache. Exposed for tests. */
export declare function resetDictionaryCacheForTests(): void;
export {};
//# sourceMappingURL=dictionary.d.ts.map