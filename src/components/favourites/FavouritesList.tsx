"use client"

import SortButton from "@/components/facets/SortButton";
import {useMemo} from "react";
import {useLocale} from "@/hooks/useLocale";
import DatasetCard from "@/components/dataset/DatasetCard";
import {useSearchParams} from "next/navigation";
import {Dataset} from "@/lib/utils";


export default function FavouritesList() {
  const { translateDict } = useLocale();
  const searchParams = useSearchParams();
  const localStorageKey = `favourite_datasets`;

  const favourites = useMemo(() => {
    if (typeof window === "undefined") return [];
    const favs = localStorage.getItem(localStorageKey);

    if (favs) {
      const favMap = JSON.parse(favs) as Record<string, Dataset>
      const favList = Object.values(favMap);

      // Sort
      return favList.sort((a, b) => {
        const sort = searchParams.get("sort") || "title_asc";
        console.log("Sorting favourites by", sort);
        if (sort === "title.en+asc, relevance+desc, modified+desc") {
          return translateDict(a.title).localeCompare(translateDict(b.title));
        } else if (sort === "title.en+desc, relevance+desc, modified+desc") {
          return translateDict(b.title).localeCompare(translateDict(a.title));
        }
        // } else if (sort === "date_asc") {
        //   return new Date(a.mo).getTime() - new Date(b.modified).getTime();
        // } else if (sort === "date_desc") {
        //   return new Date(b.modified).getTime() - new Date(a.modified).getTime();
        // }
        return 0;
      })
    }

    return [];
  }, [searchParams]);

  return (
    <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full">
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between">
          <SortButton />
        </div>
      </div>

      {favourites
        .map((fav) => (
        <DatasetCard key={"ds" + fav.id} dataset={fav} />
      ))}

    </main>
  )
}