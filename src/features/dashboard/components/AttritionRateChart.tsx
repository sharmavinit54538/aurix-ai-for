import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ATTRITION_RATE } from "../executive-data";

export default function AttritionRateChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={ATTRITION_RATE} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[2, 5]} />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v}%`, "Attrition"]} />
        <Line type="monotone" dataKey="rate" stroke="#f43f5e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
