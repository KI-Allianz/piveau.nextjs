"use client";

import { Archive, SearchIcon } from "lucide-react";

import { useLocale } from "@/hooks/useLocale";
import { Dataset } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fixThemeUrl } from "@/hooks/useTheme";

interface Props {
  dataset: Dataset;
  isAiModel?: boolean;
}

export default function DatasetBreadcrumbs({
  dataset,
  isAiModel = false,
}: Props) {
  const { locale, translateDict, translations, theme } = useLocale();

  return (
    <div className="w-fit space-y-3">
      <Breadcrumb>
        <BreadcrumbList className="bg-background rounded-md border px-3 py-2 shadow-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href={fixThemeUrl(`/${locale}/`, theme)}>
              <SearchIcon size={16} aria-hidden="true" />
              <span className="sr-only">Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={fixThemeUrl(
                `/${locale}/catalogues/${dataset.catalog.id}`,
                theme,
              )}
              className="flex gap-2 items-center"
            >
              <Archive size={16} />
              {translateDict(dataset.catalog.title)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isAiModel
                ? translations.search.tabs.aiModels
                : translations.search.tabs.datasets}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
