import React, { useRef } from "react";
import {
  Layers,
  Plus,
  Download,
  Upload,
  Copy,
  GitCompare,
  History,
  ShieldCheck,
  Building2,
  Calendar,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SalaryStructureHeaderProps {
  onCreateClick: () => void;
  onCompareClick: () => void;
  onAuditLogsClick: () => void;
  onExportClick: () => void;
  onImportSuccess: (importedData: any) => void;
  onCloneClick: () => void;
}

export const SalaryStructureHeader: React.FC<SalaryStructureHeaderProps> = ({
  onCreateClick,
  onCompareClick,
  onAuditLogsClick,
  onExportClick,
  onImportSuccess,
  onCloneClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        toast.success(`Successfully parsed structure config template '${file.name}'`);
        onImportSuccess(json);
      } catch {
        toast.error("Invalid JSON structure template file.");
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-5 pb-6 border-b border-white/10">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,.csv"
        className="hidden"
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Side: Title & Subtitle */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
                Salary Structure
                <span className="env-badge">
                  <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  LIVE PRODUCTION
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Configure compensation templates, earnings, deductions, employer contributions and salary policies.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Header Actions */}
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
            onClick={onCloneClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            Clone
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onCompareClick}
            className="border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 text-xs h-9"
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-400" />
            Compare Versions
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
            Create Structure
          </Button>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-white/5">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Financial Year:</span>
          <span className="text-white font-semibold">FY 2026-2027</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Company:</span>
          <span className="text-slate-200 font-medium">Aurix Enterprise Corp</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Statutory Engine:</span>
          <span className="text-emerald-400 font-medium">Verified Code on Wages 2026</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span>Active Version:</span>
          <span className="text-blue-400 font-mono font-semibold">v2.4.0</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-slate-500 text-[11px]">
          <span>Last Updated:</span>
          <span className="text-slate-400">Today at 19:50 IST</span>
        </div>
      </div>
    </div>
  );
};
