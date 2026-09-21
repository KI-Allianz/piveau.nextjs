import { AxiosInstance } from "axios";
import z from "zod";
import { Catalog, schemaCatalog } from "@piveau/sdk-core/model";
import { StandardSchemaV1 } from "@standard-schema/spec";
import {
  getResourceById,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core";

import { BACKEND_URLS } from "@/lib/urls";
import { Catalogue } from "@/lib/utils";
import { SearchParamsSchema } from "@/server/schemas/search";
import { handleAxiosErrorForTRPC } from "../common/api";

export async function getCatalogue(
  id: string,
  axiosInstance?: AxiosInstance,
): Promise<Catalogue> {
  try {
    const response = await getResourceById<
      StandardSchemaV1.InferOutput<typeof schemaCatalog>
    >({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance,
      resource: "catalogues",
      id: id,
    });

    return response.result;
  } catch (error) {
    console.error("Failed to fetch catalogue:", error);
    handleAxiosErrorForTRPC(error);
  }
}

export async function searchCatalogues(
  params: z.infer<typeof SearchParamsSchema>,
  axiosInstance?: AxiosInstance,
) {
  try {
    const res = await searchResource<SearchResult<Catalog>>({
      baseUrl: BACKEND_URLS.SEARCH,
      axiosInstance,
      params: {
        ...params,
        filters: "catalogue",
        includes: [
          "id",
          "title",
          "description",
          "modified",
          "issued",
          "country",
          "count",
          "keywords.label",
        ],
      },
    });

    return res.data.result;
  } catch (error) {
    console.error("Failed to search categories:", error);
    handleAxiosErrorForTRPC(error);
  }
}
