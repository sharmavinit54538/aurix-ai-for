import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminActivityPage } from "@/features/superAdmin/pages/SuperAdminActivityPage";

export const Route = createFileRoute("/dashboard/super-admin/activity")({
  head: () => ({
    meta: [
      { title: "System Activity — OFC360 Super Admin" },
      {
        name: "description",
        content: "Platform-wide real-time activity and security events across all tenants.",
      },
    ],
  }),
  component: SuperAdminActivityPage,
});
