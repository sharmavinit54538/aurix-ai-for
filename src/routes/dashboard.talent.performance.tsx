import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PerformancePage = lazyFeaturePage(
  () => import("@/features/admin/performance/pages/PerformancePage") as any,
  "PerformancePage"
);

export const Route = createFileRoute("/dashboard/talent/performance")({
  head: () => ({ meta: [{ title: "Performance — OFC360" }] }),
  component: PerformancePage,
});
