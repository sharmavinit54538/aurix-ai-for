import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  Bell, Building2, CreditCard, Layers, ScrollText, Shield, ShieldCheck, Sliders, User,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Aurix" }] }),
  component: SettingsLayout,
});

const SETTINGS_NAV = [
  { to: "/dashboard/settings/general", label: "General", icon: Sliders },
  { to: "/dashboard/settings/company", label: "Company Settings", icon: Building2 },
  { to: "/dashboard/settings/roles-permissions", label: "Roles & Permissions", icon: ShieldCheck },
  { to: "/dashboard/settings/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/dashboard/settings/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/settings/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/settings/security", label: "Security", icon: Shield },
  { to: "/dashboard/settings/integrations", label: "Integrations", icon: Layers },
  { to: "/dashboard/settings/profile", label: "Profile", icon: User },
] as const;

function SettingsLayout() {
  const ws = useAurix();
  const role = ws.user?.role ?? "admin";
  const isEmployee = role === "employee";

  const visibleSettingsNav = isEmployee
    ? SETTINGS_NAV.filter((item) =>
        ["/dashboard/settings/profile", "/dashboard/settings/notifications", "/dashboard/settings/security"].includes(item.to)
      )
    : SETTINGS_NAV;

  return (
    <>
      <PageHeader
        title={isEmployee ? "My Profile & Preferences" : "Settings"}
        description={
          isEmployee
            ? "Manage your personal profile, security credentials, and notification preferences."
            : "Manage workspace configurations, access control, billing, security, and profile."
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {visibleSettingsNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{
                  className: "bg-accent text-foreground font-semibold shadow-xs",
                }}
                inactiveProps={{
                  className: "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </>
  );
}
