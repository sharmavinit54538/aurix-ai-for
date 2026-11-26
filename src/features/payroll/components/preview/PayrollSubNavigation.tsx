import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PayrollSubNavigation({ runId }: { runId: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <Link
          to="/dashboard/payroll"
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Payroll Dashboard
        </Link>
        <Link
          to="/dashboard/payroll/periods"
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Payroll Periods
        </Link>
        <Link
          to={`/dashboard/payroll/runs/${runId}/processing` as any}
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Processing Status
        </Link>
        <span className="shrink-0 whitespace-nowrap rounded-lg bg-primary/10 px-3 py-1.5 text-[13px] font-semibold text-primary">
          Payroll Preview
        </span>
        <Link
          to={`/dashboard/payroll/runs/${runId}/validation` as any}
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Validation & Issues
        </Link>
        <Link
          to={`/dashboard/payroll/runs/${runId}/approval` as any}
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Review & Approval
        </Link>
        <Link
          to={`/dashboard/payroll/runs/${runId}/finalize` as any}
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Finalization
        </Link>
        <Link
          to="/dashboard/payroll/payslips"
          className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Final Payslips
        </Link>
      </div>

      <Link
        to="/dashboard/payroll"
        className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Payroll Dashboard</span>
      </Link>
    </div>
  );
}