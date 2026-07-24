import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import type { MonthlyPayrollPoint } from "../hooks/useExecutiveDashboardData";

export default function MonthlyPayrollChart({ data }: { data: MonthlyPayrollPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [`₹${v}L`, "Payroll"]}
        />
        <Bar dataKey="cost" radius={[6, 6, 0, 0]} fill="url(#payGrad)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
