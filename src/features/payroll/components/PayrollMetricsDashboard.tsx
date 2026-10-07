import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertOctagon,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building,
  Calendar,
  Clock,
  Coins,
  FileSpreadsheet,
  Layers,
  Play,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  PayrollDashboardData,
  PayrollPeriod,
} from "@/services/payrollApi";

// ── Currency Formatter (INR) ──────────────────────────────────────────
function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

// ── Chart Colors & Dark Mode Tooltip ──────────────────────────────────
const CHART_COLORS = [
  "#6366f1", // Indigo
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#a855f7", // Purple
  "#3b82f6", // Blue
];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "12px",
  color: "#f8fafc",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
};

interface MetricKpiConfig {
  label: string;
  value: string;
  subtext?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent: string;
}

interface PayrollMetricsDashboardProps {
  data: PayrollDashboardData | null;
  periods: PayrollPeriod[];
  selectedPeriodId: string;
  onPeriodChange: (id: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onRunPayrollClick?: () => void;
  canRunPayroll?: boolean;
}

export function PayrollMetricsDashboard({
  data,
  periods,
  selectedPeriodId,
  onPeriodChange,
  isLoading,
  onRefresh,
  onRunPayrollClick,
  canRunPayroll = false,
}: PayrollMetricsDashboardProps) {
  const navigate = useNavigate();

  // Selected period object
  const selectedPeriod = useMemo(() => {
    return periods.find((p) => p.id === selectedPeriodId) || null;
  }, [periods, selectedPeriodId]);

  // Derived Summary Figures (strictly from live backend data)
  const employeeCount = data?.summary?.employeeCount ?? null;
  const grossPayroll = data?.summary?.grossPayroll ?? null;
  const totalDeductions = data?.summary?.totalDeductions ?? null;
  const netPayroll = data?.summary?.netPayroll ?? null;
  const employerContributions = data?.summary?.employerCost ?? null;
  const totalPayrollCost =
    grossPayroll !== null || employerContributions !== null
      ? (grossPayroll ?? 0) + (employerContributions ?? 0)
      : null;

  const avgSalary =
    employeeCount !== null && employeeCount > 0 && grossPayroll !== null
      ? Math.round(grossPayroll / employeeCount)
      : null;
  const pendingApprovalsCount =
    data?.status === "Review" || data?.status === "Processing" ? 1 : 0;
  const payrollExceptionsCount = data?.issues
    ? (data.issues.errors?.length ?? 0) + (data.issues.warnings?.length ?? 0)
    : null;
  const failedPaymentsCount = data?.recentRuns
    ? data.recentRuns.filter((r) => r.status?.toLowerCase() === "failed").length
    : null;
  const pendingPayrollAmount = data?.status === "Finalized" ? 0 : netPayroll;

  // Real Backend KPI Cards
  const kpiConfigs: MetricKpiConfig[] = [
    {
      label: "Total Payroll Cost",
      value: formatINR(totalPayrollCost),
      subtext: "Gross + Employer Statutory matching",
      icon: Banknote,
      accent: "from-indigo-500/20 to-blue-500/10 text-indigo-400 border-indigo-500/30",
    },
    {
      label: "Net Payroll",
      value: formatINR(netPayroll),
      subtext: "Net disbursed to employee accounts",
      icon: TrendingUp,
      accent: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      label: "Gross Payroll",
      value: formatINR(grossPayroll),
      subtext: "Total earnings before deductions",
      icon: Layers,
      accent: "from-sky-500/20 to-cyan-500/10 text-sky-400 border-sky-500/30",
    },
    {
      label: "Total Deductions",
      value: formatINR(totalDeductions),
      subtext: "Statutory & voluntary deductions",
      icon: TrendingDown,
      accent: "from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30",
    },
    {
      label: "Total Employees Paid",
      value: formatCount(employeeCount),
      subtext: "Active salaried personnel in cycle",
      icon: Users,
      accent: "from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30",
    },
    {
      label: "Pending Payroll",
      value: formatINR(pendingPayrollAmount),
      subtext: "Scheduled / unreleased disbursement",
      trend: data?.status ? `Status: ${data.status}` : undefined,
      trendDirection: "neutral",
      icon: Clock,
      accent: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    },
    {
      label: "Payroll Exceptions",
      value: formatCount(payrollExceptionsCount),
      subtext: "Anomalies & validation warnings",
      trend:
        payrollExceptionsCount !== null
          ? payrollExceptionsCount > 0
            ? `${payrollExceptionsCount} items flagged`
            : "Clean validation pass"
          : undefined,
      trendDirection:
        payrollExceptionsCount !== null && payrollExceptionsCount > 0 ? "down" : "up",
      icon: AlertCircle,
      accent:
        payrollExceptionsCount !== null && payrollExceptionsCount > 0
          ? "from-amber-500/20 to-rose-500/10 text-amber-400 border-amber-500/30"
          : "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      label: "Failed Payments",
      value: formatCount(failedPaymentsCount),
      subtext: "Rejected / returned bank transfers",
      trend:
        failedPaymentsCount !== null
          ? failedPaymentsCount === 0
            ? "Zero failure rate"
            : "Retry needed"
          : undefined,
      trendDirection: failedPaymentsCount === 0 ? "up" : "down",
      icon: AlertOctagon,
      accent:
        failedPaymentsCount !== null && failedPaymentsCount > 0
          ? "from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30"
          : "from-slate-500/20 to-slate-600/10 text-slate-400 border-slate-500/30",
    },
    {
      label: "Pending Approvals",
      value: formatCount(pendingApprovalsCount),
      subtext: "Sign-offs awaiting HR / Finance",
      trend:
        pendingApprovalsCount === 0 ? "All sign-offs completed" : "Approval queue active",
      trendDirection: "neutral",
      icon: UserCheck,
      accent: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      label: "Employer Contributions",
      value: formatINR(employerContributions),
      subtext: "PF, ESI, gratuity matching funds",
      icon: Building,
      accent: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30",
    },
    {
      label: "Average Salary",
      value: formatINR(avgSalary),
      subtext: "Mean compensation per employee",
      icon: Coins,
      accent: "from-emerald-500/20 to-green-500/10 text-emerald-400 border-emerald-500/30",
    },
  ];

  // Chart: Payroll Cost Trend (Constructed strictly from real recent runs)
  const costTrendData = useMemo(() => {
    if (!data?.recentRuns || data.recentRuns.length === 0) return [];
    return [...data.recentRuns]
      .reverse()
      .map((run) => ({
        month:
          run.periodName ||
          (run.runDate
            ? new Date(run.runDate).toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit",
              })
            : "—"),
        totalCost: run.grossPayroll ?? 0,
        netPayroll: run.netPayroll ?? 0,
      }));
  }, [data?.recentRuns]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Filter Bar & Actions ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Payroll Cycle</div>
            <div className="text-sm font-semibold text-foreground">
              {selectedPeriod ? selectedPeriod.name : "Active Payroll Period"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {periods.length > 0 ? (
            <div className="w-[240px]">
              <Select value={selectedPeriodId} onValueChange={onPeriodChange}>
                <SelectTrigger className="h-9 w-full bg-card/80 border-border/80 text-xs font-medium rounded-lg">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      <span>{p.name}</span>
                      {p.isCurrent ? (
                        <span className="ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400">
                          Current
                        </span>
                      ) : null}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 px-3 text-xs gap-1.5 cursor-pointer rounded-lg border-border/80"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {canRunPayroll && onRunPayrollClick ? (
            <Button
              size="sm"
              onClick={onRunPayrollClick}
              className="h-9 gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold shadow-md cursor-pointer border-0"
            >
              <Play className="h-3.5 w-3.5 fill-white text-white" />
              <span>Run Payroll</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── 14 KPI Cards Grid ───────────────────────────────────────── */}
      <section aria-labelledby="payroll-kpi-heading">
        <h2 id="payroll-kpi-heading" className="sr-only">
          Payroll Performance Indicators
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {kpiConfigs.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                style={{ animation: `fade-in 300ms ease-out ${idx * 25}ms both` }}
                className={`group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br ${kpi.accent} p-4.5 backdrop-blur-xl shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md text-left`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                      {kpi.label}
                    </div>
                    <div className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground truncate">
                      {kpi.value}
                    </div>
                  </div>
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-background/60 shadow-xs">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>

                {kpi.subtext ? (
                  <p className="mt-2 text-[11px] text-muted-foreground line-clamp-1 leading-normal">
                    {kpi.subtext}
                  </p>
                ) : null}

                {kpi.trend ? (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium">
                    {kpi.trendDirection === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                    ) : kpi.trendDirection === "down" ? (
                      <ArrowDownRight className="h-3 w-3 text-rose-400" />
                    ) : null}
                    <span
                      className={
                        kpi.trendDirection === "up"
                          ? "text-emerald-400"
                          : kpi.trendDirection === "down"
                          ? "text-rose-400"
                          : "text-muted-foreground"
                      }
                    >
                      {kpi.trend}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Chart: Payroll Cost Trend (from actual recent runs) ─────── */}
      <div className="rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 text-left">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Payroll Cost Trend
            </h3>
            <p className="text-xs text-muted-foreground">
              Total gross payroll vs net disbursed over recorded cycle runs
            </p>
          </div>
          {costTrendData.length > 0 && (
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-[10px]">
              {costTrendData.length} Cycles
            </Badge>
          )}
        </div>

        {costTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={costTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="currentColor"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
              />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(val: any) => formatINR(Number(val))}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Area
                type="monotone"
                dataKey="totalCost"
                name="Gross Payroll"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="netPayroll"
                name="Net Employee Pay"
                stroke={CHART_COLORS[2]}
                strokeWidth={2}
                fill="url(#colorNet)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/30 text-center">
            <Clock className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-xs font-medium text-foreground">
              No historical cycle runs available
            </p>
            <p className="text-[11px] text-muted-foreground">
              Historical trends will populate once payroll runs are recorded.
            </p>
          </div>
        )}
      </div>

      {/* ── Recent Payroll Runs Table ───────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 text-left">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
              Recent Payroll Runs & Audit History
            </h3>
            <p className="text-xs text-muted-foreground">
              Historical cycle executions, employee volume, and calculation status
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            <Link to="/dashboard/payroll/periods">All Cycles →</Link>
          </Button>
        </div>

        {data?.recentRuns && data.recentRuns.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 text-xs">
                  <TableHead>Payroll Period</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                  <TableHead className="text-right">Gross Payroll</TableHead>
                  <TableHead className="text-right">Net Payroll</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Run Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentRuns.map((run) => (
                  <TableRow key={run.id} className="text-xs">
                    <TableCell className="font-semibold text-foreground">
                      {run.periodName}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCount(run.employeeCount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatINR(run.grossPayroll)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-foreground">
                      {formatINR(run.netPayroll)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold uppercase ${
                          run.status?.toLowerCase() === "finalized" ||
                          run.status?.toLowerCase() === "approved"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : run.status?.toLowerCase() === "failed"
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {run.status || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {run.runDate
                        ? new Date(run.runDate).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-indigo-400 hover:text-indigo-300"
                        onClick={() => {
                          if (run.id) {
                            navigate({
                              to: `/dashboard/payroll/runs/${run.id}/preview` as any,
                            });
                          } else {
                            navigate({ to: "/dashboard/payroll/periods" as any });
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-background/30 p-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <div className="mt-2 text-sm font-medium text-foreground">No payroll runs yet</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Run provisional payroll for the selected cycle to record cycle transactions and
              audit logs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
