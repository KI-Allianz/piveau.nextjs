"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";
import { trpc } from "./client";
import { httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Global retry behavior for all tRPC queries
            retry: (failureCount, error: any) => {
              // Disable retries on 401 Unauthorized or 403 Forbidden
              if (
                error?.data?.httpStatus === 401 ||
                error?.data?.code === "UNAUTHORIZED" ||
                error?.data?.httpStatus === 403 ||
                error?.data?.code === "FORBIDDEN"
              ) {
                return false;
              }

              // Default behavior: retry up to 3 times for other errors
              return failureCount < 3;
            },
          },
        },
      }),
  );

  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
