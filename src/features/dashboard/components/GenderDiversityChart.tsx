import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { GENDER_DIVERSITY } from "../executive-data";

export default function GenderDiversityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={GENDER_DIVERSITY}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={65}
          dataKey="value"
          paddingAngle={3}
        >
          {GENDER_DIVERSITY.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
