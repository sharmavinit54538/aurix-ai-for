import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/CandidateProfilePage"),
  "CandidateProfilePage",
);

export const Route = createFileRoute("/dashboard/recruitment/candidates/$candidateId")({
  head: () => ({ meta: [{ title: "Candidate Profile — Recruitment" }] }),
  component: Page,
});
