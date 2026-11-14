import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminAnalyticsPage"));

export const Route = createFileRoute("/dashboard/super-admin/analytics")({
  head: () => ({ meta: [{ title: "Platform Analytics — OFC360" }] }),
  component: PageComponent,
});
