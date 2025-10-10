import {Archive} from "lucide-react";
import {parseDate} from "@/lib/utils";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaCatalog} from "@piveau/sdk-core/model";
import {useLocale} from "@/hooks/useLocale";

interface Props {
  catalog: StandardSchemaV1.InferOutput<typeof schemaCatalog>
}

export default function CatalogInfo({ catalog }: Props) {
  const { translations, translateDict } = useLocale()

  return (
    <div className="space-y-2">
      <div>
        <Archive size={100} className="text-muted-foreground" />
      </div>

      <div>
        <h2 className="text-lg font-bold">
          {translateDict(catalog.title)}
        </h2>
        <p className="text-gray-600">
          {translateDict(catalog.description)}
        </p>
      </div>
      <div>
        <h2 className="font-bold">{translations.catalogue.languages}</h2>
        <p className="text-sm text-gray-600">
          {catalog.language?.map(lang => lang.label)}
        </p>
      </div>
      <div>
        <h2 className="font-bold">{translations.catalogue.created}</h2>
        <p className="text-sm text-gray-600">
          {parseDate(catalog.issued)?.toLocaleDateString()}
        </p>
      </div>
      <div>
        <h2 className="font-bold">{translations.catalogue.updated}</h2>
        <p className="text-sm text-gray-600">
          {parseDate(catalog.modified)?.toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}