import { temporalRegex } from "../DatasetFormSchema";
import { FieldCodec } from "./types";

const XSD = "http://www.w3.org/2001/XMLSchema#";

/**
 * Date/dateTime literal, e.g. `"2009-10-10"` <-> typed literal. Picks the
 * xsd datatype based on the granularity of the value.
 */
export const temporalCodec: FieldCodec = {
  toRdf: (value) => {
    if (typeof value !== "string") return value;

    let xsdType = `${XSD}date`; // default fallback

    if (temporalRegex.dateTime.test(value)) {
      xsdType = `${XSD}dateTime`;
    } else if (temporalRegex.date.test(value)) {
      xsdType = `${XSD}date`;
    } else if (temporalRegex.gYearMonth.test(value)) {
      xsdType = `${XSD}gYearMonth`;
    } else if (temporalRegex.gYear.test(value)) {
      xsdType = `${XSD}gYear`;
    }

    return {
      "@value": value,
      "@type": xsdType,
    };
  },
  fromRdf: (value) => {
    if (typeof value === "object" && value !== null) {
      return value["@value"] || "";
    }
    return typeof value === "string" ? value : "";
  },
};
