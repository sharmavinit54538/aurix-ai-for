import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/AIScreeningPage"));

export const Route = createFileRoute("/dashboard/recruitment/ai-screening")({
  head: () => ({ meta: [{ title: "AI Screening — OFC360" }] }),
  component: PageComponent,
});
