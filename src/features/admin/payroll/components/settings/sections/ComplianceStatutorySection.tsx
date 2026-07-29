import React from "react";
import { ShieldCheck, HelpCircle, FileCheck, CheckCircle2, AlertTriangle } from "lucide-react";
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

export const ComplianceStatutorySection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 shadow-sm shadow-cyan-500/5">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Compliance & Statutory Governance</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Monitor PF Electronic Challan Return (ECR), Form 16 Part A/B generation, LWF Labour Welfare Fund, and ESI challan validation.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Labour Welfare Fund (LWF), ECR file generators, Form 16 Part A/B & Statutory Registers
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">Labour Welfare Fund (LWF) Auto Deduct</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Deduct semi-annual state LWF contributions (June & December)</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded inline-block">
              State specific LWF rates active
            </div>
          </div>

          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">PF ECR File Generator</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Generate EPFO portal-compliant text file formatted for monthly upload</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded inline-block">
              UAN Validation Engine Enabled
            </div>
          </div>

          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">Form 16 Part A & B Automated Bundling</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Merge TRACES Part A with System Part B for annual IT returns</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded inline-block">
              Digital Signature (DSC) Ready
            </div>
          </div>

          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">Minimum Wages Audit Check</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Flag any salary structure below minimum state statutory wage guidelines</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded inline-block">
              0 Statutory wage violations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
