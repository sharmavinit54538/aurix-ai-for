import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ReportsCostTrendPoint,
  DepartmentCostBreakdownItem,
  ComponentDistributionItem,
} from "@/services/payrollReportsApi";

interface ReportsAnalyticsChartsProps {
  costTrend: ReportsCostTrendPoint[];
  departmentBreakdown: DepartmentCostBreakdownItem[];
  componentDistribution: ComponentDistributionItem[];
}

const DEPT_COLORS = ["#818cf8", "#34d399", "#f59e0b", "#38bdf8", "#f472b6"];
const COMP_COLORS = ["#6366f1", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"];

const formatLakh = (v: number) => `₹${(v / 100000).toFixed(1)}L`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-card/95 border border-border/60 shadow-xl backdrop-blur-lg text-xs space-y-1">
        <p className="font-bold text-foreground">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}: {formatLakh(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ReportsAnalyticsCharts: React.FC<ReportsAnalyticsChartsProps> = ({
  costTrend,
  departmentBreakdown,
  componentDistribution,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Payroll Cost Trend – Line Chart */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          Payroll Cost Trend (6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={costTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={formatLakh} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="gross" stroke="#818cf8" strokeWidth={2.5} dot={{ r: 3 }} name="Gross Salary" />
            <Line type="monotone" dataKey="net" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3 }} name="Net Salary" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Department Cost Breakdown – Pie Chart */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Department-wise Cost Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={departmentBreakdown}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              dataKey="cost"
              nameKey="name"
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 0.5 }}
            >
              {departmentBreakdown.map((_, idx) => (
                <Cell key={idx} fill={DEPT_COLORS[idx % DEPT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatLakh(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Salary Component Distribution – Bar Chart */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          Salary Component Distribution
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={componentDistribution} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={formatLakh} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={60} />
            <Tooltip formatter={(v: number) => formatLakh(v)} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Amount">
              {componentDistribution.map((_, idx) => (
                <Cell key={idx} fill={COMP_COLORS[idx % COMP_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Tax & Statutory Contribution Trend – Area Chart */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Tax & PF Contribution Trend
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={costTrend}>
            <defs>
              <linearGradient id="gradTax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPF" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={formatLakh} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Area type="monotone" dataKey="tax" stroke="#a78bfa" fill="url(#gradTax)" strokeWidth={2} name="Tax (TDS)" />
            <Area type="monotone" dataKey="pf" stroke="#2dd4bf" fill="url(#gradPF)" strokeWidth={2} name="PF Contribution" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
