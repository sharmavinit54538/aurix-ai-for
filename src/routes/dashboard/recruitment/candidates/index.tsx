import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/CandidatesPage"),
  "CandidatesPage",
);

export const Route = createFileRoute("/dashboard/recruitment/candidates/")({
  head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
  component: Page,
});
