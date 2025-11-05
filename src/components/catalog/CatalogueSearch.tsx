"use client";

import { useSearch } from "@/hooks/useSearch";
import Facets from "@/components/facets/Facets";
import SearchFacet from "@/components/facets/SearchFacet";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CatalogCard from "./CatalogCard";
import CatalogCardSkeleton from "./CatalogCardSkeleton";
import { SearchTab } from "@/components/facets/SearchTabSwitcher";
import SearchPagination from "@/components/SearchPagination";
import { useLocale } from "@/hooks/useLocale";
import { UrlCollection } from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {BadgeQuestionMark} from "lucide-react";

export default function CatalogueSearch({ urls }: { urls: UrlCollection }) {
  const searchParams = useSearchParams();
  const { translations } = useLocale();
  const [facets, setFacets] = useState<Record<string, string[]>>();

  const fixFacets = (facets: Record<string, string[]> | undefined) => {
    const fixedFacets: Record<string, string[]> = {};
    if (!facets || Object.keys(facets).length === 0) {
      return fixedFacets;
    }

    return fixedFacets;
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
    <div className="flex gap-5 pb-10">
      <Facets facets={data?.facets} />
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full">
        <div className="flex flex-col w-full gap-2">
          <SearchFacet
            placeholder={translations.search.placeholder.catalogues}
          />
        </div>

        {isPending
          ? [...Array(10).keys()].map((index) => (
            <CatalogCardSkeleton key={"dss" + index} />
          ))
          : (
            <div className="w-full">
              {data && data.results.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {data?.results.map((result) => (
                    <CatalogCard key={"ds" + result.id} catalog={result} />
                  ))}
                </div>
              ) : (
                <Card className="grow">
                  <CardContent className="w-full flex gap-3 justify-center text-muted-foreground">
                    <BadgeQuestionMark />
                    No results found.
                  </CardContent>
                </Card>
              )}
            </div>
          )}

        {data && data.results.length > 0 && (
          <SearchPagination
            currentPage={
              searchParams.get("page")
                ? parseInt(searchParams.get("page") as string)
                : 0
            }
            totalPages={Math.ceil(
              ((data?.count as number | undefined) ?? 10) /
              (searchParams.get("limit")
                ? parseInt(searchParams.get("limit") as string)
                : 10),
            )}
            itemsPerPage={
              searchParams.get("limit")
                ? parseInt(searchParams.get("limit") as string)
                : 10
            }
          />
          )}
      </main>
    </div>
  );
}
