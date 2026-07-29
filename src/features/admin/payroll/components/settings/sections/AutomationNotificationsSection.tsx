import React from "react";
import { Bell, HelpCircle, Mail, MessageSquare, ShieldCheck } from "lucide-react";
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

export const AutomationNotificationsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/15 to-indigo-500/10 shadow-sm shadow-blue-500/5">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Notifications & Automated Dispatch</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Set automated payslip email triggers, salary credit SMS alerts, WhatsApp advice notifications, and backup schedules.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Automated payslip PDF emailing, SMS credit alerts & daily backup triggers
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">Auto Email Password-Protected Payslips</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Automatically dispatch encrypted PDF payslips to workforce email accounts</div>
              </div>
              <Switch
                disabled={isReadOnly}
                checked={data.auto_email_payslips}
                onCheckedChange={(val) => onChange({ auto_email_payslips: val })}
                className="premium-switch shrink-0"
              />
            </div>
            <div className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded inline-block">
              Password: PAN + DOB format
            </div>
          </div>

          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">Automated Database Backups</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Backup payroll registers and tax computation files to encrypted vault</div>
              </div>
              <Switch
                disabled={isReadOnly}
                checked={data.auto_backup_payroll}
                onCheckedChange={(val) => onChange({ auto_backup_payroll: val })}
                className="premium-switch shrink-0"
              />
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded inline-block">
              Daily Cloud Vault Active
            </div>
          </div>

          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">Salary Credit SMS Alerts</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Send instant SMS alert to employees upon successful bank disbursement</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded inline-block">
              Twilio SMS Gateway Active
            </div>
          </div>

          <div className="card-hover-nextgen rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-white">WhatsApp Payslip Advice Notification</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Send payslip summary link over official WhatsApp Business API</div>
              </div>
              <Switch disabled={isReadOnly} defaultChecked={true} className="premium-switch shrink-0" />
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded inline-block">
              WhatsApp Enterprise API Connected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
