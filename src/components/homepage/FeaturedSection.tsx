"use client";

import { Skeleton } from "../ui/skeleton";
import CompactDatasetCard from "../dataset/CompactDatasetCard";
import { Dataset } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface FeaturedSectionProps {
  title: string;
  queryResult: {
    isPending: boolean;
    data: Dataset[] | undefined;
  };
  autoplayOffset?: number;
}

export function FeaturedSection({
  title,
  queryResult,
  autoplayOffset = 0,
}: FeaturedSectionProps) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000 + autoplayOffset, stopOnInteraction: false }),
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="">
        <Carousel
          plugins={[autoplayPlugin.current]}
          opts={{
            loop: true,
            //slidesToScroll: 3, // Ratchets by exactly 3 items at a time
            align: "start",
          }}
          className="w-full"
        >
          <div className="flex justify-between px-3 pb-1">
            <h2 className="text-lg text-muted-foreground font-semibold">
              {title}
            </h2>
            <div className="space-x-3">
              <CarouselPrevious className="translate-0" />
              <CarouselNext className="translate-0" />
            </div>
          </div>
          <CarouselContent className="">
            {queryResult.isPending &&
              [...Array(10).keys()].map((_, index) => (
                <CarouselItem
                  key={"skeleton-" + index}
                  className="pl-3 md:basis-1/2 lg:basis-1/3 h-70"
                >
                  <Skeleton
                    className="rounded-2xl border h-70"
                    key={"skeleton-" + index}
                  ></Skeleton>
                </CarouselItem>
              ))}

            {queryResult.data &&
              queryResult.data.map((dataset) => (
                <CarouselItem
                  key={dataset.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3 h-70"
                >
                  <CompactDatasetCard dataset={dataset} />
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
