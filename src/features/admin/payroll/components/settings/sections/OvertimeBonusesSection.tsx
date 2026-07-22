import React from "react";
import { Clock, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

export const OvertimeBonusesSection: React.FC<SectionProps> = ({
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 to-orange-500/10 shadow-sm shadow-amber-500/5">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Overtime & Bonus Policies</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Configure hourly overtime rate multipliers, night shift differentials, and spot bonus eligibility criteria.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                OT rate multipliers, night shift differentials & bonus policies
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* OT Enable Toggle */}
        <div className="card-hover-lift rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                <Clock className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/90">Overtime (OT) Pay Calculation</h4>
                <p className="text-[11px] text-slate-500">Enable automated OT computation for eligible employees</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                data.overtime_enabled
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.overtime_enabled ? "bg-emerald-400" : "bg-slate-500"}`} />
                {data.overtime_enabled ? "Active" : "Disabled"}
              </span>
              <Switch
                disabled={isReadOnly}
                checked={data.overtime_enabled}
                onCheckedChange={(val) => onChange({ overtime_enabled: val })}
                className="premium-switch"
              />
            </div>
          </div>

          {/* Rate Multiplier Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Holiday OT */}
            <div className="card-hover-lift rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1]">
              <Label className="text-[13px] font-semibold text-slate-300">
                Holiday OT Multiplier
              </Label>
              <Input
                type="number"
                step="0.1"
                disabled={isReadOnly || !data.overtime_enabled}
                value={data.overtime_multiplier_holiday || 2.0}
                onChange={(e) => onChange({ overtime_multiplier_holiday: Number(e.target.value) })}
                className="premium-input mt-2 h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Standard: 2.0×</span>
                <span className="rounded border border-amber-500/20 bg-amber-500/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                  Double Pay
                </span>
              </div>
            </div>

            {/* Weekend OT */}
            <div className="card-hover-lift rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1]">
              <Label className="text-[13px] font-semibold text-slate-300">
                Weekend OT Multiplier
              </Label>
              <Input
                type="number"
                step="0.1"
                disabled={isReadOnly || !data.overtime_enabled}
                value={data.overtime_multiplier_weekend || 1.5}
                onChange={(e) => onChange({ overtime_multiplier_weekend: Number(e.target.value) })}
                className="premium-input mt-2 h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Standard: 1.5×</span>
                <span className="rounded border border-blue-500/20 bg-blue-500/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">
                  Time & Half
                </span>
              </div>
            </div>

            {/* Night Shift */}
            <div className="card-hover-lift rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1]">
              <Label className="text-[13px] font-semibold text-slate-300">
                Night Shift Differential
              </Label>
              <Input
                type="number"
                step="0.05"
                disabled={isReadOnly || !data.overtime_enabled}
                value={data.overtime_multiplier_night || 1.25}
                onChange={(e) => onChange({ overtime_multiplier_night: Number(e.target.value) })}
                className="premium-input mt-2 h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Standard: 1.25×</span>
                <span className="rounded border border-purple-500/20 bg-purple-500/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-purple-400">
                  Night Premium
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
