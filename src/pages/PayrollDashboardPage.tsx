import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Info,
  Layers,
  Play,
  RefreshCw,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAurix } from "@/lib/aurix-store";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollDashboardData,
  type PayrollPeriod,
  type PayrollReadinessArea,
  type PayrollStatus,
  type ReadinessStatus,
} from "@/services/payrollApi";
import { toast } from "sonner";

// ── Currency Formatter (INR) ──────────────────────────────────────────
// Operates ONLY on actual numbers returned by the backend.
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

// ── Format Count ──────────────────────────────────────────────────────
function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

// ── Status Tone Helper ────────────────────────────────────────────────
function getStatusTone(
  status: PayrollStatus | null
): "success" | "warning" | "danger" | "info" | "muted" {
  if (!status) return "muted";
  const normalized = status.toLowerCase();
  if (normalized.includes("approved") || normalized.includes("finalized")) return "success";
  if (normalized.includes("processing") || normalized.includes("review") || normalized.includes("provision"))
    return "warning";
  if (normalized.includes("fail") || normalized.includes("error")) return "danger";
  if (normalized.includes("started")) return "info";
  return "muted";
}

function getReadinessTone(
  status: ReadinessStatus
): "success" | "warning" | "danger" | "muted" {
  switch (status) {
    case "Ready":
      return "success";
    case "Warning":
      return "warning";
    case "Error":
      return "danger";
    default:
      return "muted";
  }
}

// 7 Required Readiness Areas
const REQUIRED_READINESS_AREAS: PayrollReadinessArea[] = [
  "Employee Data",
  "Salary Structures",
  "Attendance",
  "Leave Data",
  "Overtime",
  "Loans / Advances",
  "Tax / Statutory Configuration",
];

export function PayrollDashboardPage() {
  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);
  const navigate = useNavigate();

  // RBAC Permission Check:
  // Admin and HR roles (including hr_admin, hradmin, hr_manager, super_admin, etc.)
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
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<PayrollDashboardData | null>(null);

  const [loadingPeriods, setLoadingPeriods] = useState<boolean>(true);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Run Payroll Modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [isRunningPayroll, setIsRunningPayroll] = useState<boolean>(false);

  // Selected period object
  const selectedPeriod = useMemo(() => {
    return periods.find((p) => p.id === selectedPeriodId) || null;
  }, [periods, selectedPeriodId]);

  // ── 1. Fetch Periods ────────────────────────────────────────────────
  const fetchPeriods = useCallback(async () => {
    setLoadingPeriods(true);
    setApiError(null);
    try {
      const data = await payrollApi.getPeriods();
      setPeriods(data);
      if (data.length > 0) {
        // Default to current period if flagged, else first available period
        const current = data.find((p) => p.isCurrent) || data[0];
        setSelectedPeriodId(current.id);
      } else {
        setSelectedPeriodId("");
      }
    } catch (err: any) {
      // In accordance with zero-mock-data rule: Do NOT synthesize fake periods.
      setPeriods([]);
      setSelectedPeriodId("");
      if (err?.response?.status === 404) {
        setApiError(
          "Backend payroll service is currently unavailable or pending deployment (404 Not Found). The dashboard will display live data once the backend endpoint is deployed."
        );
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll periods from the server."
        );
      }
    } finally {
      setLoadingPeriods(false);
    }
  }, []);

  // ── 2. Fetch Dashboard Data ─────────────────────────────────────────
  const fetchDashboardData = useCallback(async (periodId?: string) => {
    setLoadingDashboard(true);
    try {
      const data = await payrollApi.getDashboard(periodId);
      setDashboardData(data);
    } catch (err: any) {
      // In accordance with zero-mock-data rule: Do NOT synthesize fake data on failure.
      setDashboardData(null);
      if (err?.response?.status === 404) {
        setApiError(
          "Backend payroll service is currently unavailable or pending deployment (404 Not Found). The dashboard will display live data once the backend endpoint is deployed."
        );
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll dashboard data."
        );
      }
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPeriods();
    if (selectedPeriodId) {
      fetchDashboardData(selectedPeriodId);
    } else {
      fetchDashboardData();
    }
  }, [fetchPeriods, fetchDashboardData, selectedPeriodId]);

  // Initial load
  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  // When selected period changes, load corresponding dashboard data
  useEffect(() => {
    if (selectedPeriodId) {
      fetchDashboardData(selectedPeriodId);
    } else if (!loadingPeriods && periods.length === 0) {
      // No periods exist: fetch default / general dashboard status without period
      fetchDashboardData();
    }
  }, [selectedPeriodId, loadingPeriods, periods.length, fetchDashboardData]);

  // ── 3. Handle Period Selection Change ───────────────────────────────
  const handlePeriodChange = (val: string) => {
    setSelectedPeriodId(val);
  };

  // ── 4. Run Payroll Handler ──────────────────────────────────────────
  const handleConfirmRunPayroll = async () => {
    if (!selectedPeriodId) {
      toast.error("No payroll period selected.");
      return;
    }

    setIsRunningPayroll(true);
    try {
      // Call REAL payroll API
      const result = await payrollApi.runPayroll(selectedPeriodId);
      if (result && result.success) {
        toast.success(
          result.message || "Provisional payroll processing initiated successfully."
        );
        setConfirmModalOpen(false);

        const runId =
          result.runId ||
          (result as any).run_id ||
          (result as any).id ||
          (result as any).cycleId ||
          (result as any).cycle_id ||
          (result as any).data?.runId ||
          (result as any).data?.run_id ||
          (result as any).data?.id;

        if (runId) {
          navigate({
            to: `/dashboard/payroll/runs/${runId}/processing` as any,
          });
        } else {
          // Refresh live data
          await fetchDashboardData(selectedPeriodId);
        }
      } else {
        toast.warning(
          result?.message || "Payroll processing responded with an unexpected status."
        );
        setConfirmModalOpen(false);
        await fetchDashboardData(selectedPeriodId);
      }
    } catch (err: any) {
      // Report REAL error without mock simulation
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payroll processing service is currently unavailable.";
      toast.error(msg);
    } finally {
      setIsRunningPayroll(false);
    }
  };

  // ── Permission Guard ────────────────────────────────────────────────
  if (ws.isRestoring) {
    return (
      <div className="space-y-6 py-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!canViewPayroll) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          title="Access Restricted"
          description="You do not have permission to view the Payroll Dashboard. Please contact your system administrator for access."
          icon={AlertCircle}
        />
      </div>
    );
  }

  // Check if readiness has blocking errors from backend
  const hasBlockingReadinessErrors = Boolean(
    dashboardData?.readiness?.items?.some((item) => item.status === "Error")
  );

  return (
    <div className="space-y-6">
      {/* ── Top Action Controls Bar ───────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Navigation Tabs (Segmented Control matching Attendance) */}
        <div className="flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
          >
            <Link to="/dashboard/payroll">Payroll Dashboard</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Link to="/dashboard/payroll/periods">Payroll Periods</Link>
          </Button>
        </div>
        {/* Period Selector */}
        <div className="w-auto min-w-[280px] sm:min-w-[300px]">
          {loadingPeriods ? (
            <Skeleton className="h-9 w-full rounded-lg" />
          ) : periods.length > 0 ? (
            <Select
              value={selectedPeriodId}
              onValueChange={handlePeriodChange}
              aria-label="Select payroll period"
            >
              <SelectTrigger className="h-9 w-full bg-card/85 border-border/80 hover:bg-accent/40 font-medium text-xs px-3 shadow-xs rounded-lg transition-colors">
                <Calendar className="mr-2 h-3.5 w-3.5 shrink-0 text-primary" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="min-w-[280px] sm:min-w-[300px]">
                {periods.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs cursor-pointer">
                    <span className="font-medium">{p.name}</span>
                    {p.isCurrent ? (
                      <span className="ml-2 text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-semibold">
                        Current
                      </span>
                    ) : null}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div
              className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-xs text-muted-foreground"
              title="No payroll periods available from backend"
            >
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">No payroll periods available</span>
            </div>
          )}
        </div>


        {/* Primary Action: Run Payroll */}
        {canRunPayroll ? (
          <Button
            size="sm"
            onClick={() => setConfirmModalOpen(true)}
            disabled={
              loadingDashboard ||
              !selectedPeriodId ||
              hasBlockingReadinessErrors
            }
            className="h-9 gap-1.5 shadow-md cursor-pointer bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={
              hasBlockingReadinessErrors
                ? "Cannot run payroll while readiness errors exist"
                : !selectedPeriodId
                ? "Select a payroll period first"
                : "Run provisional payroll"
            }
          >
            <Play className="h-3.5 w-3.5 fill-white text-white" />
            <span className="text-white font-semibold">Run Payroll</span>
          </Button>
        ) : null}
      </div>


      {/* ── Summary Cards ───────────────────────────────────────────── */}
      <section aria-labelledby="summary-cards-heading">
        <h2 id="summary-cards-heading" className="sr-only">
          Payroll Summary Metrics
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {loadingDashboard ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/40 p-4"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-7 w-28" />
              </div>
            ))
          ) : (
            <>
              <StatCard
                label="Employees"
                value={formatCount(dashboardData?.summary?.employeeCount)}
                icon={Users}
                accent="brand"
              />
              <StatCard
                label="Gross Payroll"
                value={formatINR(dashboardData?.summary?.grossPayroll)}
                icon={Banknote}
                accent="muted"
              />
              <StatCard
                label="Total Deductions"
                value={formatINR(dashboardData?.summary?.totalDeductions)}
                icon={TrendingDown}
                accent="warning"
              />
              <StatCard
                label="Net Payroll"
                value={formatINR(dashboardData?.summary?.netPayroll)}
                icon={TrendingUp}
                accent="success"
              />
              <StatCard
                label="Employer Cost"
                value={formatINR(dashboardData?.summary?.employerCost)}
                icon={Layers}
                accent="muted"
              />
            </>
          )}
        </div>
      </section>

      {/* ── Payroll Status & Readiness Section ──────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (1/3): Payroll Status */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-sm font-semibold">Payroll Status</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-xs text-muted-foreground">
                Selected Period:{" "}
                <span className="font-medium text-foreground">
                  {selectedPeriod ? selectedPeriod.name : "None selected"}
                </span>
              </div>

              {loadingDashboard ? (
                <div className="space-y-2 py-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ) : dashboardData?.status ? (
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                        dashboardData.status.toLowerCase() === "finalized" ||
                        dashboardData.status.toLowerCase() === "approved"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : dashboardData.status.toLowerCase() === "failed"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {dashboardData.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Current stage of the payroll lifecycle for this period as reported
                    by the system.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/30 p-4 text-center">
                  <div className="font-medium text-sm text-muted-foreground">
                    No payroll run
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    No payroll run has been executed for this period yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground">
            <div className="flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                Running payroll generates <strong>provisional calculations</strong>.
                It does not finalize compensation or disburse funds.
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Right Columns (2/3): Payroll Readiness */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-sm font-semibold">
                Payroll Readiness
              </h3>
              <p className="text-xs text-muted-foreground">
                Verification checks determined by backend validation services.
              </p>
            </div>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="mt-4">
            {loadingDashboard ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : dashboardData?.readiness?.items &&
              dashboardData.readiness.items.length > 0 ? (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {dashboardData.readiness.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-border bg-background/50 p-3 transition-colors hover:bg-background/80"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium text-foreground truncate">
                        {item.area}
                      </div>
                      {item.details ? (
                        <div className="text-[11px] text-muted-foreground truncate">
                          {item.details}
                        </div>
                      ) : null}
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        item.status === "Ready"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : item.status === "Warning"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {item.status === "Ready" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : item.status === "Warning" ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/30 p-8 text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <div className="mt-2 font-medium text-sm">
                  Readiness information unavailable
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  The backend has not returned pre-payroll validation readiness
                  metrics for this period.
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* ── Issues (Errors & Warnings) ───────────────────────────────── */}
      <GlassCard>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-display text-sm font-semibold">Issues</h3>
            <p className="text-xs text-muted-foreground">
              Backend validation findings categorized by severity.
            </p>
          </div>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="mt-4">
          {loadingDashboard ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : dashboardData?.issues &&
            (dashboardData.issues.errors?.length > 0 ||
              dashboardData.issues.warnings?.length > 0) ? (
            <Tabs defaultValue="errors" className="w-full">
              <TabsList className="mb-3">
                <TabsTrigger value="errors" className="gap-1.5 text-xs">
                  <span>Errors</span>
                  <Badge
                    variant="destructive"
                    className="h-4 px-1.5 text-[10px]"
                  >
                    {dashboardData.issues.errors?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="warnings" className="gap-1.5 text-xs">
                  <span>Warnings</span>
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 text-[10px]"
                  >
                    {dashboardData.issues.warnings?.length || 0}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Errors Tab */}
              <TabsContent value="errors" className="space-y-2">
                {dashboardData.issues.errors?.length > 0 ? (
                  dashboardData.issues.errors.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <div>
                          <span className="font-medium text-rose-700 dark:text-rose-300">
                            {issue.category}:
                          </span>{" "}
                          <span className="text-foreground">{issue.message}</span>
                          {issue.employeeName ? (
                            <div className="mt-0.5 text-[11px] text-muted-foreground">
                              Employee: {issue.employeeName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <Badge
                        variant="destructive"
                        className="shrink-0 text-[10px] uppercase"
                      >
                        Error
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground">
                    No errors found.
                  </div>
                )}
              </TabsContent>

              {/* Warnings Tab */}
              <TabsContent value="warnings" className="space-y-2">
                {dashboardData.issues.warnings?.length > 0 ? (
                  dashboardData.issues.warnings.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <div>
                          <span className="font-medium text-amber-700 dark:text-amber-300">
                            {issue.category}:
                          </span>{" "}
                          <span className="text-foreground">{issue.message}</span>
                          {issue.employeeName ? (
                            <div className="mt-0.5 text-[11px] text-muted-foreground">
                              Employee: {issue.employeeName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px] uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      >
                        Warning
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground">
                    No warnings found.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background/30 p-8 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500/70" />
              <div className="mt-2 font-medium text-sm">No issues found</div>
              <p className="mt-1 text-xs text-muted-foreground">
                There are no backend validation errors or warnings reported for
                this payroll period.
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* ── Recent Payroll Runs ──────────────────────────────────────── */}
      <GlassCard>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-display text-sm font-semibold">
              Recent Payroll Runs
            </h3>
            <p className="text-xs text-muted-foreground">
              History of executed payroll calculations reported by backend.
            </p>
          </div>
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="mt-4">
          {loadingDashboard ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : dashboardData?.recentRuns && dashboardData.recentRuns.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 text-xs">
                    <TableHead>Payroll Period</TableHead>
                    <TableHead className="text-right">Employee Count</TableHead>
                    <TableHead className="text-right">Gross Payroll</TableHead>
                    <TableHead className="text-right">Net Payroll</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Run Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentRuns.map((run) => (
                    <TableRow key={run.id} className="text-xs">
                      <TableCell className="font-medium text-foreground">
                        {run.periodName}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCount(run.employeeCount)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatINR(run.grossPayroll)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatINR(run.netPayroll)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold uppercase ${
                            run.status.toLowerCase() === "finalized" ||
                            run.status.toLowerCase() === "approved"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : run.status.toLowerCase() === "failed"
                              ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {run.runDate
                          ? new Date(run.runDate).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            if (run.id) {
                              const s = (run.status || "").toLowerCase();
                              if (
                                s.includes("provision") ||
                                s.includes("completed") ||
                                s.includes("final") ||
                                s.includes("approved") ||
                                s.includes("review")
                              ) {
                                navigate({
                                  to: `/dashboard/payroll/runs/${run.id}/preview` as any,
                                });
                              } else {
                                navigate({
                                  to: `/dashboard/payroll/runs/${run.id}/processing` as any,
                                });
                              }
                            } else {
                              toast.info(
                                `Viewing payroll details for ${run.periodName}`
                              );
                            }
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background/30 p-8 text-center">
              <Clock className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <div className="mt-2 font-medium text-sm">No payroll runs yet</div>
              <p className="mt-1 text-xs text-muted-foreground">
                There are no historic or active payroll runs recorded in the
                backend for this workspace.
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* ── Run Payroll Confirmation Dialog ─────────────────────────── */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base">
              <Play className="h-4 w-4 fill-current text-primary" />
              Confirm Provisional Payroll Run
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review period details and operational parameters before triggering calculation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Period & Employee count summary */}
            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payroll Period:</span>
                <span className="font-semibold text-foreground">
                  {selectedPeriod ? selectedPeriod.name : "None selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Employees:</span>
                <span className="font-semibold text-foreground">
                  {formatCount(dashboardData?.summary?.employeeCount)}
                </span>
              </div>
            </div>

            {/* Mandatory Disclaimers */}
            <div className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Important Process Disclosures:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800/90 dark:text-amber-200/90">
                    <li>Payroll processing generates <strong>provisional results</strong> for review.</li>
                    <li>Payroll is <strong>NOT finalized</strong> at this stage.</li>
                    <li>Salary payment / bank transfer is <strong>NOT initiated</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>

            {hasBlockingReadinessErrors ? (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  There are blocking readiness errors reported by backend services. Please resolve them before executing.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>

          <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfirmModalOpen(false)}
              disabled={isRunningPayroll}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRunPayroll}
              disabled={isRunningPayroll || hasBlockingReadinessErrors}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold shadow-md disabled:opacity-50 border-0"
            >
              {isRunningPayroll ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin text-white" />
                  <span className="text-white">Initiating...</span>
                </>
              ) : (
                <>
                  <Play className="mr-1.5 h-3.5 w-3.5 fill-white text-white" />
                  <span className="text-white">Confirm & Run</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollDashboardPage;
