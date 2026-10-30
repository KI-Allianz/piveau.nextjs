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

const RESERVED_NODE_KEYS = new Set(["@id", "@type", "@context", "@graph"]);

function isNodeObject(value: unknown): value is Record<string, any> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Collects a node and all nodes nested in its `@graph` containers.
 *
 * Piveau wraps list entries in JSON-LD named graphs, i.e. an entry can be
 * `{ "@id": ..., "@graph": [dataset, distribution, organization, ...] }`
 * without being a dataset itself.
 */
function collectGraphNodes(
  value: unknown,
  nodes: Record<string, any>[] = [],
): Record<string, any>[] {
  if (Array.isArray(value)) {
    for (const item of value) collectGraphNodes(item, nodes);
    return nodes;
  }

  if (!isNodeObject(value)) return nodes;

  nodes.push(value);
  collectGraphNodes(value["@graph"], nodes);

  return nodes;
}

function getNodeTypes(node: Record<string, any>): string[] {
  const type = node["@type"];

  if (Array.isArray(type)) {
    return type.filter((entry): entry is string => typeof entry === "string");
  }

  return typeof type === "string" ? [type] : [];
}

function isDatasetNode(
  node: Record<string, any>,
  datasetType: string,
  prefixes: Prefixes,
): boolean {
  return getNodeTypes(node).some(
    (type) => expandIri(type, prefixes) === datasetType,
  );
}

/** True when the node carries data besides JSON-LD keywords. */
function hasDataProperties(node: Record<string, any>): boolean {
  return Object.keys(node).some((key) => !RESERVED_NODE_KEYS.has(key));
}

function selectRootNode(
  jsonLdData: Record<string, any>,
  prefixes: Prefixes,
): any {
  const rawGraph = jsonLdData?.["@graph"];
  const graph = Array.isArray(rawGraph) ? rawGraph : rawGraph ? [rawGraph] : [];

  if (graph.length === 0) {
    return jsonLdData;
  }

  const nodes = graph.filter(isNodeObject);
  const datasetType = expandIri("dcat:Dataset", prefixes);

  // Datasets can be nested inside named-graph wrappers, so search all
  // reachable graph nodes, including the document itself.
  const datasetNode = collectGraphNodes(jsonLdData).find((node) =>
    isDatasetNode(node, datasetType, prefixes),
  );

  if (datasetNode) return datasetNode;

  const namedNode = nodes.find(
    (node) => typeof node["@id"] === "string" && !node["@id"].startsWith("_:"),
  );

  return namedNode ?? nodes[0] ?? jsonLdData;
}

function indexGraph(jsonLdData: Record<string, any>): Map<string, any> {
  const byId = new Map<string, any>();

  // Insert the root first so a nested full node with the same `@id` wins over
  // an empty named-graph wrapper.
  if (typeof jsonLdData?.["@id"] === "string") {
    byId.set(jsonLdData["@id"], jsonLdData);
  }

  for (const node of collectGraphNodes(jsonLdData?.["@graph"])) {
    if (typeof node["@id"] === "string") {
      byId.set(node["@id"], node);
    }
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
 * Parses a Piveau metadata list document into a flat list of draft summaries.
 *
 * The document is normalized with `jsonld` before parsing, but this function
 * also accepts the raw shapes: top-level entries may be JSON-LD named graphs
 * (`{ "@id": ..., "@graph": [dataset, distribution, ...] }`) or plain nodes.
 */
export function parseDatasetListJsonLd(jsonLdData: any): DraftSummary[] {
  const data = jsonLdData?.json ?? jsonLdData ?? {};
  const context = data["@context"];
  const rawGraph = Array.isArray(data) ? data : (data?.["@graph"] ?? data);
  const graph = Array.isArray(rawGraph) ? rawGraph : rawGraph ? [rawGraph] : [];

  if (graph.length === 0) return [];

  const prefixes = buildPrefixes({ "@context": context });
  const datasetType = expandIri("dcat:Dataset", prefixes);

  // Use every reachable node so references between nodes (e.g. a dataset's
  // distributions) resolve, no matter whether the document is normalized into
  // one flat graph or still uses per-entry named graphs.
  const allNodes = collectGraphNodes(graph);
  const datasetNodes = allNodes.filter((node) =>
    isDatasetNode(node, datasetType, prefixes),
  );

  if (datasetNodes.length === 0) return [];

  // Prefer datasets with actual data over bare named-graph wrappers.
  const withData = datasetNodes.filter(hasDataProperties);
  const candidates = withData.length > 0 ? withData : datasetNodes;

  const summaries: DraftSummary[] = [];
  const seen = new Set<string>();

  for (const datasetNode of candidates) {
    const datasetId =
      typeof datasetNode["@id"] === "string" ? datasetNode["@id"] : undefined;

    // Put the dataset first so selectRootNode picks it, and drop nodes that
    // share its `@id` (the empty wrapper) so indexGraph keeps the real one.
    const nodes = [
      datasetNode,
      ...allNodes.filter(
        (node) =>
          node !== datasetNode && (!datasetId || node["@id"] !== datasetId),
      ),
    ];

    const parsed = parseDatasetJsonLd({
      "@context": context,
      "@graph": nodes,
    });

    const rawId = datasetId ?? parsed.id;
    if (typeof rawId !== "string") continue;

    const id = rawId.replace(PIVEAU_DATASET_URI_PREFIX, "");
    if (!id || seen.has(id)) continue;

    seen.add(id);
    summaries.push({ ...parsed, id });
  }

  return summaries;
}
