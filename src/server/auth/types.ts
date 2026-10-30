import type { Session } from "next-auth";
import { createTRPCContext } from "@/server/trpc";

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type AuthedTRPCContext = TRPCContext & {
  session: Session;
  user: NonNullable<Session>["user"];
};
