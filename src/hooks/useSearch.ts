"use client";

// hooks/useDatasetSearch.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {schemaDataset} from "@piveau/sdk-core/model";
import {SearchParams, searchResource, SearchResult} from '@piveau/sdk-core';
import {StandardSchemaV1} from "@standard-schema/spec";

type DatasetResult = SearchResult<
  StandardSchemaV1.InferOutput<typeof schemaDataset>
>["result"];        // gives { facets: …; results: … }

interface Props extends SearchParams {
  wait?: number; // optional wait time for debugging
}

export function useSearch(
  params: Props,
): UseQueryResult<DatasetResult> {
  return useQuery({
    // ⚠️  every param that can change MUST be part of the key
    queryKey: ['dataset-search', params],
    // your existing function becomes the queryFn
    queryFn: async () => {

      // Debug insert wait
      if (params.wait) {
        await new Promise(resolve => setTimeout(resolve, params.wait));
      }

      const res = await searchResource<
        SearchResult<StandardSchemaV1.InferOutput<typeof schemaDataset>>
      >({
        baseUrl: 'https://piveau.hlrs.de/hub/search/',
        params
      });
      return res.data.result;
    },    // strip the Axios wrapper

    // ────────────────────────────────────────────────*
    // nice-to-have flags
    // enabled: !!params.q,          // don’t fire until a term is present
    staleTime: 1000 * 60 * 5,     // 5 min fresh cache
    retry: false,                 // or a number/function
    /*
        select: data => ({
      facets: data.facets,
      first: data.results[0],     // pluck what you logged before
      all: data.results,
    }),
     */
  });
}
