"use client";

import { useSearch } from "@/hooks/useSearch";
import Facets from "@/components/facets/Facets";
import SearchFacet from "@/components/facets/SearchFacet";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import DatasetCard from "./DatasetCard";
import DatasetCardSkeleton from "./DatasetCardSkeleton";
import SearchTabSwitcher from "@/components/facets/SearchTabSwitcher";

export default function DatasetSearch() {
  const searchParams = useSearchParams();
  const [facets, setFacets] = useState<Record<string, string[]>>()
  const { data, isPending } = useSearch({
    q: searchParams.get("q") || "",
    filter: "dataset",
    limit: 10,
    page: 0,
    dataServices: searchParams.get("tab") == "dataServices",
    sort: "relevance+desc, modified+desc, title.en+asc",
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
      "publisher",
    ],
    facets: {
      ...facets
    },

    //Debugging
    //wait: 2000
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newFacets: Record<string, string[]> = {};
    data?.facets.map((facet) => {
      newFacets[facet.id] = params.getAll(facet.id);
    })
    setFacets(newFacets);
  }, [searchParams]);

  return (
    <div className="flex gap-5 pb-10">
      <Facets facets={data?.facets} />
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full">
        <div className="flex flex-col w-full gap-2">
          <SearchFacet />
          <SearchTabSwitcher />
        </div>

        {isPending ? [...Array(10).keys()].map((index) => (
          <DatasetCardSkeleton key={"dss" + index} />
        )) : (
          data?.results.map((result) => (
            <DatasetCard key={"ds" + result.id} dataset={result} />
          ))
        )}
      </main>
    </div>
  );
}
