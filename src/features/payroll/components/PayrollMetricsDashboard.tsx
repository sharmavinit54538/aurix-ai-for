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

import {
  formatOptionalINR as formatINR,
  formatOptionalCount as formatCount,
} from "@/lib/format";
import { statusBadgeClass } from "@/lib/status-styles";
import { toPaise, addPaise, toRupees } from "../utils/money";

// ── Chart Colors & Theme-aware Tooltip ────────────────────────────────
const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  fontSize: "12px",
  padding: "8px 12px",
};

interface MetricKpiConfig {
  label: string;
  value: string;
  subtext?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon: LucideIcon;
  tone?: "default" | "warning" | "critical" | "positive";
}

interface PayrollMetricsDashboardProps {
  data: PayrollDashboardData | null;
  periods: PayrollPeriod[];
  selectedPeriodId: string;
  onPeriodChange: (id: string) => void;
  isLoading: boolean;
  onRunPayrollClick?: () => void;
  canRunPayroll?: boolean;
}

export function PayrollMetricsDashboard({
  data,
  periods,
  selectedPeriodId,
  onPeriodChange,
  isLoading: _isLoading,
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
      ? toRupees(addPaise(toPaise(grossPayroll ?? 0), toPaise(employerContributions ?? 0)))
      : null;

  const avgSalary =
    employeeCount !== null && employeeCount > 0 && grossPayroll !== null
      ? grossPayroll / employeeCount
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
    },
    {
      label: "Net Payroll",
      value: formatINR(netPayroll),
      subtext: "Net disbursed to employee accounts",
      icon: TrendingUp,
    },
    {
      label: "Gross Payroll",
      value: formatINR(grossPayroll),
      subtext: "Total earnings before deductions",
      icon: Layers,
    },
    {
      label: "Total Deductions",
      value: formatINR(totalDeductions),
      subtext: "Statutory & voluntary deductions",
      icon: TrendingDown,
    },
    {
      label: "Total Employees Paid",
      value: formatCount(employeeCount),
      subtext: "Active salaried personnel in cycle",
      icon: Users,
    },
    {
      label: "Pending Payroll",
      value: formatINR(pendingPayrollAmount),
      subtext: "Scheduled / unreleased disbursement",
      trend: data?.status ? `Status: ${data.status}` : undefined,
      trendDirection: "neutral",
      icon: Clock,
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
      tone:
        payrollExceptionsCount !== null && payrollExceptionsCount > 0
          ? "warning"
          : "positive",
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
      tone:
        failedPaymentsCount !== null && failedPaymentsCount > 0
          ? "critical"
          : "default",
    },
    {
      label: "Pending Approvals",
      value: formatCount(pendingApprovalsCount),
      subtext: "Sign-offs awaiting HR / Finance",
      trend:
        pendingApprovalsCount === 0 ? "All sign-offs completed" : "Approval queue active",
      trendDirection: "neutral",
      icon: UserCheck,
    },
    {
      label: "Employer Contributions",
      value: formatINR(employerContributions),
      subtext: "PF, ESI, gratuity matching funds",
      icon: Building,
    },
    {
      label: "Average Salary",
      value: formatINR(avgSalary),
      subtext: "Mean compensation per employee",
      icon: Coins,
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
    <div className="space-y-6">
      {/* ── Filter Bar & Actions ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Payroll Cycle</div>
            <div className="text-sm font-semibold text-foreground">
              {selectedPeriod ? selectedPeriod.name : "Active Payroll Period"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {periods.length > 0 ? (
            <div className="w-full sm:w-[240px]">
              <Select value={selectedPeriodId} onValueChange={onPeriodChange}>
                <SelectTrigger aria-label="Select payroll period" className="h-9 w-full bg-background border-border text-[13px] font-medium rounded-lg">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-[13px]">
                      <span>{p.name}</span>
                      {p.isCurrent ? (
                        <span className="ml-2 rounded-full border border-emerald-300 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:text-emerald-300">
                          Current
                        </span>
                      ) : null}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {canRunPayroll && onRunPayrollClick ? (
            <Button
              size="sm"
              onClick={onRunPayrollClick}
              className="h-9 gap-1.5 rounded-lg text-[13px] cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Run Payroll</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── KPI Cards Grid ───────────────────────────────────────── */}
      <section aria-labelledby="payroll-kpi-heading">
        <h2 id="payroll-kpi-heading" className="sr-only">
          Payroll Performance Indicators
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {kpiConfigs.map((kpi) => {
            const Icon = kpi.icon;
            const iconBoxClass =
              kpi.tone === "critical"
                ? "bg-destructive/10 text-destructive"
                : kpi.tone === "warning"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : kpi.tone === "positive"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-primary/10 text-primary";
            return (
              <div
                key={kpi.label}
                className="rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary/35 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-muted-foreground leading-snug">
                      {kpi.label}
                    </div>
                    <div className="mt-2 font-display text-2xl font-bold tracking-tight tabular-nums text-foreground">
                      {kpi.value}
                    </div>
                  </div>
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconBoxClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {kpi.subtext ? (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-1 leading-normal">
                    {kpi.subtext}
                  </p>
                ) : null}

                {kpi.trend ? (
                  <div className="mt-1.5 flex items-center gap-1 text-xs font-medium">
                    {kpi.trendDirection === "up" ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                    ) : kpi.trendDirection === "down" ? (
                      <ArrowDownRight className="h-3.5 w-3.5 text-rose-700 dark:text-rose-300" />
                    ) : null}
                    <span
                      className={
                        kpi.trendDirection === "up"
                          ? "text-emerald-700 dark:text-emerald-300"
                          : kpi.trendDirection === "down"
                          ? "text-rose-700 dark:text-rose-300"
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
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs text-left">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
              Payroll Cost Trend
            </h3>
            <p className="text-sm text-muted-foreground">
              Total gross payroll vs net disbursed over recorded cycle runs
            </p>
          </div>
          {costTrendData.length > 0 && (
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              {costTrendData.length} Cycles
            </Badge>
          )}
        </div>

        {costTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={costTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${val}`
                }
              />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(val: any) => formatINR(Number(val))}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
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
          <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-center px-4">
            <Clock className="h-8 w-8 text-muted-foreground/60" />
            <p className="mt-2 text-sm font-medium text-foreground">
              No historical cycle runs available
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Historical trends will populate once payroll runs are recorded.
            </p>
          </div>
        )}
      </div>

      {/* ── Recent Payroll Runs Table ───────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs text-left">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              Recent Payroll Runs & Audit History
            </h3>
            <p className="text-sm text-muted-foreground">
              Historical cycle executions, employee volume, and calculation status
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-[13px] text-primary hover:text-primary"
          >
            <Link to="/dashboard/payroll/periods">All Cycles →</Link>
          </Button>
        </div>

        {data?.recentRuns && data.recentRuns.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 text-xs">
                  <TableHead>Payroll Period</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Employees</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Gross Payroll</TableHead>
                  <TableHead className="text-right">Net Payroll</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Run Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentRuns.map((run) => {
                  const statusTone =
                    run.status?.toLowerCase() === "finalized" ||
                    run.status?.toLowerCase() === "approved"
                      ? statusBadgeClass("approved")
                      : run.status?.toLowerCase() === "failed"
                        ? statusBadgeClass("rejected")
                        : statusBadgeClass("pending");

                  return (
                    <TableRow key={run.id} className="text-sm">
                      <TableCell className="font-medium text-foreground">
                        <div>{run.periodName}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground md:hidden">
                          {formatCount(run.employeeCount)} employees
                          {run.runDate
                            ? ` · ${new Date(run.runDate).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}`
                            : ""}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right font-medium tabular-nums">
                        {formatCount(run.employeeCount)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-right font-mono text-muted-foreground">
                        {formatINR(run.grossPayroll)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-foreground whitespace-nowrap">
                        {formatINR(run.netPayroll)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium capitalize ${statusTone}`}
                        >
                          {run.status || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground whitespace-nowrap">
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
                          className="h-8 text-[13px] text-primary hover:text-primary whitespace-nowrap"
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
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
