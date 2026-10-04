import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const HelpdeskAnalyticsPage = lazyFeaturePage(
  () => import("@/features/helpdesk/pages/HelpdeskAnalyticsPage"),
);

export const Route = createFileRoute("/dashboard/helpdesk/analytics")({
  head: () => ({ meta: [{ title: "Helpdesk Analytics & SLA — OFC360" }] }),
  component: HelpdeskAnalyticsPage,
});
