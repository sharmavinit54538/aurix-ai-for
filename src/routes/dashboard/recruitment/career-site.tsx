import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/CareerSitePage"),
  "CareerSitePage",
);

export const Route = createFileRoute("/dashboard/recruitment/career-site")({
  head: () => ({ meta: [{ title: "Career Site — Recruitment" }] }),
  component: Page,
});
