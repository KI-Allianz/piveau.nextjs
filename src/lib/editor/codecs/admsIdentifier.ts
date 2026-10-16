import { getProperty } from "../prefixes";
import { readValue } from "./helpers";
import { FieldCodec } from "./types";

/**
 * adms:Identifier with a typed skos:notation, e.g. adms:identifier.
 * Form shape: `{ identifier, scheme, resource }`.
 */
export const admsIdentifierCodec: FieldCodec = {
  toRdf: (value) => {
    if (!value || typeof value !== "object") return value;

    const node: Record<string, any> = {};

    if (value.resource) node["@id"] = value.resource;
    node["@type"] = "adms:Identifier";

    if (value.identifier) {
      node["skos:notation"] = value.scheme
        ? { "@value": value.identifier, "@type": value.scheme }
        : { "@value": value.identifier };
    }

    return Object.keys(node).length > 1 ? node : undefined;
  },
  fromRdf: (value, _meta, ctx) => {
    if (!value || typeof value !== "object") return undefined;

    const notation = getProperty(value, "skos:notation", ctx.prefixes);

    const result: Record<string, any> = {};
    if (value["@id"]) result.resource = value["@id"];
    if (notation !== undefined) {
      result.identifier = readValue(notation);
      if (notation && typeof notation === "object" && notation["@type"]) {
        result.scheme = notation["@type"];
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  },
};
