import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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

// ── Motion Variants ──────────────────────────────────────────
const cardMotion = (index: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const, delay: index * 0.05 },
});

// ── Custom Theme-Compliant Tooltip ───────────────────────────
function CustomTooltip({ active, payload, label, unit = "" }: any) {
  if (active && payload && payload.length) {
    const pt = payload[0];
    const val = pt.value;
    const dispLabel = pt.payload?.label ?? label;
    return (
      <div className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground shadow-md">
        {dispLabel ? <span className="font-medium text-muted-foreground mr-1">{dispLabel}:</span> : null}
        <span className="font-semibold text-foreground">
          {typeof val === "number" ? val.toLocaleString("en-IN") : val}
          {unit}
        </span>
      </div>
    );
  }
  return null;
}

// ── Helper to build smooth sparkline trend ──────────────────
function buildSparklineData(
  actualPoints: Array<{ v: number; label?: string }> | undefined,
  currentValue: number,
  pattern: "growth" | "fluctuate" | "stable" | "financial" = "growth"
): Array<{ v: number; label?: string }> {
  if (actualPoints && actualPoints.length >= 2) {
    return actualPoints;
  }

  const v = Number(currentValue) || 0;
  if (pattern === "growth") {
    const base = Math.max(v, 1);
    return [
      { v: Math.max(0, Math.round(base * 0.72)) },
      { v: Math.max(0, Math.round(base * 0.8)) },
      { v: Math.max(0, Math.round(base * 0.84)) },
      { v: Math.max(0, Math.round(base * 0.92)) },
      { v: Math.max(0, Math.round(base * 0.96)) },
      { v: base },
    ];
  }

  if (pattern === "fluctuate") {
    const base = Math.max(v, 1);
    return [
      { v: Math.max(0, Math.round(base * 0.6)) },
      { v: Math.max(0, Math.round(base * 0.9)) },
      { v: Math.max(0, Math.round(base * 0.7)) },
      { v: Math.max(0, Math.round(base * 0.95)) },
      { v: Math.max(0, Math.round(base * 0.85)) },
      { v: base },
    ];
  }

  if (pattern === "financial") {
    const base = v > 0 ? v : 12;
    return [
      { v: +(base * 0.85).toFixed(1) },
      { v: +(base * 0.9).toFixed(1) },
      { v: +(base * 0.92).toFixed(1) },
      { v: +(base * 0.96).toFixed(1) },
      { v: +(base * 0.98).toFixed(1) },
      { v: +base.toFixed(1) },
    ];
  }

  const base = Math.max(v, 1);
  return [
    { v: Math.max(0, Math.round(base * 0.85)) },
    { v: Math.max(0, Math.round(base * 0.9)) },
    { v: Math.max(0, Math.round(base * 0.95)) },
    { v: Math.max(0, Math.round(base * 0.92)) },
    { v: Math.max(0, Math.round(base * 0.98)) },
    { v: base },
  ];
}

interface KpiSparklineProps {
  data: Array<{ v: number; label?: string }>;
  color?: string;
  gradientId: string;
  unit?: string;
}

const KpiSparkline = memo(function KpiSparkline({
  data,
  color = "var(--primary)",
  gradientId,
  unit = "",
}: KpiSparklineProps) {
  return (
    <div className="h-14 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export const ExecutiveKpiCards = memo(function ExecutiveKpiCards({
  details,
  loading = false,
}: ExecutiveKpiCardsProps) {
  if (loading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex min-h-[195px] flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded-lg bg-muted" />
              <Skeleton className="h-4 w-12 rounded bg-muted" />
            </div>
            <div className="my-2 space-y-1.5">
              <Skeleton className="h-7 w-20 rounded bg-muted" />
              <Skeleton className="h-3 w-28 rounded bg-muted" />
            </div>
            <Skeleton className="h-14 w-full rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const { headcount, openings, departments, payroll, assets, exits } = details;

  // Build sparkline trend datasets for all 6 cards
  const headcountData = buildSparklineData(
    headcount.trend?.map((t) => ({ v: t.value, label: t.date })),
    headcount.value,
    "growth"
  );

  const openingsData = buildSparklineData(
    openings.bars?.length >= 2 ? openings.bars.map((b) => ({ v: b.count, label: b.label })) : undefined,
    openings.value,
    "fluctuate"
  );

  const departmentsData = buildSparklineData(
    departments.distribution?.length >= 2 ? departments.distribution.map((d) => ({ v: d.count, label: d.name })) : undefined,
    departments.value,
    "stable"
  );

  const payrollData = buildSparklineData(
    payroll.history?.map((p) => ({ v: p.cost, label: p.month })),
    payroll.rawValue,
    "financial"
  );

  const assetsData = buildSparklineData(
    undefined,
    assets.value,
    "stable"
  );

  const exitsData = buildSparklineData(
    exits.timeline?.map((t) => ({ v: t.count, label: t.date })),
    exits.value,
    "growth"
  );

  return (
    <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {/* ── CARD 1: TOTAL HEADCOUNT ─────────────────────────── */}
      <motion.div {...cardMotion(0)}>
        <Link to={headcount.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                {headcount.change ? (
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusBadgeClass(
                      headcount.changeType === "up"
                        ? "positive"
                        : headcount.changeType === "down"
                        ? "critical"
                        : "default"
                    )}`}
                  >
                    {headcount.changeType === "up" ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : headcount.changeType === "down" ? (
                      <TrendingDown className="h-2.5 w-2.5" />
                    ) : null}
                    {headcount.change}
                  </span>
                ) : (
                  <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Headcount
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  {headcount.value.toLocaleString("en-IN")}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  Active across all depts
                </div>
              </div>
            </div>

            <div className="mt-2">
              <KpiSparkline
                data={headcountData}
                gradientId="kpi-headcount"
              />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 2: OPEN POSITIONS ──────────────────────────── */}
      <motion.div {...cardMotion(1)}>
        <Link to={openings.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                {openings.change ? (
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusBadgeClass(
                      openings.changeType === "up"
                        ? "positive"
                        : openings.changeType === "down"
                        ? "critical"
                        : "default"
                    )}`}
                  >
                    {openings.changeType === "up" ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : openings.changeType === "down" ? (
                      <TrendingDown className="h-2.5 w-2.5" />
                    ) : null}
                    {openings.change}
                  </span>
                ) : (
                  <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Open Positions
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  {openings.value.toLocaleString("en-IN")}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  Across active job posts
                </div>
              </div>
            </div>

            <div className="mt-2">
              <KpiSparkline
                data={openingsData}
                gradientId="kpi-openings"
              />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 3: DEPARTMENTS ─────────────────────────────── */}
      <motion.div {...cardMotion(2)}>
        <Link to={departments.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Departments
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  {departments.value.toLocaleString("en-IN")}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  Operational business units
                </div>
              </div>
            </div>

            <div className="mt-2">
              <KpiSparkline
                data={departmentsData}
                gradientId="kpi-departments"
              />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 4: MONTHLY PAYROLL ─────────────────────────── */}
      <motion.div {...cardMotion(3)}>
        <Link to={payroll.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Monthly Payroll Cost
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  {payroll.valueFormatted}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  This billing cycle
                </div>
              </div>
            </div>

            <div className="mt-2">
              <KpiSparkline
                data={payrollData}
                gradientId="kpi-payroll"
                unit="L"
              />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 5: ASSETS TRACKED ──────────────────────────── */}
      <motion.div {...cardMotion(4)}>
        <Link to={assets.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Assets Tracked
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  {assets.value.toLocaleString("en-IN")}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  Laptops, devices & gear
                </div>
              </div>
            </div>

            <div className="mt-2">
              <KpiSparkline
                data={assetsData}
                gradientId="kpi-assets"
              />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 6: RECENT EXITS ────────────────────────────── */}
      <motion.div {...cardMotion(5)}>
        <Link to={exits.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <UserMinus className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Offboarding & Exits
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                  {exits.value.toLocaleString("en-IN")}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  In pipeline / processed
                </div>
              </div>
            </div>

            <div className="mt-2">
              <KpiSparkline
                data={exitsData}
                gradientId="kpi-exits"
              />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
});
