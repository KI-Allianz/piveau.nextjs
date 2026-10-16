import { FieldCodec } from "./types";

/**
 * Typed literal, e.g. `"P20M"` <-> `{ "@value": "P20M", "@type": xsd:duration }`.
 * The datatype IRI comes from `EditorMetadata.dataType`.
 */
export const typedLiteralCodec: FieldCodec = {
  toRdf: (value, meta) => {
    if (value === undefined || value === null || value === "") return undefined;

    return {
      "@value": String(value),
      "@type": meta.dataType,
    };
  },
  fromRdf: (value) => {
    if (value && typeof value === "object" && "@value" in value) {
      return value["@value"];
    }
    return value;
  },
};
