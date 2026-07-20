import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const OffboardingPage = lazyFeaturePage(
  () => import("./dashboard.offboarding") as any,
  "OffboardingPage"
);

export const Route = createFileRoute("/dashboard/hr-operations/offboarding")({
  head: () => ({ meta: [{ title: "Offboarding — Aurix" }] }),
  component: OffboardingPage,
});
