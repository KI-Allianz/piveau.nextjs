import {SearchTab} from "@/components/facets/SearchTabSwitcher";
import {Catalog} from "@piveau/sdk-core/model";
import {aiModelKeywords} from "@/lib/utils";


export default function fixDatasetFacets(facets: Record<string, string[]> | undefined, currentTab: SearchTab, catalog: Catalog | undefined) {
  const fixedFacets: Record<string, string[]> = {};

  // If no facets are available, we set default values based on the current tab and catalog
  if (!facets || Object.keys(facets).length === 0) {
    if (currentTab === SearchTab.MODELS) {
      // If no facets are available, we set a default value for AI Models
      fixedFacets["keywords"] = aiModelKeywords;
    }
    if (catalog) {
      // If no facets are available, we set a default value for the catalog
      fixedFacets["catalog"] = [catalog.id];
    }

    return fixedFacets;
  }

  // Otherwise, we copy the existing facets and fix specific ones if needed
  Object.entries(facets).forEach(([key, value]) => {
    if (
      value.length <= 0 &&
      key === "keywords" &&
      currentTab === SearchTab.MODELS
    ) {
      // If the format facet is empty, we set a default value for AI Models
      fixedFacets[key] = aiModelKeywords;
    } else if (catalog && key === "catalog") {
      // If no facets are available, we set a default value for the catalog
      fixedFacets[key] = [catalog.id];
    } else {
      fixedFacets[key] = value;
    }
  });

  return fixedFacets;
};