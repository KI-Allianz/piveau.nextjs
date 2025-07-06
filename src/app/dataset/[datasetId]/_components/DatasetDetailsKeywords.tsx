import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import {Badge} from "@/components/ui/badge";


interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default async function DatasetDetailsKeywords({ dataset }: Props) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {dataset.keywords?.map((keyword) => (
          <Badge key={keyword.id} variant={"outline"}>
            <span className="">{keyword.label}</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}