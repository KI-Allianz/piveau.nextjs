// src/getLicenses.ts
import {rdfParser} from "rdf-parse"; // note: default import (not { rdfParser })
import fs from "fs";
import {DataFactory, Store, NamedNode, Literal, Quad_Subject} from "n3";
import { Readable } from "stream";
import path from "node:path";

const { namedNode } = DataFactory;

// Prefixes
const RDF   = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const RDFS  = "http://www.w3.org/2000/01/rdf-schema#";
const SKOS  = "http://www.w3.org/2004/02/skos/core#";
const SKOSXL= "http://www.w3.org/2008/05/skos-xl#";
const DCT   = "http://purl.org/dc/terms/";
const DC    = "http://purl.org/dc/elements/1.1/";
const FOAF  = "http://xmlns.com/foaf/0.1/";

// Types
export type LicenseEntry = {
  uri: string;
  identifier?: string;        // dc:identifier (e.g., "dl-zero-de/2.0")
  label?: string;             // best label (pref: skos-xl literalForm -> skos:prefLabel -> rdfs:label)
  altLabels?: string[];       // skos:altLabel[*]
  homepage?: string;          // foaf:homepage IRI
  references?: string[];      // dct:references IRIs
  usageType?: string;         // dct:type literal (e.g., "Freie Nutzung")
  inScheme?: string;          // scheme IRI
  topConceptOf?: string[];    // skos:topConceptOf[*]
  types?: string[];           // rdf:type[*]
};

// Utilities
function getObjects(store: Store, s: Quad_Subject, pIri: string) {
  return store.getQuads(s, namedNode(pIri), null, null).map(q => q.object);
}

function getLiteralValues(store: Store, s: Quad_Subject, pIri: string) {
  return getObjects(store, s, pIri)
    .filter(o => o.termType === "Literal") as Literal[];
}

function getIriValues(store: Store, s: Quad_Subject, pIri: string) {
  return getObjects(store, s, pIri)
    .filter(o => o.termType === "NamedNode")
    .map(o => (o as NamedNode).value);
}

// Extract skos-xl prefLabel literalForm (handles the blank node)
function getSkosXLLiteralForms(store: Store, s: Quad_Subject): Literal[] {
  const results: Literal[] = [];
  for (const xlNode of getObjects(store, s, SKOS + "prefLabel")) {
    if (xlNode.termType !== "BlankNode" && xlNode.termType !== "NamedNode") continue;
    // xlNode --skosxl:literalForm--> Literal
    store
      .getQuads(xlNode as any, namedNode(SKOSXL + "literalForm"), null, null)
      .forEach(q => {
        if (q.object.termType === "Literal") results.push(q.object as Literal);
      });
  }
  return results;
}

function pickBestLabelFrom(lits: Literal[], langPrefs: string[]): string | undefined {
  if (!lits.length) return undefined;
  // Try language preferences in order (e.g., ["de","en",""])
  for (const pref of langPrefs) {
    const m = lits.find(l => (l.language || "") === pref);
    if (m) return m.value;
  }
  // Fallback to first literal
  return lits[0].value;
}

function bestLabel(store: Store, s: Quad_Subject, langPrefs = ["de", "en", ""]): string | undefined {
  // Priority: skos-xl literalForm > skos:prefLabel > rdfs:label
  const xl = getSkosXLLiteralForms(store, s);
  const skosPref = getLiteralValues(store, s, SKOS + "prefLabel");
  const rdfsLbl = getLiteralValues(store, s, RDFS + "label");

  return (
    pickBestLabelFrom(xl, langPrefs) ||
    pickBestLabelFrom(skosPref, langPrefs) ||
    pickBestLabelFrom(rdfsLbl, langPrefs)
  );
}

async function quadsToStore(quadStream: Readable): Promise<Store> {
  const store = new Store();
  await new Promise<void>((resolve, reject) => {
    store
      .import(quadStream as any)
      .on("end", () => resolve())
      .on("error", reject);
  });
  return store;
}

// Main: parse licenses as a dict keyed by concept URI
export async function getLicenses(options?: {
  contentType?: string;                 // default: application/rdf+xml
  baseIRI?: string;                     // default: http://dcat-ap.de/def/licenses
  schemeIRI?: string;                   // default: http://dcat-ap.de/def/licenses
  langPrefs?: string[];                 // default: ["de","en",""]
}): Promise<Record<string, LicenseEntry>> {

  const filePath = path.join(process.cwd(), 'assets', 'licenses.rdf');
  const {
    contentType= "application/rdf+xml",
    baseIRI    = "http://dcat-ap.de/def/licenses",
    schemeIRI  = "http://dcat-ap.de/def/licenses",
    langPrefs  = ["de", "en", ""],
  } = options || {};

  // 1) Parse RDF/XML into RDFJS quad stream
  const textStream = fs.createReadStream(filePath);
  const quadStream = rdfParser.parse(textStream as any, { contentType, baseIRI }) as unknown as Readable;

  // 2) Load into N3 store
  const store = await quadsToStore(quadStream);
  // console.log(store)

  // 3) Select all concepts that are in the target scheme
  const scheme = namedNode(schemeIRI);
  const candidateSubjects = store
    .getQuads(null, namedNode(SKOS + "inScheme"), scheme, null)
    .map(q => q.subject)

  // 4) Build result
  const result: Record<string, LicenseEntry> = {};
  for (const s of candidateSubjects) {
    const uri = s.value;

    const identifier = getLiteralValues(store, s, DC + "identifier")[0]?.value
      ?? getLiteralValues(store, s, DCT + "identifier")[0]?.value;

    const altLabels = getLiteralValues(store, s, SKOS + "altLabel")
      .sort((a, b) => (a.language || "").localeCompare(b.language || ""))
      .map(l => l.value);

    const homepage = getIriValues(store, s, FOAF + "homepage")[0];
    const references = getIriValues(store, s, DCT + "references");
    const usageType = getLiteralValues(store, s, DCT + "type")[0]?.value;

    const inScheme = getIriValues(store, s, SKOS + "inScheme")[0];
    const topConceptOf = getIriValues(store, s, SKOS + "topConceptOf");
    const types = getIriValues(store, s, RDF + "type");

    const label = bestLabel(store, s, langPrefs);

    result[uri] = {
      uri,
      identifier,
      label,
      altLabels,
      homepage,
      references,
      usageType,
      inScheme,
      topConceptOf,
      types,
    };
  }

  return result;
}
