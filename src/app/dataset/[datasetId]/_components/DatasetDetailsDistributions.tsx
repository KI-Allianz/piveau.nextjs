import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import DistributionCard from "@/components/distributions/DistributionCard";


interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default function DatasetDetailsDistributions({ dataset }: Props) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {dataset.distributions?.map((distribution) => (
          <DistributionCard key={distribution.id} distribution={distribution} />
        ))}
      </div>
    </div>
  )
}