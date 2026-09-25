import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  History,
  Info,
  Layers,
  Lock,
  Printer,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { GlassCard, StatCard, EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollPayslipData,
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
    });
  } catch {
    return String(val);
  }
}

function formatDateTime(val: string | null | undefined): string {
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

// ── Data Masking Helper for Sensitive Financial Information ───────────
function maskAccountNumber(acc?: string | null): string {
  if (!acc) return "—";
  const str = String(acc).trim();
  if (str.length <= 4) return str;
  return `••••••••${str.slice(-4)}`;
}

function maskIdentifier(val?: string | null): string {
  if (!val) return "—";
  const str = String(val).trim();
  if (str.length <= 4) return str;
  return `${str.slice(0, 2)}••••••${str.slice(-2)}`;
}

export function PayrollPayslipPage() {
  const params = useParams({ strict: false }) as {
    runId?: string;
    employeeId?: string;
  };
  const runId = params?.runId?.trim() || "";
  const employeeId = params?.employeeId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  // RBAC Permission Check
  const currentRole = useCurrentRole();
  const isHr = currentRole === "hr_admin";

  // User is authorized to view if HR OR accessing own record
  const currentUserId = ws.user?.id || (ws.user as any)?.employeeId || "";
  const isSelf = Boolean(
    currentUserId &&
      (currentUserId === employeeId ||
        (ws.user as any)?.employee_id === employeeId ||
        (ws.user as any)?.empId === employeeId)
  );

  const canViewThisPayslip =
    isHr ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("payroll.admin") ||
    userPermissions.includes("*") ||
    isSelf;

  // Component State
  const [payslipData, setPayslipData] = useState<PayrollPayslipData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  // ── Data Fetching ───────────────────────────────────────────────────
  const fetchPayslip = useCallback(async () => {
    if (!runId || !employeeId) {
      setIsLoading(false);
      setIsNotFound(true);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setIsNotFound(false);

    try {
      const data = await payrollApi.getPayslip(runId, employeeId);
      if (!data) {
        setIsNotFound(true);
        setPayslipData(null);
      } else {
        setPayslipData(data);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsNotFound(true);
        setApiError(
          "Final payslip record was not found on the backend for this run and employee (404 Not Found)."
        );
      } else if (status === 401 || status === 403) {
        setApiError("You are not authorized to view this employee's payslip.");
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payslip data from the server."
        );
      }
      setPayslipData(null);
    } finally {
      setIsLoading(false);
    }
  }, [runId, employeeId]);

  useEffect(() => {
    fetchPayslip();
  }, [fetchPayslip]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayslip();
    setIsRefreshing(false);
  };

  // ── Print Handler ───────────────────────────────────────────────────
  const handlePrint = () => {
    window.print();
  };

  // ── Document Download Handler ───────────────────────────────────────
  const handleDownloadDocument = async () => {
    if (!runId || !employeeId || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await payrollApi.downloadPayslip(runId, employeeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = `payslip_${employeeId}_${payslipData?.periodName || runId}.pdf`
        .replace(/\s+/g, "_")
        .toLowerCase();
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Payslip document downloaded successfully.");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        toast.info(
          "Backend payslip PDF file endpoint is not available yet. Using the Print action generates a clean official PDF statement.",
          { duration: 5000 }
        );
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to download payslip from backend.";
        toast.error(msg);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Finalization State Evaluation ───────────────────────────────────
  const isFinalized = Boolean(
    payslipData?.isFinalized ||
      String(payslipData?.status).toLowerCase() === "finalized" ||
      String(payslipData?.status).toLowerCase() === "closed" ||
      String(payslipData?.status).toLowerCase() === "locked"
  );

  // ── Permission Guard ────────────────────────────────────────────────
  if (ws.isRestoring) {
    return (
      <div className="space-y-6 py-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!canViewThisPayslip) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <GlassCard className="p-8 text-center border-rose-500/30 bg-rose-500/5">
          <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            You do not have permission to view this employee&apos;s payslip.
            Employees may only view their own payslips, and HR administrators
            require appropriate payroll permissions.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/dashboard/payroll/payslips" as any })}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              My Payslips
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate({ to: "/dashboard" as any })}
            >
              Go to Dashboard
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* ── Embedded Print Stylesheet ───────────────────────────────── */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, nav, aside, footer, .no-print, .print\\:hidden {
            display: none !important;
          }
          .payslip-print-sheet {
            border: 1px solid #000000 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px !important;
            margin: 0 !important;
            max-width: 100% !important;
            font-size: 11pt !important;
          }
          .payslip-print-sheet table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          .payslip-print-sheet th, .payslip-print-sheet td {
            border: 1px solid #cccccc !important;
            padding: 6px 8px !important;
            color: #000000 !important;
          }
          .payslip-print-sheet .bg-muted,
          .payslip-print-sheet .bg-muted\\/30,
          .payslip-print-sheet .bg-background\\/50 {
            background: #f9f9f9 !important;
          }
        }
      `}</style>

      {/* ── Subnav Breadcrumb Workflow Navigation (Screen only) ─────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 text-xs text-muted-foreground print:hidden">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/payroll"
            className="hover:text-foreground transition-colors font-medium"
          >
            Payroll Hub
          </Link>
          <span>/</span>
          {runId ? (
            <>
              <Link
                to="/dashboard/payroll/runs/$runId/finalize"
                params={{ runId }}
                className="hover:text-foreground transition-colors font-medium font-mono"
              >
                Run {runId}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="text-foreground font-semibold">Final Payslip</span>
        </div>

        {/* Workflow Steps Indicator */}
        {runId ? (
          <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
            <Link
              to="/dashboard/payroll/periods"
              className="px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors"
            >
              Step 2: Periods
            </Link>
            <span className="text-border">→</span>
            <Link
              to="/dashboard/payroll/runs/$runId/processing"
              params={{ runId }}
              className="px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors"
            >
              Step 3: Process
            </Link>
            <span className="text-border">→</span>
            <Link
              to="/dashboard/payroll/runs/$runId/preview"
              params={{ runId }}
              className="px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors"
            >
              Step 4: Preview
            </Link>
            <span className="text-border">→</span>
            <Link
              to="/dashboard/payroll/runs/$runId/validation"
              params={{ runId }}
              className="px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors"
            >
              Step 6: Validation
            </Link>
            <span className="text-border">→</span>
            <Link
              to="/dashboard/payroll/runs/$runId/approval"
              params={{ runId }}
              className="px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors"
            >
              Step 7: Approval
            </Link>
            <span className="text-border">→</span>
            <Link
              to="/dashboard/payroll/runs/$runId/finalize"
              params={{ runId }}
              className="px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors"
            >
              Step 8: Finalize
            </Link>
            <span className="text-border">→</span>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
              Step 9: Payslip
            </span>
          </div>
        ) : null}
      </div>

      {/* ── Top Action Header (Screen only) ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (runId) {
                navigate({
                  to: `/dashboard/payroll/runs/${runId}/finalize` as any,
                });
              } else {
                navigate({ to: "/dashboard/payroll/payslips" as any });
              }
            }}
            className="h-9 w-9 p-0"
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight">
                Final Payslip
              </h1>
              {isFinalized ? (
                <Badge
                  variant="outline"
                  className="border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase"
                >
                  <Lock className="h-3 w-3 mr-1 inline-block" />
                  Finalized
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold"
                >
                  {payslipData?.status || "Unfinalized"}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Official salary statement for{" "}
              <strong className="text-foreground">
                {payslipData?.employee?.name || employeeId}
              </strong>{" "}
              · {payslipData?.periodName || runId || "Current Period"}
            </p>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            disabled={isLoading || !payslipData}
            className="text-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Payslip</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadDocument}
            disabled={isLoading || !payslipData || isDownloading}
            className="text-xs gap-1.5"
            style={{ background: "var(--gradient-brand)" }}
          >
            {isDownloading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
          </Button>
        </div>
      </div>

      {/* ── Strict Finalization Eligibility Protection ──────────────── */}
      {!isLoading && payslipData && !isFinalized ? (
        <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="font-semibold text-sm">
            Final Payslip Not Available (Payroll Unfinalized)
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 leading-relaxed">
            Final payslips are official documents issued <strong>only for finalized payroll records</strong>.
            This payroll run is currently in status{" "}
            <Badge variant="outline" className="text-[10px] mx-1">
              {payslipData.status || "Not Finalized"}
            </Badge>
            . To generate and access authoritative final payslips, an authorized administrator must first complete Step 8 (Payroll Finalization).
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: `/dashboard/payroll/runs/${runId}/finalize` as any,
                  })
                }
                className="text-xs gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Go to Step 8: Payroll Finalization</span>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      {/* ── Initial Loading Skeleton ─────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-3 h-4 w-96" />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </GlassCard>
          <div className="grid sm:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-48 w-full" />
            </GlassCard>
            <GlassCard className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-48 w-full" />
            </GlassCard>
          </div>
        </div>
      ) : null}

      {/* ── 404 / Unavailable State ───────────────────────────────────── */}
      {!isLoading && (isNotFound || apiError) && !payslipData ? (
        <GlassCard className="p-8 text-center border-border/80">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-display font-semibold text-foreground">
            Payslip Record Unavailable
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto">
            {apiError ||
              "The requested employee payslip was not found on the backend. This occurs when the run has not completed processing or the employee was not included."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
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
            {runId ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  navigate({
                    to: `/dashboard/payroll/runs/${runId}/finalize` as any,
                  })
                }
                className="gap-1.5 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Finalization</span>
              </Button>
            ) : null}
          </div>
        </GlassCard>
      ) : null}

      {/* ── Authoritative Final Payslip Document Sheet ───────────────── */}
      {!isLoading && payslipData ? (
        <div className="payslip-print-sheet rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8 space-y-6 print:border-black print:p-6 print:shadow-none print:bg-white print:text-black">
          {/* Header & Company Brand */}
          <div className="border-b border-border/80 pb-6 print:border-black">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    OFC
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-foreground tracking-tight">
                      OFC360 HRMS
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Enterprise India Payroll Automation System
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold text-xs uppercase tracking-wider mb-1">
                  FINAL PAYSLIP
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  Ref:{" "}
                  <strong className="text-foreground">
                    {payslipData.payslipNumber || payslipData.referenceNumber || payslipData.id}
                  </strong>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Status:{" "}
                  <span className="font-semibold text-foreground">
                    {payslipData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Subheader: Period & Finalization Information */}
            <div className="mt-4 pt-3 border-t border-dashed border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Payroll Period:
                </span>
                <strong className="text-foreground">
                  {payslipData.periodName || "—"}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Financial Year:
                </span>
                <strong className="text-foreground">
                  {payslipData.financialYear || "—"}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Pay Cycle Dates:
                </span>
                <span className="text-foreground">
                  {formatDate(payslipData.startDate)} – {formatDate(payslipData.endDate)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Finalized On:
                </span>
                <span className="text-foreground">
                  {formatDateTime(payslipData.finalizedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Employee Demographic & Bank Details */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 print:border-black print:bg-transparent">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary print:hidden" />
              Employee Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Employee Name:
                </span>
                <strong className="text-foreground">
                  {payslipData.employee.name}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Employee ID:
                </span>
                <span className="font-mono text-foreground">
                  {payslipData.employee.id}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Department:
                </span>
                <span className="text-foreground">
                  {payslipData.employee.department || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Designation:
                </span>
                <span className="text-foreground">
                  {payslipData.employee.designation || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Work Location:
                </span>
                <span className="text-foreground">
                  {payslipData.employee.location || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Date of Joining:
                </span>
                <span className="text-foreground">
                  {formatDate(payslipData.employee.joiningDate)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  PAN (Masked):
                </span>
                <span className="font-mono text-foreground">
                  {maskIdentifier(payslipData.employee.pan)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  UAN (Masked):
                </span>
                <span className="font-mono text-foreground">
                  {maskIdentifier(payslipData.employee.uan)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  PF Account Number:
                </span>
                <span className="font-mono text-foreground">
                  {payslipData.employee.pfNumber || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  ESI Number:
                </span>
                <span className="font-mono text-foreground">
                  {payslipData.employee.esiNumber || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Bank Name:
                </span>
                <span className="text-foreground">
                  {payslipData.employee.bankInfo?.bankName || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Account Number (Masked):
                </span>
                <span className="font-mono text-foreground">
                  {maskAccountNumber(payslipData.employee.bankInfo?.accountNumber)}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance & Payroll Input Summary */}
          <div className="rounded-xl border border-border/80 bg-muted/10 p-3 print:border-black">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary print:hidden" />
              Attendance & Payroll Inputs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Working Days</span>
                <strong className="text-foreground text-sm">
                  {formatCount(payslipData.attendance.workingDays)}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Paid Days</span>
                <strong className="text-foreground text-sm text-emerald-600 dark:text-emerald-400 print:text-black">
                  {formatCount(payslipData.attendance.paidDays)}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Present</span>
                <span className="text-foreground font-semibold">
                  {formatCount(payslipData.attendance.presentDays)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Leaves</span>
                <span className="text-foreground font-semibold">
                  {formatCount(payslipData.attendance.leaveDays)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Loss of Pay (LOP)</span>
                <strong className="text-rose-600 dark:text-rose-400 print:text-black">
                  {formatCount(payslipData.attendance.lopDays)}
                </strong>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Holidays</span>
                <span className="text-foreground font-semibold">
                  {formatCount(payslipData.attendance.holidays)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Weekly Offs</span>
                <span className="text-foreground font-semibold">
                  {formatCount(payslipData.attendance.weeklyOffs)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50 print:border-black">
                <span className="text-[10px] text-muted-foreground block">Overtime (Hrs)</span>
                <span className="text-foreground font-semibold">
                  {formatCount(payslipData.attendance.overtimeHours)}
                </span>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Tables (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div className="border border-border/80 rounded-xl overflow-hidden print:border-black">
              <div className="bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-2.5 border-b border-border/80 flex items-center justify-between print:bg-gray-100 print:border-black">
                <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                  <TrendingUp className="h-3.5 w-3.5 print:hidden" />
                  Earnings
                </h4>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 print:text-black">
                  Authoritative (INR)
                </span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-border/60 print:divide-black">
                  {payslipData.earnings.basic != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Basic Salary</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.basic)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.hra != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">House Rent Allowance (HRA)</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.hra)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.conveyance != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Conveyance Allowance</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.conveyance)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.specialAllowance != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Special Allowance</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.specialAllowance)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.medicalAllowance != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Medical Allowance</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.medicalAllowance)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.otherAllowances != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Other Allowances</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.otherAllowances)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.overtime != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Overtime Pay</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.overtime)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.bonus != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Bonus / Ex-gratia</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.bonus)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.incentives != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Incentives / Variable</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.incentives)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.arrears != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Salary Arrears</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.arrears)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.reimbursements != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Reimbursements</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.reimbursements)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.earnings.otherEarnings != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">Other Earnings</td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.earnings.otherEarnings)}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
                <tfoot className="bg-muted/40 font-semibold border-t-2 border-border print:bg-gray-100 print:border-black">
                  <tr>
                    <td className="px-4 py-2.5 text-foreground">Gross Earnings</td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-700 dark:text-emerald-400 print:text-black">
                      {formatINR(payslipData.earnings.grossEarnings)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Deductions Column */}
            <div className="border border-border/80 rounded-xl overflow-hidden print:border-black">
              <div className="bg-rose-500/10 dark:bg-rose-500/20 px-4 py-2.5 border-b border-border/80 flex items-center justify-between print:bg-gray-100 print:border-black">
                <h4 className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                  <TrendingDown className="h-3.5 w-3.5 print:hidden" />
                  Deductions
                </h4>
                <span className="text-[10px] text-rose-700 dark:text-rose-400 print:text-black">
                  Authoritative (INR)
                </span>
              </div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-border/60 print:divide-black">
                  {payslipData.deductions.pf != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">
                        Provident Fund (Employee EPF)
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.deductions.pf)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.deductions.esi != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">
                        Employee State Insurance (ESI)
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.deductions.esi)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.deductions.pt != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">
                        Professional Tax (PT)
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.deductions.pt)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.deductions.tds != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">
                        Tax Deducted at Source (TDS / Income Tax)
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.deductions.tds)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.deductions.loan != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">
                        Loan Repayment
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.deductions.loan)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.deductions.advance != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">
                        Salary Advance Recovery
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.deductions.advance)}
                      </td>
                    </tr>
                  ) : null}
                  {payslipData.deductions.otherDeductions != null ? (
                    <tr>
                      <td className="px-4 py-2 text-muted-foreground">
                        Other Deductions
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-foreground">
                        {formatINR(payslipData.deductions.otherDeductions)}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
                <tfoot className="bg-muted/40 font-semibold border-t-2 border-border print:bg-gray-100 print:border-black">
                  <tr>
                    <td className="px-4 py-2.5 text-foreground">Total Deductions</td>
                    <td className="px-4 py-2.5 text-right font-mono text-rose-700 dark:text-rose-400 print:text-black">
                      {formatINR(payslipData.deductions.totalDeductions)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Net Pay Prominent Callout ──────────────────────────────── */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 print:border-black print:bg-gray-100">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground block font-semibold">
                Final Net Salary Disbursable
              </span>
              <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {formatINR(payslipData.netPay)}
              </div>
              {payslipData.netPayInWords ? (
                <div className="text-xs text-muted-foreground mt-0.5 capitalize italic">
                  In words: {payslipData.netPayInWords}
                </div>
              ) : null}
            </div>
            <div className="text-left sm:text-right text-xs text-muted-foreground">
              <div>
                Gross:{" "}
                <strong className="font-mono text-foreground">
                  {formatINR(payslipData.earnings.grossEarnings)}
                </strong>
              </div>
              <div>
                Total Deductions:{" "}
                <strong className="font-mono text-rose-600 dark:text-rose-400 print:text-black">
                  {formatINR(payslipData.deductions.totalDeductions)}
                </strong>
              </div>
              {payslipData.paymentDate ? (
                <div className="mt-1 text-[11px] font-medium text-foreground">
                  Scheduled Credit Date: {formatDate(payslipData.paymentDate)}
                </div>
              ) : null}
            </div>
          </div>

          {/* Employer Statutory Contributions (Separate section) */}
          {payslipData.employerContributions || payslipData.statutory ? (
            <div className="rounded-xl border border-border/80 bg-muted/10 p-4 print:border-black">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary print:hidden" />
                Employer Statutory Contributions (Not Deducted From Pay)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Employer PF Contribution:
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(
                      payslipData.employerContributions?.pf ??
                        payslipData.statutory?.employerPf
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Employer ESI Contribution:
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(
                      payslipData.employerContributions?.esi ??
                        payslipData.statutory?.employerEsi
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Pension Scheme (EPS):
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(
                      payslipData.employerContributions?.eps ??
                        payslipData.statutory?.eps
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    EDLI Contribution:
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(
                      payslipData.employerContributions?.edli ??
                        payslipData.statutory?.edli
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Year-To-Date (YTD) Summary (Gracefully rendered only if provided) */}
          {payslipData.ytd ? (
            <div className="rounded-xl border border-border/80 bg-muted/10 p-4 print:border-black">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-primary print:hidden" />
                Year-to-Date (YTD) Summary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    YTD Gross Earnings:
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(payslipData.ytd.grossEarnings)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    YTD Taxable Income:
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(payslipData.ytd.taxableIncome)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    YTD TDS Deducted:
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(payslipData.ytd.tds)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    YTD Net Salary:
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {formatINR(payslipData.ytd.netPay)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer Official Disclaimers */}
          <div className="pt-4 border-t border-border/80 text-[11px] text-muted-foreground space-y-1 print:border-black">
            <p>
              * This is a computer-generated official final payslip issued by OFC360 Payroll Engine and requires no signature.
            </p>
            <p>
              * Note: Payslip generation seals payroll calculations. Actual salary disbursement is handled during the separate Payment Batch phase.
            </p>
            {payslipData.finalizedByName ? (
              <p>
                Authorized & Finalized by: <strong>{payslipData.finalizedByName}</strong>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PayrollPayslipPage;
