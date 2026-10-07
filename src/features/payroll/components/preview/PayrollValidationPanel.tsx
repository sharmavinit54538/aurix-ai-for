import { AlertTriangle, ShieldCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { GlassCard } from "@/components/hrms/Shared";
import type { PayrollPreviewData } from "@/services/payrollApi";
import { getValidationBadge } from "../../utils/payrollPreview.utils";

export function PayrollValidationPanel({
  previewData,
  runId,
  onNavigateToValidation,
}: {
  previewData: PayrollPreviewData | null;
  runId: string;
  onNavigateToValidation: () => void;
}) {
  if (!previewData?.validation ||
    (previewData.validation.errors?.length === 0 && previewData.validation.warnings?.length === 0)) {
    return null;
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm font-semibold">
            Backend Validation Findings
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-[10px]">
            {previewData.validation.errors.length} Errors
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {previewData.validation.warnings.length} Warnings
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToValidation}
            className="h-7 text-xs gap-1 ml-1"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Open Validation Center</span>
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {previewData.validation.errors.map((err) => (
          <div
            key={err.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-900 dark:text-rose-200"
          >
            <div className="flex items-start gap-2">
              <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
              <div>
                <span className="font-semibold">{err.category || "Error"}:</span>{" "}
                <span>{err.message}</span>
                {err.employeeName ? (
                  <div className="text-[10px] opacity-80">
                    Employee: {err.employeeName}
                  </div>
                ) : null}
              </div>
            </div>
            <Badge variant="destructive" className="shrink-0 text-[9px] uppercase">
              Error
            </Badge>
          </div>
        ))}

        {previewData.validation.warnings.map((warn) => (
          <div
            key={warn.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:text-amber-200"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <div>
                <span className="font-semibold">{warn.category || "Warning"}:</span>{" "}
                <span>{warn.message}</span>
                {warn.employeeName ? (
                  <div className="text-[10px] opacity-80">
                    Employee: {warn.employeeName}
                  </div>
                ) : null}
              </div>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 text-[9px] uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300"
            >
              Warning
            </Badge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}