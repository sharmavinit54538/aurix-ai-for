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
import { PIPELINE_STAGES } from "../executive-data";

export default function PipelineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={PIPELINE_STAGES} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
        <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.1)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={64} />
        <Tooltip
          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {PIPELINE_STAGES.map((s) => (
            <Cell key={s.stage} fill={s.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
