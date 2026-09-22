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
  Info,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
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

// ── Subtle Empty State Component ─────────────────────────────
const ChartEmptyState = memo(function ChartEmptyState({
  message = "No trend data available",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-14 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-800/80 bg-slate-950/30 px-2 text-center text-[11px] text-slate-500">
      <Info className="h-3 w-3 shrink-0 text-slate-600" />
      <span className="truncate">{message}</span>
    </div>
  );
});

// ── Custom Dark Recharts Tooltip ─────────────────────────────
function CustomTooltip({ active, payload, label, unit = "" }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-slate-700 bg-slate-900/95 px-2.5 py-1 text-xs text-slate-100 shadow-xl backdrop-blur-md">
        <span className="font-medium text-slate-400">{label ?? payload[0].name}: </span>
        <span className="font-semibold text-white">
          {typeof payload[0].value === "number" ? payload[0].value.toLocaleString("en-IN") : payload[0].value}
          {unit}
        </span>
      </div>
    );
  }
  return null;
}

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
            className="flex min-h-[195px] flex-col justify-between rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded-lg bg-slate-800" />
              <Skeleton className="h-4 w-12 rounded bg-slate-800" />
            </div>
            <div className="my-2 space-y-1.5">
              <Skeleton className="h-7 w-20 rounded bg-slate-800" />
              <Skeleton className="h-3 w-28 rounded bg-slate-800" />
            </div>
            <Skeleton className="h-14 w-full rounded-lg bg-slate-800/60" />
          </div>
        ))}
      </div>
    );
  }

  const { headcount, openings, departments, payroll, assets, exits } = details;

  return (
    <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {/* ── CARD 1: TOTAL HEADCOUNT ─────────────────────────── */}
      <motion.div {...cardMotion(0)}>
        <Link to={headcount.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5">
            {/* Ambient accent top glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-60 transition-opacity group-hover:opacity-100" />

            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
                  <Users className="h-4 w-4" />
                </div>
                {headcount.change ? (
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      headcount.changeType === "up"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : headcount.changeType === "down"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {headcount.changeType === "up" ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : headcount.changeType === "down" ? (
                      <TrendingDown className="h-2.5 w-2.5" />
                    ) : null}
                    {headcount.change}
                  </span>
                ) : (
                  <span className="text-slate-600 transition-colors group-hover:text-emerald-400">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Total Headcount
                </div>
                <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {headcount.value.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Visualization: Smooth Area Chart or Empty State */}
            <div className="mt-3">
              {headcount.hasTrend ? (
                <div className="h-14 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={headcount.trend} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                      <defs>
                        <linearGradient id="headcountGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#headcountGrad)"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ChartEmptyState message="No trend data available" />
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 2: ACTIVE OPENINGS ─────────────────────────── */}
      <motion.div {...cardMotion(1)}>
        <Link to={openings.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/60 to-blue-500/0 opacity-60 transition-opacity group-hover:opacity-100" />

            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-slate-600 transition-colors group-hover:text-blue-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Active Openings
                </div>
                <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {openings.value.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Visualization: Compact Vertical Bar Chart or Empty State */}
            <div className="mt-3">
              {openings.hasBars ? (
                <div className="h-14 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={openings.bars} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                      <Tooltip content={<CustomTooltip label="Roles" />} />
                      <Bar
                        dataKey="count"
                        fill="#3b82f6"
                        radius={[4, 4, 1, 1]}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ChartEmptyState message="No opening data available" />
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 3: DEPARTMENTS ─────────────────────────────── */}
      <motion.div {...cardMotion(2)}>
        <Link to={departments.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0 opacity-60 transition-opacity group-hover:opacity-100" />

            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl border border-violet-500/20 bg-violet-500/10 p-2 text-violet-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-slate-600 transition-colors group-hover:text-violet-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Departments
                </div>
                <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {departments.value.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Visualization: Donut Distribution or Clean Info Badges */}
            <div className="mt-3">
              {departments.hasDistribution ? (
                <div className="flex h-14 items-center justify-between gap-2">
                  <div className="h-14 w-14 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<CustomTooltip unit=" employees" />} />
                        <Pie
                          data={departments.distribution}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={16}
                          outerRadius={25}
                          strokeWidth={1}
                          stroke="#0f172a"
                          isAnimationActive={false}
                        >
                          {departments.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-1 flex-col justify-center space-y-1 overflow-hidden pr-1">
                    {departments.distribution.slice(0, 2).map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 truncate text-slate-400">
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="truncate">{d.name}</span>
                        </span>
                        <span className="font-mono text-slate-300">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-14 w-full items-center justify-center rounded-lg border border-slate-800/60 bg-slate-950/20 px-3 text-[11px] text-slate-400">
                  <span>{departments.value} Active Workunits</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 4: MONTHLY PAYROLL COST ────────────────────── */}
      <motion.div {...cardMotion(3)}>
        <Link to={payroll.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/60 to-amber-500/0 opacity-60 transition-opacity group-hover:opacity-100" />

            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <span className="text-slate-600 transition-colors group-hover:text-amber-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Monthly Payroll Cost
                </div>
                <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {payroll.valueFormatted}
                </div>
              </div>
            </div>

            {/* Visualization: Financial Trend Area or Empty State */}
            <div className="mt-3">
              {payroll.hasHistory ? (
                <div className="h-14 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={payroll.history} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                      <defs>
                        <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fill="url(#payrollGrad)"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ChartEmptyState message="No payroll history available" />
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 5: ASSETS TRACKED ──────────────────────────── */}
      <motion.div {...cardMotion(4)}>
        <Link to={assets.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/60 to-cyan-500/0 opacity-60 transition-opacity group-hover:opacity-100" />

            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-400">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-slate-600 transition-colors group-hover:text-cyan-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Assets Tracked
                </div>
                <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {assets.value.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Visualization: Segmented Donut / Progress for Assigned vs Available */}
            <div className="mt-3">
              {assets.hasStatusData ? (
                <div className="flex h-14 flex-col justify-center gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      Assigned: {assets.assignedCount}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-slate-500" />
                      Available: {assets.availableCount}
                    </span>
                  </div>
                  {/* Segmented Dual Bar */}
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="bg-cyan-400 transition-all duration-500"
                      style={{ width: `${assets.assignedPercent}%` }}
                      title={`Assigned: ${assets.assignedPercent}%`}
                    />
                    <div
                      className="bg-emerald-500/80 transition-all duration-500"
                      style={{ width: `${assets.availablePercent}%` }}
                      title={`Available: ${assets.availablePercent}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{assets.assignedPercent}% in use</span>
                    <span>{assets.availablePercent}% in stock</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-14 w-full items-center justify-center rounded-lg border border-slate-800/60 bg-slate-950/20 px-3 text-[11px] text-slate-400">
                  <span>{assets.value} Hardware Assets</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── CARD 6: OFFBOARDING & EXITS ─────────────────────── */}
      <motion.div {...cardMotion(5)}>
        <Link to={exits.link as any} className="block h-full outline-none">
          <div className="group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-500/0 via-rose-500/60 to-rose-500/0 opacity-60 transition-opacity group-hover:opacity-100" />

            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400">
                  <UserMinus className="h-4 w-4" />
                </div>
                <span className="text-slate-600 transition-colors group-hover:text-rose-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Offboarding & Exits
                </div>
                <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {exits.value.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Visualization: Real Status Badges + Timeline or Clean Badges */}
            <div className="mt-3">
              {exits.hasTimeline ? (
                <div className="h-14 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={exits.timeline} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                      <defs>
                        <linearGradient id="exitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <Tooltip content={<CustomTooltip label="Exits" />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        fill="url(#exitGrad)"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : exits.value > 0 ? (
                <div className="flex h-14 flex-wrap items-center justify-between gap-1 rounded-lg border border-slate-800/60 bg-slate-950/20 px-2.5 py-1 text-[11px]">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Clock className="h-3 w-3" />
                    <span>{exits.statusCounts.pending} Pending</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <AlertCircle className="h-3 w-3" />
                    <span>{exits.statusCounts.inProgress} In-Progress</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{exits.statusCounts.completed} Done</span>
                  </div>
                </div>
              ) : (
                <ChartEmptyState message="No exits recorded" />
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
});
