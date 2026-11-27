import { QueryClient } from "@tanstack/react-query";
import { queryRetryDelay, shouldRetryQuery } from "@/api/queryRetry";

let sharedQueryClient: QueryClient | null = null;

const createQueryClient = () =>
  new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, // 1 minute stale time avoids redundant background refetches
          gcTime: 1000 * 60 * 5, // 5 minutes garbage collection time
          refetchOnWindowFocus: false, // Prevents aggressive refetches on alt-tab/window click
          retry: shouldRetryQuery,
          retryDelay: queryRetryDelay,
          retryOnMount: false,
          refetchOnReconnect: (query) =>
            !query.state.error || shouldRetryQuery(0, query.state.error),
        },
      },
  });

export const getQueryClient = () => {
  // A module-level cache on the server would share authenticated data across requests.
  if (typeof window === "undefined") return createQueryClient();
  sharedQueryClient ??= createQueryClient();
  return sharedQueryClient;
};

export const clearQueryCache = () => {
  if (sharedQueryClient) {
    sharedQueryClient.clear();
  }
};
