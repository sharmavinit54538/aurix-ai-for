import React from "react";
import { CheckCircle2, Clock, XCircle, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BonusAward, ApprovalStep } from "./bonusesTypes";

interface ApprovalWorkflowTrackerProps {
  bonus: BonusAward;
  onApprove: (bonus: BonusAward) => void;
  onReject: (bonus: BonusAward) => void;
}

export const ApprovalWorkflowTracker: React.FC<ApprovalWorkflowTrackerProps> = ({
  bonus,
  onApprove,
  onReject,
}) => {
  const steps: ApprovalStep[] = bonus.approvalWorkflow || [
    { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-10 10:00 AM" },
    { role: "Compensation Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-11 11:30 AM" },
    { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-12 02:15 PM" },
    { role: "CFO", name: "Ananya Roy", status: "PENDING" },
    { role: "CEO", name: "Vikram Malhotra", status: "PENDING" },
    { role: "Payroll Admin", name: "Rohan Varma", status: "PENDING" },
  ];

  return (
    <div className="bns-card p-5 space-y-5 bg-slate-900/80 border border-white/10">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            6-Stage Executive Governance Tracker: <span className="text-amber-300 font-mono">{bonus.bonusCode}</span>
          </h3>
          <p className="text-xs text-slate-400">Sequential sign-off chain for high-value variable compensation awards.</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase text-[10px]">
          Stage: {bonus.approvalStage}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {steps.map((step) => {
          const isApproved = step.status === "APPROVED";
          const isPending = step.status === "PENDING";
          const isRejected = step.status === "REJECTED";

          return (
            <div
              key={step.role}
              className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{step.role}</span>
                {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                {isPending && <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-white truncate">{step.name}</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">{step.timestamp || "Pending..."}</p>
              </div>

              {isPending && (
                <div className="pt-1.5 flex items-center gap-1 border-t border-white/5">
                  <Button
                    size="sm"
                    onClick={() => onApprove(bonus)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] h-6 p-0"
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
