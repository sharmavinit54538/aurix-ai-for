import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/EnterpriseOnboardingPage"));

export const Route = createFileRoute("/dashboard/recruitment/employee-onboarding")({
  head: () => ({ meta: [{ title: "Enterprise Onboarding — OFC360" }] }),
  component: PageComponent,
});
