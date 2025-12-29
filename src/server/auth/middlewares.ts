import {TRPCError} from "@trpc/server";

import {AuthedTRPCContext} from "@/server/auth/types";
import {t} from "@/server/trpc";

// Middleware: require auth
export const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  const { session } = ctx;
  if (!session || !session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Login required." });
  }
  return next({
    ctx: {
      ...ctx,
      // from here on, these are non-nullable in downstream resolvers
      session,              // Session (not null)
      user: session.user,   // add a convenient shortcut
    } as AuthedTRPCContext,
  });
});