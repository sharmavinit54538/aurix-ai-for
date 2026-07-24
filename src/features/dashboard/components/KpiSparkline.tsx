import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import type { KpiSparkPoint } from "../executive-data";

export default function KpiSparkline({ spark, color }: { spark: KpiSparkPoint[], color: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={spark}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
