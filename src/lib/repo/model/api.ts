import { Dataset } from "@/lib/utils";
import { canAccessObject } from "@/lib/repo/common/api";
import {
  getDataset,
  getRawDataset,
  searchDatasets,
} from "@/lib/repo/dataset/api";
import { AxiosInstance } from "axios";

export async function canAccessModel(datasetId: string, session: any) {
  const response = await getModel(datasetId);

  const isPublic =
    response.keywords?.some((k) => k.label.toLowerCase() === "public") || false;

  return canAccessObject(isPublic, session);
}

export async function getModel(
  id: string,
  axiosInstance?: AxiosInstance,
): Promise<Dataset> {
  return await getDataset(id, axiosInstance);
}

export async function getFeaturedModels(axiosInstance?: AxiosInstance) {
  const res = await searchDatasets(
    {
      limit: 10,
      facets: { keywords: ["ai-model"] },
    },
    axiosInstance,
  );

  return res.results;
}

export async function getRawModel(datasetId: string, type: string) {
  return await getRawDataset(datasetId, type);
}
