import {createTRPCContext} from "@/server/trpc";
import {Session} from "next-auth";


export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type AuthedTRPCContext = TRPCContext & {
  session: Session;
  user: NonNullable<Session>["user"];
};