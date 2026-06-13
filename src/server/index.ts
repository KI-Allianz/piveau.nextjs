import {
  Dataset,
  Catalog,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core";
import { router } from "./trpc";
import { SearchParamsSchema } from "./schemas/search";
import { protectedProcedure, publicProcedure } from "./auth/procedures";

const baseUrl = process.env.SEARCH_HUB_URL!.replace(/^"|"$/g, "");

export const appRouter = router({
  categories: publicProcedure.query(async () => {
    try {
      const res = await searchResource<SearchResult<Dataset>>({
        baseUrl: baseUrl,
        params: {
          q: "",
          filters: "dataset",
          limit: 1,
          page: 0,
          includes: ["categories.label"],
        },
      });

      return res.data.result.facets.find((facet) => facet.id === "categories")
        ?.items;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw new Error("Failed to fetch categories from Search Hub Upstream");
    }
  }),
  search: {
    datasets: publicProcedure.input(SearchParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      const isAuthed =
        !!ctx.session?.user || process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";
      if (!isAuthed) {
        const keywords = ["public", ...(input.facets?.keywords || [])];

        input.facets = {
          ...input.facets,
          keywords,
        };
      }

      try {
        const res = await searchResource<SearchResult<Dataset>>({
          baseUrl: baseUrl,
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
          // axiosInstance,
        });

        // Filter results again | temporary solution
        if (!isAuthed) {
          res.data.result.results = res.data.result.results.filter((item) => {
            const keywords = item?.keywords || [];
            return keywords.some((keyword) => keyword.label === "public");
          });

          // No data leak of facets
          if (res.data.result.results.length === 0) {
            res.data.result.facets = [];
          }
        }

        return res.data.result;
      } catch (error) {
        console.error("Search Resource Failed:", error);
        throw new Error("Failed to fetch from Search Hub Upstream");
      }
    }),
    catalogs: publicProcedure.input(SearchParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      // const isAuthed = !!ctx.session?.user;
      // if (!isAuthed) {
      //   const keywords = [...(input.facets?.keywords || [])];
      //   keywords.push("public");

      //   input.facets = {
      //     ...input.facets,
      //     keywords,
      //   };
      // }

      try {
        const res = await searchResource<SearchResult<Catalog>>({
          baseUrl: baseUrl,
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
              "keywords.label",
            ],
          },
        });

        return res.data.result;
      } catch (error) {
        console.error("Search Resource Failed:", error);
        throw new Error("Failed to fetch from Search Hub Upstream");
      }
    }),
  },
});

export type AppRouter = typeof appRouter;
