import React from "react";
import {
  FileUp,
  Download,
  Calculator,
  Lock,
  Sparkles,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaxHeaderProps {
  onImport: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  onRunTaxCalc: () => void;
  onYearEndProcess: () => void;
  isCalculating?: boolean;
}

export const TaxHeader: React.FC<TaxHeaderProps> = ({
  onImport,
  onExportCsv,
  onExportPdf,
  onRunTaxCalc,
  onYearEndProcess,
  isCalculating = false,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-card/80 via-card to-card/90 border border-border/50 shadow-xl backdrop-blur-xl relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Tax Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 tracking-wide uppercase">
                TAX & TDS COMPLIANCE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage employee tax declarations, deductions, exemptions, TDS calculations and statutory Form 16 compliance.
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
          <FileUp className="h-3.5 w-3.5 text-amber-400" />
          Import Tax Data
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs bg-background/50 hover:bg-background border-border/60 gap-1.5"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              Export Reports
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onExportCsv} className="text-xs gap-2">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
              Export CSV Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPdf} className="text-xs gap-2">
              <Download className="h-3.5 w-3.5 text-rose-500" />
              Export PDF Summary
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="default"
          size="sm"
          onClick={onRunTaxCalc}
          disabled={isCalculating}
          className="h-9 px-3.5 text-xs bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white shadow-md shadow-amber-900/20 gap-1.5"
        >
          <Calculator className={`h-3.5 w-3.5 ${isCalculating ? "animate-spin" : ""}`} />
          {isCalculating ? "Calculating Tax..." : "Run Tax Calculation"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onYearEndProcess}
          className="h-9 px-3 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1.5"
        >
          <Lock className="h-3.5 w-3.5" />
          Year End Processing
        </Button>
      </div>
    </div>
  );
};
