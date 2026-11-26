import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/aurix/DashboardShell";
import { guardDashboardRoute } from "@/lib/auth-route-guards";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => guardDashboardRoute(location.href),
  head: () => ({ meta: [{ title: "Dashboard — OFC360" }] }),
  component: DashboardShell,
});
