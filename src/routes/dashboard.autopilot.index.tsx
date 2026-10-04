import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AutopilotOverviewDashboard = lazyFeaturePage(
  () => import("@/features/autopilot/pages/AutopilotOverviewDashboard"),
);

export const Route = createFileRoute("/dashboard/autopilot/")({
  head: () => ({
    meta: [
      { title: "Autopilot HR Dashboard | OFC360" },
      { name: "description", content: "Overview of autonomous HR operations, auto-resolved metrics, exception backlog, and efficiency telemetry." },
    ],
  }),
  component: AutopilotOverviewDashboard,
});
