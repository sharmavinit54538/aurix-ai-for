import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminPlatformConfigPage } from "@/features/superAdmin/pages/SuperAdminPlatformConfigPage";

export const Route = createFileRoute("/dashboard/super-admin/platform-config")({
  head: () => ({
    meta: [
      { title: "Platform Configuration & Health — OFC360 Super Admin" },
      {
        name: "description",
        content: "Platform diagnostics, cluster telemetry, uptime, database and API latency.",
      },
    ],
  }),
  component: SuperAdminPlatformConfigPage,
});
