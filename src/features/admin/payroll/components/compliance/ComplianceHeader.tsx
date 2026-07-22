import React from "react";
import {
  ShieldCheck,
  Play,
  FileSpreadsheet,
  Download,
  FileUp,
  History,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplianceHeaderProps {
  onRunCheck: () => void;
  onGenerateReports: () => void;
  onExport: () => void;
  onImport: () => void;
  onOpenAudit: () => void;
  isRunningCheck?: boolean;
}

export const ComplianceHeader: React.FC<ComplianceHeaderProps> = ({
  onRunCheck,
  onGenerateReports,
  onExport,
  onImport,
  onOpenAudit,
  isRunningCheck = false,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-card/80 via-card to-card/90 border border-border/50 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldCheck className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Payroll Compliance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 tracking-wide uppercase">
                STATUTORY CENTER
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage statutory payroll compliance, tax filings, labor laws, audits, and regulatory reporting.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={onImport}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <FileUp className="h-3.5 w-3.5 text-blue-400" />
          Import
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
          onClick={onGenerateReports}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-purple-400" />
          Reports
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
          onClick={onRunCheck}
          disabled={isRunningCheck}
          className="h-9 px-4 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/20 gap-1.5"
        >
          <Play className={`h-3.5 w-3.5 ${isRunningCheck ? "animate-spin" : ""}`} />
          {isRunningCheck ? "Auditing..." : "Run Compliance Check"}
        </Button>
      </div>
    </div>
  );
};
