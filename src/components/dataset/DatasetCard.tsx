import Link from "next/link";

import { useLocale } from "@/hooks/useLocale";
import { Dataset, isAIModel } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HtmlSnippet from "@/components/HTMLSnippet";
import CatalogBadge from "./CatalogBadge";
import PublisherPopover from "./PublisherPopover";
import DateBadge from "./DateBadge";
import { fixThemeUrl } from "@/hooks/useTheme";

interface Props {
  dataset: Dataset;
}

export default function DatasetCard({ dataset }: Props) {
  const { translateDict, translations, locale, theme } = useLocale();

  const isModel = isAIModel(dataset);
  const formatTags = [
    ...new Set(
      dataset.distributions
        ?.map((keyword) => keyword.format?.label)
        .filter((format) => format),
    ),
  ];

  return (
    <Card className="relative group w-full hover:border-primary hover:bg-card/60 transition-all duration-200 cursor-pointer gap-3">
      <CardHeader className="gap-3">
        <CardTitle>
          <h2 className="text-2xl text-wrap">
            <Link
              href={fixThemeUrl(
                `/${locale}/${isModel ? "model" : "dataset"}/${dataset.id}`,
                theme,
              )}
              className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
            >
              {translateDict(dataset.title)}
            </Link>
          </h2>
        </CardTitle>
        <div className="flex gap-2 items-center justify-between">
          <div className="relative z-10">
            <PublisherPopover
              publisher={dataset.publisher}
              contact_point={dataset.contact_point}
            />
          </div>
          <div className="flex gap-2 items-center">
            <DateBadge modified={dataset.modified} issued={dataset.issued} />
            <div className="relative z-10">
              <CatalogBadge catalog={dataset.catalog} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <CardDescription className="flex-2/3 snippet">
            <HtmlSnippet
              html={
                translateDict(dataset.description).slice(0, 205) +
                (translateDict(dataset.description).length > 205 ? "..." : "")
              }
            />
          </CardDescription>
          {(formatTags.length > 0 || isModel) && (
            <div className="flex flex-wrap gap-2 flex-1/3">
              {isModel && (
                <Badge
                  variant={"outline"}
                  className="bg-amber-100 dark:bg-amber-500 text-amber-800 dark:text-black border-amber-300"
                >
                  {translations.dataset.aiModel}
                </Badge>
              )}
              {formatTags.map((format) => (
                <Badge key={format} variant={"secondary"}>
                  {format}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}