import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Download, RefreshCw } from "lucide-react";
import { getErrorMessage } from "@/api/utils";
import { useCurrentRole, normalizeRole } from "@/lib/roles";
import apiInstance from "@/api/apiInstance";
import {
  reportsAnalyticsApi,
  type HeadcountMetric,
  type DepartmentMetric,
  type TenureMetric,
  type TurnoverMetric,
  type PayrollCostMetric,
  type ComplianceMetric,
  type ReportsFilterParams,
} from "@/services/reportsAnalyticsApi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "oklch(0.6 0.2 285)",
  "oklch(0.7 0.18 320)",
  "oklch(0.65 0.16 200)",
  "oklch(0.75 0.15 90)",
  "oklch(0.55 0.18 25)",
];

interface ChartState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  status?: number;
  available?: boolean;
}

function getDefaultDates() {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export function ReportsPage() {
  const currentRole = useCurrentRole();
  const normalizedRole = normalizeRole(currentRole);
  const canViewPayrollCost =
    normalizedRole === "hr_admin" || normalizedRole === "executive";

  const defaultDates = useMemo(() => getDefaultDates(), []);
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [department, setDepartment] = useState("");

  const [debouncedFilters, setDebouncedFilters] = useState<ReportsFilterParams>({
    start_date: defaultDates.startDate,
    end_date: defaultDates.endDate,
    department: undefined,
  });

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Per-chart state tracking
  const [headcountState, setHeadcountState] = useState<ChartState<HeadcountMetric>>({
    data: [],
    loading: true,
    error: null,
  });

  const [deptState, setDeptState] = useState<ChartState<DepartmentMetric>>({
    data: [],
    loading: true,
    error: null,
  });

  const [tenureState, setTenureState] = useState<ChartState<TenureMetric>>({
    data: [],
    loading: true,
    error: null,
  });

  // Optional probed endpoints
  // TODO: /api/v2/reports/analytics/turnover not implemented in backend
  const [turnoverState, setTurnoverState] = useState<ChartState<TurnoverMetric>>({
    data: [],
    loading: false,
    error: null,
    available: undefined, // probed once
  });

  // TODO: /api/v2/reports/analytics/payroll-cost not implemented in backend
  const [payrollCostState, setPayrollCostState] = useState<ChartState<PayrollCostMetric>>({
    data: [],
    loading: false,
    error: null,
    available: undefined, // probed once
  });

  // TODO: /api/v2/reports/analytics/compliance not implemented in backend
  const [complianceState, setComplianceState] = useState<ChartState<ComplianceMetric>>({
    data: [],
    loading: false,
    error: null,
    available: undefined, // probed once
  });

  // TODO: /api/v2/reports/analytics/export not implemented in backend
  const [exportAvailable, setExportAvailable] = useState<boolean | undefined>(undefined);

  const isDateRangeInvalid = Boolean(startDate && endDate && startDate > endDate);

  // Debounce filters
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) return;
    const timer = setTimeout(() => {
      setDebouncedFilters({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        department: department.trim() || undefined,
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [startDate, endDate, department]);

  const parseChartError = (err: any, defaultMsg: string): { message: string; status?: number } => {
    const status = err?.status || err?.response?.status;
    if (status === 403) {
      return { message: "You do not have access to this report", status: 403 };
    }
    if (status === 401) {
      return { message: "Session expired. Please log in again.", status: 401 };
    }
    return { message: getErrorMessage(err, defaultMsg), status };
  };

  // Dedicated single-chart fetchers
  const fetchHeadcount = useCallback(async (filters: ReportsFilterParams) => {
    setHeadcountState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await reportsAnalyticsApi.getHeadcount(filters);
      setHeadcountState({
        data: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
        status: 200,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      const { message, status } = parseChartError(err, "Failed to load headcount analytics");
      setHeadcountState({ data: [], loading: false, error: message, status });
    }
  }, []);

  const fetchDepartment = useCallback(async (filters: ReportsFilterParams) => {
    setDeptState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await reportsAnalyticsApi.getDepartment(filters);
      setDeptState({
        data: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
        status: 200,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      const { message, status } = parseChartError(err, "Failed to load department analytics");
      setDeptState({ data: [], loading: false, error: message, status });
    }
  }, []);

  const fetchTenure = useCallback(async (filters: ReportsFilterParams) => {
    setTenureState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await reportsAnalyticsApi.getTenure(filters);
      setTenureState({
        data: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
        status: 200,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      const { message, status } = parseChartError(err, "Failed to load tenure analytics");
      setTenureState({ data: [], loading: false, error: message, status });
    }
  }, []);

  const fetchTurnover = useCallback(async (filters: ReportsFilterParams) => {
    setTurnoverState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await reportsAnalyticsApi.getTurnover(filters);
      setTurnoverState({
        data: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
        status: 200,
        available: true,
      });
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      if (status === 404) {
        // Endpoint does not exist in backend; probe result is unavailable
        setTurnoverState({ data: [], loading: false, error: null, available: false, status: 404 });
      } else {
        const { message } = parseChartError(err, "Failed to load turnover analytics");
        setTurnoverState({ data: [], loading: false, error: message, available: true, status });
      }
    }
  }, []);

  const fetchPayrollCost = useCallback(async (filters: ReportsFilterParams) => {
    setPayrollCostState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await reportsAnalyticsApi.getPayrollCost(filters);
      setPayrollCostState({
        data: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
        status: 200,
        available: true,
      });
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      if (status === 404) {
        setPayrollCostState({ data: [], loading: false, error: null, available: false, status: 404 });
      } else {
        const { message } = parseChartError(err, "Failed to load payroll cost analytics");
        setPayrollCostState({ data: [], loading: false, error: message, available: true, status });
      }
    }
  }, []);

  const fetchCompliance = useCallback(async (filters: ReportsFilterParams) => {
    setComplianceState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await reportsAnalyticsApi.getCompliance(filters);
      setComplianceState({
        data: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
        status: 200,
        available: true,
      });
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      if (status === 404) {
        setComplianceState({ data: [], loading: false, error: null, available: false, status: 404 });
      } else {
        const { message } = parseChartError(err, "Failed to load compliance analytics");
        setComplianceState({ data: [], loading: false, error: message, available: true, status });
      }
    }
  }, []);

  // Probe export endpoint availability once
  const probedRef = useRef(false);
  useEffect(() => {
    if (probedRef.current) return;
    probedRef.current = true;

    // Probe export endpoint
    apiInstance
      .get("/api/v2/reports/analytics/export", {
        params: { probe: 1 },
        validateStatus: () => true,
      })
      .then((res) => {
        if (res.status === 404) {
          setExportAvailable(false);
        } else {
          setExportAvailable(true);
        }
      })
      .catch(() => {
        setExportAvailable(false);
      });
  }, []);

  // Fetch charts when debounced filters change
  useEffect(() => {
    if (isDateRangeInvalid) return;

    fetchHeadcount(debouncedFilters);
    fetchDepartment(debouncedFilters);
    fetchTenure(debouncedFilters);

    // If turnover has not been ruled out as 404, query it
    if (turnoverState.available !== false) {
      fetchTurnover(debouncedFilters);
    }
    // If payroll cost has not been ruled out as 404 and role is allowed, query it
    if (canViewPayrollCost && payrollCostState.available !== false) {
      fetchPayrollCost(debouncedFilters);
    }
    // If compliance has not been ruled out as 404, query it
    if (complianceState.available !== false) {
      fetchCompliance(debouncedFilters);
    }
  }, [
    debouncedFilters,
    isDateRangeInvalid,
    canViewPayrollCost,
    fetchHeadcount,
    fetchDepartment,
    fetchTenure,
    fetchTurnover,
    fetchPayrollCost,
    fetchCompliance,
  ]);

  const handleRefreshAll = () => {
    if (isDateRangeInvalid) return;
    fetchHeadcount(debouncedFilters);
    fetchDepartment(debouncedFilters);
    fetchTenure(debouncedFilters);
    if (turnoverState.available !== false) fetchTurnover(debouncedFilters);
    if (canViewPayrollCost && payrollCostState.available !== false) fetchPayrollCost(debouncedFilters);
    if (complianceState.available !== false) fetchCompliance(debouncedFilters);
  };

  const handleExportCsv = async () => {
    if (isDateRangeInvalid) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await reportsAnalyticsApi.exportCsv(debouncedFilters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reports-analytics-${debouncedFilters.start_date || "all"}-${debouncedFilters.end_date || "all"}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      if (status === 404) {
        setExportAvailable(false);
        setExportError("Export endpoint is not supported by the backend.");
      } else {
        setExportError(getErrorMessage(err, "Failed to download CSV export"));
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            HR Reports Builder
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Custom reporting engine for headcount, payroll costs, turnover rates, and compliance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lastUpdated ? (
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdated}
            </span>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            className="gap-1.5"
            title="Refresh all reports"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          {/* Show export button only if not ruled out as 404 */}
          {exportAvailable !== false ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleExportCsv}
              disabled={isExporting || isDateRangeInvalid}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
          ) : null}
        </div>
      </div>

      {exportError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{exportError}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExportError(null)}
            className="h-6 px-2 text-xs"
          >
            Dismiss
          </Button>
        </div>
      ) : null}

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Department (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g. Engineering, Sales..."
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        {isDateRangeInvalid ? (
          <div className="mt-2 text-xs font-medium text-destructive">
            Start date must be before or equal to End date.
          </div>
        ) : null}
      </div>

      {/* Primary Report Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Headcount Chart */}
        <Card
          title="Headcount over time"
          className="lg:col-span-2"
          loading={headcountState.loading}
          error={headcountState.error}
          onRetry={() => fetchHeadcount(debouncedFilters)}
        >
          {headcountState.data?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={headcountState.data} margin={{ top: 10, right: 10, left: -10 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="m"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="n"
                  name="Headcount"
                  stroke="oklch(0.6 0.2 285)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </Card>

        {/* By Department Chart */}
        <Card
          title="By department"
          loading={deptState.loading}
          error={deptState.error}
          onRetry={() => fetchDepartment(debouncedFilters)}
        >
          {deptState.data?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={deptState.data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {deptState.data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </Card>

        {/* Tenure Distribution Chart */}
        <Card
          title="Tenure distribution"
          className="lg:col-span-3"
          loading={tenureState.loading}
          error={tenureState.error}
          onRetry={() => fetchTenure(debouncedFilters)}
        >
          {tenureState.data?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tenureState.data} margin={{ top: 10, right: 10, left: -20 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="range"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="n" name="Employees" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.18 320)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </Card>

        {/* Optional: Turnover Analytics (Rendered only if endpoint exists) */}
        {turnoverState.available ? (
          <Card
            title="Turnover rate"
            className="lg:col-span-3"
            loading={turnoverState.loading}
            error={turnoverState.error}
            onRetry={() => fetchTurnover(debouncedFilters)}
          >
            {turnoverState.data?.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={turnoverState.data} margin={{ top: 10, right: 10, left: -20 }}>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                  <XAxis
                    dataKey="period"
                    stroke="currentColor"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Turnover %"
                    stroke="oklch(0.65 0.16 200)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </Card>
        ) : null}

        {/* Optional: Payroll Cost Analytics (Rendered only if endpoint exists and user has hr_admin/executive role) */}
        {canViewPayrollCost && payrollCostState.available ? (
          <Card
            title="Payroll Cost Analysis"
            className="lg:col-span-2"
            loading={payrollCostState.loading}
            error={payrollCostState.error}
            onRetry={() => fetchPayrollCost(debouncedFilters)}
          >
            {payrollCostState.data?.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={payrollCostState.data} margin={{ top: 10, right: 10, left: -10 }}>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                  <XAxis
                    dataKey="m"
                    stroke="currentColor"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="cost" name="Cost" fill="oklch(0.75 0.15 90)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </Card>
        ) : null}

        {/* Optional: Compliance Metrics (Rendered only if endpoint exists) */}
        {complianceState.available ? (
          <Card
            title="Compliance & Audit"
            className="lg:col-span-1"
            loading={complianceState.loading}
            error={complianceState.error}
            onRetry={() => fetchCompliance(debouncedFilters)}
          >
            {complianceState.data?.length > 0 ? (
              <div className="space-y-3">
                {complianceState.data.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3"
                  >
                    <span className="text-xs font-medium">{c.category || `Metric #${i + 1}`}</span>
                    <span className="text-xs font-semibold">{c.score ?? c.status ?? "Compliant"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  className = "",
  loading = false,
  error = null,
  onRetry,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>

      {loading ? (
        <div className="flex h-[260px] flex-col justify-center space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="flex h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-destructive/40 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mb-2 h-8 w-8 text-destructive" />
          <p className="max-w-xs text-xs font-medium text-destructive">{error}</p>
          {onRetry ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3 gap-1.5 border-destructive/30 hover:bg-destructive/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          ) : null}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function Empty() {
  return (
    <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">
      Not enough data yet
    </div>
  );
}

export default ReportsPage;
