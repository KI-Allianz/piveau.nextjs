import { ExtendedSession } from "@/app/api/auth/[...nextauth]/route";
import { createTRPCContext } from "@/server/trpc";

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type AuthedTRPCContext = TRPCContext & {
  session: ExtendedSession;
  user: NonNullable<ExtendedSession>["user"];
};
