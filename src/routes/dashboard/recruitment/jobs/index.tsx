import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/JobsPage"),
  "JobsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/jobs/")({
  head: () => ({ meta: [{ title: "Jobs — Recruitment" }] }),
  component: Page,
});
