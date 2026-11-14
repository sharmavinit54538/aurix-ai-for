import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/PreboardingPage"));

export const Route = createFileRoute("/dashboard/recruitment/preboarding")({
  head: () => ({ meta: [{ title: "Preboarding — OFC360" }] }),
  component: PageComponent,
});
