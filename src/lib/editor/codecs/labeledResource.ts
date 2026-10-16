import { getProperty } from "../prefixes";
import { FieldCodec } from "./types";

/**
 * A labelled resource: either an IRI `{ "@id": ... }` (when a resource is
 * given) or a blank node `[ a <rdfType>; rdfs:label "..." ]`.
 * Used for dct:conformsTo (dct:Standard) and dct:provenance (dct:ProvenanceStatement).
 */
export const labeledResourceCodec: FieldCodec = {
  toRdf: (value, meta) => {
    if (!value || typeof value !== "object") return value;

    if (value.resource) return { "@id": value.resource };

    if (value.label) {
      return {
        "@type": meta.rdfType ?? "dct:Standard",
        "rdfs:label": value.label,
      };
    }

    return undefined;
  },
  fromRdf: (value, _meta, ctx) => {
    if (typeof value === "string") return { resource: value };
    if (!value || typeof value !== "object") return undefined;

    if (value["@id"]) return { resource: value["@id"] };

    const label = getProperty(value, "rdfs:label", ctx.prefixes);
    return label ? { label } : undefined;
  },
};
