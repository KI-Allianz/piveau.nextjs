"use client";

import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {useLocale} from "@/hooks/useLocale";


interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default function DatasetDetailsCategories({ dataset }: Props) {
  const {locale, translateDict} = useLocale()

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {dataset.categories?.map((category) => (
          <Link key={category.id} href={`/${locale}?categories=${category.id}`} >
            <Badge variant={"outlineHover"}>
              <span className="">{translateDict(category.label)}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}