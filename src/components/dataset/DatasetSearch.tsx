"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaCatalog } from "@piveau/sdk-core/model";

import { useLocale } from "@/hooks/useLocale";

import BaseSearch from "@/components/BaseSearch";
import SearchTabSwitcher, { SearchTab } from "@/components/facets/SearchTabSwitcher";
import DatasetCard from "@/components/dataset/DatasetCard";
import DatasetCardSkeleton from "@/components/dataset/DatasetCardSkeleton";
import SortButton from "@/components/facets/SortButton";
import SearchFacet from "@/components/facets/SearchFacet";
import fixDatasetFacets from "@/lib/search";
import { trpc } from "@/app/_trpc/client";


interface Props {
  catalog?: StandardSchemaV1.InferOutput<typeof schemaCatalog>;
}

export default function DatasetSearch({ catalog }: Props) {
  const searchParams = useSearchParams();
  const { translations } = useLocale();
  const [facets, setFacets] = useState<Record<string, string[]>>();

  const search = trpc.search.useQuery({
    q: searchParams.get("q") || "",
    filters: "dataset",
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit") as string)
      : 10,
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 0,
    dataServices: searchParams.get("tab") == SearchTab.DATA_SERVICES,
    sort:
      searchParams.get("sort") ||
      "relevance+desc, modified+desc, title.en+asc",
    includes: [
      "id",
      "title",
      "description",
      "languages",
      "modified",
      "issued",
      "catalog.id",
      "catalog.title",
      "catalog.country.id",
      "distributions.id",
      "distributions.format.label",
      "distributions.format.id",
      "distributions.license",
      "categories.label",
      "keywords.label",
      "publisher",
    ],
    facets: {
      ...fixDatasetFacets(
        facets,
        searchParams.get("tab") as SearchTab,
        catalog
      ),
    },
  },
  {
    // nice-to-have flags
    // enabled: !!params.q,          // don’t fire until a term is present
    staleTime: 1000 * 60 * 5, // 5 min fresh cache
    retry: false, // or a number/function
  });

  useEffect(() => {
    const updateFacets = () => {
      console.log(
        "Updating facets with search params:",
        searchParams.toString(),
      );

      const params = new URLSearchParams(searchParams.toString());
      const newFacets: Record<string, string[]> = {};

      const nonFacetParams = ["q", "limit", "page", "sort", "tab"];
      if (!search.data?.facets) {
        // Force update of facets from URL if no facets are returned yet
        params.forEach((value, key) => {
          if (!nonFacetParams.includes(key)) {
            if (!newFacets[key]) {
              newFacets[key] = [];
            }
            newFacets[key].push(value);
          }
        });
      } else {
        search.data?.facets.map((facet) => {
          newFacets[facet.id] = params.getAll(facet.id);
        });
      }

      setFacets(newFacets);
    };

    updateFacets();
  }, [searchParams]);

  return (
    <BaseSearch
      isPending={search.isPending}
      data={search.data}
      catalog={catalog}
      renderItem={(item) => (
        <DatasetCard key={"ds" + item.id} dataset={item} />
      )}
      placeholder={
        [...Array(10).keys()].map((index) => (
          <DatasetCardSkeleton key={"dss" + index} />
        ))
      }
      searchBar={
        <div className="flex flex-col w-full gap-2">
          <SearchFacet placeholder={translations.search.placeholder.datasets} />

          <div className="flex justify-between">
            <SearchTabSwitcher />
            <SortButton />
          </div>
        </div>
      }
    />
  )
}

