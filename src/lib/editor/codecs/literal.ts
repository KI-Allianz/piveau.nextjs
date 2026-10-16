import { FieldCodec } from "./types";

/**
 * Plain literal (e.g. dct:identifier, owl:versionInfo).
 * Also serves as the identity fallback for simple `input` fields.
 */
export const literalCodec: FieldCodec = {
  toRdf: (value) => value,
  fromRdf: (value) => {
    if (value && typeof value === "object" && "@id" in value) {
      return value["@id"];
    }
    return value;
  },
};
