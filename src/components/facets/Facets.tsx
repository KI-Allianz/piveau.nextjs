import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import BoolFacet from "@/components/facets/BoolFacet";
import SelectFacet from "@/components/facets/SelectFacet";
import FacetSkeleton from "@/components/facets/FacetSkeleton";

export interface Facet {
  id: string;
  title: string;
  items: {
    id: string;
    title: string | Record<string, string>;
    count: number;
  }[];
}

interface FacetsProps {
  // Define any props if needed
  facets: Facet[];
  isPending: boolean;
}

const hiddenFacets = ["hvdCategory", "is_hvd", "dataScope", "scoring"];

export default function Facets({ facets, isPending }: FacetsProps) {
  const searchParams = useSearchParams();

  const extendedFacets = useMemo(() => {
    return (
      facets
        .filter((facet) => !hiddenFacets.includes(facet.id))
        // Rebuild facets to include selected items even if they were not returned by the search
        .map((facet) => {
          if (facet.items.length === 0) {
            const selectedItems = searchParams.getAll(facet.id);
            if (selectedItems.length > 0) {
              return {
                ...facet,
                items: selectedItems.map((item) => ({
                  id: item,
                  title: item,
                  count: 0,
                })),
              };
            }
          }
          return facet;
        })
        // Filter out facets that still have no items
        .filter((facet) => facet.items.length > 0)
    );
  }, [facets, searchParams]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {isPending
          ? [...Array(13).keys()].map((index) => <FacetSkeleton key={index} />)
          : extendedFacets.map((facet) => {
              if (facet.id.startsWith("is_")) {
                return <BoolFacet key={facet.id} facet={facet} />;
              } else {
                return <SelectFacet key={facet.id} facet={facet} />;
              }
            })}
      </div>
    </div>
  );
}
