import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminSettingsPage } from "@/features/superAdmin/pages/SuperAdminSettingsPage";

export const Route = createFileRoute("/dashboard/super-admin/settings")({
  head: () => ({
    meta: [
      { title: "System Settings — OFC360 Super Admin" },
      {
        name: "description",
        content: "Platform-level settings, maintenance mode, security policies and session timeouts.",
      },
    ],
  }),
  component: SuperAdminSettingsPage,
});
