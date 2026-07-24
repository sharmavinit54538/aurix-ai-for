import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import { DEPT_ATTENDANCE } from "../executive-data";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#06b6d4", "#ec4899", "#f97316"];

export default function DeptAttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={DEPT_ATTENDANCE} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[80, 100]} />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Attendance"]} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {DEPT_ATTENDANCE.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
