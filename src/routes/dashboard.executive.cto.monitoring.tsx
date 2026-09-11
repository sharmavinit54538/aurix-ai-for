import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoMonitoringPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoMonitoringPage"),
  "CtoMonitoringPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/monitoring")({
  head: () => ({ meta: [{ title: "Monitoring & Observability — OFC360 CTO" }] }),
  component: CtoMonitoringPage,
});
