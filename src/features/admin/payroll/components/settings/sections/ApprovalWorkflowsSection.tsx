import React from "react";
import { GitPullRequest, HelpCircle, UserCheck, Shield, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PayrollSettingsData } from "@/services/payrollSettingsApi";

interface SectionProps {
  data: PayrollSettingsData;
  onChange: (updated: Partial<PayrollSettingsData>) => void;
  isReadOnly?: boolean;
}

export const ApprovalWorkflowsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/15 to-teal-500/10 shadow-sm shadow-green-500/5">
              <GitPullRequest className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Payroll Approval Workflows</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Set multi-tier approval chains, threshold amount sign-offs, CFO approval triggers, and audit requirements.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Multi-level approval chains, threshold sign-off rules & audit trails
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              CFO Sign-off Threshold Amount (₹)
            </Label>
            <Input
              type="number"
              disabled={isReadOnly}
              defaultValue="5000000"
              placeholder="₹50,000,000"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">Requires explicit CFO approval if monthly payout exceeds this amount</span>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Approval Chain Levels Required
            </Label>
            <Input
              type="number"
              min={1}
              max={5}
              disabled={isReadOnly}
              defaultValue="2"
              placeholder="2 levels"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">Level 1: Payroll Admin → Level 2: Finance Manager</span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Approval Guardrails
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-white">Dual-Control Discard Protection</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Prevent single-user deletion or modification of locked payroll runs</div>
                </div>
                <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
              </div>
              <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded inline-block">
                SOX Compliance Guard Active
              </div>
            </div>

            <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-white">Bank Batch Payout Pre-Approval Lock</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Lock NEFT advice file generation until final sign-off token is signed</div>
                </div>
                <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
              </div>
              <div className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded inline-block">
                Bank Gateway Locked
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
