import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  History,
  Layers,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { GlassCard, StatCard, EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollFinalizationData,
  type PayrollStatus,
} from "@/services/payrollApi";
import { toast } from "sonner";

// ── Currency Formatter (INR) ──────────────────────────────────────────
// STRICT ZERO MOCK DATA: operates purely on authentic backend numbers.
function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatDate(val: string | null | undefined): string {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(val);
  }
}

// ── Status Tone Helper ────────────────────────────────────────────────
function getFinalizationStatusTone(status: string | null | undefined, isFinalized?: boolean, isLocked?: boolean): {
  tone: "success" | "warning" | "danger" | "info" | "muted";
  label: string;
  badgeClass: string;
} {
  if (isFinalized || (status && String(status).toLowerCase().includes("final"))) {
    return {
      tone: "muted",
      label: "Finalized",
      badgeClass:
        "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold",
    };
  }
  if (isLocked || (status && String(status).toLowerCase().includes("lock"))) {
    return {
      tone: "muted",
      label: "Locked",
      badgeClass:
        "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 font-semibold",
    };
  }
  if (!status) {
    return {
      tone: "muted",
      label: "Unknown",
      badgeClass: "border-border bg-muted/30 text-muted-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "approved") {
    return {
      tone: "success",
      label: "Approved",
      badgeClass:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "rejected" || s.includes("reject")) {
    return {
      tone: "danger",
      label: "Rejected",
      badgeClass:
        "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s.includes("review") || s.includes("approval")) {
    return {
      tone: "info",
      label: status,
      badgeClass:
        "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  if (s.includes("provision")) {
    return {
      tone: "warning",
      label: status,
      badgeClass:
        "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    tone: "muted",
    label: status,
    badgeClass: "border-border bg-muted/40 text-foreground",
  };
}

export function PayrollFinalizationPage() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  // RBAC Permission Check
  const currentRole = useCurrentRole();
  const isHr = currentRole === "hr_admin";
  const isPayrollAdmin = isHr;

  const canViewPayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canFinalizePayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.finalize") ||
    userPermissions.includes("payroll.admin") ||
    userPermissions.includes("*");

  // State: Finalization Data & API status
  const [finalizationData, setFinalizationData] = useState<PayrollFinalizationData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  // Finalize Confirmation Modal State
  const [finalizeModalOpen, setFinalizeModalOpen] = useState<boolean>(false);
  const [finalizationNotes, setFinalizationNotes] = useState<string>("");
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);

  // Fetch Finalization Data from real backend
  const fetchFinalization = useCallback(
    async (showToast = false) => {
      if (!runId) return;

      try {
        setLoadingData(true);
        setApiError(null);
        setIsUnavailable(false);

        const data = await payrollApi.getPayrollFinalization(runId);
        setFinalizationData(data);

        if (showToast) {
          toast.success("Payroll finalization status refreshed from backend.");
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load payroll finalization data.";

        if (status === 404) {
          setIsUnavailable(true);
          setApiError(
            `Payroll run "${runId}" was not found on the backend (404). Finalization workflow is currently unavailable for this run identifier.`,
          );
        } else {
          setApiError(msg);
        }
        setFinalizationData(null);
      } finally {
        setLoadingData(false);
        setIsRefreshing(false);
      }
    },
    [runId],
  );

  useEffect(() => {
    fetchFinalization();
  }, [fetchFinalization]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchFinalization(true);
  }, [fetchFinalization]);

  // Handle Real Backend Finalization
  const handleConfirmFinalization = async () => {
    if (!runId || isFinalizing) return;

    try {
      setIsFinalizing(true);
      const res = await payrollApi.finalizePayroll(runId, {
        notes: finalizationNotes.trim() || undefined,
        lock: true,
      });

      toast.success(res.message || "Payroll run finalized and locked successfully.");
      setFinalizeModalOpen(false);
      setFinalizationNotes("");

      // Refresh authoritative state from backend
      await fetchFinalization(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to finalize payroll run.";
      toast.error(msg);
    } finally {
      setIsFinalizing(false);
    }
  };

  // State Machine Evaluation
  const statusLower = (finalizationData?.status || "").toLowerCase().trim();
  const isApproved =
    statusLower === "approved" ||
    (finalizationData?.approval?.status || "").toLowerCase() === "approved" ||
    (finalizationData?.approvalStatus || "").toLowerCase() === "approved";

  const isFinalized =
    Boolean(finalizationData?.isFinalized) ||
    statusLower === "finalized" ||
    statusLower === "closed";

  const isLocked =
    Boolean(finalizationData?.isLocked) ||
    statusLower === "locked" ||
    isFinalized;

  const isProcessing = statusLower === "processing";

  const validationErrorsCount = Number(finalizationData?.validation?.errorsCount || 0);
  const validationBlockingCount =
    finalizationData?.validation?.blockingCount != null
      ? Number(finalizationData.validation.blockingCount)
      : validationErrorsCount;
  const hasBlockingErrors = validationBlockingCount > 0;

  // Finalization Eligibility Rules:
  // Must exist, processing complete, validation passed without blocking errors, approved, user authorized, and not already finalized/locked.
  const isEligibleForFinalization =
    isApproved &&
    !hasBlockingErrors &&
    !isProcessing &&
    !isFinalized;

  const canFinalizeNow = canFinalizePayroll && isEligibleForFinalization;

  const statusTone = getFinalizationStatusTone(finalizationData?.status, isFinalized, isLocked);

  // ── Missing Route Parameters ────────────────────────────────────────
  if (!runId) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <EmptyState
          title="Missing Payroll Run Identifier"
          description="No payroll run ID was provided in the route parameters. Please select a payroll run from the dashboard."
          icon={AlertCircle}
        />
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/dashboard/payroll" as any })}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ── Permission Guard ────────────────────────────────────────────────
  if (!canViewPayroll) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          title="Access Restricted"
          description="You do not have permission to view payroll finalization. Please contact your system administrator."
          icon={AlertCircle}
        />
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/dashboard/payroll" as any })}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Payroll Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* ── Top Subnav Breadcrumb Pills ──────────────────────────────── */}
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
          <span className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
            Finalization
          </span>
          <Link
            to="/dashboard/payroll/payslips"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            Final Payslips
          </Link>
        </div>

        {/* Back Link */}
        <Link
          to={`/dashboard/payroll/runs/${runId}/approval` as any}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Review & Approval</span>
        </Link>
      </div>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Payroll Finalization
            </h1>
            {/* Run ID Pill */}
            <Badge
              variant="outline"
              className="font-mono text-[11px] font-medium border-border/80 bg-muted/30"
              title={`Payroll Run Identifier: ${runId}`}
            >
              Run: {runId}
            </Badge>

            {/* Live Status Badge */}
            {!loadingData && finalizationData?.status ? (
              <Badge
                variant="outline"
                className={`text-xs font-semibold capitalize ${statusTone.badgeClass}`}
              >
                {isLocked ? <Lock className="mr-1 h-3 w-3 inline-block" /> : null}
                {statusTone.label}
              </Badge>
            ) : null}

            {/* Approved Badge */}
            {!loadingData && isApproved ? (
              <Badge
                variant="outline"
                className="text-xs font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                Approval: Approved
              </Badge>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {finalizationData?.periodName
              ? `Execute authoritative finalization and lock calculations for ${finalizationData.periodName}.`
              : "Execute authoritative finalization and freeze calculation numbers for this payroll run."}
            {finalizationData?.lastUpdatedAt ? (
              <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                <Clock className="h-3 w-3" />
                Updated {formatDate(finalizationData.lastUpdatedAt)}
              </span>
            ) : null}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/approval` as any,
              })
            }
            className="h-9 gap-1.5 text-xs shadow-sm text-foreground hover:bg-muted/60"
            title="Inspect Step 7 review sign-off"
          >
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <span>Review & Approval</span>
          </Button>

          {/* Finalize Action */}
          {!isFinalized ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setFinalizeModalOpen(true)}
              disabled={!canFinalizeNow || loadingData || isFinalizing}
              className="h-9 gap-1.5 text-xs shadow-sm"
              style={{ background: canFinalizeNow ? "var(--gradient-brand)" : undefined }}
              title={
                !isApproved
                  ? "Payroll must be approved in Step 7 before finalization"
                  : hasBlockingErrors
                    ? "Finalization blocked by validation errors"
                    : isProcessing
                      ? "Calculation is currently processing"
                      : "Finalize and lock this payroll run"
              }
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Finalize Payroll</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                navigate({
                  to: `/dashboard/payroll/runs/${runId}/payment` as any,
                })
              }
              className="h-9 gap-1.5 text-xs shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Banknote className="h-3.5 w-3.5" />
              <span>Step 9: Payment & Disbursement</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── MANDATORY NOTICE: FINALIZATION & PAYMENT SAFETY ───────────── */}
      <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="ml-2">
          <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            PAYROLL FINALIZATION — CRITICAL GOVERNANCE ACTION
          </AlertTitle>
          <AlertDescription className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            Finalization transitions the payroll run to <strong>Final</strong> and freezes all
            computed salary figures. Once finalized, numbers are locked to prevent inadvertent
            tampering or modifications.
            <br />
            <strong>PAYMENT IS SEPARATE:</strong> Finalization does <strong>NOT</strong> execute bank
            transfers, create payment batches, or mark employees as paid. Salary has{" "}
            <strong>NOT</strong> been paid.
          </AlertDescription>
        </div>
      </Alert>

      {/* ── Approval Prerequisite Enforcement Banner ─────────────────── */}
      {!loadingData && !isUnavailable && !isFinalized && !isApproved ? (
        <GlassCard className="border-amber-500/30 bg-amber-500/10 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-sm font-semibold text-amber-950 dark:text-amber-200">
                  Approval Required Prior to Finalization
                </h3>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                  This payroll run has not yet received formal managerial approval. Corporate governance
                  and statutory compliance require that payroll must be formally approved in{" "}
                  <strong>Step 7: Review & Approval</strong> before it can be finalized and locked.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() =>
                navigate({
                  to: `/dashboard/payroll/runs/${runId}/approval` as any,
                })
              }
              className="gap-1.5 text-xs shrink-0"
              style={{ background: "var(--gradient-brand)" }}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Go to Step 7 Approval</span>
            </Button>
          </div>
        </GlassCard>
      ) : null}

      {/* ── Backend Unavailable / Error State ────────────────────────── */}
      {!loadingData && (isUnavailable || apiError) ? (
        <GlassCard className="border-border/80 p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-base font-semibold text-foreground">
            {isUnavailable
              ? "Payroll Finalization Data Unavailable"
              : "Unable to Load Payroll Finalization"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {apiError ||
              "The payroll finalization endpoint is currently unavailable on the backend server. Live payroll finalization state will render here once available."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5 text-xs"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
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
        </GlassCard>
      ) : null}

      {/* ── Initial Loading Skeleton ─────────────────────────────────── */}
      {loadingData ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/40 p-4"
              >
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
      ) : null}

      {/* ── Live Finalization Content ─────────────────────────────────── */}
      {!loadingData && !isUnavailable && !apiError && finalizationData ? (
        <div className="space-y-6">
          {/* ── Finalized & Locked Banner (If already finalized) ───────── */}
          {isFinalized || isLocked ? (
            <GlassCard className="border-violet-500/30 bg-violet-500/10 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm font-semibold text-violet-950 dark:text-violet-200">
                      Payroll Finalized & Locked
                    </h3>
                    <p className="text-xs text-violet-800/90 dark:text-violet-300/90 mt-0.5">
                      This payroll run is authoritative and frozen. All individual employee salary lines,
                      attendance adjustments, and tax calculations are locked against further modification.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-violet-900/80 dark:text-violet-300/80">
                      {finalizationData.finalization?.finalizedByName ||
                      finalizationData.finalization?.finalizedBy ? (
                        <span>
                          <strong>Finalized by:</strong>{" "}
                          {finalizationData.finalization.finalizedByName ||
                            finalizationData.finalization.finalizedBy}
                        </span>
                      ) : null}
                      {finalizationData.finalization?.finalizedAt ? (
                        <span>
                          <strong>Finalized at:</strong>{" "}
                          {formatDate(finalizationData.finalization.finalizedAt)}
                        </span>
                      ) : null}
                      {finalizationData.finalization?.referenceNumber ? (
                        <span>
                          <strong>Ref #:</strong>{" "}
                          <span className="font-mono">
                            {finalizationData.finalization.referenceNumber}
                          </span>
                        </span>
                      ) : null}
                    </div>
                    {finalizationData.finalization?.finalizationNotes ? (
                      <p className="mt-1.5 text-xs text-violet-900/90 dark:text-violet-200/90 italic bg-violet-500/10 p-2 rounded-lg border border-violet-500/20">
                        &ldquo;{finalizationData.finalization.finalizationNotes}&rdquo;
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-violet-500/40 bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold uppercase text-[10px] px-2.5 py-1"
                  >
                    <Lock className="mr-1 h-3 w-3 inline-block" />
                    Locked & Final
                  </Badge>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => navigate({ to: "/dashboard/payroll/payslips" as any })}
                    className="text-xs gap-1.5"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>View Final Payslips (Step 9)</span>
                  </Button>
                </div>
              </div>
            </GlassCard>
          ) : null}

          {/* ── Summary Metric Cards (Backend values only) ─────────────── */}
          <section aria-labelledby="payroll-readiness-totals">
            <h2 id="payroll-readiness-totals" className="sr-only">
              Payroll Readiness & Final Totals
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <StatCard
                label="Employees"
                value={formatCount(finalizationData.summary?.employeeCount)}
                icon={Users}
                accent="brand"
              />
              <StatCard
                label="Gross Payroll"
                value={formatINR(finalizationData.summary?.grossPayroll)}
                icon={Banknote}
                accent="muted"
              />
              <StatCard
                label="Total Earnings"
                value={formatINR(
                  finalizationData.summary?.totalEarnings ?? finalizationData.summary?.grossPayroll,
                )}
                icon={TrendingUp}
                accent="muted"
              />
              <StatCard
                label="Total Deductions"
                value={formatINR(finalizationData.summary?.totalDeductions)}
                icon={TrendingDown}
                accent="warning"
              />
              <StatCard
                label="Net Payroll"
                value={formatINR(finalizationData.summary?.netPayroll)}
                icon={Banknote}
                accent="success"
              />
              <StatCard
                label="Employer Cost"
                value={formatINR(finalizationData.summary?.employerCost)}
                icon={Layers}
                accent="muted"
              />
            </div>
          </section>

          {/* ── Two-Column Layout ──────────────────────────────────────── */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column (2 Cols): Finalization Readiness & Locking Controls */}
            <div className="space-y-6 lg:col-span-2">
              {/* ── Finalization Prerequisites Panel ──────────────────── */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2.5 border-b border-border pb-4">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      Finalization Readiness Check
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Mandatory governance prerequisites evaluated against backend state.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Prerequisite 1: Processing complete */}
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                    {!isProcessing ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>1. Payroll Calculation Engine Completed</span>
                        <Badge
                          variant={!isProcessing ? "outline" : "secondary"}
                          className="text-[9px] px-1.5 py-0 uppercase"
                        >
                          {!isProcessing ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Provisional salary components, gross earnings, and attendance deductions
                        evaluated.
                      </p>
                    </div>
                  </div>

                  {/* Prerequisite 2: Validation complete */}
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                    {!hasBlockingErrors ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>2. Statutory Validation Free of Blocking Errors</span>
                        <Badge
                          variant={!hasBlockingErrors ? "outline" : "destructive"}
                          className="text-[9px] px-1.5 py-0 uppercase"
                        >
                          {!hasBlockingErrors ? "Passed" : "Blocking Errors"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {hasBlockingErrors
                          ? `${validationBlockingCount} blocking error(s) must be remediated in Step 6.`
                          : "Zero blocking errors detected by server compliance rules."}
                      </p>
                    </div>
                  </div>

                  {/* Prerequisite 3: Formally Approved */}
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                    {isApproved || isFinalized ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>3. Management Review & Approval (Step 7)</span>
                        <Badge
                          variant={isApproved || isFinalized ? "outline" : "secondary"}
                          className="text-[9px] px-1.5 py-0 uppercase"
                        >
                          {isApproved || isFinalized ? "Approved" : "Pending Sign-off"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Formal authorization executed by an authorized payroll reviewer/admin.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* ── Lock Specifications Card ──────────────────────────── */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2.5 border-b border-border pb-4">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      Locked State & Safeguards
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Policy enforcement applied once a payroll run transitions to Final.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <div className="font-semibold text-foreground">Recalculation Freeze</div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Server prevents triggering new calculation runs or modifying attendance
                      and CTC components for this cycle.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <div className="font-semibold text-foreground">Authoritative Final Records</div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Finalized net pay and statutory deductions become the permanent records for
                      reporting and downstream banking.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <div className="font-semibold text-foreground">Separate Payment Lifecycle</div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Disbursement batches, NEFT/RTGS generation, and bank payment confirmations
                      belong to the payment phase (Step 9).
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <div className="font-semibold text-foreground">Audit Traceability</div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Finalization timestamp and user ID are recorded in backend audit logs for
                      compliance review.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Column (1 Col): Finalization Actions & Governance */}
            <div className="space-y-6">
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Lock className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Finalization Execution
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span>Target Period:</span>
                    <strong className="text-foreground">
                      {finalizationData.periodName || "—"}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span>Role Authorization:</span>
                    <strong className="text-foreground">
                      {canFinalizePayroll ? "Authorized Administrator" : "View Only"}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span>Eligibility:</span>
                    <strong
                      className={
                        isFinalized
                          ? "text-violet-600 dark:text-violet-400"
                          : canFinalizeNow
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {isFinalized
                        ? "Already Finalized"
                        : !isApproved
                          ? "Approval Required"
                          : hasBlockingErrors
                            ? "Blocked by Errors"
                            : canFinalizeNow
                              ? "Ready to Finalize"
                              : "Not Eligible"}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Lock Behavior:</span>
                    <span className="text-foreground font-mono">Immutable Lock</span>
                  </div>
                </div>

                {/* Finalize Action Button */}
                {!isFinalized ? (
                  <div className="pt-2 space-y-2">
                    <Button
                      size="sm"
                      onClick={() => setFinalizeModalOpen(true)}
                      disabled={!canFinalizeNow || isFinalizing}
                      className="w-full gap-2 text-xs font-semibold"
                      style={{
                        background: canFinalizeNow ? "var(--gradient-brand)" : undefined,
                      }}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Execute Finalization & Lock</span>
                    </Button>

                    {!isApproved ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate({
                            to: `/dashboard/payroll/runs/${runId}/approval` as any,
                          })
                        }
                        className="w-full gap-2 text-xs text-primary hover:bg-primary/5"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Go to Step 7 Approval First</span>
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <div className="pt-2">
                    <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 text-center">
                      <Lock className="h-5 w-5 text-violet-600 dark:text-violet-400 mx-auto mb-1" />
                      <div className="text-xs font-semibold text-violet-950 dark:text-violet-200">
                        Payroll is Final & Locked
                      </div>
                      <p className="text-[11px] text-violet-800/80 dark:text-violet-300/80 mt-0.5">
                        Modification actions are disabled.
                      </p>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Finalization Confirmation Modal ────────────────────────────── */}
      <Dialog open={finalizeModalOpen} onOpenChange={setFinalizeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base text-foreground">
              <Lock className="h-4 w-4 text-primary" />
              Confirm Payroll Finalization
            </DialogTitle>
            <DialogDescription className="text-xs">
              Permanently finalize and lock payroll run{" "}
              <strong className="font-mono text-foreground">{runId}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-semibold text-foreground">
                  {finalizationData?.periodName || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employees:</span>
                <span className="font-semibold text-foreground">
                  {formatCount(finalizationData?.summary?.employeeCount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Net Payroll:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatINR(finalizationData?.summary?.netPayroll)}
                </span>
              </div>
            </div>

            <Alert className="border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-200 py-2">
              <Lock className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <AlertDescription className="text-[11px] leading-relaxed ml-1">
                <strong>Irreversible Operation:</strong> After finalization, this payroll run will
                be locked against recalculation or adjustments.
                <br />
                <strong>Note:</strong> Payment disbursement is not performed by this action.
              </AlertDescription>
            </Alert>

            {/* Optional Notes */}
            <div className="space-y-1.5 pt-1">
              <label className="font-medium text-foreground text-xs">
                Finalization Notes / Audit Reference (Optional)
              </label>
              <Textarea
                placeholder="Enter any audit reference, board sign-off number, or finalization notes..."
                value={finalizationNotes}
                onChange={(e) => setFinalizationNotes(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFinalizeModalOpen(false)}
              disabled={isFinalizing}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleConfirmFinalization}
              disabled={isFinalizing}
              className="text-xs gap-1.5"
              style={{ background: "var(--gradient-brand)" }}
            >
              {isFinalizing ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              <span>{isFinalizing ? "Finalizing..." : "Confirm & Finalize"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollFinalizationPage;
