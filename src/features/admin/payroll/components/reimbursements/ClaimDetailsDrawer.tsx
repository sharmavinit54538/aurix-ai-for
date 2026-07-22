import React from "react";
import {
  X,
  User,
  Building,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReimbursementClaim } from "./reimbursementsTypes";

interface ClaimDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  claim: ReimbursementClaim | null;
  onApprove: (claim: ReimbursementClaim) => void;
  onReject: (claim: ReimbursementClaim) => void;
  onAddPayrollEntry: (claim: ReimbursementClaim) => void;
}

export const ClaimDetailsDrawer: React.FC<ClaimDetailsDrawerProps> = ({
  open,
  onClose,
  claim,
  onApprove,
  onReject,
  onAddPayrollEntry,
}) => {
  if (!claim) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#070B17] border-l border-white/10 text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div>
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Claim Details: <span className="font-mono text-blue-300">{claim.claimNumber}</span>
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">Submitted on {claim.submittedDate}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Employee & Amount Summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Employee Profile</span>
              <h4 className="text-sm font-bold text-white">{claim.employeeName}</h4>
              <p className="text-xs text-slate-300">{claim.department} — {claim.designation}</p>
              <span className="font-mono text-[11px] text-slate-400">ID: {claim.employeeCode}</span>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Claim Value</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ₹{claim.claimAmount.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-slate-400">Tax Incl: ₹{claim.taxAmount.toLocaleString("en-IN")}</p>
              <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-[10px]">
                {claim.expenseCategory}
              </Badge>
            </div>
          </div>

          {/* Business Purpose & Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Business Expense Metadata</h4>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Business Purpose:</span>
                <p className="text-slate-200 mt-1 leading-relaxed">{claim.businessPurpose}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px]">
                <div>
                  <span className="text-slate-500">Cost Center:</span>
                  <p className="font-mono font-semibold text-blue-300">{claim.costCenter}</p>
                </div>
                <div>
                  <span className="text-slate-500">Project Tag:</span>
                  <p className="font-mono text-slate-300">{claim.project}</p>
                </div>
                <div>
                  <span className="text-slate-500">Expense Date:</span>
                  <p className="text-slate-300">{claim.expenseDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attached Receipt Documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Attached Receipts & OCR Verification ({claim.receipts.length})
            </h4>
            <div className="space-y-2">
              {claim.receipts.map((rec) => (
                <div key={rec.id} className="p-3 rounded-lg bg-slate-900/60 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-blue-500/10 text-blue-400 font-mono text-xs font-bold">
                      {rec.fileType}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-white">{rec.fileName}</h5>
                      <p className="text-[10px] text-slate-400">{rec.fileSize} • Uploaded {rec.uploadedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {rec.ocrVerified && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                        <ShieldCheck className="w-3 h-3" /> OCR Verified
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-white gap-1">
                      <Download className="w-3.5 h-3.5" /> View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Progress Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Approval Workflow Governance</h4>
            <div className="space-y-2">
              {claim.approvalWorkflow.map((step) => {
                const isApproved = step.status === "APPROVED";
                const isPending = step.status === "PENDING";
                const isRejected = step.status === "REJECTED";

                return (
                  <div key={step.role} className="p-3 rounded-lg bg-slate-950/40 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {isPending && <Clock className="w-4 h-4 text-amber-400" />}
                      {isRejected && <XCircle className="w-4 h-4 text-rose-400" />}
                      <div>
                        <span className="font-semibold text-white">{step.role}</span>
                        <p className="text-[10px] text-slate-400">{step.name} • {step.timestamp || "Pending sign-off"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={isApproved ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"}>
                      {step.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-950 text-slate-300 text-xs">
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(claim)}
              className="border-rose-500/30 text-rose-400 hover:bg-rose-950 text-xs"
            >
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onAddPayrollEntry(claim)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" /> Add to Payroll
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(claim)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve Claim
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
