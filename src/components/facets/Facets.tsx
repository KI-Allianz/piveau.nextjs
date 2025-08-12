import BoolFacet from "@/components/facets/BoolFacet";
import SelectFacet from "@/components/facets/SelectFacet";
import FacetSkeleton from "@/components/facets/FacetSkeleton";
import { useLocale } from "@/hooks/useLocale";

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
  const { translations } = useLocale();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{translations.search.facets.title}</h2>
      <p className="text-gray-600">{translations.search.facets.description}</p>
      <div className="flex flex-col gap-4">
        {!facets &&
          [...Array(13).keys()].map((index) => <FacetSkeleton key={index} />)}
        {facets
          ?.filter((facet) => !hiddenFacets.includes(facet.id))
          .filter((facet) => facet.items.length > 1)
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
