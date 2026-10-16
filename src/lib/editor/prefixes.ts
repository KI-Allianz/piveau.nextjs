export type Prefixes = Record<string, string>;

/**
 * Shared prefix map used for both parsing JSON-LD (expanding prefixed terms)
 * and building JSON-LD (`@context`). Keep this in sync with the namespaces
 * used by `editorMetadataRegistry` rdfProperty/rdfType values.
 */
export const PREFIXES: Prefixes = {
  dct: "http://purl.org/dc/terms/",
  dcat: "http://www.w3.org/ns/dcat#",
  vcard: "http://www.w3.org/2006/vcard/ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  foaf: "http://xmlns.com/foaf/0.1/",
  adms: "http://www.w3.org/ns/adms#",
  owl: "http://www.w3.org/2002/07/owl#",
  skos: "http://www.w3.org/2004/02/skos/core#",
  spdx: "http://spdx.org/rdf/terms#",
  prov: "http://www.w3.org/ns/prov#",
  dcatap: "http://data.europa.eu/r5r/",
  stat: "http://data.europa.eu/s1n/",
  dext: "https://data.europa.eu/ns/ext#",
  locn: "http://www.w3.org/ns/locn#",
  gsp: "http://www.opengis.net/ont/geosparql#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
};

/** Legacy alias kept for the previous default prefix set. */
export const DEFAULT_PREFIXES: Prefixes = PREFIXES;

function addContext(context: any, prefixes: Prefixes) {
  if (!context) return;

  const contexts = Array.isArray(context) ? context : [context];

  for (const ctx of contexts) {
    if (!ctx || typeof ctx !== "object") continue;

    for (const [key, value] of Object.entries(ctx)) {
      if (key.startsWith("@")) continue;

      if (typeof value === "string") {
        prefixes[key] = value;
      } else if (
        value &&
        typeof value === "object" &&
        typeof (value as Record<string, any>)["@id"] === "string"
      ) {
        prefixes[key] = (value as Record<string, any>)["@id"];
      }
    }
  }
}

export function buildPrefixes(jsonLdData: Record<string, any>): Prefixes {
  const prefixes: Prefixes = { ...DEFAULT_PREFIXES };
  addContext(jsonLdData?.["@context"], prefixes);
  return prefixes;
}

export function expandIri(term: string, prefixes: Prefixes): string {
  if (typeof term !== "string") return term;
  if (
    term.startsWith("http://") ||
    term.startsWith("https://") ||
    term.startsWith("_:")
  ) {
    return term;
  }

  const idx = term.indexOf(":");
  if (idx === -1) return term;

  const prefix = term.slice(0, idx);
  const suffix = term.slice(idx + 1);
  const iri = prefixes[prefix];

  return iri ? iri + suffix : term;
}

/**
 * Reads a property from a JSON-LD node, accepting either the prefixed term
 * (e.g. "dct:title") or its fully expanded IRI.
 */
export function getProperty(
  node: any,
  rdfProperty: string,
  prefixes: Prefixes,
): any {
  if (!node || typeof node !== "object") return undefined;
  if (rdfProperty in node) return node[rdfProperty];

  const expanded = expandIri(rdfProperty, prefixes);
  if (expanded !== rdfProperty && expanded in node) return node[expanded];

  return undefined;
}
