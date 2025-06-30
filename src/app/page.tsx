"use client";

import { useSearch } from "@/hooks/useSearch";
import { useLocale } from "@/hooks/useLocale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parse, parseISO } from "date-fns";
import HtmlSnippet from "@/components/HTMLSnippet";
import Facets from "@/components/facets/Facets";
import SearchFacet from "@/components/facets/SearchFacet";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString) {
    return new Date("2000-01-01");
  }

  let date = parseISO(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return parse(dateString, "yyyy-MM-dd", new Date());
}

export default function Home() {
  const { translate } = useLocale();

  const searchParams = useSearchParams();
  const [facets, setFacets] = useState<Record<string, string[]>>()
  const { data, isLoading, isPending } = useSearch({
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
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newFacets: Record<string, string[]> = {};
    data?.facets.map((facet) => {
      newFacets[facet.id] = params.getAll(facet.id);
    })
    setFacets(newFacets);
  }, [searchParams]);

  if (isPending) {
    return <div>Pending...</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
      <div className="flex gap-5">
        <Facets facets={data?.facets} />
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <SearchFacet />


          {data?.results.map((result) => (
            <Card
              key={result.id}
              className="w-full hover:border-primary hover:bg-card/60 transition-all duration-200 cursor-pointer"
            >
              <CardHeader>
                <CardTitle>
                  <h2 className="text-2xl text-wrap">
                    {translate(result.title)}
                  </h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-between">
                  <CardDescription className="flex-2/3">
                    <HtmlSnippet
                      html={
                        translate(result.description).slice(0, 205) +
                        (translate(result.description).length > 205 ? "..." : "")
                      }
                    />
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 flex-1/3">
                    <Badge>
                      {parseDate(result.issued)?.toLocaleDateString()}
                    </Badge>
                    <Badge>
                      {parseDate(result.modified)?.toLocaleDateString()}
                    </Badge>
                    {result.distributions
                      ?.map((keyword) => keyword.format?.label)
                      .filter((format) => format)
                      .map((format) => (
                        <Badge>{format}</Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
}
