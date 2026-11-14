import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/OnboardingPage"));

export const Route = createFileRoute("/dashboard/recruitment/onboarding")({
  head: () => ({ meta: [{ title: "Candidate Onboarding — OFC360" }] }),
  component: PageComponent,
});
