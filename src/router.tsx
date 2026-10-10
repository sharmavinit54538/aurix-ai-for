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
    defaultPreloadStaleTime: 1000 * 30, // 30 seconds preload cache
  });

  return router;
};
