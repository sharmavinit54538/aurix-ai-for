import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/CandidateVerificationPage"));

export const Route = createFileRoute("/dashboard/recruitment/verification")({
  head: () => ({ meta: [{ title: "Background Verification — OFC360" }] }),
  component: PageComponent,
});
