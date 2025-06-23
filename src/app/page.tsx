import {z} from "zod";
import {schemaDataset} from "@piveau/sdk-core/model";
import {searchResource, SearchResult} from "@piveau/sdk-core";
import type { StandardSchemaV1 } from '@standard-schema/spec'



export default async function Home() {

  const response = await searchResource<SearchResult<StandardSchemaV1.InferOutput<typeof schemaDataset>>>({
    baseUrl: "https://piveau.hlrs.de/hub/search/",
    params: {
      q: 'test',
      filter: 'dataset',
      limit: 10,
    },
  })
  // console.log("Search Response:", response.data);
  console.log("Facets:", response.data?.result.facets);
  console.log("Results:", response.data?.result.results[0]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {}
      </main>
    </div>
  );
}
