import BoolFacet from "@/components/facets/BoolFacet";
import SelectFacet from "@/components/facets/SelectFacet";
import FacetSkeleton from "@/components/facets/FacetSkeleton";

export interface Facet {
  id: string
  title: string
  items: {
    id: string
    title: string | Record<string, string>
    count: number
  }[]
}

interface FacetsProps {
  // Define any props if needed
  facets: Facet[] | undefined
}

export default function Facets({ facets }: FacetsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Facets</h2>
      <p className="text-gray-600">
        Facets are used to filter search results based on various attributes.
      </p>
      <div className="flex flex-col gap-4">
        {!facets && (
          [...Array(13).keys()].map(() => (
            <FacetSkeleton />
          ))
        )}
        {facets?.map((facet) => {
          if (facet.id.startsWith("is_")) {
            return <BoolFacet key={facet.id} facet={facet} />
          } else {
            return <SelectFacet key={facet.id} facet={facet} />
          }
        })}
      </div>
    </div>
  );
}
