import {useLocale} from "@/hooks/useLocale";
import BoolFacet from "@/components/facets/BoolFacet";
import SelectFacet from "@/components/facets/SelectFacet";

function isBoolFacet(facet: Facet): boolean {
  if (!facet || !facet.items || facet.items.length === 0) {
    return false;
  }

  const items = facet.items.map((item) => item.title)
  return items.includes("true") && items.includes("false");
}

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
  const { translate } = useLocale();


  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Facets</h2>
      <p className="text-gray-600">
        Facets are used to filter search results based on various attributes.
      </p>
      <div className="flex flex-col gap-4">
        {facets?.map((facet) => {
          if (isBoolFacet(facet)) {
            return <BoolFacet facet={facet} />
          } else {
            return <SelectFacet facet={facet} />
          }
        })}
      </div>
    </div>
  );
}
