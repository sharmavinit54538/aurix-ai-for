import { ArrowLeft, FileCheck, Layers, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, UserCheck, Users, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "@tanstack/react-router";
import { GlassCard, StatCard, EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { PayrollValidationSummary } from "@/services/payrollApi";
import { formatDate } from "../../utils/payrollValidation.utils";

export function ValidationSubNavigation({ runId }: { runId: string }) {
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

export function ValidationPageHeader({
  runId,
  validationData,
  statusBadge,
  canRunPayroll,
  onNavigateToPreview,
  onNavigateToApproval,
  onRecalculate,
  onRevalidate,
}: {
  runId: string;
  validationData: PayrollValidationSummary | null;
  statusBadge: { label: string; className: string };
  canRunPayroll: boolean;
  onNavigateToPreview: () => void;
  onNavigateToApproval: () => void;
  onRecalculate: () => void;
  onRevalidate: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToPreview}
          className="h-9 gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Payroll Preview</span>
        </Button>

        <div className="hidden sm:block h-4 w-[1px] bg-border" />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Run:</span>
          <span className="font-mono font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border">
            {runId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToApproval}
          className="h-9 gap-1.5 text-xs text-foreground hover:bg-muted/50"
          title="Proceed to Step 7 Payroll Review & Approval"
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
              disabled={false}
              className="h-9 gap-1.5 text-xs text-foreground hover:bg-muted/50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Recalculate Run</span>
            </Button>

            <Button
              size="sm"
              onClick={onRevalidate}
              disabled={false}
              className="h-9 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5"
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

import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileCheck, RotateCcw, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ValidationPageHeaderProps } from "../types/payrollValidation.types";

export function ProvisionalValidationNotice() {
  return (
    <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
      <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-xs font-semibold tracking-wide uppercase">
        PROVISIONAL PAYROLL AUDIT — Validation & Issues
      </AlertTitle>
      <AlertDescription className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-1">
        Validation issues are generated by the server-side payroll engine to highlight
        inconsistencies, missing statutory numbers, or calculation discrepancies. Reviewing these
        issues does not finalize payroll, generate final payslips, or initiate bank disbursement.
        Salary has <strong>NOT</strong> been paid.
      </AlertDescription>
    </Alert>
  );
}

export function ValidationSummaryCards({
  validationData,
  statusBadge,
}: {
  validationData: PayrollValidationSummary | null;
  statusBadge: { label: string; className: string };
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Total Findings"
        value={validationData?.totalIssues ?? 0}
        hint="Detected validation issues"
        icon={Layers}
        accent="brand"
      />
      <StatCard
        label="Errors / Critical"
        value={validationData?.errorsCount ?? 0}
        hint="Requires remediation"
        icon={XCircle}
        accent="danger"
      />
      <StatCard
        label="Advisory Warnings"
        value={validationData?.warningsCount ?? 0}
        hint="Non-blocking recommendations"
        icon={ShieldAlert}
        accent="warning"
      />
      <StatCard
        label="Employees Affected"
        value={validationData?.affectedEmployeesCount ?? 0}
        hint="Individuals requiring review"
        icon={Users}
        accent="muted"
      />
      <StatCard
        label="Validation Status"
        value={statusBadge?.label ?? "—"}
        hint={
          validationData && validationData.errorsCount > 0
            ? "Remediation required"
            : "Validation cycle completed"
        }
        icon={ShieldCheck}
        accent={validationData && validationData.errorsCount > 0 ? "danger" : "success"}
      />
    </div>
  );
}

import { ShieldCheck, FileCheck, RotateCcw, UserCheck, Layers, XCircle, ShieldAlert, AlertTriangle, Users } from "lucide-react";