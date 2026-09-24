import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardShell } from "@/components/aurix/DashboardShell";
import { checkRouteAccess, isUserAuthenticated } from "@/lib/route-guards";
import { aurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    // Only execute on client/hydrated browser environment
    if (typeof window !== "undefined") {
      const isAuth = isUserAuthenticated();
      if (!isAuth) {
        throw redirect({
          to: "/login",
          search: {
            redirect: location.href,
          },
        });
      }

      // Enforce role-based access control against the central route map
      const ws = aurix.get();
      const access = checkRouteAccess(location.pathname, ws.user?.role);
      if (!access.allowed && access.redirectPath) {
        throw redirect({
          to: access.redirectPath as any,
        });
      }
    }
  },
  head: () => ({ meta: [{ title: "Dashboard — OFC360" }] }),
  component: DashboardShell,
});
