"use client";

import { trpc } from "@/app/_trpc/client";
import { useLocale } from "@/hooks/useLocale";
import { FeaturedSection } from "./FeaturedSection";

export function FeaturedModels() {
  const search = trpc.featured.models.useQuery();
  const { translations } = useLocale();

  return (
    <FeaturedSection
      title={translations.model.featured}
      queryResult={search}
      browseAllText={translations.model.browseAll}
      browseAllLink="dataset/?tab=models"
    />
  );
}
