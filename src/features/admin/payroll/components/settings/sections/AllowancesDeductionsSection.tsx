import React from "react";
import { Coins, HelpCircle, Plus, Trash2, ShieldCheck, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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

export const AllowancesDeductionsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      {/* Card Header */}
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 to-orange-500/10 shadow-sm shadow-amber-500/5">
              <Coins className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Allowances & Deductions Rules</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Configure tax-exempt allowances, recurring payroll deductions, voluntary provident funds, and statutory exemption rules.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Taxable & non-taxable allowances, statutory deductions & voluntary PF
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Allowances Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Recurring Tax-Exempt Allowances
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-slate-200">Medical Allowance (Monthly Ceiling)</Label>
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">Tax Exempt</Badge>
              </div>
              <Input
                disabled={isReadOnly}
                defaultValue="1250"
                placeholder="₹1,250 / month"
                className="premium-input h-10 border-white/[0.08] bg-white/[0.03] text-xs text-slate-200"
              />
              <span className="text-[10px] text-slate-500">Up to ₹15,000 per annum tax exemption</span>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-slate-200">Leave Travel Allowance (LTA)</Label>
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">Bi-Annual</Badge>
              </div>
              <Input
                disabled={isReadOnly}
                defaultValue="5000"
                placeholder="₹5,000 / month"
                className="premium-input h-10 border-white/[0.08] bg-white/[0.03] text-xs text-slate-200"
              />
              <span className="text-[10px] text-slate-500">Exempt 2 journeys in a block of 4 calendar years</span>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-slate-200">Telephone & Internet Reimbursement</Label>
                <Badge variant="outline" className="text-[10px] text-indigo-400 border-indigo-500/30">Bill Refund</Badge>
              </div>
              <Input
                disabled={isReadOnly}
                defaultValue="2000"
                placeholder="₹2,000 / month"
                className="premium-input h-10 border-white/[0.08] bg-white/[0.03] text-xs text-slate-200"
              />
              <span className="text-[10px] text-slate-500">Exempt against actual submitted bills</span>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-slate-200">Food / Meal Coupons Allowance</Label>
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">Tax Free</Badge>
              </div>
              <Input
                disabled={isReadOnly}
                defaultValue="2200"
                placeholder="₹2,200 / month"
                className="premium-input h-10 border-white/[0.08] bg-white/[0.03] text-xs text-slate-200"
              />
              <span className="text-[10px] text-slate-500">₹50 per meal (2 meals/day, 22 working days)</span>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="mt-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            Statutory & Voluntary Deductions
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-white">Voluntary Provident Fund (VPF)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Allow employees to contribute beyond standard 12% basic pay</div>
                </div>
                <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
              </div>
              <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded inline-block">
                Tax benefit under Section 80C
              </div>
            </div>

            <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-white">Group Health Insurance Recovery</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Auto-deduct dependent premium add-ons from monthly pay</div>
                </div>
                <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
              </div>
              <div className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded inline-block">
                Corporate Master Policy Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
