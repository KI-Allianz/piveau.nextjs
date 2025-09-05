"use client";

import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaDataset } from "@piveau/sdk-core/model";
import { useLocale } from "@/hooks/useLocale";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Archive, SearchIcon} from "lucide-react";


interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default function DatasetBreadcrumbs({ dataset }: Props) {
  const { locale, translateDict } = useLocale()

  return (
    <div className="w-fit space-y-3">
      <Breadcrumb>
        <BreadcrumbList className="bg-background rounded-md border px-3 py-2 shadow-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>
              <SearchIcon size={16} aria-hidden="true" />
              <span className="sr-only">Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/catalogues/${dataset.catalog.id}`} className="flex gap-2 items-center">
              <Archive size={16} />
              {translateDict(dataset.catalog.title)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dataset</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}