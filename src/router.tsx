import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

let sharedQueryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (!sharedQueryClient) {
    sharedQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, // 1 minute stale time avoids redundant background refetches
          gcTime: 1000 * 60 * 5, // 5 minutes garbage collection time
          refetchOnWindowFocus: false, // Prevents aggressive refetches on alt-tab/window click
          retry: 1, // Quick failure recovery
        },
      },
    });
  }
  return sharedQueryClient;
};

export const clearQueryCache = () => {
  if (sharedQueryClient) {
    sharedQueryClient.clear();
  }
};

export const getRouter = () => {
  const queryClient = getQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 1000 * 30, // 30 seconds preload cache
  });

  return router;
};
