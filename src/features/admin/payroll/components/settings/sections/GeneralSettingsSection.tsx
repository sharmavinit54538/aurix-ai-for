import React from "react";
import { Building2, HelpCircle, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

export const GeneralSettingsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      {/* ── Enterprise Config Card ── */}
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        {/* Card Header */}
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/15 to-blue-500/10 shadow-sm shadow-indigo-500/5">
              <Building2 className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">General Company Settings</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Configure your organization's primary identity, base currency, financial year cycle, and core payroll execution flags.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Organization identity, currency, and payroll execution flags
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Fields Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Company Name */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Company Payroll Entity Name
            </Label>
            <Input
              disabled={isReadOnly}
              value={data.company_name || ""}
              onChange={(e) => onChange({ company_name: e.target.value })}
              placeholder="Enter company name"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200 placeholder:text-slate-600"
            />
            <span className="text-[11px] text-slate-500">Legal entity name for payroll processing</span>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Default Base Currency
            </Label>
            <Select
              disabled={isReadOnly}
              value={data.currency || "INR"}
              onValueChange={(val) => onChange({ currency: val })}
            >
              <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#111827]">
                <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                <SelectItem value="AED">AED (د.إ) - UAE Dirham</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[11px] text-slate-500">Used across all payslips & reports</span>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Primary Tax Jurisdiction
            </Label>
            <Input
              disabled={isReadOnly}
              value={data.country || "India"}
              onChange={(e) => onChange({ country: e.target.value })}
              placeholder="Enter country"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200 placeholder:text-slate-600"
            />
            <span className="text-[11px] text-slate-500">Determines statutory compliance rules</span>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Timezone
            </Label>
            <Select
              disabled={isReadOnly}
              value={data.timezone || "Asia/Kolkata"}
              onValueChange={(val) => onChange({ timezone: val })}
            >
              <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#111827]">
                <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</SelectItem>
                <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                <SelectItem value="America/New_York">America/New_York (EST -5:00)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (GMT +0:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Financial Year Start */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Financial Year Start Date
            </Label>
            <Select
              disabled={isReadOnly}
              value={data.financial_year_start || "04-01"}
              onValueChange={(val) => onChange({ financial_year_start: val })}
            >
              <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
                <SelectValue placeholder="Financial Year Start" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#111827]">
                <SelectItem value="04-01">April 1st (Indian Standard Fiscal Year)</SelectItem>
                <SelectItem value="01-01">January 1st (Calendar Year)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary Payment Date */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Salary Payment Date
            </Label>
            <Input
              type="number"
              min={1}
              max={31}
              disabled={isReadOnly}
              value={data.salary_payment_date || 1}
              onChange={(e) => onChange({ salary_payment_date: Number(e.target.value) })}
              placeholder="1"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200 placeholder:text-slate-600"
            />
            <span className="text-[11px] text-slate-500">Day of month for salary credit</span>
          </div>
        </div>
      </div>

      {/* ── Feature Switches Card ── */}
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="pb-5">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Payroll Automation & Feature Switches
          </h4>
          <p className="mt-1 text-[12px] text-slate-500">
            Control automated payroll behaviors and processing modes
          </p>
        </div>

        <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Auto Payroll Lock */}
          <div className="card-hover-lift flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-[15px] font-semibold text-white/95">Auto Payroll Lock</div>
                <p className="text-[12px] leading-[1.6] text-slate-400/80">
                  Automatically lock the pay cycle after the approval workflow is completed. Prevents further edits.
                </p>
              </div>
              <Switch
                disabled={isReadOnly}
                checked={data.auto_lock_payroll}
                onCheckedChange={(val) => onChange({ auto_lock_payroll: val })}
                className="premium-switch mt-0.5 flex-shrink-0"
              />
            </div>
            <div className="mt-auto pt-4">
              <div className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                data.auto_lock_payroll
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.auto_lock_payroll ? "bg-emerald-400" : "bg-slate-500"}`} />
                {data.auto_lock_payroll ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          {/* Draft Payroll Mode */}
          <div className="card-hover-lift flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-[15px] font-semibold text-white/95">Draft Payroll Mode</div>
                <p className="text-[12px] leading-[1.6] text-slate-400/80">
                  Allow HR managers to preview and review draft payrolls before the final lock is applied.
                </p>
              </div>
              <Switch
                disabled={isReadOnly}
                checked={data.enable_draft_payroll}
                onCheckedChange={(val) => onChange({ enable_draft_payroll: val })}
                className="premium-switch mt-0.5 flex-shrink-0"
              />
            </div>
            <div className="mt-auto pt-4">
              <div className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                data.enable_draft_payroll
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.enable_draft_payroll ? "bg-emerald-400" : "bg-slate-500"}`} />
                {data.enable_draft_payroll ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          {/* Retroactive Payroll */}
          <div className="card-hover-lift flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-[15px] font-semibold text-white/95">Retroactive Payroll</div>
                <p className="text-[12px] leading-[1.6] text-slate-400/80">
                  Enable salary adjustment back-calculations for prior periods when corrections are needed.
                </p>
              </div>
              <Switch
                disabled={isReadOnly}
                checked={data.enable_retro_payroll}
                onCheckedChange={(val) => onChange({ enable_retro_payroll: val })}
                className="premium-switch mt-0.5 flex-shrink-0"
              />
            </div>
            <div className="mt-auto pt-4">
              <div className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                data.enable_retro_payroll
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.enable_retro_payroll ? "bg-emerald-400" : "bg-slate-500"}`} />
                {data.enable_retro_payroll ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
