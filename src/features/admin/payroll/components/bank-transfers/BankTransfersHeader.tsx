import React from "react";
import {
  Banknote,
  Plus,
  FileCode,
  Send,
  RefreshCw,
  Download,
  History,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BankTransfersHeaderProps {
  onCreateBatch: () => void;
  onGenerateFile: () => void;
  onInitiatePayments: () => void;
  onSyncStatus: () => void;
  onExport: () => void;
  onOpenAudit: () => void;
  isInitiating?: boolean;
  isSyncing?: boolean;
}

export const BankTransfersHeader: React.FC<BankTransfersHeaderProps> = ({
  onCreateBatch,
  onGenerateFile,
  onInitiatePayments,
  onSyncStatus,
  onExport,
  onOpenAudit,
  isInitiating = false,
  isSyncing = false,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-card/80 via-card to-card/90 border border-border/50 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <Banknote className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Bank Transfers
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 tracking-wide uppercase">
                DISBURSEMENT CENTER
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage salary disbursement, NEFT/ACH bank advice payment batches, gateway transfers, and reconciliation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={onSyncStatus}
          disabled={isSyncing}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isSyncing ? "animate-spin" : ""}`} />
          Sync Status
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <Download className="h-3.5 w-3.5 text-emerald-400" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateFile}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <FileCode className="h-3.5 w-3.5 text-purple-400" />
          Bank File
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAudit}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <History className="h-3.5 w-3.5 text-amber-400" />
          Audit Logs
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onCreateBatch}
          className="h-9 px-3.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Batch
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onInitiatePayments}
          disabled={isInitiating}
          className="h-9 px-4 text-xs font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-md shadow-cyan-900/20 gap-1.5"
        >
          <Send className={`h-3.5 w-3.5 ${isInitiating ? "animate-spin" : ""}`} />
          {isInitiating ? "Initiating..." : "Initiate Payments"}
        </Button>
      </div>
    </div>
  );
};
