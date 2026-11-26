import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { guardOnboardingRoute } from "@/lib/auth-route-guards";

const PageComponent = lazyFeaturePage(() => import("@/pages/OnboardingPage"));

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async ({ search }) => guardOnboardingRoute(search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Workspace Onboarding — OFC360" }] }),
  component: PageComponent,
});
