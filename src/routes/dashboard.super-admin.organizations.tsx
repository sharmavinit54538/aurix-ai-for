import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminOrganizationsPage } from "@/features/superAdmin/pages/SuperAdminOrganizationsPage";

export const Route = createFileRoute("/dashboard/super-admin/organizations")({
  head: () => ({
    meta: [
      { title: "Organizations — OFC360 Super Admin" },
      {
        name: "description",
        content: "Multi-tenant company accounts, usage, and subscription plans.",
      },
    ],
  }),
  component: SuperAdminOrganizationsPage,
});
