import { Link } from "@tanstack/react-router";
import { AlertTriangle, MessageSquare, Sparkles } from "lucide-react";
import type { AlertItem } from "@/store/aiInsights/aiInsightsTypes";
import { getAIInsightsIcon } from "../../utils/iconMap";
import { SeverityBadge } from "../shared/Badges";
import { AIChatPanel } from "../shared/AIChatPanel";
import { EmptySection } from "../shared/EmptySection";
import { InsightsPanel } from "../shared/InsightsPanel";

export function InsightsSidebar({
  recommendations,
  alerts,
}: {
  recommendations: string[];
  alerts: AlertItem[];
}) {
  console.log(recommendations,
    alerts);
  return (
    <aside className="space-y-4">
      <AIChatPanel recommendations={recommendations} />

      <InsightsPanel title="AI Alerts Center" icon={AlertTriangle} accent="from-rose-500/20 to-amber-500/10">
        {alerts.length === 0 ? (
          <EmptySection message="No active AI alerts." />
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => {
              const Icon = getAIInsightsIcon(alert.icon, AlertTriangle);
              return (
                <li
                  key={alert.id ?? alert.title}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium">{alert.title}</div>
                      <SeverityBadge severity={alert.severity} />
                    </div>
                    <div className="text-xs text-muted-foreground">{alert.note}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </InsightsPanel>

      <InsightsPanel title="AI Recommendations" icon={Sparkles} accent="from-violet-500/20 to-sky-500/10">
        {recommendations.length === 0 ? (
          <EmptySection message="No recommendations available." />
        ) : (
          <ul className="space-y-2 text-sm">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-2 rounded-xl border border-border/60 bg-background/40 p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                <span className="text-foreground/90">{recommendation}</span>
              </li>
            ))}
          </ul>
        )}
      </InsightsPanel>

      <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Full conversation</div>
        <Link
          to="/dashboard/payroll/copilot"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          <MessageSquare className="h-4 w-4" /> Open AI Copilot
        </Link>
      </div>
    </aside>
  );
}
