import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useCurrentRole } from "@/lib/roles";
import { AccessDeniedState } from "@/features/superAdmin/components/SuperAdminStates";

/**
 * Layout for every /dashboard/super-admin/* page.
 *
 * Route-level `beforeLoad` in /dashboard already redirects non-super-admin roles; this component
 * re-checks the role verified by `/auth/me` on every render so no Super Admin page (and no Super
 * Admin API call) mounts for another role. The backend independently enforces `require_super_admin`
 * on every /api/v1/super-admin endpoint.
 */
function SuperAdminLayout() {
  const role = useCurrentRole();
  if (role !== "super_admin") {
    return <AccessDeniedState />;
  }
  return <Outlet />;
}

export const Route = createFileRoute("/dashboard/super-admin")({
  head: () => ({ meta: [{ title: "Super Admin Platform — OFC360" }] }),
  component: SuperAdminLayout,
});
