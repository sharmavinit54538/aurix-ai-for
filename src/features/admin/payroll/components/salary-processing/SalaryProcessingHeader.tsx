import React from "react";
import {
  ArrowLeft,
  PlayCircle,
  Eye,
  CheckCircle2,
  RotateCcw,
  FileText,
  Building2,
  ShieldCheck,
  Download,
  MoreHorizontal,
  Cloud,
  Circle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalaryProcessingHeaderProps {
  currentCycle: string;
  payrollStatus: string;
  financialYear: string;
  onRunPayroll: () => void;
  onPreviewPayroll: () => void;
  onApprovePayroll: () => void;
  onRollbackPayroll: () => void;
  onGeneratePayslips: () => void;
  onInitiateBankTransfer: () => void;
  onExport: () => void;
  onOpenAuditLogs: () => void;
  onBack: () => void;
  isProcessing?: boolean;
}

export const SalaryProcessingHeader: React.FC<SalaryProcessingHeaderProps> = ({
  currentCycle,
  payrollStatus,
  financialYear,
  onRunPayroll,
  onPreviewPayroll,
  onApprovePayroll,
  onRollbackPayroll,
  onGeneratePayslips,
  onInitiateBankTransfer,
  onExport,
  onOpenAuditLogs,
  onBack,
  isProcessing = false,
}) => {
  return (
    <div className="space-y-3">
      {/* ── Minimal Back Button ── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-[6px] rounded-md px-2 py-1 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover:text-white" />
          <span>Back to Payroll</span>
        </button>
      </div>

      {/* ── Command Header Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#121a2f] p-5 shadow-2xl backdrop-blur-2xl">
        {/* Glow Blobs */}
        <div className="sp-glow-bg-indigo -right-20 -top-20 h-64 w-64" />
        <div className="sp-glow-bg-emerald -left-20 -bottom-20 h-64 w-64" />

        <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Left: Identity & Badges */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-blue-600/10 shadow-lg shadow-indigo-500/10">
              <PlayCircle className="h-6 w-6 text-indigo-400" />
            </div>

            <div className="space-y-1.5">
              {/* Title & Status Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Salary Processing
                </h1>
                <span className="sp-badge-indigo inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  <Circle className="h-1.5 w-1.5 fill-indigo-400 text-indigo-400" />
                  {currentCycle} Cycle
                </span>
                <span className="sp-badge-emerald inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400" />
                  {payrollStatus}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  {financialYear}
                </span>
              </div>

              {/* Subtitle & Meta */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span>Process, review and approve organization payroll with complete financial visibility.</span>
                <span className="hidden items-center gap-1 text-slate-500 sm:flex">
                  <Building2 className="h-3 w-3" />
                  Aurix AI Enterprise
                </span>
                <span className="hidden items-center gap-1 text-slate-500 sm:flex">
                  <Cloud className="h-3 w-3" />
                  Auto-saved
                </span>
              </div>
            </div>
          </div>

          {/* Right: Premium Top Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviewPayroll}
              className="h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              <Eye className="h-3.5 w-3.5 text-blue-400" />
              Preview Run
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRollbackPayroll}
              className="h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
              Rollback
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onGeneratePayslips}
              className="h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              Payslips
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onInitiateBankTransfer}
              className="h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              Bank Transfer
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAuditLogs}
              className="h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
              Audit Logs
            </Button>

            {/* Primary Run & Approve CTA */}
            <Button
              variant="default"
              size="sm"
              onClick={onRunPayroll}
              disabled={isProcessing}
              className="h-9 gap-1.5 border border-indigo-500/40 bg-gradient-to-r from-indigo-600 to-blue-600 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-blue-500"
            >
              {isProcessing ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <PlayCircle className="h-3.5 w-3.5" />
              )}
              {isProcessing ? "Processing..." : "Run Calculation"}
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onApprovePayroll}
              className="h-9 gap-1.5 border border-emerald-500/40 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve Cycle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
