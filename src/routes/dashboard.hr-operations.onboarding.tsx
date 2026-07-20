import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const OnboardingPage = lazyFeaturePage(
  () => import("./dashboard.onboarding-checklist") as any,
  "OnboardingPage"
);

export const Route = createFileRoute("/dashboard/hr-operations/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding Checklist — Aurix" }] }),
  component: OnboardingPage,
});
