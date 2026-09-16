import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/CandidateSourcingPage"),
  "CandidateSourcingPage",
);

export const Route = createFileRoute("/dashboard/recruitment/sourcing")({
  head: () => ({ meta: [{ title: "Candidate Sourcing — Recruitment" }] }),
  component: Page,
});
