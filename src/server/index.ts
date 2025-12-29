import { Dataset, searchResource, SearchResult } from "@piveau/sdk-core";
import { router } from "./trpc";
import { SearchParamsSchema } from "./schemas/search";
import { protectedProcedure } from "./auth/procedures";

export const appRouter = router({
  search: protectedProcedure
    .input(SearchParamsSchema)
    .query(async (opts) => {      
      const { input } = opts;

      const res = await searchResource<SearchResult<Dataset>>({
        baseUrl: process.env.SEARCH_HUB_URL || "",
        params: input,
      });
      
      return res.data.result;
    }),
});

export type AppRouter = typeof appRouter;
