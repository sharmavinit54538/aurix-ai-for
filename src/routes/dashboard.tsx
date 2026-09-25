import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardShell } from "@/components/aurix/DashboardShell";
import { checkRouteAccess, isUserAuthenticated } from "@/lib/route-guards";
import { aurix } from "@/lib/aurix-store";
import { waitForAuth } from "@/lib/auth-bootstrap";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    // Only execute on client/hydrated browser environment
    if (typeof window !== "undefined") {
      // Wait for the auth bootstrap to finish (refresh-token flow)
      // before checking authentication state. Without this, a page refresh
      // would race: the in-memory access token is gone but the HttpOnly
      // cookie refresh hasn't completed yet, causing a false redirect to /login.
      await waitForAuth();

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
