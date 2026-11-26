import React, { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Users,
  Briefcase,
  Building2,
  IndianRupee,
  Package,
  UserMinus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { statusBadgeClass } from "@/lib/status-styles";
import type { ExecutiveKpiDetails } from "../hooks/useExecutiveDashboardData";

interface ExecutiveKpiCardsProps {
  details: ExecutiveKpiDetails;
  loading?: boolean;
}

function CustomTooltip({ active, payload, label, unit = "" }: any) {
  if (active && payload && payload.length) {
    const pt = payload[0];
    const val = pt.value;
    const dispLabel = pt.payload?.label ?? label;
    return (
      <div className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground shadow-sm">
        {dispLabel ? <span className="mr-1 font-medium text-muted-foreground">{dispLabel}:</span> : null}
        <span className="font-semibold text-foreground">
          {typeof val === "number" ? val.toLocaleString("en-IN") : val}
          {unit}
        </span>
      </div>
    );
  }
  return null;
}

function buildSparklineData(
  actualPoints: Array<{ v: number; label?: string }> | undefined
): Array<{ v: number; label?: string }> {
  if (actualPoints && actualPoints.length >= 2) {
    return actualPoints;
  }
  return [];
}

interface KpiSparklineProps {
  data: Array<{ v: number; label?: string }>;
  color?: string;
  gradientId: string;
  unit?: string;
}

const KpiSparkline = memo(function KpiSparkline({
  data,
  color = "hsl(var(--primary))",
  gradientId,
  unit = "",
}: KpiSparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div className="flex h-10 w-full items-end border-t border-border/60 pt-2 text-xs text-muted-foreground">
        No trend history yet
      </div>
    );
  }

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

interface MetricCardItem {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  link: string;
  icon: React.ElementType;
  badgeText?: string | null;
  badgeType?: "up" | "down" | "neutral";
  sparklineData: Array<{ v: number; label?: string }>;
  sparklineUnit?: string;
}

function DesktopKpiCard({ item }: { item: MetricCardItem }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.link as any}
      className="group flex h-full min-h-[180px] flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          {item.badgeText ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
                item.badgeType === "up"
                  ? "positive"
                  : item.badgeType === "down"
                  ? "critical"
                  : "default"
              )}`}
            >
              {item.badgeType === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : item.badgeType === "down" ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              {item.badgeText}
            </span>
          ) : (
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          )}
        </div>

        <div className="mt-3">
          <div className="text-[13px] font-medium text-muted-foreground">
            {item.label}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {item.value}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {item.subtitle}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <KpiSparkline
          data={item.sparklineData}
          gradientId={`kpi-${item.id}`}
          unit={item.sparklineUnit}
        />
      </div>
    </Link>
  );
}

function MobileCompactMetric({ item }: { item: MetricCardItem }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.link as any}
      className="group flex min-h-[84px] flex-col justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-muted-foreground leading-snug">
          {item.label}
        </span>
        <Icon className="h-4 w-4 shrink-0 text-primary" />
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="font-display text-xl font-semibold tracking-tight text-foreground tabular-nums">
          {item.value}
        </span>
        {item.badgeText ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs font-medium ${statusBadgeClass(
              item.badgeType === "up"
                ? "positive"
                : item.badgeType === "down"
                ? "critical"
                : "default"
            )}`}
          >
            {item.badgeText}
          </span>
        ) : (
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
        )}
      </div>
    </Link>
  );
}

export const ExecutiveKpiCards = memo(function ExecutiveKpiCards({
  details,
  loading = false,
}: ExecutiveKpiCardsProps) {
  const [showAllMobile, setShowAllMobile] = useState(false);

  if (loading) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3.5 shadow-xs space-y-2.5">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="h-7 w-16 bg-muted" />
            </div>
          ))}
        </div>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[180px] flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-8 rounded-lg bg-muted" />
                <Skeleton className="h-4 w-12 rounded bg-muted" />
              </div>
              <div className="my-2 space-y-1.5">
                <Skeleton className="h-4 w-28 rounded bg-muted" />
                <Skeleton className="h-7 w-20 rounded bg-muted" />
              </div>
              <Skeleton className="h-10 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { headcount, openings, departments, payroll, assets, exits } = details;

  const headcountData = buildSparklineData(
    headcount.trend?.map((t) => ({ v: t.value, label: t.date }))
  );

  const openingsData = buildSparklineData(
    openings.bars?.length >= 2 ? openings.bars.map((b) => ({ v: b.count, label: b.label })) : undefined
  );

  const departmentsData = buildSparklineData(
    departments.distribution?.length >= 2
      ? departments.distribution.map((d) => ({ v: d.count, label: d.name }))
      : undefined
  );

  const payrollData = buildSparklineData(
    payroll.history?.map((p) => ({ v: p.cost, label: p.month }))
  );

  const assetsData = buildSparklineData(undefined);

  const exitsData = buildSparklineData(
    exits.timeline?.map((t) => ({ v: t.count, label: t.date }))
  );

  const metrics: MetricCardItem[] = [
    {
      id: "headcount",
      label: "Total Headcount",
      value: headcount.value.toLocaleString("en-IN"),
      subtitle: "Active across all depts",
      link: headcount.link,
      icon: Users,
      badgeText: headcount.change,
      badgeType: headcount.changeType,
      sparklineData: headcountData,
    },
    {
      id: "openings",
      label: "Open Positions",
      value: openings.value.toLocaleString("en-IN"),
      subtitle: "Across active job posts",
      link: openings.link,
      icon: Briefcase,
      badgeText: openings.change,
      badgeType: openings.changeType,
      sparklineData: openingsData,
    },
    {
      id: "departments",
      label: "Departments",
      value: departments.value.toLocaleString("en-IN"),
      subtitle: "Operational business units",
      link: departments.link,
      icon: Building2,
      sparklineData: departmentsData,
    },
    {
      id: "payroll",
      label: "Monthly Payroll Cost",
      value: payroll.valueFormatted,
      subtitle: "This billing cycle",
      link: payroll.link,
      icon: IndianRupee,
      sparklineData: payrollData,
      sparklineUnit: "L",
    },
    {
      id: "assets",
      label: "Assets Tracked",
      value: assets.value.toLocaleString("en-IN"),
      subtitle: "Laptops, devices & gear",
      link: assets.link,
      icon: Package,
      sparklineData: assetsData,
    },
    {
      id: "exits",
      label: "Offboarding & Exits",
      value: exits.value.toLocaleString("en-IN"),
      subtitle: "In pipeline / processed",
      link: exits.link,
      icon: UserMinus,
      sparklineData: exitsData,
    },
  ];

  // Mobile prioritizes the two highest-priority executive metrics first: Headcount and Monthly Payroll Cost
  const mobilePrimaryMetrics = [metrics[0], metrics[3]];
  const mobileSecondaryMetrics = [metrics[1], metrics[2], metrics[4], metrics[5]];

  return (
    <div className="mb-6">
      {/* Mobile compact summary (< 640px) */}
      <div className="space-y-3 sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {mobilePrimaryMetrics.map((item) => (
            <MobileCompactMetric key={item.id} item={item} />
          ))}
        </div>

        {showAllMobile ? (
          <div id="executive-mobile-secondary-kpis" className="grid grid-cols-2 gap-3">
            {mobileSecondaryMetrics.map((item) => (
              <MobileCompactMetric key={item.id} item={item} />
            ))}
          </div>
        ) : null}

        <button
          type="button"
          aria-expanded={showAllMobile}
          aria-controls="executive-mobile-secondary-kpis"
          onClick={() => setShowAllMobile((prev) => !prev)}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <span>{showAllMobile ? "Show fewer metrics" : "View all metrics"}</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              showAllMobile ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Tablet & Desktop full overview */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {metrics.map((item) => (
          <DesktopKpiCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
});
