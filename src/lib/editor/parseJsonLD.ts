import { ZodType } from "zod";
import {
  datasetFormSchema,
  editorMetadataRegistry,
  DatasetFormValues,
  getUnwrappedObjectSchema,
  getArrayElementSchema,
} from "./DatasetFormSchema";
import { deriveUploadPath } from "../repo/uploader/paths";

type Prefixes = Record<string, string>;

const DEFAULT_PREFIXES: Prefixes = {
  dct: "http://purl.org/dc/terms/",
  dcat: "http://www.w3.org/ns/dcat#",
  vcard: "http://www.w3.org/2006/vcard/ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
};

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

function getProperty(node: any, rdfProperty: string, prefixes: Prefixes): any {
  if (!node || typeof node !== "object") return undefined;
  if (rdfProperty in node) return node[rdfProperty];

  const expanded = expandIri(rdfProperty, prefixes);
  if (expanded !== rdfProperty && expanded in node) return node[expanded];

  return undefined;
}

function selectRootNode(
  jsonLdData: Record<string, any>,
  prefixes: Prefixes,
): any {
  const graph = jsonLdData?.["@graph"];

  if (!Array.isArray(graph) || graph.length === 0) {
    return jsonLdData;
  }

  const nodes = graph.filter((node) => node && typeof node === "object");
  const datasetType = expandIri("dcat:Dataset", prefixes);

  const datasetNode = nodes.find((node) => {
    const types = Array.isArray(node["@type"])
      ? node["@type"]
      : [node["@type"]];
    return types.some((type) => expandIri(type, prefixes) === datasetType);
  });

  if (datasetNode) return datasetNode;

  const namedNode = nodes.find(
    (node) => typeof node["@id"] === "string" && !node["@id"].startsWith("_:"),
  );

  return namedNode ?? nodes[0] ?? jsonLdData;
}

function indexGraph(jsonLdData: Record<string, any>): Map<string, any> {
  const byId = new Map<string, any>();

  const graph = jsonLdData?.["@graph"];
  if (Array.isArray(graph)) {
    for (const node of graph) {
      if (node && typeof node === "object" && typeof node["@id"] === "string") {
        byId.set(node["@id"], node);
      }
    }
  }

  if (typeof jsonLdData?.["@id"] === "string") {
    byId.set(jsonLdData["@id"], jsonLdData);
  }

  return byId;
}

function resolveNode(
  node: Record<string, any>,
  byId: Map<string, any>,
  seen: Set<string>,
): Record<string, any> {
  const result: Record<string, any> = {};

  const id = typeof node["@id"] === "string" ? node["@id"] : undefined;
  const nextSeen = id && !seen.has(id) ? new Set(seen).add(id) : seen;

  for (const [key, value] of Object.entries(node)) {
    if (key === "@context" || key === "@graph") continue;

    if (key === "@id" || key.startsWith("@")) {
      result[key] = value;
      continue;
    }

    result[key] = resolveReferences(value, byId, nextSeen);
  }

  return result;
}

function resolveReferences(
  value: any,
  byId: Map<string, any>,
  seen: Set<string>,
): any {
  if (Array.isArray(value)) {
    return value.map((entry) => resolveReferences(entry, byId, seen));
  }

  if (!value || typeof value !== "object") return value;

  const keys = Object.keys(value);
  const id = typeof value["@id"] === "string" ? value["@id"] : undefined;

  if (keys.length === 1 && id !== undefined && byId.has(id)) {
    if (seen.has(id)) return { "@id": id };

    const nextSeen = new Set(seen).add(id);
    return resolveNode(byId.get(id), byId, nextSeen);
  }

  return resolveNode(value, byId, seen);
}

/**
 * Recursively parses a JSON-LD value for a given Zod schema field back into form values.
 */
export function parseJsonLdFieldValue(
  schema: ZodType,
  jsonLdValue: any,
  prefixes: Prefixes = DEFAULT_PREFIXES,
): any {
  if (jsonLdValue === undefined || jsonLdValue === null) return undefined;

  const meta = editorMetadataRegistry.get(schema);
  if (!meta) return jsonLdValue;

  if (meta.component === "multilingual-input") {
    const entries = Array.isArray(jsonLdValue) ? jsonLdValue : [jsonLdValue];
    const result: Record<string, string> = {};

    for (const entry of entries) {
      if (entry && typeof entry === "object") {
        const lang = entry["@language"];
        const val = entry["@value"];
        if (lang && typeof val === "string") {
          result[lang] = val;
        }
      } else if (typeof entry === "string") {
        result["en"] = entry;
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  if (meta.component === "temporal") {
    if (typeof jsonLdValue === "object" && jsonLdValue !== null) {
      return jsonLdValue["@value"] || "";
    }
    return typeof jsonLdValue === "string" ? jsonLdValue : "";
  }

  if (meta.component === "array") {
    const elementSchema = getArrayElementSchema(schema);
    if (!elementSchema) return undefined;

    const entries = Array.isArray(jsonLdValue) ? jsonLdValue : [jsonLdValue];
    const items = entries
      .map((entry) => parseJsonLdFieldValue(elementSchema, entry, prefixes))
      .filter((item) => item !== undefined);

    return items.length > 0 ? items : undefined;
  }

  if (meta.component === "object") {
    let innerSchema = getUnwrappedObjectSchema(schema);

    if (!innerSchema) {
      console.error(`Expected ZodObject, but got`, schema);
      return null;
    }

    const innerShape = innerSchema.shape;
    const parsedObjectData: Record<string, any> = {};

    for (const [subKey, subSchema] of Object.entries(innerShape)) {
      const subMeta = editorMetadataRegistry.get(subSchema as ZodType);
      if (!subMeta || !subMeta.rdfProperty) continue;

      const rawSubValue = getProperty(
        jsonLdValue,
        subMeta.rdfProperty,
        prefixes,
      );

      let targetSubVal = rawSubValue;
      if (
        rawSubValue &&
        typeof rawSubValue === "object" &&
        "@id" in rawSubValue &&
        Object.keys(rawSubValue).length === 1
      ) {
        targetSubVal = rawSubValue["@id"];
      }

      const parsedSubVal = parseJsonLdFieldValue(
        subSchema as ZodType,
        targetSubVal,
        prefixes,
      );

      if (parsedSubVal !== undefined) {
        parsedObjectData[subKey] = parsedSubVal;
      }
    }

    return Object.keys(parsedObjectData).length > 0
      ? parsedObjectData
      : undefined;
  }

  if (
    typeof jsonLdValue === "object" &&
    jsonLdValue !== null &&
    "@id" in jsonLdValue
  ) {
    return jsonLdValue["@id"];
  }

  return jsonLdValue;
}

/**
 * Parses an entire Piveau JSON-LD document into initial DatasetFormValues
 */
export function parseDatasetJsonLd(
  jsonLdData: Record<string, any>,
): Partial<DatasetFormValues> {
  const data = jsonLdData ?? {};
  const prefixes = buildPrefixes(data);
  const byId = indexGraph(data);
  const root = resolveReferences(selectRootNode(data, prefixes), byId, new Set());

  const shape = datasetFormSchema.shape;
  const formValues: Record<string, any> = {};

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const meta = editorMetadataRegistry.get(fieldSchema);
    if (!meta || !meta.rdfProperty) continue;

    const rawValue = getProperty(root, meta.rdfProperty, prefixes);
    let parsedValue = parseJsonLdFieldValue(fieldSchema, rawValue, prefixes);

    if (parsedValue !== undefined) {
      if (meta.rdfProperty == "@id") {
        parsedValue = parsedValue.replace("https://piveau.io/set/data/", "");
      }
      formValues[key] = parsedValue;
    }
  }

  if (Array.isArray(formValues.distributions) && formValues.id) {
    formValues.distributions = formValues.distributions.map(
      (distribution: Record<string, any>) => ({
        ...distribution,
        uploadPath:
          distribution.uploadPath ??
          deriveUploadPath(distribution.downloadURL, formValues.id),
      }),
    );
  }

  return formValues;
}

export type DraftSummary = Partial<DatasetFormValues> & { id: string };

/**
 * Parses a Piveau metadata list document (one draft per top-level `@graph`
 * entry) into a flat list of draft summaries.
 */
export function parseDatasetListJsonLd(jsonLdData: any): DraftSummary[] {
  const data = jsonLdData?.json ?? jsonLdData ?? {};
  const context = data["@context"];
  const graph = data["@graph"];

  if (!Array.isArray(graph)) return [];

  const summaries: DraftSummary[] = [];

  for (const entry of graph) {
    if (!entry || typeof entry !== "object") continue;

    const nodes = Array.isArray(entry["@graph"]) ? entry["@graph"] : [entry];
    const parsed = parseDatasetJsonLd({ "@context": context, "@graph": nodes });

    const rawId =
      parsed.id ??
      (typeof entry["@id"] === "string" ? entry["@id"] : undefined);

    const id =
      typeof rawId === "string"
        ? rawId.replace("https://piveau.io/set/data/", "")
        : undefined;

    if (!id) continue;

    summaries.push({ ...parsed, id });
  }

  return summaries;
}
