import { Briefcase, LineChart as LineChartIcon, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HeadcountForecastItem, HiringDemandItem } from "@/store/aiInsights/aiInsightsTypes";
import { CHART_TOOLTIP_STYLE } from "../../constants/chartStyles";
import { EmptySection } from "../shared/EmptySection";
import { InsightsPanel } from "../shared/InsightsPanel";
import { SectionTitle } from "../shared/SectionTitle";

export function WorkforcePlanningSection({
  headcountForecast,
  hiringDemand,
}: {
  headcountForecast: HeadcountForecastItem[];
  hiringDemand: HiringDemandItem[];
}) {
  return (
    <>
      <SectionTitle eyebrow="Planning" title="AI Workforce Planning" icon={Users} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InsightsPanel title="Headcount Forecast" icon={LineChartIcon} accent="from-emerald-500/20 to-sky-500/10">
          {headcountForecast.length === 0 ? (
            <EmptySection message="No headcount forecast available." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={headcountForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="current"
                    name="Actual"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="AI Forecast"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </InsightsPanel>

        <InsightsPanel title="Hiring Demand by Dept" icon={Briefcase} accent="from-violet-500/20 to-fuchsia-500/10">
          {hiringDemand.length === 0 ? (
            <EmptySection message="No department hiring demand data." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringDemand} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="dept" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="open" name="Open" fill="hsl(var(--muted-foreground))" opacity={0.55} radius={[0, 6, 6, 0]} />
                  <Bar dataKey="demand" name="AI Demand" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </InsightsPanel>
      </div>
    </>
  );
}
