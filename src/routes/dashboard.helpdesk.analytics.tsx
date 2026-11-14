import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/helpdesk/pages/HelpdeskAnalyticsPage"));

export const Route = createFileRoute("/dashboard/helpdesk/analytics")({
  head: () => ({ meta: [{ title: "Helpdesk Analytics — OFC360" }] }),
  component: PageComponent,
});
