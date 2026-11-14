import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/CandidatesPage"));

export const Route = createFileRoute("/dashboard/recruitment/candidates/")({
  head: () => ({ meta: [{ title: "Candidates Directory — OFC360" }] }),
  component: PageComponent,
});
