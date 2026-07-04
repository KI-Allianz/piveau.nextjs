"use client";

import { Dataset } from "@/lib/utils";
import PublisherPopover from "@/components/dataset/PublisherPopover";
import CatalogBadge from "./CatalogBadge";
import DateBadge from "./DateBadge";

interface Props {
  data: Dataset;
}

export default function ObjectDetailsBanner({ data: dataset }: Props) {
  return (
    <div className="flex justify-center py-5">
      <div className="flex flex-row justify-between items-center gap-20 bg-card border py-5 px-6 rounded-2xl w-fit">
        <CatalogBadge catalog={dataset.catalog} />
        <DateBadge modified={dataset.modified} issued={dataset.issued} />
        <PublisherPopover
          publisher={dataset.publisher}
          contact_point={dataset.contact_point}
        />
      </div>
    </div>
  );
}
