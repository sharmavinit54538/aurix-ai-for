import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/WorkforcePlanningPage"));

export const Route = createFileRoute("/dashboard/recruitment/workforce-planning")({
  head: () => ({ meta: [{ title: "Workforce Planning — OFC360" }] }),
  component: PageComponent,
});
