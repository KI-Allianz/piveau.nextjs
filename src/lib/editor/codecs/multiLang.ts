import { FieldCodec } from "./types";

/**
 * Multilingual string, e.g. `{ en: "Title", de: "Titel" }`
 * <-> `[{ "@language": "en", "@value": "Title" }, ...]`.
 */
export const multiLangCodec: FieldCodec = {
  toRdf: (value) => {
    if (typeof value !== "object" || value === null) return value;

    const localizedEntries = Object.entries(value)
      .filter(([, val]) => Boolean(val))
      .map(([lang, val]) => ({
        "@language": lang,
        "@value": val,
      }));

    return localizedEntries.length > 0 ? localizedEntries : undefined;
  },
  fromRdf: (value) => {
    const entries = Array.isArray(value) ? value : [value];
    const result: Record<string, string> = {};

    for (const entry of entries) {
      if (entry && typeof entry === "object") {
        const lang = entry["@language"];
        const val = entry["@value"];
        if (lang && typeof val === "string") {
          result[lang] = val;
        }
      } else if (typeof entry === "string") {
        result["en"] = entry;
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  },
};
