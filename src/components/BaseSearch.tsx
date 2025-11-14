import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import {BadgeQuestionMark} from "lucide-react";
import {Catalog} from "@piveau/sdk-core/model";
import { SearchResult } from "@piveau/sdk-core";

import Facets from "@/components/facets/Facets";
import SearchPagination from "@/components/SearchPagination";
import CatalogInfo from "@/components/dataset/CatalogInfo";
import {Card, CardContent} from "@/components/ui/card";


interface BaseSearchProps<T> {
  isPending: boolean;
  data?: SearchResult<T>["result"];
  catalog?: Catalog
  renderItem: (item: T) => ReactNode;
  placeholder: ReactNode;
  searchBar: ReactNode;
}

export default function BaseSearch<T>({ isPending, data, catalog, renderItem, placeholder, searchBar }: BaseSearchProps<T>) {
  const searchParams = useSearchParams();

  return (
    <div className="flex gap-5 pb-10">
      <div className="flex flex-col gap-6">
        {catalog && <CatalogInfo catalog={catalog} />}

        <Facets facets={data?.facets} />
      </div>
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full">
        {searchBar}

        {isPending
          ? placeholder
          : (
            <div className="w-full">
              {data && data.results.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {data?.results.map((result) => renderItem(result))}
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