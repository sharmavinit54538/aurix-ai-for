import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ReportsPage = lazyFeaturePage(() => import("@/pages/ReportsPage"));

export const Route = createFileRoute("/dashboard/analytics/reports")({
  head: () => ({ meta: [{ title: "Reports — Aurix" }] }),
  component: ReportsPage,
});
