import { getResourceById } from "@piveau/sdk-core";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import DatasetDetailsHeader from "@/app/dataset/[datasetId]/_components/DatasetDetailsHeader";
import DatasetDetailsKeywords from "@/app/dataset/[datasetId]/_components/DatasetDetailsKeywords";
import DatasetDetailsDistributions from "@/app/dataset/[datasetId]/_components/DatasetDetailsDistributions";

interface Props {
  params: Promise<{datasetId: string}>;
}

export default async function DatasetPage({ params }: Props) {

  const { datasetId } = await params;
  const response = await getResourceById<StandardSchemaV1.InferOutput<typeof schemaDataset>>({
    baseUrl: 'https://piveau.hlrs.de/hub/search/',
    resource: 'datasets',
    id: datasetId,
  })

  // console.log(response.result)

  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">

      <DatasetDetailsHeader dataset={response.result} />
      <DatasetDetailsKeywords dataset={response.result} />
      <DatasetDetailsDistributions dataset={response.result} />
    </div>
  );
}
