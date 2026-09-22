import { createFileRoute } from "@tanstack/react-router";
import { AccessDeniedView } from "@/features/settings";
import { useAurix } from "@/lib/aurix-store";
import { resolveRbacRole } from "@/features/settings/types";

export const Route = createFileRoute("/dashboard/settings/general")({
  head: () => ({ meta: [{ title: "General Settings — Access Restricted" }] }),
  component: GeneralRestrictedPage,
});

function GeneralRestrictedPage() {
  const ws = useAurix();
  const currentRole = resolveRbacRole(ws.user?.role);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <AccessDeniedView
        title="General Settings Not Available"
        message="System backend parameters are not part of the OFC360 Organization Settings. Please use the Company section for organizational identity, localization, and fiscal year settings."
        currentRole={currentRole}
        returnUrl="/dashboard/settings"
      />
    </div>
  );
}
