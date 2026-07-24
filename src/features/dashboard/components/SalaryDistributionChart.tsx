import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { SALARY_DISTRIBUTION } from "../executive-data";

export default function SalaryDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={SALARY_DISTRIBUTION} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
        <XAxis dataKey="band" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
        <Bar dataKey="employees" radius={[4, 4, 0, 0]} fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}
