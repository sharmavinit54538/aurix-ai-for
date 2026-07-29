import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoAnalyticsPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoAnalyticsPage"),
  "CtoAnalyticsPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/analytics")({
  head: () => ({ meta: [{ title: "Engineering Analytics — Aurix CTO" }] }),
  component: CtoAnalyticsPage,
});
