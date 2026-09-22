import { createFileRoute } from "@tanstack/react-router";
import { AccessDeniedView } from "@/features/settings";
import { useAurix } from "@/lib/aurix-store";
import { resolveRbacRole } from "@/features/settings/types";

export const Route = createFileRoute("/dashboard/settings/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Access Restricted" }] }),
  component: IntegrationsRestrictedPage,
});

function IntegrationsRestrictedPage() {
  const ws = useAurix();
  const currentRole = resolveRbacRole(ws.user?.role);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <AccessDeniedView
        title="Third-Party Integrations Restricted"
        message="External API integrations, WhatsApp settings, and developer webhooks are excluded from the OFC360 Organization HR Settings scope. Please contact your platform administrator."
        currentRole={currentRole}
        returnUrl="/dashboard/settings"
      />
    </div>
  );
}
