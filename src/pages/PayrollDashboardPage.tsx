import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BadgeDollarSign,
  Info,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollDashboardData,
  type PayrollPeriod,
} from "@/services/payrollApi";
import { toast } from "sonner";
import {
  PAYROLL_MODULES_LIST,
  PAYROLL_INTELLIGENCE_MODULES,
} from "@/features/payroll/constants/modules";
import { ModuleCard } from "@/features/payroll/components/ModuleCard";
import { PayrollMetricsDashboard } from "@/features/payroll/components/PayrollMetricsDashboard";

type ViewMode = "modules" | "metrics";

export function PayrollDashboardPage() {
  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);
  const navigate = useNavigate();

  // Top-right view mode toggle: Modules | Payroll Metrics (Default: modules)
  const [viewMode, setViewMode] = useState<ViewMode>("modules");

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
      const data = await payrollApi.getDashboard(periodId);
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

  const hasBlockingReadinessErrors = Boolean(
    dashboardData?.readiness?.items?.some((item) => item.status === "Error")
  );

  return (
    <div className="space-y-6">
      {/* ── Top Header Bar with Segmented Toggle ────────────────────── */}
      <PayrollHubHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* ── View Mode: Modules (Discovery Dashboard) ────────────────── */}
      {viewMode === "modules" ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 1: 30 Core Payroll Modules (3-column responsive grid) */}
          <section aria-labelledby="core-payroll-modules-heading">
            <h2 id="core-payroll-modules-heading" className="sr-only">
              Core Payroll Modules
            </h2>
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
          </section>

          {/* Section 2: OFC360 Payroll Intelligence / Autopilot */}
          <section
            aria-labelledby="payroll-intelligence-heading"
            className="space-y-4 pt-6 border-t border-border/40"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-left">
              <div>
                <h2
                  id="payroll-intelligence-heading"
                  className="font-display text-lg font-semibold tracking-tight text-foreground flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  OFC360 Payroll Intelligence
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Autonomous payroll orchestration, anomaly detection, continuous compliance, and
                  AI workflows.
                </p>
              </div>
              <Badge
                variant="outline"
                className="w-fit border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400 uppercase tracking-wider"
              >
                Autopilot Engine
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PAYROLL_INTELLIGENCE_MODULES.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ── View Mode: Payroll Metrics (Analytics Dashboard) ─────── */
        <PayrollMetricsDashboard
          data={dashboardData}
          periods={periods}
          selectedPeriodId={selectedPeriodId}
          onPeriodChange={setSelectedPeriodId}
          isLoading={loadingDashboard || loadingPeriods}
          onRefresh={handleRefresh}
          onRunPayrollClick={() => setConfirmModalOpen(true)}
          canRunPayroll={canRunPayroll}
        />
      )}

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
                  {dashboardData?.summary?.employeeCount ?? "—"}
                </span>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">
                    Important Process Disclosures:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800/90 dark:text-amber-200/90">
                    <li>
                      Payroll processing generates <strong>provisional results</strong> for review.
                    </li>
                    <li>
                      Payroll is <strong>NOT finalized</strong> at this stage.
                    </li>
                    <li>Salary payment / bank transfer is <strong>NOT initiated</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>

            {hasBlockingReadinessErrors ? (
              <Alert variant="destructive" className="py-2 text-xs">
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

/**
 * Top Header with Title and Segmented Toggle (Modules | Payroll Metrics)
 * Matches RecruitmentHubHeader visual pattern and placement.
 */
function PayrollHubHeader({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-left">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <BadgeDollarSign className="h-6 w-6 text-indigo-400" />
          Payroll Hub
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Unified enterprise payroll discovery, cycle management, compliance, and compensation intelligence.
        </p>
      </div>

      {/* Segmented Toggle matching Recruitment Header */}
      <div className="flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg shadow-xs">
        <Button
          variant={viewMode === "modules" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("modules")}
          className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
        >
          Modules
        </Button>
        <Button
          variant={viewMode === "metrics" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("metrics")}
          className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
        >
          Payroll Metrics
        </Button>
      </div>
    </div>
  );
}

export default PayrollDashboardPage;
