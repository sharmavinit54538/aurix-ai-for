import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/OnboardingPage"),
  "OnboardingPage",
);

export const Route = createFileRoute("/dashboard/recruitment/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Recruitment" }] }),
  component: Page,
});
