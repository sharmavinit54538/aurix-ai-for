import { Brain, CheckCircle2, Flame, Sparkles, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { AttendanceInsightItem, AttritionItem, BurnoutItem } from "@/store/aiInsights/aiInsightsTypes";
import { EmptySection } from "../shared/EmptySection";
import { InsightsPanel } from "../shared/InsightsPanel";
import { RiskPill, ToneDot } from "../shared/Badges";
import { SectionTitle } from "../shared/SectionTitle";

export function WorkforceAnalyticsSection({
  attrition,
  burnout,
  attendance,
}: {
  attrition: AttritionItem[];
  burnout: BurnoutItem[];
  attendance: AttendanceInsightItem[];
}) {
  return (
    <>
      <SectionTitle eyebrow="Workforce" title="AI Workforce Analytics" icon={Brain} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InsightsPanel title="Attrition Prediction" icon={UserMinus} accent="from-rose-500/20 to-orange-500/10">
          {attrition.length === 0 ? (
            <EmptySection message="No attrition risk predictions found." />
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2 text-left">Employee</th>
                  <th className="text-left">Risk</th>
                  <th className="text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {attrition.map((item) => (
                  <tr key={item.id ?? item.name} className="border-t border-border/60 align-top">
                    <td className="py-2.5 pr-2">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.dept}</div>
                    </td>
                    <td className="pr-2 py-3">
                      <RiskPill score={item.risk} />
                    </td>
                    <td className="text-xs text-muted-foreground py-2.5 pr-2">
                      {item.reason}
                      {item.action ? (
                        <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px] text-foreground">
                          <Sparkles className="h-3 w-3" /> {item.action}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </InsightsPanel>

        <InsightsPanel title="Burnout Detection" icon={Flame} accent="from-amber-500/20 to-rose-500/10">
          {burnout.length === 0 ? (
            <EmptySection message="No burnout warnings detected." />
          ) : (
            <div className="space-y-3">
              {burnout.map((item) => (
                <div key={item.id ?? item.name} className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{item.name}</div>
                    <Badge variant={item.score > 80 ? "destructive" : "secondary"}>{item.score} burnout</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div>
                      Overtime: <span className="font-medium text-foreground">{item.overtime}h</span>
                    </div>
                    <div>
                      Leave balance: <span className="font-medium text-foreground">{item.leave} days</span>
                    </div>
                  </div>
                  <Progress value={item.score} className="mt-2 h-1.5" />
                </div>
              ))}
            </div>
          )}
        </InsightsPanel>

        <InsightsPanel
          title="Attendance Insights"
          icon={CheckCircle2}
          accent="from-sky-500/20 to-indigo-500/10"
          className="lg:col-span-2"
        >
          {attendance.length === 0 ? (
            <EmptySection message="No attendance insight alerts recorded." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {attendance.map((item) => (
                <div key={item.id ?? item.title} className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="flex items-center gap-2">
                    <ToneDot tone={item.tone} />
                    <div className="text-sm font-medium">{item.title}</div>
                  </div>
                  <div className="mt-2 font-display text-2xl font-semibold">{item.count}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.note}</div>
                </div>
              ))}
            </div>
          )}
        </InsightsPanel>
      </div>
    </>
  );
}
