import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/CandidateVerificationPage"),
  "CandidateVerificationPage",
);

export const Route = createFileRoute("/dashboard/recruitment/verification")({
  head: () => ({ meta: [{ title: "Background Verification (BGV) — Recruitment" }] }),
  component: Page,
});
