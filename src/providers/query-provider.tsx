"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Init QueryClient in useState to avoid recreating client whenever re-render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Data is considered fresh for 1 minute
            refetchOnWindowFocus: false, // Disable automatic refetching when window is focused (optional)
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools inspect the GraphQL cache easily */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
