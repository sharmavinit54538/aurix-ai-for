import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { getQueryClient, clearQueryCache } from "@/lib/query-client";

export { getQueryClient, clearQueryCache };

export const getRouter = () => {
  const queryClient = getQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadDelay: 150,
    defaultPreloadStaleTime: 1000 * 60, // 60 seconds preload cache
    defaultPendingMs: 300,
    defaultPendingMinMs: 0,
  });

  return router;
};
