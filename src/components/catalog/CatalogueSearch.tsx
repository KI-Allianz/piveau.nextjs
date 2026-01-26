"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useLocale } from "@/hooks/useLocale";
import { trpc } from "@/app/_trpc/client";

import BaseSearch from "@/components/BaseSearch";
import CatalogCard from "@/components/catalog/CatalogCard";
import CatalogCardSkeleton from "@/components/catalog/CatalogCardSkeleton";
import { SearchTab } from "@/components/facets/SearchTabSwitcher";
import SearchFacet from "@/components/facets/SearchFacet";
import { rebuildFromSearchParams } from "@/lib/search";

export default function CatalogueSearch() {
  const searchParams = useSearchParams();
  const { translations } = useLocale();

  const search = trpc.search.useQuery(
    {
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
        ...rebuildFromSearchParams(searchParams),
      },
    },
    {
      // nice-to-have flags
      // enabled: !!params.q,          // don’t fire until a term is present
      staleTime: 1000 * 60 * 5, // 5 min fresh cache
      retry: false, // or a number/function
    },
  );

  return (
    <BaseSearch
      isPending={search.isPending}
      data={search.data}
      facets={search.data?.facets || []}
      renderItem={(item) => <CatalogCard key={"ct" + item.id} catalog={item} />}
      placeholder={[...Array(10).keys()].map((index) => (
        <CatalogCardSkeleton key={"dss" + index} />
      ))}
      searchBar={
        <div className="flex flex-col w-full gap-2">
          <SearchFacet
            placeholder={translations.search.placeholder.catalogues}
          />
        </div>
      }
    />
  );
}
