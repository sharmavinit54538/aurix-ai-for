import { createFileRoute } from "@tanstack/react-router";
import { AccessDeniedView } from "@/features/settings";
import { useAurix } from "@/lib/aurix-store";
import { resolveRbacRole } from "@/features/settings/types";

export const Route = createFileRoute("/dashboard/settings/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Access Restricted" }] }),
  component: AuditLogsRestrictedPage,
});

function AuditLogsRestrictedPage() {
  const ws = useAurix();
  const currentRole = resolveRbacRole(ws.user?.role);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <AccessDeniedView
        title="Audit Logs Restricted"
        message="System audit logs and platform security telemetry are restricted and not part of the OFC360 Organization HR Settings scope. Please contact your system administrator."
        currentRole={currentRole}
        returnUrl="/dashboard/settings"
      />
    </div>
  );
}
