import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioAnalyticsPage"));

export const Route = createFileRoute("/dashboard/executive/cio/analytics")({
  head: () => ({ meta: [{ title: "CIO Analytics — OFC360" }] }),
  component: PageComponent,
});
