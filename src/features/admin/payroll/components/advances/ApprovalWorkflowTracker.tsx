import React from "react";
import { CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalaryAdvanceRequest, ApprovalStep } from "./advancesTypes";

interface ApprovalWorkflowTrackerProps {
  advance: SalaryAdvanceRequest;
  onApprove: (advance: SalaryAdvanceRequest) => void;
  onReject: (advance: SalaryAdvanceRequest) => void;
}

export const ApprovalWorkflowTracker: React.FC<ApprovalWorkflowTrackerProps> = ({
  advance,
  onApprove,
  onReject,
}) => {
  const steps: ApprovalStep[] = advance.approvalWorkflow || [
    { role: "Employee Request", name: advance.employeeName, status: "APPROVED", timestamp: advance.createdOn },
    { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-19" },
    { role: "HR Review", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-20" },
    { role: "Finance Approval", name: "Karan Johar", status: "PENDING" },
    { role: "Bank Disbursement", name: "HDFC Direct Pay", status: "PENDING" },
    { role: "Payroll Recovery", name: "Auto Deduct", status: "PENDING" },
  ];

  return (
    <div className="adv-card p-5 space-y-4 bg-slate-900/80 border border-white/10">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            6-Stage Multi-Level Governance Tracker: <span className="text-cyan-300 font-mono">{advance.advanceCode}</span>
          </h3>
          <p className="text-xs text-slate-400">Sequential sign-off flow from employee request to monthly payroll recovery.</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase text-[10px]">
          Stage: {advance.approvalStage}
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
                    onClick={() => onApprove(advance)}
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
