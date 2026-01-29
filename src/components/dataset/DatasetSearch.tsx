"use client";

import { useSearchParams } from "next/navigation";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaCatalog } from "@piveau/sdk-core/model";

import { useLocale } from "@/hooks/useLocale";
import { trpc } from "@/app/_trpc/client";

import BaseSearch from "@/components/BaseSearch";
import SearchTabSwitcher, {
  SearchTab,
} from "@/components/facets/SearchTabSwitcher";
import SortButton from "@/components/facets/SortButton";
import SearchFacet from "@/components/facets/SearchFacet";
import DatasetCard from "@/components/dataset/DatasetCard";
import DatasetCardSkeleton from "@/components/dataset/DatasetCardSkeleton";
import { buildDatasetFacets, extendReturnedFacets } from "@/lib/search";

interface Props {
  catalog?: StandardSchemaV1.InferOutput<typeof schemaCatalog>;
}

export default function DatasetSearch({ catalog }: Props) {
  const searchParams = useSearchParams();
  const { translations } = useLocale();

  const search = trpc.search.datasets.useQuery(
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
      facets: buildDatasetFacets(searchParams, catalog),
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
      facets={extendReturnedFacets(
        search.data?.facets || [],
        searchParams,
        catalog,
      )}
      catalog={catalog}
      renderItem={(item) => <DatasetCard key={"ds" + item.id} dataset={item} />}
      placeholder={[...Array(10).keys()].map((index) => (
        <DatasetCardSkeleton key={"dss" + index} />
      ))}
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
  );
}
