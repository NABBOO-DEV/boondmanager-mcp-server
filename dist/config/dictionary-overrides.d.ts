/**
 * Dictionary overrides: let operators whose BoondManager instance uses
 * customised dictionary labels (e.g. English action types or states) declare
 * a label→id mapping, so the model can pass human labels instead of opaque
 * numeric dictionary ids.
 *
 * Env var (optional):
 *  - `BOOND_DICTIONARY_OVERRIDES` Either inline JSON (the value starts with
 *    `{`) or a path to a UTF-8 JSON file. Expected shape:
 *
 *    {
 *      "action": { "contact": { "Call": 61, "Email": 63 }, "candidate": { ... } },
 *      "state":  { "candidate": { "Interviewed": 2 }, "opportunity": { ... } }
 *    }
 *
 * Both sections are optional. Unknown entity keys are warned-and-ignored.
 * Any hard error (unreadable file, invalid JSON, invalid structure) is logged
 * as a warning and the overrides are simply disabled: the server ALWAYS
 * starts (fail-open, same philosophy as services/update-checker.ts).
 *
 * This is a pure input-side convenience: it never translates API responses.
 */
/** Entities that can carry an action `typeOf` (see `setting.action.*`). */
export declare const ACTION_ENTITIES: readonly ["contact", "candidate", "resource", "opportunity", "project"];
/** Entities that carry a `state` attribute (see `setting.state.*`). */
export declare const STATE_ENTITIES: readonly ["candidate", "resource", "contact", "company", "opportunity", "project", "positioning", "quotation", "product", "invoice", "order", "absence"];
export type OverrideSection = "action" | "state";
/** Custom label → numeric dictionary id. */
export type LabelMap = Record<string, number>;
export interface DictionaryOverrides {
    action: Partial<Record<string, LabelMap>>;
    state: Partial<Record<string, LabelMap>>;
}
/**
 * Load and validate the overrides from the environment. Resilient: any error
 * is logged as a warning and `null` is returned — the server always starts.
 */
export declare function loadDictionaryOverrides(env?: NodeJS.ProcessEnv): DictionaryOverrides | null;
export declare function getDictionaryOverrides(): DictionaryOverrides | null;
/** Reset the singleton (tests only). */
export declare function resetDictionaryOverridesForTests(): void;
/**
 * Resolve a custom label to its numeric dictionary id. Matching is
 * case-insensitive and ignores leading/trailing whitespace.
 */
export declare function resolveLabel(section: OverrideSection, entity: string, label: string): number | undefined;
/** Labels declared for a section/entity (original casing), or [] if none. */
export declare function availableLabels(section: OverrideSection, entity: string): string[];
/** Compact "Label=id, Label=id" summary for a section/entity, or null if none. */
export declare function formatOverridesSummary(section: OverrideSection, entity: string): string | null;
/**
 * Append the accepted custom labels to a schema/tool description. Returns the
 * base string unchanged (byte-for-byte) when no override is configured for
 * this section/entity.
 */
export declare function appendOverridesToDescription(base: string, section: OverrideSection, entity: string): string;
//# sourceMappingURL=dictionary-overrides.d.ts.map