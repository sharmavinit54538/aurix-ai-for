import {
  Area,
  AreaChart,
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
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from "../constants/dashboard";
import type { DepartmentHiringPoint, FunnelPoint, HiringTrendPoint } from "../utils/dashboard";
import { ChartCard } from "./ChartCard";

interface RecruitmentDashboardChartsProps {
  funnel: FunnelPoint[];
  byDept: DepartmentHiringPoint[];
}

export function RecruitmentDashboardCharts({ funnel, byDept }: RecruitmentDashboardChartsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartCard title="Hiring Funnel" subtitle="Candidates per stage" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnel} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis
                dataKey="stage"
                stroke="currentColor"
                className="text-[10px] text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {funnel.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Hiring" subtitle="Applicants by department">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={byDept}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
              >
                {byDept.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
    </div>
  );
}

interface RecruitmentHiringTrendChartProps {
  monthlyHires: HiringTrendPoint[];
  className?: string;
}

export function RecruitmentHiringTrendChart({ monthlyHires, className = "" }: RecruitmentHiringTrendChartProps) {
  return (
    <ChartCard title="Hiring Trend" subtitle="Hires vs offers, last 6 months" className={className}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyHires} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="go" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis
                dataKey="m"
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
              />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="offers" stroke={CHART_COLORS[2]} strokeWidth={2} fill="url(#go)" />
              <Area type="monotone" dataKey="hires" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gh)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
  );
}
