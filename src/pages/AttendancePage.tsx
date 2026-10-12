import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAurix } from "@/lib/aurix-store";
import {
  CalendarDays, Check, Clock, X, Fingerprint, ScrollText, Palmtree, ChevronLeft,
  AlertCircle, Loader2, RefreshCw, BarChart2, Users, Activity, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  attendanceApi,
  TodayAttendanceEmployee,
  AttendanceAnalyticsSummary,
  AttendanceTrendsResponse,
  AttendanceDistributionResponse,
  WeeklyAttendanceResponse,
  AttendanceRateKPIResponse,
  AttendanceAnalyticsFilters as AttendanceApiFilters,
} from "@/services/attendanceApi";
import {
  DailyAttendanceTrend,
  AttendanceDistribution,
  WeeklyAttendance,
  AttendanceRateKPI,
} from "@/features/attendance/components/AttendanceAnalyticsCharts";
import { AttendanceAnalyticsFiltersComponent, AttendanceAnalyticsFilters, getDefaultDateRange } from "@/features/attendance/components/AttendanceAnalyticsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface AttendanceModuleDef {
  id: string;
  title: string;
  description: string;
  icon: any;
  to: string;
  color: string;
}

export const ATTENDANCE_MODULES_LIST: AttendanceModuleDef[] = [
  {
    id: "checkin",
    title: "Check In / Check Out",
    description: "Punch daily shift entries, view real-time break counters, and verify geofenced zones.",
    icon: Fingerprint,
    to: "/dashboard/attendance/checkin",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "shifts",
    title: "Shifts",
    description: "Manage core timing schedules, night shift premiums, and grace-period rules.",
    icon: Clock,
    to: "/dashboard/attendance/shifts",
    color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "rosters",
    title: "Rosters",
    description: "Schedule dynamic rotational team rosters and assign backup resources.",
    icon: ScrollText,
    to: "/dashboard/attendance/rosters",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "holidays",
    title: "Holidays",
    description: "Setup the corporate holiday calendar, regional leaves, and optional off days.",
    icon: Palmtree,
    to: "/dashboard/attendance/holidays",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
  },
];
type ViewMode = "modules" | "analytics";

export function AttendancePage() {
  const ws = useAurix();
  const isEmployee = (ws.user?.role || "").toLowerCase() === "employee";
  const [viewMode, setViewMode] = useState<ViewMode>("modules");
  const [todayEmployees, setTodayEmployees] = useState<TodayAttendanceEmployee[]>([]);
  const [analytics, setAnalytics] = useState<AttendanceAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Analytics chart states
  const [trendsData, setTrendsData] = useState<AttendanceTrendsResponse | null>(null);
  const [distributionData, setDistributionData] = useState<AttendanceDistributionResponse | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyAttendanceResponse | null>(null);
  const [rateKPIData, setRateKPIData] = useState<AttendanceRateKPIResponse | null>(null);
  const [chartsLoading, setChartsLoading] = useState<boolean>(false);
  const [chartsError, setChartsError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<AttendanceAnalyticsFilters>({
    dateRange: "week",
    viewMode: "week",
  });

  // Filter options (could be fetched from API in the future)
  const filterOptions = useMemo(() => ({
    departments: [] as Array<{ id: string; name: string }>,
    shifts: [] as Array<{ id: string; name: string }>,
    locations: [] as Array<{ id: string; name: string }>,
  }), []);

  const modulesList = useMemo(() => {
    if (isEmployee) {
      return [
        {
          id: "checkin",
          title: "Check In / Check Out",
          description: "Punch daily shift entries, view real-time break counters, and verify geofenced zones.",
          icon: Fingerprint,
          to: "/dashboard/attendance/checkin",
          color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
        },
        {
          id: "shifts",
          title: "My Shifts",
          description: "View your assigned work timings, shift specifications, and schedule history.",
          icon: Clock,
          to: "/dashboard/attendance/shifts",
          color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
        },
        {
          id: "rosters",
          title: "My Roster",
          description: "View your personal planned work schedule and shift assignment calendar.",
          icon: ScrollText,
          to: "/dashboard/attendance/rosters",
          color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
        },
        {
          id: "holidays",
          title: "Holidays",
          description: "View official public, regional, and company holidays for your branch.",
          icon: Palmtree,
          to: "/dashboard/attendance/holidays",
          color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
        },
      ];
    }
    return ATTENDANCE_MODULES_LIST;
  }, [isEmployee]);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const loadData = async (showToastNotice = false) => {
    setLoading(true);
    setError(null);
    try {
      const [empResult, analyticsResult] = await Promise.allSettled([
        attendanceApi.getTodayAttendance(),
        attendanceApi.getAttendanceAnalytics(),
      ]);

      let loadedEmployees = false;
      if (empResult.status === "fulfilled") {
        setTodayEmployees(empResult.value);
        loadedEmployees = true;
      } else {
        const errorMsg = (empResult.reason as any)?.message || "Failed to fetch attendance data from backend";
        console.warn("Backend error fetching today attendance:", empResult.reason);
        setError(errorMsg);
      }

      if (analyticsResult.status === "fulfilled") {
        setAnalytics(analyticsResult.value);
      }

      if (showToastNotice) {
        if (loadedEmployees) {
          toast.success("Attendance data refreshed from server");
        } else {
          toast.error("Failed to load attendance from backend");
        }
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to load attendance records";
      setError(msg);
      if (showToastNotice) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsCharts = useCallback(async () => {
    setChartsLoading(true);
    setChartsError(null);
    try {
      const apiFilters: AttendanceApiFilters = {
        departmentId: filters.departmentId,
        shiftId: filters.shiftId,
        locationId: filters.locationId,
        viewMode: filters.viewMode,
        startDate:
          filters.dateRange === "custom"
            ? (filters.customStartDate ? format(filters.customStartDate, "yyyy-MM-dd") : undefined)
            : format(getDefaultDateRange(filters.dateRange).start, "yyyy-MM-dd"),
        endDate:
          filters.dateRange === "custom"
            ? (filters.customEndDate ? format(filters.customEndDate, "yyyy-MM-dd") : undefined)
            : format(getDefaultDateRange(filters.dateRange).end, "yyyy-MM-dd"),
      };

      const [trendsResult, distributionResult, weeklyResult, rateKPIResult] = await Promise.allSettled([
        attendanceApi.getAttendanceTrends(apiFilters),
        attendanceApi.getAttendanceDistribution(apiFilters),
        attendanceApi.getWeeklyAttendance(apiFilters),
        attendanceApi.getAttendanceRateKPI(apiFilters),
      ]);

      if (trendsResult.status === "fulfilled") {
        setTrendsData(trendsResult.value);
      } else {
        console.warn("Failed to fetch attendance trends:", trendsResult.reason);
      }

      if (distributionResult.status === "fulfilled") {
        setDistributionData(distributionResult.value);
      } else {
        console.warn("Failed to fetch attendance distribution:", distributionResult.reason);
      }

      if (weeklyResult.status === "fulfilled") {
        setWeeklyData(weeklyResult.value);
      } else {
        console.warn("Failed to fetch weekly attendance:", weeklyResult.reason);
      }

      if (rateKPIResult.status === "fulfilled") {
        setRateKPIData(rateKPIResult.value);
      } else {
        console.warn("Failed to fetch attendance rate KPI:", rateKPIResult.reason);
      }

      // Check if any critical error occurred
      const criticalErrors = [trendsResult, distributionResult, weeklyResult, rateKPIResult].filter(
        (r) => r.status === "rejected"
      );
      if (criticalErrors.length === 4) {
        setChartsError("Failed to load some analytics data");
      }
    } catch (err: any) {
      console.error("Error loading analytics charts:", err);
      setChartsError(err?.message || "Failed to load analytics charts");
    } finally {
      setChartsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadAnalyticsCharts();
  }, [loadAnalyticsCharts]);

  const handleFiltersChange = useCallback((newFilters: Partial<AttendanceAnalyticsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleRefresh = useCallback(() => {
    loadData(true);
    loadAnalyticsCharts();
  }, [loadData, loadAnalyticsCharts]);

  const stats = useMemo(() => {
    if (analytics && analytics.totalEmployees > 0) {
      return {
        present: analytics.present,
        late: analytics.late,
        leave: analytics.onLeave,
        absent: analytics.absent,
      };
    }
    return todayEmployees.reduce(
      (acc, e) => {
        const s = e.status || "absent";
        if (s === "present") acc.present++;
        else if (s === "late") acc.late++;
        else if (s === "leave") acc.leave++;
        else acc.absent++;
        return acc;
      },
      { present: 0, late: 0, absent: 0, leave: 0 }
    );
  }, [analytics, todayEmployees]);

  const cards = [
    { key: "present", label: "Present", color: "text-emerald-500", icon: Check },
    { key: "late", label: "Late", color: "text-amber-500", icon: Clock },
    { key: "leave", label: "On leave", color: "text-blue-500", icon: CalendarDays },
    { key: "absent", label: "Absent", color: "text-destructive", icon: X },
  ] as const;

  return (
    <div className="space-y-6">


      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Attendance Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time attendance analytics and insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || chartsLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${(loading || chartsLoading) ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <div className="flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg">
            <Button
              variant={viewMode === "modules" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("modules")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Attendance Hub
            </Button>
            <Button
              variant={viewMode === "analytics" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("analytics")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Attendance Dashboard
            </Button>
          </div>
        </div>
      </div>


      {viewMode === "modules" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modulesList.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.to as any}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                        {module.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.key} className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
                      <Icon className={`h-4 w-4 ${c.color}`} />
                    </div>
                    <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
                      {loading && todayEmployees.length === 0 ? "..." : stats[c.key]}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filters */}
          <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
            <CardContent className="p-4">
              <AttendanceAnalyticsFiltersComponent
                filters={filters}
                options={filterOptions}
                onFiltersChange={handleFiltersChange}
                loading={chartsLoading}
              />
            </CardContent>
          </Card>

          {/* Charts Row 1: Daily Attendance Trend + Attendance Distribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <DailyAttendanceTrend
              className="lg:col-span-8"
              data={trendsData?.trends || []}
              loading={chartsLoading}
              error={chartsError}
              onRetry={loadAnalyticsCharts}
            />
            <AttendanceDistribution
              className="lg:col-span-4"
              data={distributionData}
              loading={chartsLoading}
              error={chartsError}
              onRetry={loadAnalyticsCharts}
            />
          </div>

          {/* Charts Row 2: Weekly Attendance + Attendance Rate KPI */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <WeeklyAttendance
              className="lg:col-span-8"
              data={weeklyData?.weekly || []}
              loading={chartsLoading}
              error={chartsError}
              onRetry={loadAnalyticsCharts}
              viewMode={filters.viewMode}
            />
            <AttendanceRateKPI
              className="lg:col-span-4"
              data={rateKPIData}
              loading={chartsLoading}
              error={chartsError}
              onRetry={loadAnalyticsCharts}
            />
          </div>

          {/* Today's Attendance Records */}
          <Card className="rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Today's Attendance Records</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {todayEmployees.length} {todayEmployees.length === 1 ? "record" : "records"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading && todayEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-sm text-muted-foreground gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Fetching real-time attendance from backend...</span>
                </div>
              ) : todayEmployees.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No attendance records recorded for today yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Employee</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Check-in</th>
                        <th className="px-4 py-3">Check-out</th>
                        <th className="px-4 py-3">Hours</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayEmployees.map((e) => {
                        const checkIn = e.checkInTime
                          ? new Date(e.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—";
                        const checkOut = e.checkOutTime
                          ? new Date(e.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "—";
                        const hours = e.workingHours != null ? `${e.workingHours.toFixed(1)}h` : "—";
                        const s = e.status || "absent";

                        return (
                          <tr key={e.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium">
                              <div className="flex flex-col">
                                <span>{e.fullName}</span>
                                {e.employeeId && (
                                  <span className="text-[11px] text-muted-foreground font-mono">{e.employeeId}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{e.department || "—"}</td>
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{checkIn}</td>
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{checkOut}</td>
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{hours}</td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={s === "present" ? "secondary" : s === "absent" ? "destructive" : "outline"}
                                className="capitalize text-[11px]"
                              >
                                {s}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
export default AttendancePage;

