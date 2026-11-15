import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coffee,
  History,
  Laptop,
  LogIn,
  LogOut,
  MapPin,
  Palmtree,
  Play,
  RefreshCw,
  ScanFace,
  ScrollText,
  Timer,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusBadgeClass } from "@/lib/status-styles";
import { formatHHmmTo12h } from "@/lib/datetime";
import {
  attendanceApi,
  AttendanceHistoryItem,
  FaceAttendanceStatus,
  TimelineEventItem,
} from "@/services/attendanceApi";
import { EmployeeHolidaysView } from "@/features/portal/employee/components/EmployeeHolidaysView";
import {
  FaceAttendanceDialog,
  type FaceAttendanceMode,
} from "@/features/attendance/components/FaceAttendanceDialog";
import {
  computeAttendanceMetrics,
  EmployeePunchStatus,
  formatAttendanceTime,
  formatDurationHM,
  resolveCheckInStatus,
} from "@/lib/hrms/attendance-helpers";

function LiveTimerDisplay({ seconds, running }: { seconds: number; running: boolean }) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <div className="font-mono text-4xl sm:text-5xl font-bold tracking-wider tabular-nums text-foreground">
      <span>{h}</span>
      <span className={`text-muted-foreground ${running ? "animate-pulse" : ""}`}>:</span>
      <span>{m}</span>
      <span className={`text-muted-foreground ${running ? "animate-pulse" : ""}`}>:</span>
      <span className="text-primary">{s}</span>
    </div>
  );
}

function PersonalMiniCalendar({ history }: { history: AttendanceHistoryItem[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const todayDate = today.getDate();

  const historyMap = useMemo(() => {
    const map = new Map<string, AttendanceHistoryItem>();
    history.forEach((h) => {
      if (h.date) map.set(h.date, h);
    });
    return map;
  }, [history]);

  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <span className="text-[11px] text-muted-foreground">Personal Log</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={`blank-${idx}`} />;
          const dateObj = new Date(year, month, day);
          const dow = dateObj.getDay();
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const rec = historyMap.get(dateStr);

          let cls = "text-muted-foreground/40";
          if (day === todayDate) {
            cls = rec
              ? "ring-2 ring-primary bg-primary/15 text-primary font-bold"
              : "ring-2 ring-primary/70 text-foreground font-bold";
          } else if (day < todayDate) {
            if (dow === 0 || dow === 6) {
              cls = "text-muted-foreground/50";
            } else if (rec) {
              const s = rec.status.toLowerCase();
              if (s === "late") cls = "bg-amber-500/15 text-amber-400 font-medium";
              else if (s === "wfh") cls = "bg-indigo-500/15 text-indigo-400 font-medium";
              else cls = "bg-emerald-500/15 text-emerald-400 font-medium";
            } else {
              cls = "bg-muted/30 text-muted-foreground";
            }
          }

          return (
            <div
              key={day}
              title={rec ? `${dateStr}: ${rec.status}` : dateStr}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs ${cls}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Present
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-indigo-400" /> WFH
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Late
        </span>
      </div>
    </div>
  );
}

export function EmployeeAttendancePage() {
  const ws = useAurix();
  const user = ws.user;

  const [activeTab, setActiveTab] = useState<"daily" | "holidays">("daily");
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<EmployeePunchStatus>("not-checked-in");
  const [workSec, setWorkSec] = useState(0);
  const [breakSec, setBreakSec] = useState(0);
  const [checkInIso, setCheckInIso] = useState<string | null>(null);
  const [checkOutIso, setCheckOutIso] = useState<string | null>(null);
  const [workMode, setWorkMode] = useState<"Office" | "Remote">("Office");
  const [note, setNote] = useState("");

  const [timeline, setTimeline] = useState<TimelineEventItem[]>([]);
  const [historyList, setHistoryList] = useState<AttendanceHistoryItem[]>([]);
  const [faceStatus, setFaceStatus] = useState<FaceAttendanceStatus | null>(null);
  const [empMeta, setEmpMeta] = useState<{
    id: string;
    employeeId: string;
    fullName: string;
    department?: string;
    designation?: string;
  } | null>(null);

  const [faceModalOpen, setFaceModalOpen] = useState(false);
  const [faceModalMode, setFaceModalMode] = useState<FaceAttendanceMode>("check-in");

  const checkInRef = useRef<Date | null>(null);

  const loadPersonalAttendance = useCallback(async () => {
    try {
      const [todayRes, timelineRes, historyRes, faceRes, empRes] = await Promise.allSettled([
        attendanceApi.getMyTodayStatus(),
        attendanceApi.getTimeline(),
        attendanceApi.getMyAttendanceHistory(1, 20),
        attendanceApi.getFaceAttendanceStatus(),
        attendanceApi.resolveCurrentEmployee(),
      ]);

      const todayData = todayRes.status === "fulfilled" ? todayRes.value : null;
      const faceData = faceRes.status === "fulfilled" ? faceRes.value : null;

      if (faceData) setFaceStatus(faceData);
      if (timelineRes.status === "fulfilled" && Array.isArray(timelineRes.value)) {
        setTimeline(timelineRes.value);
      }
      if (historyRes.status === "fulfilled" && Array.isArray(historyRes.value?.items)) {
        setHistoryList(historyRes.value.items);
      }
      if (empRes.status === "fulfilled" && empRes.value) {
        setEmpMeta({
          id: empRes.value.id,
          employeeId: empRes.value.employeeId || empRes.value.employee_id || "",
          fullName: empRes.value.fullName || empRes.value.full_name || user?.fullName || "Employee",
          department: empRes.value.department,
          designation: empRes.value.designation,
        });
      }

      const resolvedStatus = resolveCheckInStatus({
        checkedIn: Boolean(todayData?.checkedIn ?? faceData?.checkedIn),
        checkedOut: Boolean(todayData?.checkedOut ?? faceData?.checkedOut),
        onBreak: Boolean(todayData?.onBreak),
      });
      setStatus(resolvedStatus);

      const inIso = todayData?.checkInTime || faceData?.checkInTime || null;
      const outIso = todayData?.checkOutTime || faceData?.checkOutTime || null;
      setCheckInIso(inIso);
      setCheckOutIso(outIso);

      const breakMins = todayData?.breakDurationMinutes ?? 0;
      setBreakSec(Math.max(0, Math.round(breakMins * 60)));

      if (inIso) {
        const inDate = new Date(inIso);
        if (!isNaN(inDate.getTime())) {
          checkInRef.current = inDate;
          if (resolvedStatus === "checked-out" && outIso) {
            const outDate = new Date(outIso);
            const total = Math.max(0, Math.floor((outDate.getTime() - inDate.getTime()) / 1000));
            setWorkSec(total);
          } else {
            const total = Math.max(0, Math.floor((Date.now() - inDate.getTime()) / 1000));
            setWorkSec(total);
          }
        }
      } else {
        checkInRef.current = null;
        setWorkSec(0);
      }
    } catch (err) {
      console.error("Failed to load personal attendance:", err);
      toast.error("Unable to load your attendance record.");
    } finally {
      setLoading(false);
    }
  }, [user?.fullName]);

  useEffect(() => {
    loadPersonalAttendance();
  }, [loadPersonalAttendance]);

  // Live ticker while checked in or on break
  useEffect(() => {
    if (status !== "checked-in" && status !== "on-break") return;
    const id = setInterval(() => {
      if (checkInRef.current) {
        setWorkSec(Math.max(0, Math.floor((Date.now() - checkInRef.current.getTime()) / 1000)));
      } else {
        setWorkSec((s) => s + 1);
      }
      if (status === "on-break") {
        setBreakSec((b) => b + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  const handleQuickPunch = async (action: "checkin" | "checkout" | "breakin" | "breakout") => {
    setPunchLoading(action);
    try {
      if (action === "checkin") {
        await attendanceApi.checkIn({ workMode, notes: note.trim() || undefined });
        toast.success(`Checked in (${workMode === "Remote" ? "Remote / WFH" : "Office"})`);
      } else if (action === "breakin") {
        await attendanceApi.startBreak({ notes: note.trim() || undefined });
        toast.success("Break started");
      } else if (action === "breakout") {
        await attendanceApi.endBreak();
        toast.success("Break ended — welcome back!");
      } else {
        await attendanceApi.checkOut({ notes: note.trim() || undefined });
        toast.success("Checked out for the day!");
      }
      await loadPersonalAttendance();
    } catch (err: any) {
      toast.error(err?.message || "Could not record attendance punch");
    } finally {
      setPunchLoading(null);
    }
  };

  const metrics = useMemo(() => computeAttendanceMetrics(historyList), [historyList]);
  const activeSec = Math.max(0, workSec - breakSec);
  const shiftInfo = faceStatus?.shift;
  const displayName = empMeta?.fullName || user?.fullName || "Employee";
  const displayEmpId = empMeta?.employeeId || "—";
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const statusLabel =
    status === "checked-in"
      ? "Currently Working"
      : status === "on-break"
      ? "On Break"
      : status === "checked-out"
      ? "Day Complete"
      : "Not Checked In";

  if (loading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-center">
        <RefreshCw className="h-7 w-7 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your personal attendance workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Badge
          variant="outline"
          className={`text-xs ${
            status === "checked-in"
              ? statusBadgeClass("approved")
              : status === "on-break"
              ? statusBadgeClass("warning")
              : status === "checked-out"
              ? statusBadgeClass("info")
              : "border-border text-muted-foreground"
          }`}
        >
          {statusLabel}
        </Badge>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Link to="/dashboard/attendance/shifts">
              <Clock className="h-3.5 w-3.5" /> My Shifts
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Link to="/dashboard/attendance/rosters">
              <ScrollText className="h-3.5 w-3.5" /> My Roster
            </Link>
          </Button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "daily" | "holidays")}>
        <TabsList className="bg-muted/60 border border-border">
          <TabsTrigger value="daily" className="gap-1.5 text-xs">
            <CalendarCheck className="h-3.5 w-3.5" /> Daily Check-In &amp; History
          </TabsTrigger>
          <TabsTrigger value="holidays" className="gap-1.5 text-xs">
            <Palmtree className="h-3.5 w-3.5" /> Holidays Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-5 space-y-6">
          {/* Personal KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Today&apos;s Status</span>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 font-display text-xl font-bold text-foreground">
                {statusLabel}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {checkInIso ? `In at ${formatAttendanceTime(checkInIso)}` : "Ready to punch in"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>My Attendance Rate</span>
                <CalendarCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 font-display text-xl font-bold text-foreground">
                {metrics.attendanceRate}%
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.presentDays} of {metrics.totalDays} recent days present
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Avg Daily Hours</span>
                <Timer className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="mt-2 font-display text-xl font-bold text-foreground">
                {metrics.avgHours}h
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.wfhDays} WFH · {metrics.lateDays} Late
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Assigned Shift</span>
                <Briefcase className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 truncate font-display text-base font-bold text-foreground">
                {shiftInfo?.shift_name || "General Morning Shift"}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {shiftInfo
                  ? `${formatHHmmTo12h(shiftInfo.start_time)} – ${formatHHmmTo12h(shiftInfo.end_time)}`
                  : "09:00 AM – 06:00 PM"}
              </p>
            </div>
          </div>

          {/* Punch Hero Card */}
          <div className="rounded-2xl border border-border bg-card/65 p-5 sm:p-6 backdrop-blur-xl shadow-sm space-y-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary font-display text-xl font-bold border border-primary/25">
                  {initials}
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">{displayName}</h2>
                  <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> {displayEmpId}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" /> {empMeta?.department || "Engineering"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {workMode === "Remote" ? "Remote / WFH" : "Bengaluru · Global HQ"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Working Timer Today
                </span>
                <LiveTimerDisplay seconds={workSec} running={status === "checked-in"} />
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>Active: <strong className="text-foreground">{formatDurationHM(activeSec)}</strong></span>
                  <span>Break: <strong className="text-foreground">{formatDurationHM(breakSec)}</strong></span>
                  {checkOutIso && (
                    <span>Out: <strong className="text-foreground">{formatAttendanceTime(checkOutIso)}</strong></span>
                  )}
                </div>
              </div>
            </div>

            {/* Work Mode + Note Row */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground shrink-0">Work Mode:</span>
                <div className="flex rounded-lg border border-border bg-background/60 p-0.5">
                  <button
                    type="button"
                    disabled={status !== "not-checked-in"}
                    onClick={() => setWorkMode("Office")}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer disabled:opacity-60 ${
                      workMode === "Office" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Building2 className="h-3 w-3" /> Office
                  </button>
                  <button
                    type="button"
                    disabled={status !== "not-checked-in"}
                    onClick={() => setWorkMode("Remote")}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer disabled:opacity-60 ${
                      workMode === "Remote" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Laptop className="h-3 w-3" /> Remote / WFH
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional punch note (e.g., Client call from home, on-site lab visit)..."
                  className="h-9 text-xs bg-background/60 border-border"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Button
                type="button"
                onClick={() => handleQuickPunch("checkin")}
                disabled={status !== "not-checked-in" || punchLoading !== null}
                className="h-11 gap-2 text-xs font-semibold"
              >
                {punchLoading === "checkin" ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {status === "not-checked-in"
                  ? "Check In"
                  : status === "checked-out"
                  ? "Day Complete"
                  : "Checked In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickPunch("breakin")}
                disabled={status !== "checked-in" || punchLoading !== null}
                className="h-11 gap-2 text-xs font-semibold"
              >
                {punchLoading === "breakin" ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Coffee className="h-4 w-4" />
                )}
                Break In
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickPunch("breakout")}
                disabled={status !== "on-break" || punchLoading !== null}
                className="h-11 gap-2 text-xs font-semibold"
              >
                {punchLoading === "breakout" ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Break Out
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => handleQuickPunch("checkout")}
                disabled={(status !== "checked-in" && status !== "on-break") || punchLoading !== null}
                className="h-11 gap-2 text-xs font-semibold"
              >
                {punchLoading === "checkout" ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {status === "checked-out" ? "Checked Out" : "Check Out"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled={status === "checked-out"}
                onClick={() => {
                  setFaceModalMode(status === "not-checked-in" ? "check-in" : "check-out");
                  setFaceModalOpen(true);
                }}
                className="col-span-2 sm:col-span-1 h-11 gap-1.5 text-xs font-semibold"
              >
                <ScanFace className="h-4 w-4" /> Face Punch
              </Button>
            </div>
          </div>

          {/* Middle 2-col: Timeline & Shift Schedule */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Today's Activity Timeline */}
            <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-base font-semibold">Today&apos;s Punch Timeline</h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  {timeline.length} {timeline.length === 1 ? "event" : "events"}
                </span>
              </div>

              {timeline.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-foreground">No punches recorded today yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click Check In above when you start your shift.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {timeline.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3.5 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            ev.type === "checkin"
                              ? "bg-emerald-400"
                              : ev.type === "checkout"
                              ? "bg-rose-400"
                              : "bg-amber-400"
                          }`}
                        />
                        <span className="font-medium text-foreground">{ev.label}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">{ev.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assigned Shift Details */}
            <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-base font-semibold">My Shift Rules</h3>
                </div>
                <Link
                  to="/dashboard/attendance/shifts"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Request Shift Change
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Shift Name</span>
                  <span className="font-semibold text-foreground">
                    {shiftInfo?.shift_name || "General Morning Shift"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Working Hours</span>
                  <span className="font-semibold text-foreground">
                    {shiftInfo
                      ? `${formatHHmmTo12h(shiftInfo.start_time)} – ${formatHHmmTo12h(shiftInfo.end_time)}`
                      : "09:00 AM – 06:00 PM"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Grace Window</span>
                  <span className="font-semibold text-foreground">
                    {shiftInfo?.grace_period_mins ?? 15} mins
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Break Allowance</span>
                  <span className="font-semibold text-foreground">
                    {shiftInfo?.break_duration_mins ?? 60} mins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 2-col: Personal Monthly Calendar & Recent History */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <h3 className="font-display text-base font-semibold">Monthly Calendar</h3>
              </div>
              <PersonalMiniCalendar history={historyList} />
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-base font-semibold">My Attendance History</h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  {historyList.length} records
                </span>
              </div>

              {historyList.length === 0 ? (
                <div className="p-10 text-center text-xs text-muted-foreground">
                  No personal attendance records found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Check In</th>
                        <th className="px-4 py-2.5">Check Out</th>
                        <th className="px-4 py-2.5">Hours</th>
                        <th className="px-4 py-2.5">Location</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyList.map((row) => (
                        <tr key={row.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-foreground">{row.date}</td>
                          <td className="px-4 py-2.5 font-mono text-muted-foreground">
                            {formatAttendanceTime(row.checkInTime)}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-muted-foreground">
                            {formatAttendanceTime(row.checkOutTime)}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-foreground">
                            {row.workingHours && row.workingHours > 0
                              ? `${row.workingHours.toFixed(1)}h`
                              : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {row.location || "Office"}
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-medium ${statusBadgeClass(row.status)}`}
                            >
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="holidays" className="mt-5">
          <EmployeeHolidaysView branch={ws.company?.city || undefined} />
        </TabsContent>
      </Tabs>

      {/* Optional Biometric Face Punch Dialog */}
      <FaceAttendanceDialog
        open={faceModalOpen}
        mode={faceModalMode}
        onOpenChange={setFaceModalOpen}
        onSuccess={async () => {
          toast.success("Biometric punch recorded!");
          await loadPersonalAttendance();
        }}
        employeeDetails={{
          id: empMeta?.id || user?.id || "",
          employee_id: displayEmpId,
          full_name: displayName,
          department: empMeta?.department,
          designation: empMeta?.designation,
        }}
        currentUser={user}
        notes={note}
      />
    </div>
  );
}

export default EmployeeAttendancePage;
