import {useLocale} from "@/hooks/useLocale";
import { Facet } from "./Facets";
import {Label} from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useSearchParams} from "next/navigation";
import {Badge} from "@/components/ui/badge";

function facetContains(facet: Facet, key: string): boolean {
  if (!facet || !facet.items || facet.items.length === 0) {
    return false;
  }

  const items = facet.items.map((item) => item.title)
  return items.includes(key);
}

interface Props {
  facet: Facet
}

export default function BoolFacet({ facet }: Props) {
  const { translateDict, translations } = useLocale();
  const searchParams = useSearchParams();

  return (
    <div className=" p-4 rounded-lg shadow">
      <div className="bg-card flex flex-col gap-4 justify-between">
        <Label htmlFor="airplane-mode">{translateDict(facet.title)}</Label>
        <Tabs
          defaultValue={searchParams.get(facet.id) == "true" ? "show" : searchParams.get(facet.id) == "false" ? "hide" : "ignore"}
          className=""
          onValueChange={(value) => {
            const params = new URLSearchParams(window.location.search);
            if (params.get(facet.id) !== value) {
              switch (value) {
                case "ignore":
                  params.delete(facet.id);
                  break;
                case "hide":
                  params.set(facet.id, "false");
                  break;
                case "show":
                  params.set(facet.id, "true");
                  break;
              }
              window.history.replaceState({}, "", `?${params.toString()}`);
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="ignore">{translations.search.facets.ignore}</TabsTrigger>
            <TabsTrigger disabled={(!searchParams.get(facet.id) || searchParams.get(facet.id) == "ignore") && !facetContains(facet, "false")} value="hide">
              {facet.items.filter((item) => item.id === "false").length > 0 ? (
                <Badge>
                  {facet.items.find((item) => item.id === "false")?.count}
                </Badge>
              ) : null}
              {translations.search.facets.hide}
            </TabsTrigger>
            <TabsTrigger disabled={(!searchParams.get(facet.id) || searchParams.get(facet.id) == "ignore") && !facetContains(facet, "true")} value="show">
              {facet.items.filter((item) => item.id === "true").length > 0 ? (
                <Badge>
                  {facet.items.find((item) => item.id === "true")?.count}
                </Badge>
              ) : null}
              {translations.search.facets.show}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}