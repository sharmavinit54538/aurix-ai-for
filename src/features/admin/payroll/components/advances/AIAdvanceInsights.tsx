import React from "react";
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, HandCoins, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdvanceAIInsight } from "./advancesTypes";
import { toast } from "sonner";

const DEFAULT_INSIGHTS: AdvanceAIInsight[] = [
  {
    id: "insight-1",
    title: "Negative Net Salary Risk",
    type: "NEGATIVE_SALARY",
    severity: "CRITICAL",
    description: "2 employees have EMI deductions exceeding 50% of projected net monthly salary.",
    impactMetric: "2 Employees",
    recommendation: "Cap advance recovery to max 35% of monthly salary.",
  },
  {
    id: "insight-2",
    title: "Recovery Risk Warning",
    type: "RECOVERY_RISK",
    severity: "WARNING",
    description: "Advance requested by employee with less than 6 months tenure in probation period.",
    impactMetric: "₹85,000 Exposure",
    recommendation: "Request guarantor co-approval or shorten tenure.",
  },
  {
    id: "insight-3",
    title: "High Eligibility Rating",
    type: "ELIGIBILITY_SCORE",
    severity: "SUCCESS",
    description: "94% of applicant employees maintain spotless loan recovery track records.",
    impactMetric: "94% Clean Rate",
    recommendation: "Auto-approve emergency advance requests under ₹25,000.",
  },
];

interface AIAdvanceInsightsProps {
  insights?: AdvanceAIInsight[];
}

export const AIAdvanceInsights: React.FC<AIAdvanceInsightsProps> = ({ insights = DEFAULT_INSIGHTS }) => {
  const getSeverityBadge = (sev: AdvanceAIInsight["severity"]) => {
    switch (sev) {
      case "CRITICAL":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30">Recovery Risk</Badge>;
      case "WARNING":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">EMI Warning</Badge>;
      case "SUCCESS":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">High Score</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Budget AI</Badge>;
    }
  };

  return (
    <div className="adv-card p-5 space-y-4 bg-slate-900/80 border border-cyan-500/20">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              OFC360 Advance Risk & Eligibility Intelligence
              <span className="ai-pulse-dot" />
            </h3>
            <p className="text-xs text-slate-400">Automated credit scoring, payment delay predictions, and negative salary prevention.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {insights.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2.5 hover:border-cyan-500/30 transition-all">
            <div className="flex items-start justify-between">
              <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                {item.title}
              </h4>
              {getSeverityBadge(item.severity)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

            <div className="p-2 rounded bg-slate-900 border border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Impact Metric:</span>
              <span className="font-mono font-bold text-cyan-300">{item.impactMetric}</span>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] truncate max-w-[200px]">{item.recommendation}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast.success(`Applied recommendation for '${item.title}'`)}
                className="h-7 text-xs text-cyan-400 hover:text-cyan-300 gap-1 p-0"
              >
                Apply <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
