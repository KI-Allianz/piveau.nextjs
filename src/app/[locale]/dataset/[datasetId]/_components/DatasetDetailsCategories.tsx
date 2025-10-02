"use client";

import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {useLocale} from "@/hooks/useLocale";
import { Dataset } from "@/lib/utils";


interface Props {
  dataset: Dataset;
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