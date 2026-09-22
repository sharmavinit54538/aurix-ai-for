import { createFileRoute } from "@tanstack/react-router";
import { AccessDeniedView } from "@/features/settings";
import { useAurix } from "@/lib/aurix-store";
import { resolveRbacRole } from "@/features/settings/types";

export const Route = createFileRoute("/dashboard/settings/roles-permissions")({
  head: () => ({ meta: [{ title: "Roles & Permissions — Access Restricted" }] }),
  component: RolesPermissionsRestrictedPage,
});

function RolesPermissionsRestrictedPage() {
  const ws = useAurix();
  const currentRole = resolveRbacRole(ws.user?.role);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <AccessDeniedView
        title="Roles & Permissions Configuration Restricted"
        message="System roles governance is restricted and managed globally by the platform SUPER ADMIN. To configure employee department designations and access, use the Employees section."
        currentRole={currentRole}
        returnUrl="/dashboard/settings"
      />
    </div>
  );
}
