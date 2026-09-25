import { useMemo, type ComponentType, type ReactElement, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Briefcase, Building2, Clock, KeyRound, PieChartIcon, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/lib/aurix-store";
import { cn } from "@/lib/utils";
import { ANALYTICS_MAX_ORGANIZATIONS, ANALYTICS_MAX_USERS, useAnalyticsDataset, useSuperAdminStatistics } from "../hooks";
import {
  buildMonthlyCounts,
  bucketSignInRecency,
  countOrganizationsByPlan,
  countSignedInWithin,
  countUsersByRole,
  sumCounts,
  topOrganizationsByWorkforce,
} from "../analytics";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  InlineNotice,
  KpiNumber,
  LastUpdated,
  RefreshButton,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import { formatCount, formatTime } from "../formatters";

const TREND_MONTHS = 12;
const TOP_ORGANIZATIONS = 10;
/** One color per sign-in recency bucket (last bucket = never signed in). */
const RECENCY_COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#f59e0b", "#94a3b8"];
const PALETTE = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4", "#f43f5e", "#0ea5e9", "#84cc16", "#e879f9", "#94a3b8"];

type IconComponent = ComponentType<{ className?: string }>;

interface TooltipEntry {
  name?: string | number;
  value?: string | number;
  payload?: { label?: string; name?: string };
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string | number }) {
  if (!active || !payload || payload.length === 0) return null;
  const title = label ?? payload[0]?.payload?.label ?? payload[0]?.payload?.name ?? payload[0]?.name;
  return (
    <div className="rounded-lg border border-border/60 bg-card/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {title !== undefined && <div className="mb-1 font-semibold text-foreground">{title}</div>}
      {payload.map((entry, index) => (
        <div key={index} className="text-muted-foreground">
          {entry.name}: <span className="font-semibold text-foreground">{formatCount(Number(entry.value))}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconClass,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  icon: IconComponent;
  iconClass: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl", className)}>
      <div className="mb-3 flex items-start gap-2">
        <Icon className={cn("mt-0.5 h-4 w-4", iconClass)} />
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ChartArea({ ready, empty, height = 260, children }: { ready: boolean; empty: boolean; height?: number; children: ReactElement }) {
  if (!ready) return <div className="w-full animate-pulse rounded-xl bg-muted/10" style={{ height }} />;
  if (empty) {
    return (
      <div style={{ height }} className="flex">
        <EmptyState icon={BarChart3} title="No data available" className="flex-1" />
      </div>
    );
  }
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

const axisProps = { stroke: "#888888", fontSize: 10, tickLine: false, axisLine: false } as const;

export function SuperAdminAnalyticsPage() {
  const mounted = useMounted();
  const statistics = useSuperAdminStatistics();
  const dataset = useAnalyticsDataset();

  const derived = useMemo(() => {
    if (!dataset.data) return null;
    const users = dataset.data.users.items;
    const organizations = dataset.data.organizations.items;
    const now = Date.now();
    return {
      userSignups: buildMonthlyCounts(users.map((user) => user.createdAt), TREND_MONTHS),
      organizationSignups: buildMonthlyCounts(organizations.map((org) => org.createdAt), TREND_MONTHS),
      signInRecency: bucketSignInRecency(users, now),
      signedIn7d: countSignedInWithin(users, 7, now),
      signedIn30d: countSignedInWithin(users, 30, now),
      neverSignedIn: users.filter((user) => !user.lastLoginAt).length,
      usersByRole: countUsersByRole(users),
      organizationsByPlan: countOrganizationsByPlan(organizations),
      largestOrganizations: topOrganizationsByWorkforce(organizations, TOP_ORGANIZATIONS),
      analyzedUsers: users.length,
    };
  }, [dataset.data]);

  if (dataset.isError && isAuthorizationError(dataset.error)) {
    return <AccessDeniedState error={dataset.error} />;
  }

  const stats = statistics.data;
  const datasetLoading = dataset.isPending;
  const chartsReady = mounted && Boolean(derived);
  const statusData =
    stats && stats.users.active !== null && stats.users.inactive !== null
      ? [
          { name: "Active", value: stats.users.active, color: "#10b981" },
          { name: "Inactive", value: stats.users.inactive, color: "#f43f5e" },
        ]
      : [];
  const statusTotal = statusData.reduce((total, entry) => total + entry.value, 0);

  const percentOfAnalyzed = (count: number) =>
    derived && derived.analyzedUsers > 0 ? `${Math.round((count / derived.analyzedUsers) * 100)}% of analyzed accounts` : "";

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Usage &amp; Analytics</h1>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">Platform Metrics</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Growth, sign-in activity and distribution metrics aggregated from live platform records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LastUpdated timestamp={dataset.dataUpdatedAt} />
          <RefreshButton
            onClick={() => {
              void statistics.refetch();
              void dataset.refetch();
            }}
            refreshing={statistics.isFetching || dataset.isFetching}
          />
        </div>
      </div>

      {dataset.data && (
        <InlineNotice tone={dataset.data.users.truncated || dataset.data.organizations.truncated ? "warning" : "info"}>
          Charts aggregate {formatCount(dataset.data.users.items.length)} user records and{" "}
          {formatCount(dataset.data.organizations.items.length)} organization records read from the API at{" "}
          {formatTime(dataset.data.collectedAt)}.
          {dataset.data.users.truncated &&
            ` Only the ${formatCount(ANALYTICS_MAX_USERS)} most recently registered users are included; older accounts are not reflected in user charts.`}
          {dataset.data.organizations.truncated &&
            ` Only the ${formatCount(ANALYTICS_MAX_ORGANIZATIONS)} most recent organizations are included.`}
        </InlineNotice>
      )}

      {statistics.isError && (
        <ErrorState
          title="Unable to load Super Admin statistics. Please try again."
          error={statistics.error}
          onRetry={() => void statistics.refetch()}
          retrying={statistics.isFetching}
        />
      )}

      {/* Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Highlight label="Total users" icon={Users} iconClass="text-purple-400">
          <KpiNumber value={stats?.users.total ?? null} loading={statistics.isPending} className="text-3xl font-extrabold text-foreground" />
          <div className="mt-1 text-xs text-muted-foreground">
            {statistics.isPending ? "…" : `${formatCount(stats?.users.active)} active · ${formatCount(stats?.users.inactive)} inactive`}
          </div>
        </Highlight>
        <Highlight label="Signed in · last 30 days" icon={KeyRound} iconClass="text-emerald-400">
          <KpiNumber value={derived?.signedIn30d ?? null} loading={datasetLoading} className="text-3xl font-extrabold text-foreground" />
          <div className="mt-1 text-xs text-muted-foreground">
            {derived ? `${percentOfAnalyzed(derived.signedIn30d)} · ${formatCount(derived.signedIn7d)} in last 7 days` : "…"}
          </div>
        </Highlight>
        <Highlight label="Never signed in" icon={Clock} iconClass="text-amber-400">
          <KpiNumber value={derived?.neverSignedIn ?? null} loading={datasetLoading} className="text-3xl font-extrabold text-foreground" />
          <div className="mt-1 text-xs text-muted-foreground">
            {derived ? percentOfAnalyzed(derived.neverSignedIn) || "No accounts analyzed" : "…"}
          </div>
        </Highlight>
        <Highlight label="Organizations" icon={Building2} iconClass="text-blue-400">
          <KpiNumber value={stats?.organizations.total ?? null} loading={statistics.isPending} className="text-3xl font-extrabold text-foreground" />
          <div className="mt-1 text-xs text-muted-foreground">
            {statistics.isPending ? "…" : `${formatCount(stats?.activeWorkforce)} active employee records`}
          </div>
        </Highlight>
      </div>

      {dataset.isError ? (
        <ErrorState
          title="Unable to load analytics data. Please try again."
          error={dataset.error}
          onRetry={() => void dataset.refetch()}
          retrying={dataset.isFetching}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="New user accounts" subtitle={`Accounts created per month · last ${TREND_MONTHS} months`} icon={UserPlus} iconClass="text-purple-400">
            <ChartArea ready={chartsReady} empty={!derived || sumCounts(derived.userSignups) === 0}>
              <BarChart data={derived?.userSignups ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis allowDecimals={false} {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(168,85,247,0.08)" }} />
                <Bar dataKey="count" name="New accounts" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartArea>
          </ChartCard>

          <ChartCard title="New organizations" subtitle={`Tenant companies created per month · last ${TREND_MONTHS} months`} icon={Building2} iconClass="text-blue-400">
            <ChartArea ready={chartsReady} empty={!derived || sumCounts(derived.organizationSignups) === 0}>
              <BarChart data={derived?.organizationSignups ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis allowDecimals={false} {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
                <Bar dataKey="count" name="New organizations" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartArea>
          </ChartCard>

          <ChartCard title="Sign-in recency" subtitle="Time since each account's last successful sign-in" icon={KeyRound} iconClass="text-emerald-400">
            <ChartArea ready={chartsReady} empty={!derived || derived.analyzedUsers === 0}>
              <BarChart data={derived?.signInRecency ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                <XAxis dataKey="label" {...axisProps} interval={0} />
                <YAxis allowDecimals={false} {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.08)" }} />
                <Bar dataKey="count" name="Accounts" radius={[6, 6, 0, 0]}>
                  {(derived?.signInRecency ?? []).map((entry, index) => (
                    <Cell key={entry.label} fill={RECENCY_COLORS[index % RECENCY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartArea>
          </ChartCard>

          <ChartCard title="Account status" subtitle="Active vs inactive accounts (platform statistics)" icon={PieChartIcon} iconClass="text-rose-400">
            <ChartArea ready={mounted && !statistics.isPending} empty={statusTotal === 0}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={60} outerRadius={88} paddingAngle={3}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ChartArea>
          </ChartCard>

          <ChartCard title="Users by role" subtitle="Exact count per stored role value" icon={Users} iconClass="text-sky-400">
            <ChartArea
              ready={chartsReady}
              empty={!derived || derived.usersByRole.length === 0}
              height={Math.max(220, (derived?.usersByRole.length ?? 0) * 30 + 40)}
            >
              <BarChart data={derived?.usersByRole ?? []} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" horizontal={false} />
                <XAxis type="number" allowDecimals={false} {...axisProps} />
                <YAxis type="category" dataKey="label" width={110} {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(14,165,233,0.08)" }} />
                <Bar dataKey="count" name="Users" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ChartArea>
          </ChartCard>

          <ChartCard title="Organizations by plan" subtitle="Plan recorded on each tenant's subscription or profile" icon={PieChartIcon} iconClass="text-amber-400">
            <ChartArea ready={chartsReady} empty={!derived || derived.organizationsByPlan.length === 0}>
              <PieChart>
                <Pie
                  data={derived?.organizationsByPlan ?? []}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {(derived?.organizationsByPlan ?? []).map((entry, index) => (
                    <Cell key={entry.label} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ChartArea>
          </ChartCard>

          <ChartCard
            title="Largest organizations by workforce"
            subtitle={`Top ${TOP_ORGANIZATIONS} tenants by active employee records`}
            icon={Briefcase}
            iconClass="text-emerald-400"
            className="lg:col-span-2"
          >
            <ChartArea
              ready={chartsReady}
              empty={!derived || derived.largestOrganizations.length === 0}
              height={Math.max(220, (derived?.largestOrganizations.length ?? 0) * 34 + 40)}
            >
              <BarChart data={derived?.largestOrganizations ?? []} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" horizontal={false} />
                <XAxis type="number" allowDecimals={false} {...axisProps} />
                <YAxis type="category" dataKey="name" width={160} {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.08)" }} />
                <Bar dataKey="employees" name="Active employees" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ChartArea>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function Highlight({
  label,
  icon: Icon,
  iconClass,
  children,
}: {
  label: string;
  icon: IconComponent;
  iconClass: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm">
      <div className="flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
        {label}
        <Icon className={cn("h-4 w-4", iconClass)} />
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default SuperAdminAnalyticsPage;
