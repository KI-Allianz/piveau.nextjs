import { Facet } from "./Facets";
import {SelectAutoComplete} from "@/components/facets/SelectAutoComplete";
import {useLocale} from "@/hooks/useLocale";
import {useSearchParams} from "next/navigation";

interface Props {
  facet: Facet
}

export default function SelectFacet({ facet }: Props) {
  const { translateDict } = useLocale();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow">
      <h3 className="font-semibold">{translateDict(facet.title)}</h3>
      <SelectAutoComplete
        defaultValue={searchParams.getAll(facet.id) || []}
        facet={facet}
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