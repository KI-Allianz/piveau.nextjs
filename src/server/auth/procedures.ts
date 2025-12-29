import {enforceUserIsAuthed} from "@/server/auth/middlewares";
import {t} from "@/server/trpc";

export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);