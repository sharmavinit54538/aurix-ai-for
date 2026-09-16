import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute stale time avoids redundant background refetches
        gcTime: 1000 * 60 * 5, // 5 minutes garbage collection time
        refetchOnWindowFocus: false, // Prevents aggressive refetches on alt-tab/window click
        retry: 1, // Quick failure recovery
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 1000 * 30, // 30 seconds preload cache
  });

  return router;
};
