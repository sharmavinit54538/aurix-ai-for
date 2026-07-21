import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/NewJobPage"),
  "NewJobPage",
);

export const Route = createFileRoute("/dashboard/recruitment/jobs/new")({
  head: () => ({ meta: [{ title: "New Job — Recruitment" }] }),
  component: Page,
});
