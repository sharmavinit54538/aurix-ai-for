import React from "react";
import { CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeductionRule, ApprovalStep } from "./deductionsTypes";

interface ApprovalWorkflowTrackerProps {
  rule: DeductionRule;
  onToggleStatus: (rule: DeductionRule) => void;
}

export const ApprovalWorkflowTracker: React.FC<ApprovalWorkflowTrackerProps> = ({
  rule,
  onToggleStatus,
}) => {
  const steps: ApprovalStep[] = rule.approvalWorkflow || [
    { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-04-01" },
    { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-04-01" },
    { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-04-01" },
    { role: "Compliance Officer", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-04-01" },
  ];

  return (
    <div className="ded-card p-5 space-y-4 bg-slate-900/80 border border-white/10">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Compliance & Governance Tracker: <span className="text-rose-300 font-mono">{rule.code}</span>
          </h3>
          <p className="text-xs text-slate-400">Sequential sign-off flow before publishing deduction rules.</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase text-[10px]">
          Stage: {rule.approvalStage}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isApproved = step.status === "APPROVED";
          const isPending = step.status === "PENDING";
          const isRejected = step.status === "REJECTED";

          return (
            <div
              key={step.role}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                isApproved
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : isPending
                  ? "bg-amber-950/20 border-amber-500/40 animate-pulse"
                  : isRejected
                  ? "bg-rose-950/20 border-rose-500/30"
                  : "bg-slate-950/40 border-white/5"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{step.role}</span>
                {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                {isPending && <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white">{step.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.timestamp || "Approved rule"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
