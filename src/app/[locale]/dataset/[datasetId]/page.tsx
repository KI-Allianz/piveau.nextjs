import { getResourceById } from "@piveau/sdk-core";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import DatasetDetailsHeader from "./_components/DatasetDetailsHeader";
import DatasetDetailsKeywords from "./_components/DatasetDetailsKeywords";
import DatasetDetailsDistributions from "./_components/DatasetDetailsDistributions";
import Header from "@/components/Header";
import React from "react";

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
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">

        <DatasetDetailsHeader dataset={response.result} />
        <DatasetDetailsKeywords dataset={response.result} />
        <DatasetDetailsDistributions dataset={response.result} />
      </div>
    </div>

  );
}
