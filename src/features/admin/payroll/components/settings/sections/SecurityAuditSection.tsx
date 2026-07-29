import React from "react";
import { Lock, HelpCircle, ShieldAlert, History, Key, EyeOff } from "lucide-react";
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

export const SecurityAuditSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/15 to-red-500/10 shadow-sm shadow-rose-500/5">
              <Lock className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Security & Audit Controls</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Enforce AES-256 salary encryption, granular role-based access controls (RBAC), and detailed audit log retention.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                AES-256 salary record encryption, RBAC permission scopes & audit log retention
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">AES-256 Salary Field Encryption</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Encrypt base salary, bonuses, and bank details at rest in SQL database</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded inline-block">
              FIPS 140-2 Encrypted
            </div>
          </div>

          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">Mask Salary in Non-Payroll Views</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Mask compensation figures for general HR managers lacking finance role</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded inline-block">
              Role Masking Enabled (*****)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
