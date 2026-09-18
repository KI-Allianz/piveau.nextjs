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
import {
  getDataset,
  getDatasetCategories,
  getFeaturedDatasets,
  searchDatasets,
} from "@/lib/repo/dataset/api";
import axios from "axios";
import { ExtendedSession } from "@/app/api/auth/[...nextauth]/route";
import { getFeaturedModels, getModel } from "@/lib/repo/model/api";

const baseUrl = BACKEND_URLS.SEARCH;

function getAxiosInstance(ctx: {
  isAuthed: boolean;
  isAuthEnabled: boolean;
  session: ExtendedSession | null;
}) {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization:
        ctx.isAuthed && ctx.isAuthEnabled
          ? `Bearer ${ctx.session?.accessToken}`
          : undefined,
    },
  });
}

export const appRouter = router({
  categories: publicProcedure.query(async (opts) => {
    const { ctx } = opts;

    return await getDatasetCategories(getAxiosInstance(ctx));
  }),

  dataset: {
    featured: publicProcedure.query(async (opts) => {
      const { ctx } = opts;

      return await getFeaturedDatasets(getAxiosInstance(ctx));
    }),

    search: publicProcedure.input(SearchParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      return await searchDatasets(input, getAxiosInstance(ctx));
    }),

    get: publicProcedure.input(GetParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      return await getDataset(input.id, getAxiosInstance(ctx));
    }),
  },

  model: {
    featured: publicProcedure.query(async (opts) => {
      const { ctx } = opts;

      return await getFeaturedModels(getAxiosInstance(ctx));
    }),

    get: publicProcedure.input(GetParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      return await getModel(input.id, getAxiosInstance(ctx));
    }),
  },

  search: {
    catalogs: publicProcedure.input(SearchParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

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
