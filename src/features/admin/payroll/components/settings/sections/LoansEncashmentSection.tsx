import React from "react";
import { Receipt, HelpCircle, HandCoins, Percent, Calculator } from "lucide-react";
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

export const LoansEncashmentSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/15 to-pink-500/10 shadow-sm shadow-purple-500/5">
              <Receipt className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Encashment & Salary Loans</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Set maximum salary advance limits, EMI recovery tenure options, and annual leave encashment tax rules.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Leave encashment calculations, salary advance ceilings & EMI recovery options
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Salary Advances */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Max Salary Advance Limit (% of Net Pay)
            </Label>
            <Input
              type="number"
              min={10}
              max={100}
              disabled={isReadOnly}
              defaultValue="50"
              placeholder="50%"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">Maximum eligible advance based on current month earnings</span>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Max Loan EMI Repayment Tenure (Months)
            </Label>
            <Input
              type="number"
              min={1}
              max={24}
              disabled={isReadOnly}
              defaultValue="12"
              placeholder="12 months"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">Monthly recovery installments deducted from gross salary</span>
          </div>
        </div>

        {/* Leave Encashment Rules */}
        <div className="mt-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            Leave Encashment & Gratuity Calculation
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-white">Annual Earned Leave Encashment</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Encash unused privilege leave during financial year-end run</div>
                </div>
                <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
              </div>
              <div className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded inline-block">
                Tax exemption limit up to ₹25 Lakhs (sec 10 10AA)
              </div>
            </div>

            <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-white">Gratuity Auto Provisioning</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Accrue monthly gratuity liability for employees with &gt; 5 yrs tenure</div>
                </div>
                <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
              </div>
              <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded inline-block">
                15/26 days basic salary formula active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
