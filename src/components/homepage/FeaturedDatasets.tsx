"use client";

import { trpc } from "@/app/_trpc/client";
import { useLocale } from "@/hooks/useLocale";
import { FeaturedSection } from "./FeaturedSection";

export function FeaturedDatasets() {
  const search = trpc.featured.dataset.useQuery();
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
