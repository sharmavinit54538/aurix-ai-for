import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert, FileWarning, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ValidationErrorItem {
  id: string;
  category: "MISSING_PAN" | "MISSING_BANK" | "ATTENDANCE_MISMATCH" | "LEAVE_MISMATCH" | "SALARY_MISMATCH" | "INVALID_PF" | "INVALID_ESI";
  employeeName: string;
  employeeCode: string;
  department: string;
  description: string;
  severity: "CRITICAL" | "WARNING";
}

interface ValidationPanelProps {
  errors?: ValidationErrorItem[];
  isLoading?: boolean;
  onResolve?: (id: string) => void;
  onRunAutoFix?: () => void;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  errors = [],
  isLoading = false,
  onResolve,
  onRunAutoFix,
}) => {
  return (
    <div className="sp-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Audit Validation & Exception Center
            </h3>
            <p className="text-[11px] text-slate-500">
              Pre-disbursement statutory compliance & data integrity checks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRunAutoFix}
            className="h-7 gap-1 px-2.5 text-[11px] border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
          >
            <RefreshCw className="h-3 w-3 text-indigo-400" />
            Auto-reconcile
          </Button>
          <span className="sp-badge-rose rounded-full px-2.5 py-0.5 text-[10px] font-bold">
            {errors.length} Exceptions
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {errors.map((item) => {
          const isCritical = item.severity === "CRITICAL";

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                isCritical
                  ? "border-rose-500/30 bg-rose-500/[0.02] hover:bg-rose-500/[0.04]"
                  : "border-amber-500/30 bg-amber-500/[0.02] hover:bg-amber-500/[0.04]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isCritical ? (
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.employeeName}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.employeeCode})</span>
                    <span className="text-[10px] text-slate-500">• {item.department}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                        isCritical
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.category.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolve?.(item.id)}
                className="h-7 border-white/10 bg-white/[0.03] text-[11px] font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white self-end sm:self-auto"
              >
                Resolve
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
