import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Filter,
  Info,
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
  XCircle,
} from "lucide-react";
import { GlassCard, StatCard, EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollPreviewData,
  type PayrollPreviewEmployee,
  type PayrollStatus,
} from "@/services/payrollApi";
import { toast } from "sonner";

// ── Currency Formatter (INR) ──────────────────────────────────────────
// STRICT ZERO MOCK DATA: operates purely on backend numbers, never computes synthetic math.
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

// ── Status Tone Helper ────────────────────────────────────────────────
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
      badgeClass:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "failed" || s.includes("fail") || s.includes("error")) {
    return {
      tone: "danger",
      label: status,
      badgeClass:
        "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
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
  if (s === "under review" || s.includes("review")) {
    return {
      tone: "info",
      label: status,
      badgeClass:
        "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  return {
    tone: "muted",
    label: status,
    badgeClass: "border-border bg-muted/40 text-foreground",
  };
}

function getValidationBadge(status?: string): {
  label: string;
  className: string;
} {
  const s = (status || "valid").toLowerCase();
  if (s === "error" || s === "invalid") {
    return {
      label: "Error",
      className:
        "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "warning" || s === "warn") {
    return {
      label: "Warning",
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    label: "Valid",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
}

export function PayrollPreviewPage() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  // RBAC Permission Check
  const currentRole = useCurrentRole();
  const isAdmin = currentRole === "superadmin";
  const isHr = currentRole === "hr_admin";

  const canViewPayroll =
    isAdmin ||
    isHr ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canRunPayroll =
    isAdmin ||
    isHr ||
    userPermissions.includes("payroll.process") ||
    userPermissions.includes("*");

  // State: Preview Data & Status
  const [previewData, setPreviewData] = useState<PayrollPreviewData | null>(null);
  const [employees, setEmployees] = useState<PayrollPreviewEmployee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Table Filters & Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedValidation, setSelectedValidation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Selected Employee Detail (Slide-over Sheet)
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollPreviewEmployee | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Loading & Error States
  const [loadingPreview, setLoadingPreview] = useState<boolean>(true);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  // Recalculate Dialog State
  const [recalculateModalOpen, setRecalculateModalOpen] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // ── 1. Fetch Preview Summary & Metadata ─────────────────────────────
  const fetchPreviewSummary = useCallback(async () => {
    if (!runId) return;
    setLoadingPreview(true);
    try {
      const data = await payrollApi.getPayrollPreview(runId);
      setPreviewData(data);
      setIsUnavailable(false);
      setApiError(null);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsUnavailable(true);
        setApiError(
          "Payroll preview data is currently unavailable on the backend server or pending calculation (404 Not Found)."
        );
      } else if (status === 401 || status === 403) {
        setApiError("You are not authorized to view this payroll preview.");
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll preview from the server."
        );
      }
      setPreviewData(null);
    } finally {
      setLoadingPreview(false);
    }
  }, [runId]);

  // ── 2. Fetch Employee Payroll Records (Server-side paginated/filtered)
  const fetchEmployeesList = useCallback(async () => {
    if (!runId) return;
    setLoadingEmployees(true);
    try {
      const res = await payrollApi.getRunEmployees(runId, {
        page: currentPage,
        limit: pageSize,
        search: searchQuery.trim() || undefined,
        department: selectedDept !== "all" ? selectedDept : undefined,
        validationStatus: selectedValidation !== "all" ? selectedValidation : undefined,
        sortBy,
        sortDir,
      });

      setEmployees(res.items || []);
      setTotalEmployees(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      // In accordance with zero-mock-data rule: Do NOT synthesize fake rows on failure.
      setEmployees([]);
      setTotalEmployees(0);
      setTotalPages(1);
    } finally {
      setLoadingEmployees(false);
    }
  }, [
    runId,
    currentPage,
    pageSize,
    searchQuery,
    selectedDept,
    selectedValidation,
    sortBy,
    sortDir,
  ]);

  // Initial load
  useEffect(() => {
    if (!runId) {
      setLoadingPreview(false);
      setLoadingEmployees(false);
      return;
    }
    fetchPreviewSummary();
  }, [runId, fetchPreviewSummary]);

  // Load employees when filters/pagination change
  useEffect(() => {
    if (runId && !isUnavailable) {
      fetchEmployeesList();
    }
  }, [runId, isUnavailable, fetchEmployeesList]);

  // Full Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchPreviewSummary(), fetchEmployeesList()]);
    setIsRefreshing(false);
  };

  // ── 3. Open Employee Detail Drawer ──────────────────────────────────
  const handleViewEmployeeDetail = async (emp: PayrollPreviewEmployee) => {
    setSelectedEmployee(emp);
    setDetailSheetOpen(true);
    setLoadingDetail(true);

    try {
      // Fetch detailed breakdown from backend if available
      const detail = await payrollApi.getRunEmployeeDetail(runId, emp.employeeId || emp.id);
      if (detail) {
        setSelectedEmployee(detail);
      }
    } catch {
      // Retain the row data if detail endpoint fails
    } finally {
      setLoadingDetail(false);
    }
  };

  // ── 4. Recalculate Payroll Handler ──────────────────────────────────
  const handleConfirmRecalculate = async () => {
    if (!runId) return;
    setIsRecalculating(true);
    try {
      const res = await payrollApi.recalculatePayroll(runId);
      toast.success(
        res?.message || "Payroll recalculation initiated successfully."
      );
      setRecalculateModalOpen(false);
      // Navigate to processing page to observe live re-calculation
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

  // ── Sorting Click Handler ───────────────────────────────────────────
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  // Unique departments from loaded employee records for the filter dropdown
  const availableDepartments = useMemo(() => {
    const depts = new Set<string>();
    employees.forEach((e) => {
      if (e.department) depts.add(e.department);
    });
    return Array.from(depts);
  }, [employees]);

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
          description="You do not have permission to view Payroll Preview. Please contact your system administrator for access."
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

  const statusTone = getStatusTone(previewData?.status);

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
              Payroll Preview
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
            {!loadingPreview && previewData?.status ? (
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
            title="View validation findings and rule violations"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Validation & Issues</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/approval` as any,
              })
            }
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
              onClick={() => setRecalculateModalOpen(true)}
              className="h-9 gap-1.5 text-xs shadow-sm"
              title="Recalculate payroll figures on backend"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Recalculate Payroll</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── MANDATORY NOTICE: PROVISIONAL PAYROLL ─────────────────────── */}
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

      {/* ── Backend Unavailable / Error State ────────────────────────── */}
      {!loadingPreview && (isUnavailable || apiError) ? (
        <GlassCard className="border-border/80 p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
            <AlertTriangle className="h-6 w-6" />
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
      {loadingPreview ? (
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

      {/* ── Live Preview Content (Only when backend returns preview data) */}
      {!loadingPreview && !isUnavailable && !apiError ? (
        <div className="space-y-6">
          {/* ── Summary Metric Cards ─────────────────────────────────── */}
          <section aria-labelledby="preview-summary-heading">
            <h2 id="preview-summary-heading" className="sr-only">
              Payroll Preview Summary
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <StatCard
                label="Employees"
                value={formatCount(previewData?.summary?.employeeCount)}
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
                value={formatINR(
                  previewData?.summary?.totalEarnings ?? previewData?.summary?.grossPayroll
                )}
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

          {/* ── Validation Issues Panel (If reported by backend) ─────── */}
          {previewData?.validation &&
          (previewData.validation.errors?.length > 0 ||
            previewData.validation.warnings?.length > 0) ? (
            <GlassCard className="p-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-display text-sm font-semibold">
                    Backend Validation Findings
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px]">
                    {previewData.validation.errors.length} Errors
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {previewData.validation.warnings.length} Warnings
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: `/dashboard/payroll/runs/${runId}/validation` as any,
                      })
                    }
                    className="h-7 text-xs gap-1 ml-1"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Open Validation Center</span>
                  </Button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {previewData.validation.errors.map((err) => (
                  <div
                    key={err.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-900 dark:text-rose-200"
                  >
                    <div className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                      <div>
                        <span className="font-semibold">{err.category || "Error"}:</span>{" "}
                        <span>{err.message}</span>
                        {err.employeeName ? (
                          <div className="text-[10px] opacity-80">
                            Employee: {err.employeeName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <Badge variant="destructive" className="shrink-0 text-[9px] uppercase">
                      Error
                    </Badge>
                  </div>
                ))}

                {previewData.validation.warnings.map((warn) => (
                  <div
                    key={warn.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:text-amber-200"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      <div>
                        <span className="font-semibold">{warn.category || "Warning"}:</span>{" "}
                        <span>{warn.message}</span>
                        {warn.employeeName ? (
                          <div className="text-[10px] opacity-80">
                            Employee: {warn.employeeName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[9px] uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      Warning
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}

          {/* ── Employee Payroll Records Table ───────────────────────── */}
          <GlassCard className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Employee Payroll Records
                </h3>
                <p className="text-xs text-muted-foreground">
                  Individual computed payroll lines generated by the backend calculation engine.
                </p>
              </div>

              {/* Total Count Badge */}
              <Badge variant="outline" className="w-fit text-xs font-normal">
                Total Records:{" "}
                <strong className="ml-1 font-semibold">{totalEmployees}</strong>
              </Badge>
            </div>

            {/* Filters Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search name or ID…"
                    className="h-8 pl-8 text-xs bg-background/50"
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>

                {/* Department Filter */}
                {availableDepartments.length > 0 ? (
                  <Select
                    value={selectedDept}
                    onValueChange={(v) => {
                      setSelectedDept(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-36 text-xs bg-background/50">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {availableDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}

                {/* Validation Status Filter */}
                <Select
                  value={selectedValidation}
                  onValueChange={(v) => {
                    setSelectedValidation(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-36 text-xs bg-background/50">
                    <SelectValue placeholder="Validation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="valid">Valid Only</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Size */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Rows:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-20 text-xs bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table Area */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs">
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Employee</span>
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Department</span>
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer select-none"
                      onClick={() => handleSort("grossSalary")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Gross Earnings</span>
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Total Deductions</TableHead>
                    <TableHead
                      className="text-right cursor-pointer select-none"
                      onClick={() => handleSort("netSalary")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Net Pay</span>
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>Validation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEmployees ? (
                    Array.from({ length: pageSize }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8} className="py-3">
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : employees.length > 0 ? (
                    employees.map((emp) => {
                      const vBadge = getValidationBadge(emp.validationStatus);
                      return (
                        <TableRow key={emp.id || emp.employeeId} className="text-xs">
                          <TableCell className="font-medium text-foreground">
                            <div>
                              <div>{emp.name}</div>
                              {emp.designation ? (
                                <div className="text-[10px] text-muted-foreground">
                                  {emp.designation}
                                </div>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {emp.employeeId}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {emp.department || "—"}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatINR(emp.grossEarnings)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-rose-600 dark:text-rose-400">
                            {formatINR(emp.totalDeductions)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatINR(emp.netPay)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-medium ${vBadge.className}`}
                            >
                              {vBadge.label}
                              {emp.issuesCount && emp.issuesCount > 0
                                ? ` (${emp.issuesCount})`
                                : ""}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate({
                                  to: `/dashboard/payroll/runs/${runId}/employees/${emp.employeeId || emp.id}` as any,
                                })
                              }
                              className="h-7 text-xs text-primary hover:text-primary gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <div className="mx-auto max-w-sm">
                          <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground/60" />
                          <div className="mt-2 font-display text-sm font-semibold text-foreground">
                            No payroll results available
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {searchQuery || selectedDept !== "all" || selectedValidation !== "all"
                              ? "No employee records matched your filter criteria."
                              : "Payroll results have not been generated for this run."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <div>
                  Page <strong className="text-foreground">{currentPage}</strong> of{" "}
                  <strong className="text-foreground">{totalPages}</strong> (
                  {totalEmployees} total records)
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1 || loadingEmployees}
                    className="h-8 px-2 text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages || loadingEmployees}
                    className="h-8 px-2 text-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : null}
          </GlassCard>

          {/* ── Workflow Action Notice ──────────────────────────────── */}
          <GlassCard className="border-border p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Next Step: Formal Review & Approval</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  After auditing preview calculations, submit the run for formal review & authorization.
                  Payment transfers cannot be initiated until approval is granted.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.info(
                      "Review & Approval workflow is handled in the next stage."
                    );
                  }}
                  style={{ background: "var(--gradient-brand)" }}
                  className="gap-1.5 text-xs shadow-sm"
                >
                  <span>Continue to Review & Approval</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      ) : null}

      {/* ── Employee Detail Slide-over Sheet ────────────────────────── */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
          <SheetHeader className="border-b border-border pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SheetTitle className="font-display text-lg font-bold text-foreground">
                  {selectedEmployee?.name || "Employee Payroll Detail"}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  ID: <span className="font-mono">{selectedEmployee?.employeeId}</span>
                  {selectedEmployee?.department ? ` • ${selectedEmployee.department}` : ""}
                  {selectedEmployee?.designation ? ` • ${selectedEmployee.designation}` : ""}
                </SheetDescription>
              </div>
              {selectedEmployee?.validationStatus ? (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    getValidationBadge(selectedEmployee.validationStatus).className
                  }`}
                >
                  {getValidationBadge(selectedEmployee.validationStatus).label}
                </Badge>
              ) : null}
            </div>
          </SheetHeader>

          {selectedEmployee ? (
            <div className="mt-4">
              <Button
                size="sm"
                onClick={() => {
                  setDetailSheetOpen(false);
                  navigate({
                    to: `/dashboard/payroll/runs/${runId}/employees/${selectedEmployee.employeeId || selectedEmployee.id}` as any,
                  });
                }}
                className="w-full gap-1.5 text-xs shadow-sm"
                style={{ background: "var(--gradient-brand)" }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open Dedicated Employee Payroll Page</span>
              </Button>
            </div>
          ) : null}

          {loadingDetail ? (
            <div className="space-y-4 py-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selectedEmployee ? (
            <div className="mt-6 space-y-6 text-xs">
              {/* Net Pay Highlight Card */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Net Payable
                    </div>
                    <div className="mt-1 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(selectedEmployee.netPay)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-muted-foreground">
                      Gross: {formatINR(selectedEmployee.grossEarnings)}
                    </div>
                    <div className="text-[11px] text-rose-600 dark:text-rose-400">
                      Deductions: -{formatINR(selectedEmployee.totalDeductions)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance & Leave Info if provided */}
              {selectedEmployee.attendance ? (
                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Attendance & Payable Days</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Working Days</div>
                      <div className="font-semibold text-foreground">
                        {selectedEmployee.attendance.workingDays ?? "—"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Paid Days</div>
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {selectedEmployee.attendance.paidDays ?? "—"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Unpaid / LOP</div>
                      <div className="font-semibold text-rose-600 dark:text-rose-400">
                        {selectedEmployee.attendance.unpaidDays ?? selectedEmployee.attendance.lopDays ?? "—"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Leave Days</div>
                      <div className="font-semibold text-foreground">
                        {selectedEmployee.attendance.leaveDays ?? "—"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2">
                      <div className="text-[10px] text-muted-foreground">Overtime Hours</div>
                      <div className="font-semibold text-foreground">
                        {selectedEmployee.attendance.overtimeHours ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Earnings Breakdown */}
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <div className="font-semibold text-foreground mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Earnings Breakdown</span>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    {formatINR(selectedEmployee.grossEarnings)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {selectedEmployee.earnings ? (
                    <>
                      {selectedEmployee.earnings.basic != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Basic Salary</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.earnings.basic)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.earnings.hra != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">House Rent Allowance (HRA)</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.earnings.hra)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.earnings.specialAllowance != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Special Allowance</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.earnings.specialAllowance)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.earnings.conveyance != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Conveyance Allowance</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.earnings.conveyance)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.earnings.overtime != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Overtime Earnings</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.earnings.overtime)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.earnings.bonus != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Bonus / Incentives</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.earnings.bonus)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.earnings.other != null ? (
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Other Allowances</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.earnings.other)}</span>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="py-2 text-center text-muted-foreground text-[11px]">
                      Detailed earnings breakdown not reported by backend.
                    </div>
                  )}
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <div className="font-semibold text-foreground mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                    <span>Statutory & Policy Deductions</span>
                  </div>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    -{formatINR(selectedEmployee.totalDeductions)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {selectedEmployee.deductions ? (
                    <>
                      {selectedEmployee.deductions.pf != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Provident Fund (PF)</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.deductions.pf)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.deductions.esi != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Employee State Insurance (ESI)</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.deductions.esi)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.deductions.pt != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Professional Tax (PT)</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.deductions.pt)}</span>
                        </div>
                      ) : null}
                      {selectedEmployee.deductions.tds != null || selectedEmployee.deductions.incomeTax != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">TDS / Income Tax (Sec 192)</span>
                          <span className="font-mono font-medium">
                            {formatINR(selectedEmployee.deductions.tds ?? selectedEmployee.deductions.incomeTax)}
                          </span>
                        </div>
                      ) : null}
                      {selectedEmployee.deductions.loan != null || selectedEmployee.deductions.advance != null ? (
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">Loan / Advance Recovery</span>
                          <span className="font-mono font-medium">
                            {formatINR((selectedEmployee.deductions.loan || 0) + (selectedEmployee.deductions.advance || 0))}
                          </span>
                        </div>
                      ) : null}
                      {selectedEmployee.deductions.other != null ? (
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Other Deductions</span>
                          <span className="font-mono font-medium">{formatINR(selectedEmployee.deductions.other)}</span>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="py-2 text-center text-muted-foreground text-[11px]">
                      Detailed deduction components not reported by backend.
                    </div>
                  )}
                </div>
              </div>

              {/* Validation Issues for this employee */}
              {selectedEmployee.issues && selectedEmployee.issues.length > 0 ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <div className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span>Employee Validation Findings</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedEmployee.issues.map((iss, idx) => (
                      <div key={iss.id || idx} className="text-xs text-amber-800 dark:text-amber-300">
                        • {iss.message}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

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

          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Recalculating will re-evaluate attendance, salary structures, statutory taxes (PF, ESI, TDS), and deductions for all employees in this period.
            </p>
            <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Run ID:</span>
                <span className="font-mono font-semibold text-foreground">{runId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-semibold text-foreground">
                  {previewData?.periodName || "—"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRecalculateModalOpen(false)}
              disabled={isRecalculating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRecalculate}
              disabled={isRecalculating}
              style={{ background: "var(--gradient-brand)" }}
            >
              {isRecalculating ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Recalculating...
                </>
              ) : (
                "Confirm & Recalculate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollPreviewPage;
