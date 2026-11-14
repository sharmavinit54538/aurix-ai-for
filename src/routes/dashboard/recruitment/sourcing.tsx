import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/CandidateSourcingPage"));

export const Route = createFileRoute("/dashboard/recruitment/sourcing")({
  head: () => ({ meta: [{ title: "Candidate Sourcing — OFC360" }] }),
  component: PageComponent,
});
