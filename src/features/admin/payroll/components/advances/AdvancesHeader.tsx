import React, { useRef } from "react";
import {
  HandCoins,
  Plus,
  CheckCircle2,
  Download,
  Upload,
  Calendar,
  DollarSign,
  History,
  Zap,
  Layers,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdvancesHeaderProps {
  onCreateClick: () => void;
  onBulkApproveClick: () => void;
  onExportClick: () => void;
  onImportSuccess: () => void;
  onGenerateRecoveryScheduleClick: () => void;
  onAuditLogsClick: () => void;
}

export const AdvancesHeader: React.FC<AdvancesHeaderProps> = ({
  onCreateClick,
  onBulkApproveClick,
  onExportClick,
  onImportSuccess,
  onGenerateRecoveryScheduleClick,
  onAuditLogsClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Parsed salary advance configuration file '${file.name}'`);
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
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
              <HandCoins className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
                Salary Advances
                <span className="env-badge">
                  <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  REVOLVING LIQUIDITY CENTER
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Manage employee salary advances, approvals, repayments and payroll recovery.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Action Toolbar */}
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
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Bulk Approve
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateRecoveryScheduleClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Generate Recovery Schedule
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
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium gap-2 text-xs h-9 shadow-lg shadow-cyan-600/25 border border-cyan-400/30"
          >
            <Plus className="w-4 h-4" />
            Create Advance Request
          </Button>
        </div>
      </div>

      {/* Environmental Metadata */}
      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Financial Year:</span>
          <span className="text-white font-semibold">FY 2026-2027</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Revolving Pool Budget:</span>
          <span className="text-emerald-400 font-bold">₹25.0L Pool (90.2% Avail)</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span>Overall Recovery Progress:</span>
          <span className="text-cyan-400 font-medium">84.5% Recovered</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span>Active Governance:</span>
          <span className="text-purple-400 font-medium">Finance & HR Sign-off Active</span>
        </div>
      </div>
    </div>
  );
};
