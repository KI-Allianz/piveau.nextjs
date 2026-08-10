"use client";

import { DynamicSkeleton } from "../ui/skeleton";
import CompactDatasetCard from "../dataset/CompactDatasetCard";
import { useMediaQuery } from "usehooks-ts";
import { Dataset } from "@/lib/utils";

interface FeaturedSectionProps {
  title: string;
  // Accept the tRPC query result object directly
  queryResult: {
    isPending: boolean;
    data: Dataset[] | undefined;
  };
}

export function FeaturedSection({ title, queryResult }: FeaturedSectionProps) {
  const fits2 = useMediaQuery("(max-width: 1000px)");
  const fits1 = useMediaQuery("(max-width: 700px)");
  const amountOfCards = fits1 ? 1 : fits2 ? 2 : 3;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg text-muted-foreground font-semibold pl-3">
        {title}
      </h2>
      {queryResult.isPending ? (
        <div className="py-2 rounded-xl flex-1 justify-around flex gap-2 overflow-hidden">
          {[...Array(amountOfCards).keys()].map((_, index) => (
            <DynamicSkeleton
              className="w-full rounded-2xl border"
              key={"skeleton-" + index}
            >
              <span className="text-transparent">
                {Array.from({ length: 97 }).map((_, index) => "FILL\n")}
              </span>
            </DynamicSkeleton>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex justify-around py-2 gap-2 rounded-4xl">
          {queryResult.data &&
            queryResult.data
              ?.slice(0, amountOfCards)
              .map((dataset) => (
                <CompactDatasetCard dataset={dataset} key={dataset.id} />
              ))}
        </div>
      )}
    </div>
  );
}
