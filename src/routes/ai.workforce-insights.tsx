import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AIInsightsPage = lazyFeaturePage(() => import("@/pages/AIInsightsPage"));

export const Route = createFileRoute("/ai/workforce-insights")({
  head: () => ({ meta: [{ title: "AI Workforce Insights — Aurix" }] }),
  component: AIInsightsPage,
});
