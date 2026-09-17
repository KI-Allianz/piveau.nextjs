import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { getServerSession } from "next-auth/next";

import {
  authOptions,
  ExtendedSession,
} from "@/app/api/auth/[...nextauth]/route";
import { TRPCContext } from "./auth/types";

export async function createTRPCContext(opts: { req: Request }) {
  const apiKey = opts.req.headers.get("Authorization")?.replace("Bearer ", "");

  const validApiKeys = (process.env.API_KEYS || "").split(",");
  const isValid = apiKey && validApiKeys.includes(apiKey);
  if (isValid) {
    // API Key has to be keycloak token of a user with the role "api_user" in order to be valid
    return {
      session: {
        user: { name: "API User" },
        expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // expires in 1 hour
        accessToken: apiKey,
      },
      isAuthed: true,
    };
  }

  const session = (await getServerSession(
    authOptions,
  )) as ExtendedSession | null;

  return {
    session, // might be null if not logged in
    isAuthed:
      !!session?.user || process.env.NEXT_PUBLIC_AUTH_DISABLED === "true",
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
