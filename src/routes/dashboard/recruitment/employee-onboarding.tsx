import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/EnterpriseOnboardingPage"),
  "EnterpriseOnboardingPage",
);

export const Route = createFileRoute("/dashboard/recruitment/employee-onboarding")({
  head: () => ({ meta: [{ title: "Enterprise Onboarding Hub — Recruitment" }] }),
  component: Page,
});
