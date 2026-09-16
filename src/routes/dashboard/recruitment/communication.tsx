import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/CandidateCommunicationPage"),
  "CandidateCommunicationPage",
);

export const Route = createFileRoute("/dashboard/recruitment/communication")({
  head: () => ({ meta: [{ title: "Candidate Communication — Recruitment" }] }),
  component: Page,
});
