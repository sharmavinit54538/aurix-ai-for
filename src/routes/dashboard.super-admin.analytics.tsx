import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminAnalyticsPage } from "@/features/superAdmin/pages/SuperAdminAnalyticsPage";

export const Route = createFileRoute("/dashboard/super-admin/analytics")({
  head: () => ({
    meta: [
      { title: "Usage & Analytics — OFC360 Super Admin" },
      {
        name: "description",
        content: "Platform metrics, MAU trends, resource utilization and analytics.",
      },
    ],
  }),
  component: SuperAdminAnalyticsPage,
});
