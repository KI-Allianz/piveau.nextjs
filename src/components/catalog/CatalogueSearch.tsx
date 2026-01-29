"use client";

import { useSearchParams } from "next/navigation";

import { useLocale } from "@/hooks/useLocale";
import { trpc } from "@/app/_trpc/client";

import BaseSearch from "@/components/BaseSearch";
import CatalogCard from "@/components/catalog/CatalogCard";
import CatalogCardSkeleton from "@/components/catalog/CatalogCardSkeleton";
import { SearchTab } from "@/components/facets/SearchTabSwitcher";
import SearchFacet from "@/components/facets/SearchFacet";
import { rebuildFromSearchParams } from "@/lib/search";
import SortButton from "../facets/SortButton";

export default function CatalogueSearch() {
  const searchParams = useSearchParams();
  const { translations } = useLocale();

  const search = trpc.search.catalogs.useQuery(
    {
      q: searchParams.get("q") || "",
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
      facets: rebuildFromSearchParams(searchParams),
    },
    {
      staleTime: 1000 * 60 * 5, // 5 min fresh cache
      retry: false,
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
        <div className="flex items-center w-full gap-2">
          <SearchFacet
            placeholder={translations.search.placeholder.catalogues}
          />
          <SortButton className="h-9 p-5" />
        </div>
      }
    />
  );
}
