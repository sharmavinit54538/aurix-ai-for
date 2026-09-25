import { useState, useEffect, useCallback } from "react";
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
  FileCheck,
  FileText,
  History,
  Info,
  Layers,
  RefreshCw,
  RotateCcw,
  Scale,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole, canManagePayroll } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollPreviewEmployee,
  type PayrollPreviewData,
} from "@/services/payrollApi";
import { toast } from "sonner";

// ── Currency Formatter (INR) ──────────────────────────────────────────
// STRICT ZERO MOCK DATA: displays purely backend numbers.
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

// ── Status Tone Helper ────────────────────────────────────────────────
function getStatusBadge(status?: string | null): {
  label: string;
  className: string;
} {
  if (!status) {
    return {
      label: "Processed",
      className: "border-border bg-muted/40 text-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "completed" || s === "finalized" || s === "approved" || s === "valid") {
    return {
      label: status,
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "failed" || s.includes("fail") || s.includes("error") || s === "invalid") {
    return {
      label: status,
      className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s.includes("warn") || s.includes("provision")) {
    return {
      label: status,
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    label: status,
    className: "border-border bg-muted/40 text-foreground",
  };
}

export function EmployeePayrollDetailPage() {
  const params = useParams({ strict: false }) as {
    runId?: string;
    employeeId?: string;
  };
  const runId = params?.runId?.trim() || "";
  const employeeId = params?.employeeId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  const currentRole = useCurrentRole();
  const isPayrollAdmin = canManagePayroll(currentRole);

  const canViewPayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canRunPayroll =
    isPayrollAdmin || userPermissions.includes("payroll.process") || userPermissions.includes("*");

  // State
  const [employee, setEmployee] = useState<PayrollPreviewEmployee | null>(null);
  const [runMeta, setRunMeta] = useState<PayrollPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  // Recalculate Modal State
  const [recalculateModalOpen, setRecalculateModalOpen] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // ── Data Fetching ───────────────────────────────────────────────────
  const fetchEmployeePayrollDetail = useCallback(async () => {
    if (!runId || !employeeId) return;
    setIsLoading(true);
    setApiError(null);
    setIsNotFound(false);

    try {
      // 1. Fetch employee specific detail from backend
      const empData = await payrollApi.getRunEmployeeDetail(runId, employeeId);
      if (!empData) {
        setIsNotFound(true);
        setEmployee(null);
      } else {
        setEmployee(empData);
      }

      // 2. Concurrently fetch run metadata if available for period & status
      try {
        const meta = await payrollApi.getPayrollPreview(runId);
        setRunMeta(meta);
      } catch {
        // Non-blocking: retain whatever period name is present on the employee object
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsNotFound(true);
        setApiError(
          "Employee payroll calculation record was not found on the backend for this run (404 Not Found).",
        );
      } else if (status === 401 || status === 403) {
        setApiError("You are not authorized to view this employee's payroll details.");
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load employee payroll detail from the server.",
        );
      }
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  }, [runId, employeeId]);

  useEffect(() => {
    fetchEmployeePayrollDetail();
  }, [fetchEmployeePayrollDetail]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEmployeePayrollDetail();
    setIsRefreshing(false);
  };

  // ── Recalculate Handler ─────────────────────────────────────────────
  const handleConfirmRecalculate = async () => {
    if (!runId) return;
    setIsRecalculating(true);
    try {
      const res = await payrollApi.recalculatePayroll(runId);
      toast.success(res?.message || "Payroll recalculation initiated successfully.");
      setRecalculateModalOpen(false);
      navigate({
        to: `/dashboard/payroll/runs/${runId}/processing` as any,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to trigger payroll recalculation on the backend.";
      toast.error(msg);
    } finally {
      setIsRecalculating(false);
    }
  };

  // ── Permission Guard ────────────────────────────────────────────────
  if (ws.isRestoring) {
    return (
      <div className="space-y-6 py-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!canViewPayroll) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          title="Access Restricted"
          description="You do not have permission to view employee payroll details. Please contact your system administrator for access."
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

  // ── Missing Route Parameters ────────────────────────────────────────
  if (!runId || !employeeId) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <EmptyState
          title="Missing Run or Employee Identifier"
          description="Both the payroll run ID and employee ID must be specified in the route parameters."
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

  // Computed display values
  const periodName = employee?.periodName || runMeta?.periodName || "Current Period";
  const runStatus = employee?.runStatus || runMeta?.status || "Provisional";
  const statusBadgeInfo = getStatusBadge(employee?.status || runStatus);

  // Separate errors and warnings from employee issues
  const employeeErrors = (employee?.issues || []).filter(
    (iss) => iss.severity?.toLowerCase() === "error" || iss.severity?.toLowerCase() === "critical",
  );
  const employeeWarnings = (employee?.issues || []).filter(
    (iss) => iss.severity?.toLowerCase() !== "error" && iss.severity?.toLowerCase() !== "critical",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* ── Top Navigation Bar ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/preview` as any,
              })
            }
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
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/validation` as any,
              })
            }
            className="h-9 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5"
            title="View all validation issues for this payroll run"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Validation Issues</span>
          </Button>

          {canRunPayroll ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRecalculateModalOpen(true)}
              className="h-9 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Recalculate Run</span>
            </Button>
          ) : null}

          <Button
            variant="default"
            size="sm"
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/employees/${employeeId}/payslip` as any,
              })
            }
            className="h-9 gap-1.5 text-xs"
            style={{ background: "var(--gradient-brand)" }}
            title="View official final payslip for this employee"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Final Payslip (Step 9)</span>
          </Button>
        </div>
      </div>

      {/* ── Mandatory Provisional Payroll Warning Notice ─────────────── */}
      <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-xs font-semibold tracking-wide uppercase">
          PROVISIONAL PAYROLL — Pending Final Review & Authorization
        </AlertTitle>
        <AlertDescription className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-1">
          The values displayed on this screen are provisional calculations generated by the payroll
          engine for review and auditing purposes. These values are not final until formal payroll
          approval and finalization. Salary has <strong>NOT</strong> been paid.
        </AlertDescription>
      </Alert>

      {/* ── Loading Skeleton State ───────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-64 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </GlassCard>

          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      ) : isNotFound || !employee ? (
        /* ── Not Found / Unavailable State ───────────────────────────── */
        <GlassCard className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Employee Payroll Detail Unavailable
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {apiError ||
                  `No calculated payroll record was found for employee "${employeeId}" in run "${runId}". The backend may not have calculated payroll for this employee yet or the endpoint is unavailable.`}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchEmployeePayrollDetail}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Connection</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() =>
                  navigate({
                    to: `/dashboard/payroll/runs/${runId}/preview` as any,
                  })
                }
                className="text-xs"
              >
                Return to Payroll Preview
              </Button>
            </div>
          </div>
        </GlassCard>
      ) : (
        /* ── Actual Employee Payroll Detail View ─────────────────────── */
        <div className="space-y-6">
          {/* Page Header Card */}
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
                    {employee.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold uppercase tracking-wider ${statusBadgeInfo.className}`}
                  >
                    {statusBadgeInfo.label}
                  </Badge>
                  {employee.validationStatus && employee.validationStatus !== "valid" ? (
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 text-amber-600 text-xs font-medium"
                    >
                      {employee.validationStatus}
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <div>
                    Employee ID:{" "}
                    <span className="font-mono font-medium text-foreground">
                      {employee.employeeId}
                    </span>
                  </div>
                  <span>•</span>
                  <div>
                    Payroll Period:{" "}
                    <span className="font-medium text-foreground">{periodName}</span>
                  </div>
                  {employee.department ? (
                    <>
                      <span>•</span>
                      <div>
                        Department:{" "}
                        <span className="font-medium text-foreground">{employee.department}</span>
                      </div>
                    </>
                  ) : null}
                  {employee.designation ? (
                    <>
                      <span>•</span>
                      <div>
                        Designation:{" "}
                        <span className="font-medium text-foreground">{employee.designation}</span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Financial Year / Period Pill */}
              <div className="flex flex-col items-start md:items-end gap-1 text-xs">
                <div className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Period:</span>
                  <span className="font-semibold text-foreground">{periodName}</span>
                  {employee.financialYear ? (
                    <span className="text-[10px] text-muted-foreground border-l border-border pl-2">
                      FY {employee.financialYear}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ── Key Metrics Cards (Zero client-side math) ─────────────── */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Gross Earnings"
              value={formatINR(employee.grossEarnings)}
              hint="Total earnings calculated by backend"
              icon={TrendingUp}
              accent="brand"
            />
            <StatCard
              label="Total Deductions"
              value={formatINR(employee.totalDeductions)}
              hint="Statutory & policy deductions"
              icon={TrendingDown}
              accent="warning"
            />
            <StatCard
              label="Net Pay"
              value={formatINR(employee.netPay)}
              hint="Backend calculated net payable"
              icon={Banknote}
              accent="success"
            />
          </div>

          {/* ── Employee Information & Attendance Grid ────────────────── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Employee Metadata Card */}
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <User className="h-4 w-4 text-primary" />
                <h2 className="font-display text-sm font-semibold text-foreground">
                  Employee Information
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Full Name</div>
                  <div className="font-medium text-foreground mt-0.5">{employee.name}</div>
                </div>

                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Employee Code / ID</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {employee.employeeId}
                  </div>
                </div>

                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Department</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.department || "—"}
                  </div>
                </div>

                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Designation</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.designation || "—"}
                  </div>
                </div>

                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Employment Status</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.employmentStatus || "Active"}
                  </div>
                </div>

                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Joining Date</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {formatDate(employee.joiningDate)}
                  </div>
                </div>

                {employee.location ? (
                  <div className="rounded-xl bg-muted/30 p-2.5 col-span-2">
                    <div className="text-[10px] text-muted-foreground">Work Location</div>
                    <div className="font-medium text-foreground mt-0.5">{employee.location}</div>
                  </div>
                ) : null}

                {/* Bank / Payment Info (displayed ONLY if backend provides it) */}
                {employee.bankInfo ? (
                  <div className="rounded-xl border border-border bg-card/60 p-2.5 col-span-2 space-y-1">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                      Payment Account Details (Confidential)
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium text-foreground">
                        {employee.bankInfo.bankName || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-mono text-foreground">
                        {employee.bankInfo.accountNumber || "•••• ••••"}
                      </span>
                    </div>
                    {employee.bankInfo.ifscCode ? (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IFSC:</span>
                        <span className="font-mono text-foreground">
                          {employee.bankInfo.ifscCode}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </GlassCard>

            {/* Attendance & Payable Days Card */}
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Clock className="h-4 w-4 text-primary" />
                <h2 className="font-display text-sm font-semibold text-foreground">
                  Attendance & Payable Days
                </h2>
              </div>

              {employee.attendance ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-muted/30 p-3">
                    <div className="text-[10px] text-muted-foreground">Working Days</div>
                    <div className="mt-1 font-display text-lg font-semibold text-foreground">
                      {employee.attendance.workingDays ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300">
                      Paid Days
                    </div>
                    <div className="mt-1 font-display text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {employee.attendance.paidDays ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3">
                    <div className="text-[10px] text-rose-700 dark:text-rose-300">Unpaid / LOP</div>
                    <div className="mt-1 font-display text-lg font-semibold text-rose-600 dark:text-rose-400">
                      {employee.attendance.unpaidDays ?? employee.attendance.lopDays ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/30 p-3">
                    <div className="text-[10px] text-muted-foreground">Leave Days</div>
                    <div className="mt-1 font-display text-lg font-semibold text-foreground">
                      {employee.attendance.leaveDays ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/30 p-3">
                    <div className="text-[10px] text-muted-foreground">Overtime Hours</div>
                    <div className="mt-1 font-display text-lg font-semibold text-foreground">
                      {employee.attendance.overtimeHours ?? "—"}
                    </div>
                  </div>

                  {employee.attendance.lopDays != null ? (
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">Loss of Pay Days</div>
                      <div className="mt-1 font-display text-lg font-semibold text-rose-600 dark:text-rose-400">
                        {employee.attendance.lopDays}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Attendance metrics were not returned by the backend for this payroll run.
                </div>
              )}
            </GlassCard>
          </div>

          {/* ── Earnings & Deductions Breakdown ───────────────────────── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Earnings Breakdown */}
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    Earnings Breakdown
                  </h2>
                </div>
                <div className="text-right font-mono text-sm font-bold text-foreground">
                  {formatINR(employee.grossEarnings)}
                </div>
              </div>

              {employee.earnings ? (
                <div className="space-y-2 text-xs">
                  {employee.earnings.basic != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Basic Salary</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.basic)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.hra != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.hra)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.specialAllowance != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Special Allowance</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.specialAllowance)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.conveyance != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Conveyance Allowance</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.conveyance)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.overtime != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Overtime Amount</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.overtime)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.bonus != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Bonus</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.bonus)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.incentives != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Incentives</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.incentives)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.allowances != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Other Allowances</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.allowances)}
                      </span>
                    </div>
                  ) : null}

                  {employee.earnings.other != null ? (
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-muted-foreground">Miscellaneous Earnings</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.earnings.other)}
                      </span>
                    </div>
                  ) : null}

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between font-semibold">
                    <span className="text-foreground">Gross Earnings</span>
                    <span className="font-mono text-sm text-foreground">
                      {formatINR(employee.grossEarnings)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  Component-level earnings were not reported by the backend. Aggregated Gross:{" "}
                  <strong className="text-foreground">{formatINR(employee.grossEarnings)}</strong>
                </div>
              )}
            </GlassCard>

            {/* Deductions Breakdown */}
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    Deductions Breakdown
                  </h2>
                </div>
                <div className="text-right font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                  -{formatINR(employee.totalDeductions)}
                </div>
              </div>

              {employee.deductions ? (
                <div className="space-y-2 text-xs">
                  {employee.deductions.pf != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Employee EPF (Provident Fund)</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.deductions.pf)}
                      </span>
                    </div>
                  ) : null}

                  {employee.deductions.esi != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Employee ESI (State Insurance)</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.deductions.esi)}
                      </span>
                    </div>
                  ) : null}

                  {employee.deductions.pt != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Professional Tax (PT)</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.deductions.pt)}
                      </span>
                    </div>
                  ) : null}

                  {employee.deductions.tds != null || employee.deductions.incomeTax != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">TDS / Income Tax (Sec 192)</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.deductions.tds ?? employee.deductions.incomeTax)}
                      </span>
                    </div>
                  ) : null}

                  {employee.deductions.loan != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Loan Deduction</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.deductions.loan)}
                      </span>
                    </div>
                  ) : null}

                  {employee.deductions.advance != null ? (
                    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                      <span className="text-muted-foreground">Salary Advance Recovery</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.deductions.advance)}
                      </span>
                    </div>
                  ) : null}

                  {employee.deductions.other != null ? (
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-muted-foreground">Other Deductions</span>
                      <span className="font-mono font-medium text-foreground">
                        {formatINR(employee.deductions.other)}
                      </span>
                    </div>
                  ) : null}

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between font-semibold">
                    <span className="text-foreground">Total Deductions</span>
                    <span className="font-mono text-sm text-rose-600 dark:text-rose-400">
                      -{formatINR(employee.totalDeductions)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  Component-level deductions were not reported by the backend. Total Deductions:{" "}
                  <strong className="text-foreground">
                    -{formatINR(employee.totalDeductions)}
                  </strong>
                </div>
              )}
            </GlassCard>
          </div>

          {/* ── Statutory Contributions & Employer Cost ───────────────── */}
          {employee.statutory || employee.employerContribution != null ? (
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    Statutory Contributions & Employer Cost
                  </h2>
                </div>
                {employee.employerContribution != null ? (
                  <div className="text-xs text-muted-foreground">
                    Employer Contribution:{" "}
                    <strong className="font-mono text-foreground">
                      {formatINR(employee.employerContribution)}
                    </strong>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                {/* Employee Statutory */}
                <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                  <div className="font-semibold text-foreground">Employee Statutory Deductions</div>
                  <div className="space-y-1">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Employee EPF</span>
                      <span className="font-mono">
                        {formatINR(employee.statutory?.employee?.epf ?? employee.deductions?.pf)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Employee ESI</span>
                      <span className="font-mono">
                        {formatINR(employee.statutory?.employee?.esi ?? employee.deductions?.esi)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Professional Tax</span>
                      <span className="font-mono">
                        {formatINR(employee.statutory?.employee?.pt ?? employee.deductions?.pt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Employer Statutory */}
                <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                  <div className="font-semibold text-foreground">
                    Employer Statutory Contributions
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Employer EPF</span>
                      <span className="font-mono">
                        {formatINR(employee.statutory?.employer?.epf)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Employer ESI</span>
                      <span className="font-mono">
                        {formatINR(employee.statutory?.employer?.esi)}
                      </span>
                    </div>
                    {employee.statutory?.employer?.eps != null ? (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground">EPS (Pension)</span>
                        <span className="font-mono">
                          {formatINR(employee.statutory?.employer?.eps)}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Total Employer Cost</span>
                      <span className="font-mono font-semibold text-foreground">
                        {formatINR(employee.employerContribution)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : null}

          {/* ── Salary Structure & Effective Date (If provided) ───────── */}
          {employee.salaryStructure ? (
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Building2 className="h-4 w-4 text-primary" />
                <h2 className="font-display text-sm font-semibold text-foreground">
                  Applicable Salary Structure
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Structure Name</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {employee.salaryStructure.name || "Default Structure"}
                  </div>
                </div>
                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Effective Date</div>
                  <div className="font-medium text-foreground mt-0.5">
                    {formatDate(employee.salaryStructure.effectiveDate)}
                  </div>
                </div>
                <div className="rounded-xl bg-muted/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Structure Basic</div>
                  <div className="font-mono font-medium text-foreground mt-0.5">
                    {formatINR(employee.salaryStructure.basic)}
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : null}

          {/* ── YTD & Comparison (If provided by backend) ──────────────── */}
          {employee.ytd || employee.previousComparison ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* YTD Information */}
              {employee.ytd ? (
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <History className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-sm font-semibold text-foreground">
                      Year-To-Date (YTD) Summary
                    </h2>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">YTD Gross Earnings:</span>
                      <span className="font-mono">{formatINR(employee.ytd.gross)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">YTD Total Deductions:</span>
                      <span className="font-mono text-rose-600 dark:text-rose-400">
                        {formatINR(employee.ytd.deductions)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">YTD Income Tax (TDS):</span>
                      <span className="font-mono">{formatINR(employee.ytd.tax)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground font-semibold">YTD Net Pay:</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatINR(employee.ytd.netPay)}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ) : null}

              {/* Previous Comparison */}
              {employee.previousComparison ? (
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <History className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-sm font-semibold text-foreground">
                      Previous Run Comparison
                    </h2>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Previous Gross:</span>
                      <span className="font-mono">
                        {formatINR(employee.previousComparison.previousGross)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Current Gross:</span>
                      <span className="font-mono">
                        {formatINR(
                          employee.previousComparison.currentGross ?? employee.grossEarnings,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Previous Net Pay:</span>
                      <span className="font-mono">
                        {formatINR(employee.previousComparison.previousNetPay)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground font-semibold">Current Net Pay:</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatINR(employee.previousComparison.currentNetPay ?? employee.netPay)}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ) : null}
            </div>
          ) : null}

          {/* ── Employee Validation Findings ──────────────────────────── */}
          {employee.issues && employee.issues.length > 0 ? (
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    Validation Findings for this Employee
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {employeeErrors.length > 0 ? (
                    <Badge variant="destructive" className="text-[10px]">
                      {employeeErrors.length} Errors
                    </Badge>
                  ) : null}
                  {employeeWarnings.length > 0 ? (
                    <Badge variant="secondary" className="text-[10px]">
                      {employeeWarnings.length} Warnings
                    </Badge>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: `/dashboard/payroll/runs/${runId}/validation` as any,
                      })
                    }
                    className="h-7 text-xs text-primary border-primary/30 hover:bg-primary/5 gap-1 ml-1"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>All Run Issues (Step 6)</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {employeeErrors.map((err, idx) => (
                  <div
                    key={err.id || idx}
                    className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-900 dark:text-rose-200"
                  >
                    <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <div>
                      <div className="font-semibold">Blocking Issue:</div>
                      <div>{err.message}</div>
                    </div>
                  </div>
                ))}

                {employeeWarnings.map((warn, idx) => (
                  <div
                    key={warn.id || idx}
                    className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <div className="font-semibold">Advisory Warning:</div>
                      <div>{warn.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-4 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No validation findings reported for this employee record.</span>
              </div>
            </GlassCard>
          )}

          {/* ── Audit Metadata Card ───────────────────────────────────── */}
          {employee.audit ? (
            <GlassCard className="p-4 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  Calculation Timestamp:{" "}
                  <strong className="text-foreground">
                    {formatDate(employee.audit.calculatedAt)}
                  </strong>
                </div>
                {employee.audit.version ? (
                  <div>
                    Engine Version:{" "}
                    <strong className="text-foreground font-mono">{employee.audit.version}</strong>
                  </div>
                ) : null}
                {employee.audit.lastRecalculatedAt ? (
                  <div>
                    Last Recalculated:{" "}
                    <strong className="text-foreground">
                      {formatDate(employee.audit.lastRecalculatedAt)}
                    </strong>
                  </div>
                ) : null}
              </div>
            </GlassCard>
          ) : null}
        </div>
      )}

      {/* ── Recalculate Payroll Confirmation Dialog ───────────────────── */}
      <Dialog open={recalculateModalOpen} onOpenChange={setRecalculateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base">
              <RotateCcw className="h-4 w-4 text-primary" />
              Recalculate Payroll Run
            </DialogTitle>
            <DialogDescription className="text-xs">
              Trigger a fresh calculation cycle for this payroll run on the backend engine.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs text-muted-foreground">
            <p>
              Recalculating will re-evaluate attendance, salary components, statutory deductions
              (PF, ESI, TDS), and allowances for all employees in run{" "}
              <strong className="text-foreground font-mono">{runId}</strong>.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRecalculateModalOpen(false)}
              disabled={isRecalculating}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleConfirmRecalculate}
              disabled={isRecalculating}
              className="text-xs gap-1.5"
            >
              {isRecalculating ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              <span>Confirm Recalculate</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeePayrollDetailPage;
