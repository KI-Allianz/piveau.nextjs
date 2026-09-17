"use client";

import { trpc } from "@/app/_trpc/client";
import { useLocale } from "@/hooks/useLocale";
import { FeaturedSection } from "./FeaturedSection";

export function FeaturedDatasets() {
  const search = trpc.dataset.featured.useQuery();
  const { translations } = useLocale();

  return (
    <FeaturedSection
      title={translations.dataset.featured}
      queryResult={search}
      browseAllText={translations.dataset.browseAll}
      browseAllLink="dataset/"
    />
  );
}
