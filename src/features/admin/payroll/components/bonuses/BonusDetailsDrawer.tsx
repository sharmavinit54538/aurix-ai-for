import React from "react";
import {
  X,
  Gift,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  FileText,
  Calculator,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BonusAward } from "./bonusesTypes";

interface BonusDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  bonus: BonusAward | null;
  onApprove: (bonus: BonusAward) => void;
  onReject: (bonus: BonusAward) => void;
  onGenerateLetter: (bonus: BonusAward) => void;
  onAddPayrollEntry: (bonus: BonusAward) => void;
}

export const BonusDetailsDrawer: React.FC<BonusDetailsDrawerProps> = ({
  open,
  onClose,
  bonus,
  onApprove,
  onReject,
  onGenerateLetter,
  onAddPayrollEntry,
}) => {
  if (!bonus) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#070B17] border-l border-white/10 text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div>
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              Bonus Award Details: <span className="font-mono text-amber-300">{bonus.bonusCode}</span>
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">{bonus.bonusCycle} • Effective {bonus.effectiveDate}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Employee & Payout Summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Employee & Performance</span>
              <h4 className="text-sm font-bold text-white">{bonus.employeeName}</h4>
              <p className="text-xs text-slate-300">{bonus.department} — {bonus.designation}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 gap-1 text-[11px]">
                  <Star className="w-3 h-3 fill-amber-400" /> Performance Rating: {bonus.performanceRating}/5.0
                </Badge>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Award Financials</span>
              <div className="text-xl font-bold font-mono text-white">
                ₹{bonus.bonusAmount.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-slate-400">TDS Deduction (30%): ₹{bonus.taxImpact.toLocaleString("en-IN")}</p>
              <div className="text-xs font-bold font-mono text-emerald-400 mt-1">
                Net Take-Home: ₹{bonus.netPayout.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Formula & Calculation Mode */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Calculation Formula Engine</h4>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bonus Category:</span>
                <Badge variant="outline" className="text-amber-300 border-amber-500/30 font-mono">
                  {bonus.bonusType}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Calculation Mode:</span>
                <span className="font-mono text-blue-300">{bonus.calculationMode}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/5 font-mono">
                <span className="text-slate-400">Formula Expression:</span>
                <span className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/20">
                  {bonus.formulaExpression || `₹${bonus.bonusAmount}`}
                </span>
              </div>
            </div>
          </div>

          {/* 6-Stage Governance Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">6-Stage Executive Sign-off Governance</h4>
            <div className="space-y-2">
              {bonus.approvalWorkflow.map((step) => {
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
                        <p className="text-[10px] text-slate-400">{step.name} • {step.timestamp || "Awaiting sign-off"}</p>
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
              onClick={() => onGenerateLetter(bonus)}
              className="border-white/10 bg-slate-950 text-slate-300 text-xs gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Letter
            </Button>
            <Button
              size="sm"
              onClick={() => onAddPayrollEntry(bonus)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" /> Add to Payroll
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(bonus)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve Award
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
