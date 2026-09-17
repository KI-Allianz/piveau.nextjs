import {
  Dataset,
  Catalog,
  searchResource,
  SearchResult,
} from "@piveau/sdk-core";
import { router } from "./trpc";
import { GetParamsSchema, SearchParamsSchema } from "./schemas/search";
import { publicProcedure } from "./auth/procedures";
import { BACKEND_URLS } from "@/lib/urls";
import { getDataset, getDatasetCategories } from "@/lib/repo/dataset/api";
import axios from "axios";
import { ExtendedSession } from "@/app/api/auth/[...nextauth]/route";
import { TRPCError } from "@trpc/server";

const baseUrl = BACKEND_URLS.SEARCH;

function getAxiosInstance(ctx: {
  isAuthed: boolean;
  session: ExtendedSession | null;
}) {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: ctx.isAuthed
        ? `Bearer ${ctx.session?.accessToken}`
        : undefined,
    },
  });
}

export const appRouter = router({
  categories: publicProcedure.query(async () => {
    return await getDatasetCategories();
  }),

  dataset: {
    featured: publicProcedure.query(async (opts) => {
      const { ctx } = opts;

      try {
        const res = await searchResource<SearchResult<Dataset>>({
          baseUrl: baseUrl,
          axiosInstance: getAxiosInstance(ctx),
          params: {
            limit: 10,
            filters: "dataset",
            facets: ctx.isAuthed ? undefined : { keywords: ["public"] },
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

        if (!ctx.isAuthed) {
          res.data.result.results = res.data.result.results.filter((item) => {
            const keywords = item?.keywords || [];
            return keywords.some((keyword) => keyword.label === "public");
          });

          // No data leak of facets
          if (res.data.result.results.length === 0) {
            res.data.result.facets = [];
            res.data.result.count = 0;
          }
        }
        return res.data.result.results;
      } catch (error) {
        console.error("Search Resource Failed:", error);
        throw new Error("Failed to fetch from Search Hub Upstream");
      }
    }),

    search: publicProcedure.input(SearchParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      if (!ctx.isAuthed) {
        const keywords = ["public", ...(input.facets?.keywords || [])];

        input.facets = {
          ...input.facets,
          keywords,
        };
      }

      try {
        const res = await searchResource<SearchResult<Dataset>>({
          baseUrl: baseUrl,
          axiosInstance: getAxiosInstance(ctx),
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
        if (!ctx.isAuthed) {
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

    get: publicProcedure.input(GetParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      const response = await getDataset(input.id, getAxiosInstance(ctx));

      const isPublic = response.keywords?.some(
        (k) => k.label.toLowerCase() === "public",
      );
      if (!isPublic && !ctx.isAuthed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to private dataset",
        });
      }

      return response;
    }),
  },

  model: {
    featured: publicProcedure.query(async (opts) => {
      const { ctx } = opts;

      try {
        let keywords = ["ai-model"];
        if (!ctx.isAuthed) {
          keywords.push("public");
        }

        const res = await searchResource<SearchResult<Dataset>>({
          baseUrl: baseUrl,
          axiosInstance: getAxiosInstance(ctx),
          params: {
            limit: 10,
            filters: "dataset",
            facets: { keywords },
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

        if (!ctx.isAuthed) {
          res.data.result.results = res.data.result.results.filter((item) => {
            const keywords = item?.keywords || [];
            return keywords.some((keyword) => keyword.label === "public");
          });

          // No data leak of facets
          if (res.data.result.results.length === 0) {
            res.data.result.facets = [];
          }
        }
        return res.data.result.results;
      } catch (error) {
        console.error("Search Resource Failed:", error);
        throw new Error("Failed to fetch from Search Hub Upstream");
      }
    }),
  },

  search: {
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
          axiosInstance: getAxiosInstance(ctx),
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
