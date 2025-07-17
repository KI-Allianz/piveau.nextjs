"use client";

import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaDataset } from "@piveau/sdk-core/model";
import { useLocale } from "@/hooks/useLocale";


interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default function DatasetDetailsHeader({ dataset }: Props) {
  const { translateDict } = useLocale();

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-center">
          <h1 className="text-4xl font-semibold">{translateDict(dataset.title)}</h1>
        </div>
      </div>
    </div>
  )
}