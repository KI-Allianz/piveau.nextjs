import { FieldCodec } from "./types";

/**
 * A repeatable multilingual value, e.g. keywords. The form models one entry
 * per term: `[{ en: "Completed", de: "Abgeschlossen" }, { en: "open data" }]`.
 *
 * The RDF side is a flat list of language-tagged literals, so on parse we can
 * only regroup consecutive translations of the same term (i.e. a new group
 * starts when a language repeats). This is lossless as long as piveau keeps
 * the translations of one term adjacent.
 */
export const multiLangListCodec: FieldCodec = {
  toRdf: (value) => {
    if (!Array.isArray(value)) return undefined;

    const entries: { "@language": string; "@value": any }[] = [];

    for (const item of value) {
      if (!item || typeof item !== "object") continue;

      for (const [lang, val] of Object.entries(item)) {
        if (Boolean(val)) {
          entries.push({ "@language": lang, "@value": val });
        }
      }
    }

    return entries.length > 0 ? entries : undefined;
  },
  fromRdf: (value) => {
    const entries = Array.isArray(value) ? value : [value];
    const groups: Record<string, any>[] = [];
    let current: Record<string, any> | null = null;

    const flush = () => {
      if (current) groups.push(current);
      current = null;
    };

    for (const entry of entries) {
      let lang: string | undefined;
      let val: any;

      if (entry && typeof entry === "object") {
        lang = entry["@language"];
        val = entry["@value"];
      } else if (typeof entry === "string") {
        lang = "en";
        val = entry;
      }

      if (!lang || typeof val !== "string") continue;

      if (current && lang in current) flush();
      if (!current) current = {};
      current[lang] = val;
    }

    flush();

    return groups.length > 0 ? groups : undefined;
  },
};
