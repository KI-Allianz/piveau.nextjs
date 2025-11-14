"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useSearch } from "@/hooks/useSearch";
import { useLocale } from "@/hooks/useLocale";
import { UrlCollection } from "@/lib/utils";

import CatalogCard from "@/components/catalog/CatalogCard";
import CatalogCardSkeleton from "@/components/catalog/CatalogCardSkeleton";
import BaseSearch from "@/components/BaseSearch";
import { SearchTab } from "@/components/facets/SearchTabSwitcher";
import SearchFacet from "@/components/facets/SearchFacet";


interface Props {
  urls: UrlCollection
}

export default function CatalogueSearch({ urls }: Props) {
  const searchParams = useSearchParams();
  const { translations } = useLocale();
  const [facets, setFacets] = useState<Record<string, string[]>>();

  const fixFacets = (facets: Record<string, string[]> | undefined) => {
    const fixedFacets: Record<string, string[]> = {};
    if (!facets || Object.keys(facets).length === 0) {
      return fixedFacets;
    }

    return facets;
  };

  const { data, isPending } = useSearch({
    url: urls.SEARCH,
    q: searchParams.get("q") || "",
    filters: "catalogue",
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit") as string)
      : 10,
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 0,
    dataServices: searchParams.get("tab") == SearchTab.DATA_SERVICES,
    sort: "relevance+desc, modified+desc, title.en+asc",
    includes: [
      "id",
      "title",
      "description",
      "modified",
      "issued",
      "country",
      "count",
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
      data?.facets.map((facet) => {
        newFacets[facet.id] = params.getAll(facet.id);
      });

      setFacets(newFacets);
    };

    updateFacets();
  }, [searchParams]);

  return (
    <BaseSearch
      isPending={isPending}
      data={data}
      renderItem={(item) => (
        <CatalogCard key={"ct" + item.id} catalog={item} />
      )}
      placeholder={
        [...Array(10).keys()].map((index) => (
          <CatalogCardSkeleton key={"dss" + index} />
        ))
      }
      searchBar={
        <div className="flex flex-col w-full gap-2">
          <SearchFacet placeholder={translations.search.placeholder.catalogues} />
        </div>
      }
    />
  )
}
