import BoolFacet from "@/components/facets/BoolFacet";
import SelectFacet from "@/components/facets/SelectFacet";
import FacetSkeleton from "@/components/facets/FacetSkeleton";
import {useSearchParams} from "next/navigation";

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
  facets: Facet[] | undefined;
}

const hiddenFacets = ["hvdCategory", "is_hvd", "dataScope", "scoring"];

export default function Facets({ facets }: FacetsProps) {
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {!facets &&
          [...Array(13).keys()].map((index) => <FacetSkeleton key={index} />)}
        {facets
          ?.filter((facet) => !hiddenFacets.includes(facet.id))
          .filter((facet) => facet.items.length > 1 || searchParams.getAll(facet.id).length > 0)
          .map((facet) => {
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
