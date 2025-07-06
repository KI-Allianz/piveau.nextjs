"use client";

import { useSearch } from "@/hooks/useSearch";
import Facets from "@/components/facets/Facets";
import SearchFacet from "@/components/facets/SearchFacet";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import DatasetCard from "@/app/_components/DatasetCard";
import DatasetCardSkeleton from "@/app/_components/DatasetCardSkeleton";

export default function DatasetSearch() {
  const searchParams = useSearchParams();
  const [facets, setFacets] = useState<Record<string, string[]>>()
  const { data, isPending } = useSearch({
    q: searchParams.get("q") || "",
    filter: "dataset",
    limit: 10,
    page: 0,
    dataServices: false,
    sort: "relevance+desc, modified+desc, title.en+asc",
    includes: [
      "id",
      "title.en",
      "description.en",
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
    facets: facets,

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
    <div className="flex gap-5">
      <Facets facets={data?.facets} />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <SearchFacet />

        {isPending ? [...Array(10).keys()].map(() => (
          <DatasetCardSkeleton />
        )) : (
          data?.results.map((result) => (
            <DatasetCard key={result.id} dataset={result} />
          ))
        )}
      </main>
    </div>
  );
}
