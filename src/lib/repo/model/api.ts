import { Dataset } from "@/lib/utils";
import {
  getDataset,
  getRawDataset,
  searchDatasets,
} from "@/lib/repo/dataset/api";
import axios, { AxiosInstance } from "axios";

export async function getModel(
  id: string,
  axiosInstance?: AxiosInstance,
): Promise<Dataset> {
  return await getDataset(id, axiosInstance);
}

export async function getRawModel(
  id: string,
  type: string,
  axiosInstance = axios.create(),
) {
  return await getRawDataset(id, type, axiosInstance);
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
