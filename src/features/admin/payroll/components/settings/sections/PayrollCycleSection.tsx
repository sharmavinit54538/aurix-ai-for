import React from "react";
import { Calendar, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export const PayrollCycleSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        {/* Card Header */}
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 shadow-sm shadow-blue-500/5">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Payroll Cycle & Cutoff Rules</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Define pay cycle frequency, attendance cutoff dates, grace period for LOP corrections, and HR draft preview window.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Pay frequency, attendance cutoff, grace period & preview window
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Fields Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Pay Cycle Type */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Pay Cycle Frequency
            </Label>
            <Select
              disabled={isReadOnly}
              value={data.pay_cycle_type || "MONTHLY"}
              onValueChange={(val: any) => onChange({ pay_cycle_type: val })}
            >
              <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
                <SelectValue placeholder="Pay Cycle Frequency" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#111827]">
                <SelectItem value="MONTHLY">Monthly (1st to 30th/31st)</SelectItem>
                <SelectItem value="BI_WEEKLY">Bi-Weekly (Every 2 Weeks)</SelectItem>
                <SelectItem value="WEEKLY">Weekly (Every 7 Days)</SelectItem>
                <SelectItem value="CUSTOM">Custom Pay Period</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[11px] text-slate-500">Salary processing frequency</span>
          </div>

          {/* Cutoff Date */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Attendance Cutoff Date
            </Label>
            <Input
              type="number"
              min={1}
              max={31}
              disabled={isReadOnly}
              value={data.cutoff_date || 25}
              onChange={(e) => onChange({ cutoff_date: Number(e.target.value) })}
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">Attendance freezes after this date</span>
          </div>

          {/* Grace Period */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Grace Period (Days)
            </Label>
            <Input
              type="number"
              min={0}
              max={10}
              disabled={isReadOnly}
              value={data.grace_period_days || 3}
              onChange={(e) => onChange({ grace_period_days: Number(e.target.value) })}
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">Window for LOP regularizations</span>
          </div>

          {/* Preview Days */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              HR Preview Days
            </Label>
            <Input
              type="number"
              min={1}
              max={15}
              disabled={isReadOnly}
              value={data.preview_days || 5}
              onChange={(e) => onChange({ preview_days: Number(e.target.value) })}
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">Draft preview period before lock</span>
          </div>
        </div>
      </div>
    </div>
  );
};
