import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/CandidateProfilePage"));

export const Route = createFileRoute("/dashboard/recruitment/candidates/$candidateId")({
  head: () => ({ meta: [{ title: "Candidate Profile — OFC360" }] }),
  component: PageComponent,
});
