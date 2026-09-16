import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/KnowledgeTransferProbationPage"),
  "KnowledgeTransferProbationPage",
);

export const Route = createFileRoute("/dashboard/recruitment/kt-probation")({
  head: () => ({ meta: [{ title: "Knowledge Transfer & Probation — Recruitment" }] }),
  component: Page,
});
