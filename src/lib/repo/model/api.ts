import { Dataset } from "@/lib/utils";
import { canAccessObject } from "@/lib/repo/common/api";
import { getDataset, getRawDataset } from "@/lib/repo/dataset/api";

export async function canAccessModel(datasetId: string, session: any) {
  const response = await getModel(datasetId);

  const isPublic =
    response.keywords?.some((k) => k.label.toLowerCase() === "public") || false;

  return canAccessObject(isPublic, session);
}

export async function getModel(datasetId: string): Promise<Dataset> {
  return await getDataset(datasetId);
}

export async function getRawModel(datasetId: string, type: string) {
  return await getRawDataset(datasetId, type);
}
