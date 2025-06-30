import {useLocale} from "@/hooks/useLocale";
import { Facet } from "./Facets";
import {SelectAutoComplete} from "@/components/facets/SelectAutoComplete";

interface Props {
  facet: Facet
}

export default function SelectFacet({ facet }: Props) {
  const { translate } = useLocale();

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow">
      <h3 className="font-semibold">{facet.title}</h3>
      <SelectAutoComplete facet={facet} />
    </div>
  )
}