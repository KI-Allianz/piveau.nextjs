import {useLocale} from "@/hooks/useLocale";
import { Facet } from "./Facets";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";

interface Props {
  facet: Facet
}

export default function BoolFacet({ facet }: Props) {
  const { translate } = useLocale();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">{translate(facet.title)}</Label>
      </div>
    </div>
  )
}