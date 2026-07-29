import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoAiInsightsPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoAiInsightsPage"),
  "CeoAiInsightsPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/ai-insights")({
  head: () => ({ meta: [{ title: "Executive AI Intelligence — CEO Portal" }] }),
  component: CeoAiInsightsPage,
});
