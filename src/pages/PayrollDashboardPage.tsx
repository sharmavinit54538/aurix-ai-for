import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  Info,
  Play,
  RefreshCw,
} from "lucide-react";
import { EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusBadgeClass } from "@/lib/status-styles";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/use-current-role";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollDashboardData,
  type PayrollPeriod,
} from "@/services/payrollApi";
import { toast } from "sonner";
import { PAYROLL_MODULES_LIST } from "@/features/payroll/constants/modules";
import { ModuleCard } from "@/features/payroll/components/ModuleCard";
import { PayrollMetricsDashboard } from "@/features/payroll/components/PayrollMetricsDashboard";

type ViewMode = "modules" | "metrics";

export function PayrollDashboardPage() {
  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);
  const navigate = useNavigate();

  // Top-right view mode toggle: Overview | Modules (Default: metrics overview)
  const [viewMode, setViewMode] = useState<ViewMode>("metrics");

  // RBAC Permission Check: hr_admin manages company payroll
  const currentRole = useCurrentRole();
  const isHr = currentRole === "hr_admin";

  const canViewPayroll =
    isHr ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canRunPayroll =
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
        const current = data.find((p) => p.isCurrent) || data[0];
        setSelectedPeriodId(current.id);
      } else {
        setSelectedPeriodId("");
      }
    } catch (err: any) {
      setPeriods([]);
      setSelectedPeriodId("");
      if (err?.response?.status !== 404) {
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
      // Extract month/year from selected period
      const period = periods.find((p) => p.id === periodId);
      const month = period?.periodMonth;
      const year = period?.periodYear;
      const data = await payrollApi.getDashboard(month, year);
      setDashboardData(data);
    } catch (err: any) {
      setDashboardData(null);
      if (err?.response?.status !== 404) {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll dashboard data."
        );
      }
    } finally {
      setLoadingDashboard(false);
    }
  }, [periods]);

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

  useEffect(() => {
    if (selectedPeriodId) {
      fetchDashboardData(selectedPeriodId);
    } else if (!loadingPeriods && periods.length === 0) {
      fetchDashboardData();
    }
  }, [selectedPeriodId, loadingPeriods, periods.length, fetchDashboardData]);

  // ── 3. Run Payroll Handler ──────────────────────────────────────────
  const handleConfirmRunPayroll = async () => {
    if (!selectedPeriodId) {
      toast.error("No payroll period selected.");
      return;
    }

    setIsRunningPayroll(true);
    try {
      const result = await payrollApi.runPayroll(selectedPeriodId);
      // HTTP 2xx means success (axios throws on error)
      toast.success(
        result.message || "Provisional payroll processing initiated successfully."
      );
      setConfirmModalOpen(false);

      if (result.runId) {
        navigate({
          to: `/dashboard/payroll/runs/${result.runId}/processing` as any,
        });
      } else {
        await fetchDashboardData(selectedPeriodId);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Payroll processing service is currently unavailable.";
      toast.error(msg);
    } finally {
      setIsRunningPayroll(false);
    }
  };

  // ── Derived State (must execute before any early returns) ───────────
  const activeRun = useMemo(() => {
    const rawActive = dashboardData?.active_run as Record<string, any> | null | undefined;
    if (rawActive && typeof rawActive === "object") {
      return {
        id: String(rawActive.id || rawActive.runId || rawActive.run_id || ""),
        status: String(rawActive.status || dashboardData?.status || ""),
      };
    }
    const latestRecent = dashboardData?.recentRuns?.[0];
    if (latestRecent) {
      return {
        id: latestRecent.id,
        status: latestRecent.status || dashboardData?.status || "",
      };
    }
    return null;
  }, [dashboardData]);

  const hasBlockingReadinessErrors = useMemo(() => {
    return Boolean(
      dashboardData?.readiness?.items?.some((item) => item.status === "Error")
    );
  }, [dashboardData]);

  const currentStatus =
    dashboardData?.status ||
    activeRun?.status ||
    selectedPeriod?.status ||
    "Not started";

  const normalizedRunStatus = currentStatus.toLowerCase();
  const activeRunId = activeRun?.id;

  const statusToneKey = useMemo(() => {
    const status = normalizedRunStatus;
    if (status.includes("fail") || status.includes("error")) return "rejected";
    if (
      status.includes("final") ||
      status.includes("approv") ||
      status.includes("paid") ||
      status.includes("complet")
    )
      return "approved";
    if (
      status.includes("process") ||
      status.includes("review") ||
      status.includes("provis") ||
      status.includes("pending")
    )
      return "pending";
    return "info";
  }, [normalizedRunStatus]);

  // ── Permission Guard ────────────────────────────────────────────────
  if (ws.isRestoring) {
    return (
      <div className="space-y-6 py-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
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

  // Show API error if dashboard failed to load
  if (apiError && !dashboardData) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          title="Unable to Load Payroll Dashboard"
          description={apiError}
          icon={AlertCircle}
          action={
            <Button onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Active Cycle Status Strip & View Switcher ──────────────── */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 flex-1">
          <div className="min-w-0">
            <div className="text-xs font-medium text-muted-foreground">Current Pay Period</div>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">
                {selectedPeriod ? selectedPeriod.name : loadingPeriods ? "Loading period…" : "No active period"}
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-xs font-medium text-muted-foreground">Run Status</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className={`capitalize text-xs ${statusBadgeClass(statusToneKey)}`}>
                {currentStatus}
              </Badge>
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-xs font-medium text-muted-foreground">Employees in Cycle</div>
            <div className="mt-1 text-sm font-semibold tabular-nums text-foreground">
              {dashboardData?.summary?.employeeCount ?? selectedPeriod?.employeeCount ?? "—"}
            </div>
          </div>
        </div>

        <PayrollHubHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* ── View Mode: Modules (Discovery Dashboard) ────────────────── */}
      {viewMode === "modules" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PAYROLL_MODULES_LIST.map((module) => {
              // If user clicks the "Payroll Dashboard" card while on the modules view,
              // seamlessly switch them to the Payroll Metrics tab!
              if (module.id === "payroll-dashboard") {
                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onClick={() => setViewMode("metrics")}
                  />
                );
              }
              return <ModuleCard key={module.id} module={module} />;
            })}
          </div>
        </div>
      ) : (
        /* ── View Mode: Payroll Metrics (Analytics Dashboard) ─────── */
        <PayrollMetricsDashboard
          data={dashboardData}
          periods={periods}
          selectedPeriodId={selectedPeriodId}
          onPeriodChange={setSelectedPeriodId}
          isLoading={loadingDashboard || loadingPeriods}
          onRunPayrollClick={() => setConfirmModalOpen(true)}
          canRunPayroll={canRunPayroll}
        />
      )}

      {/* ── Run Payroll Confirmation Dialog ─────────────────────────── */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-lg">
              <Play className="h-4 w-4 text-primary" />
              Confirm Provisional Payroll Run
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Verify the pay period and employee count before starting provisional calculation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/35 p-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Pay Period</div>
                <div className="mt-1 text-base font-semibold text-foreground">
                  {selectedPeriod ? selectedPeriod.name : "None selected"}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Employees</div>
                <div className="mt-1 text-base font-semibold tabular-nums text-foreground">
                  {dashboardData?.summary?.employeeCount ?? selectedPeriod?.employeeCount ?? "—"}
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-amber-300 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/35 dark:text-amber-200">
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[13px] font-semibold text-amber-900 dark:text-amber-200">
                    Before you proceed
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-amber-800 dark:text-amber-200/90">
                    <li>
                      Processing generates <strong>provisional results</strong> for validation and approval.
                    </li>
                    <li>
                      Payroll is <strong>not finalized</strong> until approved in the review step.
                    </li>
                    <li>Bank payouts are <strong>not initiated</strong> by running calculation.</li>
                  </ul>
                </div>
              </div>
            </div>

            {hasBlockingReadinessErrors ? (
              <Alert variant="destructive" className="py-2.5 text-xs">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  There are blocking readiness errors reported by backend services. Please resolve
                  them before executing.
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
            >
              {isRunningPayroll ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Initiating...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Confirm & Run</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Segmented View Switcher (Overview | All Modules)
 */
function PayrollHubHeader({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex items-center justify-end">
      <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-1">
        <Button
          variant={viewMode === "metrics" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("metrics")}
          className="h-8 px-3 text-[13px] font-medium rounded-md cursor-pointer"
        >
          Overview
        </Button>
        <Button
          variant={viewMode === "modules" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("modules")}
          className="h-8 px-3 text-[13px] font-medium rounded-md cursor-pointer"
        >
          All Modules
        </Button>
      </div>
    </div>
  );
}

export default PayrollDashboardPage;
