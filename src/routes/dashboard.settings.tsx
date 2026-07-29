import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Aurix" }] }),
  component: SettingsLayout,
});

function SettingsLayout() {
  const ws = useAurix();
  const role = ws.user?.role ?? "admin";
  const isEmployee = role === "employee";

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEmployee ? "My Profile & Preferences" : "Settings"}
        description={
          isEmployee
            ? "Manage your personal profile, security credentials, and notification preferences."
            : "Manage workspace configurations, access control, billing, security, and profile."
        }
      />

      <div className="w-full min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;
