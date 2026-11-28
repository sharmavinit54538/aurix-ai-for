/**
 * Shared Enterprise Report Components for OFC360 Payroll Analytics Dashboard.
 *
 * Covers Sections A-G:
 * - Access Guard (blocks Super Admin & unauthorized users)
 * - Section A: Report Header, Breadcrumbs, Refresh Timestamp, Print-ready Header
 * - Section B: Compact Responsive Global & Report-Specific Filter Toolbar
 * - Section C: Interactive KPI Cards with Loading, Error & Trend States
 * - Section D: Interactive Recharts (Line, Bar, Grouped/Stacked/Horizontal, Donut, Histogram, Waterfall)
 * - Section E: Data Table with Search, Sorting, Pagination, Column Configurator & Horizontal Scroll
 * - Section F: Employee Payroll Breakdown Drawer (with Official Payslip Download)
 * - Section G: Totals & Reconciliation Footer
 */

import React, { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpDown,
  ArrowUpRight,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Landmark,
  Layers,
  Minus,
  Printer,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/hrms/Shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAurix } from "@/lib/aurix-store";
import {
  formatCount,
  formatDate,
  formatDateTime,
  formatINR,
  formatOptionalINR,
} from "@/lib/format";
import { normalizeRole } from "@/lib/roles";
import { useCurrentRole } from "@/lib/use-current-role";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import { toast } from "sonner";
import { reportAnalyticsApi } from "../api/reportAnalyticsApi";
import type { ExportFormat, ReportFilterConfig, ReportKey } from "../types/reports";
import type {
  ChartDataPoint,
  EmployeePayrollDetail,
  ExtendedReportFilterConfig,
  ReportFilterOptions,
  ReportReconciliationSummary,
} from "../types/reportAnalytics";

// ── Icon Registry ────────────────────────────────────────────────────
export const REPORT_ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Receipt,
  Building2,
  Layers,
  Landmark,
  ArrowLeftRight,
  Users,
  TrendingUp,
  BookOpen,
};

// ── Accessible Enterprise Chart Palette ──────────────────────────────
export const CHART_COLORS = [
  "#2563eb", // Blue 600
  "#059669", // Emerald 600
  "#d97706", // Amber 600
  "#7c3aed", // Violet 600
  "#0891b2", // Cyan 600
  "#e11d48", // Rose 600
  "#ea580c", // Orange 600
  "#4f46e5", // Indigo 600
  "#0d9488", // Teal 600
  "#9333ea", // Purple 600
];

const MONTHS_OPTIONS = [
  { value: 4, label: "April (M1)" },
  { value: 5, label: "May (M2)" },
  { value: 6, label: "June (M3)" },
  { value: 7, label: "July (M4)" },
  { value: 8, label: "August (M5)" },
  { value: 9, label: "September (M6)" },
  { value: 10, label: "October (M7)" },
  { value: 11, label: "November (M8)" },
  { value: 12, label: "December (M9)" },
  { value: 1, label: "January (M10)" },
  { value: 2, label: "February (M11)" },
  { value: 3, label: "March (M12)" },
];

export function formatCompactINR(val: number): string {
  if (!Number.isFinite(val)) return "—";
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(1)}L`;
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(0)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
}

// ── Role & Tenant Access Guard ───────────────────────────────────────
export function ReportAccessGuard({
  requiredPermission,
  children,
}: {
  requiredPermission?: string;
  children: ReactNode;
}) {
  const aurixStore = useAurix();
  const currentRole = useCurrentRole();
  const permissions = useAppSelector(selectUserPermissions);
  const role = normalizeRole(currentRole ?? aurixStore.user?.role);

  if (aurixStore.isRestoring) {
    return (
      <div className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  // Super Admin is platform owner and must never automatically access tenant payroll reports
  if (role === "super_admin") {
    return (
      <div className="mx-auto max-w-4xl p-6 sm:p-10">
        <Alert variant="destructive" className="rounded-xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">Tenant Payroll Access Restricted</AlertTitle>
          <AlertDescription className="mt-1 text-xs">
            Platform Super Admin accounts cannot access tenant-level employee payroll reports,
            compensation records, or bank disbursement schedules.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasRoleAccess = role === "hr_admin" || role === "executive";
  const hasPermAccess =
    permissions.includes("*") ||
    permissions.includes("payroll.view") ||
    permissions.includes("payroll:view") ||
    permissions.includes("payroll:read") ||
    permissions.includes("payroll.reports") ||
    permissions.includes("reports:read") ||
    (requiredPermission ? permissions.includes(requiredPermission) : false);

  if (!hasRoleAccess && !hasPermAccess) {
    return (
      <div className="mx-auto max-w-4xl p-6 sm:p-10">
        <Alert variant="destructive" className="rounded-xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">Authorization Required</AlertTitle>
          <AlertDescription className="mt-1 text-xs">
            You do not have permission to access payroll analytics reports. Contact your HR or
            Finance administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Section A: Report Page Layout + Enterprise Print Header ──────────
export function ReportPageLayout({
  title,
  description,
  periodLabel,
  lastUpdated,
  backHref = "/dashboard/payroll/reports",
  breadcrumbs,
  actions,
  companyName,
  companyLogoUrl,
  appliedFilters,
  summaryTotals,
  children,
}: {
  title: string;
  description: string;
  periodLabel?: string;
  lastUpdated?: string | null;
  backHref?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  companyName?: string;
  companyLogoUrl?: string;
  appliedFilters?: ExtendedReportFilterConfig;
  summaryTotals?: Array<{ label: string; value: string }>;
  children: ReactNode;
}) {
  const aurixStore = useAurix();
  const authorizedUser = aurixStore.user?.fullName || aurixStore.user?.email || "Authorized User";

  const activeFilterChips = useMemo(() => {
    if (!appliedFilters) return [];
    const skip = new Set(["page", "limit", "sortBy", "sortDir"]);
    return Object.entries(appliedFilters)
      .filter(([k, v]) => !skip.has(k) && v !== undefined && v !== null && v !== "" && v !== false)
      .map(([k, v]) => `${k}: ${String(v)}`);
  }, [appliedFilters]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8 print:p-0">
      {/* Print-Only Enterprise Report Cover Header (Section 14) */}
      <div className="hidden print:block border-b border-border pb-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {companyLogoUrl ? (
              <img
                src={companyLogoUrl}
                alt={companyName || "Company Logo"}
                className="h-10 w-auto object-contain"
              />
            ) : null}
            <div>
              <div className="text-base font-bold text-foreground">
                {companyName || aurixStore.company?.name || "OFC360 Organization"}
              </div>
              <div className="text-lg font-bold text-primary">{title}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground space-y-0.5">
            <div>Period: {periodLabel || appliedFilters?.financialYear || "Current Scope"}</div>
            <div>Generated: {formatDateTime(new Date())}</div>
            <div>Prepared By: {authorizedUser}</div>
          </div>
        </div>
        {activeFilterChips.length > 0 && (
          <div className="mt-2 text-[11px] text-muted-foreground">
            Applied Filters: {activeFilterChips.join(" • ")}
          </div>
        )}
        {summaryTotals && summaryTotals.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2 border-t border-border/60 pt-2 text-xs">
            {summaryTotals.map((t) => (
              <div key={t.label}>
                <div className="text-[10px] text-muted-foreground">{t.label}</div>
                <div className="font-semibold tabular-nums">{t.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground print:hidden">
        <Link to="/dashboard/payroll/reports" className="hover:text-foreground transition-colors">
          Payroll Reports
        </Link>
        {breadcrumbs?.map((bc, i) => (
          <React.Fragment key={i}>
            <span>/</span>
            {bc.href ? (
              <Link to={bc.href as "/dashboard/payroll/reports"} className="hover:text-foreground transition-colors">
                {bc.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{bc.label}</span>
            )}
          </React.Fragment>
        ))}
        {!breadcrumbs?.length && (
          <>
            <span>/</span>
            <span className="font-medium text-foreground">{title}</span>
          </>
        )}
      </nav>

      {/* Report Header */}
      <header className="flex flex-col gap-4 border-b border-border/70 pb-4 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div className="flex items-start gap-3 min-w-0">
          <Link to={backHref as "/dashboard/payroll/reports"} aria-label="Back to All Reports">
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              {periodLabel && (
                <Badge variant="outline" className="text-[11px] font-medium border-primary/30 bg-primary/5 text-primary">
                  {periodLabel}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {lastUpdated && (
            <span className="text-[11px] text-muted-foreground mr-1">
              Refreshed {formatDateTime(lastUpdated)}
            </span>
          )}
          {actions}
        </div>
      </header>

      {children}
    </div>
  );
}

// ── Section C: Enterprise KPI Card ───────────────────────────────────
export function AnalyticsKpiCard({
  label,
  value,
  previousValue,
  changePercent,
  changeDirection,
  secondaryLabel,
  secondaryValue,
  icon: Icon,
  accent = "brand",
  loading = false,
  error,
  active = false,
  onClick,
  className = "",
}: {
  label: string;
  value: string;
  previousValue?: string;
  changePercent?: number | null;
  changeDirection?: "up" | "down" | "flat";
  secondaryLabel?: string;
  secondaryValue?: string;
  icon?: LucideIcon;
  accent?: "brand" | "success" | "warning" | "danger" | "muted";
  loading?: boolean;
  error?: string | null;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const iconToneClass = {
    brand: "bg-primary/10 text-primary",
    success: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    warning: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
    danger: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
    muted: "bg-muted text-muted-foreground",
  }[accent];

  const resolvedDir =
    changeDirection ??
    (changePercent !== undefined && changePercent !== null
      ? changePercent > 0
        ? "up"
        : changePercent < 0
          ? "down"
          : "flat"
      : "flat");

  const changeIcon =
    resolvedDir === "up" ? ArrowUpRight : resolvedDir === "down" ? ArrowDownRight : Minus;
  const changeColor =
    resolvedDir === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : resolvedDir === "down"
        ? "text-rose-600 dark:text-rose-400"
        : "text-muted-foreground";

  if (loading) {
    return (
      <div className={`rounded-[12px] border border-border bg-card p-5 shadow-xs ${className}`}>
        <div className="space-y-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-[12px] border border-rose-500/30 bg-card p-5 shadow-xs ${className}`}>
        <div className="text-[13px] font-medium text-muted-foreground">{label}</div>
        <div className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</div>
      </div>
    );
  }

  const baseClass = `rounded-[12px] border bg-card p-5 shadow-xs text-left transition-all ${
    active ? "border-primary ring-1 ring-primary/40 bg-primary/5" : "border-border"
  }`;

  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-muted-foreground truncate">{label}</div>
        <div className="mt-1.5 font-display text-[26px] font-semibold tracking-tight text-foreground tabular-nums leading-tight break-words">
          {value}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {changePercent !== undefined && changePercent !== null && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${changeColor}`}>
              {React.createElement(changeIcon, { className: "h-3 w-3" })}
              {Math.abs(changePercent).toFixed(1)}%
            </span>
          )}
          {secondaryLabel && secondaryValue && (
            <span className="text-[12px] text-muted-foreground">
              {secondaryLabel}: {secondaryValue}
            </span>
          )}
          {previousValue && (changePercent === undefined || changePercent === null) && (
            <span className="text-[12px] text-muted-foreground">Prev: {previousValue}</span>
          )}
        </div>
      </div>
      {Icon && (
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconToneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} w-full cursor-pointer hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
      >
        {content}
      </button>
    );
  }

  return <div className={`${baseClass} ${className}`}>{content}</div>;
}

export function KpiCardsGrid({
  children,
  columns = 4,
}: {
  children: ReactNode;
  columns?: 3 | 4 | 5;
}) {
  const colClass = {
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  }[columns];
  return <div className={`grid ${colClass} gap-4`}>{children}</div>;
}

// ── Section D: Drill-Down Breadcrumb Bar ─────────────────────────────
export function DrillDownBreadcrumbBar({
  selections,
  onClearAll,
  onRemove,
}: {
  selections: Array<{ key: string; label: string; value: string }>;
  onClearAll: () => void;
  onRemove: (key: string) => void;
}) {
  if (!selections.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-primary">Active Drill-Down:</span>
        {selections.map((s) => (
          <Badge key={s.key} variant="secondary" className="gap-1.5 text-xs">
            <span>
              {s.label}: <strong>{s.value}</strong>
            </span>
            <button
              type="button"
              aria-label={`Clear ${s.label} filter`}
              onClick={() => onRemove(s.key)}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs text-primary hover:bg-primary/10"
      >
        Clear Selection
      </Button>
    </div>
  );
}

// ── Section D: Chart Wrapper & Interactive Recharts ──────────────────
export function ReportChartWrapper({
  title,
  subtitle,
  loading = false,
  error,
  empty,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlassCard className={`min-w-0 p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {loading ? (
        <div className="flex h-[260px] items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-1 text-center text-xs text-rose-500">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      ) : empty ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-1 text-center text-xs text-muted-foreground">
          <FileText className="h-6 w-6 opacity-40" />
          <span>No Records Available</span>
        </div>
      ) : (
        <div className="w-full min-w-0">{children}</div>
      )}
    </GlassCard>
  );
}

export function ChartsGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>;
}

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  fontSize: "12px",
  padding: "8px 12px",
};

function formatChartVal(val: unknown, formatType: "currency" | "number" | "percentage"): string {
  const num = typeof val === "number" ? val : Number(val);
  if (!Number.isFinite(num)) return "—";
  if (formatType === "currency") return formatINR(num);
  if (formatType === "percentage") return `${num.toFixed(1)}%`;
  return formatCount(num);
}

function formatAxisTick(val: unknown, formatType: "currency" | "number" | "percentage"): string {
  const num = typeof val === "number" ? val : Number(val);
  if (!Number.isFinite(num)) return "";
  if (formatType === "currency") return formatCompactINR(num);
  if (formatType === "percentage") return `${num}%`;
  return formatCount(num);
}

export function ReportBarChart({
  data,
  dataKeys,
  xAxisKey = "label",
  colors = CHART_COLORS,
  formatType = "currency",
  height = 280,
  stacked = false,
  horizontal = false,
  onBarClick,
}: {
  data: ChartDataPoint[];
  dataKeys: { key: string; name: string }[];
  xAxisKey?: string;
  colors?: string[];
  formatType?: "currency" | "number" | "percentage";
  height?: number;
  stacked?: boolean;
  horizontal?: boolean;
  onBarClick?: (point: ChartDataPoint) => void;
}) {
  if (!Array.isArray(data) || !data.length) return null;

  if (horizontal) {
    return (
      <div style={{ height }} className="w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 20, top: 6, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              width={116}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v: string) => (v && v.length > 16 ? `${v.slice(0, 15)}…` : v)}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => formatAxisTick(v, formatType)}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value: unknown) => formatChartVal(value, formatType)}
            />
            {dataKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
            {dataKeys.map((dk, i) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                name={dk.name}
                fill={colors[i % colors.length]}
                radius={[0, 4, 4, 0]}
                stackId={stacked ? "stack" : undefined}
                cursor={onBarClick ? "pointer" : undefined}
                onClick={(entry) => {
                  const payload = (entry as unknown as { payload?: ChartDataPoint })?.payload ?? (entry as ChartDataPoint);
                  if (payload && onBarClick) onBarClick(payload);
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 6, right: 12, top: 6, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => formatAxisTick(v, formatType)}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: unknown) => formatChartVal(value, formatType)}
          />
          {dataKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
          {dataKeys.map((dk, i) => (
            <Bar
              key={dk.key}
              dataKey={dk.key}
              name={dk.name}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? "stack" : undefined}
              cursor={onBarClick ? "pointer" : undefined}
              onClick={(entry) => {
                const payload = (entry as unknown as { payload?: ChartDataPoint })?.payload ?? (entry as ChartDataPoint);
                if (payload && onBarClick) onBarClick(payload);
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportLineChart({
  data,
  dataKeys,
  xAxisKey = "label",
  colors = CHART_COLORS,
  formatType = "currency",
  height = 280,
  onPointClick,
}: {
  data: ChartDataPoint[];
  dataKeys: { key: string; name: string }[];
  xAxisKey?: string;
  colors?: string[];
  formatType?: "currency" | "number" | "percentage";
  height?: number;
  onPointClick?: (point: ChartDataPoint) => void;
}) {
  if (!Array.isArray(data) || !data.length) return null;

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ left: 6, right: 12, top: 6, bottom: 6 }}
          onClick={(state) => {
            const payload = (state as { activePayload?: Array<{ payload?: ChartDataPoint }> })?.activePayload?.[0]?.payload;
            if (payload && onPointClick) onPointClick(payload);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => formatAxisTick(v, formatType)}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: unknown) => formatChartVal(value, formatType)}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          {dataKeys.map((dk, i) => (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportDonutChart({
  data,
  valueKey = "value",
  nameKey = "label",
  colors = CHART_COLORS,
  formatType = "currency",
  height = 280,
  innerRadius = 56,
  onSliceClick,
}: {
  data: ChartDataPoint[];
  valueKey?: string;
  nameKey?: string;
  colors?: string[];
  formatType?: "currency" | "number" | "percentage";
  height?: number;
  innerRadius?: number;
  onSliceClick?: (point: ChartDataPoint) => void;
}) {
  if (!Array.isArray(data) || !data.length) return null;

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="46%"
            innerRadius={innerRadius}
            outerRadius={Math.min(height / 2 - 34, 92)}
            paddingAngle={2}
            cursor={onSliceClick ? "pointer" : undefined}
            onClick={(entry) => {
              const payload = (entry as unknown as { payload?: ChartDataPoint })?.payload ?? (entry as ChartDataPoint);
              if (payload && onSliceClick) onSliceClick(payload);
            }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: unknown) => formatChartVal(value, formatType)}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Waterfall Chart for Variance Breakdown (Opening -> Positive/Negative Drivers -> Closing).
 */
export function ReportWaterfallChart({
  steps,
  height = 280,
}: {
  steps: Array<{ label: string; delta: number; isTotal?: boolean }>;
  height?: number;
}) {
  const chartData = useMemo(() => {
    if (!Array.isArray(steps) || !steps.length) return [];
    let running = 0;
    return steps.map((step) => {
      if (step.isTotal) {
        const val = step.delta;
        return {
          label: step.label,
          base: 0,
          value: Math.abs(val),
          rawDelta: val,
          fill: "#2563eb",
        };
      }
      const start = running;
      running += step.delta;
      const base = Math.min(start, running);
      return {
        label: step.label,
        base,
        value: Math.abs(step.delta),
        rawDelta: step.delta,
        fill: step.delta >= 0 ? "#059669" : "#e11d48",
      };
    });
  }, [steps]);

  if (!chartData.length) return null;

  return (
    <div style={{ height }} className="w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ left: 6, right: 12, top: 6, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => formatCompactINR(Number(v))}
          />
          <ReferenceLine y={0} stroke="hsl(var(--border))" />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(_val: unknown, _name: unknown, props: { payload?: { rawDelta?: number } }) =>
              formatINR(props?.payload?.rawDelta ?? 0)
            }
          />
          <Bar dataKey="base" stackId="wf" fill="transparent" />
          <Bar dataKey="value" stackId="wf" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Section E: Interactive Data Table with Column Configurator ───────
export interface DataTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  isCurrency?: boolean;
  isDate?: boolean;
  isSensitive?: boolean;
  sortable?: boolean;
  defaultHidden?: boolean;
  width?: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

export function ReportDataTable({
  columns,
  rows,
  totalRecords = 0,
  page = 1,
  limit = 25,
  loading = false,
  error,
  emptyMessage = "No Records Available",
  emptyDescription,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
  onRowClick,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search records...",
  enableColumnConfig = true,
}: {
  columns: DataTableColumn[];
  rows: Record<string, unknown>[];
  totalRecords?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptyDescription?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: Record<string, unknown>) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  enableColumnConfig?: boolean;
}) {
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.key))
  );

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenCols.has(c.key)),
    [columns, hiddenCols]
  );

  const toggleColumn = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (columns.length - next.size > 1) next.add(key);
      return next;
    });
  };

  const totalPages = Math.max(1, Math.ceil(totalRecords / Math.max(1, limit)));
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <GlassCard className="overflow-hidden p-0">
      {/* Table Controls Bar */}
      <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs tabular-nums">
            {formatCount(totalRecords)} Record{totalRecords !== 1 ? "s" : ""}
          </Badge>
          {hiddenCols.size > 0 && (
            <span className="text-[11px] text-muted-foreground">
              ({hiddenCols.size} column{hiddenCols.size > 1 ? "s" : ""} hidden)
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onSearchChange !== undefined && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search table records"
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-52 rounded-lg pl-8 text-xs"
              />
            </div>
          )}

          {enableColumnConfig && columns.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-lg text-xs">
                  <Columns3 className="h-3.5 w-3.5" />
                  <span>Columns</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold">Visible Columns</span>
                  {hiddenCols.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setHiddenCols(new Set())}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Show All
                    </button>
                  )}
                </div>
                <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
                  {columns.map((col) => {
                    const checked = !hiddenCols.has(col.key);
                    return (
                      <label
                        key={col.key}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-muted/60"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleColumn(col.key)}
                          className="rounded border-border"
                        />
                        <span className="truncate">{col.label}</span>
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Horizontal-scrolling table container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 border-b border-border/70 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 whitespace-nowrap ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                        ? "text-center"
                        : "text-left"
                  } ${col.sortable && onSort ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                  style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && onSort && (
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortBy === col.key ? "text-primary" : "opacity-40"}`}
                      />
                    )}
                    {col.sortable && sortBy === col.key && (
                      <span className="text-primary">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-12 text-center text-rose-600 dark:text-rose-400"
                >
                  {error}
                </td>
              </tr>
            ) : safeRows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-4 py-12 text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-semibold text-foreground">{emptyMessage}</p>
                  {emptyDescription && (
                    <p className="mt-1 text-xs text-muted-foreground">{emptyDescription}</p>
                  )}
                </td>
              </tr>
            ) : (
              safeRows.map((row, idx) => (
                <tr
                  key={String(row.id ?? row.employeeId ?? row.employeeCode ?? idx)}
                  className={`transition-colors hover:bg-muted/40 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleColumns.map((col) => {
                    const val = row[col.key];
                    let displayVal: ReactNode;
                    if (col.render) {
                      displayVal = col.render(val, row);
                    } else if (col.isSensitive && typeof val === "string" && val.startsWith("ofc360:v1:")) {
                      displayVal = "—";
                    } else if (col.isCurrency) {
                      displayVal =
                        val !== null && val !== undefined && val !== ""
                          ? formatOptionalINR(val as number | string)
                          : "—";
                    } else if (col.isDate) {
                      displayVal = val ? formatDate(val as string) : "—";
                    } else {
                      displayVal =
                        val !== null && val !== undefined && val !== "" ? String(val) : "—";
                    }
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 whitespace-nowrap ${
                          col.align === "right"
                            ? "text-right font-mono"
                            : col.align === "center"
                              ? "text-center"
                              : "text-left"
                        } ${col.isCurrency ? "font-semibold tabular-nums" : ""}`}
                      >
                        {displayVal}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRecords > limit && (
        <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground print:hidden">
          <span>
            Showing {Math.min((page - 1) * limit + 1, totalRecords)}–
            {Math.min(page * limit, totalRecords)} of {formatCount(totalRecords)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Previous page"
              className="h-7 w-7"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 tabular-nums">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Next page"
              className="h-7 w-7"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ── Section B: Global & Report-Specific Filter Toolbar ───────────────
export function ReportFilterToolbar({
  filters,
  filterOptions,
  supportedFilters,
  onFilterChange,
  onApply,
  onReset,
  onRefresh,
  showComparisonControls = false,
  loading = false,
}: {
  filters: ExtendedReportFilterConfig;
  filterOptions?: ReportFilterOptions | null;
  supportedFilters?: Array<keyof ReportFilterConfig>;
  onFilterChange: (key: keyof ExtendedReportFilterConfig, value: unknown) => void;
  onApply: () => void;
  onReset: () => void;
  onRefresh: () => void;
  showComparisonControls?: boolean;
  loading?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const fyOptions = useMemo(() => {
    if (filterOptions?.financialYears?.length) return filterOptions.financialYears;
    const now = new Date();
    const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return [fyStart - 2, fyStart - 1, fyStart, fyStart + 1].map((y) => ({
      value: `${y}-${y + 1}`,
      label: `FY ${y}-${y + 1}`,
    }));
  }, [filterOptions]);

  const yearOptions = useMemo(() => {
    const curr = new Date().getFullYear();
    return [curr - 2, curr - 1, curr, curr + 1];
  }, []);

  const hasFilter = (key: keyof ReportFilterConfig) =>
    !supportedFilters || supportedFilters.includes(key);

  const hasAdvancedFilters =
    hasFilter("designation") ||
    hasFilter("branch") ||
    hasFilter("workLocation") ||
    hasFilter("costCenter") ||
    hasFilter("dateFrom") ||
    hasFilter("dateTo") ||
    hasFilter("payrollStatus") ||
    hasFilter("paymentStatus") ||
    hasFilter("paymentMode") ||
    hasFilter("cutoffDate") ||
    hasFilter("comparisonMode") ||
    showComparisonControls;

  return (
    <GlassCard className="p-3.5 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {hasFilter("financialYear") && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                aria-label="Financial Year"
                value={filters.financialYear || ""}
                onChange={(e) => onFilterChange("financialYear", e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground"
              >
                {fyOptions.map((fy) => (
                  <option key={fy.value} value={fy.value}>
                    {fy.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasFilter("month") && (
            <select
              aria-label="Payroll Month"
              value={filters.month ?? ""}
              onChange={(e) =>
                onFilterChange("month", e.target.value ? Number(e.target.value) : undefined)
              }
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Months</option>
              {MONTHS_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          )}

          {hasFilter("year") && (
            <select
              aria-label="Payroll Year"
              value={filters.year ?? ""}
              onChange={(e) =>
                onFilterChange("year", e.target.value ? Number(e.target.value) : undefined)
              }
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}

          {hasFilter("periodId") && filterOptions?.payrollPeriods && filterOptions.payrollPeriods.length > 0 && (
            <select
              aria-label="Payroll Period"
              value={filters.periodId || ""}
              onChange={(e) => onFilterChange("periodId", e.target.value)}
              className="h-8 max-w-[190px] rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Payroll Periods</option>
              {filterOptions.payrollPeriods.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          )}

          {hasFilter("runId") && filterOptions?.payrollRuns && filterOptions.payrollRuns.length > 0 && (
            <select
              aria-label="Payroll Run"
              value={filters.runId || ""}
              onChange={(e) => onFilterChange("runId", e.target.value)}
              className="h-8 max-w-[190px] rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Payroll Runs</option>
              {filterOptions.payrollRuns.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          )}

          {hasFilter("department") && (
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {filterOptions?.departments?.length ? (
                <select
                  aria-label="Department"
                  value={filters.department || ""}
                  onChange={(e) => onFilterChange("department", e.target.value)}
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
                >
                  <option value="">All Departments</option>
                  {filterOptions.departments.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  aria-label="Department"
                  placeholder="Department"
                  value={filters.department || ""}
                  onChange={(e) => onFilterChange("department", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onApply()}
                  className="h-8 w-36 rounded-lg text-xs"
                />
              )}
            </div>
          )}

          {hasFilter("employmentType") && (
            <select
              aria-label="Employment Type"
              value={filters.employmentType || ""}
              onChange={(e) => onFilterChange("employmentType", e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Employment Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          )}

          {hasFilter("employeeId") && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Employee"
                placeholder="Employee code / name..."
                value={filters.employeeId || ""}
                onChange={(e) => onFilterChange("employeeId", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onApply()}
                className="h-8 w-44 rounded-lg pl-8 text-xs"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {hasAdvancedFilters && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setExpanded((v) => !v)}
              className="h-8 gap-1 rounded-lg text-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>More Filters</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={onApply}
            disabled={loading}
            className="h-8 gap-1.5 rounded-lg text-xs"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Apply Filters</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onReset}
            disabled={loading}
            className="h-8 gap-1 rounded-lg text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            aria-label="Refresh Data"
            onClick={onRefresh}
            disabled={loading}
            className="h-8 gap-1.5 rounded-lg text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Collapsible Advanced Filters Row */}
      {expanded && hasAdvancedFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2.5 border-t border-border/60 pt-3 text-xs">
          {hasFilter("designation") && (
            filterOptions?.designations?.length ? (
              <select
                aria-label="Designation"
                value={filters.designation || ""}
                onChange={(e) => onFilterChange("designation", e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
              >
                <option value="">All Designations</option>
                {filterOptions.designations.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                aria-label="Designation"
                placeholder="Designation"
                value={filters.designation || ""}
                onChange={(e) => onFilterChange("designation", e.target.value)}
                className="h-8 w-36 rounded-lg text-xs"
              />
            )
          )}

          {hasFilter("branch") && (
            filterOptions?.branches?.length ? (
              <select
                aria-label="Branch"
                value={filters.branch || ""}
                onChange={(e) => onFilterChange("branch", e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
              >
                <option value="">All Branches</option>
                {filterOptions.branches.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                aria-label="Branch"
                placeholder="Branch"
                value={filters.branch || ""}
                onChange={(e) => onFilterChange("branch", e.target.value)}
                className="h-8 w-32 rounded-lg text-xs"
              />
            )
          )}

          {hasFilter("workLocation") && (
            <Input
              aria-label="Work Location"
              placeholder="Work location"
              value={filters.workLocation || ""}
              onChange={(e) => onFilterChange("workLocation", e.target.value)}
              className="h-8 w-36 rounded-lg text-xs"
            />
          )}

          {hasFilter("costCenter") && (
            <Input
              aria-label="Cost Center"
              placeholder="Cost center code"
              value={filters.costCenter || ""}
              onChange={(e) => onFilterChange("costCenter", e.target.value)}
              className="h-8 w-36 rounded-lg text-xs"
            />
          )}

          {hasFilter("payrollStatus") && (
            <select
              aria-label="Payroll Status"
              value={filters.payrollStatus || ""}
              onChange={(e) => onFilterChange("payrollStatus", e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Payroll Statuses</option>
              {(filterOptions?.payrollStatuses || []).map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          )}

          {hasFilter("paymentStatus") && (
            <select
              aria-label="Payment Status"
              value={filters.paymentStatus || ""}
              onChange={(e) => onFilterChange("paymentStatus", e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Payment Statuses</option>
              {(filterOptions?.paymentStatuses || []).map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          )}

          {hasFilter("paymentMode") && (
            <select
              aria-label="Payment Mode"
              value={filters.paymentMode || ""}
              onChange={(e) => onFilterChange("paymentMode", e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="">All Payment Modes</option>
              {(filterOptions?.paymentModes || []).map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label}
                </option>
              ))}
            </select>
          )}

          {hasFilter("dateFrom") && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">From:</span>
              <Input
                type="date"
                aria-label="Custom date from"
                value={filters.dateFrom || ""}
                onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                className="h-8 w-36 rounded-lg text-xs"
              />
            </div>
          )}

          {hasFilter("dateTo") && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">To:</span>
              <Input
                type="date"
                aria-label="Custom date to"
                value={filters.dateTo || ""}
                onChange={(e) => onFilterChange("dateTo", e.target.value)}
                className="h-8 w-36 rounded-lg text-xs"
              />
            </div>
          )}

          {hasFilter("cutoffDate") && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">YTD Cutoff:</span>
              <Input
                type="date"
                aria-label="YTD cutoff date"
                value={filters.cutoffDate || ""}
                onChange={(e) => onFilterChange("cutoffDate", e.target.value)}
                className="h-8 w-36 rounded-lg text-xs"
              />
            </div>
          )}

          {hasFilter("comparisonMode") && (
            <select
              aria-label="Comparison Period Mode"
              value={filters.comparisonMode || "mom"}
              onChange={(e) => onFilterChange("comparisonMode", e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground"
            >
              <option value="mom">Month-on-Month (MoM)</option>
              <option value="qoq">Quarter-on-Quarter (QoQ)</option>
              <option value="yoy">Year-on-Year (YoY)</option>
              <option value="custom">Custom Period</option>
            </select>
          )}

          {showComparisonControls && (
            <div className="flex flex-wrap items-center gap-3 ml-auto">
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(filters.comparePreviousPeriod)}
                  onChange={(e) => onFilterChange("comparePreviousPeriod", e.target.checked)}
                />
                <span>Previous Period Comparison</span>
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(filters.comparePreviousYear)}
                  onChange={(e) => onFilterChange("comparePreviousYear", e.target.checked)}
                />
                <span>Previous Year Comparison</span>
              </label>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}

// ── Export Actions (Server-Side CSV / XLSX / PDF + Print) ────────────
export function ExportActions({
  onExport,
  exporting = false,
  exportFormat,
  disabled = false,
}: {
  onExport: (format: ExportFormat) => void;
  exporting?: boolean;
  exportFormat?: ExportFormat | null;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 print:hidden">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onExport("csv")}
        disabled={exporting || disabled}
        className="h-8 gap-1.5 rounded-xl text-xs"
      >
        <Download className="h-3.5 w-3.5" />
        <span>{exporting && exportFormat === "csv" ? "Exporting..." : "CSV"}</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onExport("xlsx")}
        disabled={exporting || disabled}
        className="h-8 gap-1.5 rounded-xl text-xs"
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        <span>{exporting && exportFormat === "xlsx" ? "Exporting..." : "Excel"}</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onExport("pdf")}
        disabled={exporting || disabled}
        className="h-8 gap-1.5 rounded-xl text-xs"
      >
        <FileText className="h-3.5 w-3.5" />
        <span>{exporting && exportFormat === "pdf" ? "Exporting..." : "PDF"}</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        className="h-8 gap-1.5 rounded-xl text-xs"
      >
        <Printer className="h-3.5 w-3.5" />
        <span>Print</span>
      </Button>
    </div>
  );
}

// ── Backend Unavailable Banner ───────────────────────────────────────
export function BackendUnavailableBanner({
  reportKey,
  endpoint,
}: {
  reportKey?: ReportKey | string;
  endpoint?: string;
}) {
  return (
    <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 print:hidden">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-sm font-semibold">
        Feature unavailable — awaiting backend dataset
      </AlertTitle>
      <AlertDescription className="mt-1 text-xs">
        The reporting endpoint ({endpoint || `GET /api/v2/payroll/reports/${reportKey || ""}`})
        returned no published payroll dataset or is pending deployment. Real-time figures are never
        fabricated.
      </AlertDescription>
    </Alert>
  );
}

// ── Section G: Totals & Reconciliation Card ──────────────────────────
export function ReportTotalsReconciliationCard({
  summary,
}: {
  summary: ReportReconciliationSummary | null;
}) {
  if (!summary || !summary.items.length) return null;

  return (
    <GlassCard className="p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          {summary.isBalanced ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          )}
          <h3 className="text-sm font-semibold text-foreground">{summary.title}</h3>
        </div>
        <Badge
          variant="outline"
          className={
            summary.isBalanced
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          }
        >
          {summary.isBalanced ? "Reconciled" : "Discrepancy / Attention Needed"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summary.items.map((item) => (
          <div key={item.label}>
            <div className="text-[11px] text-muted-foreground">{item.label}</div>
            <div
              className={`mt-1 font-mono text-sm font-semibold tabular-nums ${
                item.tone === "success"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : item.tone === "danger"
                    ? "text-rose-600 dark:text-rose-400"
                    : item.tone === "warning"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-foreground"
              }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {summary.discrepancyMessage && (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          {summary.discrepancyMessage}
        </p>
      )}
    </GlassCard>
  );
}

// ── Section F: Employee Payroll Breakdown Drawer ─────────────────────
export function EmployeeDetailDrawer({
  open,
  onClose,
  employee,
  loading = false,
  error,
}: {
  open: boolean;
  onClose: () => void;
  employee: EmployeePayrollDetail | null;
  loading?: boolean;
  error?: string | null;
}) {
  const [downloadingPayslip, setDownloadingPayslip] = useState(false);

  const handleDownloadPayslip = async () => {
    if (!employee?.runId || !employee?.employeeId) {
      toast.info("Official payslip download requires an associated finalized payroll run ID.");
      return;
    }
    setDownloadingPayslip(true);
    try {
      const blob = await reportAnalyticsApi.downloadEmployeePayslip(
        employee.runId,
        employee.employeeId
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslip_${employee.employeeCode || employee.employeeId}_${employee.periodLabel.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Payslip downloaded");
    } catch {
      toast.error("Unable to download employee payslip");
    } finally {
      setDownloadingPayslip(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-lg">
            {employee?.employeeName || "Employee Payroll Calculation"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {employee
              ? `${employee.employeeCode} • ${employee.department} • ${employee.periodLabel}`
              : "Detailed payroll calculation breakdown"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-5 text-xs">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">
              {error}
            </div>
          ) : employee ? (
            <>
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5">
                <div>
                  <span className="text-muted-foreground">Employee Code</span>
                  <div className="font-mono font-semibold">{employee.employeeCode}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Department</span>
                  <div className="font-semibold">{employee.department}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Designation</span>
                  <div className="font-semibold">{employee.designation}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Employment Type</span>
                  <div className="font-semibold capitalize">
                    {employee.employmentType.replace(/_/g, " ")}
                  </div>
                </div>
                {employee.salaryStructure && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Salary Structure</span>
                    <div className="font-semibold">{employee.salaryStructure}</div>
                  </div>
                )}
              </div>

              {(employee.workingDays !== null ||
                employee.paidDays !== null ||
                employee.lwpDays !== null) && (
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/70 p-3 text-center">
                  <div>
                    <div className="text-muted-foreground">Working Days</div>
                    <div className="mt-0.5 font-mono font-semibold">
                      {employee.workingDays ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Paid Days</div>
                    <div className="mt-0.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {employee.paidDays ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">LWP Days</div>
                    <div className="mt-0.5 font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {employee.lwpDays ?? "—"}
                    </div>
                  </div>
                </div>
              )}

              {employee.earnings.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Earnings Breakdown</h4>
                  <div className="space-y-1.5 rounded-xl border border-border/70 p-3">
                    {employee.earnings.map((e) => (
                      <div key={e.code} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{e.name}</span>
                        <span className="font-mono font-semibold tabular-nums">
                          {e.amountFormatted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {employee.deductions.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Deductions Breakdown</h4>
                  <div className="space-y-1.5 rounded-xl border border-border/70 p-3">
                    {employee.deductions.map((d) => (
                      <div key={d.code} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="font-mono font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                          {d.amountFormatted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {employee.employerContributions.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Employer Contributions</h4>
                  <div className="space-y-1.5 rounded-xl border border-border/70 p-3">
                    {employee.employerContributions.map((c) => (
                      <div key={c.code} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{c.name}</span>
                        <span className="font-mono font-semibold tabular-nums">
                          {c.amountFormatted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {employee.bankInfo && (
                <div className="rounded-xl border border-border/70 p-3 space-y-1">
                  <div className="font-semibold text-foreground mb-1">Bank & Disbursement</div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank</span>
                    <span>{employee.bankInfo.bankName || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account No.</span>
                    <span className="font-mono">{employee.bankInfo.accountNumberMasked || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IFSC</span>
                    <span className="font-mono">{employee.bankInfo.ifscCode || "—"}</span>
                  </div>
                  {employee.bankInfo.utr && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UTR</span>
                      <span className="font-mono">{employee.bankInfo.utr}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Totals Summary */}
              <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex justify-between font-semibold">
                  <span>Gross Earnings</span>
                  <span className="font-mono tabular-nums">{employee.grossEarningsFormatted}</span>
                </div>
                <div className="flex justify-between font-semibold text-rose-600 dark:text-rose-400">
                  <span>Total Deductions</span>
                  <span className="font-mono tabular-nums">{employee.totalDeductionsFormatted}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-primary">
                  <span>Net Salary</span>
                  <span className="font-mono tabular-nums">{employee.netSalaryFormatted}</span>
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Total Employer Cost</span>
                  <span className="font-mono tabular-nums">{employee.totalCostFormatted}</span>
                </div>
              </div>

              {employee.runId && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleDownloadPayslip}
                  disabled={downloadingPayslip}
                  className="w-full gap-2 rounded-xl"
                >
                  <Download className="h-4 w-4" />
                  <span>{downloadingPayslip ? "Downloading Payslip..." : "Download Payslip PDF"}</span>
                </Button>
              )}
            </>
          ) : (
            <div className="text-muted-foreground">Select an employee row to view details.</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
