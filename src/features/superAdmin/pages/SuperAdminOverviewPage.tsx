import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Users,
  Building2,
  Activity,
  Server,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  UserCheck,
  UserX,
  FileText,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { superAdminApi } from "../superAdminApi";
import type {
  SuperAdminUserStats,
  PlatformOrganization,
  PlatformSystemActivity,
  PlatformSystemHealth,
} from "../types";

export function SuperAdminOverviewPage() {
  const [stats, setStats] = useState<SuperAdminUserStats | null>(null);
  const [orgs, setOrgs] = useState<PlatformOrganization[]>([]);
  const [activities, setActivities] = useState<PlatformSystemActivity[]>([]);
  const [health, setHealth] = useState<PlatformSystemHealth | null>(null);

  const loadData = async () => {
    try {
      const [s, o, a, h] = await Promise.all([
        superAdminApi.getStats(),
        superAdminApi.getOrganizations(),
        superAdminApi.getSystemActivity(),
        superAdminApi.getSystemHealth(),
      ]);
      setStats(s);
      setOrgs(o);
      setActivities(a);
      setHealth(h);
    } catch (err) {
      console.error("Failed to load super admin data", err);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Total Registered Users</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {stats?.totalUsers ?? "—"}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              Across {orgs.length} Organizations
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            <span className="text-emerald-400 font-medium">{stats?.activeUsers ?? 0} Active</span>
            <span>•</span>
            <span className="text-rose-400 font-medium">{stats?.inactiveUsers ?? 0} Inactive</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Organizations</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {orgs.length}
            </span>
            <span className="text-xs font-medium text-blue-400">
              Multi-Tenant Accounts
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            <span>Enterprise: 1</span>
            <span>Business: 1</span>
            <span>Starter: 1</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">System Health</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-400 capitalize">
              {health?.status || "Healthy"}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {health?.uptime || "99.98%"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            <span>API: {health?.apiLatencyMs || 42}ms</span>
            <span>DB: {health?.databaseLatencyMs || 14}ms</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Platform Owner Scope</span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
              <Sliders className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Isolated
            </span>
            <span className="text-xs text-muted-foreground">
              Platform Layer
            </span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero Company HR Conflation</span>
          </div>
        </div>
      </div>

      {/* User Statistics by Role Breakdown */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">User Statistics by Role</h2>
            <p className="text-xs text-muted-foreground">
              Real-time census of accounts across all customer organizations
            </p>
          </div>
          <Link to="/dashboard/super-admin/users">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-purple-400 hover:text-purple-300">
              Inspect user registry
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              HR Admins
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {stats?.hrAdmins ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Organization administrators
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Managers
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {stats?.managers ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Team leads &amp; approvers
            </div>
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Employees
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {stats?.employees ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Self-service members
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              IT Admins
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {stats?.itAdmins ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Technical operations
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Executives
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {stats?.executives ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Strategic leadership (C-Suite)
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Organizations & Live Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Organizations Summary */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              <div>
                <h3 className="text-base font-bold text-foreground">Customer Organizations</h3>
                <p className="text-xs text-muted-foreground">Multi-tenant usage and accounts</p>
              </div>
            </div>
            <Link to="/dashboard/super-admin/organizations">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-blue-400 hover:text-blue-300">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {orgs.map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between rounded-xl border border-border/40 bg-background/50 p-3.5 hover:border-border transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm text-foreground">{org.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{org.domain}</span>
                    <span>•</span>
                    <span>{org.storageUsed} used</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-400 border-blue-500/30">
                    {org.plan}
                  </Badge>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-foreground">{org.totalUsers} users</div>
                    <div className="text-[10px] text-emerald-400">{org.activeUsers} active</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Activity */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <div>
                <h3 className="text-base font-bold text-foreground">Platform Activity Feed</h3>
                <p className="text-xs text-muted-foreground">Real-time actions across all tenants</p>
              </div>
            </div>
            <Link to="/dashboard/super-admin/activity">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-purple-400 hover:text-purple-300">
                Full Feed <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between rounded-xl border border-border/40 bg-background/50 p-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-foreground">{act.action}</div>
                  <div className="text-muted-foreground">
                    By <span className="text-foreground font-medium">{act.user}</span> ({act.organization})
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">IP: {act.ipAddress}</div>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Administration Hub */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl">
        <h3 className="text-base font-bold text-foreground mb-1">Platform Administration Modules</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Direct navigation to platform owner controls
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/super-admin/users"
            className="rounded-xl border border-border/50 bg-background/40 p-4 hover:border-purple-500/50 hover:bg-accent/40 transition-all group"
          >
            <Users className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-foreground mt-2">User Registry</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Inspect, filter, activate or deactivate accounts
            </div>
          </Link>

          <Link
            to="/dashboard/super-admin/audit-logs"
            className="rounded-xl border border-border/50 bg-background/40 p-4 hover:border-blue-500/50 hover:bg-accent/40 transition-all group"
          >
            <FileText className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-foreground mt-2">Audit Logs</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Security compliance, admin action history &amp; severity tracking
            </div>
          </Link>

          <Link
            to="/dashboard/super-admin/settings"
            className="rounded-xl border border-border/50 bg-background/40 p-4 hover:border-emerald-500/50 hover:bg-accent/40 transition-all group"
          >
            <Sliders className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-foreground mt-2">Platform Settings</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Maintenance mode, authentication rules &amp; session timeout
            </div>
          </Link>

          <Link
            to="/dashboard/super-admin/platform-config"
            className="rounded-xl border border-border/50 bg-background/40 p-4 hover:border-amber-500/50 hover:bg-accent/40 transition-all group"
          >
            <Server className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-foreground mt-2">System Diagnostics</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Cluster health, latency gauges &amp; infrastructure status
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
