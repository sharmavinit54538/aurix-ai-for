import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/autopilot/pages/ProactiveAlertsPage"));

export const Route = createFileRoute("/dashboard/autopilot/alerts")({
  head: () => ({ meta: [{ title: "Proactive Alerts — OFC360" }] }),
  component: PageComponent,
});
