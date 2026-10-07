import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileCheck,
  Layers,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { GlassCard, StatCard, EmptyState, Skeleton } from "@/components/hrms/Shared";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { PayrollPreviewHeaderProps } from "../../types/payrollPreview.types";
import { formatINR } from "../../utils/payrollPreview.utils";
import { useNavigate } from "@tanstack/react-router";

export function PayrollSubNavigation({ runId }: { runId: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
      <div className="flex items-center gap-2">
        <Link
          to="/dashboard/payroll"
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Payroll Dashboard
        </Link>
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
        <span className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
          Payroll Preview
        </span>
        <Link
          to={`/dashboard/payroll/runs/${runId}/validation` as any}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          Validation & Issues
        </Link>
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
        to="/dashboard/payroll"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Payroll Dashboard</span>
      </Link>
    </div>
  );
}

export function PayrollPageHeader({
  runId,
  previewData,
  statusTone,
  canRunPayroll,
  onNavigateToValidation,
  onNavigateToApproval,
  onRecalculate,
}: {
  runId: string;
  previewData: any;
  statusTone: any;
  canRunPayroll: boolean;
  onNavigateToValidation: () => void;
  onNavigateToApproval: () => void;
  onRecalculate: () => void;
}) {

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

export function ProvisionalPayrollNotice() {
  return (
    <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
      <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="ml-2">
        <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
          Provisional Payroll Results
        </AlertTitle>
        <AlertDescription className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          These payroll results are for <strong>review and audit purposes only</strong> and have not been finalized.
          {" "}<strong>Payroll is not finalized, final payslips have not been generated, and employee payment has not been initiated.</strong>
        </AlertDescription>
      </div>
    </Alert>
  );
}

export function PayrollSummaryCards({ previewData }: { previewData: any }) {
  return (
    <section aria-labelledby="preview-summary-heading">
      <h2 id="preview-summary-heading" className="sr-only">
        Payroll Preview Summary
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard
          label="Employees"
          value={formatINR(previewData?.summary?.employeeCount)}
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Gross Payroll"
          value={formatINR(previewData?.summary?.grossPayroll)}
          icon={Banknote}
          accent="muted"
        />
        <StatCard
          label="Total Earnings"
          value={formatINR(previewData?.summary?.totalEarnings ?? previewData?.summary?.grossPayroll)}
          icon={TrendingUp}
          accent="muted"
        />
        <StatCard
          label="Total Deductions"
          value={formatINR(previewData?.summary?.totalDeductions)}
          icon={TrendingDown}
          accent="warning"
        />
        <StatCard
          label="Net Payroll"
          value={formatINR(previewData?.summary?.netPayroll)}
          icon={Banknote}
          accent="success"
        />
        <StatCard
          label="Employer Cost"
          value={formatINR(previewData?.summary?.employerCost)}
          icon={Layers}
          accent="muted"
        />
      </div>
    </section>
  );
}