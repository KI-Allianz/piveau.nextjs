import { ZodType } from "zod";
import {
  datasetFormSchema,
  editorMetadataRegistry,
  DatasetFormValues,
} from "./schema";
import { deserializeField } from "./codecs";
import {
  buildPrefixes,
  DEFAULT_PREFIXES,
  expandIri,
  getProperty,
  Prefixes,
} from "./prefixes";
import { deriveUploadPath } from "../repo/uploader/paths";

export { buildPrefixes, expandIri };

const PIVEAU_DATASET_URI_PREFIX = "https://piveau.io/set/data/";

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
  return deserializeField(schema, jsonLdValue, { prefixes });
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
  const root = resolveReferences(
    selectRootNode(data, prefixes),
    byId,
    new Set(),
  );

  const shape = datasetFormSchema.shape;
  const formValues: Record<string, any> = {};

  for (const [key, fieldSchema] of Object.entries(shape)) {
    const meta = editorMetadataRegistry.get(fieldSchema);
    if (!meta || !meta.rdfProperty) continue;

    const rawValue = getProperty(root, meta.rdfProperty, prefixes);
    let parsedValue = parseJsonLdFieldValue(fieldSchema, rawValue, prefixes);

    if (parsedValue !== undefined) {
      if (meta.rdfProperty === "@id") {
        parsedValue = parsedValue.replace(PIVEAU_DATASET_URI_PREFIX, "");
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
    if (entry["@type"] !== "dcat:Dataset") continue;

    const nodes = Array.isArray(entry["@graph"]) ? entry["@graph"] : [entry];
    const parsed = parseDatasetJsonLd({ "@context": context, "@graph": nodes });

    const rawId =
      parsed.id ??
      (typeof entry["@id"] === "string" ? entry["@id"] : undefined);

    const id =
      typeof rawId === "string"
        ? rawId.replace(PIVEAU_DATASET_URI_PREFIX, "")
        : undefined;

    if (!id) continue;

    summaries.push({ ...parsed, id });
  }

  return summaries;
}
