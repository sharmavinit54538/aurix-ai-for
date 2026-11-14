import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/performance/pages/PerformancePage"), "PerformancePage");

export const Route = createFileRoute("/dashboard/performance")({
  head: () => ({ meta: [{ title: "Performance — OFC360" }] }),
  component: PageComponent,
});
