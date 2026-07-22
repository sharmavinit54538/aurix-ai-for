import React from "react";
import {
  X,
  MinusCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Play,
  Calculator,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeductionRule } from "./deductionsTypes";

interface DeductionDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  rule: DeductionRule | null;
  onAssignEmployees: (rule: DeductionRule) => void;
  onPreviewImpact: (rule: DeductionRule) => void;
  onToggleStatus: (rule: DeductionRule) => void;
}

export const DeductionDetailsDrawer: React.FC<DeductionDetailsDrawerProps> = ({
  open,
  onClose,
  rule,
  onAssignEmployees,
  onPreviewImpact,
  onToggleStatus,
}) => {
  if (!rule) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#070B17] border-l border-white/10 text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div>
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <MinusCircle className="w-5 h-5 text-rose-400" />
              Deduction Rule Specs: <span className="font-mono text-rose-300">{rule.code}</span>
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">{rule.name} • Effective {rule.effectiveDate}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Classification</span>
              <h4 className="text-sm font-bold text-white">{rule.name}</h4>
              <p className="text-xs text-slate-300">{rule.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-[10px]">
                  {rule.categoryGroup}
                </Badge>
                <Badge variant="outline" className="text-rose-300 border-rose-500/30 text-[10px]">
                  {rule.category}
                </Badge>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Assigned Scope</span>
              <div className="text-xl font-bold font-mono text-white">
                {rule.employeeCount} Staff
              </div>
              <p className="text-[11px] text-slate-400">Recurrence: {rule.recurrence}</p>
              <Badge className={rule.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]" : "bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px]"}>
                Status: {rule.status}
              </Badge>
            </div>
          </div>

          {/* Formula Engine & Limits */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Formula Specs & Calculation Limits</h4>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Calculation Method:</span>
                <span className="font-mono text-blue-300">{rule.calculationMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Maximum Cap Limit:</span>
                <span className="font-mono text-emerald-400">{rule.maxLimit ? `₹${rule.maxLimit.toLocaleString("en-IN")}` : "No Limit"}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/5 font-mono">
                <span className="text-slate-400">Formula Expression:</span>
                <span className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/20">
                  {rule.formulaExpression}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Stage Governance Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Compliance Sign-off Governance</h4>
            <div className="space-y-2">
              {rule.approvalWorkflow.map((step) => {
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
                        <p className="text-[10px] text-slate-400">{step.name} • {step.timestamp || "Approved policy"}</p>
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
              onClick={() => onAssignEmployees(rule)}
              className="border-white/10 bg-slate-950 text-slate-300 text-xs gap-1"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" /> Assign Staff
            </Button>
            <Button
              size="sm"
              onClick={() => onPreviewImpact(rule)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
            >
              <Play className="w-3.5 h-3.5" /> Preview Impact
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
