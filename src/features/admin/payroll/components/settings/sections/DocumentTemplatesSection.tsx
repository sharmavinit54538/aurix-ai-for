import React from "react";
import { FileText, HelpCircle, Layout, Palette, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

export const DocumentTemplatesSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <div className="section-enter space-y-6">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-purple-500/10 shadow-sm shadow-violet-500/5">
              <FileText className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Document Templates & Formatting</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Choose PDF layouts for payslips, Form 16 Part B tax sheets, CTC breakups, and company letterhead branding.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Payslip PDF layouts, Form 16 Part B design & company letterhead branding
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Payslip PDF Template Style
            </Label>
            <Select disabled={isReadOnly} defaultValue="MODERN_DARK">
              <SelectTrigger className="premium-select h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200">
                <SelectValue placeholder="Template Style" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#111827]">
                <SelectItem value="MODERN_DARK">Modern Dark Sapphire (Default)</SelectItem>
                <SelectItem value="ENTERPRISE_CLEAN">Enterprise Minimal White</SelectItem>
                <SelectItem value="CLASSIC_CORPORATE">Classic Corporate Bordered</SelectItem>
                <SelectItem value="COMPACT_GRID">Compact Two-Column Grid</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[11px] text-slate-500">Visual theme applied when rendering PDF payslips</span>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-semibold text-slate-300">
              Company Logo Branding Header
            </Label>
            <Input
              disabled={isReadOnly}
              defaultValue="Aurix AI Enterprise Logo (SVG/PNG)"
              className="premium-input h-11 border-white/[0.08] bg-white/[0.03] text-sm text-slate-200"
            />
            <span className="text-[11px] text-slate-500">High-resolution logo embedded on top of all payslips</span>
          </div>
        </div>
      </div>
    </div>
  );
};
