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
        ...buildDatasetFacets(searchParams, catalog),
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
