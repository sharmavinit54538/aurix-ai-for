import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Mail, PlusCircle, Sparkles, History } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface PayslipsHeaderProps {
  selectedCount: number;
  onOpenGenerateModal: (isBulk: boolean) => void;
  onOpenBulkEmailModal: () => void;
  onBulkDownload: () => void;
  isDownloadingBulk?: boolean;
}

export const PayslipsHeader: React.FC<PayslipsHeaderProps> = ({
  selectedCount,
  onOpenGenerateModal,
  onOpenBulkEmailModal,
  onBulkDownload,
  isDownloadingBulk = false,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-5 mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Payslip Management
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3 w-3" /> Enterprise HRMS
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Generate, preview, distribute and manage employee payslips securely across all cycles.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Link to="/dashboard/payroll/salary-processing">
          <Button variant="outline" size="sm" className="gap-2 text-xs font-medium h-9">
            <History className="h-4 w-4 text-muted-foreground" />
            Payroll History
          </Button>
        </Link>

        {selectedCount > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDownload}
              disabled={isDownloadingBulk}
              className="gap-2 text-xs font-medium h-9 border-brand/30 bg-brand/5 hover:bg-brand/10 text-brand"
            >
              <Download className="h-4 w-4" />
              {isDownloadingBulk ? "Packaging ZIP..." : `Download PDF (${selectedCount})`}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenBulkEmailModal}
              className="gap-2 text-xs font-medium h-9 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              <Mail className="h-4 w-4" />
              Send Email ({selectedCount})
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenGenerateModal(true)}
          className="gap-2 text-xs font-medium h-9"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          Bulk Generate
        </Button>

        <Button
          size="sm"
          onClick={() => onOpenGenerateModal(false)}
          className="gap-2 text-xs font-medium h-9 shadow-sm bg-gradient-to-r from-brand to-brand/90 hover:from-brand/90 hover:to-brand text-brand-foreground"
        >
          <PlusCircle className="h-4 w-4" />
          Generate Payslip
        </Button>
      </div>
    </div>
  );
};
