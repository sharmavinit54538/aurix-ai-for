import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioAnalyticsPage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioAnalyticsPage"),
  "CioAnalyticsPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/analytics")({
  head: () => ({ meta: [{ title: "IT Analytics — CIO Portal" }] }),
  component: CioAnalyticsPage,
});
