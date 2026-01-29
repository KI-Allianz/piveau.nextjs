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
          params: {
            ...input,
            filters: "dataset",
            includes: [
              "id",
              "title",
              "description",
              "languages",
              "modified",
              "issued",
              "catalog.id",
              "catalog.title",
              "catalog.country.id",
              "distributions.id",
              "distributions.format.label",
              "distributions.format.id",
              "distributions.license",
              "categories.label",
              "keywords.label",
              "publisher",
            ],
          },
        });

        return res.data.result;
      }),
    catalogs: protectedProcedure
      .input(SearchParamsSchema)
      .query(async (opts) => {
        const { input } = opts;

        const res = await searchResource<SearchResult<Catalog>>({
          baseUrl: process.env.SEARCH_HUB_URL || "",
          params: {
            ...input,
            filters: "catalogue",
            includes: [
              "id",
              "title",
              "description",
              "modified",
              "issued",
              "country",
              "count",
            ],
          },
        });

        return res.data.result;
      }),
  },
});

export type AppRouter = typeof appRouter;
