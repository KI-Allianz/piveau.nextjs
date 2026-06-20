import { Dataset, UrlCollection } from "@/lib/utils";

import DistributionCard from "@/components/distributions/DistributionCard";

interface Props {
  dataset: Dataset;
}

export default function DatasetDetailsDistributions({ dataset }: Props) {
  return (
    <div className="w-full">
      <div className="flex lg:grid grid-cols-2 flex-wrap gap-2 pb-10">
        {dataset.distributions?.map((distribution) => (
          <DistributionCard key={distribution.id} distribution={distribution} />
        ))}
      </div>
    </div>
  );
}
