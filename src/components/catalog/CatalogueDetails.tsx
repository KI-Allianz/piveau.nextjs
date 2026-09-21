"use client";

import { trpc } from "@/app/_trpc/client";
import DatasetSearch from "../dataset/DatasetSearch";

interface Props {
  id: string;
}

export default function CatalogueDetails({ id }: Props) {
  const { data } = trpc.catalogue.get.useQuery({ id });

  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
      <DatasetSearch catalog={data} />
    </div>
  );
}
