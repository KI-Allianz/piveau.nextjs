import { Archive } from "lucide-react";
import Link from "next/link";
import { Dataset } from "@piveau/sdk-core";

import { useLocale } from "@/hooks/useLocale";
import { fixThemeUrl } from "@/hooks/useTheme";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Skeleton } from "../ui/skeleton";

interface Props {
  catalog?: Dataset["catalog"];
}

export default function CatalogBadge({ catalog }: Props) {
  const { locale, translateDict, translations, theme } = useLocale();

  return (
    <Link
      href={fixThemeUrl(`/${locale}/catalogues/${catalog?.id}`, theme)}
      className="w-fit min-w-fit"
    >
      <Tooltip delayDuration={200}>
        <TooltipContent side="bottom">
          <p>{translateDict(catalog?.title)}</p>
        </TooltipContent>
        <TooltipTrigger className="flex items-center gap-2 group transition-all duration-200 hover:bg-secondary cursor-pointer rounded-lg p-1">
          <div className="bg-(--main-accent) text-white p-1.5 rounded-xl w-fit group-hover:bg-(--main-accent)/80 transition-all duration-200">
            <Archive className="size-4 sm:size-5 md:size-6" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs md:text-sm text-muted-foreground -mb-0.5">
              {translations.dataset.providedBy}
            </span>
            <span className="font-semibold line-clamp-1 text-sm md:text-base text-start">
              {!catalog ? (
                <Skeleton className="h-4 w-32 bg-muted-foreground/30 mt-1" />
              ) : (
                translateDict(catalog?.title).slice(0, 30) +
                (translateDict(catalog?.title).length > 30 ? "..." : "")
              )}
            </span>
          </div>
        </TooltipTrigger>
      </Tooltip>
    </Link>
  );
}
