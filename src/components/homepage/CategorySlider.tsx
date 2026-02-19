"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { getCategoryIcon } from "@/lib/icons";
import { supportedLocales, translateDict } from "@/lib/lang";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";

interface Props {
  locale: supportedLocales;
}

export function CategorySlider({ locale }: Props) {
  const search = trpc.categories.useQuery();

  return (
    <InfiniteSlider
      speed={120}
      speedOnHover={20}
      gap={24}
      className="py-2 rounded-4xl"
    >
      {search.data &&
        search.data.map((category) => (
          <Link
            href={`/${locale}/dataset/?categories=${category.id}`}
            key={category.id}
          >
            <div className="flex flex-col items-center w-40 p-4 bg-secondary justify-center rounded-2xl gap-2 aspect-square hover:scale-105 transition-transform cursor-pointer">
              <span className="text-(--main-accent-gradient) to-(--main-accent-gradient)">
                {getCategoryIcon(category.id, 32)}
              </span>

              <span className="mt-2 text-sm text-center">
                {translateDict("de", category.title)}
              </span>
            </div>
          </Link>
        ))}
    </InfiniteSlider>
  );
}
