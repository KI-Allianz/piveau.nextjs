import { SearchTab } from "@/components/facets/SearchTabSwitcher";
import { Catalog } from "@piveau/sdk-core/model";
import { aiModelKeywords } from "@/lib/utils";
import { Facet } from "@/components/facets/Facets";

export function buildDatasetFacets(
  params: URLSearchParams,
  catalog: Catalog | undefined,
) {
  const currentTab = params.get("tab") as SearchTab;
  const facetMap = rebuildFromSearchParams(params);

  if (currentTab === SearchTab.MODELS) {
    const currentKeywords = facetMap["keywords"];
    if (!currentKeywords || currentKeywords.length === 0) {
      facetMap["keywords"] = aiModelKeywords;
    } else {
      // If some keywords are already selected, we add the AI model keywords to them
      facetMap["keywords"] = [
        ...currentKeywords,
        ...aiModelKeywords.filter(
          (keyword) => !currentKeywords.includes(keyword),
        ),
      ];
    }
  }
  if (catalog) {
    facetMap["catalog"] = [catalog.id];
  }

  return facetMap;
}

export function extendReturnedFacets(
  facets: Facet[],
  params: URLSearchParams,
  catalog: Catalog | undefined,
) {
  const currentTab = params.get("tab") as SearchTab;

  return (
    facets
      // Remove catalog facet if catalog is selected via route
      .filter((facet) => !(facet.id === "catalog" && catalog))
      // Remove aiModelKeywords from keywords facet if on models tab
      .map((facet) => {
        if (facet.id === "keywords" && currentTab === SearchTab.MODELS) {
          return {
            ...facet,
            items: facet.items.filter(
              (item) => !aiModelKeywords.includes(item.id),
            ),
          };
        }
        return facet;
      })
  );
}

export const rebuildFromSearchParams = (params: URLSearchParams) => {
  console.log("Updating facets with search params:", params.toString());

  const newFacetMap: Record<string, string[]> = {};

  const nonFacetParams = ["q", "limit", "page", "sort", "tab"];
  params.forEach((value, key) => {
    if (!nonFacetParams.includes(key)) {
      if (!newFacetMap[key]) {
        newFacetMap[key] = [];
      }
      newFacetMap[key].push(value);
    }
  });

  return newFacetMap;
};
