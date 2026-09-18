import {
  getResourceById,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core";
import { Dataset } from "@/lib/utils";
import { parseIntoDataset, parseRawDCAT } from "@/lib/repo/dataset/parse";
import { BACKEND_URLS } from "@/lib/urls";
import { SearchParamsSchema } from "@/server/schemas/search";
import { canAccessObject, handleAxiosError } from "@/lib/repo/common/api";
import { AxiosInstance } from "axios";
import z from "zod";

export async function canAccessDataset(id: string, session: any) {
  const response = await getDataset(id);

  const isPublic =
    response.keywords?.some((k) => k.label.toLowerCase() === "public") || false;

  return canAccessObject(isPublic, session);
}

export async function getDataset(
  id: string,
  axiosInstance?: AxiosInstance,
): Promise<Dataset> {
  try {
    const response = await getResourceById<Dataset>({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance: axiosInstance,
      resource: "datasets",
      id: id,
    });

    return response.result;
  } catch (error) {
    console.error("Failed to fetch dataset:", error);
    handleAxiosError(error);
  }
}

export async function searchDatasets(
  params: z.infer<typeof SearchParamsSchema>,
  axiosInstance?: AxiosInstance,
) {
  try {
    const res = await searchResource<SearchResult<Dataset>>({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance,
      params: {
        ...params,
        filters: "dataset",
        includes: [
          "id",
          "title",
          "description",
          "languages",
          "modified",
          "issued",
          "catalog.id",
          "catalog.title",
          "catalog.country.id",
          "distributions.id",
          "distributions.format.label",
          "distributions.format.id",
          "distributions.license",
          "categories.label",
          "keywords.label",
          "publisher",
        ],
      },
    });

    return res.data.result;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    handleAxiosError(error);
  }
}

export async function getDatasetCategories(
  axiosInstance?: AxiosInstance,
): Promise<SearchResult<Dataset>["result"]["facets"][0]["items"]> {
  try {
    const res = await searchResource<SearchResult<Dataset>>({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance,
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
    handleAxiosError(error);
  }
}

export async function getFeaturedDatasets(axiosInstance?: AxiosInstance) {
  const res = await searchDatasets(
    {
      limit: 10,
    },
    axiosInstance,
  );

  return res.results;
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
