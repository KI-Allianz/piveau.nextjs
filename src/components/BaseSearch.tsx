import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { BadgeQuestionMark, LogIn } from "lucide-react";
import { Catalog } from "@piveau/sdk-core/model";
import { SearchResult } from "@piveau/sdk-core";

import Facets, { Facet } from "@/components/facets/Facets";
import SearchPagination from "@/components/SearchPagination";
import CatalogInfo from "@/components/dataset/CatalogInfo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import DatasetCard from "./dataset/DatasetCard";
import { signIn, useSession } from "next-auth/react";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { fixThemeUrl, useTheme } from "@/hooks/useTheme";
import { useLocale } from "@/hooks/useLocale";

interface BaseSearchProps<T> {
  isPending: boolean;
  data?: SearchResult<T>["result"];
  facets: Facet[];

  catalog?: Catalog;
  renderItem: (item: T) => ReactNode;
  placeholder: ReactNode;
  searchBar: ReactNode;
}

export default function BaseSearch<T>({
  isPending,
  data,
  facets,
  catalog,
  renderItem,
  placeholder,
  searchBar,
}: BaseSearchProps<T>) {
  const searchParams = useSearchParams();
  const session = useSession();
  const { locale, translations } = useLocale();
  const theme = useTheme();

  return (
    <div className="flex gap-5 pb-10">
      <div className="flex flex-col gap-6">
        {catalog && <CatalogInfo catalog={catalog} />}

        <Facets facets={facets} isPending={isPending} />
      </div>
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full">
        {searchBar}

        {isPending ? (
          placeholder
        ) : (
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
        {!AUTH_DISABLED && session.status !== "authenticated" && (
          <div className="w-full border-2 rounded-xl shadow-sm relative">
            <div className="pointer-events-none blur-md border">
              <DatasetCard
                dataset={{
                  id: "1",
                  title: {
                    en: "So many more datasets are available after logging in!",
                    de: "Nach dem Einloggen sind noch viel mehr Datensätze verfügbar!",
                  },
                  description: {
                    en: "This is an example dataset. Please log in to see more datasets. This is an example dataset. Please log in to see more datasets. This is an example dataset. Please log in to see more datasets.",
                    de: "Dies ist ein Beispiel-Datensatz. Bitte melden Sie sich an, um weitere Datensätze zu sehen. Dies ist ein Beispiel-Datensatz. Bitte melden Sie sich an, um weitere Datensätze zu sehen. Dies ist ein Beispiel-Datensatz.",
                  },
                  modified: new Date().toISOString(),
                  publisher: {
                    name: "Example Publisher",
                    homepage: "https://example.com",
                  },
                  catalog: {
                    id: "example-catalog",
                    title: {
                      en: "Example Catalog",
                    },
                  },
                }}
              />
            </div>

            <div className="absolute flex w-full h-full items-center justify-center top-0 left-0">
              <Button
                variant={"default"}
                onClick={() => {
                  signIn("keycloak", {
                    callbackUrl: fixThemeUrl(`/${locale}`, theme),
                  }).then();
                }}
              >
                <LogIn /> {translations.search.loginToSeeMore}
              </Button>
            </div>
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
