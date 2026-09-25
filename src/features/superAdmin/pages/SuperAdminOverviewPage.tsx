import { useMemo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Building2,
  FileText,
  Server,
  ShieldCheck,
  Sliders,
  UserPlus,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAurix } from "@/lib/aurix-store";
import { cn } from "@/lib/utils";
import {
  useOrganizationDirectory,
  usePublicHealth,
  useSuperAdminAuditLogs,
  useSuperAdminStatistics,
  useSuperAdminUsers,
  useSystemHealth,
} from "../hooks";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  InlineNotice,
  KpiNumber,
  LastUpdated,
  Panel,
  RefreshButton,
  SkeletonRows,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import { AccountStatusBadge, OrganizationStatusBadge, RoleBadge } from "../components/Badges";
import {
  formatCount,
  formatDateTime,
  formatMilliseconds,
  formatRelativeTime,
  MISSING_VALUE,
  shortId,
} from "../formatters";

const RECENT_ORGANIZATIONS = 5;
const RECENT_USERS_PARAMS = { page: 1, pageSize: 5 } as const;
const RECENT_ACTIVITY_PARAMS = { page: 1, pageSize: 6 } as const;

const ROLE_CARDS = [
  { key: "hrAdmins", label: "HR Admins", hint: "hr_admin, admin, hr_manager, company_admin", tone: "emerald" },
  { key: "managers", label: "Managers", hint: "manager", tone: "blue" },
  { key: "employees", label: "Employees", hint: "employee, intern", tone: "sky" },
  { key: "itAdmins", label: "IT Admins", hint: "it_admin, cto, cio, ciso", tone: "cyan" },
  { key: "executives", label: "Executives", hint: "executive, ceo, cto, cfo, coo, cmo, clo, ciso, cio", tone: "amber" },
] as const;

const TONE_CLASSES: Record<(typeof ROLE_CARDS)[number]["tone"], { card: string; label: string }> = {
  emerald: { card: "border-emerald-500/20 bg-emerald-500/5", label: "text-emerald-400" },
  blue: { card: "border-blue-500/20 bg-blue-500/5", label: "text-blue-400" },
  sky: { card: "border-sky-500/20 bg-sky-500/5", label: "text-sky-400" },
  cyan: { card: "border-cyan-500/20 bg-cyan-500/5", label: "text-cyan-400" },
  amber: { card: "border-amber-500/20 bg-amber-500/5", label: "text-amber-400" },
};

export function SuperAdminOverviewPage() {
  const ws = useAurix();
  const statistics = useSuperAdminStatistics();
  const organizations = useOrganizationDirectory();
  const recentUsers = useSuperAdminUsers(RECENT_USERS_PARAMS);
  const recentActivity = useSuperAdminAuditLogs(RECENT_ACTIVITY_PARAMS);
  const systemHealth = useSystemHealth();
  const publicHealth = usePublicHealth();

  const queries = [statistics, organizations, recentUsers, recentActivity, systemHealth, publicHealth];
  const refreshing = queries.some((query) => query.isFetching);
  const refreshAll = () => {
    for (const query of queries) void query.refetch();
  };

  const organizationNames = useMemo(
    () => new Map((organizations.data ?? []).map((org) => [org.id, org.name] as const)),
    [organizations.data],
  );

  if (statistics.isError && isAuthorizationError(statistics.error)) {
    return <AccessDeniedState error={statistics.error} />;
  }

  const stats = statistics.data;
  const statsLoading = statistics.isPending;
  const totalOrganizations = stats?.organizations.total ?? null;
  const totalUsers = stats?.users.total ?? null;
  const health = publicHealth.data;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Platform Owner Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-card to-background p-6 shadow-xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                Platform Owner
              </span>
              <ApiStatusPill
                loading={publicHealth.isPending}
                failed={publicHealth.isError}
                status={health?.status ?? null}
                database={health?.database ?? null}
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Super Admin Command Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Platform-level oversight for OFC360. Completely separated from company HR &amp; employee hierarchies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RefreshButton onClick={refreshAll} refreshing={refreshing} label="Refresh Metrics" />
            <Button asChild size="sm" className="gap-2 text-xs bg-purple-600 hover:bg-purple-700 text-white">
              <Link to="/dashboard/super-admin/users">
                <Users className="h-3.5 w-3.5" />
                Manage All Users
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">Signed in as:</span>
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground font-mono text-[11px]">
              {ws.user?.email ?? MISSING_VALUE}
            </code>
            <span className="text-[11px]">
              Super Admin accounts in database:{" "}
              <span className="font-semibold text-foreground">
                {statsLoading ? "…" : formatCount(stats?.users.superAdmins)}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {health?.version && (
              <span>
                API version {health.version}
                {health.environment ? ` · ${health.environment}` : ""}
              </span>
            )}
            <LastUpdated timestamp={statistics.dataUpdatedAt} />
          </div>
        </div>
      </div>

      {statistics.isError && (
        <ErrorState
          title="Unable to load Super Admin statistics. Please try again."
          error={statistics.error}
          onRetry={() => void statistics.refetch()}
          retrying={statistics.isFetching}
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Registered Users" icon={Users} accent="purple">
          <div className="mt-3 flex items-baseline gap-2">
            <KpiNumber value={totalUsers} loading={statsLoading} className="text-3xl font-extrabold tracking-tight text-foreground" />
            <span className="text-xs font-medium text-muted-foreground">non-deleted accounts</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            <span className="text-emerald-400 font-medium">{statsLoading ? "…" : formatCount(stats?.users.active)} Active</span>
            <span>•</span>
            <span className="text-rose-400 font-medium">{statsLoading ? "…" : formatCount(stats?.users.inactive)} Inactive</span>
          </div>
        </KpiCard>

        <KpiCard label="Organizations" icon={Building2} accent="blue">
          <div className="mt-3 flex items-baseline gap-2">
            <KpiNumber value={totalOrganizations} loading={statsLoading} className="text-3xl font-extrabold tracking-tight text-foreground" />
            <span className="text-xs font-medium text-blue-400">tenant companies</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            <span title="Onboarding completed">Onboarded: {statsLoading ? "…" : formatCount(stats?.organizations.onboarded)}</span>
            <span>Trial: {statsLoading ? "…" : formatCount(stats?.organizations.trial)}</span>
            <span>Suspended: {statsLoading ? "…" : formatCount(stats?.organizations.suspended)}</span>
          </div>
        </KpiCard>

        <KpiCard label="Active Workforce" icon={Briefcase} accent="amber">
          <div className="mt-3 flex items-baseline gap-2">
            <KpiNumber value={stats?.activeWorkforce ?? null} loading={statsLoading} className="text-3xl font-extrabold tracking-tight text-foreground" />
            <span className="text-xs text-muted-foreground">employee records</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            Active, non-deleted employees across all organizations
          </div>
        </KpiCard>

        <KpiCard label="System Health" icon={Activity} accent="emerald">
          {systemHealth.isPending ? (
            <div className="mt-3 space-y-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : systemHealth.isError ? (
            <div className="mt-3 space-y-2 text-xs">
              <div className="text-lg font-bold text-rose-400">Check failed</div>
              <button
                type="button"
                onClick={() => void systemHealth.refetch()}
                className="text-purple-400 hover:text-purple-300 underline-offset-2 hover:underline"
              >
                Retry health check
              </button>
            </div>
          ) : (
            <>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-2xl font-bold tracking-tight capitalize",
                    systemHealth.data.database.status === "online"
                      ? "text-emerald-400"
                      : systemHealth.data.database.status === "degraded"
                        ? "text-amber-400"
                        : "text-muted-foreground",
                  )}
                >
                  {systemHealth.data.database.status ?? "Unknown"}
                </span>
                <span className="text-xs text-muted-foreground">database</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5">
                <span title="Measured by the API server (SELECT 1)">DB ping: {formatMilliseconds(systemHealth.data.database.pingMs)}</span>
                <span title="Measured from this browser">API: {formatMilliseconds(systemHealth.data.apiRoundTripMs)}</span>
              </div>
            </>
          )}
        </KpiCard>
      </div>

      {/* User Statistics by Role Breakdown */}
      <Panel>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">User Statistics by Role</h2>
            <p className="text-xs text-muted-foreground">Live account counts across all customer organizations</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-purple-400 hover:text-purple-300">
            <Link to="/dashboard/super-admin/users">
              Inspect user registry
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ROLE_CARDS.map((card) => (
            <div key={card.key} className={cn("rounded-xl border p-4", TONE_CLASSES[card.tone].card)}>
              <div className={cn("text-xs font-semibold uppercase tracking-wider", TONE_CLASSES[card.tone].label)}>
                {card.label}
              </div>
              <div className="text-2xl font-extrabold text-foreground mt-1">
                <KpiNumber value={stats?.users[card.key] ?? null} loading={statsLoading} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-1 truncate" title={card.hint}>
                {card.hint}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          CTO, CIO and CISO accounts are counted in both Executives and IT Admins, so role groups can add up to more than the total.
        </p>
      </Panel>

      {/* Two-Column Grid: Organizations & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <SectionHeader
            icon={Building2}
            iconClass="text-blue-400"
            title="Recent Organizations"
            subtitle="Newest tenant companies on the platform"
            to="/dashboard/super-admin/organizations"
            linkLabel="View all"
            linkClass="text-blue-400 hover:text-blue-300"
          />
          {organizations.isPending ? (
            <SkeletonRows rows={3} />
          ) : organizations.isError ? (
            <ErrorState
              title="Unable to load organizations."
              error={organizations.error}
              onRetry={() => void organizations.refetch()}
              retrying={organizations.isFetching}
            />
          ) : organizations.data.length === 0 ? (
            <>
              <EmptyState icon={Building2} title="No organizations found" description="No tenant companies have been created on the platform yet." />
              {(totalOrganizations ?? 0) > 0 && (
                <InlineNotice tone="warning" className="mt-3">
                  Platform statistics report {formatCount(totalOrganizations)} organizations, but the organization list came back empty.
                  The server may have failed to load tenant records — try refreshing.
                </InlineNotice>
              )}
            </>
          ) : (
            <div className="space-y-3">
              {organizations.data.slice(0, RECENT_ORGANIZATIONS).map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/50 p-3.5 hover:border-border transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">{org.name ?? shortId(org.id)}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 mt-0.5">
                      {org.domain && <span className="font-mono">{org.domain}</span>}
                      {org.domain && <span>•</span>}
                      <span title={formatDateTime(org.createdAt)}>Created {formatRelativeTime(org.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {org.plan && (
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-400 border-blue-500/30">
                        {org.plan}
                      </Badge>
                    )}
                    <div className="text-right">
                      <div className="text-xs font-semibold text-foreground">{formatCount(org.userCount)} users</div>
                      <div className="text-[10px] text-muted-foreground">{formatCount(org.employeeCount)} employees</div>
                    </div>
                    <OrganizationStatusBadge status={org.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel>
          <SectionHeader
            icon={Activity}
            iconClass="text-purple-400"
            title="Platform Activity Feed"
            subtitle="Latest entries from the platform audit trail"
            to="/dashboard/super-admin/activity"
            linkLabel="Full Feed"
            linkClass="text-purple-400 hover:text-purple-300"
          />
          {recentActivity.isPending ? (
            <SkeletonRows rows={4} />
          ) : recentActivity.isError ? (
            <ErrorState
              title="Unable to load platform activity."
              error={recentActivity.error}
              onRetry={() => void recentActivity.refetch()}
              retrying={recentActivity.isFetching}
            />
          ) : recentActivity.data.length === 0 ? (
            <EmptyState icon={Activity} title="No activity available" description="No audit events have been recorded yet." />
          ) : (
            <div className="space-y-3">
              {recentActivity.data.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/40 bg-background/50 p-3 text-xs"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-semibold text-foreground font-mono break-all">{event.action ?? MISSING_VALUE}</div>
                    {event.details && <div className="text-muted-foreground line-clamp-2">{event.details}</div>}
                    <div className="text-[11px] text-muted-foreground">
                      By <span className="text-foreground font-medium">{event.actorEmail ?? "actor not recorded"}</span>
                      {" · "}
                      {event.organizationId
                        ? organizationNames.get(event.organizationId) ?? `Tenant ${shortId(event.organizationId)}`
                        : "Platform-level"}
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground" title={formatDateTime(event.timestamp)}>
                    {formatRelativeTime(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Recent registrations */}
      <Panel className="p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <SectionHeader
            icon={UserPlus}
            iconClass="text-emerald-400"
            title="Recently Registered Users"
            subtitle="Newest accounts across all organizations"
            to="/dashboard/super-admin/users"
            linkLabel="All users"
            linkClass="text-emerald-400 hover:text-emerald-300"
          />
        </div>
        <div className="px-6 pb-6">
          {recentUsers.isPending ? (
            <SkeletonRows rows={3} />
          ) : recentUsers.isError ? (
            <ErrorState
              title="Unable to load recent users."
              error={recentUsers.error}
              onRetry={() => void recentUsers.refetch()}
              retrying={recentUsers.isFetching}
            />
          ) : recentUsers.data.length === 0 ? (
            <>
              <EmptyState icon={Users} title="No users found" description="No accounts have been registered yet." />
              {(totalUsers ?? 0) > 0 && (
                <InlineNotice tone="warning" className="mt-3">
                  Platform statistics report {formatCount(totalUsers)} users, but the user list came back empty. The server may have
                  failed to load user records — try refreshing.
                </InlineNotice>
              )}
            </>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Organization</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentUsers.data.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-foreground">{user.name ?? MISSING_VALUE}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">{user.email ?? MISSING_VALUE}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-2.5 px-3 text-foreground">
                        {user.organizationName ??
                          (user.organizationId
                            ? shortId(user.organizationId)
                            : user.role?.toLowerCase() === "super_admin"
                              ? "Platform"
                              : "No organization")}
                      </td>
                      <td className="py-2.5 px-3">
                        <AccountStatusBadge isActive={user.isActive} />
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground" title={formatDateTime(user.createdAt)}>
                        {formatRelativeTime(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Panel>

      {/* Quick Administration Hub */}
      <Panel>
        <h3 className="text-base font-bold text-foreground mb-1">Platform Administration Modules</h3>
        <p className="text-xs text-muted-foreground mb-4">Direct navigation to platform owner controls</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HubLink to="/dashboard/super-admin/users" icon={Users} accent="purple" title="User Registry" description="Search, filter, activate or deactivate accounts" />
          <HubLink to="/dashboard/super-admin/audit-logs" icon={FileText} accent="blue" title="Audit Logs" description="Searchable history of recorded platform events" />
          <HubLink to="/dashboard/super-admin/settings" icon={Sliders} accent="emerald" title="Platform Settings" description="Platform configuration values stored by the API" />
          <HubLink to="/dashboard/super-admin/platform-config" icon={Server} accent="amber" title="System Diagnostics" description="Live API, database and AI service health checks" />
        </div>
      </Panel>
    </div>
  );
}

type Accent = "purple" | "blue" | "emerald" | "amber";

const ACCENT_CLASSES: Record<Accent, { hover: string; icon: string; text: string; hubHover: string }> = {
  purple: { hover: "hover:border-purple-500/40", icon: "bg-purple-500/10 text-purple-400", text: "text-purple-400", hubHover: "hover:border-purple-500/50" },
  blue: { hover: "hover:border-blue-500/40", icon: "bg-blue-500/10 text-blue-400", text: "text-blue-400", hubHover: "hover:border-blue-500/50" },
  emerald: { hover: "hover:border-emerald-500/40", icon: "bg-emerald-500/10 text-emerald-400", text: "text-emerald-400", hubHover: "hover:border-emerald-500/50" },
  amber: { hover: "hover:border-amber-500/40", icon: "bg-amber-500/10 text-amber-400", text: "text-amber-400", hubHover: "hover:border-amber-500/50" },
};

function KpiCard({
  label,
  icon: Icon,
  accent,
  children,
}: {
  label: string;
  icon: typeof Users;
  accent: Accent;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl transition-all", ACCENT_CLASSES[accent].hover)}>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        <div className={cn("rounded-lg p-2", ACCENT_CLASSES[accent].icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  to,
  linkLabel,
  linkClass,
}: {
  icon: typeof Users;
  iconClass: string;
  title: string;
  subtitle: string;
  to: "/dashboard/super-admin/organizations" | "/dashboard/super-admin/activity" | "/dashboard/super-admin/users";
  linkLabel: string;
  linkClass: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-5 w-5", iconClass)} />
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <Button asChild variant="ghost" size="sm" className={cn("text-xs gap-1", linkClass)}>
        <Link to={to}>
          {linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

function HubLink({
  to,
  icon: Icon,
  accent,
  title,
  description,
}: {
  to: "/dashboard/super-admin/users" | "/dashboard/super-admin/audit-logs" | "/dashboard/super-admin/settings" | "/dashboard/super-admin/platform-config";
  icon: typeof Users;
  accent: Accent;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-xl border border-border/50 bg-background/40 p-4 hover:bg-accent/40 transition-all group",
        ACCENT_CLASSES[accent].hubHover,
      )}
    >
      <Icon className={cn("h-5 w-5 group-hover:scale-110 transition-transform", ACCENT_CLASSES[accent].text)} />
      <div className="font-semibold text-sm text-foreground mt-2">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
    </Link>
  );
}

function ApiStatusPill({
  loading,
  failed,
  status,
  database,
}: {
  loading: boolean;
  failed: boolean;
  status: string | null;
  database: string | null;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
        Checking API status…
      </span>
    );
  }
  if (failed || !status) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-rose-400">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        API health check failed
      </span>
    );
  }
  const healthy = status.toLowerCase() === "healthy";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", healthy ? "text-muted-foreground" : "text-amber-400")}>
      <span className={cn("h-2 w-2 rounded-full", healthy ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
      API {status}
      {database ? ` · database ${database}` : ""}
    </span>
  );
}

export default SuperAdminOverviewPage;
