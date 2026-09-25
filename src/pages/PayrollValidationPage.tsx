import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileCheck,
  Filter,
  Info,
  Layers,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
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
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollValidationSummary,
  type PayrollValidationIssue,
} from "@/services/payrollApi";
import { toast } from "sonner";

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

function getValidationStatusBadge(status?: string | null): {
  label: string;
  className: string;
} {
  if (!status) {
    return {
      label: "Pending",
      className: "border-border bg-muted/40 text-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "passed" || s === "completed" || s === "valid") {
    return {
      label: "Passed",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "failed" || s.includes("fail") || s === "error") {
    return {
      label: "Failed",
      className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "warning" || s.includes("warn")) {
    return {
      label: "Warning",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  if (s === "validating" || s === "in_progress") {
    return {
      label: "Validating",
      className: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  if (s === "not started" || s === "draft") {
    return {
      label: "Not Started",
      className: "border-border bg-muted/40 text-foreground",
    };
  }
  return {
    label: status,
    className: "border-border bg-muted/40 text-foreground",
  };
}

function renderSeverityBadge(severity?: string) {
  const s = (severity || "").toLowerCase().trim();
  if (s === "error" || s === "critical" || s === "fatal") {
    return (
      <Badge variant="destructive" className="text-[10px] font-semibold gap-1 uppercase">
        <XCircle className="h-3 w-3" />
        <span>{s === "critical" ? "Critical" : "Error"}</span>
      </Badge>
    );
  }
  if (s === "info") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 gap-1 uppercase"
      >
        <Info className="h-3 w-3" />
        <span>Info</span>
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-[10px] font-medium border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1 uppercase"
    >
      <AlertTriangle className="h-3 w-3" />
      <span>{severity ? severity : "Warning"}</span>
    </Badge>
  );
}

export function PayrollValidationPage() {
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
    isAdmin || isHr || userPermissions.includes("payroll.process") || userPermissions.includes("*");

  // State: Validation Data
  const [validationData, setValidationData] = useState<PayrollValidationSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  // State: Revalidation Trigger Modal
  const [revalidateModalOpen, setRevalidateModalOpen] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // State: Recalculate Trigger Modal
  const [recalculateModalOpen, setRecalculateModalOpen] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // State: Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBlocking, setSelectedBlocking] = useState<string>("all");

  // State: Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // State: Selected Issue Detail Sheet
  const [selectedIssue, setSelectedIssue] = useState<PayrollValidationIssue | null>(null);
  const [issueSheetOpen, setIssueSheetOpen] = useState<boolean>(false);

  // ── Fetch Validation Summary & Issues ───────────────────────────────
  const fetchValidationData = useCallback(async () => {
    if (!runId) return;
    setIsLoading(true);
    setApiError(null);
    setIsUnavailable(false);

    try {
      const data = await payrollApi.getPayrollValidation(runId);
      setValidationData(data);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsUnavailable(true);
        setApiError(
          "Payroll validation data is currently unavailable on the backend server (404 Not Found).",
        );
      } else if (status === 401 || status === 403) {
        setApiError("You do not have permission to view validation issues for this payroll run.");
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll validation findings from the backend.",
        );
      }
      setValidationData(null);
    } finally {
      setIsLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    fetchValidationData();
  }, [fetchValidationData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchValidationData();
    setIsRefreshing(false);
  };

  // ── Trigger Revalidation ────────────────────────────────────────────
  const handleTriggerRevalidation = async () => {
    if (!runId) return;
    setIsValidating(true);
    try {
      const res = await payrollApi.runPayrollValidation(runId);
      toast.success(res?.message || "Payroll revalidation completed successfully.");
      setRevalidateModalOpen(false);
      await fetchValidationData();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to trigger backend validation.";
      toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  };

  // ── Trigger Recalculate ─────────────────────────────────────────────
  const handleTriggerRecalculate = async () => {
    if (!runId) return;
    setIsRecalculating(true);
    try {
      const res = await payrollApi.recalculatePayroll(runId);
      toast.success(res?.message || "Payroll recalculation triggered successfully.");
      setRecalculateModalOpen(false);
      await fetchValidationData();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to trigger recalculation.";
      toast.error(msg);
    } finally {
      setIsRecalculating(false);
    }
  };

  // ── Dynamic Options for Filters ─────────────────────────────────────
  const availableCategories = useMemo(() => {
    if (!validationData?.issues) return [];
    const cats = new Set<string>();
    validationData.issues.forEach((iss) => {
      if (iss.category) cats.add(iss.category);
    });
    return Array.from(cats).sort();
  }, [validationData?.issues]);

  const availableDepartments = useMemo(() => {
    if (!validationData?.issues) return [];
    const depts = new Set<string>();
    validationData.issues.forEach((iss) => {
      if (iss.department) depts.add(iss.department);
    });
    return Array.from(depts).sort();
  }, [validationData?.issues]);

  const hasBlockingInfo = useMemo(() => {
    return Boolean(
      validationData?.blockingCount != null ||
      validationData?.issues?.some((iss) => iss.blocking !== undefined),
    );
  }, [validationData]);

  const hasStatusInfo = useMemo(() => {
    return Boolean(validationData?.issues?.some((iss) => iss.status || iss.resolved !== undefined));
  }, [validationData]);

  // ── Client-Side Filtered & Searched Issues ───────────────────────────
  const filteredIssues = useMemo(() => {
    if (!validationData?.issues) return [];
    return validationData.issues.filter((iss) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchEmpName = iss.employeeName?.toLowerCase().includes(q);
        const matchEmpId = iss.employeeId?.toLowerCase().includes(q);
        const matchMsg = iss.message?.toLowerCase().includes(q);
        const matchCat = iss.category?.toLowerCase().includes(q);
        const matchComp = iss.component?.toLowerCase().includes(q);
        const matchCode = iss.code?.toLowerCase().includes(q);
        const matchDept = iss.department?.toLowerCase().includes(q);
        if (
          !matchEmpName &&
          !matchEmpId &&
          !matchMsg &&
          !matchCat &&
          !matchComp &&
          !matchCode &&
          !matchDept
        ) {
          return false;
        }
      }

      // Severity filter
      if (selectedSeverity !== "all") {
        const s = (iss.severity || "warning").toLowerCase();
        if (selectedSeverity === "error") {
          if (s !== "error" && s !== "critical" && s !== "fatal") return false;
        } else if (selectedSeverity === "warning") {
          if (s !== "warning" && s !== "advisory") return false;
        } else if (selectedSeverity === "info") {
          if (s !== "info") return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (iss.category !== selectedCategory) {
          return false;
        }
      }

      // Department filter
      if (selectedDepartment !== "all") {
        if (iss.department !== selectedDepartment) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "all") {
        const isResolved = Boolean(iss.resolved || iss.status === "resolved");
        if (selectedStatus === "resolved" && !isResolved) return false;
        if (selectedStatus === "open" && isResolved) return false;
      }

      // Blocking filter
      if (hasBlockingInfo && selectedBlocking !== "all") {
        const isBlocking = Boolean(iss.blocking);
        if (selectedBlocking === "blocking" && !isBlocking) return false;
        if (selectedBlocking === "non_blocking" && isBlocking) return false;
      }

      return true;
    });
  }, [
    validationData?.issues,
    searchQuery,
    selectedSeverity,
    selectedCategory,
    selectedDepartment,
    selectedStatus,
    selectedBlocking,
    hasBlockingInfo,
  ]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredIssues.length / pageSize));
  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIssues.slice(start, start + pageSize);
  }, [filteredIssues, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedSeverity,
    selectedCategory,
    selectedDepartment,
    selectedStatus,
    selectedBlocking,
  ]);

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
          description="You do not have permission to view payroll validation findings. Please contact your system administrator."
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
  if (!runId) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <EmptyState
          title="Missing Payroll Run Identifier"
          description="No payroll run ID was provided in the route parameters. Please select a payroll run."
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

  const statusBadge = getValidationStatusBadge(validationData?.status);

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

        {/* Back Link */}
        <Link
          to={`/dashboard/payroll/runs/${runId}/preview` as any}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Payroll Preview</span>
        </Link>
      </div>

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
                to: `/dashboard/payroll/runs/${runId}/approval` as any,
              })
            }
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
                onClick={() => setRecalculateModalOpen(true)}
                disabled={isLoading || isRecalculating}
                className="h-9 gap-1.5 text-xs text-foreground hover:bg-muted/50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Recalculate Run</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevalidateModalOpen(true)}
                disabled={isLoading || isValidating}
                className="h-9 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5"
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>Revalidate Payroll</span>
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {/* ── Mandatory Provisional Payroll Warning Notice ─────────────── */}
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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>

          <GlassCard className="p-6">
            <Skeleton className="h-64 w-full rounded-xl" />
          </GlassCard>
        </div>
      ) : isUnavailable || !validationData ? (
        /* ── Unavailable / Error State ───────────────────────────────── */
        <GlassCard className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Payroll Validation Findings Unavailable
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {apiError ||
                  `Validation results could not be retrieved from the backend for run "${runId}". The backend validation service may still be processing or the endpoint is currently unreachable.`}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchValidationData}
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
                Back to Preview
              </Button>
            </div>
          </div>
        </GlassCard>
      ) : (
        /* ── Actual Validation Findings Experience ───────────────────── */
        <div className="space-y-6">
          {/* Header Card */}
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
                    Payroll Validation & Issues
                  </h1>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold uppercase tracking-wider ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <div>
                    Run ID: <span className="font-mono font-medium text-foreground">{runId}</span>
                  </div>
                  {validationData.periodName ? (
                    <>
                      <span>•</span>
                      <div>
                        Period:{" "}
                        <span className="font-medium text-foreground">
                          {validationData.periodName}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {validationData.runStatus ? (
                    <>
                      <span>•</span>
                      <div>
                        Run Status:{" "}
                        <span className="font-medium text-foreground">
                          {validationData.runStatus}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {validationData.lastValidatedAt ? (
                    <>
                      <span>•</span>
                      <div>
                        Last Validated:{" "}
                        <span className="font-medium text-foreground">
                          {formatDate(validationData.lastValidatedAt)}
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate({
                      to: `/dashboard/payroll/runs/${runId}/approval` as any,
                    })
                  }
                  className="gap-1.5 text-xs shadow-sm"
                  title="Proceed to Step 7 Review & Approval"
                >
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Review & Approval (Step 7)</span>
                </Button>

                {canRunPayroll ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRecalculateModalOpen(true)}
                      disabled={isRecalculating}
                      className="gap-1.5 text-xs shadow-sm"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Recalculate Run</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setRevalidateModalOpen(true)}
                      disabled={isValidating}
                      className="gap-1.5 text-xs shadow-sm"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <FileCheck className="h-3.5 w-3.5" />
                      <span>Run Validation Check</span>
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </GlassCard>

          {/* ── Validation Summary Cards ──────────────────────────────── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="Total Findings"
              value={validationData.totalIssues}
              hint="Detected validation issues"
              icon={Layers}
              accent="brand"
            />
            <StatCard
              label="Errors / Critical"
              value={validationData.errorsCount}
              hint="Requires remediation"
              icon={XCircle}
              accent="danger"
            />
            <StatCard
              label="Advisory Warnings"
              value={validationData.warningsCount}
              hint="Non-blocking recommendations"
              icon={AlertTriangle}
              accent="warning"
            />
            <StatCard
              label="Employees Affected"
              value={validationData.affectedEmployeesCount}
              hint="Individuals requiring review"
              icon={Users}
              accent="muted"
            />
            <StatCard
              label="Validation Status"
              value={statusBadge.label}
              hint={
                validationData.errorsCount > 0
                  ? "Remediation required"
                  : "Validation cycle completed"
              }
              icon={ShieldCheck}
              accent={validationData.errorsCount > 0 ? "danger" : "success"}
            />
          </div>

          {/* ── Filters & Search Controls ─────────────────────────────── */}
          <GlassCard className="p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by employee name, ID, issue, rule code, department…"
                  className="h-9 pl-9 text-xs bg-background/50"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Severity Filter */}
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="h-9 w-32 text-xs bg-background/50">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="error">Errors Only</SelectItem>
                    <SelectItem value="warning">Warnings Only</SelectItem>
                    <SelectItem value="info">Info Only</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                {availableCategories.length > 0 ? (
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-9 w-36 text-xs bg-background/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}

                {/* Department Filter (Only if department data is provided) */}
                {availableDepartments.length > 0 ? (
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="h-9 w-36 text-xs bg-background/50">
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

                {/* Status Filter (Only if status/resolved data exists) */}
                {hasStatusInfo ? (
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-9 w-32 text-xs bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null}

                {/* Blocking Status Filter (Only if backend provides blocking flags) */}
                {hasBlockingInfo ? (
                  <Select value={selectedBlocking} onValueChange={setSelectedBlocking}>
                    <SelectTrigger className="h-9 w-36 text-xs bg-background/50">
                      <SelectValue placeholder="Impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Impact</SelectItem>
                      <SelectItem value="blocking">Blocking Only</SelectItem>
                      <SelectItem value="non_blocking">Non-Blocking Only</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null}

                {/* Page Size */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto sm:ml-0">
                  <span>Rows:</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => {
                      setPageSize(Number(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 w-18 text-xs bg-background/50">
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
            </div>

            {/* ── Issues Table ────────────────────────────────────────── */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs">
                    <TableHead className="w-24">Severity</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Issue Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Blocking</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedIssues.length > 0 ? (
                    paginatedIssues.map((iss) => {
                      return (
                        <TableRow
                          key={iss.id}
                          className="text-xs hover:bg-muted/30 cursor-pointer"
                          onClick={() => {
                            setSelectedIssue(iss);
                            setIssueSheetOpen(true);
                          }}
                        >
                          <TableCell>{renderSeverityBadge(iss.severity)}</TableCell>

                          <TableCell className="font-medium text-foreground">
                            {iss.employeeName || iss.employeeId ? (
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span>{iss.employeeName || "—"}</span>
                                  {iss.department ? (
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] bg-muted/40 font-normal px-1.5 py-0"
                                    >
                                      {iss.department}
                                    </Badge>
                                  ) : null}
                                </div>
                                {iss.employeeId ? (
                                  <div className="font-mono text-[10px] text-muted-foreground">
                                    {iss.employeeId}
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">Run-Level Check</span>
                            )}
                          </TableCell>

                          <TableCell className="max-w-md">
                            <div className="line-clamp-2 text-foreground font-normal leading-relaxed">
                              {iss.message}
                            </div>
                            {iss.code ? (
                              <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
                                Rule: {iss.code}
                              </div>
                            ) : null}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-muted/40 font-normal"
                            >
                              {iss.category || "General"}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-muted-foreground">
                            {iss.component || "—"}
                          </TableCell>

                          <TableCell>
                            {iss.blocking !== undefined ? (
                              iss.blocking ? (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                                >
                                  Blocking
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] border-border bg-muted/40 text-muted-foreground"
                                >
                                  Non-blocking
                                </Badge>
                              )
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>

                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            {iss.employeeId ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate({
                                    to: `/dashboard/payroll/runs/${runId}/employees/${iss.employeeId}` as any,
                                  })
                                }
                                className="h-7 text-xs text-primary hover:text-primary gap-1"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View Payroll</span>
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedIssue(iss);
                                  setIssueSheetOpen(true);
                                }}
                                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                              >
                                <Info className="h-3.5 w-3.5" />
                                <span>Details</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : validationData.issues.length === 0 ? (
                    /* Genuine Success / All Passed State */
                    <TableRow>
                      <TableCell colSpan={7} className="py-14 text-center">
                        <div className="mx-auto max-w-sm space-y-3">
                          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-display text-base font-bold text-foreground">
                              All Payroll Validations Passed
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                              Zero validation issues were detected by the backend payroll engine for
                              this run. All salary, statutory, and attendance checks conform to
                              policy rules.
                            </p>
                          </div>
                          <div className="pt-2">
                            <Button
                              variant="outline"
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
                      </TableCell>
                    </TableRow>
                  ) : (
                    /* Filter Result Empty State */
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <div className="mx-auto max-w-sm">
                          <Filter className="mx-auto h-8 w-8 text-muted-foreground/60" />
                          <div className="mt-2 font-display text-sm font-semibold text-foreground">
                            No matching validation issues
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            No issues matched your current search and filter criteria. Try resetting
                            your filters.
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedSeverity("all");
                              setSelectedCategory("all");
                              setSelectedDepartment("all");
                              setSelectedStatus("all");
                              setSelectedBlocking("all");
                            }}
                            className="mt-3 text-xs text-primary"
                          >
                            Clear Filters
                          </Button>
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
                  <strong className="text-foreground">{totalPages}</strong> ({filteredIssues.length}{" "}
                  total issues)
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="h-8 px-2 text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="h-8 px-2 text-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : null}
          </GlassCard>
        </div>
      )}

      {/* ── Issue Detail Slide-Over Sheet ────────────────────────────── */}
      <Sheet open={issueSheetOpen} onOpenChange={setIssueSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6 space-y-6">
          <SheetHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-display text-base font-bold text-foreground">
                Validation Issue Detail
              </SheetTitle>
              {selectedIssue ? renderSeverityBadge(selectedIssue.severity) : null}
            </div>
            <SheetDescription className="text-xs text-muted-foreground">
              Detailed breakdown of the validation finding reported by the payroll engine.
            </SheetDescription>
          </SheetHeader>

          {selectedIssue ? (
            <div className="space-y-4 text-xs">
              {/* Message Banner */}
              <div
                className={`rounded-xl border p-3.5 ${
                  selectedIssue.severity === "error" || selectedIssue.severity === "critical"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                }`}
              >
                <div className="font-semibold mb-1 flex items-center gap-1.5">
                  {selectedIssue.severity === "error" || selectedIssue.severity === "critical" ? (
                    <XCircle className="h-4 w-4 text-rose-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <span>Finding Statement</span>
                </div>
                <div className="leading-relaxed">{selectedIssue.message}</div>
              </div>

              {/* Attributes Grid */}
              <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-2.5">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">
                    {selectedIssue.category || "General"}
                  </span>
                </div>

                {selectedIssue.component ? (
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Affected Component:</span>
                    <span className="font-medium text-foreground">{selectedIssue.component}</span>
                  </div>
                ) : null}

                {selectedIssue.code ? (
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Rule Code:</span>
                    <span className="font-mono text-foreground">{selectedIssue.code}</span>
                  </div>
                ) : null}

                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Blocking Status:</span>
                  <span className="font-semibold text-foreground">
                    {selectedIssue.blocking !== undefined
                      ? selectedIssue.blocking
                        ? "Yes — Prevents finalization"
                        : "No — Advisory warning"
                      : "Not specified by backend"}
                  </span>
                </div>

                {selectedIssue.status || selectedIssue.resolved !== undefined ? (
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Issue Status:</span>
                    <span className="font-medium text-foreground capitalize">
                      {selectedIssue.status || (selectedIssue.resolved ? "Resolved" : "Open")}
                    </span>
                  </div>
                ) : null}

                {selectedIssue.source ? (
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Reference / Source:</span>
                    <span className="font-mono text-[11px] text-foreground">
                      {selectedIssue.source}
                    </span>
                  </div>
                ) : null}

                {selectedIssue.resolution ? (
                  <div className="flex flex-col gap-1 py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Resolution Notes:</span>
                    <span className="text-foreground leading-relaxed">
                      {selectedIssue.resolution}
                    </span>
                  </div>
                ) : null}

                {selectedIssue.detectedAt ? (
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Detected At:</span>
                    <span className="text-foreground">{formatDate(selectedIssue.detectedAt)}</span>
                  </div>
                ) : null}

                {selectedIssue.employeeName || selectedIssue.employeeId ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Employee Name:</span>
                      <span className="font-medium text-foreground">
                        {selectedIssue.employeeName || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span className="font-mono text-foreground">
                        {selectedIssue.employeeId || "—"}
                      </span>
                    </div>
                    {selectedIssue.department ? (
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="text-foreground">{selectedIssue.department}</span>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>

              {/* Navigation Action */}
              {selectedIssue.employeeId ? (
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setIssueSheetOpen(false);
                      navigate({
                        to: `/dashboard/payroll/runs/${runId}/employees/${selectedIssue.employeeId}` as any,
                      });
                    }}
                    className="w-full gap-1.5 text-xs"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Employee Payroll Detail (Step 5)</span>
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* ── Revalidate Payroll Confirmation Dialog ────────────────────── */}
      <Dialog open={revalidateModalOpen} onOpenChange={setRevalidateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base">
              <FileCheck className="h-4 w-4 text-primary" />
              Revalidate Payroll Run
            </DialogTitle>
            <DialogDescription className="text-xs">
              Execute a fresh validation cycle on the server-side payroll engine.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs text-muted-foreground">
            <p>
              Revalidating will re-audit all statutory deductions, tax slabs (Section 192),
              attendance thresholds, and CTC structures for run{" "}
              <strong className="text-foreground font-mono">{runId}</strong>.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRevalidateModalOpen(false)}
              disabled={isValidating}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleTriggerRevalidation}
              disabled={isValidating}
              className="text-xs gap-1.5"
            >
              {isValidating ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileCheck className="h-3.5 w-3.5" />
              )}
              <span>Execute Validation</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              onClick={handleTriggerRecalculate}
              disabled={isRecalculating}
              className="text-xs gap-1.5"
            >
              {isRecalculating ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              <span>Execute Recalculation</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollValidationPage;
