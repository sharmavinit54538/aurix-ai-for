import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const OffboardingPage = lazyFeaturePage(() => import("@/pages/OffboardingPage"));

export const Route = createFileRoute("/dashboard/offboarding")({
  head: () => ({ meta: [{ title: "Offboarding — Aurix" }] }),
  component: OffboardingPage,
});
