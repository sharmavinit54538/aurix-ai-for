import React from "react";
import { CheckCircle2, Clock, XCircle, ShieldCheck, ArrowRight, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalaryStructure, ApprovalStep } from "./salaryStructureTypes";
import { toast } from "sonner";

interface ApprovalWorkflowTrackerProps {
  structure: SalaryStructure;
  onApproveDecision: (structureId: string, role: string, decision: "APPROVE" | "REJECT") => Promise<void>;
}

export const ApprovalWorkflowTracker: React.FC<ApprovalWorkflowTrackerProps> = ({
  structure,
  onApproveDecision,
}) => {
  const steps: ApprovalStep[] = structure.approvalWorkflow || [
    { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-03-10 10:15 AM", comments: "Structure reviewed & compliant with wage rules." },
    { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-03-11 02:45 PM", comments: "Statutory PF/ESI formulas verified." },
    { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-03-12 04:30 PM", comments: "Budget allocation approved within FY27 ceiling." },
    { role: "CFO", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-03-15 11:00 AM", comments: "Approved for publishing company-wide." },
  ];

  return (
    <div className="salary-card p-5 space-y-5 bg-slate-900/80 border border-white/10">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Enterprise Multi-Stage Approval Governance
          </h3>
          <p className="text-xs text-slate-400">Governance sign-offs required prior to active payroll generation.</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase text-[10px]">
          Stage: {structure.approvalStage}
        </Badge>
      </div>

      {/* Visual Timeline Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {steps.map((step, idx) => {
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
                <p className="text-[10px] text-slate-400 mt-0.5">{step.timestamp || "Awaiting action..."}</p>
              </div>

              {step.comments && (
                <div className="p-2 rounded bg-slate-900/80 text-[10px] text-slate-300 italic border border-white/5 flex items-start gap-1">
                  <MessageSquare className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">"{step.comments}"</span>
                </div>
              )}

              {isPending && (
                <div className="pt-2 flex items-center gap-1.5 border-t border-white/5">
                  <Button
                    size="sm"
                    onClick={() => onApproveDecision(structure.id, step.role, "APPROVE")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] h-7"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onApproveDecision(structure.id, step.role, "REJECT")}
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
