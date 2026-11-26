import { statusBadgeClass } from "@/lib/status-styles";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  AlertCircle, Briefcase, CalendarDays, Camera, CheckCircle2,
  ChevronDown, ChevronRight, Clock, Coffee, Download,
  Fingerprint, HelpCircle, History, Laptop, LogIn, LogOut,
  MapPin, MessageSquare, Monitor, Play, RefreshCw, Send,
  ShieldCheck, Timer, BarChart3, Wifi, X, Zap,
  CameraOff, Video, User, ScanFace, Sparkles, ShieldAlert, Upload,
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
  AttendancePunchResult,
  FaceAttendanceStatus,
  AttendanceTodayResponse,
  TodayPunchStatus,
  AttendanceShiftSummary,
  extractErrorCode,
} from "@/services/attendance";
import { ConfirmAlertDialog } from "@/components/ui/confirm-alert-dialog";
import { formatHHmmTo12h } from "@/lib/datetime";
import { FaceAttendanceDialog, type FaceAttendanceMode } from "../components/FaceAttendanceDialog";

// ── Attendance State Machine Types ─────────────────────────────
type AttendanceState = 
  | "LOADING"
  | "STATUS_UNAVAILABLE"
  | "NOT_CHECKED_IN"
  | "VERIFYING"
  | "CHECKED_IN"
  | "ON_BREAK"
  | "CHECKED_OUT";

type FaceEnrollmentState = "ENROLLED" | "NOT_ENROLLED" | "STATUS_UNAVAILABLE";

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
interface CalendarDayStatus {
  date: string;
  status: "present" | "absent" | "late" | "leave" | "holiday" | "weekend" | "halfday" | "today" | "future" | "not_scheduled";
  shiftName?: string;
  isOff?: boolean;
  holidayName?: string;
}

function MiniCalendar({ 
  history, 
  todayAttendance,
  holidays,
  shiftSchedule 
}: { 
  history: AttendanceHistoryItem[]; 
  todayAttendance: AttendanceTodayResponse | null;
  holidays: HolidayRecord[];
  shiftSchedule?: { workingDays: string[] } | null;
}) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Create lookup maps
  const historyMap = new Map<string, AttendanceHistoryItem>();
  history.forEach((h) => {
    if (h.date) historyMap.set(h.date, h);
  });

  const holidayMap = new Map<string, HolidayRecord>();
  holidays.forEach((h) => {
    if (h.date) holidayMap.set(h.date, h);
  });

  const workingDaysSet = new Set(shiftSchedule?.workingDays?.map(d => d.toLowerCase().slice(0, 3)) || ["mon", "tue", "wed", "thu", "fri"]);

  const statuses: Record<number, CalendarDayStatus> = {};
  const todayDate = today.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(year, month, d);
    const dayOfWeek = dayDate.getDay();
    const dayName = dayDate.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isWorkingDay = workingDaysSet.has(dayName);

    const holiday = holidayMap.get(dateStr);
    const record = historyMap.get(dateStr);

    if (d === todayDate) {
      statuses[d] = { date: dateStr, status: "today", shiftName: todayAttendance?.shift?.shift_name };
    } else if (d > todayDate) {
      statuses[d] = { date: dateStr, status: "future" };
    } else if (holiday) {
      statuses[d] = { date: dateStr, status: "holiday", holidayName: holiday.name };
    } else if (!isWorkingDay) {
      statuses[d] = { date: dateStr, status: "weekend" };
    } else if (record) {
      statuses[d] = { 
        date: dateStr, 
        status: record.status === "Late" ? "late" : record.status === "Absent" ? "absent" : "present",
        shiftName: record.shiftName
      };
    } else {
      // No record on a working day - could be absent or not yet processed
      statuses[d] = { date: dateStr, status: "not_scheduled" };
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
    not_scheduled: "bg-muted/30 text-muted-foreground/50",
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
          const dayStatus = statuses[day] ?? { status: "future" };
          const s = dayStatus.status;
          return (
            <div
              key={day}
              className={`flex h-7 w-7 mx-auto items-center justify-center rounded-full text-xs transition-colors cursor-default ${COLOR[s] ?? ""}`}
              title={dayStatus.holidayName || dayStatus.shiftName || ""}
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
          { color: "bg-primary/15", label: "Holiday" },
          { color: "bg-muted/30", label: "Not Scheduled" },
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
 
// ── Helper Functions ─────────────────────────────────────────
function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function calculateLateMinutes(checkInTimeStr: string, shift: AttendanceShiftSummary): number {
  const checkInDate = new Date(checkInTimeStr);
  if (isNaN(checkInDate.getTime())) return 0;
  
  const shiftStartStr = shift.start_time;
  const graceMinutes = shift.grace_period_mins ?? 0;
  
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
  return diffSec > graceSec ? Math.floor(diffSec / 60) : 0;
}

function checkLate(checkInTimeStr: string, shift: AttendanceShiftSummary): boolean {
  return calculateLateMinutes(checkInTimeStr, shift) > 0;
}
 
// ── Main Page ─────────────────────────────────────────────────
function CheckInPage() {
  const ws = useAurix();
  const user = ws.user;

  // ── Attendance State Machine ─────────────────────────────────
  const [attendanceState, setAttendanceState] = useState<AttendanceState>("LOADING");
  const [faceEnrollmentState, setFaceEnrollmentState] = useState<FaceEnrollmentState>("STATUS_UNAVAILABLE");
  const [loading, setLoading] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [noteEmp, setNoteEmp] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);

  // ── Timer State ──────────────────────────────────────────────
  const [timerState, setTimerState] = useState<{
    workSec: number;
    breakSec: number;
    activeSec: number;
    checkInTime: Date | null;
    breakStartTime: Date | null;
  }>({
    workSec: 0,
    breakSec: 0,
    activeSec: 0,
    checkInTime: null,
    breakStartTime: null,
  });

  // ── Backend Data ─────────────────────────────────────────────
  const [timeline, setTimeline] = useState<TimelineEventItem[]>([]);
  const [historyList, setHistoryList] = useState<AttendanceHistoryItem[]>([]);
  const [faceAttendanceStatus, setFaceAttendanceStatus] = useState<FaceAttendanceStatus | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceTodayResponse | null>(null);
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
  const [enrolledAt, setEnrolledAt] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showReEnrollConfirm, setShowReEnrollConfirm] = useState(false);
  const [pendingEnrollBase64, setPendingEnrollBase64] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  // Modal Camera Refs & State for Face Registration
  const [modalCameraActive, setModalCameraActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [modalCameraError, setModalCameraError] = useState<string | null>(null);
  const [uploadedPhotoBase64, setUploadedPhotoBase64] = useState<string | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Toast Helper ─────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Modal camera handlers for registration
  const stopModalCamera = useCallback(() => {
    if (modalStreamRef.current) {
      modalStreamRef.current.getTracks().forEach((track) => track.stop());
      modalStreamRef.current = null;
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.srcObject = null;
    }
    setModalCameraActive(false);
    setIsCameraStarting(false);
  }, []);

  const startModalCamera = useCallback(async () => {
    setModalCameraError(null);
    setIsCameraStarting(true);
    setUploadedPhotoBase64(null);

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Webcam access is not supported in this browser or requires a secure HTTPS connection.");
      }

      if (modalStreamRef.current) {
        modalStreamRef.current.getTracks().forEach((t) => t.stop());
        modalStreamRef.current = null;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      modalStreamRef.current = stream;
      if (modalVideoRef.current) {
        modalVideoRef.current.srcObject = stream;
        try {
          await modalVideoRef.current.play();
        } catch {
          // Ignore autoplay restriction errors if any
        }
      }
      setModalCameraActive(true);
      setModalCameraError(null);
    } catch (err: any) {
      console.warn("Modal camera could not be started:", err);
      let errMsg = "Could not access camera. Please allow camera permissions.";
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        errMsg = "Camera permission was denied. Please allow camera access in your browser settings (look for the lock/camera icon in your address bar), then click Enable Webcam.";
      } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
        errMsg = "No camera found on your device. You can upload a face photo instead.";
      } else if (err?.name === "NotReadableError" || err?.name === "TrackStartError") {
        errMsg = "Camera is currently used by another program or browser tab. Please close other camera apps and retry.";
      } else if (err?.message) {
        errMsg = err.message;
      }
      setModalCameraError(errMsg);
      setModalCameraActive(false);
    } finally {
      setIsCameraStarting(false);
    }
  }, []);

  // Callback ref so stream binds immediately when <video> mounts
  const setModalVideoRef = useCallback((node: HTMLVideoElement | null) => {
    modalVideoRef.current = node;
    if (node && modalStreamRef.current) {
      node.srcObject = modalStreamRef.current;
      node.play().catch(() => {});
    }
  }, []);

  // Auto-start camera when modal opens, and cleanly stop when closed
  useEffect(() => {
    if (showEnrollModal) {
      setEnrollError(null);
      setUploadedPhotoBase64(null);
      startModalCamera();
    } else {
      stopModalCamera();
      setUploadedPhotoBase64(null);
      setEnrollError(null);
    }
  }, [showEnrollModal, startModalCamera, stopModalCamera]);

  // Handle photo upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEnrollError("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setEnrollError("Image file size should be less than 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) {
        setUploadedPhotoBase64(result);
        stopModalCamera();
        setEnrollError(null);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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

  // Registration modal unmount and visibility cleanup/resume
  useEffect(() => {
    return () => {
      stopModalCamera();
    };
  }, [stopModalCamera]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopModalCamera();
      } else if (showEnrollModal && !uploadedPhotoBase64) {
        startModalCamera();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stopModalCamera, startModalCamera, showEnrollModal, uploadedPhotoBase64]);

  // ── Derived values from timer state ──────────────────────────
  const { workSec, breakSec, activeSec, checkInTime, breakStartTime } = timerState;

  // ── Live Working Clock Ticker (timestamp-based, no drift) ────
  useEffect(() => {
    if (attendanceState !== "CHECKED_IN" && attendanceState !== "ON_BREAK") return;

    const tick = () => {
      setTimerState((prev) => {
        const now = Date.now();
        let work = 0;
        let active = 0;
        let brk = prev.breakSec;

        if (prev.checkInTime) {
          const elapsed = Math.max(0, Math.floor((now - prev.checkInTime.getTime()) / 1000));
          work = elapsed;
          
          if (attendanceState === "CHECKED_IN") {
            active = Math.max(0, elapsed - prev.breakSec);
          } else if (attendanceState === "ON_BREAK" && prev.breakStartTime) {
            const breakElapsed = Math.max(0, Math.floor((now - prev.breakStartTime.getTime()) / 1000));
            brk = prev.breakSec - breakElapsed + breakElapsed; // current break session elapsed
            active = Math.max(0, elapsed - brk);
          }
        }

        return { ...prev, workSec: work, breakSec: brk, activeSec: active };
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [attendanceState]);

  // ── Load Real Attendance State from Backend (single canonical call) ─────
  const loadAttendanceState = useCallback(async () => {
    setApiError(null);
    setAttendanceState("LOADING");
    setFaceEnrollmentState("STATUS_UNAVAILABLE");

    try {
      const [punchRes, timelineRes, historyRes, faceStatusRes, holidaysRes, empRes] =
        await Promise.allSettled([
          attendanceApi.getMyTodayStatus(),
          attendanceApi.getTimeline(),
          attendanceApi.getMyAttendanceHistory(1, 20),
          attendanceApi.getFaceAttendanceStatus(),
          attendanceApi.getHolidays({ year: new Date().getFullYear() }),
          attendanceApi.resolveCurrentEmployee(),
        ]);

      // 1. Process Face Enrollment Status (authoritative)
      if (faceStatusRes.status === "fulfilled") {
        const fs = faceStatusRes.value;
        setFaceAttendanceStatus(fs);
        if (fs.faceRegistered === true) {
          setFaceEnrollmentState("ENROLLED");
          setEnrolledAt(fs.enrolled_at || null);
        } else if (fs.faceRegistered === false) {
          setFaceEnrollmentState("NOT_ENROLLED");
        } else {
          setFaceEnrollmentState("STATUS_UNAVAILABLE");
        }
      } else if (faceStatusRes.status === "rejected") {
        const err = faceStatusRes.reason;
        const errorCode = extractErrorCode(err);
        if (errorCode === "FACE_NOT_ENROLLED" || 
            errorCode === "face_not_enrolled" ||
            err?.message?.toLowerCase().includes("face not enrolled") ||
            err?.message?.toLowerCase().includes("not enrolled")) {
          setFaceEnrollmentState("NOT_ENROLLED");
        } else {
          setFaceEnrollmentState("STATUS_UNAVAILABLE");
        }
      }

      // 2. Process Today's Attendance (single source of truth)
      // Combine data from punchRes (TodayPunchStatus) and faceStatusRes (FaceAttendanceStatus)
      let todayData: AttendanceTodayResponse | null = null;
      let faceData: FaceAttendanceStatus | null = null;
      
      if (punchRes.status === "fulfilled") {
        const punchData = punchRes.value as TodayPunchStatus;
        faceData = faceStatusRes.status === "fulfilled" ? faceStatusRes.value : null;
        
        // Build AttendanceTodayResponse from both sources
        todayData = {
          checked_in: punchData.checkedIn,
          checked_out: punchData.checkedOut,
          check_in_time: punchData.checkInTime,
          check_out_time: punchData.checkOutTime,
          working_hours: punchData.workingHours,
          break_duration_hours: punchData.breakDurationMinutes ? punchData.breakDurationMinutes / 60 : null,
          total_break_minutes: punchData.breakDurationMinutes ?? null,
          is_on_break: punchData.onBreak,
          current_break: null, // Will be populated from faceData if available
          breaks: null,
          is_late: faceData?.shift ? (punchData.checkInTime ? checkLate(punchData.checkInTime, faceData.shift) : false) : false,
          late_minutes: 0, // Will be calculated
          shift: faceData?.shift ?? null,
          is_face_enrolled: faceData?.faceRegistered ?? false,
          face_enrolled_at: faceData?.enrolled_at ?? null,
          verification_status: faceData?.message ?? null,
          employee: null, // Will be populated from empRes
          today_attendance: null,
          timezone: faceData?.timezone,
        };
        
        // Calculate late_minutes if we have check_in_time and shift
        if (todayData.check_in_time && todayData.shift) {
          todayData.late_minutes = calculateLateMinutes(todayData.check_in_time, todayData.shift);
          todayData.is_late = todayData.late_minutes > 0;
        }
        
        setTodayAttendance(todayData);
      }

      // 3. Derive attendance state from backend response
      let derivedState: AttendanceState = "NOT_CHECKED_IN";
      if (todayData) {
        if (todayData.checked_out) {
          derivedState = "CHECKED_OUT";
        } else if (todayData.is_on_break) {
          derivedState = "ON_BREAK";
        } else if (todayData.checked_in) {
          derivedState = "CHECKED_IN";
        } else {
          derivedState = "NOT_CHECKED_IN";
        }
      }
      setAttendanceState(derivedState);

      // 4. Initialize timer state from backend timestamps
      if (todayData) {
        let checkInTs: Date | null = null;
        let breakStartTs: Date | null = null;
        let totalBreakSec = 0;

        if (todayData.check_in_time) {
          const d = new Date(todayData.check_in_time);
          if (!isNaN(d.getTime())) checkInTs = d;
        }

        if (todayData.current_break?.break_start) {
          const d = new Date(todayData.current_break.break_start);
          if (!isNaN(d.getTime())) breakStartTs = d;
        }

        if (todayData.total_break_minutes) {
          totalBreakSec = todayData.total_break_minutes * 60;
        } else if (todayData.break_duration_hours) {
          totalBreakSec = Math.round(todayData.break_duration_hours * 3600);
        }

        const now = Date.now();
        let work = 0;
        let active = 0;

        if (checkInTs) {
          const elapsed = Math.max(0, Math.floor((now - checkInTs.getTime()) / 1000));
          work = elapsed;
          
          if (derivedState === "CHECKED_IN") {
            active = Math.max(0, elapsed - totalBreakSec);
          } else if (derivedState === "ON_BREAK" && breakStartTs) {
            const breakElapsed = Math.max(0, Math.floor((now - breakStartTs.getTime()) / 1000));
            const currentBreakSec = totalBreakSec + breakElapsed;
            active = Math.max(0, elapsed - currentBreakSec);
          } else if (derivedState === "CHECKED_OUT" && todayData.check_out_time) {
            const outTs = new Date(todayData.check_out_time);
            if (!isNaN(outTs.getTime())) {
              const totalElapsed = Math.max(0, Math.floor((outTs.getTime() - checkInTs.getTime()) / 1000));
              work = totalElapsed;
              active = Math.max(0, totalElapsed - totalBreakSec);
            }
          }
        }

        setTimerState({
          workSec: work,
          breakSec: totalBreakSec,
          activeSec: active,
          checkInTime: checkInTs,
          breakStartTime: breakStartTs,
        });
      } else {
        setTimerState({
          workSec: 0,
          breakSec: 0,
          activeSec: 0,
          checkInTime: null,
          breakStartTime: null,
        });
      }

      // 5. Populate Timeline, History, Holidays, Employee Details
      if (timelineRes.status === "fulfilled" && Array.isArray(timelineRes.value)) {
        setTimeline(timelineRes.value);
      }
      if (historyRes.status === "fulfilled" && historyRes.value?.items) {
        setHistoryList(historyRes.value.items);
      }
      if (holidaysRes.status === "fulfilled" && Array.isArray(holidaysRes.value)) {
        setHolidays(holidaysRes.value);
      }
      if (empRes.status === "fulfilled" && empRes.value) {
        setEmployeeDetails(empRes.value);
      }
    } catch (err: any) {
      console.error("Error loading attendance state:", err);
      setApiError(err?.message || "Failed to load attendance data from backend.");
      setAttendanceState("STATUS_UNAVAILABLE");
      setFaceEnrollmentState("STATUS_UNAVAILABLE");
    }
  }, []);

  useEffect(() => {
    loadAttendanceState();
  }, [loadAttendanceState]);

  // ── Capture & Register Face (allowReEnroll: false by default) ─
  const executeEnrollFace = useCallback(async (base64: string, allowReEnroll = false) => {
    setEnrollError(null);
    setIsEnrolling(true);
    try {
      const res = await attendanceApi.enrollFace(base64, allowReEnroll);
      const successMsg = res.message || (allowReEnroll ? "Face profile updated successfully!" : "Face successfully registered!");
      showToast(successMsg, "success");
      sonnerToast.success(successMsg);

      setFaceEnrollmentState("ENROLLED");
      setShowEnrollModal(false);
      setShowReEnrollConfirm(false);
      setPendingEnrollBase64(null);
      stopModalCamera();
      await loadAttendanceState();
    } catch (err: any) {
      const errorCode = extractErrorCode(err) || err?.errorCode;
      const isAlreadyEnrolled =
        errorCode === "ALREADY_ENROLLED" ||
        err?.status === 409 ||
        err?.response?.status === 409 ||
        err?.message?.toLowerCase().includes("already enrolled") ||
        err?.message?.toLowerCase().includes("already registered");

      if (isAlreadyEnrolled && !allowReEnroll) {
        setPendingEnrollBase64(base64);
        setShowReEnrollConfirm(true);
        return;
      }

      const msg = err?.message || "Face registration failed. Please ensure your face is well-lit and fully visible.";
      setEnrollError(msg);
      showToast(msg, "error");
      sonnerToast.error(msg);
    } finally {
      setIsEnrolling(false);
    }
  }, [showToast, stopModalCamera, loadAttendanceState]);

  const handleCaptureAndRegisterFace = useCallback(async () => {
    setEnrollError(null);
    const base64 = uploadedPhotoBase64 || captureModalBase64();
    if (!base64) {
      const msg = "Could not capture image from camera. Please ensure camera is active or upload a face photo.";
      setEnrollError(msg);
      showToast(msg, "error");
      return;
    }
    // Use allowReEnroll: false for initial enrollment
    await executeEnrollFace(base64, false);
  }, [uploadedPhotoBase64, captureModalBase64, executeEnrollFace, showToast]);

  // ── Face Check-In Trigger ────────────────────────────────────
  const handleCheckIn = useCallback(() => {
    if (faceEnrollmentState === "NOT_ENROLLED") {
      setShowEnrollModal(true);
      startModalCamera();
      showToast("Face registration required before check-in.", "error");
      sonnerToast.error("Face registration required before check-in.");
      return;
    }
    if (faceEnrollmentState === "STATUS_UNAVAILABLE") {
      showToast("Cannot verify face enrollment status. Please try again.", "error");
      return;
    }
    if (attendanceState !== "NOT_CHECKED_IN") {
      sonnerToast.info(attendanceState === "CHECKED_OUT" ? "You have already completed attendance for today." : "You are already checked in.");
      return;
    }
    setFaceModalMode("check-in");
    setFaceModalOpen(true);
  }, [faceEnrollmentState, attendanceState, showToast, startModalCamera]);

  // ── Face Check-Out Trigger ───────────────────────────────────
  const handleCheckOut = useCallback(() => {
    if (attendanceState === "NOT_CHECKED_IN") {
      sonnerToast.error("You must check in first before checking out.");
      return;
    }
    if (attendanceState === "CHECKED_OUT") {
      sonnerToast.info("You have already checked out for today.");
      return;
    }
    if (faceEnrollmentState === "NOT_ENROLLED") {
      setShowEnrollModal(true);
      startModalCamera();
      sonnerToast.error("Face registration required before check-out.");
      return;
    }
    if (faceEnrollmentState === "STATUS_UNAVAILABLE") {
      showToast("Cannot verify face enrollment status. Please try again.", "error");
      return;
    }
    setFaceModalMode("check-out");
    setFaceModalOpen(true);
  }, [attendanceState, faceEnrollmentState, showToast, startModalCamera]);

  // ── Successful Face Punch Callback ───────────────────────────
  const handleFaceSuccess = useCallback(
    async (result: AttendancePunchResult) => {
      let defaultMsg = "Attendance verified successfully!";
      if (faceModalMode === "check-in") {
        defaultMsg = "Attendance verified & check-in marked successfully!";
        setAttendanceState("CHECKED_IN");
      } else if (faceModalMode === "check-out") {
        defaultMsg = "Attendance verified & check-out marked successfully!";
        setAttendanceState("CHECKED_OUT");
      } else if (faceModalMode === "break-in") {
        defaultMsg = "Break started. Face verified.";
        setAttendanceState("ON_BREAK");
      } else if (faceModalMode === "break-out") {
        defaultMsg = "Break ended. Welcome back!";
        setAttendanceState("CHECKED_IN");
      }
      const msg = result.message || defaultMsg;
      showToast(msg, "success");
      sonnerToast.success(msg);
      await loadAttendanceState();
    },
    [faceModalMode, showToast, loadAttendanceState]
  );

  // ── Break In & Out Controls (Face-Verified) ───────────────────
  const handleBreakIn = useCallback(() => {
    if (attendanceState !== "CHECKED_IN") {
      const msg =
        attendanceState === "ON_BREAK"
          ? "You are already on a break."
          : attendanceState === "CHECKED_OUT"
          ? "You have already completed attendance for today."
          : "You must be checked in to start a break.";
      showToast(msg, "info");
      sonnerToast.info(msg);
      return;
    }
    if (faceEnrollmentState === "NOT_ENROLLED") {
      setShowEnrollModal(true);
      startModalCamera();
      showToast("Face registration required before starting break.", "error");
      sonnerToast.error("Face registration required before starting break.");
      return;
    }
    if (faceEnrollmentState === "STATUS_UNAVAILABLE") {
      showToast("Cannot verify face enrollment status. Please try again.", "error");
      return;
    }
    setFaceModalMode("break-in");
    setFaceModalOpen(true);
  }, [attendanceState, faceEnrollmentState, showToast, startModalCamera]);

  const handleBreakOut = useCallback(() => {
    if (attendanceState !== "ON_BREAK") {
      const msg =
        attendanceState === "CHECKED_IN"
          ? "You are not currently on a break."
          : attendanceState === "CHECKED_OUT"
          ? "You have already completed attendance for today."
          : "You must be on a break to end break.";
      showToast(msg, "info");
      sonnerToast.info(msg);
      return;
    }
    if (faceEnrollmentState === "NOT_ENROLLED") {
      setShowEnrollModal(true);
      startModalCamera();
      showToast("Face registration required before ending break.", "error");
      sonnerToast.error("Face registration required before ending break.");
      return;
    }
    if (faceEnrollmentState === "STATUS_UNAVAILABLE") {
      showToast("Cannot verify face enrollment status. Please try again.", "error");
      return;
    }
    setFaceModalMode("break-out");
    setFaceModalOpen(true);
  }, [attendanceState, faceEnrollmentState, showToast, startModalCamera]);

  // ── Overtime & Late calculation from BACKEND data (not frontend) ────
  // Use backend-provided overtime hours if available
  const overtimeSec = todayAttendance?.overtime_hours ? todayAttendance.overtime_hours * 3600 : 0;
  // Fallback to frontend calculation if backend doesn't provide overtime
  const fallbackOvertimeSec = (() => {
    const shiftSummary = todayAttendance?.shift || faceAttendanceStatus?.shift;
    const expectedHours = shiftSummary?.grace_period_mins != null 
      ? Math.round((parseTimeToMinutes(shiftSummary.end_time) - parseTimeToMinutes(shiftSummary.start_time) + (shiftSummary.is_overnight ? 1440 : 0) - shiftSummary.grace_period_mins) / 60)
      : null;
    return expectedHours != null ? Math.max(0, workSec - expectedHours * 3600) : 0;
  })();
  const displayOvertimeSec = todayAttendance?.overtime_hours ? overtimeSec : fallbackOvertimeSec;

  // Use backend-provided late minutes instead of frontend calculation
  const lateBy = todayAttendance?.late_minutes ? todayAttendance.late_minutes * 60 : 0;
  const isLate = todayAttendance?.is_late ?? false;

  const initials =
    user?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "EM";

  // System/device info
  const browserInfo = useMemo(() => {
    if (typeof navigator === "undefined") return "Web Browser";
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edge")) return "Edge";
    return "Browser";
  }, []);

  const platformInfo = typeof navigator !== "undefined" ? navigator.platform || "Desktop" : "Desktop";
  const onlineStatus = typeof navigator !== "undefined" && navigator.onLine ? "Online" : "Offline";
  const screenSize = typeof window !== "undefined" ? `${window.screen.width} × ${window.screen.height}` : "Desktop";

  if (attendanceState === "LOADING") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Connecting to attendance services...</p>
      </div>
    );
  }

  if (attendanceState === "STATUS_UNAVAILABLE") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground font-medium">Status Unavailable</p>
        <Button onClick={loadAttendanceState} className="gap-1 text-xs">
          <RefreshCw className="h-3 w-3" /> Retry
        </Button>
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

      {/* ── Mandatory Face Registration Alert Banner ── */}
      {faceEnrollmentState === "NOT_ENROLLED" && (
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

      {/* ── Enrollment Status Unavailable ── */}
      {faceEnrollmentState === "STATUS_UNAVAILABLE" && attendanceState !== "CHECKED_OUT" && (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted/10 text-muted-foreground border border-muted/20">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm sm:text-base font-semibold text-foreground">
                    Face Enrollment Status Unknown
                  </h3>
                  <Badge variant="outline" className={`text-[10px] font-bold ${statusBadgeClass("warning")}`}>Unavailable</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Unable to verify your biometric enrollment status. Please try refreshing or contact support if the issue persists.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={loadAttendanceState}
              className="w-full sm:w-auto shrink-0 gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Retry
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
    attendanceState === "CHECKED_IN" ? "bg-primary" : attendanceState === "ON_BREAK" ? "bg-muted-foreground" : attendanceState === "CHECKED_OUT" ? "bg-success" : "bg-muted-foreground"
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
                    {attendanceState === "CHECKED_IN" ? "Shift in progress" : attendanceState === "CHECKED_OUT" ? "Shift completed" : attendanceState === "ON_BREAK" ? "On break" : "Awaiting check-in"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="relative">
                  <AttendBtn
                    label={
                      faceEnrollmentState === "NOT_ENROLLED"
                        ? "Face Required"
                        : faceEnrollmentState === "STATUS_UNAVAILABLE"
                        ? "Status Unknown"
                        : attendanceState === "CHECKED_IN" || attendanceState === "ON_BREAK"
                        ? "Checked In Today"
                        : attendanceState === "CHECKED_OUT"
                        ? "Day Complete"
                        : "Face Check-In"
                    }
                    icon={LogIn}
                    onClick={handleCheckIn}
                    disabled={
                      attendanceState !== "NOT_CHECKED_IN" || 
                      faceEnrollmentState !== "ENROLLED" || 
                      loading !== null || 
                      faceModalOpen
                    }
                    variant="success"
                    loading={loading === "checkin"}
                  />
                  {faceEnrollmentState === "NOT_ENROLLED" && (
                    <span className="absolute -top-2 right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-extrabold text-primary-foreground uppercase tracking-wide shadow-sm">
                      Enroll First
                    </span>
                  )}
                </div>
                <AttendBtn
                  label="Break In"
                  icon={Coffee}
                  onClick={handleBreakIn}
                  disabled={attendanceState !== "CHECKED_IN" || loading !== null || faceModalOpen}
                  variant="warning"
                  loading={loading === "breakin"}
                />
                <AttendBtn
                  label="Break Out"
                  icon={Play}
                  onClick={handleBreakOut}
                  disabled={attendanceState !== "ON_BREAK" || loading !== null || faceModalOpen}
                  variant="primary"
                  loading={loading === "breakout"}
                />
                <AttendBtn
                  label={
                    attendanceState === "NOT_CHECKED_IN"
                      ? "Check In First"
                      : attendanceState === "CHECKED_OUT"
                      ? "Checked Out Today"
                      : "Face Check-Out"
                  }
                  icon={LogOut}
                  onClick={handleCheckOut}
                  disabled={
                    (attendanceState !== "CHECKED_IN" && attendanceState !== "ON_BREAK") || 
                    loading !== null || 
                    faceModalOpen
                  }
                  variant="danger"
                  loading={loading === "checkout"}
                />
              </div>

              {/* Status bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
    attendanceState === "CHECKED_IN" ? "bg-primary animate-pulse" : attendanceState === "ON_BREAK" ? "bg-muted-foreground animate-pulse" : attendanceState === "CHECKED_OUT" ? "bg-success" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="font-medium">
                    {attendanceState === "NOT_CHECKED_IN"
                      ? "Not Checked In"
                      : attendanceState === "CHECKED_IN"
                      ? "Currently Working"
                      : attendanceState === "ON_BREAK"
                      ? "On Break"
                      : "Day Complete"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <span>
                    Break: <strong className="text-foreground">{fmtHM(breakSec)}</strong>
                  </span>
                  <span>
                    OT: <strong className={displayOvertimeSec > 0 ? "text-primary" : "text-foreground"}>{fmtHM(displayOvertimeSec)}</strong>
                  </span>
                  {isLate && lateBy > 0 && (
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
              <DigitalTimer seconds={workSec} running={attendanceState === "CHECKED_IN" || attendanceState === "ON_BREAK"} />
              <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-4">
                {[
                  { label: "Total Work", value: fmtHM(workSec) },
                  { label: "Active Time", value: fmtHM(activeSec) },
                  { label: "Break Time", value: fmtHM(breakSec) },
                  { label: "Overtime", value: fmtHM(displayOvertimeSec) },
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
                hint={todayAttendance?.shift?.grace_period_mins != null ? `Expected: ${Math.round((parseTimeToMinutes(todayAttendance.shift.end_time) - parseTimeToMinutes(todayAttendance.shift.start_time) + (todayAttendance.shift.is_overnight ? 1440 : 0) - todayAttendance.shift.grace_period_mins) / 60)}h` : "Flexible"}
                icon={Clock}
                accent="brand"
              />
              <StatCard
                label="Break Duration"
                value={fmtHM(breakSec)}
                hint={todayAttendance?.shift?.break_duration_mins ? `Standard: ${todayAttendance.shift.break_duration_mins} min` : "Recorded time"}
                icon={Coffee}
                accent="warning"
              />
              <StatCard
                label="Overtime"
                value={fmtHM(displayOvertimeSec)}
                hint={displayOvertimeSec > 0 ? "Eligible for OT" : "Standard hours"}
                icon={Zap}
                accent="success"
              />
              <StatCard
                label="Late By"
                value={isLate && lateBy > 0 ? fmtHM(lateBy) : "On Time"}
                hint={todayAttendance?.shift?.grace_period_mins ? `Grace: ${todayAttendance.shift.grace_period_mins}m` : "Standard timing"}
                icon={AlertCircle}
                accent={isLate ? "danger" : "success"}
              />
              <StatCard
                label="Check In Time"
                value={checkInTime ? checkInTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—"}
                hint={checkInTime ? "Recorded today" : "Pending check-in"}
                icon={LogIn}
                accent="brand"
              />
              <StatCard
                label="Current Status"
                value={
                  attendanceState === "CHECKED_IN" ? "Working" : 
                  attendanceState === "ON_BREAK" ? "On Break" : 
                  attendanceState === "CHECKED_OUT" ? "Checked Out" : "Not In"
                }
                hint={nowDateStr()}
                icon={CheckCircle2}
                accent={attendanceState === "CHECKED_IN" ? "success" : "muted"}
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
                {faceAttendanceStatus?.shift ? (
                  <>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground text-xs">Shift Name</span>
                      <span className="font-medium text-xs">{faceAttendanceStatus.shift.shift_name}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground text-xs">Timing</span>
                      <span className="font-medium text-xs">
                        {formatHHmmTo12h(faceAttendanceStatus.shift.start_time)} – {formatHHmmTo12h(faceAttendanceStatus.shift.end_time)}
                        {faceAttendanceStatus.shift.is_overnight && <span className="ml-2 text-xs text-purple-400">(Overnight)</span>}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground text-xs">Source</span>
                      <span className="font-medium text-xs capitalize">{faceAttendanceStatus.shift.source.replace("_", " ")}</span>
                    </div>
                    {faceAttendanceStatus.shift.is_off && (
                      <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                        <span className="text-muted-foreground text-xs">Today</span>
                        <Badge variant="outline" className="text-amber-400 border-amber-500/30">Weekly Off</Badge>
                      </div>
                    )}
                    {faceAttendanceStatus.shift.is_holiday && (
                      <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                        <span className="text-muted-foreground text-xs">Today</span>
                        <Badge variant="outline" className="text-purple-400 border-purple-500/30">Holiday: {faceAttendanceStatus.shift.holiday_name}</Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground text-xs">Expected Hours</span>
                      <span className="font-medium text-xs">
                        {faceAttendanceStatus.shift.grace_period_mins != null
                          ? Math.round((parseTimeToMinutes(faceAttendanceStatus.shift.end_time) - parseTimeToMinutes(faceAttendanceStatus.shift.start_time) + (faceAttendanceStatus.shift.is_overnight ? 1440 : 0) - faceAttendanceStatus.shift.grace_period_mins) / 60)
                          : "—"
                        }h
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground text-xs">Grace Time</span>
                      <span className="font-medium text-xs">{faceAttendanceStatus.shift.grace_period_mins} minutes</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground text-xs">Night Premium</span>
                      <span className="font-medium text-xs">{faceAttendanceStatus.shift.night_premium_percent > 0 ? `+${faceAttendanceStatus.shift.night_premium_percent}%` : "Standard"}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No shift assigned for today
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* ── Two-col grid: Biometric Face Attendance + Device ── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Live Face Attendance Biometric Card */}
            <GlassCard className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Biometric Face Attendance" icon={ScanFace} />
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(
                      faceEnrollmentState === "ENROLLED" ? "approved" : 
                      faceEnrollmentState === "NOT_ENROLLED" ? "warning" : "default"
                    )}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      faceEnrollmentState === "ENROLLED" ? "bg-primary" : 
                      faceEnrollmentState === "NOT_ENROLLED" ? "bg-muted-foreground animate-pulse" : "bg-muted-foreground"
                    }`} />
                    {faceEnrollmentState === "ENROLLED" ? "Face Profile Active" : 
                     faceEnrollmentState === "NOT_ENROLLED" ? "Registration Required" : "Status Unknown"}
                  </span>
                  {faceEnrollmentState === "ENROLLED" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEnrollModal(true);
                        startModalCamera();
                      }}
                      className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      Re-enroll
                    </Button>
                  )}
                </div>
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
                  {faceEnrollmentState === "NOT_ENROLLED" ? (
                    <Button
                      onClick={() => {
                        setShowEnrollModal(true);
                        startModalCamera();
                      }}
                      className="w-full gap-2 text-xs"
                    >
                      <ScanFace className="h-4 w-4" /> Register Face Profile
                    </Button>
                  ) : faceEnrollmentState === "STATUS_UNAVAILABLE" ? (
                    <Button
                      variant="outline"
                      onClick={loadAttendanceState}
                      className="w-full gap-2 text-xs"
                    >
                      <RefreshCw className="h-4 w-4" /> Retry Status Check
                    </Button>
                  ) : attendanceState === "NOT_CHECKED_IN" ? (
                    <Button
                      onClick={handleCheckIn}
                      className="w-full gap-2 text-xs"
                    >
                      <LogIn className="h-4 w-4" /> Start Face Check-In
                    </Button>
                  ) : attendanceState === "CHECKED_IN" || attendanceState === "ON_BREAK" ? (
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
            <MiniCalendar 
              history={historyList} 
              todayAttendance={todayAttendance}
              holidays={holidays}
              shiftSchedule={todayAttendance?.shift ? { workingDays: todayAttendance.shift.working_days } : null}
            />
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
                    {attendanceState === "CHECKED_IN"
                      ? "Active Shift"
                      : attendanceState === "ON_BREAK"
                      ? "On Break"
                      : attendanceState === "CHECKED_OUT"
                      ? "Shift Finished"
                      : "Awaiting Punch"}
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    {checkInTime
                      ? `Checked in at ${checkInTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
                      : "Punch in to begin recording today's work hours."}
                  </div>
                </div>
              </div>

              {isLate && lateBy > 0 && (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-2.5">
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Late Punch Alert</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Shift arrival was recorded after the standard grace window.
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
        }}
      >
        <DialogContent className="max-w-md p-6 sm:rounded-2xl border-border bg-card" closeClassName="top-5 right-5">
          <DialogHeader className="pr-10">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Biometric Registration
            </div>
            <DialogTitle className="font-display text-lg font-bold">Face Registration Required</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Center your face inside the oval guide outline. Ensure clear ambient lighting and look directly into the camera.
            </DialogDescription>
          </DialogHeader>

          {/* Hidden file input for photo upload fallback */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Webcam / Upload Viewport with Centered Oval Guide */}
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-black/95 overflow-hidden border border-border flex items-center justify-center">
            {uploadedPhotoBase64 ? (
              <div className="relative h-full w-full flex items-center justify-center">
                <img
                  src={uploadedPhotoBase64}
                  alt="Uploaded face preview"
                  className="h-full w-full object-cover"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setUploadedPhotoBase64(null);
                    startModalCamera();
                  }}
                  className="absolute bottom-2.5 right-2.5 text-[11px] h-7 gap-1 bg-black/75 text-white hover:bg-black/90 backdrop-blur-md"
                >
                  <Video className="h-3 w-3" /> Switch to Webcam
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={setModalVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${modalCameraActive ? "block" : "hidden"}`}
                />

                {isCameraStarting && (
                  <div className="flex flex-col items-center gap-3 p-6 text-center text-muted-foreground">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs font-semibold text-foreground">Starting Webcam...</span>
                    <span className="text-[11px] text-muted-foreground">
                      Please allow camera permissions in your browser if prompted
                    </span>
                  </div>
                )}

                {!modalCameraActive && !isCameraStarting && (
                  <div className="flex flex-col items-center gap-2.5 p-6 text-center text-muted-foreground">
                    <CameraOff className="h-10 w-10 text-muted-foreground/40" />
                    <span className="text-xs font-medium text-foreground">Webcam Inactive</span>
                    {modalCameraError ? (
                      <span className="text-[11px] text-destructive max-w-xs leading-relaxed">{modalCameraError}</span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground max-w-xs">
                        Webcam was not started. Click below to enable camera or upload a face photo directly.
                      </span>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                      <Button size="sm" variant="default" className="gap-1.5 text-xs" onClick={startModalCamera}>
                        <Video className="h-3.5 w-3.5" /> Enable Webcam
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload Photo
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Centered Circular/Oval Face Guide Overlay */}
            {(modalCameraActive || uploadedPhotoBase64) && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-3">
                <div className="relative w-44 h-56 sm:w-48 sm:h-60 rounded-[50%] border-2 border-primary shadow-sm">
                  {/* Viewfinder reticle brackets */}
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-white" />
                </div>

                <div className="mt-3 rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] text-white border border-white/10 flex items-center gap-1.5">
                  <ScanFace className="h-3 w-3 text-primary" />
                  {uploadedPhotoBase64 ? "Face centered in oval guide" : "Keep face centered inside the frame"}
                </div>
              </div>
            )}
          </div>

          {/* Fallback Option */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
            <span>Cannot use webcam?</span>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-auto p-0 text-primary text-[11px] font-semibold gap-1"
            >
              <Upload className="h-3 w-3 inline" />
              Upload Face Photo Instead
            </Button>
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
              }}
              disabled={isEnrolling}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCaptureAndRegisterFace}
              disabled={(!modalCameraActive && !uploadedPhotoBase64) || isEnrolling}
              className="gap-2 text-xs"
            >
              {isEnrolling ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ScanFace className="h-3.5 w-3.5" />}
              {isEnrolling
                ? "Registering Face Profile..."
                : uploadedPhotoBase64
                ? "Register Uploaded Photo"
                : "Capture & Register Face"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Re-Enroll Dialog (Task 4) ── */}
      <ConfirmAlertDialog
        open={showReEnrollConfirm}
        onOpenChange={(open) => {
          setShowReEnrollConfirm(open);
          if (!open) {
            setPendingEnrollBase64(null);
          }
        }}
        title="Replace Existing Face Profile?"
        description="Replace your existing face profile?"
        confirmLabel="Replace Profile"
        cancelLabel="Cancel"
        destructive={false}
        onConfirm={async () => {
          if (pendingEnrollBase64) {
            await executeEnrollFace(pendingEnrollBase64, true);
          }
        }}
      />
    </div>
  );
}

export default CheckInPage;
