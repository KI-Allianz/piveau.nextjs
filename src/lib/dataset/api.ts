import { getResourceById } from "@piveau/sdk-core";
import {Dataset, UrlCollection} from "@/lib/utils";
import {parseRawDCAT} from "@/lib/dataset/parse";


export async function getDataset(datasetId: string, urls: UrlCollection): Promise<Dataset> {
  const response = await getResourceById<Dataset>({
    baseUrl: urls.SEARCH,
    resource: "datasets",
    id: datasetId,
  });

  return response.result
}

export async function getDatasetDirect(datasetId: string, urls: UrlCollection): Promise<any>// Promise<StandardSchemaV1.InferOutput<typeof schemaDataset>>
{
  const url = urls.REPO + `datasets/${datasetId}.jsonld`

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch dataset: ${res.statusText}`);
  }
  const data = await res.json();

  const schema = parseRawDCAT(data);

  console.log(schema)

  return schema;
}