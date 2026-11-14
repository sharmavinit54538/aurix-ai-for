import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoAnalyticsPage"));

export const Route = createFileRoute("/dashboard/executive/cto/analytics")({
  head: () => ({ meta: [{ title: "Engineering Analytics — OFC360" }] }),
  component: PageComponent,
});
