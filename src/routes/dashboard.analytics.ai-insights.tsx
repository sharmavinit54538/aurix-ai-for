import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AIInsightsPage = lazyFeaturePage(() => import("@/pages/AIInsightsPage"));

export const Route = createFileRoute("/dashboard/analytics/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — Aurix" }] }),
  component: AIInsightsPage,
});
