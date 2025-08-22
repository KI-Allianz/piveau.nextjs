"use client";

import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaDataset } from "@piveau/sdk-core/model";
import { useLocale } from "@/hooks/useLocale";
import DatasetDetailsExportButton from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsExportButton";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ChevronLeft} from "lucide-react";
import DatasetDetailsKeywords from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsKeywords";
import DatasetDetailsCategories from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsCategories";
import DatasetDetailsDescription from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsDescription";
import React from "react";
import ExampleCodePopover from "@/components/dataset/ExampleCodePopover";


interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
  baseUrl: string;
}

export default function DatasetDetailsHeader({ dataset, baseUrl }: Props) {
  const { translateDict } = useLocale();
  const router = useRouter()

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-row gap-5 justify-between">
        <Button onClick={() => router.back()} variant="outline">
          <ChevronLeft />
          Back
        </Button>

        <h1 className="text-4xl font-semibold text-center">
          {translateDict(dataset.title)}
        </h1>

        <div className="space-x-2">
          <ExampleCodePopover url={`${baseUrl}/de/dataset/${dataset.id}`} />
          <DatasetDetailsExportButton id={dataset.id} />
        </div>
      </div>

      <div className="pt-3 flex flex-col gap-2">
        <DatasetDetailsKeywords dataset={dataset} />
        <DatasetDetailsCategories dataset={dataset} />
      </div>

      <div>
        <DatasetDetailsDescription description={dataset.description} />
      </div>
    </div>
  )
}