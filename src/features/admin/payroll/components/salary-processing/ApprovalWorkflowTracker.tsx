import React from "react";
import { CheckCircle2, Clock, ShieldCheck, UserCheck, Lock } from "lucide-react";

export interface ApprovalStep {
  id: string;
  role: string;
  actor: string;
  status: "APPROVED" | "IN_PROGRESS" | "PENDING" | "REJECTED";
  timestamp?: string;
  comments?: string;
}

const DEFAULT_WORKFLOW: ApprovalStep[] = [
  { id: "1", role: "HR Review", actor: "Sarah Jenkins (HR Director)", status: "APPROVED", timestamp: "2026-07-28 10:30 AM", comments: "Attendance & leave balances verified" },
  { id: "2", role: "Payroll Admin", actor: "Alex Vance (Lead Payroll Admin)", status: "APPROVED", timestamp: "2026-07-28 02:15 PM", comments: "PF, ESI & TDS tax slabs recalculated" },
  { id: "3", role: "Finance Review", actor: "Marcus Chen (Finance Lead)", status: "IN_PROGRESS", timestamp: "Active Now", comments: "Verifying budget variance & bank balance" },
  { id: "4", role: "CFO Sign-off", actor: "Elena Rostova (CFO)", status: "PENDING" },
  { id: "5", role: "CEO Approval", actor: "David Kim (CEO)", status: "PENDING" },
  { id: "6", role: "Final Disbursal", actor: "System Gateway", status: "PENDING" },
];

interface ApprovalWorkflowTrackerProps {
  workflow?: ApprovalStep[];
}

export const ApprovalWorkflowTracker: React.FC<ApprovalWorkflowTrackerProps> = ({
  workflow = DEFAULT_WORKFLOW,
}) => {
  return (
    <div className="sp-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Multi-Tier Executive Sign-off Chain
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            SOX Compliance & Multi-Level Financial Sign-off Audit
          </p>
        </div>
        <span className="sp-badge-amber inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
          <Clock className="h-3 w-3" />
          Awaiting Finance Sign-off
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {workflow.map((step, idx) => {
          const isApproved = step.status === "APPROVED";
          const isInProgress = step.status === "IN_PROGRESS";

          return (
            <div
              key={step.id}
              className={`rounded-xl border p-3.5 space-y-2 transition-all ${
                isApproved
                  ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                  : isInProgress
                  ? "border-amber-500/40 bg-amber-500/[0.06] shadow-sm shadow-amber-500/10"
                  : "border-white/[0.06] bg-white/[0.01] opacity-60"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Step 0{idx + 1}
                </span>
                {isApproved ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : isInProgress ? (
                  <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-slate-600" />
                )}
              </div>

              {/* Title & Actor */}
              <div>
                <div className="text-xs font-bold text-white truncate">{step.role}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{step.actor}</div>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                    isApproved
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : isInProgress
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-white/5 text-slate-500"
                  }`}
                >
                  {step.status.replace("_", " ")}
                </span>
              </div>

              {step.timestamp && (
                <div className="text-[9px] text-slate-500 pt-1 border-t border-white/[0.04] truncate">
                  {step.timestamp}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
