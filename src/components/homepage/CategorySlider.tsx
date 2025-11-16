import { InfiniteSlider } from '@/components/ui/infinite-slider';
import {getCategoryIcon} from "@/lib/icons";
import { Dataset } from '@/lib/utils';
import { searchResource, SearchResult } from '@piveau/sdk-core';
import {supportedLocales, translateDict} from "@/lib/lang";
import Link from "next/link";


interface Props {
  locale: supportedLocales;
}

export async function CategorySlider({ locale }: Props) {

  const res = await searchResource<SearchResult<Dataset>>({
    baseUrl: process.env.SEARCH_HUB_URL!,
    params: {
      q: "",
      filters: "dataset",
      limit: 1,
      page: 0,
      includes: [
        "categories.label",
      ]
    },
  });

  let categories = res.data.result.facets.find((facet) => facet.id === 'categories');
  if (!categories) {
    return null;
  }

  return (
    <InfiniteSlider speed={120} speedOnHover={20} gap={24} className="py-2 rounded-4xl">
      {categories.items.map((category) => (
        <Link href={`/${locale}/dataset/?categories=${category.id}`} key={category.id} >
          <div className='flex flex-col items-center w-40 p-4 bg-secondary justify-center rounded-2xl gap-2 aspect-square hover:scale-105 transition-transform cursor-pointer'>
          <span className="text-[var(--main-accent-gradient)] to-[var(--main-accent-gradient)]">
            {getCategoryIcon(category.id, 32)}
          </span>

            <span className='mt-2 text-sm text-center'>{translateDict("de", category.title)}</span>
          </div>
        </Link>
      ))}
    </InfiniteSlider>
  );
}
