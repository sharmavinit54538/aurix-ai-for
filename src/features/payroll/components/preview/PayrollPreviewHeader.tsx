import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GlassCard, Skeleton } from "@/components/hrms/Shared";
import { ShieldAlert, RefreshCw, ArrowLeft } from "lucide-react";
import { PayrollSubNavigation } from "./PayrollSubNavigation";
import { PayrollPageHeader } from "./PayrollPageHeader";
import { ProvisionalPayrollNotice } from "./ProvisionalPayrollNotice";
import { PayrollSummaryCards } from "./PayrollSummaryCards";

export function PayrollPreviewHeader({
  runId,
  previewData,
  statusTone,
  loadingPreview,
  isUnavailable,
  apiError,
  canRunPayroll,
  onRefresh,
  onRecalculate,
  onNavigateToValidation,
  onNavigateToApproval,
}: {
  runId: string;
  previewData: any;
  statusTone: any;
  loadingPreview: boolean;
  isUnavailable: boolean;
  apiError: string | null;
  canRunPayroll: boolean;
  onRefresh: () => void;
  onRecalculate: () => void;
  onNavigateToValidation: () => void;
  onNavigateToApproval: () => void;
}) {
  const navigate = useNavigate();

  // Permission Guard - handled at page level

  // Missing or Invalid Run ID State - handled at page level

  // Backend Unavailable / Error State
  if (isUnavailable || apiError) {
    return (
      <div className="space-y-6">
        <PayrollSubNavigation runId={runId} />
        <div className="border-border/80 p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="font-display text-base font-semibold text-foreground">
            {isUnavailable
              ? "Payroll Preview Data Unavailable"
              : "Unable to Load Payroll Preview"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {apiError ||
              "The payroll preview endpoint is currently unavailable or pending deployment on the backend server. Live payroll calculations will render here once available."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={loadingPreview}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingPreview ? "animate-spin" : ""}`} />
              <span>Retry Connection</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate({ to: "/dashboard/payroll" as any })}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Payroll Dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial Loading Skeleton
  if (loadingPreview) {
    return (
      <div className="space-y-6">
        <PayrollSubNavigation runId={runId} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/40 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-3 h-7 w-24" />
            </div>
          ))}
        </div>
        <GlassCard className="p-6">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-4 h-48 w-full" />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PayrollSubNavigation runId={runId} />

      <PayrollPageHeader
        runId={runId}
        previewData={previewData}
        statusTone={statusTone}
        canRunPayroll={canRunPayroll}
        onNavigateToValidation={onNavigateToValidation}
        onNavigateToApproval={onNavigateToApproval}
        onRecalculate={onRecalculate}
      />

      <ProvisionalPayrollNotice />

      <PayrollSummaryCards previewData={previewData} />
    </div>
  );
}