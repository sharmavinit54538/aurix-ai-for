import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { HEADCOUNT_GROWTH } from "../executive-data";

export default function HeadcountGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={HEADCOUNT_GROWTH} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[230, 295]} />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
        <Area type="monotone" dataKey="headcount" stroke="#6366f1" strokeWidth={2} fill="url(#hcGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
