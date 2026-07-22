import React from "react";
import { Sparkles, AlertTriangle, TrendingUp, ShieldCheck, HelpCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AIInsightItem {
  id: string;
  type: "ANOMALY" | "WARNING" | "FORECAST" | "OPTIMIZATION";
  title: string;
  description: string;
  impact: string;
  actionText: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

const DEFAULT_INSIGHTS: AIInsightItem[] = [
  {
    id: "1",
    type: "ANOMALY",
    title: "Engineering Overtime Spike (+42%)",
    description: "14 DevOps engineers logged 120+ OT hours this cycle due to datacenter migration.",
    impact: "+₹1,84,000 OT cost variance",
    actionText: "Review OT Logs",
    severity: "HIGH",
  },
  {
    id: "2",
    type: "WARNING",
    title: "Missing PAN / Bank Details (2 Employees)",
    description: "Rahul Sharma (EMP-104) and Priya Verma (EMP-189) lack verified IFSC routing codes.",
    impact: "Disbursement payout block",
    actionText: "Resolve Block",
    severity: "HIGH",
  },
  {
    id: "3",
    type: "OPTIMIZATION",
    title: "Tax Regime Exemption Opportunity",
    description: "28 employees can save an average of ₹14,200 annually by switching to the New Tax Regime.",
    impact: "Employee tax savings",
    actionText: "Send Notification",
    severity: "MEDIUM",
  },
  {
    id: "4",
    type: "FORECAST",
    title: "Q3 Payroll Budget Alignment",
    description: "July cycle is tracking 1.8% below maximum quarterly allocated budget.",
    impact: "₹78,000 under budget",
    actionText: "View Forecast",
    severity: "LOW",
  },
];

interface AIPayrollInsightsProps {
  insights?: AIInsightItem[];
  onActionClick?: (item: AIInsightItem) => void;
}

export const AIPayrollInsights: React.FC<AIPayrollInsightsProps> = ({
  insights = DEFAULT_INSIGHTS,
  onActionClick,
}) => {
  return (
    <div className="sp-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              AI Payroll Copilot & Anomaly Detection
            </h3>
            <p className="text-[11px] text-slate-500">
              Automated pattern analysis, compliance checks & budget forecasts
            </p>
          </div>
        </div>
        <span className="sp-badge-indigo rounded-full px-2.5 py-0.5 text-[10px] font-bold">
          4 Insights Detected
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((item) => {
          const isHigh = item.severity === "HIGH";
          const isMedium = item.severity === "MEDIUM";

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                isHigh
                  ? "border-rose-500/30 bg-rose-500/[0.03]"
                  : isMedium
                  ? "border-amber-500/30 bg-amber-500/[0.03]"
                  : "border-purple-500/20 bg-purple-500/[0.02]"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      isHigh
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        : isMedium
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {item.impact}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-white/[0.05]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onActionClick?.(item)}
                  className="h-7 w-full justify-between px-2 text-[11px] font-semibold text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  <span>{item.actionText}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
