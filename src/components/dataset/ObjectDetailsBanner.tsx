"use client";

import { Dataset } from "@/lib/utils";
import PublisherPopover from "@/components/dataset/PublisherPopover";
import CatalogBadge from "./CatalogBadge";
import DateBadge from "./DateBadge";
import ReportPopover from "./ReportPopover";

interface Props {
  data: Dataset;
  supportEmail?: string;
}

export default function ObjectDetailsBanner({ data, supportEmail }: Props) {
  return (
    <div className="flex justify-center py-5">
      <div className="flex flex-row justify-between items-center gap-4 bg-card border py-5 px-6 rounded-2xl w-fit">
        <div className="flex flex-row justify-between items-center gap-16">
          <CatalogBadge catalog={data.catalog} />
          <DateBadge modified={data.modified} issued={data.issued} />
          <PublisherPopover
            publisher={data.publisher}
            contact_point={data.contact_point}
          />
        </div>
        <ReportPopover supportEmail={supportEmail} />
      </div>
    </div>
  );
}
