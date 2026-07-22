import React from "react";
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReimbursementAIInsight } from "./reimbursementsTypes";
import { toast } from "sonner";

interface AIReimbursementInsightsProps {
  insights: ReimbursementAIInsight[];
}

export const AIReimbursementInsights: React.FC<AIReimbursementInsightsProps> = ({ insights }) => {
  const getSeverityBadge = (sev: ReimbursementAIInsight["severity"]) => {
    switch (sev) {
      case "CRITICAL":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30">Fraud Risk</Badge>;
      case "WARNING":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">High Expense</Badge>;
      case "SUCCESS":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">OCR Verified</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Insight</Badge>;
    }
  };

  return (
    <div className="reimb-card p-5 space-y-4 bg-slate-900/80 border border-blue-500/20">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Aurix AI Expense Fraud & Policy Intelligence
              <span className="ai-pulse-dot" />
            </h3>
            <p className="text-xs text-slate-400">Automated duplicate claim detection, out-of-policy warnings, and OCR validation.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {insights.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2.5 hover:border-blue-500/30 transition-all">
            <div className="flex items-start justify-between">
              <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                {item.title}
              </h4>
              {getSeverityBadge(item.severity)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

            <div className="p-2 rounded bg-slate-900 border border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Employee / Scope:</span>
              <span className="font-mono font-bold text-blue-300">{item.employeeName}</span>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] truncate max-w-[200px]">{item.recommendation}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast.success(`Applied AI recommendation for '${item.title}'`)}
                className="h-7 text-xs text-blue-400 hover:text-blue-300 gap-1 p-0"
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
