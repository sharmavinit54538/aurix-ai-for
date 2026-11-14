import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/autopilot/pages/AutopilotOverviewDashboard"));

export const Route = createFileRoute("/dashboard/autopilot/")({
  head: () => ({ meta: [{ title: "OneHR Autopilot — OFC360" }] }),
  component: PageComponent,
});
