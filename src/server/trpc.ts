import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TRPCContext } from "./auth/types";

export async function createTRPCContext() {
  const session = await getServerSession(authOptions);

  return {
    session, // might be null if not logged in
  };
}

/**
 * Initialization of tRPC backend
 */
export const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
