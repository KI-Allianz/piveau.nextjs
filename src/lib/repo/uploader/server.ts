import { AxiosInstance } from "axios";

import { BACKEND_URLS } from "@/lib/urls";

/**
 * Removes every file belonging to a dataset from the uploader service.
 *
 * Must be called before the dataset itself is deleted: the uploader derives
 * permissions from the dataset, so once the dataset is gone the files can no
 * longer be removed.
 */
export async function deleteAllDatasetFiles(
  datasetId: string,
  axiosInstance: AxiosInstance,
): Promise<void> {
  const base = BACKEND_URLS.UPLOAD.replace(/\/$/, "");
  await axiosInstance.delete(`${base}/api/datasets/${datasetId}/all-files`);
}
