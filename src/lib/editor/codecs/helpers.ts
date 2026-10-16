import { temporalRegex } from "../schema";
import { expandIri, Prefixes } from "../prefixes";

export const XSD = "http://www.w3.org/2001/XMLSchema#";

/** xsd datatype suffix for a temporal value (date/dateTime/gYear/gYearMonth). */
export function temporalSuffix(value: string): string {
  if (temporalRegex.dateTime.test(value)) return "dateTime";
  if (temporalRegex.date.test(value)) return "date";
  if (temporalRegex.gYearMonth.test(value)) return "gYearMonth";
  if (temporalRegex.gYear.test(value)) return "gYear";
  return "date";
}

export function temporalNode(value: string) {
  return { "@value": value, "@type": `${XSD}${temporalSuffix(value)}` };
}

/** Extracts a value from `xsd:`-typed literals of the shape `{ "@value": ... }`. */
export function readValue(value: any): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "object" && "@value" in value) return value["@value"];
  return value;
}

/** Extracts an IRI from either a string or a `{ "@id": ... }` object. */
export function readIri(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && typeof value["@id"] === "string") {
    return value["@id"];
  }
  return undefined;
}

/** Multilingual form object -> JSON-LD language literals. */
export function toLangEntries(value: any): any {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value)
    .filter(([, val]) => Boolean(val))
    .map(([lang, val]) => ({ "@language": lang, "@value": val }));

  return entries.length > 0 ? entries : undefined;
}

/** JSON-LD language literals -> multilingual form object. */
export function fromLangEntries(value: any): Record<string, string> | undefined {
  const entries = Array.isArray(value) ? value : [value];
  const result: Record<string, string> = {};

  for (const entry of entries) {
    if (entry && typeof entry === "object") {
      const lang = entry["@language"];
      const val = entry["@value"];
      if (lang && typeof val === "string") result[lang] = val;
    } else if (typeof entry === "string") {
      result["en"] = entry;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/** Last path segment of an expanded IRI, e.g. foaf:Organization -> "Organization". */
export function compactType(type: string, prefixes: Prefixes): string {
  const expanded = expandIri(type, prefixes);
  const idx = Math.max(
    expanded.lastIndexOf("#"),
    expanded.lastIndexOf("/"),
    expanded.lastIndexOf(":"),
  );
  return expanded.slice(idx + 1);
}
