import React, { useRef } from "react";
import {
  Timer,
  Plus,
  CheckCircle2,
  Download,
  Upload,
  Calendar,
  RefreshCw,
  History,
  Zap,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OvertimeHeaderProps {
  onCreateClick: () => void;
  onBulkApproveClick: () => void;
  onSyncAttendanceClick: () => void;
  onGeneratePayrollEntriesClick: () => void;
  onExportClick: () => void;
  onImportSuccess: () => void;
  onAuditLogsClick: () => void;
}

export const OvertimeHeader: React.FC<OvertimeHeaderProps> = ({
  onCreateClick,
  onBulkApproveClick,
  onSyncAttendanceClick,
  onGeneratePayrollEntriesClick,
  onExportClick,
  onImportSuccess,
  onAuditLogsClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Parsed overtime configuration file '${file.name}'`);
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
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
                Overtime Management
                <span className="env-badge">
                  <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  WORKFORCE TIME ENGINE
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Manage overtime requests, approvals, compensation rules and payroll integration.
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
            onClick={onSyncAttendanceClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            Sync Attendance
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
            onClick={onGeneratePayrollEntriesClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
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
            Create Overtime Record
          </Button>
        </div>
      </div>

      {/* Environmental Metadata */}
      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Active Pay Cycle:</span>
          <span className="text-white font-semibold">July 2026 Pay Run</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span>Current Week / Month:</span>
          <span className="text-amber-400 font-bold">Week 29 • July 2026</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <Timer className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pending Approvals:</span>
          <span className="text-emerald-400 font-medium">18 Pending Sign-offs</span>
        </div>
      </div>
    </div>
  );
};
