import React from "react";
import {
  Settings,
  Save,
  RotateCcw,
  FileUp,
  Download,
  ShieldCheck,
  Search,
  CheckCircle2,
  Cloud,
  Circle,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayrollSettingsHeaderProps {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onImport: () => void;
  onExport: () => void;
  onOpenAudit: () => void;
  isSaving?: boolean;
}

export const PayrollSettingsHeader: React.FC<PayrollSettingsHeaderProps> = ({
  hasUnsavedChanges,
  onSave,
  onDiscard,
  onImport,
  onExport,
  onOpenAudit,
  isSaving = false,
}) => {
  return (
    <div className="sticky top-0 z-30 -mx-2 px-2">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-r from-[#0c1425]/95 via-[#0f1a2e]/95 to-[#0c1425]/95 p-5 shadow-2xl backdrop-blur-2xl">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/[0.07] blur-[80px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/[0.05] blur-[80px]" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-purple-500/[0.04] blur-[60px]" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Identity */}
          <div className="flex items-center gap-4">
            {/* Large Premium Icon */}
            <div className="glow-pulse relative flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/15 to-blue-500/10 shadow-lg shadow-indigo-500/5">
              <Settings className="h-6 w-6 animate-spin-slow text-indigo-400" />
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-400/10 to-transparent" />
            </div>

            <div className="space-y-1.5">
              {/* Title + Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white/95">
                  Payroll Configuration
                </h1>
                <span className="badge-glow inline-flex items-center gap-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  <Circle className="h-1.5 w-1.5 fill-indigo-400 text-indigo-400" />
                  Config Center
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  <Circle className="h-1.5 w-1.5 fill-emerald-400 text-emerald-400" />
                  Production
                </span>
              </div>

              {/* Subtitle + Status */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Enterprise payroll policies, tax rules & disbursement configuration</span>
                <span className="hidden items-center gap-1 text-[10px] text-slate-500 sm:flex">
                  <Cloud className="h-3 w-3" />
                  Auto-saved
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Import */}
            <Button
              variant="outline"
              size="sm"
              onClick={onImport}
              className="btn-ripple h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
            >
              <FileUp className="h-3.5 w-3.5 text-blue-400" />
              Import
            </Button>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="btn-ripple h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              Export
            </Button>

            {/* Audit Logs */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAudit}
              className="btn-ripple h-9 gap-1.5 border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              Audit Logs
            </Button>

            {/* Divider */}
            <div className="hidden h-6 w-px bg-white/[0.06] lg:block" />

            {/* Discard (shown only when there are changes) */}
            {hasUnsavedChanges && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDiscard}
                className="btn-ripple h-9 gap-1.5 px-3.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Discard
              </Button>
            )}

            {/* Save */}
            <div className="relative">
              <Button
                variant="default"
                size="sm"
                onClick={onSave}
                disabled={!hasUnsavedChanges || isSaving}
                className={`btn-ripple h-9 gap-1.5 px-5 text-xs font-semibold transition-all duration-300 ${
                  hasUnsavedChanges
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/30"
                    : "border border-white/[0.06] bg-white/[0.04] text-slate-500"
                }`}
              >
                {isSaving ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
                {!isSaving && (
                  <span className="kbd-badge ml-1 hidden lg:inline-flex">⌘S</span>
                )}
              </Button>

              {/* Unsaved indicator dot */}
              {hasUnsavedChanges && !isSaving && (
                <span className="unsaved-dot absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-[#0c1425] bg-amber-400 shadow-sm shadow-amber-400/40" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
