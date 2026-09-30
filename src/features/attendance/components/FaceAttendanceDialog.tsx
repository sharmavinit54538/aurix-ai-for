import { useState, useEffect, useRef, useCallback } from "react";
import {
  ScanFace,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MapPin,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  attendanceApi,
  AttendancePunchResult,
  extractFaceApiError,
} from "@/services/attendanceApi";
import { logger } from "@/lib/logger";

// ── Geolocation Helper with Accuracy ────────────────────────────
function getGeolocation(): Promise<{ lat: number; lng: number; accuracy?: number } | null> {
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

function fmtHours(sec: number) {
  if (sec <= 0) return "0h 00m";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

// ── Format raw UUID or Employee Code Cleanly ───────────────────
function formatEmployeeId(rawId?: string | null): { display: string; full: string } {
  if (!rawId) return { display: "—", full: "" };
  const str = String(rawId).trim();
  // Strip redundant leading EMP- or EMP_ if present
  const clean = str.replace(/^EMP[-_]?/i, "");
  
  // Check if it's a standard UUID (e.g. d52bd75d-9ddd-4512-8aa8-091a3a369899)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  if (isUuid) {
    return {
      display: `EMP-${clean.slice(0, 8).toUpperCase()}`,
      full: `EMP-${clean}`,
    };
  }

  // If long non-UUID code, truncate gracefully
  if (clean.length > 16) {
    return {
      display: `EMP-${clean.slice(0, 12)}…`,
      full: `EMP-${clean}`,
    };
  }

  return {
    display: `EMP-${clean}`,
    full: `EMP-${clean}`,
  };
}

// ── Format ISO Timestamp into Readable Time & Date ─────────────
function formatPunchTimestamp(rawTime?: string | null): { time: string; tag: string } {
  const dateObj = rawTime ? new Date(rawTime) : new Date();
  const valid = !isNaN(dateObj.getTime());
  const target = valid ? dateObj : new Date();

  const time = target.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const now = new Date();
  const isToday =
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate();

  const tag = isToday
    ? "Today"
    : target.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  return { time, tag };
}


export interface FaceAttendanceDialogProps {
  open: boolean;
  mode: "check-in" | "check-out";
  onOpenChange: (open: boolean) => void;
  onSuccess: (result: AttendancePunchResult) => void;
  employeeDetails?: {
    id: string;
    employee_id: string;
    full_name: string;
    department?: string | null;
    designation?: string | null;
  } | null;
  currentUser?: any;
  notes?: string;
}

export function FaceAttendanceDialog({
  open,
  mode,
  onOpenChange,
  onSuccess,
  employeeDetails,
  currentUser,
  notes,
}: FaceAttendanceDialogProps) {
  const [stage, setStage] = useState<
    "initializing" | "detecting" | "verifying" | "success" | "error"
  >("initializing");
  const [countdown, setCountdown] = useState<number>(2);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [punchResult, setPunchResult] = useState<AttendancePunchResult | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const autoCaptureTimerRef = useRef<any>(null);
  const isCapturingRef = useRef<boolean>(false);

  const modeRef = useRef(mode);
  const notesRef = useRef(notes);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    modeRef.current = mode;
    notesRef.current = notes;
    onSuccessRef.current = onSuccess;
  }, [mode, notes, onSuccess]);

  // Stop all camera tracks and release hardware
  const stopCamera = useCallback(() => {
    if (autoCaptureTimerRef.current) {
      clearInterval(autoCaptureTimerRef.current);
      clearTimeout(autoCaptureTimerRef.current);
      autoCaptureTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          logger.warn("Failed to stop media stream track:", err);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Capture frame from video to Base64 JPEG
  const captureFrameBase64 = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return null;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.95);
    } catch {
      return null;
    }
  }, []);

  // Submit to real backend endpoint
  const verifyAndSubmit = useCallback(
    async (base64Image: string) => {
      if (isCapturingRef.current) return;
      isCapturingRef.current = true;
      setStage("verifying");

      try {
        const currentCoords = coords || (await getGeolocation());
        const deviceInfo = typeof navigator !== "undefined" ? navigator.userAgent : "Browser";

        let result: AttendancePunchResult;
        if (modeRef.current === "check-in") {
          result = await attendanceApi.checkIn({
            image_base64: base64Image,
            latitude: currentCoords?.lat,
            longitude: currentCoords?.lng,
            accuracy: currentCoords?.accuracy,
            deviceInfo,
            notes: notesRef.current,
          });
        } else {
          result = await attendanceApi.checkOut({
            image_base64: base64Image,
            latitude: currentCoords?.lat,
            longitude: currentCoords?.lng,
            accuracy: currentCoords?.accuracy,
            deviceInfo,
            notes: notesRef.current,
          });
        }

        // Verification success: stop camera immediately
        stopCamera();
        setPunchResult(result);
        setStage("success");
        onSuccessRef.current(result);
      } catch (err: any) {
        // Verification failed: stop camera, do NOT mark attendance, display real backend error
        stopCamera();
        const userMsg = extractFaceApiError(err);
        setErrorMessage(userMsg);
        setStage("error");
      } finally {
        isCapturingRef.current = false;
      }
    },
    [coords, stopCamera]
  );

  // Initialize camera and start automated detection
  const startCamera = useCallback(async () => {
    stopCamera();
    isCapturingRef.current = false;
    setCameraError(null);
    setErrorMessage(null);
    setPunchResult(null);
    setStage("initializing");
    setCountdown(2);

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported in this browser.");
      }

      // Fetch accurate GPS coordinates in background
      getGeolocation().then((c) => setCoords(c)).catch(() => {});

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setStage("detecting");

      // Auto-detection countdown (2s -> 1s -> auto-capture)
      let count = 2;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          autoCaptureTimerRef.current = null;
          const frame = captureFrameBase64();
          if (frame) {
            verifyAndSubmit(frame);
          } else {
            // Slight retry for video frame stabilization
            setTimeout(() => {
              const retryFrame = captureFrameBase64();
              if (retryFrame) {
                verifyAndSubmit(retryFrame);
              } else {
                stopCamera();
                setErrorMessage("Unable to capture clear face frame. Please ensure camera is not blocked.");
                setStage("error");
              }
            }, 400);
          }
        }
      }, 900);

      autoCaptureTimerRef.current = interval;
    } catch (err: any) {
      console.warn("Face attendance camera initialization failed:", err);
      const msg =
        err?.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in browser permissions."
          : err?.name === "NotFoundError"
          ? "No camera found. Please connect a webcam to continue."
          : err?.message || "Failed to initialize camera.";
      setCameraError(msg);
      setErrorMessage(msg);
      setStage("error");
    }
  }, [captureFrameBase64, stopCamera, verifyAndSubmit]);

  // Lifecycle when dialog open state changes
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  // Stop camera when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopCamera();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [stopCamera]);

  const empName =
    punchResult?.employeeName ||
    employeeDetails?.full_name ||
    currentUser?.fullName ||
    currentUser?.name ||
    "Verified Employee";

  const rawEmpId =
    punchResult?.employeeId ||
    employeeDetails?.employee_id ||
    employeeDetails?.id ||
    currentUser?.employeeId ||
    currentUser?.id;

  const empIdInfo = formatEmployeeId(rawEmpId);
  const punchTimeInfo = formatPunchTimestamp(
    punchResult?.time || punchResult?.checkInTime || punchResult?.checkOutTime
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          stopCamera();
        }
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-md p-6 sm:rounded-2xl border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
              <ScanFace className="h-4 w-4" />
              {mode === "check-in" ? "Biometric Check-In" : "Biometric Check-Out"}
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                stage === "success"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : stage === "error"
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                  : "bg-primary/20 text-primary border border-primary/30"
              }`}
            >
              {stage === "success" ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verified
                </>
              ) : stage === "verifying" ? (
                <>
                  <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                  Verifying...
                </>
              ) : stage === "detecting" ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Scanning
                </>
              ) : (
                "Live Camera"
              )}
            </span>
          </div>
          <DialogTitle className="font-display text-lg font-bold">
            {mode === "check-in" ? "Face Attendance Check-In" : "Face Attendance Check-Out"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {stage === "success"
              ? "Biometric identity verified and attendance recorded successfully."
              : stage === "verifying"
              ? "Verifying facial features against enrolled biometric profile with backend..."
              : stage === "error"
              ? "Attendance was not marked. Please review the backend error below and retry."
              : "Look directly into the camera. Face will be auto-detected without manual clicks."}
          </DialogDescription>
        </DialogHeader>

        {/* Viewport Area for Live Camera / Verification / Error */}
        {stage !== "success" ? (
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-black/95 overflow-hidden border border-border flex items-center justify-center shadow-inner">
            {/* Video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${
                stage === "initializing" || stage === "detecting" || stage === "verifying" ? "block" : "hidden"
              }`}
            />

            {/* Camera Initializing */}
            {stage === "initializing" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 text-center p-4">
                <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
                <span className="text-xs font-medium text-foreground">Starting camera & calibrating sensors...</span>
                <span className="text-[11px] text-muted-foreground">Requesting camera permissions</span>
              </div>
            )}

            {/* Live Scanning Guide Overlay */}
            {(stage === "detecting" || stage === "verifying") && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-3">
                {/* Top Live Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live Camera
                </div>

                {/* Oval Reticle Guide */}
                <div
                  className={`relative w-44 h-56 sm:w-48 sm:h-60 rounded-[50%] border-2 transition-all duration-300 ${
                    stage === "verifying"
                      ? "border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.8)]"
                      : "border-primary/80 shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                  }`}
                >
                  {/* Corner reticle brackets */}
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                  {/* Animated Scan line when verifying */}
                  {stage === "verifying" && (
                    <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Status pill with auto-countdown */}
                <div className="mt-3 rounded-full bg-black/80 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium text-white border border-white/15 flex items-center gap-2 shadow-xl">
                  {stage === "verifying" ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                      <span>Verifying face with backend...</span>
                    </>
                  ) : (
                    <>
                      <ScanFace className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                      <span>Hold steady... Auto-detecting in {countdown}s</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Error Screen Overlay */}
            {stage === "error" && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="h-14 w-14 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)] mb-3">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">Verification Failed</h3>
                <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 max-w-sm leading-relaxed">
                  {errorMessage || cameraError || "Could not verify employee face with backend."}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Attendance was not marked. Please try again with clear lighting and steady positioning.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Biometric Success Receipt Card */
          <div className="w-full rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-card/95 via-card/85 to-card/95 p-5 flex flex-col items-center shadow-sm animate-in fade-in zoom-in-95 duration-200">
            {/* Glowing Success Badge */}
            <div className="relative flex items-center justify-center mb-2.5">
              <div className="absolute h-14 w-14 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/15 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            <h3 className="font-display text-base font-bold text-foreground tracking-tight">
              {mode === "check-in" ? "Check-In Verified & Recorded!" : "Check-Out Verified & Recorded!"}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Biometric identity verified with high confidence
            </p>

            {/* Employee verification details card */}
            <div className="mt-3.5 w-full rounded-xl border border-border/80 bg-background/50 backdrop-blur-sm p-3.5 text-xs space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Employee Name
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/25 shrink-0 uppercase">
                    {empName ? empName.trim().charAt(0) : "E"}
                  </div>
                  <span className="font-semibold text-foreground truncate max-w-[170px]" title={empName}>
                    {empName}
                  </span>
                </div>
              </div>

              {rawEmpId && (
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/70" />
                    Employee ID
                  </span>
                  <span
                    className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/70 border border-border/60 text-foreground shrink-0 cursor-default"
                    title={empIdInfo.full}
                  >
                    {empIdInfo.display}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Punch Timestamp
                </span>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="font-semibold text-foreground">{punchTimeInfo.time}</span>
                  <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60 border border-border/50">
                    {punchTimeInfo.tag}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Attendance Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {punchResult?.status || (mode === "check-in" ? "Present" : "Checked Out")}
                </span>
              </div>

              {punchResult?.workingHours != null && (
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                    Working Hours
                  </span>
                  <span className="font-mono font-semibold text-foreground text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/50">
                    {fmtHours(Math.round(punchResult.workingHours * 3600))}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Location Verification
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-foreground text-[11px] px-2 py-0.5 rounded-md bg-muted/60 border border-border/50">
                  <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                  {punchResult?.isInsideGeofence ? "Inside Office Geofence" : "GPS Logged"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="pt-2">
          {stage === "success" ? (
            <Button
              size="sm"
              onClick={() => {
                stopCamera();
                onOpenChange(false);
              }}
              className="w-full h-10 gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-md shadow-emerald-500/25 text-xs rounded-xl transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" /> Done
            </Button>
          ) : stage === "error" ? (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  stopCamera();
                  onOpenChange(false);
                }}
                className="text-xs rounded-xl"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={startCamera}
                className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-md shadow-violet-500/25 text-xs rounded-xl cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Try Again
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-end w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  stopCamera();
                  onOpenChange(false);
                }}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
