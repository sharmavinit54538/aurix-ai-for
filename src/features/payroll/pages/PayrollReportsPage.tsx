/**
 * OFC360 Enterprise Payroll Reports & Analytics Dashboard
 * Route: /dashboard/payroll/reports
 *
 * Displays 9 independent, clickable, keyboard-accessible KPI report cards
 * backed by live OpenAPI endpoints with synchronized URL-persisted filters.
 */

import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  FileText,
  Minus,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCount, formatDate } from "@/lib/format";
import {
  REPORT_ICON_MAP,
  ReportAccessGuard,
  ReportFilterToolbar,
} from "../components/ReportComponents";
import {
  buildFilterQueryString,
  useDashboardReportCard,
  useFilterOptions,
  useReportFilters,
} from "../hooks/useReportAnalytics";
import { REPORT_ROUTES, type ExtendedReportFilterConfig, type ReportRouteConfig } from "../types/reportAnalytics";
import { REPORT_REGISTRY } from "../types/reports";

type AccentTone = "brand" | "success" | "warning" | "danger";

const CATEGORY_ACCENT: Record<
  "operational" | "financial" | "compliance" | "variance",
  AccentTone
> = {
  operational: "brand",
  financial: "success",
  compliance: "warning",
  variance: "danger",
};

const ACCENT_ICON_CLASSES: Record<AccentTone, string> = {
  brand: "bg-primary/10 text-primary",
  success: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
  danger: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
};

function CardTrendBadge({
  direction,
  changePercent,
}: {
  direction?: "up" | "down" | "flat";
  changePercent?: number | null;
}) {
  if (direction === undefined && (changePercent === undefined || changePercent === null)) {
    return null;
  }

  const resolved: "up" | "down" | "flat" =
    direction ??
    (changePercent !== undefined && changePercent !== null
      ? changePercent > 0
        ? "up"
        : changePercent < 0
          ? "down"
          : "flat"
      : "flat");

  const pct =
    changePercent !== undefined && changePercent !== null
      ? `${Math.abs(changePercent).toFixed(1)}%`
      : "0.0%";

  if (resolved === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 tabular-nums">
        <ArrowUpRight className="h-3 w-3" />
        {pct}
      </span>
    );
  }
  if (resolved === "down") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-500/12 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 tabular-nums">
        <ArrowDownRight className="h-3 w-3" />
        {pct}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
      <Minus className="h-3 w-3" />
      {pct}
    </span>
  );
}

function IndependentReportCard({
  route,
  filters,
  filterQueryString,
}: {
  route: ReportRouteConfig;
  filters: ExtendedReportFilterConfig;
  filterQueryString: string;
}) {
  const { kpi, loading, error, backendUnavailable, refetch } = useDashboardReportCard(
    route.key,
    filters
  );
  const registryItem = REPORT_REGISTRY[route.key];
  const Icon = REPORT_ICON_MAP[route.icon] ?? FileText;
  const accent = CATEGORY_ACCENT[registryItem.category];
  const iconClasses = ACCENT_ICON_CLASSES[accent];

  if (loading) {
    return (
      <div
        className="rounded-[12px] border border-border bg-card p-5 shadow-xs"
        aria-busy="true"
        aria-label={`Loading ${route.title}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        </div>
        <div className="mt-5 space-y-2.5">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>
    );
  }

  const targetHref = `${route.path}${filterQueryString}`;

  const secondaryText = kpi?.secondaryLabel && kpi?.secondaryValue
    ? `${kpi.secondaryLabel}: ${kpi.secondaryValue}`
    : kpi?.previousPeriodValue
      ? `Prev period: ${kpi.previousPeriodValue}`
      : typeof kpi?.recordCount === "number"
        ? `${formatCount(kpi.recordCount)} record${kpi.recordCount === 1 ? "" : "s"}`
        : route.description;

  return (
    <Link
      to={targetHref as "/dashboard/payroll/reports/payroll-register"}
      className="group flex min-h-[210px] flex-col justify-between rounded-[12px] border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold text-foreground truncate">{route.title}</h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground truncate">
              {kpi?.primaryKpiLabel || route.primaryKpiTitle}
            </p>
          </div>
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconClasses}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          {error ? (
            <div className="space-y-2">
              <div className="font-display text-lg font-semibold tracking-tight text-rose-600 dark:text-rose-400">
                Unable to Load Report
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-muted-foreground">{error}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void refetch();
                  }}
                  className="h-7 gap-1 rounded-lg px-2.5 text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </Button>
              </div>
            </div>
          ) : backendUnavailable ? (
            <>
              <div className="font-display text-[28px] font-bold leading-tight tracking-tight tabular-nums text-muted-foreground">
                —
              </div>
              <p className="mt-1.5 text-[12px] font-medium text-amber-700 dark:text-amber-300">
                No Records Available
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground line-clamp-1">
                {route.description}
              </p>
            </>
          ) : (
            <>
              <div className="font-display text-[28px] font-bold leading-tight tracking-tight tabular-nums text-foreground">
                {kpi?.primaryKpiValue ?? "—"}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <CardTrendBadge
                  direction={kpi?.changeDirection}
                  changePercent={kpi?.changePercent}
                />
                <span className="text-[12px] text-muted-foreground line-clamp-1">
                  {secondaryText}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <span className="text-[12px] capitalize text-muted-foreground">
          {kpi?.lastUpdated ? `Updated ${formatDate(kpi.lastUpdated)}` : registryItem.category}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-0.5">
          View Full Report
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function PayrollReportsPage() {
  const {
    filters,
    draftFilters,
    updateDraftFilter,
    applyFilters,
    resetFilters,
  } = useReportFilters();

  const { options: filterOptions } = useFilterOptions();
  const filterQueryString = useMemo(() => buildFilterQueryString(filters), [filters]);

  // Global refresh key triggers synchronized re-fetch across all 9 cards via filter identity
  const handleRefreshAll = () => {
    applyFilters();
  };

  return (
    <ReportAccessGuard requiredPermission="payroll.reports">
      <div className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Payroll Reports & Analytics
              </h1>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
              >
                Enterprise Analytics
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Multi-dimensional payroll intelligence across registers, salary statements,
              departments, cost centers, bank disbursements, variances, headcount, YTD, and GL
              journals.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span>
              Scope: <strong className="text-foreground">FY {filters.financialYear}</strong>
              {filters.department ? ` • ${filters.department}` : ""}
            </span>
          </div>
        </div>

        {/* ── Global Unified Filter Toolbar ─────────────────────────── */}
        <ReportFilterToolbar
          filters={draftFilters}
          filterOptions={filterOptions}
          onFilterChange={updateDraftFilter}
          onApply={() => applyFilters()}
          onReset={resetFilters}
          onRefresh={handleRefreshAll}
          showComparisonControls
        />

        {/* ── 9 Interactive Report KPI Cards (3x3 Desktop, 2 Tablet, 1 Mobile) ── */}
        <section aria-label="Payroll analytics report modules">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_ROUTES.map((route) => (
              <IndependentReportCard
                key={route.key}
                route={route}
                filters={filters}
                filterQueryString={filterQueryString}
              />
            ))}
          </div>
        </section>
      </div>
    </ReportAccessGuard>
  );
}
