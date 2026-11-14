import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoMonitoringPage"));

export const Route = createFileRoute("/dashboard/executive/cto/monitoring")({
  head: () => ({ meta: [{ title: "System Monitoring — OFC360" }] }),
  component: PageComponent,
});
