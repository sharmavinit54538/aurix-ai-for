import { Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  CalendarDays, Check, Clock, X, RefreshCw, Fingerprint, ScrollText, Palmtree, ChevronLeft,
  AlertCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  attendanceApi,
  TodayAttendanceEmployee,
  AttendanceAnalyticsSummary
} from "@/services/attendanceApi";

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
  const [viewMode, setViewMode] = useState<ViewMode>("modules");
  const [todayEmployees, setTodayEmployees] = useState<TodayAttendanceEmployee[]>([]);
  const [analytics, setAnalytics] = useState<AttendanceAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <CalendarDays className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Attendance Hub</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-left">
            {today}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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

          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => loadData(true)}
            className="h-8 gap-1.5 cursor-pointer text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive text-left">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Backend Attendance API Notice: {error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            className="h-7 text-xs border-destructive/40 hover:bg-destructive/15"
          >
            Retry
          </Button>
        </div>
      )}

      {viewMode === "modules" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ATTENDANCE_MODULES_LIST.map((module) => {
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
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.key} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
                    <Icon className={`h-4 w-4 ${c.color}`} />
                  </div>
                  <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
                    {loading && todayEmployees.length === 0 ? "..." : stats[c.key]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <div className="border-b border-border px-4 py-3 text-left flex items-center justify-between">
              <h3 className="font-medium text-sm">Today's attendance records</h3>
              <span className="text-xs text-muted-foreground">
                {todayEmployees.length} {todayEmployees.length === 1 ? "record" : "records"}
              </span>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;

