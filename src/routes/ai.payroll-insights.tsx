import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AIPayrollInsightsPage = lazyFeaturePage(
  () => import("@/features/ai-payroll/pages/AIPayrollInsightsPage"),
);

export const Route = createFileRoute("/ai/payroll-insights")({
  head: () => ({ meta: [{ title: "AI Payroll Insights — Aurix" }] }),
  component: AIPayrollInsightsPage,
});
