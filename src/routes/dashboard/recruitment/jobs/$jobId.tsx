import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/JobDetailPage"),
  "JobDetailPage",
);

export const Route = createFileRoute("/dashboard/recruitment/jobs/$jobId")({
  head: () => ({ meta: [{ title: "Job Detail — Recruitment" }] }),
  component: Page,
});
