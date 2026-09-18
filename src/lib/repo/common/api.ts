import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";

export function canAccessObject(isPublic: boolean, session: any) {
  const isAuthed =
    !!session?.user || process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

  return {
    allowed: isPublic || isAuthed,
    isPublic,
  };
}

function translateAxiosErrorToTRPC(error: AxiosError): TRPCError {
  const status = error.response?.status;

  // Map common Axios/HTTP status codes to tRPC error codes
  let trpcCode: TRPCError["code"] = "INTERNAL_SERVER_ERROR";

  if (status === 400) trpcCode = "BAD_REQUEST";
  else if (status === 401) trpcCode = "UNAUTHORIZED";
  else if (status === 403) trpcCode = "FORBIDDEN";
  else if (status === 404) trpcCode = "NOT_FOUND";
  else if (status === 408) trpcCode = "TIMEOUT";

  return new TRPCError({
    code: trpcCode,
    message: error.message || "Failed to fetch from Search Hub Upstream",
    cause: error,
  });
}

export function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw translateAxiosErrorToTRPC(error);
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to fetch from Search Hub Upstream",
  });
}
