import * as jsonld from "jsonld";

import { PREFIXES } from "./prefixes";

/**
 * Fixed context used to compact every Piveau document into one shape.
 *
 * Compaction deliberately uses only these prefix mappings: term aliases or
 * `@container` definitions from the input would turn values into shapes the
 * editor codecs do not expect (e.g. language maps or `title` instead of
 * `dct:title`).
 */
const EDITOR_CONTEXT: Record<string, any> = { ...PREFIXES };

function isRecord(value: unknown): value is Record<string, any> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Merges the inline parts of an input context for expansion.
 *
 * Unlike compaction, expansion should honor the document's own aliases and
 * containers (e.g. `@container: @language`). Remote context URLs are ignored
 * because fetching them at runtime would introduce a network dependency; the
 * editor's prefixes are used as a fallback.
 */
function inlineContext(context: unknown): Record<string, any> {
  const entries = Array.isArray(context) ? context : [context];

  return entries.reduce<Record<string, any>>((acc, entry) => {
    if (isRecord(entry)) Object.assign(acc, entry);
    return acc;
  }, {});
}

/**
 * Normalizes arbitrary Piveau JSON-LD (named graphs, expanded documents,
 * compact documents, single datasets or lists) into one compact JSON-LD
 * document using the editor's prefix context.
 *
 * Falls back to the raw document if the input cannot be expanded, so a
 * malformed document does not take down the editor.
 */
export async function normalizeJsonLdDocument(
  data: unknown,
): Promise<Record<string, any>> {
  const document = Array.isArray(data)
    ? { "@graph": data }
    : isRecord(data)
      ? data
      : {};

  const expansionContext = {
    ...EDITOR_CONTEXT,
    ...inlineContext(document["@context"]),
  };
  const withContext = { ...document, "@context": expansionContext };

  try {
    const expanded = await jsonld.expand(withContext as any);
    const compacted = await jsonld.compact(expanded, EDITOR_CONTEXT);

    if (Array.isArray(compacted)) {
      return { "@context": EDITOR_CONTEXT, "@graph": compacted };
    }

    return compacted as Record<string, any>;
  } catch (error) {
    console.warn(
      "Failed to normalize JSON-LD, falling back to the raw document:",
      error,
    );
    return withContext;
  }
}
