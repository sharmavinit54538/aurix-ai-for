import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCheck, RotateCcw } from "lucide-react";

interface PayrollPageHeaderProps {
  runId: string;
  previewData: any;
  statusTone: any;
  canRunPayroll: boolean;
  onNavigateToValidation: () => void;
  onNavigateToApproval: () => void;
  onRecalculate: () => void;
}

export function PayrollPageHeader({
  runId,
  previewData,
  statusTone,
  canRunPayroll,
  onNavigateToValidation,
  onNavigateToApproval,
  onRecalculate,
}: PayrollPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Payroll Preview
          </h1>
          <Badge
            variant="outline"
            className="font-mono text-[11px] font-medium border-border/80 bg-muted/30"
            title={`Payroll Run Identifier: ${runId}`}
          >
            Run: {runId}
          </Badge>
          {previewData?.status ? (
            <Badge
              variant="outline"
              className={`text-xs font-semibold capitalize ${statusTone.badgeClass}`}
            >
              {statusTone.label}
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Review and audit backend-calculated provisional payroll figures prior to formal review & approval.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToValidation}
          className="h-9 gap-1.5 text-xs shadow-sm text-primary border-primary/30 hover:bg-primary/5"
          title="View validation findings and rule violations"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Validation & Issues</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToApproval}
          className="h-9 gap-1.5 text-xs shadow-sm text-foreground hover:bg-muted/60"
          title="Proceed to Step 7 Review & Approval"
        >
          <UserCheck className="h-3.5 w-3.5 text-primary" />
          <span>Review & Approval</span>
        </Button>

        {canRunPayroll ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRecalculate}
            className="h-9 gap-1.5 text-xs shadow-sm"
            title="Recalculate payroll figures on backend"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Recalculate Payroll</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}