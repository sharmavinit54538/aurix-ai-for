import { Sparkles } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SatisfactionTrendItem } from "@/store/aiInsights/aiInsightsTypes";
import { CHART_TOOLTIP_STYLE } from "../../constants/chartStyles";
import { EmptySection } from "../shared/EmptySection";
import { InsightsPanel } from "../shared/InsightsPanel";

export function SatisfactionTrendSection({ satisfactionTrend }: { satisfactionTrend: SatisfactionTrendItem[] }) {
  return (
    <InsightsPanel title="Employee Satisfaction Trend" icon={Sparkles} accent="from-sky-500/20 to-violet-500/10">
      {satisfactionTrend.length === 0 ? (
        <EmptySection message="No satisfaction trend points available." />
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={satisfactionTrend}>
              <defs>
                <linearGradient id="satisfaction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="s"
                name="Score"
                stroke="hsl(var(--primary))"
                fill="url(#satisfaction)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </InsightsPanel>
  );
}
