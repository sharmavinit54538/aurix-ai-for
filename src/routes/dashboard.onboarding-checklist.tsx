import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const OnboardingChecklistPage = lazyFeaturePage(() => import("@/pages/OnboardingChecklistPage"));

export const Route = createFileRoute("/dashboard/onboarding-checklist")({
  head: () => ({ meta: [{ title: "Onboarding Checklist — Aurix" }] }),
  component: OnboardingChecklistPage,
});
