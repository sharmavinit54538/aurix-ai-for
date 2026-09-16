import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/WorkforcePlanningPage"),
  "WorkforcePlanningPage",
);

export const Route = createFileRoute("/dashboard/recruitment/workforce-planning")({
  head: () => ({ meta: [{ title: "Workforce Planning — Recruitment" }] }),
  component: Page,
});
