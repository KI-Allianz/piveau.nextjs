import { StandardSchemaV1 } from "@standard-schema/spec";
import { schemaDataset } from "@piveau/sdk-core/model";
import DistributionCard from "@/components/distributions/DistributionCard";
import { UrlCollection } from "@/lib/utils";

interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
  urls: UrlCollection;
}

export default function DatasetDetailsDistributions({ dataset, urls }: Props) {
  return (
    <div className="w-full">
      <div className="flex lg:grid grid-cols-2 flex-wrap gap-2 pb-10">
        {dataset.distributions?.map((distribution) => (
          <DistributionCard
            key={distribution.id}
            distribution={distribution}
            urls={urls}
          />
        ))}
      </div>
    </div>
  );
}
