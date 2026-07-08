import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";

const PerformancePage = lazyFeaturePage(
  () => import("@/features/admin/performance/pages/PerformancePage"),
  "PerformancePage",
);

export const Route = createFileRoute("/dashboard/performance")({
  head: () => ({ meta: [{ title: "Performance — Aurix" }] }),
  component: PerformancePage,
});
