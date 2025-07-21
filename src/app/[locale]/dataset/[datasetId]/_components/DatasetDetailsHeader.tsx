"use client";

import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaDataset } from "@piveau/sdk-core/model";
import { useLocale } from "@/hooks/useLocale";
import DatasetDetailsExportButton from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsExportButton";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ChevronLeft} from "lucide-react";


interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default function DatasetDetailsHeader({ dataset }: Props) {
  const { translateDict } = useLocale();
  const router = useRouter()

  return (
    <div className="w-full">
      <div className="flex flex-row gap-5">
        <Button onClick={() => router.back()} variant="outline">
          <ChevronLeft />
        </Button>
        <DatasetDetailsExportButton id={dataset.id} />
        <div className="flex items-center justify-center w-full">
          <h1 className="text-4xl font-semibold">
            {translateDict(dataset.title)}
          </h1>
        </div>
      </div>
    </div>
  )
}