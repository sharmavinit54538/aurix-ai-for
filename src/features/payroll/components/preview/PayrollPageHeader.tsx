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
            className="font-mono text-xs font-medium border-border bg-muted/40"
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
        <p className="mt-1 text-sm text-muted-foreground">
          Review and audit calculated provisional payroll figures before approval.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToValidation}
          className="h-9 gap-1.5 text-[13px] shadow-xs"
          title="View validation findings and rule violations"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Validation & Issues</span>
        </Button>

        {canRunPayroll ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRecalculate}
            className="h-9 gap-1.5 text-[13px] shadow-xs"
            title="Recalculate payroll figures on backend"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Recalculate Payroll</span>
          </Button>
        ) : null}

        <Button
          size="sm"
          onClick={onNavigateToApproval}
          className="h-9 gap-1.5 text-[13px] shadow-xs"
          title="Proceed to Review & Approval"
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Review & Approval</span>
        </Button>
      </div>
    </div>
  );
}