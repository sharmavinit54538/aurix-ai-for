import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const AIInsightsPage = lazyFeaturePage(
  () => import("./dashboard.ai-insights") as any,
  "AIInsightsPage"
);

export const Route = createFileRoute("/dashboard/analytics/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — Aurix" }] }),
  component: AIInsightsPage,
});
