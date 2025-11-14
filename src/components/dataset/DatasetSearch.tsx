"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StandardSchemaV1 } from "@standard-schema/spec";
import {schemaCatalog} from "@piveau/sdk-core/model";

import {aiModelKeywords, UrlCollection} from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";
import { useSearch } from "@/hooks/useSearch";

import BaseSearch from "@/components/BaseSearch";
import SearchTabSwitcher, { SearchTab } from "@/components/facets/SearchTabSwitcher";
import DatasetCard from "@/components/dataset/DatasetCard";
import DatasetCardSkeleton from "@/components/dataset/DatasetCardSkeleton";
import SortButton from "@/components/facets/SortButton";
import SearchFacet from "@/components/facets/SearchFacet";


interface Props {
  catalog?: StandardSchemaV1.InferOutput<typeof schemaCatalog>;
  urls: UrlCollection;
}

export default function DatasetSearch({ catalog, urls }: Props) {
  const searchParams = useSearchParams();
  const { translations } = useLocale();
  const [facets, setFacets] = useState<Record<string, string[]>>();

  const fixFacets = (facets: Record<string, string[]> | undefined) => {
    const fixedFacets: Record<string, string[]> = {};

    // If no facets are available, we set default values based on the current tab and catalog
    if (!facets || Object.keys(facets).length === 0) {
      if (searchParams.get("tab") === SearchTab.MODELS) {
        // If no facets are available, we set a default value for AI Models
        fixedFacets["keywords"] = aiModelKeywords;
      }
      if (catalog) {
        // If no facets are available, we set a default value for the catalog
        fixedFacets["catalog"] = [catalog.id];
      }

      return fixedFacets;
    }

    // Otherwise, we copy the existing facets and fix specific ones if needed
    Object.entries(facets).forEach(([key, value]) => {
      if (
        value.length <= 0 &&
        key === "keywords" &&
        searchParams.get("tab") === SearchTab.MODELS
      ) {
        // If the format facet is empty, we set a default value for AI Models
        fixedFacets[key] = aiModelKeywords;
      } else if (catalog && key === "catalog") {
        // If no facets are available, we set a default value for the catalog
        fixedFacets[key] = [catalog.id];
      } else {
        fixedFacets[key] = value;
      }
    });

    return fixedFacets;
  };

  const { data, isPending } = useSearch({
    url: urls.SEARCH,
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
      searchParams.get("sort") || "relevance+desc, modified+desc, title.en+asc",
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
      ...fixFacets(facets),
    },

    //Debugging
    //wait: 2000
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
      if (!data?.facets) {
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
        data?.facets.map((facet) => {
          newFacets[facet.id] = params.getAll(facet.id);
        });
      }

      setFacets(newFacets);
    };

    updateFacets();
  }, [searchParams]);

  return (
    <BaseSearch
      isPending={isPending}
      data={data}
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

