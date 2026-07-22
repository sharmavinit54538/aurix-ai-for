import React from "react";
import { Percent, ShieldCheck, HelpCircle } from "lucide-react";
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

export const TaxesStatutorySection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      {/* ── Main Config Card ── */}
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        {/* Card Header */}
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/15 to-indigo-500/10 shadow-sm shadow-purple-500/5">
              <Percent className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Statutory Tax & Compliance</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Configure Provident Fund (PF), Employee State Insurance (ESI), Professional Tax (PT), and Income Tax Regime rules.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                PF, ESI, Professional Tax & Income Tax Regime configuration
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* ── Provident Fund Sub-Card ── */}
        <div className="card-hover-lift rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/90">Provident Fund (EPF)</h4>
                <p className="text-[11px] text-slate-500">Employee & employer contribution rules</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                data.pf_enabled
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.pf_enabled ? "bg-emerald-400" : "bg-slate-500"}`} />
                {data.pf_enabled ? "Active" : "Disabled"}
              </span>
              <Switch
                disabled={isReadOnly}
                checked={data.pf_enabled}
                onCheckedChange={(val) => onChange({ pf_enabled: val })}
                className="premium-switch"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-300">Employee PF Rate</Label>
              <Input
                type="number"
                step="0.01"
                disabled={isReadOnly || !data.pf_enabled}
                value={(data.employee_pf_rate * 100).toFixed(2)}
                onChange={(e) => onChange({ employee_pf_rate: Number(e.target.value) / 100 })}
                className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <span className="text-[11px] text-slate-500">Standard: 12.0%</span>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-300">Employer PF Rate</Label>
              <Input
                type="number"
                step="0.01"
                disabled={isReadOnly || !data.pf_enabled}
                value={(data.employer_pf_rate * 100).toFixed(2)}
                onChange={(e) => onChange({ employer_pf_rate: Number(e.target.value) / 100 })}
                className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <span className="text-[11px] text-slate-500">Standard: 12.0%</span>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-300">PF Wage Ceiling (₹)</Label>
              <Input
                type="number"
                disabled={isReadOnly || !data.pf_enabled}
                value={data.pf_wage_ceiling}
                onChange={(e) => onChange({ pf_wage_ceiling: Number(e.target.value) })}
                className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <span className="text-[11px] text-slate-500">Standard: ₹15,000 / mo</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div>
                <div className="text-sm font-semibold text-white/90">PF on Full Basic</div>
                <p className="mt-0.5 text-[11px] text-slate-500">Para 26(6) joint option</p>
              </div>
              <Switch
                disabled={isReadOnly || !data.pf_enabled}
                checked={data.pf_on_full_basic}
                onCheckedChange={(val) => onChange({ pf_on_full_basic: val })}
                className="premium-switch"
              />
            </div>
          </div>
        </div>

        {/* ── ESI Sub-Card ── */}
        <div className="card-hover-lift mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/90">Employee State Insurance (ESI)</h4>
                <p className="text-[11px] text-slate-500">Social security contribution rules</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                data.esi_enabled
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.esi_enabled ? "bg-emerald-400" : "bg-slate-500"}`} />
                {data.esi_enabled ? "Active" : "Disabled"}
              </span>
              <Switch
                disabled={isReadOnly}
                checked={data.esi_enabled}
                onCheckedChange={(val) => onChange({ esi_enabled: val })}
                className="premium-switch"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-300">Employee ESI Rate</Label>
              <Input
                type="number"
                step="0.001"
                disabled={isReadOnly || !data.esi_enabled}
                value={(data.employee_esi_rate * 100).toFixed(2)}
                onChange={(e) => onChange({ employee_esi_rate: Number(e.target.value) / 100 })}
                className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <span className="text-[11px] text-slate-500">Standard: 0.75%</span>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-300">Employer ESI Rate</Label>
              <Input
                type="number"
                step="0.001"
                disabled={isReadOnly || !data.esi_enabled}
                value={(data.employer_esi_rate * 100).toFixed(2)}
                onChange={(e) => onChange({ employer_esi_rate: Number(e.target.value) / 100 })}
                className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <span className="text-[11px] text-slate-500">Standard: 3.25%</span>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-300">ESI Wage Ceiling (₹)</Label>
              <Input
                type="number"
                disabled={isReadOnly || !data.esi_enabled}
                value={data.esi_wage_ceiling}
                onChange={(e) => onChange({ esi_wage_ceiling: Number(e.target.value) })}
                className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
              />
              <span className="text-[11px] text-slate-500">Standard: ₹21,000 / mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Income Tax & PT Card ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="config-card card-hover-lift rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-6 shadow-xl backdrop-blur-md">
          <h4 className="text-sm font-bold text-white/90">Default Income Tax Regime</h4>
          <p className="mb-4 mt-1 text-[11px] text-slate-500">Applies to all employees by default</p>
          <Select
            disabled={isReadOnly}
            value={data.default_tax_regime || "NEW"}
            onValueChange={(val: "OLD" | "NEW") => onChange({ default_tax_regime: val })}
          >
            <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
              <SelectValue placeholder="Default Tax Regime" />
            </SelectTrigger>
            <SelectContent className="border-white/[0.08] bg-[#111827]">
              <SelectItem value="NEW">New Tax Regime (Lower Slabs, No Exemptions)</SelectItem>
              <SelectItem value="OLD">Old Tax Regime (Exemptions & 80C/80D Allowed)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="config-card card-hover-lift rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-6 shadow-xl backdrop-blur-md">
          <h4 className="text-sm font-bold text-white/90">Professional Tax (PT) State</h4>
          <p className="mb-4 mt-1 text-[11px] text-slate-500">State jurisdiction for PT slabs</p>
          <Select
            disabled={isReadOnly}
            value={data.pt_state || "TELANGANA"}
            onValueChange={(val) => onChange({ pt_state: val })}
          >
            <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
              <SelectValue placeholder="PT State" />
            </SelectTrigger>
            <SelectContent className="border-white/[0.08] bg-[#111827]">
              <SelectItem value="TELANGANA">Telangana (₹200 / mo)</SelectItem>
              <SelectItem value="MAHARASHTRA">Maharashtra (₹200 - ₹250 / mo)</SelectItem>
              <SelectItem value="KARNATAKA">Karnataka (₹200 / mo)</SelectItem>
              <SelectItem value="TAMIL_NADU">Tamil Nadu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
