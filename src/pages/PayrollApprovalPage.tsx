import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  History,
  Info,
  Layers,
  ListChecks,
  Lock,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  X,
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
import { canManagePayroll } from "@/lib/rbac";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollReviewData,
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
function getApprovalStatusTone(status: string | null | undefined): {
  tone: "success" | "warning" | "danger" | "info" | "muted";
  label: string;
  badgeClass: string;
} {
  if (!status) {
    return {
      tone: "muted",
      label: "Unknown",
      badgeClass: "border-border bg-muted/30 text-muted-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "approved" || s === "completed") {
    return {
      tone: "success",
      label: "Approved",
      badgeClass:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "rejected" || s.includes("reject") || s.includes("fail")) {
    return {
      tone: "danger",
      label: "Rejected",
      badgeClass:
        "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "under review" || s === "pending approval" || s.includes("review")) {
    return {
      tone: "info",
      label: status,
      badgeClass:
        "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  if (s === "provision generated" || s.includes("provision")) {
    return {
      tone: "warning",
      label: status,
      badgeClass:
        "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  if (s === "finalized" || s === "closed" || s === "locked") {
    return {
      tone: "muted",
      label: status,
      badgeClass:
        "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    };
  }
  return {
    tone: "muted",
    label: status,
    badgeClass: "border-border bg-muted/40 text-foreground",
  };
}

function getValidationBadge(status?: string | null): {
  label: string;
  className: string;
} {
  if (!status) {
    return {
      label: "Pending",
      className: "border-border bg-muted/40 text-muted-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "passed" || s === "completed" || s === "valid") {
    return {
      label: "Passed",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "failed" || s.includes("fail") || s === "error") {
    return {
      label: "Failed",
      className:
        "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "warning" || s.includes("warn")) {
    return {
      label: "Warning",
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    label: status,
    className: "border-border bg-muted/40 text-foreground",
  };
}

export function PayrollApprovalPage() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  const isPayrollAdmin = canManagePayroll(ws.user?.role);

  const canViewPayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canApprovePayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.approve") ||
    userPermissions.includes("payroll.admin") ||
    userPermissions.includes("*");

  // State: Review Data & API status
  const [reviewData, setReviewData] = useState<PayrollReviewData | null>(null);
  const [loadingReview, setLoadingReview] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  // Approval Modal State
  const [approvalModalOpen, setApprovalModalOpen] = useState<boolean>(false);
  const [approvalComments, setApprovalComments] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);

  // Rejection Modal State
  const [rejectionModalOpen, setRejectionModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [rejectionComments, setRejectionComments] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  // Fetch Review Data from real backend
  const fetchReview = useCallback(
    async (showToast = false) => {
      if (!runId) return;

      try {
        setLoadingReview(true);
        setApiError(null);
        setIsUnavailable(false);

        const data = await payrollApi.getPayrollReview(runId);
        setReviewData(data);

        if (showToast) {
          toast.success("Payroll review data refreshed from backend.");
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load payroll review data.";

        if (status === 404) {
          setIsUnavailable(true);
          setApiError(
            `Payroll run "${runId}" was not found on the backend (404). Approval workflow is currently unavailable for this run identifier.`,
          );
        } else {
          setApiError(msg);
        }
        setReviewData(null);
      } finally {
        setLoadingReview(false);
        setIsRefreshing(false);
      }
    },
    [runId],
  );

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchReview(true);
  }, [fetchReview]);

  // Handle Real Backend Approval
  const handleConfirmApproval = async () => {
    if (!runId || isApproving) return;

    try {
      setIsApproving(true);
      const res = await payrollApi.approvePayroll(runId, {
        comments: approvalComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run approved successfully.");
      setApprovalModalOpen(false);
      setApprovalComments("");

      // Refresh authoritative state from backend
      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to approve payroll run.";
      toast.error(msg);
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Real Backend Rejection
  const handleConfirmRejection = async () => {
    if (!runId || isRejecting) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejecting or sending back payroll.");
      return;
    }

    try {
      setIsRejecting(true);
      const res = await payrollApi.rejectPayroll(runId, {
        reason: rejectionReason.trim(),
        comments: rejectionComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run sent back for correction.");
      setRejectionModalOpen(false);
      setRejectionReason("");
      setRejectionComments("");

      // Refresh authoritative state from backend
      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to return payroll run.";
      toast.error(msg);
    } finally {
      setIsRejecting(false);
    }
  };

  // State Machine Evaluation
  const statusLower = (reviewData?.status || "").toLowerCase().trim();
  const isApproved = statusLower === "approved";
  const isRejected = statusLower === "rejected";
  const isFinalized =
    statusLower === "finalized" ||
    statusLower === "closed" ||
    statusLower === "locked";
  const isProcessing = statusLower === "processing";

  const validationErrorsCount = Number(reviewData?.validation?.errorsCount || 0);
  const validationBlockingCount =
    reviewData?.validation?.blockingCount != null
      ? Number(reviewData.validation.blockingCount)
      : validationErrorsCount;
  const hasBlockingErrors = validationBlockingCount > 0;

  const canApproveNow =
    canApprovePayroll &&
    !isApproved &&
    !isFinalized &&
    !isProcessing &&
    !hasBlockingErrors;

  const canRejectNow =
    canApprovePayroll &&
    !isFinalized &&
    !isProcessing;

  const statusTone = getApprovalStatusTone(reviewData?.status);
  const valBadge = getValidationBadge(reviewData?.validation?.status);

  // Review Checklist Items (Strictly Backend-Driven)
  const checklistItems = useMemo(() => {
    if (!reviewData) return [];

    const isCalcDone = !isProcessing && Boolean(reviewData.summary?.employeeCount);
    const isValDone = Boolean(reviewData.validation?.status);
    const isErrorsResolved = !hasBlockingErrors;
    const isStatutoryAvailable = Boolean(reviewData.summary?.totalDeductions != null);
    const isReadyForApproval = isCalcDone && isValDone && isErrorsResolved && !isFinalized;

    return [
      {
        id: "calc",
        title: "Provisional Calculation Completed",
        description: "Backend calculation engine has evaluated gross, allowances, and attendance.",
        completed: isCalcDone,
        required: true,
      },
      {
        id: "val",
        title: "Validation Cycle Executed",
        description: "Server audit rules ran against compliance, salary structures, and tax parameters.",
        completed: isValDone,
        required: true,
      },
      {
        id: "errors",
        title: "Blocking Validation Errors Resolved",
        description: hasBlockingErrors
          ? `${validationBlockingCount} blocking error(s) must be addressed before approval sign-off.`
          : "Zero blocking errors reported by backend engine.",
        completed: isErrorsResolved,
        required: true,
      },
      {
        id: "statutory",
        title: "Statutory Deductions Available",
        description: "PF, ESI, Professional Tax, and TDS calculations are present in totals.",
        completed: isStatutoryAvailable,
        required: true,
      },
      {
        id: "readiness",
        title: "Governance Approval Eligibility",
        description: isReadyForApproval
          ? "All prerequisites satisfied. Authorized reviewer may execute sign-off."
          : "Prerequisites incomplete or blocked by validation errors.",
        completed: isReadyForApproval,
        required: true,
      },
    ];
  }, [reviewData, isProcessing, hasBlockingErrors, validationBlockingCount, isFinalized]);

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
          description="You do not have permission to view payroll review & approval. Please contact your system administrator."
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
          <span className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
            Review & Approval
          </span>
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

        {/* Back to Preview Link */}
        <Link
          to={`/dashboard/payroll/runs/${runId}/preview` as any}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Payroll Preview</span>
        </Link>
      </div>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Payroll Review & Approval
            </h1>
            {/* Run ID Pill */}
            <Badge
              variant="outline"
              className="font-mono text-[11px] font-medium border-border/80 bg-muted/30"
              title={`Payroll Run Identifier: ${runId}`}
            >
              Run: {runId}
            </Badge>

            {/* Live Approval Status Badge */}
            {!loadingReview && reviewData?.status ? (
              <Badge
                variant="outline"
                className={`text-xs font-semibold capitalize ${statusTone.badgeClass}`}
              >
                {statusTone.label}
              </Badge>
            ) : null}

            {/* Validation Badge */}
            {!loadingReview && reviewData?.validation?.status ? (
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${valBadge.className}`}
              >
                Validation: {valBadge.label}
              </Badge>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {reviewData?.periodName
              ? `Review provisional results and execute sign-off for ${reviewData.periodName}.`
              : "Review actual provisional calculation results, assess validation readiness, and execute sign-off."}
            {reviewData?.lastUpdatedAt ? (
              <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                <Clock className="h-3 w-3" />
                Updated {formatDate(reviewData.lastUpdatedAt)}
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
                to: `/dashboard/payroll/runs/${runId}/validation` as any,
              })
            }
            className="h-9 gap-1.5 text-xs shadow-sm text-primary border-primary/30 hover:bg-primary/5"
            title="Inspect validation issues and audit findings in Step 6"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Validation Center</span>
          </Button>

          {/* Reject / Send Back Action */}
          {canRejectNow ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectionModalOpen(true)}
              disabled={loadingReview || isApproving || isRejecting}
              className="h-9 gap-1.5 text-xs shadow-sm border-rose-500/30 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
              title="Return payroll run for corrections"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span>Send Back / Reject</span>
            </Button>
          ) : null}

          {/* Approve Action */}
          {canApprovePayroll && !isApproved && !isFinalized ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setApprovalModalOpen(true)}
              disabled={!canApproveNow || loadingReview || isApproving || isRejecting}
              className="h-9 gap-1.5 text-xs shadow-sm"
              style={{ background: canApproveNow ? "var(--gradient-brand)" : undefined }}
              title={
                hasBlockingErrors
                  ? "Approval blocked by validation errors"
                  : isProcessing
                    ? "Payroll calculation is still processing"
                    : "Approve this payroll run"
              }
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Approve Payroll</span>
            </Button>
          ) : null}

          {/* Proceed to Finalize Action (When Approved) */}
          {isApproved ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({
                  to: `/dashboard/payroll/runs/${runId}/finalize` as any,
                })
              }
              className="h-9 gap-1.5 text-xs shadow-sm border-violet-500/30 text-violet-600 hover:bg-violet-500/10 dark:text-violet-400"
              title="Proceed to Step 8 Payroll Finalization"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Finalize Payroll (Step 8)</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── MANDATORY NOTICE: PROVISIONAL PAYROLL ─────────────────────── */}
      <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="ml-2">
          <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            PROVISIONAL PAYROLL — UNDER REVIEW & APPROVAL
          </AlertTitle>
          <AlertDescription className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            Payroll has been calculated and is undergoing governance review.{" "}
            <strong>
              Payroll is not final, final payslips have not been issued, and payment has NOT been made.
            </strong>{" "}
            Approving payroll signifies managerial authorization of computed figures; approval does{" "}
            <strong>NOT</strong> trigger bank disbursement or create payment batches.
          </AlertDescription>
        </div>
      </Alert>

      {/* ── Backend Unavailable / Error State ────────────────────────── */}
      {!loadingReview && (isUnavailable || apiError) ? (
        <GlassCard className="border-border/80 p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-base font-semibold text-foreground">
            {isUnavailable
              ? "Payroll Review Data Unavailable"
              : "Unable to Load Payroll Review"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {apiError ||
              "The payroll review endpoint is currently unavailable on the backend server. Live payroll calculation and approval state will render here once available."}
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
      {loadingReview ? (
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

      {/* ── Live Review & Approval Content ────────────────────────────── */}
      {!loadingReview && !isUnavailable && !apiError && reviewData ? (
        <div className="space-y-6">
          {/* ── Approved Confirmation Banner (If already approved) ─────── */}
          {isApproved ? (
            <GlassCard className="border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm font-semibold text-emerald-950 dark:text-emerald-200">
                      Payroll Run Approved
                    </h3>
                    <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-0.5">
                      This payroll run has been formally approved. It is pending subsequent finalization and disbursement workflows.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-emerald-900/80 dark:text-emerald-300/80">
                      {reviewData.approval?.approvedByName || reviewData.approval?.approvedBy ? (
                        <span>
                          <strong>Approved by:</strong>{" "}
                          {reviewData.approval.approvedByName || reviewData.approval.approvedBy}
                        </span>
                      ) : null}
                      {reviewData.approval?.approvedAt ? (
                        <span>
                          <strong>Approved at:</strong> {formatDate(reviewData.approval.approvedAt)}
                        </span>
                      ) : null}
                    </div>
                    {reviewData.approval?.comments ? (
                      <p className="mt-1.5 text-xs text-emerald-900/90 dark:text-emerald-200/90 italic bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        &ldquo;{reviewData.approval.comments}&rdquo;
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold uppercase text-[10px] px-2.5 py-1"
                  >
                    Status: Approved
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: `/dashboard/payroll/runs/${runId}/finalize` as any,
                      })
                    }
                    className="h-8 gap-1.5 text-xs font-semibold"
                    style={{ background: "var(--gradient-brand)" }}
                    title="Proceed to Step 8 Payroll Finalization"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Proceed to Finalization (Step 8)</span>
                  </Button>
                </div>
              </div>
            </GlassCard>
          ) : null}

          {/* ── Rejected Banner (If rejected/sent back) ─────────────────── */}
          {isRejected ? (
            <GlassCard className="border-rose-500/30 bg-rose-500/10 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm font-semibold text-rose-950 dark:text-rose-200">
                      Payroll Run Returned for Correction
                    </h3>
                    <p className="text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5">
                      This payroll run was sent back by the reviewer. Required adjustments must be processed before re-submitting for approval.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-rose-900/80 dark:text-rose-300/80">
                      {reviewData.approval?.rejectedByName || reviewData.approval?.rejectedBy ? (
                        <span>
                          <strong>Returned by:</strong>{" "}
                          {reviewData.approval.rejectedByName || reviewData.approval.rejectedBy}
                        </span>
                      ) : null}
                      {reviewData.approval?.rejectedAt ? (
                        <span>
                          <strong>Returned at:</strong> {formatDate(reviewData.approval.rejectedAt)}
                        </span>
                      ) : null}
                    </div>
                    {reviewData.approval?.rejectionReason ? (
                      <div className="mt-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-xs text-rose-950 dark:text-rose-200">
                        <span className="font-semibold">Reason:</span> {reviewData.approval.rejectionReason}
                        {reviewData.approval.comments ? (
                          <div className="mt-1 text-[11px] opacity-90">
                            Notes: {reviewData.approval.comments}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
                <Badge
                  variant="destructive"
                  className="font-semibold uppercase text-[10px] px-2.5 py-1"
                >
                  Status: Returned
                </Badge>
              </div>
            </GlassCard>
          ) : null}

          {/* ── Summary Metric Cards (Backend values only) ─────────────── */}
          <section aria-labelledby="payroll-summary-heading">
            <h2 id="payroll-summary-heading" className="sr-only">
              Payroll Totals & Summary
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <StatCard
                label="Employees Processed"
                value={formatCount(reviewData.summary?.employeeCount)}
                icon={Users}
                accent="brand"
              />
              <StatCard
                label="Gross Payroll"
                value={formatINR(reviewData.summary?.grossPayroll)}
                icon={Banknote}
                accent="muted"
              />
              <StatCard
                label="Total Earnings"
                value={formatINR(
                  reviewData.summary?.totalEarnings ?? reviewData.summary?.grossPayroll,
                )}
                icon={TrendingUp}
                accent="muted"
              />
              <StatCard
                label="Total Deductions"
                value={formatINR(reviewData.summary?.totalDeductions)}
                icon={TrendingDown}
                accent="warning"
              />
              <StatCard
                label="Net Payroll"
                value={formatINR(reviewData.summary?.netPayroll)}
                icon={Banknote}
                accent="success"
              />
              <StatCard
                label="Employer Cost"
                value={formatINR(reviewData.summary?.employerCost)}
                icon={Layers}
                accent="muted"
              />
            </div>
          </section>

          {/* ── Two-Column Review Layout ───────────────────────────────── */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column (2 Cols): Validation Readiness & Affected Employees */}
            <div className="space-y-6 lg:col-span-2">
              {/* ── Validation Readiness Card ─────────────────────────── */}
              <GlassCard className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        Validation Readiness & Rule Audits
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Backend validation rule verification prior to approval sign-off.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${valBadge.className}`}
                    >
                      {valBadge.label}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: `/dashboard/payroll/runs/${runId}/validation` as any,
                        })
                      }
                      className="h-7 text-xs gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View Step 6</span>
                    </Button>
                  </div>
                </div>

                {/* Validation Stats Row */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                    <div className="text-[11px] text-muted-foreground uppercase font-medium">
                      Total Issues
                    </div>
                    <div className="mt-1 font-display text-xl font-bold">
                      {reviewData.validation?.totalIssues != null
                        ? formatCount(reviewData.validation.totalIssues)
                        : "0"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 uppercase font-medium">
                      Errors
                    </div>
                    <div className="mt-1 font-display text-xl font-bold text-rose-600 dark:text-rose-400">
                      {reviewData.validation?.errorsCount != null
                        ? formatCount(reviewData.validation.errorsCount)
                        : "0"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 uppercase font-medium">
                      Warnings
                    </div>
                    <div className="mt-1 font-display text-xl font-bold text-amber-600 dark:text-amber-400">
                      {reviewData.validation?.warningsCount != null
                        ? formatCount(reviewData.validation.warningsCount)
                        : "0"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                    <div className="text-[11px] text-muted-foreground uppercase font-medium">
                      Affected Emps
                    </div>
                    <div className="mt-1 font-display text-xl font-bold">
                      {reviewData.validation?.affectedEmployeesCount != null
                        ? formatCount(reviewData.validation.affectedEmployeesCount)
                        : "0"}
                    </div>
                  </div>
                </div>

                {/* Blocking Errors Alert */}
                {hasBlockingErrors ? (
                  <Alert variant="destructive" className="mt-4">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle className="text-xs font-bold uppercase tracking-wider">
                      Approval Blocked by Backend Engine
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-xs leading-relaxed">
                      The backend payroll engine reported{" "}
                      <strong>
                        {validationBlockingCount} blocking error(s)
                      </strong>
                      . India statutory compliance and payroll policy mandate that all blocking
                      errors must be resolved in <strong>Step 6 Validation & Issues</strong> before
                      management approval can proceed.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <strong>No Blocking Errors Detected:</strong> Backend validation passed
                      essential statutory threshold checks (PF, ESI, Section 192 TDS, Professional
                      Tax). This run is ready for authorized approval sign-off.
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* ── Employee Payroll Review & Access to Step 4/5 ─────── */}
              <GlassCard className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-2.5">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        Employee Payroll Review
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Inspect individual employee line items calculated by the backend.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: `/dashboard/payroll/runs/${runId}/preview` as any,
                      })
                    }
                    className="h-8 text-xs gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Open Payroll Preview (Step 4)</span>
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reviewers can audit individual employee calculations, attendance metrics,
                    deductions (PF, ESI, PT, TDS), and statutory employer contributions before
                    approving. Individual employee payroll details are inspected in{" "}
                    <strong>Step 5: Employee Payroll Detail</strong>.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">Processed Employees:</span>{" "}
                      <strong className="font-semibold text-foreground">
                        {formatCount(reviewData.summary?.employeeCount)}
                      </strong>
                    </div>

                    <div className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">Average Net Pay:</span>{" "}
                      <strong className="font-semibold text-foreground">
                        {reviewData.summary?.employeeCount && reviewData.summary?.netPayroll
                          ? formatINR(
                              Math.round(
                                reviewData.summary.netPayroll /
                                  reviewData.summary.employeeCount,
                              ),
                            )
                          : "—"}
                      </strong>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: `/dashboard/payroll/runs/${runId}/preview` as any,
                        })
                      }
                      className="h-8 text-xs text-primary hover:text-primary/80 gap-1 ml-auto"
                    >
                      <span>View Employee Table</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {/* ── Audit Trail / History (If provided by backend) ────── */}
              {reviewData.auditLog && reviewData.auditLog.length > 0 ? (
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <History className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      Approval & Governance History
                    </h3>
                  </div>
                  <div className="mt-3 space-y-2">
                    {reviewData.auditLog.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/20 p-2.5 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-foreground">
                            {entry.action}
                          </span>
                          {entry.userName || entry.user ? (
                            <span className="text-muted-foreground ml-2">
                              by {entry.userName || entry.user}
                            </span>
                          ) : null}
                          {entry.comment ? (
                            <div className="text-[11px] text-muted-foreground mt-0.5 italic">
                              &ldquo;{entry.comment}&rdquo;
                            </div>
                          ) : null}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ) : null}
            </div>

            {/* Right Column (1 Col): Review Checklist & Governance Actions */}
            <div className="space-y-6">
              {/* ── Review Checklist Card ─────────────────────────────── */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <ListChecks className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Review Sign-off Checklist
                  </h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Prerequisite checkpoints evaluated in real-time from backend calculation results.
                </p>

                <div className="mt-4 space-y-3">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <span>{item.title}</span>
                          <Badge
                            variant={item.completed ? "outline" : "secondary"}
                            className="text-[9px] px-1.5 py-0 uppercase"
                          >
                            {item.completed ? "Passed" : "Action Required"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* ── Governance Decision Box ───────────────────────────── */}
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Approval Governance
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span>Role Authorization:</span>
                    <strong className="text-foreground">
                      {canApprovePayroll ? "Authorized Approver" : "Review Only"}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span>Eligibility:</span>
                    <strong
                      className={
                        canApproveNow
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {isApproved
                        ? "Already Approved"
                        : hasBlockingErrors
                          ? "Blocked by Errors"
                          : isProcessing
                            ? "Processing"
                            : canApproveNow
                              ? "Eligible for Approval"
                              : "Not Eligible"}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Approval Scope:</span>
                    <span className="text-foreground font-mono">
                      Step 7 (Review Sign-off)
                    </span>
                  </div>
                </div>

                {/* Primary Action Trigger Buttons */}
                {!isApproved && !isFinalized ? (
                  <div className="pt-2 space-y-2">
                    <Button
                      size="sm"
                      onClick={() => setApprovalModalOpen(true)}
                      disabled={!canApproveNow || isApproving || isRejecting}
                      className="w-full gap-2 text-xs font-semibold"
                      style={{
                        background: canApproveNow ? "var(--gradient-brand)" : undefined,
                      }}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Approve Payroll Run</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectionModalOpen(true)}
                      disabled={!canRejectNow || isApproving || isRejecting}
                      className="w-full gap-2 text-xs border-rose-500/30 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>Reject / Send Back</span>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="w-full gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Approval Already Completed</span>
                    </Button>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Approval Confirmation Modal ───────────────────────────────── */}
      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base">
              <ThumbsUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Confirm Payroll Approval
            </DialogTitle>
            <DialogDescription className="text-xs">
              Execute formal management sign-off for payroll run{" "}
              <strong className="font-mono text-foreground">{runId}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-semibold text-foreground">
                  {reviewData?.periodName || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employees:</span>
                <span className="font-semibold text-foreground">
                  {formatCount(reviewData?.summary?.employeeCount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Payroll:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatINR(reviewData?.summary?.netPayroll)}
                </span>
              </div>
            </div>

            <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 py-2">
              <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <AlertDescription className="text-[11px] leading-relaxed ml-1">
                <strong>Important:</strong> Approval verifies that calculations, deductions, and
                validations are authorized. It does <strong>NOT</strong> generate final payslips,
                lock payroll, or initiate bank transfers.
              </AlertDescription>
            </Alert>

            {/* Optional Comments */}
            <div className="space-y-1.5 pt-1">
              <label className="font-medium text-foreground text-xs">
                Reviewer Sign-Off Comments (Optional)
              </label>
              <Textarea
                placeholder="Enter any notes, approval rationale, or sign-off references..."
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApprovalModalOpen(false)}
              disabled={isApproving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleConfirmApproval}
              disabled={isApproving}
              className="text-xs gap-1.5"
              style={{ background: "var(--gradient-brand)" }}
            >
              {isApproving ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ThumbsUp className="h-3.5 w-3.5" />
              )}
              <span>{isApproving ? "Approving..." : "Confirm & Approve"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Rejection / Send Back Modal ────────────────────────────────── */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base text-rose-600 dark:text-rose-400">
              <ThumbsDown className="h-4 w-4" />
              Return Payroll for Correction
            </DialogTitle>
            <DialogDescription className="text-xs">
              Reject or send back payroll run{" "}
              <strong className="font-mono text-foreground">{runId}</strong> to payroll administrators.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground text-xs">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Discrepancy in overtime hours, missing PF adjustment..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground text-xs">
                Detailed Feedback & Required Adjustments (Optional)
              </label>
              <Textarea
                placeholder="Explain the required corrections or adjustments for the payroll processing team..."
                value={rejectionComments}
                onChange={(e) => setRejectionComments(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectionModalOpen(false)}
              disabled={isRejecting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmRejection}
              disabled={isRejecting || !rejectionReason.trim()}
              className="text-xs gap-1.5"
            >
              {isRejecting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ThumbsDown className="h-3.5 w-3.5" />
              )}
              <span>{isRejecting ? "Returning..." : "Send Back Payroll"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollApprovalPage;
