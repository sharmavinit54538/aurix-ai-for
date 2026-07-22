import React from "react";
import { PlayCircle, CheckCircle2, RotateCcw, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalaryProcessingSaveBarProps {
  selectedCount: number;
  totalSelectedCost: number;
  onProcessSelected: () => void;
  onApproveSelected: () => void;
  onRecalculateSelected: () => void;
  onClearSelection: () => void;
}

export const SalaryProcessingSaveBar: React.FC<SalaryProcessingSaveBarProps> = ({
  selectedCount,
  totalSelectedCost,
  onProcessSelected,
  onApproveSelected,
  onRecalculateSelected,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="border-t border-white/[0.08] bg-[#0c1322]/95 px-6 py-3.5 backdrop-blur-2xl shadow-2xl">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Stats */}
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/20 text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {selectedCount} Employees Selected
                </span>
                <span className="sp-badge-indigo rounded-full px-2 py-0.5 text-[10px] font-bold">
                  Batch Action
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Estimated Net Payroll: <strong className="text-emerald-400 font-mono">₹{(totalSelectedCost / 100000).toFixed(2)}L</strong>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-9 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Clear Selection
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRecalculateSelected}
              className="h-9 border-white/10 bg-white/[0.03] text-xs text-slate-200 hover:bg-white/[0.08]"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
              Recalculate Batch
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onApproveSelected}
              className="h-9 border border-emerald-500/40 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Approve Selected
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onProcessSelected}
              className="h-9 border border-indigo-500/40 bg-gradient-to-r from-indigo-600 to-blue-600 px-5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500"
            >
              <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
              Process Payout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
