import { Award, Cpu, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SkillGapItem, SupportPerformerItem, TopPerformerItem } from "@/store/aiInsights/aiInsightsTypes";
import { CHART_TOOLTIP_STYLE } from "../../constants/chartStyles";
import { EmptySection } from "../shared/EmptySection";
import { InsightsPanel } from "../shared/InsightsPanel";
import { SectionTitle } from "../shared/SectionTitle";

export function PerformanceSection({
  topPerformers,
  supportPerformers,
  skillGap,
}: {
  topPerformers: TopPerformerItem[];
  supportPerformers: SupportPerformerItem[];
  skillGap: SkillGapItem[];
}) {
  return (
    <>
      <SectionTitle eyebrow="Performance" title="AI Performance Insights" icon={Award} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InsightsPanel title="Top Performers" icon={TrendingUp} accent="from-emerald-500/20 to-teal-500/10">
          {topPerformers.length === 0 ? (
            <EmptySection message="No top performers listed." />
          ) : (
            <ul className="space-y-3">
              {topPerformers.map((performer) => (
                <li
                  key={performer.id ?? performer.name}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <div>
                    <div className="font-medium">{performer.name}</div>
                    <div className="text-xs text-muted-foreground">{performer.dept}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{performer.growth} growth</Badge>
                    <div className="font-display text-lg font-semibold">{performer.score}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </InsightsPanel>

        <InsightsPanel title="Needs Support" icon={GraduationCap} accent="from-amber-500/20 to-orange-500/10">
          {supportPerformers.length === 0 ? (
            <EmptySection message="No performers requiring support flagged." />
          ) : (
            <ul className="space-y-3">
              {supportPerformers.map((performer) => (
                <li key={performer.id ?? performer.name} className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{performer.name}</div>
                      <div className="text-xs text-muted-foreground">{performer.dept}</div>
                    </div>
                    <div className="font-display text-lg font-semibold">{performer.score}</div>
                  </div>
                  {performer.coach ? (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px]">
                      <Sparkles className="h-3 w-3" /> AI coaching: {performer.coach}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </InsightsPanel>

        <InsightsPanel
          title="Skill Gap Analysis"
          icon={Cpu}
          accent="from-indigo-500/20 to-sky-500/10"
          className="lg:col-span-2"
        >
          {skillGap.length === 0 ? (
            <EmptySection message="No skill gap data available." />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGap}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="have" name="Current" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="need" name="Target" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </InsightsPanel>
      </div>
    </>
  );
}
