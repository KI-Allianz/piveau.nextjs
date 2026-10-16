import { getProperty } from "../prefixes";
import { fromLangEntries, readIri, toLangEntries } from "./helpers";
import { FieldCodec } from "./types";

/**
 * foaf:Document, e.g. dcat:landingPage / foaf:page. With only a resource the
 * node collapses to a bare `{ "@id": ... }` (as piveau emits for landingPage).
 */
export const pageCodec: FieldCodec = {
  toRdf: (value) => {
    if (!value || typeof value !== "object") return value;

    const node: Record<string, any> = {};

    if (value.resource) node["@id"] = value.resource;

    const title = toLangEntries(value.title);
    const description = toLangEntries(value.description);
    const format = value.format ? { "@id": value.format } : undefined;

    const hasDetails = Boolean(title || description || format);
    if (!hasDetails) return node["@id"] ? node : undefined;

    node["@type"] = "foaf:Document";
    if (title) node["dct:title"] = title;
    if (description) node["dct:description"] = description;
    if (format) node["dct:format"] = format;

    return node;
  },
  fromRdf: (value, _meta, ctx) => {
    if (typeof value === "string") return { resource: value };
    if (!value || typeof value !== "object") return undefined;

    const result: Record<string, any> = {};

    if (value["@id"]) result.resource = value["@id"];

    const title = fromLangEntries(
      getProperty(value, "dct:title", ctx.prefixes),
    );
    if (title) result.title = title;

    const description = fromLangEntries(
      getProperty(value, "dct:description", ctx.prefixes),
    );
    if (description) result.description = description;

    const format = readIri(getProperty(value, "dct:format", ctx.prefixes));
    if (format) result.format = format;

    return Object.keys(result).length > 0 ? result : undefined;
  },
};
