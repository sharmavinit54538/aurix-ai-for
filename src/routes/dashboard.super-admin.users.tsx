import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminUsersPage } from "@/features/superAdmin/pages/SuperAdminUsersPage";

export const Route = createFileRoute("/dashboard/super-admin/users")({
  head: () => ({
    meta: [
      { title: "User Management — OFC360 Super Admin" },
      {
        name: "description",
        content: "Platform-wide user management, role statistics, and account activation/deactivation.",
      },
    ],
  }),
  component: SuperAdminUsersPage,
});
