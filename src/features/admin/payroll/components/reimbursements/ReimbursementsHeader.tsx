import React, { useRef } from "react";
import {
  Receipt,
  Plus,
  CheckCheck,
  Download,
  Upload,
  Calendar,
  DollarSign,
  History,
  Building,
  Zap,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReimbursementsHeaderProps {
  onCreateClick: () => void;
  onBulkApproveClick: () => void;
  onExportClick: () => void;
  onImportSuccess: () => void;
  onGeneratePayrollEntriesClick: () => void;
  onAuditLogsClick: () => void;
}

export const ReimbursementsHeader: React.FC<ReimbursementsHeaderProps> = ({
  onCreateClick,
  onBulkApproveClick,
  onExportClick,
  onImportSuccess,
  onGeneratePayrollEntriesClick,
  onAuditLogsClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Parsed reimbursement claims file '${file.name}'`);
    onImportSuccess();
    if (e.target) e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-5 pb-6 border-b border-white/10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,.csv,.xlsx"
        className="hidden"
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Side: Title & Subtitle */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
                Reimbursements
                <span className="env-badge">
                  <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  ADMIN CONTROL CENTER
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Review, approve, process and track employee reimbursement claims.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            Import
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkApproveClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            Bulk Approve
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onGeneratePayrollEntriesClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            Generate Payroll Entries
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAuditLogsClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            Audit Logs
          </Button>

          <Button
            size="sm"
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium gap-2 text-xs h-9 shadow-lg shadow-blue-600/25 border border-blue-400/30"
          >
            <Plus className="w-4 h-4" />
            Create Reimbursement
          </Button>
        </div>
      </div>

      {/* Environmental Context Bar */}
      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Financial Year:</span>
          <span className="text-white font-semibold">FY 2026-2027</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span>Pending Claims:</span>
          <span className="text-amber-400 font-bold font-mono">14 Claims</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Budget Utilization:</span>
          <span className="text-emerald-400 font-medium">62% (₹7.80L Limit)</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span>Processing Status:</span>
          <span className="text-cyan-400 font-medium">Active July Payroll Run</span>
        </div>
      </div>
    </div>
  );
};
