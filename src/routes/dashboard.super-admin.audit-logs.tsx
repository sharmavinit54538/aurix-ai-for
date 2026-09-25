import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminAuditLogsPage } from "@/features/superAdmin/pages/SuperAdminAuditLogsPage";

export const Route = createFileRoute("/dashboard/super-admin/audit-logs")({
  head: () => ({
    meta: [
      { title: "Platform Audit Logs — OFC360 Super Admin" },
      {
        name: "description",
        content: "Security audit logs, system-level actor trails, and compliance history.",
      },
    ],
  }),
  component: SuperAdminAuditLogsPage,
});
