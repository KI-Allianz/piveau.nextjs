import { FieldCodec } from "./types";

/**
 * Resource reference, e.g. `"https://example.org/x"` <-> `{ "@id": "https://example.org/x" }`.
 * Used for `StandardResourceKeyword` / `StandardKeyword` style URI values.
 */
export const resourceCodec: FieldCodec = {
  toRdf: (value) => {
    if (typeof value === "string") {
      return { "@id": value };
    }
    return value;
  },
  fromRdf: (value) => {
    if (value && typeof value === "object" && "@id" in value) {
      return value["@id"];
    }
    return value;
  },
};
