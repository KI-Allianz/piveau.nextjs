import {
  getResourceById,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core";
import { Dataset } from "@/lib/utils";
import { parseIntoDataset, parseRawDCAT } from "@/lib/repo/dataset/parse";
import { BACKEND_URLS } from "@/lib/urls";
import { SearchParamsSchema } from "@/server/schemas/search";
import { handleAxiosErrorForTRPC } from "@/lib/repo/common/api";
import axios, { AxiosInstance } from "axios";
import z from "zod";

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
    handleAxiosErrorForTRPC(error);
  }
}

export async function getRawDataset(
  id: string,
  type: string,
  axiosInstance = axios.create(),
) {
  const response = await axiosInstance.get(
    `${BACKEND_URLS.REPO}datasets/${id}${type}`,
  );

  return await response.data;
}

export async function getRawDistribution(
  id: string,
  type: string,
  axiosInstance = axios.create(),
) {
  const response = await axiosInstance.get(
    `${BACKEND_URLS.REPO}distributions/${id}${type}`,
  );

  return await response.data;
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
    handleAxiosErrorForTRPC(error);
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
    handleAxiosErrorForTRPC(error);
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
