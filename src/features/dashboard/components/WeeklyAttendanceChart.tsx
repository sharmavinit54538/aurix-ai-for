import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { WEEKLY_ATTENDANCE } from "../executive-data";

export default function WeeklyAttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={WEEKLY_ATTENDANCE} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
        <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} fill="url(#attGrad)" name="Present" />
        <Area type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={1.5} fill="transparent" name="Late" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
