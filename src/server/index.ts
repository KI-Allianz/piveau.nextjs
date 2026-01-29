import {
  Dataset,
  Catalog,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core";
import { router } from "./trpc";
import { SearchParamsSchema } from "./schemas/search";
import { protectedProcedure } from "./auth/procedures";

export const appRouter = router({
  search: {
    datasets: protectedProcedure
      .input(SearchParamsSchema)
      .query(async (opts) => {
        const { input } = opts;

        const res = await searchResource<SearchResult<Dataset>>({
          baseUrl: process.env.SEARCH_HUB_URL || "",
          params: input,
        });

        return res.data.result;
      }),
    catalogs: protectedProcedure
      .input(SearchParamsSchema)
      .query(async (opts) => {
        const { input } = opts;

        const res = await searchResource<SearchResult<Catalog>>({
          baseUrl: process.env.SEARCH_HUB_URL || "",
          params: input,
        });

        return res.data.result;
      }),
  },
});

export type AppRouter = typeof appRouter;
