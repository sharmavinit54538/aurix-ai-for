import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoAiInsightsPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/ai-insights")({
  head: () => ({ meta: [{ title: "CEO AI Insights — OFC360" }] }),
  component: PageComponent,
});
