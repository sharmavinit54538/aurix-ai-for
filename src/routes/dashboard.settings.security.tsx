import { createFileRoute } from "@tanstack/react-router";
import { AccessDeniedView } from "@/features/settings";
import { useAurix } from "@/lib/aurix-store";
import { resolveRbacRole } from "@/features/settings/types";

export const Route = createFileRoute("/dashboard/settings/security")({
  head: () => ({ meta: [{ title: "Security Settings — Access Restricted" }] }),
  component: SecurityRestrictedPage,
});

function SecurityRestrictedPage() {
  const ws = useAurix();
  const currentRole = resolveRbacRole(ws.user?.role);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <AccessDeniedView
        title="Security Settings Restricted"
        message="System security, session timeout, and infrastructure authentication settings are restricted and not part of the OFC360 Organization HR Settings scope. Please contact your platform administrator."
        currentRole={currentRole}
        returnUrl="/dashboard/settings"
      />
    </div>
  );
}
