import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";

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

function translateAxiosErrorToNextResponse(error: AxiosError): Response {
  const status = error.response?.status || 500;
  const message = error.response?.statusText || "Internal Server Error";

  return new Response(message, { status });
}

export function handleAxiosErrorForTRPC(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw translateAxiosErrorToTRPC(error);
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to fetch from Search Hub Upstream",
  });
}

export function handleAxiosErrorForNextResponse(error: unknown): Response {
  if (axios.isAxiosError(error)) {
    return translateAxiosErrorToNextResponse(error);
  }

  return new Response("Internal Server Error", { status: 500 });
}
