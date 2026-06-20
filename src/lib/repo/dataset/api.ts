import {
  getResourceById,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core";
import { Dataset } from "@/lib/utils";
import { parseIntoDataset, parseRawDCAT } from "@/lib/repo/dataset/parse";
import { BACKEND_URLS } from "@/lib/urls";
import { canAccessObject } from "@/lib/repo/common/api";

export async function canAccessDataset(id: string, session: any) {
  const response = await getDataset(id);

  const isPublic =
    response.keywords?.some((k) => k.label.toLowerCase() === "public") || false;

  return canAccessObject(isPublic, session);
}

export async function getDataset(id: string): Promise<Dataset> {
  const response = await getResourceById<Dataset>({
    baseUrl: BACKEND_URLS.SEARCH,
    resource: "datasets",
    id: id,
  });

  return response.result;
}

export async function getDatasetCategories(): Promise<
  SearchResult<Dataset>["result"]["facets"][0]["items"]
> {
  try {
    const res = await searchResource<SearchResult<Dataset>>({
      baseUrl: BACKEND_URLS.SEARCH,
      params: {
        q: "",
        filters: "dataset",
        limit: 1,
        page: 0,
        includes: ["categories.label"],
      },
    });

    return (
      res.data.result.facets.find((facet) => facet.id === "categories")
        ?.items || []
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories from Search Hub Upstream");
  }
}

export async function getRawDataset(id: string, type: string) {
  try {
    const res = await fetch(`${BACKEND_URLS.REPO}datasets/${id}${type}`);
    const data = await res.text();

    return data;
  } catch (error) {
    console.error("Failed to fetch raw dataset:", error);
    throw new Error("Failed to fetch raw dataset from Repository Upstream");
  }
}

export async function getDatasetDirect(id: string): Promise<any> {
  // Promise<StandardSchemaV1.InferOutput<typeof schemaDataset>>
  const url = BACKEND_URLS.REPO + `datasets/${id}.jsonld`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch dataset: ${res.statusText}`);
  }
  const data = await res.json();

  let schema = await parseRawDCAT(data);
  const dataset = parseIntoDataset(schema);

  // console.log(dataset)

  return dataset;
}
