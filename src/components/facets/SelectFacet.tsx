import { Facet } from "./Facets";
import {SelectAutoComplete} from "@/components/facets/SelectAutoComplete";
import {useLocale} from "@/hooks/useLocale";
import {useSearchParams} from "next/navigation";
import {facetIds} from "@/lib/lang/facets";
import {useLicenses} from "@/hooks/useLicenses";

interface Props {
  facet: Facet
}

export default function SelectFacet({ facet }: Props) {
  const { translateDict, translateFacet } = useLocale();
  const { getLicenseOrUndefined } = useLicenses();
  const searchParams = useSearchParams();

  if (facet.id === "license") {
    facet.items = facet.items.map((item) => ({
      ...item,
      title: getLicenseOrUndefined(item.id)?.label || item.title,
    }))
  }

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow">
      <h3 className="font-semibold">{translateFacet(facet.id as facetIds) || translateDict(facet.title)}</h3>
      <SelectAutoComplete
        defaultValue={searchParams.getAll(facet.id) || []}
        facet={facet}
        showIcon={["categories", "keywords"].includes(facet.id)}
        onSelectAction={(value) => {
        const params = new URLSearchParams(window.location.search);

        if (!value) { return; }

        if (params.getAll(facet.id).includes(value)) {
          params.delete(facet.id, value);
        } else {
          params.append(facet.id, value);
        }

        window.history.replaceState({}, "", `?${params.toString()}`);
      }} />
    </div>
  )
}