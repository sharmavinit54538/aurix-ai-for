import React from "react";
import { Layers, Plus, GripVertical, HelpCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export const SalaryComponentsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isReadOnly = false,
}) => {
  const componentsList = [
    { id: "basic", name: "Basic Salary", type: "Earnings", formula: "50% of CTC", taxable: "100% Taxable", enabled: true },
    { id: "hra", name: "House Rent Allowance (HRA)", type: "Earnings", formula: "50% of Basic (Metro) / 40% (Non-Metro)", taxable: "Exempt under 10(13A)", enabled: true },
    { id: "special", name: "Special Allowance", type: "Earnings", formula: "Balancing figure", taxable: "100% Taxable", enabled: true },
    { id: "conveyance", name: "Conveyance Allowance", type: "Earnings", formula: "Fixed ₹1,600 / mo", taxable: "Fully Taxable (New Regime)", enabled: true },
    { id: "medical", name: "Medical Reimbursement", type: "Earnings", formula: "Fixed ₹1,250 / mo", taxable: "Exempt up to ₹15,000 / yr", enabled: true },
    { id: "lta", name: "Leave Travel Allowance (LTA)", type: "Earnings", formula: "Annual Benefit", taxable: "Exempt twice in 4 yrs", enabled: true },
    { id: "variable", name: "Performance Incentive / Variable Pay", type: "Variable", formula: "KRA Score based", taxable: "100% Taxable", enabled: true },
  ];

  const typeColorMap: Record<string, string> = {
    Earnings: "border-purple-500/25 bg-purple-500/10 text-purple-400",
    Variable: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="section-enter">
      <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-7 shadow-xl backdrop-blur-md">
        {/* Card Header */}
        <div className="flex items-start justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/15 to-pink-500/10 shadow-sm shadow-purple-500/5">
              <Layers className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white/95">Salary Components & Earnings</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 hover:text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-xs">
                      Define earnings components, formulas, taxability rules, and ordering in employee CTC structures.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                Earnings components, CTC formulas, and taxability rules
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={isReadOnly}
            className="btn-ripple h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] text-xs text-slate-300 hover:bg-white/[0.06]"
          >
            <Plus className="h-3.5 w-3.5 text-indigo-400" />
            Add Component
          </Button>
        </div>

        {/* Divider */}
        <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Component List */}
        <div className="space-y-2.5">
          {componentsList.map((comp, index) => (
            <div
              key={comp.id}
              className="card-hover-lift group flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Left: Drag + Info */}
              <div className="flex items-center gap-3.5">
                <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-slate-600 opacity-30 transition-opacity group-hover:opacity-60" />

                {/* Index Number */}
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-[10px] font-bold text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-white/90">{comp.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${typeColorMap[comp.type] || "border-white/10 bg-white/5 text-slate-400"}`}
                    >
                      {comp.type}
                    </Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    <span className="text-slate-400">{comp.formula}</span>
                    <span className="mx-2 text-slate-600">·</span>
                    <span>{comp.taxable}</span>
                  </div>
                </div>
              </div>

              {/* Right: Status + Toggle */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                    comp.enabled
                      ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-500"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${comp.enabled ? "bg-emerald-400" : "bg-slate-500"}`} />
                  {comp.enabled ? "Active" : "Inactive"}
                </span>
                <Switch disabled={isReadOnly} checked={comp.enabled} className="premium-switch" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
