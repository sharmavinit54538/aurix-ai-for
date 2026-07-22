import React from "react";
import {
  X,
  HandCoins,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  Building,
  Calendar,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalaryAdvanceRequest } from "./advancesTypes";

interface AdvanceDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  advance: SalaryAdvanceRequest | null;
  onApprove: (advance: SalaryAdvanceRequest) => void;
  onReject: (advance: SalaryAdvanceRequest) => void;
  onDisburse: (advance: SalaryAdvanceRequest) => void;
  onAdjustPlan: (advance: SalaryAdvanceRequest) => void;
}

export const AdvanceDetailsDrawer: React.FC<AdvanceDetailsDrawerProps> = ({
  open,
  onClose,
  advance,
  onApprove,
  onReject,
  onDisburse,
  onAdjustPlan,
}) => {
  if (!advance) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#070B17] border-l border-white/10 text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div>
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <HandCoins className="w-5 h-5 text-cyan-400" />
              Salary Advance Specs: <span className="font-mono text-cyan-300">{advance.advanceCode}</span>
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">Requested on {advance.createdOn} • Type: {advance.advanceType}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Employee & Financial Summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Employee & Reason</span>
              <h4 className="text-sm font-bold text-white">{advance.employeeName}</h4>
              <p className="text-xs text-slate-300">{advance.department} — {advance.designation}</p>
              <p className="text-xs text-slate-400 mt-2 italic">"{advance.reason}"</p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Advance Financials</span>
              <div className="text-xl font-bold font-mono text-white">
                ₹{advance.approvedAmount.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-emerald-400">Recovered: ₹{advance.recoveredAmount.toLocaleString("en-IN")}</p>
              <div className="text-xs font-bold font-mono text-amber-400 mt-1">
                Outstanding EMI: ₹{advance.outstandingBalance.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Bank Transfer Receipt */}
          {advance.paymentStatus === "DISBURSED" && (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  Bank Disbursal Receipt
                </span>
                <span className="font-mono text-emerald-400">Settled {advance.settlementDate}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300">
                <div>
                  <span className="text-slate-500">Destination Account:</span>
                  <p className="font-mono text-white">{advance.bankAccount} ({advance.bankName})</p>
                </div>
                <div>
                  <span className="text-slate-500">Transaction Reference:</span>
                  <p className="font-mono text-cyan-300">{advance.transactionRef}</p>
                </div>
              </div>
            </div>
          )}

          {/* Installments Recovery Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Monthly Installments Repayment Schedule</h4>
            <div className="bns-table-wrapper">
              <table className="bns-table text-xs">
                <thead>
                  <tr>
                    <th>Installment #</th>
                    <th>Due Date</th>
                    <th>EMI Amount</th>
                    <th>Payroll Cut</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {advance.installments.length > 0 ? (
                    advance.installments.map((inst) => (
                      <tr key={inst.installmentNumber}>
                        <td className="font-mono text-slate-300">EMI #{inst.installmentNumber}</td>
                        <td className="font-mono text-slate-400">{inst.dueDate}</td>
                        <td className="font-mono font-bold text-white">₹{inst.amount.toLocaleString("en-IN")}</td>
                        <td className="font-mono text-slate-300">{inst.payrollCycle || "Upcoming"}</td>
                        <td>
                          {inst.status === "PAID" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">Paid</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[10px]">Pending</Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-slate-500 py-3">
                        Installment schedule will be generated upon approval.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6-Stage Governance Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">6-Stage Multi-Level Governance Timeline</h4>
            <div className="space-y-2">
              {advance.approvalWorkflow.map((step) => {
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

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-900 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-950 text-slate-300 text-xs">
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAdjustPlan(advance)}
              className="border-white/10 bg-slate-950 text-slate-300 text-xs gap-1"
            >
              Adjust Plan
            </Button>
            <Button
              size="sm"
              onClick={() => onDisburse(advance)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" /> Disburse Bank
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(advance)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve Request
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
