import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const ReportsPage = lazyFeaturePage(
  () => import("./dashboard.reports") as any,
  "ReportsPage"
);

export const Route = createFileRoute("/dashboard/analytics/reports")({
  head: () => ({ meta: [{ title: "Reports — Aurix" }] }),
  component: ReportsPage,
});
