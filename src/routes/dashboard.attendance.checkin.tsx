import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  AlertCircle, Award, BarChart3, Bell, Bookmark, BookOpen, Brain, Briefcase,
  CalendarDays, Camera, CheckCircle2, ChevronDown, ChevronRight,
  Clock, Coffee, Download, ExternalLink, FileText, Fingerprint,
  Flag, Globe, HelpCircle, History, Info, Laptop, LogIn, LogOut,
  MapPin, MessageSquare, Monitor, Play, QrCode, RefreshCw, Send,
  Shield, ShieldCheck, Sparkles, Star, Timer, TrendingUp, User, UserCog,
  Wifi, X, Zap, Activity,
} from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard, StatCard } from "@/components/hrms/Shared";

// ── Route ─────────────────────────────────────────────────────
export const Route = createFileRoute("/dashboard/attendance/checkin")({
  head: () => ({ meta: [{ title: "Check In / Check Out — Aurix" }] }),
  component: CheckInPage,
});

// ── Types ─────────────────────────────────────────────────────
type AttendanceStatus = "not-checked-in" | "checked-in" | "on-break" | "checked-out";
type DayStatus = "present" | "absent" | "late" | "half-day" | "on-leave" | "wfh";

interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  icon: any;
  color: string;
}

interface AttendanceDay {
  date: number;
  status: "present" | "absent" | "late" | "leave" | "holiday" | "weekend" | "halfday" | "today" | "future";
}

// ── Mock API layer (swap with real endpoints) ─────────────────
const API = {
  checkIn: async () => ({ success: true, time: new Date().toISOString() }),
  checkOut: async () => ({ success: true, time: new Date().toISOString() }),
  breakIn: async () => ({ success: true, time: new Date().toISOString() }),
  breakOut: async () => ({ success: true, time: new Date().toISOString() }),
  getLocation: async (): Promise<{ lat: number; lng: number; accuracy: number; inside: boolean }> => ({
    lat: 28.6139,
    lng: 77.209,
    accuracy: 15,
    inside: true,
  }),
};

// ── Utilities ─────────────────────────────────────────────────
function fmtTime(sec: number) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}
function fmtHM(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function nowTimeStr() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function nowDateStr() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// ── Section Header ─────────────────────────────────────────────
function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: any }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {Icon && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "var(--gradient-brand)" }}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      )}
      <div>
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Live Clock ─────────────────────────────────────────────────
function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!mounted) {
    return (
      <span className="font-mono text-sm tabular-nums text-foreground">
        --:--:--
      </span>
    );
  }

  return (
    <span className="font-mono text-sm tabular-nums text-foreground">
      {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
    </span>
  );
}

// ── Status Chip ────────────────────────────────────────────────
const STATUS_MAP: Record<DayStatus, { label: string; cls: string }> = {
  present:     { label: "Present",     cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30" },
  absent:      { label: "Absent",      cls: "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30" },
  late:        { label: "Late",        cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30" },
  "half-day":  { label: "Half Day",   cls: "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-1 ring-sky-500/30" },
  "on-leave":  { label: "On Leave",   cls: "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-1 ring-violet-500/30" },
  wfh:         { label: "Work From Home", cls: "bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-1 ring-blue-500/30" },
};

function DayStatusChip({ status }: { status: DayStatus }) {
  const s = STATUS_MAP[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{s.label}
  </span>;
}

// ── Attendance Action Button ───────────────────────────────────
function AttendBtn({ label, icon: Icon, onClick, disabled, variant, loading }: {
  label: string; icon: any; onClick: () => void; disabled?: boolean;
  variant: "primary" | "success" | "warning" | "danger"; loading?: boolean;
}) {
  const cls = {
    primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25",
    danger:  "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-500/25",
  }[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`group flex flex-col items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${cls}`}
    >
      {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
      <span>{label}</span>
    </button>
  );
}

// ── Digital Timer Display ──────────────────────────────────────
function DigitalTimer({ seconds, running }: { seconds: number; running: boolean }) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-opacity ${running ? "opacity-30" : "opacity-10"}`}
        style={{ background: "var(--gradient-brand)" }} />
      <div className="relative font-mono text-5xl sm:text-7xl font-bold tracking-widest tabular-nums">
        <span className="text-foreground">{h}</span>
        <span className={`text-muted-foreground ${running ? "animate-pulse" : ""}`}>:</span>
        <span className="text-foreground">{m}</span>
        <span className={`text-muted-foreground ${running ? "animate-pulse" : ""}`}>:</span>
        <span style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s}</span>
      </div>
    </div>
  );
}

// ── Timeline Item ─────────────────────────────────────────────
function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const Icon = event.icon;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${event.color}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className={`pb-4 ${isLast ? "" : ""}`}>
        <div className="text-sm font-medium">{event.label}</div>
        <div className="text-xs text-muted-foreground">{event.time}</div>
      </div>
    </div>
  );
}

// ── Calendar Widget ────────────────────────────────────────────
function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // No mock data — real attendance data to be loaded from API
  const statuses: Record<number, AttendanceDay["status"]> = {};

  const COLOR: Record<string, string> = {
    present: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",
    absent: "bg-rose-500/20 text-rose-600",
    late: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    leave: "bg-violet-500/20 text-violet-600 dark:text-violet-300",
    holiday: "bg-sky-500/20 text-sky-600 dark:text-sky-300",
    weekend: "text-muted-foreground/50",
    halfday: "bg-blue-500/20 text-blue-600 dark:text-blue-300",
    today: "ring-2 ring-violet-500 bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold",
    future: "text-muted-foreground/40",
  };

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  return (
    <div>
      <div className="mb-3 text-center text-sm font-semibold">
        {today.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d) => (
          <div key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const s = statuses[day] ?? (day > today.getDate() ? "future" : "absent");
          return (
            <div key={day} className={`flex h-7 w-7 mx-auto items-center justify-center rounded-full text-xs transition-colors cursor-default ${COLOR[s] ?? ""}`}>
              {day}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { color: "bg-emerald-500/20 text-emerald-600", label: "Present" },
          { color: "bg-amber-500/20 text-amber-700", label: "Late" },
          { color: "bg-violet-500/20 text-violet-600", label: "Leave" },
          { color: "bg-rose-500/20 text-rose-600", label: "Absent" },
          { color: "bg-sky-500/20 text-sky-600", label: "Holiday" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Insights Widget ─────────────────────────────────────────
function AIInsights() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: TrendingUp, label: "Attendance Score", value: "—" },
          { icon: Clock, label: "Avg. Check-In", value: "—" },
          { icon: Timer, label: "Avg. Work Hours", value: "—" },
          { icon: Activity, label: "Punctuality Rank", value: "—" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-border bg-card/40 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</span>
              </div>
              <div className="font-display text-lg font-semibold">{item.value}</div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-violet-500 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-300 mb-1">AI Recommendation</div>
            <p className="text-xs text-muted-foreground">Attendance insights will appear once you start logging your check-in and check-out activity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notification Item ─────────────────────────────────────────
function NotificationItem({ icon: Icon, title, desc, time, color }: {
  icon: any; title: string; desc: string; time: string; color: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/40">
      <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium">{title}</div>
        <div className="text-[11px] text-muted-foreground truncate">{desc}</div>
      </div>
      <div className="text-[10px] shrink-0 text-muted-foreground">{time}</div>
    </div>
  );
}

// ── Recent History Table ───────────────────────────────────────
const HISTORY_ROWS: { date: string; checkIn: string; breakDur: string; checkOut: string; hours: string; ot: string; status: string; location: string }[] = [];

function HistoryTable() {
  if (HISTORY_ROWS.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
        No recent attendance history found.
      </div>
    );
  }
  const STATUS_TONE: Record<string, string> = {
    Present: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    Late: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    Leave: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
    Absent: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            {["Date", "Check In", "Break", "Check Out", "Hours", "OT", "Status", "Location"].map((h) => (
              <th key={h} className="px-3 py-2.5 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HISTORY_ROWS.map((r, i) => (
            <tr key={i} className="border-b border-border/50 transition-colors hover:bg-accent/30">
              <td className="px-3 py-2.5 font-medium text-xs">{r.date}</td>
              <td className="px-3 py-2.5 text-xs font-mono">{r.checkIn}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.breakDur}</td>
              <td className="px-3 py-2.5 text-xs font-mono">{r.checkOut}</td>
              <td className="px-3 py-2.5 text-xs font-semibold">{r.hours}</td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.ot}</td>
              <td className="px-3 py-2.5">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[r.status] ?? "bg-muted text-muted-foreground"}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export function CheckInPage() {
  const ws = useAurix();
  const user = ws.user;

  // ── Attendance state ────────────────────────────────────────
  const [status, setStatus] = useState<AttendanceStatus>("not-checked-in");
  const [dayStatus, setDayStatus] = useState<DayStatus>("present");
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [noteEmp, setNoteEmp] = useState("");

  // ── Timers ──────────────────────────────────────────────────
  const [workSec, setWorkSec] = useState(0);
  const [breakSec, setBreakSec] = useState(0);
  const [activeSec, setActiveSec] = useState(0);
  const checkInTimeRef = useRef<Date | null>(null);
  const breakStartRef = useRef<Date | null>(null);

  // ── Timeline events ─────────────────────────────────────────
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  // ── Geo state ───────────────────────────────────────────────
  const [geo, setGeo] = useState<{ lat: number; lng: number; accuracy: number; inside: boolean } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // ── Notes panel ─────────────────────────────────────────────
  const [notesOpen, setNotesOpen] = useState(false);

  // ── Live clock tick ─────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      if (status === "checked-in") {
        setWorkSec((s) => s + 1);
        setActiveSec((s) => s + 1);
      } else if (status === "on-break") {
        setWorkSec((s) => s + 1);
        setBreakSec((s) => s + 1);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  function showToast(msg: string, type: "success" | "error" | "info" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  function pushTimeline(label: string, icon: any, color: string) {
    setTimeline((prev) => [...prev, {
      id: Math.random().toString(36).slice(2),
      time: nowTimeStr(),
      label,
      icon,
      color,
    }]);
  }

  async function handleCheckIn() {
    setLoading("checkin");
    try {
      await API.checkIn();
      checkInTimeRef.current = new Date();
      setStatus("checked-in");
      setDayStatus("present");
      pushTimeline("Checked In", LogIn, "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300");
      showToast("✅ Checked in successfully!", "success");
    } catch {
      showToast("Failed to check in. Try again.", "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleBreakIn() {
    setLoading("breakin");
    try {
      await API.breakIn();
      breakStartRef.current = new Date();
      setStatus("on-break");
      pushTimeline("Break Started", Coffee, "bg-amber-500/20 text-amber-700 dark:text-amber-300");
      showToast("☕ Break started", "info");
    } catch {
      showToast("Failed to start break.", "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleBreakOut() {
    setLoading("breakout");
    try {
      await API.breakOut();
      setStatus("checked-in");
      pushTimeline("Break Ended", Play, "bg-sky-500/20 text-sky-600 dark:text-sky-300");
      showToast("Break ended. Back to work!", "info");
    } catch {
      showToast("Failed to end break.", "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleCheckOut() {
    setLoading("checkout");
    try {
      await API.checkOut();
      setStatus("checked-out");
      pushTimeline("Checked Out", LogOut, "bg-rose-500/20 text-rose-600 dark:text-rose-300");
      showToast("👋 Checked out. Great work today!", "success");
    } catch {
      showToast("Failed to check out.", "error");
    } finally {
      setLoading(null);
    }
  }

  async function fetchLocation() {
    setGeoLoading(true);
    try {
      const loc = await API.getLocation();
      setGeo(loc);
    } finally {
      setGeoLoading(false);
    }
  }

  // Overtime is anything beyond 8h work
  const overtimeSec = Math.max(0, workSec - 28800);
  const lateBy = 0; // mock: on time today

  const initials = user?.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "JL";

  return (
    <div className="space-y-6 pb-24">
      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-xl ${
          toast.type === "success" ? "bg-emerald-600 text-white" :
          toast.type === "error" ? "bg-rose-600 text-white" :
          "bg-sky-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> :
           toast.type === "error" ? <AlertCircle className="h-4 w-4" /> :
           <Info className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span>Attendance</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Check In</span>
          </nav>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Check In / Check Out</h1>
          <p className="mt-1 text-sm text-muted-foreground">{nowDateStr()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur-xl">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <LiveClock />
          </div>
          <DayStatusChip status={dayStatus} />
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">Morning Shift</span>
            <span className="text-muted-foreground">09:00 – 18:00</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ── Left Column ── */}
        <div className="space-y-6 xl:col-span-2">

          {/* ── Hero Card ── */}
          <GlassCard className="!p-0 overflow-hidden">
            {/* Top gradient strip */}
            <div className="h-1.5 w-full" style={{ background: "var(--gradient-brand)" }} />
            <div className="p-5">
              <div className="flex flex-wrap items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white shadow-lg"
                    style={{ background: "var(--gradient-brand)" }}>
                    {initials}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                    status === "checked-in" ? "bg-emerald-500" :
                    status === "on-break" ? "bg-amber-500" :
                    status === "checked-out" ? "bg-muted-foreground" : "bg-muted-foreground"
                  }`} />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-semibold">{user?.fullName ?? "Jordan Lee"}</h2>
                    <DayStatusChip status={dayStatus} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> EMP-{ws.employees[0]?.employeeId ?? "2024001"}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {ws.employees[0]?.department ?? "Engineering"}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {ws.employees[0]?.designation ?? "Senior Engineer"}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Bangalore Office</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <UserCog className="h-3 w-3" />
                    <span>Reports to: {ws.employees[0]?.managerName ?? "Alex Morgan"}</span>
                  </div>
                </div>
                {/* Working hours today */}
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Working Today</div>
                  <div className="font-mono text-2xl font-bold tabular-nums">{fmtHM(workSec)}</div>
                  <div className="text-xs text-muted-foreground">Expected: 9h 00m</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <AttendBtn
                  label="Check In"
                  icon={LogIn}
                  onClick={handleCheckIn}
                  disabled={status !== "not-checked-in"}
                  variant="success"
                  loading={loading === "checkin"}
                />
                <AttendBtn
                  label="Break In"
                  icon={Coffee}
                  onClick={handleBreakIn}
                  disabled={status !== "checked-in"}
                  variant="warning"
                  loading={loading === "breakin"}
                />
                <AttendBtn
                  label="Break Out"
                  icon={Play}
                  onClick={handleBreakOut}
                  disabled={status !== "on-break"}
                  variant="primary"
                  loading={loading === "breakout"}
                />
                <AttendBtn
                  label="Check Out"
                  icon={LogOut}
                  onClick={handleCheckOut}
                  disabled={status !== "checked-in" && status !== "on-break"}
                  variant="danger"
                  loading={loading === "checkout"}
                />
              </div>

              {/* Status bar */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    status === "checked-in" ? "bg-emerald-500 animate-pulse" :
                    status === "on-break" ? "bg-amber-500 animate-pulse" :
                    status === "checked-out" ? "bg-muted-foreground" : "bg-muted-foreground"
                  }`} />
                  <span className="font-medium">
                    {status === "not-checked-in" ? "Not Checked In" :
                     status === "checked-in" ? "Currently Working" :
                     status === "on-break" ? "On Break" : "Day Complete"}
                  </span>
                </div>
                <div className="flex gap-4 text-muted-foreground">
                  <span>Break: <strong className="text-foreground">{fmtHM(breakSec)}</strong></span>
                  <span>OT: <strong className={overtimeSec > 0 ? "text-violet-500" : "text-foreground"}>{fmtHM(overtimeSec)}</strong></span>
                  {lateBy > 0 && <span>Late by: <strong className="text-amber-500">{fmtHM(lateBy)}</strong></span>}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ── Live Working Timer ── */}
          <GlassCard>
            <SectionHeader title="Live Working Timer" icon={Timer} />
            <div className="flex flex-col items-center gap-6 py-4">
              <DigitalTimer seconds={workSec} running={status === "checked-in"} />
              <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-4">
                {[
                  { label: "Total Work", value: fmtHM(workSec), color: "text-emerald-500" },
                  { label: "Active Time", value: fmtHM(activeSec), color: "text-sky-500" },
                  { label: "Break Time", value: fmtHM(breakSec), color: "text-amber-500" },
                  { label: "Overtime", value: fmtHM(overtimeSec), color: "text-violet-500" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card/40 p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.label}</div>
                    <div className={`font-mono text-lg font-bold tabular-nums ${item.color}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* ── Summary Stats ── */}
          <div>
            <SectionHeader title="Today's Summary" icon={BarChart3} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Working Hours" value={fmtHM(workSec)} hint="Expected: 9h 00m" icon={Clock} accent="brand" />
              <StatCard label="Break Duration" value={fmtHM(breakSec)} hint="Max allowed: 1h" icon={Coffee} accent="warning" />
              <StatCard label="Overtime" value={fmtHM(overtimeSec)} hint={overtimeSec > 0 ? "Eligible for OT pay" : "No overtime"} icon={Zap} accent="success" />
              <StatCard label="Late By" value={lateBy > 0 ? fmtHM(lateBy) : "On Time"} hint="Grace: 15 mins" icon={AlertCircle} accent={lateBy > 0 ? "danger" : "success"} />
              <StatCard label="Early Exit" value="—" hint="Not applicable" icon={LogOut} accent="muted" />
              <StatCard label="Attendance Score" value="94%" hint="Top performer" icon={Award} accent="success" />
            </div>
          </div>

          {/* ── Two-col grid: Timeline + Shift Info ── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Timeline */}
            <GlassCard>
              <SectionHeader title="Today's Timeline" icon={History} />
              {timeline.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No events yet. Check in to start.</p>
                </div>
              ) : (
                <div className="mt-2">
                  {timeline.map((ev, i) => (
                    <TimelineItem key={ev.id} event={ev} isLast={i === timeline.length - 1} />
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Shift Info */}
            <GlassCard>
              <SectionHeader title="Shift Information" icon={Briefcase} />
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Shift Name", value: "Morning Shift" },
                  { label: "Timing", value: "09:00 AM – 06:00 PM" },
                  { label: "Manager", value: ws.employees[0]?.managerName ?? "Alex Morgan" },
                  { label: "Working Days", value: "Mon – Fri" },
                  { label: "Expected Hours", value: "9h 00m" },
                  { label: "Grace Time", value: "15 minutes" },
                  { label: "Weekend", value: "Sat, Sun" },
                  { label: "Location", value: "Bangalore HQ" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                    <span className="text-muted-foreground text-xs">{row.label}</span>
                    <span className="font-medium text-xs">{row.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ── Two-col grid: Geo + Face ── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Geo */}
            <GlassCard>
              <SectionHeader title="Geo Location" icon={MapPin} />
              {geo ? (
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium w-fit ${
                    geo.inside ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" : "bg-rose-500/15 text-rose-600"
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {geo.inside ? "Inside Office Radius" : "Outside Office Radius"}
                  </div>
                  {/* Map placeholder */}
                  <div className="relative h-32 rounded-xl overflow-hidden border border-border bg-muted/40">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <MapPin className="h-6 w-6 text-violet-500" />
                      <span className="text-xs text-muted-foreground">OpenStreetMap view</span>
                      <a href={`https://www.openstreetmap.org/#map=16/${geo.lat}/${geo.lng}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] text-violet-500 underline">
                        Open in Maps <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg border border-border p-2">
                      <div className="text-muted-foreground">Latitude</div>
                      <div className="font-mono font-medium">{geo.lat.toFixed(4)}</div>
                    </div>
                    <div className="rounded-lg border border-border p-2">
                      <div className="text-muted-foreground">Longitude</div>
                      <div className="font-mono font-medium">{geo.lng.toFixed(4)}</div>
                    </div>
                    <div className="rounded-lg border border-border p-2">
                      <div className="text-muted-foreground">Accuracy</div>
                      <div className="font-mono font-medium">±{geo.accuracy}m</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground mb-3">Location not fetched yet.</p>
                </div>
              )}
              <Button size="sm" variant="outline" className="mt-3 w-full gap-2" onClick={fetchLocation} disabled={geoLoading}>
                {geoLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Refresh Location
              </Button>
            </GlassCard>

            {/* Face Verification */}
            <GlassCard>
              <SectionHeader title="Face Verification" icon={Camera} />
              <div className="space-y-3">
                {/* Camera preview placeholder */}
                <div className="relative h-32 rounded-xl border border-dashed border-border bg-muted/20 overflow-hidden flex flex-col items-center justify-center gap-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" />
                  <Camera className="h-8 w-8 text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground">Camera preview area</span>
                  <span className="text-[10px] text-muted-foreground/60">Live feed will appear here</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-border bg-card/40 p-2">
                    <div className="text-muted-foreground">Status</div>
                    <div className="flex items-center gap-1 font-medium text-emerald-500"><CheckCircle2 className="h-3 w-3" /> Verified</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card/40 p-2">
                    <div className="text-muted-foreground">Confidence</div>
                    <div className="font-medium">97.4%</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card/40 p-2 col-span-2">
                    <div className="text-muted-foreground">Last Verified</div>
                    <div className="font-medium">{nowTimeStr()}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <Fingerprint className="h-3.5 w-3.5" /> Verify Face
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* ── QR + Device ── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* QR */}
            <GlassCard>
              <SectionHeader title="QR Attendance" icon={QrCode} />
              <div className="flex flex-col items-center gap-3">
                <div className="h-28 w-28 rounded-xl border-2 border-dashed border-border bg-muted/20 flex items-center justify-center">
                  <QrCode className="h-14 w-14 text-muted-foreground/30" />
                </div>
                <div className="w-full space-y-2 text-xs">
                  {[
                    { label: "Scan Result", value: "AUR-ATT-29JUN2026" },
                    { label: "Device", value: "Chrome Desktop" },
                    { label: "Status", value: "Verified", ok: true },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between rounded-lg px-3 py-1.5 hover:bg-muted/40">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={`font-medium ${row.ok ? "text-emerald-500" : ""}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <QrCode className="h-3.5 w-3.5" /> Scan QR
                </Button>
              </div>
            </GlassCard>

            {/* Device */}
            <GlassCard>
              <SectionHeader title="Device Information" icon={Monitor} />
              <div className="space-y-2 text-xs">
                {[
                  { label: "Device Type", value: "Desktop", icon: Laptop },
                  { label: "Browser", value: "Chrome 126", icon: Globe },
                  { label: "OS", value: "Windows 11", icon: Monitor },
                  { label: "IP Address", value: "192.168.1.42", icon: Wifi },
                  { label: "Network", value: "Corporate WiFi", icon: Wifi },
                  { label: "VPN", value: "Not Detected", icon: Shield },
                  { label: "Device Trust", value: "Trusted", icon: ShieldCheck },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center justify-between rounded-lg px-3 py-1.5 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        {row.label}
                      </div>
                      <span className="font-medium">{row.value}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* ── Attendance Rules ── */}
          <GlassCard>
            <SectionHeader title="Attendance Rules" icon={FileText} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
              {[
                { label: "Office Timing", value: "09:00 AM – 06:00 PM" },
                { label: "Grace Period", value: "15 minutes" },
                { label: "Maximum Break", value: "60 minutes/day" },
                { label: "Late Policy", value: "3 lates = 1 absent" },
                { label: "Early Exit", value: "Requires manager approval" },
                { label: "Overtime Rules", value: "After 9h, eligible for OT" },
                { label: "WFH Policy", value: "Max 4 days/month" },
                { label: "Geo-fence Radius", value: "500m from office" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ── Notes ── */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Notes" icon={MessageSquare} />
              <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => setNotesOpen((o) => !o)}>
                {notesOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                {notesOpen ? "Collapse" : "Expand"}
              </Button>
            </div>
            {notesOpen && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Employee Note</label>
                  <Textarea
                    className="mt-1.5 resize-none text-sm"
                    rows={3}
                    placeholder="Add a note for today's attendance..."
                    value={noteEmp}
                    onChange={(e) => setNoteEmp(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Manager Note</label>
                  <div className="mt-1.5 min-h-[72px] rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground italic">
                    No notes from manager yet.
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HR Note</label>
                  <div className="mt-1.5 min-h-[72px] rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground italic">
                    No notes from HR yet.
                  </div>
                </div>
                <Button size="sm" className="gap-2" onClick={() => showToast("Note saved successfully!", "success")}>
                  <Send className="h-3.5 w-3.5" /> Save Note
                </Button>
              </div>
            )}
          </GlassCard>

          {/* ── AI Insights ── */}
          <GlassCard>
            <SectionHeader title="AI Attendance Insights" subtitle="Powered by Aurix AI" icon={Brain} />
            <AIInsights />
          </GlassCard>

          {/* ── Calendar ── */}
          <GlassCard>
            <SectionHeader title="Monthly Calendar" icon={CalendarDays} />
            <MiniCalendar />
          </GlassCard>

          {/* ── History ── */}
          <GlassCard className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-sm">Recent Attendance History</h2>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
            <HistoryTable />
          </GlassCard>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-5">
          {/* Notifications */}
          <GlassCard>
            <SectionHeader title="Notifications" icon={Bell} />
            <div className="space-y-1">
              <NotificationItem icon={CheckCircle2} title="Attendance Confirmed" desc="Check-in recorded at 09:01 AM" time="9:01" color="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" />
              <NotificationItem icon={AlertCircle} title="Break Limit" desc="You've been on break for 28 mins" time="1:33" color="bg-amber-500/15 text-amber-700 dark:text-amber-300" />
              <NotificationItem icon={CalendarDays} title="Holiday Tomorrow" desc="Wednesday is a public holiday" time="8:00" color="bg-sky-500/15 text-sky-600 dark:text-sky-300" />
              <NotificationItem icon={Bell} title="Shift Change" desc="Your shift timings have been updated" time="Fri" color="bg-violet-500/15 text-violet-600 dark:text-violet-300" />
            </div>
          </GlassCard>

          {/* Weather */}
          <GlassCard>
            <SectionHeader title="Today's Weather" icon={Globe} />
            <div className="flex items-center gap-4 py-2">
              <div className="text-5xl">🌤️</div>
              <div>
                <div className="font-display text-2xl font-bold">28°C</div>
                <div className="text-sm text-muted-foreground">Partly Cloudy</div>
                <div className="text-xs text-muted-foreground">Bangalore, KA</div>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Humidity: 68%</span>
              <span>Wind: 14 km/h</span>
              <span>UV: Low</span>
            </div>
          </GlassCard>

          {/* Company Notice */}
          <GlassCard>
            <SectionHeader title="Company Notice" icon={Flag} />
            <div className="space-y-2">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
                <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">🏖️ Eid Holiday</div>
                <p className="text-muted-foreground">Office will remain closed on July 7th (Monday). Apply WFH or enjoy the long weekend!</p>
              </div>
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 text-xs">
                <div className="font-semibold text-sky-600 dark:text-sky-300 mb-1">📢 Attendance Policy Update</div>
                <p className="text-muted-foreground">New geo-fencing radius will be 300m from July 1st. Please check the updated HR policy.</p>
              </div>
            </div>
          </GlassCard>

          {/* Upcoming Holidays */}
          <GlassCard>
            <SectionHeader title="Upcoming Holidays" icon={CalendarDays} />
            <div className="space-y-2">
              {[
                { date: "Jul 7", name: "Eid al-Adha", type: "National" },
                { date: "Aug 15", name: "Independence Day", type: "National" },
                { date: "Aug 26", name: "Janmashtami", type: "Restricted" },
                { date: "Oct 2", name: "Gandhi Jayanti", type: "National" },
              ].map((h) => (
                <div key={h.date} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/40 transition-colors">
                  <div>
                    <div className="text-xs font-medium">{h.name}</div>
                    <div className="text-[10px] text-muted-foreground">{h.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold">{h.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Birthday Wishes */}
          <GlassCard>
            <SectionHeader title="Celebrations" icon={Star} />
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-2.5">
                <div className="text-2xl">🎂</div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold">Rahul Kumar's Birthday</div>
                  <div className="text-[10px] text-muted-foreground">Today · Engineering Team</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3 py-2.5">
                <div className="text-2xl">🎉</div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold">Priya Nair — Work Anniversary</div>
                  <div className="text-[10px] text-muted-foreground">Today · 5 years at Aurix!</div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Links */}
          <GlassCard>
            <SectionHeader title="Quick Links" icon={Bookmark} />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Apply Leave", icon: CalendarDays, href: "/dashboard/leaves/apply" },
                { label: "Raise Ticket", icon: HelpCircle, href: "/dashboard/help/raise-ticket" },
                { label: "HR Contact", icon: UserCog, href: "/dashboard/communication/team-directory" },
                { label: "Regularize", icon: FileText, href: "/dashboard/attendance/regularization" },
                { label: "Download Report", icon: Download, href: "#" },
                { label: "Policy Docs", icon: BookOpen, href: "/dashboard/documents/policies" },
              ].map((ql) => {
                const Icon = ql.icon;
                return (
                  <a key={ql.label} href={ql.href} className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium transition-colors hover:bg-accent/60 hover:border-border">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {ql.label}
                  </a>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── Floating Action Button ── */}
      <FloatingActions onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} status={status} />
    </div>
  );
}

// ── Floating Actions ───────────────────────────────────────────
function FloatingActions({ onCheckIn, onCheckOut, status }: {
  onCheckIn: () => void; onCheckOut: () => void; status: AttendanceStatus;
}) {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: "Check In", icon: LogIn, onClick: onCheckIn, disabled: status !== "not-checked-in", color: "bg-emerald-500 hover:bg-emerald-600" },
    { label: "Check Out", icon: LogOut, onClick: onCheckOut, disabled: status !== "checked-in" && status !== "on-break", color: "bg-rose-500 hover:bg-rose-600" },
    { label: "Regularize", icon: FileText, onClick: () => {}, color: "bg-amber-500 hover:bg-amber-600" },
    { label: "Download", icon: Download, onClick: () => {}, color: "bg-sky-500 hover:bg-sky-600" },
    { label: "Contact HR", icon: MessageSquare, onClick: () => {}, color: "bg-violet-500 hover:bg-violet-600" },
  ];
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-2">
      {open && actions.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.label}
            onClick={() => { a.onClick(); setOpen(false); }}
            disabled={a.disabled}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all ${a.color} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Icon className="h-4 w-4" /> {a.label}
          </button>
        );
      })}
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-12 w-12 place-items-center rounded-full text-white shadow-xl transition-transform hover:scale-110 active:scale-95"
        style={{ background: "var(--gradient-brand)" }}
        aria-label="Quick actions"
      >
        {open ? <X className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
      </button>
    </div>
  );
}

