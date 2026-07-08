import { z } from "zod";
import { apiRequest, buildSearchQuery, formatListResponse, formatDetailResponse, formatEntitySummary, } from "../services/boond-client.js";
import { SearchSchema, IdSchema, IdTabSchema } from "../schemas/index.js";
// ---- Structured output schemas (MCP outputSchema / structuredContent) ----
// Deliberately compact: the structured payload mirrors the text summary
// (ids + one-line summaries, or the caller-selected `fields`), never the full
// JSON:API resources — duplicating those would defeat the token economy of
// the text formatters. Detail (`get`) tools keep text-only output for the
// same reason: their text is already the machine-parseable JSON.
export const SearchOutputSchema = z.object({
    total: z.number().optional().describe("Nombre total de résultats côté BoondManager"),
    count: z.number().describe("Nombre d'éléments retournés sur cette page"),
    items: z.array(z.object({
        id: z.string().optional(),
        type: z.string().optional(),
        summary: z.string().optional().describe("Résumé standard (absent si `fields` est fourni)"),
        attributes: z
            .record(z.string(), z.unknown())
            .optional()
            .describe("Attributs projetés (présent si `fields` est fourni)"),
    })),
});
export const MutationOutputSchema = z.object({
    id: z.string().optional().describe("Identifiant de l'entité créée/modifiée"),
    type: z.string().optional(),
});
export const DeleteOutputSchema = z.object({
    id: z.string(),
    deleted: z.boolean(),
    reason: z.string().optional().describe("Présent quand la suppression n'a pas eu lieu (ex: refus utilisateur)"),
});
/** Build the compact structured payload for a search result page. Exported for unit testing. */
export function buildListStructured(response, fields) {
    const data = (Array.isArray(response.data) ? response.data : [response.data]).filter((e) => e !== null && e !== undefined);
    const projected = fields !== undefined && fields.length > 0;
    const items = data.map((entity) => {
        const item = {};
        if (entity.id !== undefined)
            item.id = String(entity.id);
        if (entity.type !== undefined)
            item.type = String(entity.type);
        if (projected) {
            const attrs = (entity.attributes ?? {});
            const selected = {};
            for (const field of fields) {
                if (attrs[field] !== undefined)
                    selected[field] = attrs[field];
            }
            item.attributes = selected;
        }
        else {
            item.summary = formatEntitySummary(entity);
        }
        return item;
    });
    const total = response.meta?.totals?.rows;
    return {
        ...(typeof total === "number" ? { total } : {}),
        count: items.length,
        items,
    };
}
function entityRef(response) {
    const entity = Array.isArray(response.data) ? response.data[0] : response.data;
    const ref = {};
    if (entity?.id !== undefined)
        ref.id = String(entity.id);
    if (entity?.type !== undefined)
        ref.type = String(entity.type);
    return ref;
}
// ---- Delete confirmation via MCP elicitation ----
/** `BOOND_MCP_CONFIRM_DELETE=0|false|no|off` opts out of the confirmation prompt. */
function deleteConfirmationDisabled() {
    const v = process.env.BOOND_MCP_CONFIRM_DELETE;
    if (!v)
        return false;
    return ["0", "false", "no", "off"].includes(v.trim().toLowerCase());
}
/**
 * Ask the end user to confirm a destructive delete through MCP elicitation
 * (spec 2025-06-18). Clients that don't declare the `elicitation` capability
 * keep the legacy behaviour (delete proceeds — `destructiveHint` already lets
 * hosts gate the call). A failed elicitation round-trip (e.g. stateless HTTP
 * quirks) also falls back to legacy rather than breaking deletes; only an
 * explicit decline/cancel/`confirm=false` aborts.
 */
export async function confirmDeletion(server, entityName, id) {
    if (deleteConfirmationDisabled())
        return { confirmed: true };
    let supportsElicitation;
    try {
        supportsElicitation = Boolean(server.server.getClientCapabilities()?.elicitation);
    }
    catch {
        return { confirmed: true };
    }
    if (!supportsElicitation)
        return { confirmed: true };
    try {
        const result = await server.server.elicitInput({
            message: `Confirmer la suppression définitive de ${entityName} #${id} dans BoondManager ? Cette action est irréversible.`,
            requestedSchema: {
                type: "object",
                properties: {
                    confirm: {
                        type: "boolean",
                        title: "Confirmer la suppression",
                        description: `Supprimer ${entityName} #${id}`,
                    },
                },
                required: ["confirm"],
            },
        });
        if (result.action === "accept" && result.content?.confirm === true) {
            return { confirmed: true };
        }
        return { confirmed: false, reason: result.action === "accept" ? "confirm=false" : result.action };
    }
    catch {
        return { confirmed: true };
    }
}
export function registerSearchTool(server, opts, overrides = {}) {
    const schema = overrides.schema ?? SearchSchema;
    const title = overrides.title ?? `Rechercher des ${opts.entityNamePlural}`;
    const description = overrides.description ??
        `Recherche des ${opts.entityNamePlural} dans BoondManager par mots-clés avec pagination.

Args:
  - keywords (string, optional): Termes de recherche (nom, email, compétences...)
  - page (number): Numéro de page (défaut: 1)
  - pageSize (number): Résultats par page (défaut: 20, max: 100)

Returns: Liste des ${opts.entityNamePlural} correspondants avec leur ID, nom et détails principaux.`;
    server.registerTool(`${opts.prefix}_search`, {
        title,
        description,
        inputSchema: schema,
        outputSchema: SearchOutputSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    }, async (params) => {
        const p = params;
        const query = buildSearchQuery(p);
        const response = await apiRequest(opts.apiPath, "GET", undefined, query);
        const text = formatListResponse(response, opts.entityName, p.fields);
        return {
            content: [{ type: "text", text }],
            structuredContent: buildListStructured(response, p.fields),
        };
    });
}
export function registerGetTool(server, opts, overrides = {}) {
    const withTab = overrides.withTab ?? true;
    const title = overrides.title ?? `Détails d'un(e) ${opts.entityName}`;
    const description = overrides.description ??
        (withTab
            ? `Récupère les informations détaillées d'un(e) ${opts.entityName} par son ID. Optionnellement un onglet spécifique (information, technical, financial, actions, contracts, documents).

Args:
  - id (string): Identifiant unique du/de la ${opts.entityName}
  - tab (string, optional): Onglet spécifique à récupérer

Returns: Données JSON complètes de l'entité.`
            : `Récupère les informations détaillées d'un(e) ${opts.entityName} par son ID.`);
    server.registerTool(`${opts.prefix}_get`, {
        title,
        description,
        inputSchema: withTab ? IdTabSchema : IdSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async (params) => {
        const tab = withTab ? params.tab : undefined;
        const path = tab ? `${opts.apiPath}/${params.id}/${tab}` : `${opts.apiPath}/${params.id}`;
        const response = await apiRequest(path);
        const text = formatDetailResponse(response);
        return {
            content: [{ type: "text", text }],
        };
    });
}
export function registerCreateTool(server, opts, schema, buildBody) {
    server.registerTool(`${opts.prefix}_create`, {
        title: `Créer un(e) ${opts.entityName}`,
        description: `Crée un(e) nouvel(le) ${opts.entityName} dans BoondManager.

Returns: Données du/de la ${opts.entityName} créé(e) avec son ID.`,
        inputSchema: schema,
        outputSchema: MutationOutputSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false,
        },
    }, async (params) => {
        const body = buildBody(params);
        const response = await apiRequest(opts.apiPath, "POST", body);
        const entity = Array.isArray(response.data) ? response.data[0] : response.data;
        return {
            content: [
                {
                    type: "text",
                    text: `✅ ${opts.entityName} créé(e) avec succès.\nID: ${entity?.id}\n\n${formatDetailResponse(response)}`,
                },
            ],
            structuredContent: entityRef(response),
        };
    });
}
export function registerUpdateTool(server, opts, schema, buildBody, overrides = {}) {
    const method = overrides.method ?? "PATCH";
    const pathSuffix = overrides.pathSuffix ? `/${overrides.pathSuffix}` : "";
    server.registerTool(`${opts.prefix}_update`, {
        title: `Modifier un(e) ${opts.entityName}`,
        description: `Met à jour un(e) ${opts.entityName} existant(e) dans BoondManager. Seuls les champs fournis sont modifiés.

Returns: Données mises à jour du/de la ${opts.entityName}.`,
        inputSchema: schema,
        outputSchema: MutationOutputSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async (params) => {
        const p = params;
        const id = p.id;
        const body = buildBody(p);
        const response = await apiRequest(`${opts.apiPath}/${id}${pathSuffix}`, method, body);
        return {
            content: [
                {
                    type: "text",
                    text: `✅ ${opts.entityName} #${id} mis(e) à jour.\n\n${formatDetailResponse(response)}`,
                },
            ],
            structuredContent: { id, ...entityRef(response) },
        };
    });
}
export function registerDeleteTool(server, opts, overrides = {}) {
    server.registerTool(`${opts.prefix}_delete`, {
        title: overrides.title ?? `Supprimer un(e) ${opts.entityName}`,
        description: overrides.description ??
            `Supprime un(e) ${opts.entityName} de BoondManager. ⚠️ Action irréversible. Si le client MCP supporte l'élicitation, une confirmation est demandée à l'utilisateur avant la suppression.

Args:
  - id (string): Identifiant de l'entité à supprimer`,
        inputSchema: IdSchema,
        outputSchema: DeleteOutputSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: false,
        },
    }, async (params) => {
        const confirmation = await confirmDeletion(server, opts.entityName, params.id);
        if (!confirmation.confirmed) {
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ Suppression de ${opts.entityName} #${params.id} annulée par l'utilisateur.`,
                    },
                ],
                structuredContent: { id: params.id, deleted: false, reason: confirmation.reason ?? "declined" },
            };
        }
        await apiRequest(`${opts.apiPath}/${params.id}`, "DELETE");
        return {
            content: [
                {
                    type: "text",
                    text: `🗑️ ${opts.entityName} #${params.id} supprimé(e).`,
                },
            ],
            structuredContent: { id: params.id, deleted: true },
        };
    });
}
/**
 * Builds a JSON:API `{ data: { type, attributes[, id][, relationships] } }`
 * payload. `undefined` attributes are dropped (so PATCH only touches the
 * fields the caller actually supplied). `relationships` maps a relation name
 * to a `{ id, type }` resource identifier and is wrapped in the JSON:API
 * `{ data: ... }` envelope; entries are skipped when their value is undefined.
 */
export function buildJsonApiBody(type, attributes, id, relationships) {
    const data = {
        type,
        attributes: Object.fromEntries(Object.entries(attributes).filter(([_, v]) => v !== undefined)),
    };
    if (id) {
        data.id = id;
    }
    if (relationships) {
        const rels = Object.fromEntries(Object.entries(relationships)
            .filter(([, ref]) => ref !== undefined)
            .map(([name, ref]) => [name, { data: ref }]));
        if (Object.keys(rels).length > 0) {
            data.relationships = rels;
        }
    }
    return { data };
}
//# sourceMappingURL=crud-factory.js.map