import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/OnboardingChecklistPage"));

export const Route = createFileRoute("/dashboard/hr-operations/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding Checklist — OFC360" }] }),
  component: PageComponent,
});
