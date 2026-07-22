import React from "react";
import { CheckCircle2, Clock, XCircle, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReimbursementClaim, ApprovalStep } from "./reimbursementsTypes";

interface ApprovalWorkflowTrackerProps {
  claim: ReimbursementClaim;
  onApprove: (claim: ReimbursementClaim) => void;
  onReject: (claim: ReimbursementClaim) => void;
}

export const ApprovalWorkflowTracker: React.FC<ApprovalWorkflowTrackerProps> = ({
  claim,
  onApprove,
  onReject,
}) => {
  const steps: ApprovalStep[] = claim.approvalWorkflow || [
    { role: "Employee", name: claim.employeeName, status: "APPROVED", timestamp: claim.submittedDate },
    { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-13" },
    { role: "Finance Manager", name: "Karan Johar", status: "PENDING" },
    { role: "Payroll Admin", name: "Rohan Varma", status: "PENDING" },
  ];

  return (
    <div className="reimb-card p-5 space-y-5 bg-slate-900/80 border border-white/10">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Multi-Level Approval Governance: <span className="text-blue-300 font-mono">{claim.claimNumber}</span>
          </h3>
          <p className="text-xs text-slate-400">Sequential sign-off flow from manager to payroll disbursal.</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase text-[10px]">
          Stage: {claim.approvalStage}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isApproved = step.status === "APPROVED";
          const isPending = step.status === "PENDING";
          const isRejected = step.status === "REJECTED";

          return (
            <div
              key={step.role}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
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
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{step.role}</span>
                {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isPending && <Clock className="w-4 h-4 text-amber-400" />}
                {isRejected && <XCircle className="w-4 h-4 text-rose-400" />}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white">{step.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.timestamp || "Awaiting sign-off..."}</p>
              </div>

              {step.comment && (
                <div className="p-2 rounded bg-slate-900/80 text-[10px] text-slate-300 italic border border-white/5 flex items-start gap-1">
                  <MessageSquare className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">"{step.comment}"</span>
                </div>
              )}

              {isPending && (
                <div className="pt-2 flex items-center gap-1.5 border-t border-white/5">
                  <Button
                    size="sm"
                    onClick={() => onApprove(claim)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] h-7"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReject(claim)}
                    className="flex-1 border-rose-500/30 text-rose-400 hover:bg-rose-950 text-[10px] h-7"
                  >
                    Reject
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
