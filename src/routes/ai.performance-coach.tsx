import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AIPerformanceCoachPage = lazyFeaturePage(
  () => import("@/features/ai-performance/pages/AIPerformanceCoachPage"),
);

export const Route = createFileRoute("/ai/performance-coach")({
  head: () => ({ meta: [{ title: "AI Performance Coach — Aurix" }] }),
  component: AIPerformanceCoachPage,
});
