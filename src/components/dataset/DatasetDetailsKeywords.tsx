"use client";

import Link from "next/link";

import { useLocale } from "@/hooks/useLocale";
import { Dataset } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

interface Props {
  dataset: Dataset;
}

export default function DatasetDetailsKeywords({ dataset }: Props) {
  const { locale } = useLocale();

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {dataset.keywords?.map((keyword) => (
          <Link key={keyword.id} href={`/${locale}?keywords=${keyword.id}`}>
            <Badge variant={"outlineHover"}>
              <span className="">{keyword.label}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
