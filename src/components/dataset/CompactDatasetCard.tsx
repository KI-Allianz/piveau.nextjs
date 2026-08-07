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
import HtmlSnippet from "@/components/HTMLSnippet";
import PublisherPopover from "./PublisherPopover";
import { fixThemeUrl } from "@/hooks/useTheme";
import { ProgressiveBlur } from "../core/progressive-blur";

interface Props {
  dataset: Dataset;
}

export default function CompactDatasetCard({ dataset }: Props) {
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
    <Link
      href={fixThemeUrl(
        `/${locale}/${isModel ? "model" : "dataset"}/${dataset.id}`,
        theme,
      )}
      className="w-full"
    >
      <Card className="w-full  h-full group hover:border-primary hover:bg-card/60 transition-all duration-200 cursor-pointer gap-3">
        <CardHeader className="gap-3">
          <CardTitle>
            <h2 className="text-xl text-wrap line-clamp-2">
              {translateDict(dataset.title)}
            </h2>
          </CardTitle>
          <div className="flex gap-2 items-center justify-between">
            <div onClick={(e) => e.preventDefault()}>
              <PublisherPopover
                publisher={dataset.publisher}
                contact_point={dataset.contact_point}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <ProgressiveBlur
            className="pointer-events-none absolute bottom-0 inset-x-0 h-[80%]"
            blurIntensity={0.25}
          />
          <div
            aria-hidden="true"
            className={[
              // Default gradient; adjust to your design system
              `pointer-events-none absolute inset-x-0 bottom-0 h-[80%]`,
              `bg-linear-to-t to-transparent from-card `,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <div className="flex flex-col gap-4">
            <CardDescription className="flex-2/3 snippet line-clamp-10">
              <HtmlSnippet
                html={
                  translateDict(dataset.description).slice(0, 205) +
                  (translateDict(dataset.description).length > 205 ? "..." : "")
                }
              />
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
