import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  Info,
  Layers,
  ListOrdered,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  StopCircle,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { GlassCard, StatCard, EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAurix } from "@/lib/aurix-store";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollRunStatus,
  type PayrollStatus,
  type PayrollRunStep,
} from "@/services/payrollApi";
import { toast } from "sonner";

// ── Conceptual 12-Step India Payroll Pipeline Reference ─────────────────
const CONCEPTUAL_PIPELINE_STEPS: { id: string; name: string; description: string }[] = [
  { id: "employee_data", name: "Employee Data", description: "Active headcount, joining & exit validations" },
  { id: "salary_structure", name: "Salary Structure", description: "Base CTC, HRA, allowances breakdown" },
  { id: "attendance", name: "Attendance", description: "Payable days, LOP & biometric reconciliation" },
  { id: "leave", name: "Leave", description: "Paid leaves, unpaid leaves & sandwich rules" },
  { id: "overtime", name: "Overtime", description: "Approved OT hours & statutory multipliers" },
  { id: "bonus_incentives", name: "Bonus / Incentives", description: "Performance awards & periodic incentives" },
  { id: "loans_advances", name: "Loans / Advances", description: "EMI installments & salary advances recovery" },
  { id: "deductions", name: "Deductions", description: "Voluntary & internal policy deductions" },
  { id: "tax_statutory", name: "Tax / Statutory", description: "PF, ESI, PT, and TDS (Section 192)" },
  { id: "payroll_calculation", name: "Payroll Calculation", description: "Gross earnings and net payable synthesis" },
  { id: "validation", name: "Validation", description: "Cross-checks, negative pay & threshold audits" },
  { id: "provision_payslips", name: "Provision Payslips", description: "Provisional statement generation for audit" },
];

// ── Terminal States where live polling must cease ───────────────────────
const TERMINAL_STATUSES = new Set([
  "completed",
  "provision generated",
  "failed",
  "cancelled",
  "canceled",
  "void",
  "closed",
  "locked",
  "finalized",
  "approved",
]);

function isTerminalStatus(status?: string | null): boolean {
  if (!status) return false;
  return TERMINAL_STATUSES.has(status.toLowerCase().trim());
}

// ── Status Visual Tone ──────────────────────────────────────────────────
function getStatusTone(status: string | null | undefined): {
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
  if (s === "completed" || s === "finalized" || s === "approved") {
    return {
      tone: "success",
      label: status,
      badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "failed" || s.includes("fail") || s.includes("error")) {
    return {
      tone: "danger",
      label: status,
      badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "cancelled" || s === "canceled" || s === "void") {
    return {
      tone: "muted",
      label: status,
      badgeClass: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
    };
  }
  if (s === "provision generated" || s.includes("provision")) {
    return {
      tone: "warning",
      label: status,
      badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  if (s === "validation" || s.includes("validat")) {
    return {
      tone: "warning",
      label: status,
      badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  if (s === "queued" || s.includes("queue") || s === "draft") {
    return {
      tone: "info",
      label: status,
      badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  if (s === "processing" || s.includes("process") || s.includes("running")) {
    return {
      tone: "warning",
      label: status,
      badgeClass: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  }
  return {
    tone: "muted",
    label: status,
    badgeClass: "border-border bg-muted/40 text-foreground",
  };
}

// ── Step Tone Helper ────────────────────────────────────────────────────
function getStepStatusTone(status: string): {
  icon: any;
  color: string;
  badge: string;
} {
  const s = status.toLowerCase();
  if (s === "completed" || s === "success" || s === "done") {
    return {
      icon: CheckCircle2,
      color: "text-emerald-500",
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "in_progress" || s === "running" || s === "processing") {
    return {
      icon: RefreshCw,
      color: "text-blue-500 animate-spin",
      badge: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  }
  if (s === "failed" || s === "error") {
    return {
      icon: XCircle,
      color: "text-rose-500",
      badge: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  return {
    icon: Clock,
    color: "text-muted-foreground/60",
    badge: "border-border bg-muted/30 text-muted-foreground",
  };
}

export function PayrollProcessingPage() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  // RBAC Permission Check
  const normalizedRole = (
    ws.user?.role ||
    (typeof window !== "undefined" ? localStorage.getItem("user_role") : null) ||
    ""
  ).toLowerCase().trim();

  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "super_admin" ||
    normalizedRole === "superadmin" ||
    normalizedRole === "hr_admin" ||
    normalizedRole === "hradmin" ||
    normalizedRole === "hr-admin" ||
    normalizedRole.includes("admin");

  const isHr =
    normalizedRole === "hr" ||
    normalizedRole === "hr_manager" ||
    normalizedRole === "hrmanager" ||
    normalizedRole === "hr_executive" ||
    normalizedRole.includes("hr");

  const canViewPayroll =
    isAdmin ||
    isHr ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*") ||
    !normalizedRole;

  const canRunPayroll =
    isAdmin ||
    isHr ||
    userPermissions.includes("payroll.process") ||
    userPermissions.includes("*");

  // State
  const [runData, setRunData] = useState<PayrollRunStatus | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Retry Modal State
  const [retryModalOpen, setRetryModalOpen] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // In-flight guard ref to prevent duplicate overlapping network requests
  const inFlightRef = useRef<boolean>(false);
  // Keep track of polling interval
  const pollingTimerRef = useRef<number | null>(null);

  // ── Fetch Status Handler ────────────────────────────────────────────
  const fetchStatus = useCallback(
    async (isBackgroundPoll = false) => {
      if (!runId) return;
      if (inFlightRef.current) return;

      inFlightRef.current = true;
      if (!isBackgroundPoll) {
        setIsRefreshing(true);
        setApiError(null);
      }

      try {
        const status = await payrollApi.getPayrollRunStatus(runId);
        setRunData(status);
        setIsUnavailable(false);
        setApiError(null);
      } catch (err: any) {
        // STRICT ZERO MOCK DATA: Do NOT fabricate a fake run or fake progress on error.
        const status = err?.response?.status;
        if (status === 404) {
          setIsUnavailable(true);
          setApiError(
            "Payroll processing service is currently unavailable or the specified run ID was not found on the backend (404 Not Found)."
          );
        } else if (status === 401 || status === 403) {
          setApiError("You are not authorized to view this payroll processing run.");
        } else {
          setApiError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to retrieve live payroll processing status from the server."
          );
        }
      } finally {
        inFlightRef.current = false;
        setLoadingInitial(false);
        setIsRefreshing(false);
      }
    },
    [runId]
  );

  // ── Polling Lifecycle ───────────────────────────────────────────────
  useEffect(() => {
    if (!runId) {
      setLoadingInitial(false);
      return;
    }

    // Initial fetch
    fetchStatus(false);

    // Set up polling interval every 4000ms
    const interval = window.setInterval(() => {
      // Do not poll if the run has reached a terminal state or service is unavailable
      setRunData((current) => {
        if (current && isTerminalStatus(current.status)) {
          if (pollingTimerRef.current) {
            window.clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = null;
          }
          return current;
        }
        // Run poll
        fetchStatus(true);
        return current;
      });
    }, 4000);

    pollingTimerRef.current = interval;

    return () => {
      if (pollingTimerRef.current) {
        window.clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    };
  }, [runId, fetchStatus]);

  // Clean up polling if run reaches terminal state
  useEffect(() => {
    if (runData && isTerminalStatus(runData.status)) {
      if (pollingTimerRef.current) {
        window.clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    }
  }, [runData]);

  // ── Cancel Run Handler ──────────────────────────────────────────────
  const handleConfirmCancel = async () => {
    if (!runId) return;
    setIsCancelling(true);
    try {
      const res = await payrollApi.cancelPayrollRun(runId);
      toast.success(res?.message || "Payroll run cancellation request sent.");
      setCancelModalOpen(false);
      await fetchStatus(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel payroll run on the server.";
      toast.error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  // ── Retry Run Handler ───────────────────────────────────────────────
  const handleConfirmRetry = async () => {
    if (!runId) return;
    setIsRetrying(true);
    try {
      const res = await payrollApi.retryPayrollRun(runId);
      toast.success(
        res?.message || "Payroll calculation retry initiated successfully."
      );
      setRetryModalOpen(false);
      await fetchStatus(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to retry payroll calculation on the server.";
      toast.error(msg);
    } finally {
      setIsRetrying(false);
    }
  };

  // ── Permission Guard ────────────────────────────────────────────────
  if (ws.isRestoring) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!canViewPayroll) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          title="Access Restricted"
          description="You do not have permission to view Payroll Processing runs. Please contact your system administrator for access."
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

  // ── Missing or Invalid Run ID State ─────────────────────────────────
  if (!runId) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <EmptyState
          title="Invalid Payroll Run Identifier"
          description="No payroll run ID was provided in the route parameters. Please start a payroll run from the dashboard or select an existing run."
          icon={AlertCircle}
        />
        <div className="mt-6 flex justify-center gap-3">
          <Button
            size="sm"
            onClick={() => navigate({ to: "/dashboard/payroll" as any })}
            style={{ background: "var(--gradient-brand)" }}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Go to Payroll Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const statusTone = getStatusTone(runData?.status);
  const isCancellable =
    Boolean(
      runData &&
        !isTerminalStatus(runData.status) &&
        canRunPayroll &&
        (runData.status.toLowerCase().includes("queued") ||
          runData.status.toLowerCase().includes("process") ||
          runData.status.toLowerCase().includes("draft"))
    );
  const isRetryable =
    Boolean(
      runData &&
        runData.status?.toLowerCase().includes("fail") &&
        canRunPayroll
    );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Sub-header Navigation Tabs ──────────────────────────────── */}
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
          <span className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
            Processing Run
          </span>
          <Link
            to={`/dashboard/payroll/runs/${runId}/preview` as any}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            Payroll Preview
          </Link>
        </div>

        {/* Back Link */}
        <Link
          to="/dashboard/payroll"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Payroll Dashboard</span>
        </Link>
      </div>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Payroll Processing
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
            {!loadingInitial && runData?.status ? (
              <Badge
                variant="outline"
                className={`text-xs font-semibold capitalize ${statusTone.badgeClass}`}
              >
                {statusTone.label}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Live provisional payroll calculation pipeline and backend execution monitoring.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStatus(false)}
            disabled={isRefreshing || loadingInitial}
            className="h-9 gap-1.5 text-xs shadow-sm"
            title="Fetch latest status from backend"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          {isCancellable ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="h-9 gap-1.5 text-xs border-rose-500/30 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 shadow-sm"
              title="Cancel this payroll calculation run on the backend"
            >
              <StopCircle className="h-3.5 w-3.5" />
              <span>Cancel Run</span>
            </Button>
          ) : null}

          {isRetryable ? (
            <Button
              size="sm"
              onClick={() => setRetryModalOpen(true)}
              className="h-9 gap-1.5 text-xs shadow-sm"
              style={{ background: "var(--gradient-brand)" }}
              title="Retry calculation run on the backend"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Calculation</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── CRITICAL MANDATORY NOTICE: PROVISIONAL PAYROLL ────────────── */}
      <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="ml-2">
          <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            Provisional Payroll Run
          </AlertTitle>
          <AlertDescription className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            Payroll processing produces <strong>provisional calculations</strong> for auditing, statutory compliance, and executive preview.
            {" "}<strong>Payroll processing does NOT finalize payroll or initiate employee payment transfers.</strong>
          </AlertDescription>
        </div>
      </Alert>

      {/* ── Initial Loading Skeleton State ───────────────────────────── */}
      {loadingInitial ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/40 p-4"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-7 w-28" />
              </div>
            ))}
          </div>
          <GlassCard className="p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-6 h-32 w-full" />
          </GlassCard>
        </div>
      ) : null}

      {/* ── Backend Unavailable / Error State ────────────────────────── */}
      {!loadingInitial && (isUnavailable || apiError) ? (
        <GlassCard className="border-border/80 p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-base font-semibold text-foreground">
            {isUnavailable
              ? "Payroll Processing Service Unavailable"
              : "Unable to Retrieve Processing Status"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {apiError ||
              "The payroll processing endpoint is currently unavailable or still pending deployment on the backend server. Live execution status will reflect here once the backend service responds."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchStatus(false)}
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

      {/* ── Live Processing Content (Only when live data is returned) ── */}
      {!loadingInitial && runData && !isUnavailable && !apiError ? (
        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Payroll Period"
              value={runData.periodName || "—"}
              icon={Calendar}
              accent="brand"
              hint={runData.periodId ? `Period ID: ${runData.periodId}` : undefined}
            />

            <StatCard
              label="Status"
              value={
                <div className="flex items-center gap-2">
                  <span className="capitalize">{runData.status || "Unknown"}</span>
                </div>
              }
              icon={Clock}
              accent={
                statusTone.tone === "danger"
                  ? "danger"
                  : statusTone.tone === "success"
                  ? "success"
                  : statusTone.tone === "warning"
                  ? "warning"
                  : "muted"
              }
              hint={
                isTerminalStatus(runData.status)
                  ? "Terminal State"
                  : "Actively monitoring"
              }
            />

            <StatCard
              label="Employees Processed"
              value={
                runData.employees?.total != null
                  ? `${runData.employees.processed ?? 0} / ${runData.employees.total}`
                  : "—"
              }
              icon={Users}
              accent="muted"
              hint={
                runData.employees?.total != null
                  ? `${runData.employees.failed ?? 0} failed / excluded`
                  : "Backend processing count"
              }
            />

            <StatCard
              label="Calculation Progress"
              value={
                typeof runData.progress === "number"
                  ? `${Math.round(runData.progress)}%`
                  : isTerminalStatus(runData.status)
                  ? "Completed"
                  : "In Progress"
              }
              icon={Layers}
              accent={
                statusTone.tone === "success"
                  ? "success"
                  : statusTone.tone === "danger"
                  ? "danger"
                  : "warning"
              }
              hint={
                typeof runData.progress === "number"
                  ? "Reported by backend"
                  : "Indeterminate progress"
              }
            />
          </div>

          {/* ── Prominent Status Area ───────────────────────────────── */}
          <GlassCard className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Operational Status
                  </span>
                  {!isTerminalStatus(runData.status) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-blue-500" />
                      Live polling active
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Polling finished
                    </span>
                  )}
                </div>

                <div className="mt-2 font-display text-xl font-bold tracking-tight text-foreground">
                  {runData.status.toLowerCase() === "queued" && "Payroll run queued"}
                  {runData.status.toLowerCase().includes("process") && "Payroll processing in progress"}
                  {runData.status.toLowerCase().includes("validat") && "Validating payroll"}
                  {(runData.status.toLowerCase().includes("provision") ||
                    runData.status.toLowerCase() === "provision generated") &&
                    "Provision payroll generated"}
                  {runData.status.toLowerCase() === "completed" && "Payroll processing completed"}
                  {(runData.status.toLowerCase().includes("fail") ||
                    runData.status.toLowerCase() === "failed") &&
                    "Payroll processing failed"}
                  {(runData.status.toLowerCase().includes("cancel") ||
                    runData.status.toLowerCase() === "cancelled") &&
                    "Payroll run cancelled"}
                  {![
                    "queued",
                    "process",
                    "validat",
                    "provision",
                    "completed",
                    "fail",
                    "cancel",
                  ].some((k) => runData.status.toLowerCase().includes(k)) &&
                    runData.status}
                </div>

                {/* Current Operation if provided by backend */}
                {runData.currentStep ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Currently processing:{" "}
                    <span className="font-semibold text-foreground">
                      {runData.currentStep}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Processing payroll… Status reported by backend calculation engine.
                  </p>
                )}
              </div>

              {/* Status Indicator / Percent */}
              {typeof runData.progress === "number" ? (
                <div className="text-right">
                  <div className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {Math.round(runData.progress)}%
                  </div>
                  <div className="text-[11px] text-muted-foreground">Completion</div>
                </div>
              ) : null}
            </div>

            {/* Progress Bar: Real number if provided, otherwise Indeterminate pulse */}
            <div className="mt-6">
              {typeof runData.progress === "number" ? (
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(100, Math.max(0, runData.progress))}%`,
                      background:
                        statusTone.tone === "danger"
                          ? "rgb(239 68 68)"
                          : statusTone.tone === "success"
                          ? "rgb(16 185 129)"
                          : "var(--gradient-brand)",
                    }}
                  />
                </div>
              ) : !isTerminalStatus(runData.status) ? (
                /* Indeterminate animated bar — NEVER fake percentage numbers */
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                  <div className="absolute inset-y-0 w-1/3 animate-indeterminate rounded-full bg-primary" />
                </div>
              ) : (
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className={`h-full rounded-full ${
                      statusTone.tone === "success"
                        ? "w-full bg-emerald-500"
                        : statusTone.tone === "danger"
                        ? "w-full bg-rose-500"
                        : "w-full bg-muted-foreground/30"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Backend Error banner if run failed */}
            {runData.error?.message ? (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-800 dark:text-rose-200">
                <div className="flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  <div>
                    <span className="font-semibold">Backend Failure:</span>{" "}
                    {runData.error.message}
                    {runData.error.code ? (
                      <span className="ml-1 font-mono text-[10px] text-rose-600 dark:text-rose-400">
                        ({runData.error.code})
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </GlassCard>

          {/* ── Processing Pipeline (12 Steps) ───────────────────────── */}
          <GlassCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">
                  India Payroll Processing Pipeline
                </h3>
                <p className="text-xs text-muted-foreground">
                  Statutory stages from workforce inputs to provisional payslips generation.
                </p>
              </div>
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Note regarding step granularity */}
            {runData.steps && runData.steps.length > 0 ? (
              /* Backend provides individual step progress */
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {runData.steps.map((step) => {
                  const stepTone = getStepStatusTone(step.status);
                  const Icon = stepTone.icon;
                  return (
                    <div
                      key={step.id}
                      className="flex items-start justify-between gap-2 rounded-xl border border-border bg-background/40 p-3 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${stepTone.color}`} />
                        <div>
                          <div className="font-semibold text-foreground">{step.name}</div>
                          {step.details ? (
                            <div className="mt-0.5 text-[11px] text-muted-foreground">
                              {step.details}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] capitalize ${stepTone.badge}`}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Backend only provides overall status — do NOT invent fake checkmarks */
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span>Pipeline Granularity Note</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    The backend execution engine reports overall progress and run status.
                    Individual step-by-step progress flags are evaluated atomically on the server.
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {CONCEPTUAL_PIPELINE_STEPS.map((step, idx) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card/40 p-2.5 text-xs"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-foreground">{step.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          {/* ── Validation Issues (If reported by backend) ──────────── */}
          {runData.validationIssues && runData.validationIssues.length > 0 ? (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Validation Findings
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Issues flagged by backend calculation engine during validation.
                  </p>
                </div>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="mt-4 space-y-2">
                {runData.validationIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-xs ${
                      issue.severity === "critical"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {issue.severity === "critical" ? (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      )}
                      <div>
                        <span className="font-semibold">
                          {issue.category || "Validation"}:
                        </span>{" "}
                        <span>{issue.message}</span>
                        {issue.employeeName ? (
                          <div className="mt-0.5 text-[11px] opacity-80">
                            Employee: {issue.employeeName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] uppercase"
                    >
                      {issue.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}

          {/* ── Next Workflow Action on Completion ──────────────────── */}
          {runData.status?.toLowerCase() === "completed" ||
          runData.status?.toLowerCase() === "provision generated" ? (
            <GlassCard className="border-emerald-500/30 bg-emerald-500/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Calculation Run Finished</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Provisional calculations are ready. Return to the Payroll Dashboard to review summary figures and audit records.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: `/dashboard/payroll/runs/${runId}/preview` as any,
                      })
                    }
                    style={{ background: "var(--gradient-brand)" }}
                    className="gap-1.5 text-xs shadow-sm"
                  >
                    <span>View Payroll Preview</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate({ to: "/dashboard/payroll" as any })}
                    className="gap-1.5 text-xs shadow-sm"
                  >
                    <span>Payroll Dashboard</span>
                  </Button>
                </div>
              </div>
            </GlassCard>
          ) : null}
        </div>
      ) : null}

      {/* ── Cancellation Confirmation Dialog ────────────────────────── */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base text-rose-600 dark:text-rose-400">
              <StopCircle className="h-4 w-4" />
              Cancel Payroll Processing Run
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm cancellation of the current active payroll calculation job on the server.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Cancelling will abort active calculation workers and mark this run as cancelled.
              Any partial calculations generated will be discarded.
            </p>
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Run Identifier:</span>
                <span className="font-mono font-semibold text-foreground">{runId}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              disabled={isCancelling}
            >
              Keep Running
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Retry Confirmation Dialog ───────────────────────────────── */}
      <Dialog open={retryModalOpen} onOpenChange={setRetryModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base">
              <RotateCcw className="h-4 w-4 text-primary" />
              Retry Payroll Calculation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Trigger a new calculation cycle for this payroll run.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Retrying will re-trigger calculation workers on the backend engine.
            </p>
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Run Identifier:</span>
                <span className="font-mono font-semibold text-foreground">{runId}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRetryModalOpen(false)}
              disabled={isRetrying}
            >
              Dismiss
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRetry}
              disabled={isRetrying}
              style={{ background: "var(--gradient-brand)" }}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Retrying...
                </>
              ) : (
                "Confirm & Retry"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollProcessingPage;
