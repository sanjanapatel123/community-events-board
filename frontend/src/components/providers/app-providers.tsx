"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ApiError } from "@/lib/api-client";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: (failureCount, error) => {
              if (
                error instanceof ApiError &&
                error.status >= 400 &&
                error.status < 500
              ) {
                return false;
              }

              return failureCount < 1;
            },
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        theme="light"
        position="bottom-right"
        closeButton
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#17151b",
            border: "1px solid #ece6ed",
            boxShadow: "0 8px 32px -12px rgb(42 24 38 / 15%)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
