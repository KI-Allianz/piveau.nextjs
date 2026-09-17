"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Tag } from "lucide-react";
import Link from "next/link";

import { useLocale } from "@/hooks/useLocale";
import { Dataset, isAIModel } from "@/lib/utils";
import { extractParserRepository } from "@/lib/code/examples";
import { getCategoryIcon } from "@/lib/icons";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ObjectDetailsExportButton from "@/components/dataset/ObjectDetailsExportButton";
import DatasetDetailsDescription from "@/components/dataset/DatasetDetailsDescription";
import ExampleCodePopover from "@/components/dataset/ExampleCodePopover";
import DatasetBreadcrumbs from "@/components/dataset/DatasetBreadcrumbs";
import DatasetDetailsFavouriteButton from "@/components/dataset/DatasetDetailsFavouriteButton";
import { fixThemeUrl, getCleanUrl } from "@/hooks/useTheme";
import ObjectDetailsBanner from "./ObjectDetailsBanner";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data?: Dataset;
  baseUrl: string;
  supportEmail?: string;
  isAiModel: boolean;
}

export default function DatasetDetailsHeader({
  data,
  baseUrl,
  supportEmail,
  isAiModel,
}: Props) {
  const { locale, translateDict, translations, theme } = useLocale();
  const router = useRouter();
  const type = isAiModel ? "model" : "dataset";

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-row gap-5 justify-between">
        <div className="flex space-x-2">
          <Button onClick={() => router.back()} variant="outline">
            <ChevronLeft />
            {translations.navigation.back}
          </Button>
          <DatasetBreadcrumbs dataset={data} isAiModel={isAiModel} />
        </div>

        <div className="space-x-2">
          <DatasetDetailsFavouriteButton dataset={data} />
          <ExampleCodePopover
            isLoading={!data}
            url={getCleanUrl(`${baseUrl}/de/${type}/${data?.id}`)}
            customParser={
              isAiModel
                ? extractParserRepository(translateDict, data)
                : undefined
            }
            isAIModel={!data || isAIModel(data)}
          />

          <ObjectDetailsExportButton id={data?.id} type={type} />
        </div>
      </div>

      <div className="pt-7">
        <h1 className="text-4xl font-semibold text-center items-center flex flex-col">
          {!data ? (
            <Skeleton className="h-10 w-2/3 bg-muted-foreground/30" />
          ) : (
            translateDict(data?.title)
          )}
        </h1>
      </div>

      <ObjectDetailsBanner data={data} supportEmail={supportEmail} />

      <div className="pt-3 flex flex-wrap gap-2">
        {!data &&
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-5 w-32 bg-muted-foreground/30 border border-black/10"
            />
          ))}{" "}
        {data?.keywords?.map((keyword) => (
          <Link
            key={keyword.id}
            href={fixThemeUrl(
              `/${locale}/dataset?keywords=${keyword.id}`,
              theme,
            )}
          >
            <Badge
              variant={"secondaryHover"}
              className="flex items-center gap-2"
            >
              <Tag />
              <span className="">{keyword.label}</span>
            </Badge>
          </Link>
        ))}
        {data?.categories?.map((category) => (
          <Link
            key={category.id}
            href={fixThemeUrl(
              `/${locale}/dataset?categories=${category.id}`,
              theme,
            )}
          >
            <Badge
              variant={"secondaryHover"}
              className="flex items-center gap-2"
            >
              {getCategoryIcon(category.id)}
              <span className="">{translateDict(category.label)}</span>
            </Badge>
          </Link>
        ))}
      </div>

      <div>
        {!data ? (
          <div className="flex justify-center">
            <Skeleton className="h-20 w-[90%] bg-muted-foreground/30" />
          </div>
        ) : (
          <DatasetDetailsDescription description={data?.description} />
        )}
      </div>
    </div>
  );
}
