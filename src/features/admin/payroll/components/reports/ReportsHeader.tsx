import React from "react";
import {
  BarChart3,
  FileText,
  Layers,
  CalendarClock,
  Download,
  Share2,
  History,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportsHeaderProps {
  onGenerateReport: () => void;
  onCustomBuilder: () => void;
  onSchedule: () => void;
  onExport: () => void;
  onShare: () => void;
  onAuditLogs: () => void;
  isGenerating?: boolean;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onGenerateReport,
  onCustomBuilder,
  onSchedule,
  onExport,
  onShare,
  onAuditLogs,
  isGenerating = false,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-card/80 via-card to-card/90 border border-border/50 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Payroll Reports
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/30 tracking-wide uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                ANALYTICS CENTER
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Analyze payroll performance, salary expenses, statutory compliance and financial insights.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={onAuditLogs}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <History className="h-3.5 w-3.5 text-amber-400" />
          Audit Logs
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <Share2 className="h-3.5 w-3.5 text-cyan-400" />
          Share
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
          onClick={onSchedule}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <CalendarClock className="h-3.5 w-3.5 text-blue-400" />
          Schedule
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onCustomBuilder}
          className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
        >
          <Layers className="h-3.5 w-3.5 text-purple-400" />
          Custom Builder
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onGenerateReport}
          disabled={isGenerating}
          className="h-9 px-4 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-900/20 gap-1.5"
        >
          <FileText className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </div>
    </div>
  );
};
