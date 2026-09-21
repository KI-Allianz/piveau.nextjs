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
import { getCatalogue, searchCatalogues } from "@/lib/repo/catalogue/api";

export function getAxiosInstance(
  ctx: {
    isAuthed: boolean;
    isAuthEnabled: boolean;
    session: ExtendedSession | null;
  },
  baseUrl: string = BACKEND_URLS.SEARCH,
) {
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

  catalogue: {
    search: publicProcedure.input(SearchParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      return await searchCatalogues(input, getAxiosInstance(ctx));
    }),

    get: publicProcedure.input(GetParamsSchema).query(async (opts) => {
      const { input, ctx } = opts;

      return await getCatalogue(input.id, getAxiosInstance(ctx));
    }),
  },
});

export type AppRouter = typeof appRouter;
