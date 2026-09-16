import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/PreboardingPage"),
  "PreboardingPage",
);

export const Route = createFileRoute("/dashboard/recruitment/preboarding")({
  head: () => ({ meta: [{ title: "Preboarding Engagement — Recruitment" }] }),
  component: Page,
});
