import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/InterviewsPage"),
  "InterviewsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/interviews")({
  head: () => ({ meta: [{ title: "Interviews — Recruitment" }] }),
  component: Page,
});
