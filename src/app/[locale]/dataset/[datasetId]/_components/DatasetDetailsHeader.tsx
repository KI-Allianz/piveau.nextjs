"use client";

import { useLocale } from "@/hooks/useLocale";
import DatasetDetailsExportButton from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsExportButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Archive, ChevronLeft, Tag } from "lucide-react";
import DatasetDetailsDescription from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsDescription";
import React from "react";
import ExampleCodePopover from "@/components/dataset/ExampleCodePopover";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {Dataset, parseDate, UrlCollection } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";
import DatasetBreadcrumbs from "@/app/[locale]/dataset/[datasetId]/_components/DatasetBreadcrumbs";
import DatasetDetailsFavouriteButton from "@/app/[locale]/dataset/[datasetId]/_components/DatasetDetailsFavouriteButton";
import PublisherPopover from "@/components/dataset/PublisherPopover";

interface Props {
  dataset: Dataset;
  baseUrl: string;
  urls: UrlCollection;
}

export default function DatasetDetailsHeader({
  dataset,
  baseUrl,
  urls,
}: Props) {
  const { locale, translateDict, translations } = useLocale();
  const router = useRouter();

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-row gap-5 justify-between">
        <div className="flex space-x-2">
          <Button onClick={() => router.back()} variant="outline">
            <ChevronLeft />
            {translations.navigation.back}
          </Button>
          <DatasetBreadcrumbs dataset={dataset} />
        </div>

        <div className="space-x-2">
          <DatasetDetailsFavouriteButton dataset={dataset} />
          <ExampleCodePopover url={`${baseUrl}/de/dataset/${dataset.id}`} />
          <DatasetDetailsExportButton id={dataset.id} urls={urls} />
        </div>
      </div>

      <div className="pt-7">
        <h1 className="text-4xl font-semibold text-center">
          {translateDict(dataset.title)}
        </h1>
      </div>

      <div className="flex justify-center py-5">
        <div className="flex flex-row justify-between items-center gap-20 bg-card py-5 px-6 rounded-2xl w-fit">
          <Link
            href={`/${locale}/catalogues/${dataset.catalog.id}`}
            className="flex items-center gap-2 group font-bold transition-all duration-200 hover:bg-accent/30 cursor-pointer rounded-lg p-1"
          >
            <div className="bg-[#080efa] text-white p-1.5 rounded-xl w-fit group-hover:bg-blue-800 transition-all duration-200">
              <Archive size={18} />
            </div>
            {translateDict(dataset.catalog.title)}
          </Link>
          <div className="flex flex-col items-center">
            <span>
              {dataset.modified
                ? translations.dataset.lastModified
                : translations.dataset.issuedOn}
            </span>
            <span className="font-semibold">
              {dataset.modified
                ? parseDate(dataset.modified)?.toLocaleDateString()
                : parseDate(dataset.issued)?.toLocaleDateString()}
            </span>
          </div>
          <PublisherPopover dataset={dataset} />
        </div>
      </div>

      <div className="pt-3 flex flex-wrap gap-2">
        {dataset.keywords?.map((keyword) => (
          <Link key={keyword.id} href={`/${locale}?keywords=${keyword.id}`}>
            <Badge variant={"outlineHover"} className="flex items-center gap-2">
              <Tag />
              <span className="">{keyword.label}</span>
            </Badge>
          </Link>
        ))}
        {dataset.categories?.map((category) => (
          <Link key={category.id} href={`/${locale}?categories=${category.id}`}>
            <Badge variant={"outlineHover"} className="flex items-center gap-2">
              {getCategoryIcon(category.id)}
              <span className="">{translateDict(category.label)}</span>
            </Badge>
          </Link>
        ))}
      </div>

      <div>
        <DatasetDetailsDescription description={dataset.description} />
      </div>
    </div>
  );
}
