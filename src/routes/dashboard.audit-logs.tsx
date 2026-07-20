import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/audit-logs")({
  component: AuditLogsRedirect,
});

function AuditLogsRedirect() {
  return <Navigate to="/dashboard/settings/audit-logs" replace />;
}
