import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ValidationSubNavigationProps {
  runId: string;
}

export function ValidationSubNavigation({ runId }: ValidationSubNavigationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Link
          to="/dashboard/payroll/periods"
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Payroll Periods
        </Link>
        <Link
          to={`/dashboard/payroll/runs/${runId}/processing` as any}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Processing Status
        </Link>
        <Link
          to={`/dashboard/payroll/runs/${runId}/preview` as any}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Payroll Preview
        </Link>
        <span className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
          Validation & Issues
        </span>
        <Link
          to={`/dashboard/payroll/runs/${runId}/approval` as any}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Review & Approval
        </Link>
        <Link
          to={`/dashboard/payroll/runs/${runId}/finalize` as any}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Finalization
        </Link>
        <Link
          to="/dashboard/payroll/payslips"
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Final Payslips
        </Link>
      </div>

      <Link
        to={`/dashboard/payroll/runs/${runId}/preview` as any}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Payroll Preview</span>
      </Link>
    </div>
  );
}