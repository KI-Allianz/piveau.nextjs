import { router } from "./trpc";
import {
  CreateDraftParamsSchema,
  GetDraftParamsSchema,
  GetParamsSchema,
  SearchParamsSchema,
} from "./schemas/search";
import { AssistantParamsSchema } from "./schemas/assistant";
import { protectedProcedure, publicProcedure } from "./auth/procedures";
import { BACKEND_URLS } from "@/lib/urls";
import type { AssistantResponse, TraceStep } from "@/lib/assistant";
import { TRPCError } from "@trpc/server";
import {
  createDatasetDraft,
  deleteDataset,
  getDataset,
  getDatasetCategories,
  getDatasetDraftById,
  getDatasetDrafts,
  getFeaturedDatasets,
  searchDatasets,
} from "@/lib/repo/dataset/api";
import { deleteAllDatasetFiles } from "@/lib/repo/uploader/server";
import axios from "axios";
import type { Session } from "next-auth";
import { getFeaturedModels, getModel } from "@/lib/repo/model/api";
import { getCatalogue, searchCatalogues } from "@/lib/repo/catalogue/api";

export function getAxiosInstance(
  ctx: {
    isAuthed: boolean;
    isAuthEnabled: boolean;
    session: Session | null;
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

  assistant: {
    chat: protectedProcedure
      .input(AssistantParamsSchema)
      .mutation(async ({ input }): Promise<AssistantResponse> => {
        const backendUrl = BACKEND_URLS.ASSISTANT;

        if (!backendUrl) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "The assistant backend is not configured.",
          });
        }

        let upstream: Response;
        try {
          upstream = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_input: input.user_input,
              json_data: input.json_data,
              session_id: input.session_id,
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(60_000),
          });
        } catch (error) {
          const timedOut =
            error instanceof Error &&
            (error.name === "TimeoutError" || error.name === "AbortError");

          throw new TRPCError({
            code: "BAD_GATEWAY",
            message: timedOut
              ? "The assistant timed out. Please try again."
              : "The assistant is currently unreachable.",
          });
        }

        if (!upstream.ok) {
          const payload = await upstream.json().catch(() => null);
          const detail =
            (payload as any)?.detail ||
            upstream.statusText ||
            `HTTP ${upstream.status}`;

          throw new TRPCError({
            code: "BAD_GATEWAY",
            message: String(detail),
          });
        }

        const payload = await upstream.json().catch(() => null);

        if (!payload) {
          throw new TRPCError({
            code: "BAD_GATEWAY",
            message: "The assistant returned an empty response.",
          });
        }

        const trace = Array.isArray((payload as any)?.trace)
          ? ((payload as any).trace as TraceStep[])
          : [];

        return {
          response:
            typeof payload === "object" && (payload as any)?.response
              ? String((payload as any).response)
              : String(payload),
          trace,
        };
      }),
  },

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

    draft: {
      getAll: protectedProcedure.input(GetParamsSchema).query(async (opts) => {
        const { input, ctx } = opts;

        return await getDatasetDrafts(input.id, getAxiosInstance(ctx));
      }),
      get: protectedProcedure
        .input(GetDraftParamsSchema)
        .query(async (opts) => {
          const { input, ctx } = opts;

          return await getDatasetDraftById(
            input.id,
            input.catalogueId,
            getAxiosInstance(ctx),
          );
        }),
      create: protectedProcedure
        .input(CreateDraftParamsSchema)
        .mutation(async (opts) => {
          const { input, ctx } = opts;

          return await createDatasetDraft(
            input.catalogueId,
            input.id,
            input.dataset,
            getAxiosInstance(ctx),
          );
        }),
      delete: protectedProcedure
        .input(GetDraftParamsSchema)
        .mutation(async (opts) => {
          const { input, ctx } = opts;

          // Best-effort: the uploader currently only allows file deletion for
          // drafts, so tolerate a 403/404 and still remove the dataset.
          try {
            await deleteAllDatasetFiles(
              input.id,
              getAxiosInstance(ctx, BACKEND_URLS.UPLOAD),
            );
          } catch (error) {
            console.warn(
              "Failed to delete dataset files before deleting the dataset:",
              error,
            );
          }

          await deleteDataset(
            input.catalogueId,
            input.id,
            getAxiosInstance(ctx),
          );
        }),
    },
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
