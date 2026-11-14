import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/OnboardingPage"));

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Workspace Onboarding — OFC360" }] }),
  component: PageComponent,
});
