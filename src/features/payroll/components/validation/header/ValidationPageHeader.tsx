import { ArrowLeft, FileCheck, RotateCcw, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ValidationPageHeaderProps } from "../../../types/payrollValidation.types";

export function ValidationPageHeader({
  runId,
  validationData,
  statusBadge,
  canRunPayroll,
  onNavigateToPreview,
  onNavigateToValidation,
  onNavigateToApproval,
  onRecalculate,
  onRevalidate,
}: ValidationPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Payroll Validation & Issues
          </h1>
          <Badge
            variant="outline"
            className="font-mono text-xs font-medium border-border bg-muted/40"
            title={`Payroll Run Identifier: ${runId}`}
          >
            Run: {runId}
          </Badge>
          {validationData?.status ? (
            <Badge
              variant="outline"
              className={`text-xs font-semibold capitalize ${statusBadge?.className}`}
            >
              {statusBadge?.label}
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Resolve validation errors and review warnings before formal approval.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToPreview}
          className="h-9 gap-1.5 text-[13px] shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Preview</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToApproval}
          className="h-9 gap-1.5 text-[13px] shadow-xs"
          title="Proceed to Review & Approval"
        >
          <UserCheck className="h-3.5 w-3.5 text-primary" />
          <span>Review & Approval</span>
        </Button>

        {canRunPayroll ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onRecalculate}
              className="h-9 gap-1.5 text-[13px] shadow-xs"
              title="Recalculate payroll figures on backend"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Recalculate Run</span>
            </Button>

            <Button
              size="sm"
              onClick={onRevalidate}
              className="h-9 gap-1.5 text-[13px] shadow-xs"
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Revalidate Payroll</span>
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}

