import React from "react";
import { Landmark, HelpCircle } from "lucide-react";
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

export const BankingDisbursementSection: React.FC<SectionProps> = ({
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 shadow-sm shadow-cyan-500/5">
              <Landmark className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Banking & Disbursement</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Configure primary corporate salary disbursement account, IFSC routing, and bank advice file formats.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Corporate banking account, IFSC routing & transfer file formats
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Fields Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Corporate Bank Name
            </Label>
            <Input
              disabled={isReadOnly}
              value={data.bank_name || "HDFC Bank"}
              onChange={(e) => onChange({ bank_name: e.target.value })}
              placeholder="Enter bank name"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200 placeholder:text-slate-600"
            />
            <span className="text-[11px] text-slate-500">Primary salary disbursement bank</span>
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Bank IFSC Code
            </Label>
            <Input
              disabled={isReadOnly}
              value={data.bank_ifsc || "HDFC0001234"}
              onChange={(e) => onChange({ bank_ifsc: e.target.value })}
              placeholder="e.g. HDFC0001234"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] font-mono text-sm text-slate-200 placeholder:text-slate-600"
            />
            <span className="text-[11px] text-slate-500">11-character RBI routing code</span>
          </div>

          {/* Transfer Format */}
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Salary Transfer Format
            </Label>
            <Select
              disabled={isReadOnly}
              value={data.salary_transfer_format || "NEFT"}
              onValueChange={(val: any) => onChange({ salary_transfer_format: val })}
            >
              <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#111827]">
                <SelectItem value="NEFT">HDFC / ICICI Corporate NEFT Batch</SelectItem>
                <SelectItem value="RTGS">RTGS High-Value Transfer File</SelectItem>
                <SelectItem value="ACH">NACH / ACH Debit File</SelectItem>
                <SelectItem value="CSV">Standard CSV Advice File</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[11px] text-slate-500">Bank advice file export format</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 rounded-xl border border-indigo-500/15 bg-indigo-500/[0.04] p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/15">
              <Landmark className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-indigo-300/90">
                Corporate Banking Integration
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Salary transfer files are generated using the configured format and routed through the specified IFSC code during payroll processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
