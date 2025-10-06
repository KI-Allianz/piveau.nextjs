import DistributionCard from "@/components/distributions/DistributionCard";
import {Dataset, UrlCollection } from "@/lib/utils";

interface Props {
  dataset: Dataset;
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
