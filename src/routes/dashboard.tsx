import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OFC360" }] }),
  component: DashboardShell,
});
