import { statusBadgeClass } from "@/lib/status-styles";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertCircle, Briefcase, CalendarDays, Camera, CheckCircle2,
  ChevronDown, ChevronRight, Clock, Coffee, Download,
  Fingerprint, HelpCircle, History, Laptop, LogIn, LogOut,
  MapPin, MessageSquare, Monitor, Play, RefreshCw, Send,
  ShieldCheck, Timer, BarChart3, Wifi, X, Zap,
  CameraOff, Video, User, ScanFace, Sparkles, ShieldAlert,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  attendanceApi,
  TimelineEventItem,
  AttendanceHistoryItem,
  HolidayRecord,
  EmployeeShiftScheduleData,
  AttendancePunchResult,
} from "@/services/attendanceApi";
import { FaceAttendanceDialog, type FaceAttendanceMode } from "../components/FaceAttendanceDialog";

// ── Types ─────────────────────────────────────────────────────
type AttendanceStatus = "not-checked-in" | "checked-in" | "on-break" | "checked-out";

interface AttendanceDay {
  date: number;
  status: "present" | "absent" | "late" | "leave" | "holiday" | "weekend" | "halfday" | "today" | "future";
}

// ── Geolocation Helper with Accuracy ────────────────────────────
function getCoordinates(): Promise<{ lat: number; lng: number; accuracy?: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }),
        () => resolve(null),
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      resolve(null);
    }
  });
}

// ── Utilities ─────────────────────────────────────────────────
function fmtHM(sec: number) {
  if (sec <= 0) return "0h 00m";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function nowDateStr() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Section Header ─────────────────────────────────────────────
function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: any;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {Icon && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div>
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Digital Timer Display ──────────────────────────────────────
function DigitalTimer({ seconds, running }: { seconds: number; running: boolean }) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-opacity ${running ? "opacity-30" : "opacity-10"}`}
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="relative font-mono text-5xl sm:text-7xl font-bold tracking-widest tabular-nums">
        <span className="text-foreground">{h}</span>
        <span className={`text-muted-foreground ${running ? "animate-pulse" : ""}`}>:</span>
        <span className="text-foreground">{m}</span>
        <span className={`text-muted-foreground ${running ? "animate-pulse" : ""}`}>:</span>
        <span style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {s}
        </span>
      </div>
    </div>
  );
}

// ── Timeline Item ─────────────────────────────────────────────
function TimelineItem({ event, isLast }: { event: TimelineEventItem; isLast: boolean }) {
  const iconMap: Record<string, any> = {
    checkin: LogIn,
    checkout: LogOut,
    break_start: Coffee,
    break_end: Play,
  };
  const Icon = iconMap[event.type] || Clock;
  const color =
    event.type === "checkin"
      ? "bg-primary/10 text-primary"
      : event.type === "checkout"
      ? "bg-destructive/10 text-destructive"
      : "bg-muted text-muted-foreground";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${color}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className="pb-4">
        <div className="text-sm font-medium">{event.label}</div>
        <div className="text-xs text-muted-foreground">{event.time}</div>
      </div>
    </div>
  );
}

// ── Calendar Widget ────────────────────────────────────────────
function MiniCalendar({ history }: { history: AttendanceHistoryItem[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Create a fast lookup map for recorded attendance dates
  const historyMap = new Map<string, AttendanceHistoryItem>();
  history.forEach((h) => {
    if (h.date) historyMap.set(h.date, h);
  });

  const statuses: Record<number, AttendanceDay["status"]> = {};
  const todayDate = today.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(year, month, d);
    const dayOfWeek = dayDate.getDay();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    if (d === todayDate) {
      statuses[d] = "today";
    } else if (d > todayDate) {
      statuses[d] = "future";
    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
      statuses[d] = "weekend";
    } else {
      const record = historyMap.get(dateStr);
      if (record) {
        statuses[d] = record.status === "Late" ? "late" : "present";
      } else {
        statuses[d] = "absent";
      }
    }
  }

  const COLOR: Record<string, string> = {
    present: "bg-primary/10 text-primary font-medium",
    absent: "bg-destructive/10 text-destructive",
    late: "bg-muted text-foreground font-medium",
    leave: "bg-muted text-muted-foreground",
    holiday: "bg-primary/15 text-primary",
    weekend: "text-muted-foreground/50",
    halfday: "bg-muted text-foreground",
    today: "ring-2 ring-primary bg-primary/15 text-primary font-bold",
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
          <div key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const s = statuses[day] ?? "future";
          return (
            <div
              key={day}
              className={`flex h-7 w-7 mx-auto items-center justify-center rounded-full text-xs transition-colors cursor-default ${COLOR[s] ?? ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {[
          { color: "bg-primary", label: "Present" },
          { color: "bg-muted-foreground", label: "Late" },
          { color: "bg-destructive", label: "Absent" },
          { color: "bg-muted-foreground/50", label: "Weekend / Off" },
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

// ── Attendance Action Button ───────────────────────────────────
function AttendBtn({
  label,
  icon: Icon,
  onClick,
  disabled,
  variant,
  loading,
}: {
  label: string;
  icon: any;
  onClick: () => void;
  disabled?: boolean;
  variant: "primary" | "success" | "warning" | "danger";
  loading?: boolean;
}) {
  const cls = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    success: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    warning: "bg-muted text-foreground hover:bg-muted/80 border border-border shadow-sm",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
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

// ── Main Page ─────────────────────────────────────────────────
function CheckInPage() {
  const ws = useAurix();
  const user = ws.user;

  // ── States ──────────────────────────────────────────────────
  const [status, setStatus] = useState<AttendanceStatus>("not-checked-in");
  const [loading, setLoading] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [noteEmp, setNoteEmp] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);

  // ── Timers ──────────────────────────────────────────────────
  const [workSec, setWorkSec] = useState(0);
  const [breakSec, setBreakSec] = useState(0);
  const [activeSec, setActiveSec] = useState(0);
  const checkInTimeRef = useRef<Date | null>(null);

  // ── Backend Data ─────────────────────────────────────────────
  const [timeline, setTimeline] = useState<TimelineEventItem[]>([]);
  const [historyList, setHistoryList] = useState<AttendanceHistoryItem[]>([]);
  const [assignedShift, setAssignedShift] = useState<EmployeeShiftScheduleData | null>(null);
  const [holidays, setHolidays] = useState<HolidayRecord[]>([]);
  const [employeeDetails, setEmployeeDetails] = useState<{
    id: string;
    employee_id: string;
    full_name: string;
    department?: string | null;
    designation?: string | null;
  } | null>(null);

  // ── Face Attendance Dialog State ─────────────────────────────
  const [faceModalOpen, setFaceModalOpen] = useState(false);
  const [faceModalMode, setFaceModalMode] = useState<FaceAttendanceMode>("check-in");

  // ── Face Enrollment & Biometric Registration Modal State ─────
  const [isFaceEnrolled, setIsFaceEnrolled] = useState<boolean | null>(null);
  const [enrolledAt, setEnrolledAt] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  // Modal Camera Refs & State for Face Registration
  const [modalCameraActive, setModalCameraActive] = useState(false);
  const [modalCameraError, setModalCameraError] = useState<string | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalStreamRef = useRef<MediaStream | null>(null);

  // ── Toast Helper ─────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error" | "info" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Modal camera handlers for registration
  const startModalCamera = useCallback(async () => {
    setModalCameraError(null);
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      modalStreamRef.current = stream;
      if (modalVideoRef.current) {
        modalVideoRef.current.srcObject = stream;
        modalVideoRef.current.play().catch(() => {});
      }
      setModalCameraActive(true);
    } catch (err: any) {
      console.warn("Modal camera could not be started:", err);
      setModalCameraError(err?.message || "Could not access camera. Please allow camera permissions.");
      setModalCameraActive(false);
    }
  }, []);

  const stopModalCamera = useCallback(() => {
    if (modalStreamRef.current) {
      modalStreamRef.current.getTracks().forEach((track) => track.stop());
      modalStreamRef.current = null;
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.srcObject = null;
    }
    setModalCameraActive(false);
  }, []);

  // High-quality Base64 capture from modal registration video
  const captureModalBase64 = useCallback((): string | null => {
    const video = modalVideoRef.current;
    if (!video || !video.videoWidth) return null;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.95);
    } catch {
      return null;
    }
  }, []);

  // Registration modal unmount and visibility cleanup
  useEffect(() => {
    return () => {
      stopModalCamera();
    };
  }, [stopModalCamera]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopModalCamera();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stopModalCamera]);

  // ── Live Working Clock Ticker ────────────────────────────────
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

  // ── Load Real Attendance State & Face Status from Backend ─────
  const loadAttendanceState = useCallback(async () => {
    setApiError(null);
    try {
      const [punchRes, timelineRes, historyRes, shiftRes, holidaysRes, empRes, faceStatusRes] =
        await Promise.allSettled([
          attendanceApi.getMyTodayStatus(),
          attendanceApi.getTimeline(),
          attendanceApi.getMyAttendanceHistory(1, 20),
          attendanceApi.getMyShiftSchedule(),
          attendanceApi.getHolidays({ year: new Date().getFullYear() }),
          attendanceApi.resolveCurrentEmployee(),
          attendanceApi.getFaceStatus(),
        ]);

      // 1. Process Face Status Check (Mandatory condition check)
      if (faceStatusRes.status === "fulfilled") {
        const fs = faceStatusRes.value;
        setIsFaceEnrolled(Boolean(fs.is_enrolled));
        setEnrolledAt(fs.enrolled_at || null);
      } else {
        setIsFaceEnrolled(false);
      }

      // NOTE: Zero background camera auto-start here. Camera is only activated on user action.

      // 2. Process Punch State
      if (punchRes.status === "fulfilled") {
        const p = punchRes.value;
        if (p.checkedOut) {
          setStatus("checked-out");
        } else if (p.onBreak) {
          setStatus("on-break");
        } else if (p.checkedIn) {
          setStatus("checked-in");
        } else {
          setStatus("not-checked-in");
        }

        if (p.checkInTime) {
          const inDate = new Date(p.checkInTime);
          checkInTimeRef.current = inDate;
          if (p.checkedOut && p.workingHours) {
            setWorkSec(Math.round(p.workingHours * 3600));
          } else {
            const elapsed = Math.max(0, Math.floor((Date.now() - inDate.getTime()) / 1000));
            setWorkSec(elapsed);
          }
        }
        if (p.breakDurationMinutes) {
          setBreakSec(p.breakDurationMinutes * 60);
        }
      }

      // 3. Process Timeline
      if (timelineRes.status === "fulfilled") {
        setTimeline(timelineRes.value || []);
      }

      // 4. Process Attendance History
      if (historyRes.status === "fulfilled") {
        setHistoryList(historyRes.value?.items || []);
      }

      // 5. Process Shift Info
      if (shiftRes.status === "fulfilled") {
        setAssignedShift(shiftRes.value);
      }

      // 6. Process Holidays
      if (holidaysRes.status === "fulfilled") {
        setHolidays(holidaysRes.value || []);
      }

      // 7. Process Employee Details
      if (empRes.status === "fulfilled" && empRes.value) {
        setEmployeeDetails(empRes.value);
      }
    } catch (err: any) {
      console.error("Error loading attendance state:", err);
      setApiError(err?.message || "Failed to load real attendance data from backend.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendanceState();
  }, [loadAttendanceState]);

  // ── Capture & Register Face (Condition A) ────────────────────
  async function handleCaptureAndRegisterFace() {
    setEnrollError(null);
    setIsEnrolling(true);
    try {
      const base64 = captureModalBase64();
      if (!base64) {
        throw new Error("Could not capture image from camera. Please make sure your camera is active and permissions are granted.");
      }

      const res = await attendanceApi.enrollFace(base64);
      const successMsg = res.message || "Face successfully registered!";
      showToast(successMsg, "success");
      sonnerToast.success(successMsg);

      setIsFaceEnrolled(true);
      setShowEnrollModal(false);
      stopModalCamera();
      await loadAttendanceState();
    } catch (err: any) {
      const msg = err?.message || "Face registration failed. Please ensure your face is well-lit and fully visible.";
      setEnrollError(msg);
      showToast(msg, "error");
      sonnerToast.error(msg);
    } finally {
      setIsEnrolling(false);
    }
  }

  // ── Face Check-In Trigger ────────────────────────────────────
  function handleCheckIn() {
    if (isFaceEnrolled === false) {
      setShowEnrollModal(true);
      startModalCamera();
      showToast("Face registration required before check-in.", "error");
      sonnerToast.error("Face registration required before check-in.");
      return;
    }
    if (status !== "not-checked-in") {
      sonnerToast.info(status === "checked-out" ? "You have already completed attendance for today." : "You are already checked in.");
      return;
    }
    setFaceModalMode("check-in");
    setFaceModalOpen(true);
  }

  // ── Face Check-Out Trigger ───────────────────────────────────
  function handleCheckOut() {
    if (status === "not-checked-in") {
      sonnerToast.error("You must check in first before checking out.");
      return;
    }
    if (status === "checked-out") {
      sonnerToast.info("You have already checked out for today.");
      return;
    }
    if (isFaceEnrolled === false) {
      setShowEnrollModal(true);
      startModalCamera();
      sonnerToast.error("Face registration required before check-out.");
      return;
    }
    setFaceModalMode("check-out");
    setFaceModalOpen(true);
  }

  // ── Successful Face Punch Callback ───────────────────────────
  const handleFaceSuccess = useCallback(
    async (result: AttendancePunchResult) => {
      let defaultMsg = "Attendance verified successfully!";
      if (faceModalMode === "check-in") {
        defaultMsg = "Attendance verified & check-in marked successfully!";
      } else if (faceModalMode === "check-out") {
        defaultMsg = "Attendance verified & check-out marked successfully!";
      } else if (faceModalMode === "break-in") {
        defaultMsg = "Break started. Face verified.";
      } else if (faceModalMode === "break-out") {
        defaultMsg = "Break ended. Welcome back!";
      }
      const msg = result.message || defaultMsg;
      showToast(msg, "success");
      sonnerToast.success(msg);
      await loadAttendanceState();
    },
    [faceModalMode, loadAttendanceState]
  );

  // ── Break In & Out Controls (Face-Verified) ───────────────────
  function handleBreakIn() {
    if (status !== "checked-in") {
      const msg =
        status === "on-break"
          ? "You are already on a break."
          : status === "checked-out"
          ? "You have already completed attendance for today."
          : "You must be checked in to start a break.";
      showToast(msg, "info");
      sonnerToast.info(msg);
      return;
    }
    if (isFaceEnrolled === false) {
      setShowEnrollModal(true);
      startModalCamera();
      showToast("Face registration required before starting break.", "error");
      sonnerToast.error("Face registration required before starting break.");
      return;
    }
    setFaceModalMode("break-in");
    setFaceModalOpen(true);
  }

  function handleBreakOut() {
    if (status !== "on-break") {
      const msg =
        status === "checked-in"
          ? "You are not currently on a break."
          : status === "checked-out"
          ? "You have already completed attendance for today."
          : "You must be on a break to end break.";
      showToast(msg, "info");
      sonnerToast.info(msg);
      return;
    }
    if (isFaceEnrolled === false) {
      setShowEnrollModal(true);
      startModalCamera();
      showToast("Face registration required before ending break.", "error");
      sonnerToast.error("Face registration required before ending break.");
      return;
    }
    setFaceModalMode("break-out");
    setFaceModalOpen(true);
  }

  // ── Overtime & Late calculation based on real backend data ────
  const expectedHours = assignedShift?.currentShift?.totalWorkingHours ?? null;
  const overtimeSec = expectedHours != null ? Math.max(0, workSec - expectedHours * 3600) : 0;

  const shiftStartStr = assignedShift?.currentShift?.startTime;
  const graceMinutes = assignedShift?.currentShift?.gracePeriodMinutes ?? 0;

  const lateBy = (() => {
    if (!checkInTimeRef.current || !shiftStartStr) return 0;
    const checkInDate = new Date(checkInTimeRef.current);
    let shiftH = 0;
    let shiftM = 0;
    const is12Hour = shiftStartStr.includes("AM") || shiftStartStr.includes("PM");
    if (is12Hour) {
      const parts = shiftStartStr.trim().split(/\s+/);
      const [hStr, mStr] = (parts[0] || "").split(":");
      let h = parseInt(hStr, 10) || 0;
      const m = parseInt(mStr, 10) || 0;
      if (parts[1]?.toUpperCase() === "PM" && h < 12) h += 12;
      if (parts[1]?.toUpperCase() === "AM" && h === 12) h = 0;
      shiftH = h;
      shiftM = m;
    } else {
      const [hStr, mStr] = shiftStartStr.split(":");
      shiftH = parseInt(hStr, 10) || 0;
      shiftM = parseInt(mStr, 10) || 0;
    }

    const shiftStart = new Date(checkInDate);
    shiftStart.setHours(shiftH, shiftM, 0, 0);
    const diffSec = Math.floor((checkInDate.getTime() - shiftStart.getTime()) / 1000);
    const graceSec = graceMinutes * 60;
    return diffSec > graceSec ? diffSec : 0;
  })();

  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "EM";

  // System/device info
  const browserInfo = (() => {
    if (typeof navigator === "undefined") return "Web Browser";
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edge")) return "Edge";
    return "Browser";
  })();

  const platformInfo = typeof navigator !== "undefined" ? navigator.platform || "Desktop" : "Desktop";
  const onlineStatus = typeof navigator !== "undefined" && navigator.onLine ? "Online" : "Offline";
  const screenSize = typeof window !== "undefined" ? `${window.screen.width} × ${window.screen.height}` : "Desktop";

  if (pageLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Connecting to attendance services...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-16">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-primary text-primary-foreground"
              : toast.type === "error"
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted text-foreground border border-border"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* API Error Notification */}
      {apiError && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadAttendanceState} className="gap-1 text-xs">
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      )}

      {/* ── Mandatory Face Registration Alert Banner (Condition A) ── */}
      {isFaceEnrolled === false && (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <ScanFace className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm sm:text-base font-semibold text-foreground">
                    Face Registration Required
                  </h3>
                  <Badge variant="outline" className={`text-[10px] font-bold ${statusBadgeClass("warning")}`}>Mandatory</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Your biometric face profile is not registered. In accordance with company policy, face enrollment is mandatory before you can check in for attendance.
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setShowEnrollModal(true);
                startModalCamera();
              }}
              className="w-full sm:w-auto shrink-0 gap-2"
            >
              <ScanFace className="h-4 w-4" />
              Register Face Now
            </Button>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left 2 Cols: Check-in, Timer, Actions, History */}
        <div className="space-y-6 xl:col-span-2">
          {/* ── Check In / Hero Card ── */}
          <GlassCard className="relative overflow-hidden">
            <div className="relative">
              {/* Header: User avatar + info */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
  status === "checked-in" ? "bg-primary" : status === "on-break" ? "bg-muted-foreground" : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{user?.fullName || "Employee"}</h2>
                    </div>
                    {employeeDetails?.employee_id && (
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> EMP-{employeeDetails.employee_id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Working hours today */}
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Working Today</div>
                  <div className="font-mono text-2xl font-bold tabular-nums">{fmtHM(workSec)}</div>
                  <div className="text-xs text-muted-foreground">
                    {status === "checked-in" ? "Shift in progress" : status === "checked-out" ? "Shift completed" : "Awaiting check-in"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="relative">
                  <AttendBtn
                    label={
                      isFaceEnrolled === false
                        ? "Face Required"
                        : status === "checked-in" || status === "on-break"
                        ? "Checked In Today"
                        : status === "checked-out"
                        ? "Day Complete"
                        : "Face Check-In"
                    }
                    icon={LogIn}
                    onClick={handleCheckIn}
                    disabled={status !== "not-checked-in" || isFaceEnrolled === false || loading !== null || faceModalOpen}
                    variant="success"
                    loading={loading === "checkin"}
                  />
                  {isFaceEnrolled === false && (
                    <span className="absolute -top-2 right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-extrabold text-primary-foreground uppercase tracking-wide shadow-sm">
                      Enroll First
                    </span>
                  )}
                </div>
                <AttendBtn
                  label="Break In"
                  icon={Coffee}
                  onClick={handleBreakIn}
                  disabled={status !== "checked-in" || loading !== null || faceModalOpen}
                  variant="warning"
                  loading={loading === "breakin"}
                />
                <AttendBtn
                  label="Break Out"
                  icon={Play}
                  onClick={handleBreakOut}
                  disabled={status !== "on-break" || loading !== null || faceModalOpen}
                  variant="primary"
                  loading={loading === "breakout"}
                />
                <AttendBtn
                  label={
                    status === "not-checked-in"
                      ? "Check In First"
                      : status === "checked-out"
                      ? "Checked Out Today"
                      : "Face Check-Out"
                  }
                  icon={LogOut}
                  onClick={handleCheckOut}
                  disabled={(status !== "checked-in" && status !== "on-break") || loading !== null || faceModalOpen}
                  variant="danger"
                  loading={loading === "checkout"}
                />
              </div>

              {/* Status bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
status === "checked-in" ? "bg-primary animate-pulse" : status === "on-break" ? "bg-muted-foreground animate-pulse" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="font-medium">
                    {status === "not-checked-in"
                      ? "Not Checked In"
                      : status === "checked-in"
                      ? "Currently Working"
                      : status === "on-break"
                      ? "On Break"
                      : "Day Complete"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <span>
                    Break: <strong className="text-foreground">{fmtHM(breakSec)}</strong>
                  </span>
                  <span>
                    OT: <strong className={overtimeSec > 0 ? "text-primary" : "text-foreground"}>{fmtHM(overtimeSec)}</strong>
                  </span>
                  {lateBy > 0 && (
                    <span>
                      Late by: <strong className="text-foreground">{fmtHM(lateBy)}</strong>
                    </span>
                  )}
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
                  { label: "Total Work", value: fmtHM(workSec) },
                  { label: "Active Time", value: fmtHM(activeSec) },
                  { label: "Break Time", value: fmtHM(breakSec) },
                  { label: "Overtime", value: fmtHM(overtimeSec) },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.label}</div>
                    <div className="font-mono text-lg font-bold tabular-nums text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* ── Today's Summary ── */}
          <div>
            <SectionHeader title="Today's Summary" icon={BarChart3} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard
                label="Working Hours"
                value={fmtHM(workSec)}
                hint={assignedShift?.currentShift?.totalWorkingHours ? `Expected: ${assignedShift.currentShift.totalWorkingHours}h` : "Flexible"}
                icon={Clock}
                accent="brand"
              />
              <StatCard
                label="Break Duration"
                value={fmtHM(breakSec)}
                hint={assignedShift?.currentShift?.breakDuration ? `Standard: ${assignedShift.currentShift.breakDuration}` : "Recorded time"}
                icon={Coffee}
                accent="warning"
              />
              <StatCard
                label="Overtime"
                value={fmtHM(overtimeSec)}
                hint={overtimeSec > 0 ? "Eligible for OT" : "Standard hours"}
                icon={Zap}
                accent="success"
              />
              <StatCard
                label="Late By"
                value={lateBy > 0 ? fmtHM(lateBy) : "On Time"}
                hint={assignedShift?.currentShift?.gracePeriodMinutes ? `Grace: ${assignedShift.currentShift.gracePeriodMinutes}m` : "Standard timing"}
                icon={AlertCircle}
                accent={lateBy > 0 ? "danger" : "success"}
              />
              <StatCard
                label="Check In Time"
                value={checkInTimeRef.current ? checkInTimeRef.current.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—"}
                hint={checkInTimeRef.current ? "Recorded today" : "Pending check-in"}
                icon={LogIn}
                accent="brand"
              />
              <StatCard
                label="Current Status"
                value={status === "checked-in" ? "Working" : status === "on-break" ? "On Break" : status === "checked-out" ? "Checked Out" : "Not In"}
                hint={nowDateStr()}
                icon={CheckCircle2}
                accent={status === "checked-in" ? "success" : "muted"}
              />
            </div>
          </div>

          {/* ── Two-col grid: Timeline + Shift Info ── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Timeline */}
            <GlassCard>
              <SectionHeader title="Today's Timeline" icon={History} />
              {timeline.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-foreground">No events yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Check in to start recording today's activity.</p>
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
                  {
                    label: "Shift Name",
                    value: assignedShift?.currentShift?.shiftName || "Not Assigned",
                  },
                  {
                    label: "Timing",
                    value:
                      assignedShift?.currentShift?.startTime && assignedShift?.currentShift?.endTime
                        ? `${assignedShift.currentShift.startTime} – ${assignedShift.currentShift.endTime}`
                        : "Flexible Schedule",
                  },
                  {
                    label: "Working Days",
                    value: assignedShift?.currentShift?.workingDays?.join(", ") || "Flexible",
                  },
                  {
                    label: "Expected Hours",
                    value: assignedShift?.currentShift?.totalWorkingHours
                      ? `${assignedShift.currentShift.totalWorkingHours}h 00m`
                      : "—",
                  },
                  {
                    label: "Grace Time",
                    value:
                      assignedShift?.currentShift?.gracePeriodMinutes != null
                        ? `${assignedShift.currentShift.gracePeriodMinutes} minutes`
                        : "—",
                  },
                  {
                    label: "Break Duration",
                    value: assignedShift?.currentShift?.breakDuration || "—",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                    <span className="text-muted-foreground text-xs">{row.label}</span>
                    <span className="font-medium text-xs">{row.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ── Two-col grid: Biometric Face Attendance + Device ── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Live Face Attendance Biometric Card */}
            <GlassCard className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Biometric Face Attendance" icon={ScanFace} />
                {isFaceEnrolled !== null && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(isFaceEnrolled ? "approved" : "warning")}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isFaceEnrolled ? "bg-primary" : "bg-muted-foreground animate-pulse"}`} />
                    {isFaceEnrolled ? "Face Profile Active" : "Registration Required"}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-foreground">
                        Touchless Biometric AI Attendance
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Automatic face capture with backend 3D neural vector matching. No manual photo-clicking needed.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Live Liveness Check</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>GPS Geofence Validation</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div>
                  {isFaceEnrolled === false ? (
                    <Button
                      onClick={() => {
                        setShowEnrollModal(true);
                        startModalCamera();
                      }}
                      className="w-full gap-2 text-xs"
                    >
                      <ScanFace className="h-4 w-4" /> Register Face Profile
                    </Button>
                  ) : status === "not-checked-in" ? (
                    <Button
                      onClick={handleCheckIn}
                      className="w-full gap-2 text-xs"
                    >
                      <LogIn className="h-4 w-4" /> Start Face Check-In
                    </Button>
                  ) : status === "checked-in" || status === "on-break" ? (
                    <Button
                      onClick={handleCheckOut}
                      variant="destructive" className="w-full gap-2 text-xs"
                    >
                      <LogOut className="h-4 w-4" /> Start Face Check-Out
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-full gap-2 text-xs font-semibold bg-muted text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Day Completed
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Device Information */}
            <GlassCard>
              <SectionHeader title="Device Information" icon={Monitor} />
              <div className="space-y-2 text-xs">
                {[
                  { label: "Browser", value: browserInfo, icon: Laptop },
                  { label: "Operating System", value: platformInfo, icon: Monitor },
                  { label: "Display Resolution", value: screenSize, icon: Monitor },
                  { label: "Network State", value: onlineStatus, icon: Wifi },
                  { label: "Session Security", value: "Authenticated via JWT", icon: ShieldCheck },
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
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Daily Attendance Note
                  </label>
                  <Textarea
                    className="mt-1.5 resize-none text-sm"
                    rows={3}
                    placeholder="Add an optional note for today's punch..."
                    value={noteEmp}
                    onChange={(e) => setNoteEmp(e.target.value)}
                  />
                </div>
                <Button size="sm" className="gap-2" onClick={() => showToast("Note will be saved with next punch", "info")}>
                  <Send className="h-3.5 w-3.5" /> Save Note
                </Button>
              </div>
            )}
          </GlassCard>

          {/* ── Calendar ── */}
          <GlassCard>
            <SectionHeader title="Monthly Attendance Calendar" icon={CalendarDays} />
            <MiniCalendar history={historyList} />
          </GlassCard>

          {/* ── Real Attendance History Table ── */}
          <GlassCard className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-sm">Recent Attendance History</h2>
              </div>
            </div>

            {historyList.length === 0 ? (
              <div className="py-12 text-center">
                <History className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium text-foreground">No attendance records found.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your daily check-in and check-out records from the database will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                      {["Date", "Check In", "Check Out", "Working Hours", "Status", "Location"].map((h) => (
                        <th key={h} className="px-3 py-2.5 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map((r) => (
                      <tr key={r.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                        <td className="px-3 py-2.5 font-medium text-xs">{r.date}</td>
                        <td className="px-3 py-2.5 text-xs font-mono">{r.checkInTime || "—"}</td>
                        <td className="px-3 py-2.5 text-xs font-mono">{r.checkOutTime || "—"}</td>
                        <td className="px-3 py-2.5 text-xs font-semibold">
                          {r.workingHours ? fmtHM(r.workingHours * 3600) : "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant="outline"
                            className={`inline-flex items-center text-[10px] font-medium ${statusBadgeClass(r.status)}`}
                          >
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.location || "Office"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>

        {/* ── Right Sidebar: Real Upcoming Holidays & Dynamic Notifications ── */}
        <div className="space-y-5">
          {/* Dynamic Notifications */}
          <GlassCard>
            <SectionHeader title="Today's Status" icon={CheckCircle2} />
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-3 rounded-lg border border-border/40 p-2.5">
                <div
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
                >
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {status === "checked-in"
                      ? "Active Shift"
                      : status === "on-break"
                      ? "On Break"
                      : status === "checked-out"
                      ? "Shift Finished"
                      : "Awaiting Punch"}
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    {checkInTimeRef.current
                      ? `Checked in at ${checkInTimeRef.current.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
                      : "Punch in to begin recording today's work hours."}
                  </div>
                </div>
              </div>

              {lateBy > 0 && (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-2.5">
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Late Punch Alert</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Shift arrival was recorded after the standard 15-minute grace window.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Real Upcoming Holidays */}
          <GlassCard>
            <SectionHeader title="Upcoming Holidays" icon={CalendarDays} />
            {holidays.length === 0 ? (
              <div className="py-6 text-center">
                <CalendarDays className="mx-auto mb-2 h-7 w-7 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">No upcoming holidays found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {holidays.slice(0, 5).map((h) => (
                  <div
                    key={h.id || h.date}
                    className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium">{h.name}</div>
                      <div className="text-[10px] text-muted-foreground">{h.type || "Company Holiday"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold">{h.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick Links */}
          <GlassCard>
            <SectionHeader title="Quick Links" icon={Zap} />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "My Leaves", icon: CalendarDays, href: "/dashboard/leaves" },
                { label: "My Shifts", icon: Clock, href: "/dashboard/attendance/shifts" },
                { label: "My Roster", icon: CalendarDays, href: "/dashboard/attendance/rosters" },
                { label: "Holidays", icon: CalendarDays, href: "/dashboard/attendance/holidays" },
                { label: "Support", icon: HelpCircle, href: "/dashboard/help/raise-ticket" },
                { label: "Directory", icon: User, href: "/dashboard/workforce" },
              ].map((ql) => {
                const Icon = ql.icon;
                return (
                  <a
                    key={ql.label}
                    href={ql.href}
                    className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium transition-colors hover:bg-accent/60 hover:border-border"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {ql.label}
                  </a>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── Automated Face Attendance Verification Dialog (Check-In, Check-Out, Break-In & Break-Out) ── */}
      <FaceAttendanceDialog
        open={faceModalOpen}
        mode={faceModalMode}
        onOpenChange={setFaceModalOpen}
        onSuccess={handleFaceSuccess}
        employeeDetails={employeeDetails}
        currentUser={user}
        notes={noteEmp}
      />

      {/* ── Face Registration Required Modal (Condition A) ── */}
      <Dialog
        open={showEnrollModal}
        onOpenChange={(open) => {
          setShowEnrollModal(open);
          if (open) {
            setEnrollError(null);
            startModalCamera();
          } else {
            stopModalCamera();
          }
        }}
      >
        <DialogContent className="max-w-md p-6 sm:rounded-2xl border-border bg-card">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Biometric Registration
            </div>
            <DialogTitle className="font-display text-lg font-bold">Face Registration Required</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Center your face inside the oval guide outline. Ensure clear ambient lighting and look directly into the camera.
            </DialogDescription>
          </DialogHeader>

          {/* Webcam Viewport with Centered Oval Guide */}
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-black/95 overflow-hidden border border-border flex items-center justify-center">
            <video
              ref={modalVideoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${modalCameraActive ? "block" : "hidden"}`}
            />

            {!modalCameraActive && (
              <div className="flex flex-col items-center gap-2.5 p-6 text-center text-muted-foreground">
                <CameraOff className="h-10 w-10 text-muted-foreground/40" />
                <span className="text-xs font-medium text-foreground">Webcam Inactive</span>
                {modalCameraError && <span className="text-[11px] text-destructive max-w-xs">{modalCameraError}</span>}
                <Button size="sm" variant="outline" className="mt-1 gap-1.5 text-xs" onClick={startModalCamera}>
                  <Video className="h-3.5 w-3.5" /> Enable Webcam
                </Button>
              </div>
            )}

            {/* Centered Circular/Oval Face Guide Overlay */}
            {modalCameraActive && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-3">
                <div className="relative w-44 h-56 sm:w-48 sm:h-60 rounded-[50%] border-2 border-primary shadow-sm">
                  {/* Viewfinder reticle brackets */}
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-white" />
                </div>

                <div className="mt-3 rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] text-white border border-white/10 flex items-center gap-1.5">
                  <ScanFace className="h-3 w-3 text-primary" /> Keep face centered inside the frame
                </div>
              </div>
            )}
          </div>

          {/* Quick Best Practice Guidelines */}
          <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground text-center">
            <div className="rounded-xl bg-muted/40 p-2 border border-border/40">
              <span className="font-semibold text-foreground block">Good Lighting</span>
              Avoid dark shadows
            </div>
            <div className="rounded-xl bg-muted/40 p-2 border border-border/40">
              <span className="font-semibold text-foreground block">Look Straight</span>
              Level with camera
            </div>
            <div className="rounded-xl bg-muted/40 p-2 border border-border/40">
              <span className="font-semibold text-foreground block">Neutral Pose</span>
              No masks or glasses
            </div>
          </div>

          {/* Error Message if registration failed */}
          {enrollError && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{enrollError}</span>
            </div>
          )}

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowEnrollModal(false);
                stopModalCamera();
              }}
              disabled={isEnrolling}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCaptureAndRegisterFace}
              disabled={!modalCameraActive || isEnrolling}
              className="gap-2 text-xs"
            >
              {isEnrolling ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ScanFace className="h-3.5 w-3.5" />}
              {isEnrolling ? "Registering Face Profile..." : "Capture & Register Face"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CheckInPage;
