import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminOverviewPage } from "@/features/superAdmin/pages/SuperAdminOverviewPage";

export const Route = createFileRoute("/dashboard/super-admin/")({
  head: () => ({
    meta: [
      { title: "Super Admin Command Center — OFC360" },
      {
        name: "description",
        content: "Platform owner administration, global statistics, multi-organization health, and audit trail.",
      },
    ],
  }),
  component: SuperAdminOverviewPage,
});
