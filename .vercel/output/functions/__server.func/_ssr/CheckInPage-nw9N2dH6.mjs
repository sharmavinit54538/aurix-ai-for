import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as Timer, Bt as MapPin, Dr as ChevronRight, H as Sparkles, Ir as ChartColumn, It as MessageSquare, Jr as Briefcase, Mt as Monitor, Q as Send, Sr as CircleCheck, Tr as CircleAlert, Ur as CalendarDays, Ut as LogOut, Wt as LogIn, br as CircleQuestionMark, c as Wifi, f as Video, gt as Play, h as User, i as Zap, kr as ChevronDown, lr as Coffee, lt as RefreshCw, mn as History, on as Laptop, pr as Clock, q as ShieldCheck, rt as ScanFace, zr as CameraOff } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as logger } from "./safe-storage-DInQCreU.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as extractFaceApiError, t as attendanceApi } from "./attendanceApi-CqMkuZD6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CheckInPage-nw9N2dH6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getGeolocation() {
	return new Promise((resolve) => {
		if (typeof navigator !== "undefined" && navigator.geolocation) navigator.geolocation.getCurrentPosition((pos) => resolve({
			lat: pos.coords.latitude,
			lng: pos.coords.longitude,
			accuracy: pos.coords.accuracy
		}), () => resolve(null), {
			timeout: 7e3,
			enableHighAccuracy: true
		});
		else resolve(null);
	});
}
function fmtHours(sec) {
	if (sec <= 0) return "0h 00m";
	return `${Math.floor(sec / 3600)}h ${Math.floor(sec % 3600 / 60).toString().padStart(2, "0")}m`;
}
function formatEmployeeId(rawId) {
	if (!rawId) return {
		display: "—",
		full: ""
	};
	const clean = String(rawId).trim().replace(/^EMP[-_]?/i, "");
	if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean)) return {
		display: `EMP-${clean.slice(0, 8).toUpperCase()}`,
		full: `EMP-${clean}`
	};
	if (clean.length > 16) return {
		display: `EMP-${clean.slice(0, 12)}…`,
		full: `EMP-${clean}`
	};
	return {
		display: `EMP-${clean}`,
		full: `EMP-${clean}`
	};
}
function formatPunchTimestamp(rawTime) {
	const dateObj = rawTime ? new Date(rawTime) : /* @__PURE__ */ new Date();
	const target = !isNaN(dateObj.getTime()) ? dateObj : /* @__PURE__ */ new Date();
	const time = target.toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true
	});
	const now = /* @__PURE__ */ new Date();
	return {
		time,
		tag: now.getFullYear() === target.getFullYear() && now.getMonth() === target.getMonth() && now.getDate() === target.getDate() ? "Today" : target.toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		})
	};
}
function FaceAttendanceDialog({ open, mode, onOpenChange, onSuccess, employeeDetails, currentUser, notes }) {
	const [stage, setStage] = (0, import_react.useState)("initializing");
	const [countdown, setCountdown] = (0, import_react.useState)(2);
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [punchResult, setPunchResult] = (0, import_react.useState)(null);
	const [coords, setCoords] = (0, import_react.useState)(null);
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const autoCaptureTimerRef = (0, import_react.useRef)(null);
	const isCapturingRef = (0, import_react.useRef)(false);
	const modeRef = (0, import_react.useRef)(mode);
	const notesRef = (0, import_react.useRef)(notes);
	const onSuccessRef = (0, import_react.useRef)(onSuccess);
	(0, import_react.useEffect)(() => {
		modeRef.current = mode;
		notesRef.current = notes;
		onSuccessRef.current = onSuccess;
	}, [
		mode,
		notes,
		onSuccess
	]);
	const stopCamera = (0, import_react.useCallback)(() => {
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
		if (videoRef.current) videoRef.current.srcObject = null;
	}, []);
	const captureFrameBase64 = (0, import_react.useCallback)(() => {
		const video = videoRef.current;
		if (!video || !video.videoWidth || !video.videoHeight) return null;
		try {
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) return null;
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			return canvas.toDataURL("image/jpeg", .95);
		} catch {
			return null;
		}
	}, []);
	const verifyAndSubmit = (0, import_react.useCallback)(async (base64Image) => {
		if (isCapturingRef.current) return;
		isCapturingRef.current = true;
		setStage("verifying");
		try {
			const currentCoords = coords || await getGeolocation();
			const deviceInfo = typeof navigator !== "undefined" ? navigator.userAgent : "Browser";
			let result;
			if (modeRef.current === "check-in") result = await attendanceApi.checkIn({
				image_base64: base64Image,
				latitude: currentCoords?.lat,
				longitude: currentCoords?.lng,
				accuracy: currentCoords?.accuracy,
				deviceInfo,
				notes: notesRef.current
			});
			else if (modeRef.current === "check-out") result = await attendanceApi.checkOut({
				image_base64: base64Image,
				latitude: currentCoords?.lat,
				longitude: currentCoords?.lng,
				accuracy: currentCoords?.accuracy,
				deviceInfo,
				notes: notesRef.current
			});
			else if (modeRef.current === "break-in") result = await attendanceApi.startBreak({
				image_base64: base64Image,
				latitude: currentCoords?.lat,
				longitude: currentCoords?.lng,
				accuracy: currentCoords?.accuracy,
				deviceInfo,
				notes: notesRef.current
			});
			else result = await attendanceApi.endBreak({
				image_base64: base64Image,
				latitude: currentCoords?.lat,
				longitude: currentCoords?.lng,
				accuracy: currentCoords?.accuracy,
				deviceInfo
			});
			stopCamera();
			setPunchResult(result);
			setStage("success");
			onSuccessRef.current(result);
		} catch (err) {
			stopCamera();
			setErrorMessage(extractFaceApiError(err));
			setStage("error");
		} finally {
			isCapturingRef.current = false;
		}
	}, [coords, stopCamera]);
	const startCamera = (0, import_react.useCallback)(async () => {
		stopCamera();
		isCapturingRef.current = false;
		setCameraError(null);
		setErrorMessage(null);
		setPunchResult(null);
		setStage("initializing");
		setCountdown(2);
		try {
			if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) throw new Error("Camera API is not supported in this browser.");
			getGeolocation().then((c) => setCoords(c)).catch(() => {});
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: "user"
				},
				audio: false
			});
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play().catch(() => {});
			}
			setStage("detecting");
			let count = 2;
			const interval = setInterval(() => {
				count -= 1;
				setCountdown(count);
				if (count <= 0) {
					clearInterval(interval);
					autoCaptureTimerRef.current = null;
					const frame = captureFrameBase64();
					if (frame) verifyAndSubmit(frame);
					else setTimeout(() => {
						const retryFrame = captureFrameBase64();
						if (retryFrame) verifyAndSubmit(retryFrame);
						else {
							stopCamera();
							setErrorMessage("Unable to capture clear face frame. Please ensure camera is not blocked.");
							setStage("error");
						}
					}, 400);
				}
			}, 900);
			autoCaptureTimerRef.current = interval;
		} catch (err) {
			console.warn("Face attendance camera initialization failed:", err);
			const msg = err?.name === "NotAllowedError" ? "Camera permission denied. Please allow camera access in browser permissions." : err?.name === "NotFoundError" ? "No camera found. Please connect a webcam to continue." : err?.message || "Failed to initialize camera.";
			setCameraError(msg);
			setErrorMessage(msg);
			setStage("error");
		}
	}, [
		captureFrameBase64,
		stopCamera,
		verifyAndSubmit
	]);
	(0, import_react.useEffect)(() => {
		if (open) startCamera();
		else stopCamera();
		return () => {
			stopCamera();
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		const handleVisibility = () => {
			if (document.hidden) stopCamera();
		};
		document.addEventListener("visibilitychange", handleVisibility);
		return () => document.removeEventListener("visibilitychange", handleVisibility);
	}, [stopCamera]);
	const empName = punchResult?.employeeName || employeeDetails?.full_name || currentUser?.fullName || currentUser?.name || "Verified Employee";
	const rawEmpId = punchResult?.employeeId || employeeDetails?.employee_id || employeeDetails?.id || currentUser?.employeeId || currentUser?.id;
	const empIdInfo = formatEmployeeId(rawEmpId);
	const punchTimeInfo = formatPunchTimestamp(punchResult?.time || punchResult?.checkInTime || punchResult?.checkOutTime);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (val) => {
			if (!val) stopCamera();
			onOpenChange(val);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md p-6 sm:rounded-2xl border-border bg-card/95 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-4 w-4" }), mode === "check-in" ? "Biometric Check-In" : mode === "check-out" ? "Biometric Check-Out" : mode === "break-in" ? "Biometric Break In" : "Biometric Break Out"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${stage === "success" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : stage === "error" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30" : "bg-primary/20 text-primary border border-primary/30"}`,
							children: stage === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }), "Verified"] }) : stage === "verifying" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-2.5 w-2.5 animate-spin" }), "Verifying..."] }) : stage === "detecting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" }), "Scanning"] }) : "Live Camera"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold",
						children: mode === "check-in" ? "Face Attendance Check-In" : mode === "check-out" ? "Face Attendance Check-Out" : mode === "break-in" ? "Verify Face to Start Break" : "Verify Face to End Break"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: stage === "success" ? mode === "break-in" ? "Biometric identity verified and break started successfully." : mode === "break-out" ? "Biometric identity verified and break ended successfully." : "Biometric identity verified and attendance recorded successfully." : stage === "verifying" ? "Verifying facial features against enrolled biometric profile with backend..." : stage === "error" ? "Verification was not completed. Please review the backend error below and retry." : mode === "break-in" ? "Look directly into the camera to verify your face and start break." : mode === "break-out" ? "Look directly into the camera to verify your face and end break." : "Look directly into the camera. Face will be auto-detected without manual clicks."
					})
				] }),
				stage !== "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[4/3] w-full rounded-2xl bg-black/95 overflow-hidden border border-border flex items-center justify-center shadow-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: videoRef,
							autoPlay: true,
							playsInline: true,
							muted: true,
							className: `h-full w-full object-cover ${stage === "initializing" || stage === "detecting" || stage === "verifying" ? "block" : "hidden"}`
						}),
						stage === "initializing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 text-center p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-8 w-8 animate-spin text-cyan-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-foreground",
									children: "Starting camera & calibrating sensors..."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Requesting camera permissions"
								})
							]
						}),
						(stage === "detecting" || stage === "verifying") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white border border-white/10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400" }),
										"Live Camera"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `relative w-44 h-56 sm:w-48 sm:h-60 rounded-[50%] border-2 transition-all duration-300 ${stage === "verifying" ? "border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.8)]" : "border-primary/80 shadow-[0_0_25px_rgba(99,102,241,0.5)]"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400" }),
										stage === "verifying" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 rounded-full bg-black/80 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium text-white border border-white/15 flex items-center gap-2 shadow-xl",
									children: stage === "verifying" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verifying face with backend..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-3.5 w-3.5 text-cyan-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Hold steady... Auto-detecting in ",
										countdown,
										"s"
									] })] })
								})
							]
						}),
						stage === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-14 w-14 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)] mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-bold text-foreground",
									children: "Verification Failed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-rose-600 dark:text-rose-400 max-w-sm leading-relaxed",
									children: errorMessage || cameraError || "Could not verify employee face with backend."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: "Attendance was not marked. Please try again with clear lighting and steady positioning."
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-card/95 via-card/85 to-card/95 p-5 flex flex-col items-center shadow-sm animate-in fade-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center justify-center mb-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-14 w-14 rounded-full bg-emerald-500/20 blur-xl animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/15 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-bold text-foreground tracking-tight",
							children: mode === "check-in" ? "Check-In Verified & Recorded!" : mode === "check-out" ? "Check-Out Verified & Recorded!" : mode === "break-in" ? "Break Started & Verified!" : "Break Ended & Verified!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: "Biometric identity verified with high confidence"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3.5 w-full rounded-xl border border-border/80 bg-background/50 backdrop-blur-sm p-3.5 text-xs space-y-2.5 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/50 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1.5 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-muted-foreground/70" }), "Employee Name"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-5 w-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/25 shrink-0 uppercase",
											children: empName ? empName.trim().charAt(0) : "E"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground truncate max-w-[170px]",
											title: empName,
											children: empName
										})]
									})]
								}),
								rawEmpId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/50 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1.5 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-muted-foreground/70" }), "Employee ID"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/70 border border-border/60 text-foreground shrink-0 cursor-default",
										title: empIdInfo.full,
										children: empIdInfo.display
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/50 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1.5 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-muted-foreground/70" }), "Punch Timestamp"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: punchTimeInfo.time
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60 border border-border/50",
											children: punchTimeInfo.tag
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/50 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1.5 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-muted-foreground/70" }), "Attendance Status"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), punchResult?.status || (mode === "check-in" ? "Present" : mode === "check-out" ? "Checked Out" : mode === "break-in" ? "On Break" : "Checked In")]
									})]
								}),
								punchResult?.workingHours != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/50 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1.5 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-muted-foreground/70" }), "Working Hours"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-foreground text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/50",
										children: fmtHours(Math.round(punchResult.workingHours * 3600))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground flex items-center gap-1.5 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground/70" }), "Location Verification"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 font-medium text-foreground text-[11px] px-2 py-0.5 rounded-md bg-muted/60 border border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-emerald-500 shrink-0" }), punchResult?.isInsideGeofence ? "Inside Office Geofence" : "GPS Logged"]
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2",
					children: stage === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => {
							stopCamera();
							onOpenChange(false);
						},
						className: "w-full h-10 gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-md shadow-emerald-500/25 text-xs rounded-xl transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Done"]
					}) : stage === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								stopCamera();
								onOpenChange(false);
							},
							className: "text-xs rounded-xl",
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: startCamera,
							className: "gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-md shadow-violet-500/25 text-xs rounded-xl cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Try Again"]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-end w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								stopCamera();
								onOpenChange(false);
							},
							className: "text-xs rounded-xl",
							children: "Cancel"
						})
					})
				})
			]
		})
	});
}
function fmtHM(sec) {
	if (sec <= 0) return "0h 00m";
	return `${Math.floor(sec / 3600)}h ${Math.floor(sec % 3600 / 60).toString().padStart(2, "0")}m`;
}
function nowDateStr() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function SectionHeader({ title, subtitle, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center gap-3",
		children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-base font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: subtitle
		})] })]
	});
}
function DigitalTimer({ seconds, running }) {
	const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
	const m = Math.floor(seconds % 3600 / 60).toString().padStart(2, "0");
	const s = (seconds % 60).toString().padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `absolute inset-0 rounded-full blur-3xl opacity-20 transition-opacity ${running ? "opacity-30" : "opacity-10"}`,
			style: { background: "var(--gradient-brand)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative font-mono text-5xl sm:text-7xl font-bold tracking-widest tabular-nums",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: h
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-muted-foreground ${running ? "animate-pulse" : ""}`,
					children: ":"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: m
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-muted-foreground ${running ? "animate-pulse" : ""}`,
					children: ":"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						background: "var(--gradient-brand)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent"
					},
					children: s
				})
			]
		})]
	});
}
function TimelineItem({ event, isLast }) {
	const Icon = {
		checkin: LogIn,
		checkout: LogOut,
		break_start: Coffee,
		break_end: Play
	}[event.type] || Clock;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-8 w-8 shrink-0 place-items-center rounded-full ${event.type === "checkin" ? "bg-primary/10 text-primary" : event.type === "checkout" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
			}), !isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 w-px flex-1 bg-border" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: event.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: event.time
			})]
		})]
	});
}
function MiniCalendar({ history }) {
	const today = /* @__PURE__ */ new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = new Date(year, month, 1).getDay();
	const historyMap = /* @__PURE__ */ new Map();
	history.forEach((h) => {
		if (h.date) historyMap.set(h.date, h);
	});
	const statuses = {};
	const todayDate = today.getDate();
	for (let d = 1; d <= daysInMonth; d++) {
		const dayOfWeek = new Date(year, month, d).getDay();
		const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
		if (d === todayDate) statuses[d] = "today";
		else if (d > todayDate) statuses[d] = "future";
		else if (dayOfWeek === 0 || dayOfWeek === 6) statuses[d] = "weekend";
		else {
			const record = historyMap.get(dateStr);
			if (record) statuses[d] = record.status === "Late" ? "late" : "present";
			else statuses[d] = "absent";
		}
	}
	const COLOR = {
		present: "bg-primary/10 text-primary font-medium",
		absent: "bg-destructive/10 text-destructive",
		late: "bg-muted text-foreground font-medium",
		leave: "bg-muted text-muted-foreground",
		holiday: "bg-primary/15 text-primary",
		weekend: "text-muted-foreground/50",
		halfday: "bg-muted text-foreground",
		today: "ring-2 ring-primary bg-primary/15 text-primary font-bold",
		future: "text-muted-foreground/40"
	};
	const days = [
		"Su",
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa"
	];
	const cells = Array(firstDay).fill(null);
	for (let i = 1; i <= daysInMonth; i++) cells.push(i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 text-center text-sm font-semibold",
			children: today.toLocaleDateString("en-IN", {
				month: "long",
				year: "numeric"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-7 gap-1 text-center",
			children: [days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: d
			}, d)), cells.map((day, i) => {
				if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `e-${i}`);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-7 w-7 mx-auto items-center justify-center rounded-full text-xs transition-colors cursor-default ${COLOR[statuses[day] ?? "future"] ?? ""}`,
					children: day
				}, day);
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2 justify-center",
			children: [
				{
					color: "bg-primary",
					label: "Present"
				},
				{
					color: "bg-muted-foreground",
					label: "Late"
				},
				{
					color: "bg-destructive",
					label: "Absent"
				},
				{
					color: "bg-muted-foreground/50",
					label: "Weekend / Off"
				}
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${item.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-muted-foreground",
					children: item.label
				})]
			}, item.label))
		})
	] });
}
function AttendBtn({ label, icon: Icon, onClick, disabled, variant, loading }) {
	const cls = {
		primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
		success: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
		warning: "bg-muted text-foreground hover:bg-muted/80 border border-border shadow-sm",
		danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		disabled: disabled || loading,
		className: `group flex flex-col items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${cls}`,
		children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function CheckInPage() {
	const user = useAurix().user;
	const [status, setStatus] = (0, import_react.useState)("not-checked-in");
	const [loading, setLoading] = (0, import_react.useState)(null);
	const [pageLoading, setPageLoading] = (0, import_react.useState)(true);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [toast$1, setToast] = (0, import_react.useState)(null);
	const [noteEmp, setNoteEmp] = (0, import_react.useState)("");
	const [notesOpen, setNotesOpen] = (0, import_react.useState)(false);
	const [workSec, setWorkSec] = (0, import_react.useState)(0);
	const [breakSec, setBreakSec] = (0, import_react.useState)(0);
	const [activeSec, setActiveSec] = (0, import_react.useState)(0);
	const checkInTimeRef = (0, import_react.useRef)(null);
	const [timeline, setTimeline] = (0, import_react.useState)([]);
	const [historyList, setHistoryList] = (0, import_react.useState)([]);
	const [assignedShift, setAssignedShift] = (0, import_react.useState)(null);
	const [holidays, setHolidays] = (0, import_react.useState)([]);
	const [employeeDetails, setEmployeeDetails] = (0, import_react.useState)(null);
	const [faceModalOpen, setFaceModalOpen] = (0, import_react.useState)(false);
	const [faceModalMode, setFaceModalMode] = (0, import_react.useState)("check-in");
	const [isFaceEnrolled, setIsFaceEnrolled] = (0, import_react.useState)(null);
	const [enrolledAt, setEnrolledAt] = (0, import_react.useState)(null);
	const [showEnrollModal, setShowEnrollModal] = (0, import_react.useState)(false);
	const [isEnrolling, setIsEnrolling] = (0, import_react.useState)(false);
	const [enrollError, setEnrollError] = (0, import_react.useState)(null);
	const [modalCameraActive, setModalCameraActive] = (0, import_react.useState)(false);
	const [modalCameraError, setModalCameraError] = (0, import_react.useState)(null);
	const modalVideoRef = (0, import_react.useRef)(null);
	const modalStreamRef = (0, import_react.useRef)(null);
	function showToast(msg, type = "success") {
		setToast({
			msg,
			type
		});
		setTimeout(() => setToast(null), 4e3);
	}
	const startModalCamera = (0, import_react.useCallback)(async () => {
		setModalCameraError(null);
		try {
			if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) throw new Error("Camera API is not supported in this browser.");
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: "user"
				},
				audio: false
			});
			modalStreamRef.current = stream;
			if (modalVideoRef.current) {
				modalVideoRef.current.srcObject = stream;
				modalVideoRef.current.play().catch(() => {});
			}
			setModalCameraActive(true);
		} catch (err) {
			console.warn("Modal camera could not be started:", err);
			setModalCameraError(err?.message || "Could not access camera. Please allow camera permissions.");
			setModalCameraActive(false);
		}
	}, []);
	const stopModalCamera = (0, import_react.useCallback)(() => {
		if (modalStreamRef.current) {
			modalStreamRef.current.getTracks().forEach((track) => track.stop());
			modalStreamRef.current = null;
		}
		if (modalVideoRef.current) modalVideoRef.current.srcObject = null;
		setModalCameraActive(false);
	}, []);
	const captureModalBase64 = (0, import_react.useCallback)(() => {
		const video = modalVideoRef.current;
		if (!video || !video.videoWidth) return null;
		try {
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth || 640;
			canvas.height = video.videoHeight || 480;
			const ctx = canvas.getContext("2d");
			if (!ctx) return null;
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			return canvas.toDataURL("image/jpeg", .95);
		} catch {
			return null;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			stopModalCamera();
		};
	}, [stopModalCamera]);
	(0, import_react.useEffect)(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) stopModalCamera();
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [stopModalCamera]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			if (status === "checked-in") {
				setWorkSec((s) => s + 1);
				setActiveSec((s) => s + 1);
			} else if (status === "on-break") {
				setWorkSec((s) => s + 1);
				setBreakSec((s) => s + 1);
			}
		}, 1e3);
		return () => clearInterval(t);
	}, [status]);
	const loadAttendanceState = (0, import_react.useCallback)(async () => {
		setApiError(null);
		try {
			const [punchRes, timelineRes, historyRes, shiftRes, holidaysRes, empRes, faceStatusRes] = await Promise.allSettled([
				attendanceApi.getMyTodayStatus(),
				attendanceApi.getTimeline(),
				attendanceApi.getMyAttendanceHistory(1, 20),
				attendanceApi.getMyShiftSchedule(),
				attendanceApi.getHolidays({ year: (/* @__PURE__ */ new Date()).getFullYear() }),
				attendanceApi.resolveCurrentEmployee(),
				attendanceApi.getFaceStatus()
			]);
			if (faceStatusRes.status === "fulfilled") {
				const fs = faceStatusRes.value;
				setIsFaceEnrolled(Boolean(fs.is_enrolled));
				setEnrolledAt(fs.enrolled_at || null);
			} else setIsFaceEnrolled(false);
			if (punchRes.status === "fulfilled") {
				const p = punchRes.value;
				if (p.checkedOut) setStatus("checked-out");
				else if (p.onBreak) setStatus("on-break");
				else if (p.checkedIn) setStatus("checked-in");
				else setStatus("not-checked-in");
				if (p.checkInTime) {
					const inDate = new Date(p.checkInTime);
					checkInTimeRef.current = inDate;
					if (p.checkedOut && p.workingHours) setWorkSec(Math.round(p.workingHours * 3600));
					else setWorkSec(Math.max(0, Math.floor((Date.now() - inDate.getTime()) / 1e3)));
				}
				if (p.breakDurationMinutes) setBreakSec(p.breakDurationMinutes * 60);
			}
			if (timelineRes.status === "fulfilled") setTimeline(timelineRes.value || []);
			if (historyRes.status === "fulfilled") setHistoryList(historyRes.value?.items || []);
			if (shiftRes.status === "fulfilled") setAssignedShift(shiftRes.value);
			if (holidaysRes.status === "fulfilled") setHolidays(holidaysRes.value || []);
			if (empRes.status === "fulfilled" && empRes.value) setEmployeeDetails(empRes.value);
		} catch (err) {
			console.error("Error loading attendance state:", err);
			setApiError(err?.message || "Failed to load real attendance data from backend.");
		} finally {
			setPageLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadAttendanceState();
	}, [loadAttendanceState]);
	async function handleCaptureAndRegisterFace() {
		setEnrollError(null);
		setIsEnrolling(true);
		try {
			const base64 = captureModalBase64();
			if (!base64) throw new Error("Could not capture image from camera. Please make sure your camera is active and permissions are granted.");
			const successMsg = (await attendanceApi.enrollFace(base64)).message || "Face successfully registered!";
			showToast(successMsg, "success");
			toast.success(successMsg);
			setIsFaceEnrolled(true);
			setShowEnrollModal(false);
			stopModalCamera();
			await loadAttendanceState();
		} catch (err) {
			const msg = err?.message || "Face registration failed. Please ensure your face is well-lit and fully visible.";
			setEnrollError(msg);
			showToast(msg, "error");
			toast.error(msg);
		} finally {
			setIsEnrolling(false);
		}
	}
	function handleCheckIn() {
		if (isFaceEnrolled === false) {
			setShowEnrollModal(true);
			startModalCamera();
			showToast("Face registration required before check-in.", "error");
			toast.error("Face registration required before check-in.");
			return;
		}
		if (status !== "not-checked-in") {
			toast.info(status === "checked-out" ? "You have already completed attendance for today." : "You are already checked in.");
			return;
		}
		setFaceModalMode("check-in");
		setFaceModalOpen(true);
	}
	function handleCheckOut() {
		if (status === "not-checked-in") {
			toast.error("You must check in first before checking out.");
			return;
		}
		if (status === "checked-out") {
			toast.info("You have already checked out for today.");
			return;
		}
		if (isFaceEnrolled === false) {
			setShowEnrollModal(true);
			startModalCamera();
			toast.error("Face registration required before check-out.");
			return;
		}
		setFaceModalMode("check-out");
		setFaceModalOpen(true);
	}
	const handleFaceSuccess = (0, import_react.useCallback)(async (result) => {
		let defaultMsg = "Attendance verified successfully!";
		if (faceModalMode === "check-in") defaultMsg = "Attendance verified & check-in marked successfully!";
		else if (faceModalMode === "check-out") defaultMsg = "Attendance verified & check-out marked successfully!";
		else if (faceModalMode === "break-in") defaultMsg = "Break started. Face verified.";
		else if (faceModalMode === "break-out") defaultMsg = "Break ended. Welcome back!";
		const msg = result.message || defaultMsg;
		showToast(msg, "success");
		toast.success(msg);
		await loadAttendanceState();
	}, [faceModalMode, loadAttendanceState]);
	function handleBreakIn() {
		if (status !== "checked-in") {
			const msg = status === "on-break" ? "You are already on a break." : status === "checked-out" ? "You have already completed attendance for today." : "You must be checked in to start a break.";
			showToast(msg, "info");
			toast.info(msg);
			return;
		}
		if (isFaceEnrolled === false) {
			setShowEnrollModal(true);
			startModalCamera();
			showToast("Face registration required before starting break.", "error");
			toast.error("Face registration required before starting break.");
			return;
		}
		setFaceModalMode("break-in");
		setFaceModalOpen(true);
	}
	function handleBreakOut() {
		if (status !== "on-break") {
			const msg = status === "checked-in" ? "You are not currently on a break." : status === "checked-out" ? "You have already completed attendance for today." : "You must be on a break to end break.";
			showToast(msg, "info");
			toast.info(msg);
			return;
		}
		if (isFaceEnrolled === false) {
			setShowEnrollModal(true);
			startModalCamera();
			showToast("Face registration required before ending break.", "error");
			toast.error("Face registration required before ending break.");
			return;
		}
		setFaceModalMode("break-out");
		setFaceModalOpen(true);
	}
	const expectedHours = assignedShift?.currentShift?.totalWorkingHours ?? null;
	const overtimeSec = expectedHours != null ? Math.max(0, workSec - expectedHours * 3600) : 0;
	const shiftStartStr = assignedShift?.currentShift?.startTime;
	const graceMinutes = assignedShift?.currentShift?.gracePeriodMinutes ?? 0;
	const lateBy = (() => {
		if (!checkInTimeRef.current || !shiftStartStr) return 0;
		const checkInDate = new Date(checkInTimeRef.current);
		let shiftH = 0;
		let shiftM = 0;
		if (shiftStartStr.includes("AM") || shiftStartStr.includes("PM")) {
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
		const diffSec = Math.floor((checkInDate.getTime() - shiftStart.getTime()) / 1e3);
		return diffSec > graceMinutes * 60 ? diffSec : 0;
	})();
	const initials = user?.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "EM";
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
	if (pageLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground font-medium",
			children: "Connecting to attendance services..."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative space-y-6 pb-16",
		children: [
			toast$1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition-all ${toast$1.type === "success" ? "bg-primary text-primary-foreground" : toast$1.type === "error" ? "bg-destructive text-destructive-foreground" : "bg-muted text-foreground border border-border"}`,
				children: toast$1.msg
			}),
			apiError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: apiError })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: loadAttendanceState,
					className: "gap-1 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
				})]
			}),
			isFaceEnrolled === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-6 w-6 animate-pulse" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm sm:text-base font-semibold text-foreground",
								children: "Face Registration Required"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `text-[10px] font-bold ${statusBadgeClass("warning")}`,
								children: "Mandatory"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1 max-w-xl",
							children: "Your biometric face profile is not registered. In accordance with company policy, face enrollment is mandatory before you can check in for attendance."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							setShowEnrollModal(true);
							startModalCamera();
						},
						className: "w-full sm:w-auto shrink-0 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-4 w-4" }), "Register Face Now"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 xl:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "relative overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold bg-primary/10 text-primary",
													children: initials
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${status === "checked-in" ? "bg-primary" : status === "on-break" ? "bg-muted-foreground" : "bg-muted-foreground"}` })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex flex-wrap items-center gap-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
														className: "font-display text-lg font-semibold",
														children: user?.fullName || "Employee"
													})
												}), employeeDetails?.employee_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }),
															" EMP-",
															employeeDetails.employee_id
														]
													})
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground uppercase tracking-wide",
													children: "Working Today"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-2xl font-bold tabular-nums",
													children: fmtHM(workSec)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: status === "checked-in" ? "Shift in progress" : status === "checked-out" ? "Shift completed" : "Awaiting check-in"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
													label: isFaceEnrolled === false ? "Face Required" : status === "checked-in" || status === "on-break" ? "Checked In Today" : status === "checked-out" ? "Day Complete" : "Face Check-In",
													icon: LogIn,
													onClick: handleCheckIn,
													disabled: status !== "not-checked-in" || isFaceEnrolled === false || loading !== null || faceModalOpen,
													variant: "success",
													loading: loading === "checkin"
												}), isFaceEnrolled === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute -top-2 right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-extrabold text-primary-foreground uppercase tracking-wide shadow-sm",
													children: "Enroll First"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
												label: "Break In",
												icon: Coffee,
												onClick: handleBreakIn,
												disabled: status !== "checked-in" || loading !== null || faceModalOpen,
												variant: "warning",
												loading: loading === "breakin"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
												label: "Break Out",
												icon: Play,
												onClick: handleBreakOut,
												disabled: status !== "on-break" || loading !== null || faceModalOpen,
												variant: "primary",
												loading: loading === "breakout"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendBtn, {
												label: status === "not-checked-in" ? "Check In First" : status === "checked-out" ? "Checked Out Today" : "Face Check-Out",
												icon: LogOut,
												onClick: handleCheckOut,
												disabled: status !== "checked-in" && status !== "on-break" || loading !== null || faceModalOpen,
												variant: "danger",
												loading: loading === "checkout"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${status === "checked-in" ? "bg-primary animate-pulse" : status === "on-break" ? "bg-muted-foreground animate-pulse" : "bg-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: status === "not-checked-in" ? "Not Checked In" : status === "checked-in" ? "Currently Working" : status === "on-break" ? "On Break" : "Day Complete"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-4 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Break: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: fmtHM(breakSec)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["OT: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: overtimeSec > 0 ? "text-primary" : "text-foreground",
													children: fmtHM(overtimeSec)
												})] }),
												lateBy > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Late by: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: fmtHM(lateBy)
												})] })
											]
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Live Working Timer",
							icon: Timer
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-6 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DigitalTimer, {
								seconds: workSec,
								running: status === "checked-in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 w-full sm:grid-cols-4",
								children: [
									{
										label: "Total Work",
										value: fmtHM(workSec)
									},
									{
										label: "Active Time",
										value: fmtHM(activeSec)
									},
									{
										label: "Break Time",
										value: fmtHM(breakSec)
									},
									{
										label: "Overtime",
										value: fmtHM(overtimeSec)
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card p-3 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-wide text-muted-foreground",
										children: item.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-lg font-bold tabular-nums text-foreground",
										children: item.value
									})]
								}, item.label))
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Today's Summary",
							icon: ChartColumn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Working Hours",
									value: fmtHM(workSec),
									hint: assignedShift?.currentShift?.totalWorkingHours ? `Expected: ${assignedShift.currentShift.totalWorkingHours}h` : "Flexible",
									icon: Clock,
									accent: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Break Duration",
									value: fmtHM(breakSec),
									hint: assignedShift?.currentShift?.breakDuration ? `Standard: ${assignedShift.currentShift.breakDuration}` : "Recorded time",
									icon: Coffee,
									accent: "warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Overtime",
									value: fmtHM(overtimeSec),
									hint: overtimeSec > 0 ? "Eligible for OT" : "Standard hours",
									icon: Zap,
									accent: "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Late By",
									value: lateBy > 0 ? fmtHM(lateBy) : "On Time",
									hint: assignedShift?.currentShift?.gracePeriodMinutes ? `Grace: ${assignedShift.currentShift.gracePeriodMinutes}m` : "Standard timing",
									icon: CircleAlert,
									accent: lateBy > 0 ? "danger" : "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Check In Time",
									value: checkInTimeRef.current ? checkInTimeRef.current.toLocaleTimeString("en-IN", {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true
									}) : "—",
									hint: checkInTimeRef.current ? "Recorded today" : "Pending check-in",
									icon: LogIn,
									accent: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Current Status",
									value: status === "checked-in" ? "Working" : status === "on-break" ? "On Break" : status === "checked-out" ? "Checked Out" : "Not In",
									hint: nowDateStr(),
									icon: CircleCheck,
									accent: status === "checked-in" ? "success" : "muted"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Today's Timeline",
								icon: History
							}), timeline.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-8 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground/30" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-foreground",
										children: "No events yet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: "Check in to start recording today's activity."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: timeline.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineItem, {
									event: ev,
									isLast: i === timeline.length - 1
								}, ev.id))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Shift Information",
								icon: Briefcase
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5 text-sm",
								children: [
									{
										label: "Shift Name",
										value: assignedShift?.currentShift?.shiftName || "Not Assigned"
									},
									{
										label: "Timing",
										value: assignedShift?.currentShift?.startTime && assignedShift?.currentShift?.endTime ? `${assignedShift.currentShift.startTime} – ${assignedShift.currentShift.endTime}` : "Flexible Schedule"
									},
									{
										label: "Working Days",
										value: assignedShift?.currentShift?.workingDays?.join(", ") || "Flexible"
									},
									{
										label: "Expected Hours",
										value: assignedShift?.currentShift?.totalWorkingHours ? `${assignedShift.currentShift.totalWorkingHours}h 00m` : "—"
									},
									{
										label: "Grace Time",
										value: assignedShift?.currentShift?.gracePeriodMinutes != null ? `${assignedShift.currentShift.gracePeriodMinutes} minutes` : "—"
									},
									{
										label: "Break Duration",
										value: assignedShift?.currentShift?.breakDuration || "—"
									}
								].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground text-xs",
										children: row.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-xs",
										children: row.value
									})]
								}, row.label))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "relative overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
										title: "Biometric Face Attendance",
										icon: ScanFace
									}), isFaceEnrolled !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusBadgeClass(isFaceEnrolled ? "approved" : "warning")}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${isFaceEnrolled ? "bg-primary" : "bg-muted-foreground animate-pulse"}` }), isFaceEnrolled ? "Face Profile Active" : "Registration Required"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-semibold text-foreground",
													children: "Touchless Biometric AI Attendance"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground leading-relaxed",
													children: "Automatic face capture with backend 3D neural vector matching. No manual photo-clicking needed."
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2 pt-1 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Liveness Check" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GPS Geofence Validation" })]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isFaceEnrolled === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => {
											setShowEnrollModal(true);
											startModalCamera();
										},
										className: "w-full gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-4 w-4" }), " Register Face Profile"]
									}) : status === "not-checked-in" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleCheckIn,
										className: "w-full gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), " Start Face Check-In"]
									}) : status === "checked-in" || status === "on-break" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleCheckOut,
										variant: "destructive",
										className: "w-full gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Start Face Check-Out"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: true,
										className: "w-full gap-2 text-xs font-semibold bg-muted text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-muted-foreground" }), " Day Completed"]
									}) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Device Information",
								icon: Monitor
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 text-xs",
								children: [
									{
										label: "Browser",
										value: browserInfo,
										icon: Laptop
									},
									{
										label: "Operating System",
										value: platformInfo,
										icon: Monitor
									},
									{
										label: "Display Resolution",
										value: screenSize,
										icon: Monitor
									},
									{
										label: "Network State",
										value: onlineStatus,
										icon: Wifi
									},
									{
										label: "Session Security",
										value: "Authenticated via JWT",
										icon: ShieldCheck
									}
								].map((row) => {
									const Icon = row.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg px-3 py-1.5 hover:bg-muted/40 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), row.label]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: row.value
										})]
									}, row.label);
								})
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
								title: "Notes",
								icon: MessageSquare
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								className: "gap-1 text-xs",
								onClick: () => setNotesOpen((o) => !o),
								children: [notesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }), notesOpen ? "Collapse" : "Expand"]
							})]
						}), notesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
								children: "Daily Attendance Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1.5 resize-none text-sm",
								rows: 3,
								placeholder: "Add an optional note for today's punch...",
								value: noteEmp,
								onChange: (e) => setNoteEmp(e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "gap-2",
								onClick: () => showToast("Note will be saved with next punch", "info"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Save Note"]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Monthly Attendance Calendar",
							icon: CalendarDays
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCalendar, { history: historyList })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "!p-0 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between border-b border-border px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-semibold text-sm",
										children: "Recent Attendance History"
									})]
								})
							}), historyList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-12 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground/30" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-foreground",
										children: "No attendance records found."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: "Your daily check-in and check-out records from the database will appear here."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
										className: "border-b border-border bg-muted/30 text-left text-[11px] uppercase tracking-wide text-muted-foreground",
										children: [
											"Date",
											"Check In",
											"Check Out",
											"Working Hours",
											"Status",
											"Location"
										].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2.5 font-medium",
											children: h
										}, h))
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: historyList.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border/50 transition-colors hover:bg-accent/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 font-medium text-xs",
												children: r.date
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-xs font-mono",
												children: r.checkInTime || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-xs font-mono",
												children: r.checkOutTime || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-xs font-semibold",
												children: r.workingHours ? fmtHM(r.workingHours * 3600) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `inline-flex items-center text-[10px] font-medium ${statusBadgeClass(r.status)}`,
													children: r.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2.5 text-xs text-muted-foreground",
												children: r.location || "Office"
											})
										]
									}, r.id)) })]
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Today's Status",
							icon: CircleCheck
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 rounded-lg border border-border/40 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: status === "checked-in" ? "Active Shift" : status === "on-break" ? "On Break" : status === "checked-out" ? "Shift Finished" : "Awaiting Punch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground mt-0.5",
									children: checkInTimeRef.current ? `Checked in at ${checkInTimeRef.current.toLocaleTimeString("en-IN", {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true
									})}` : "Punch in to begin recording today's work hours."
								})] })]
							}), lateBy > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 rounded-lg border border-border bg-muted p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-muted-foreground shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: "Late Punch Alert"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Shift arrival was recorded after the standard 15-minute grace window."
								})] })]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Upcoming Holidays",
							icon: CalendarDays
						}), holidays.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mx-auto mb-2 h-7 w-7 text-muted-foreground/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No upcoming holidays found."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: holidays.slice(0, 5).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium",
									children: h.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: h.type || "Company Holiday"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-mono font-semibold",
										children: h.date
									})
								})]
							}, h.id || h.date))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							title: "Quick Links",
							icon: Zap
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								{
									label: "My Leaves",
									icon: CalendarDays,
									href: "/dashboard/leaves"
								},
								{
									label: "My Shifts",
									icon: Clock,
									href: "/dashboard/attendance/shifts"
								},
								{
									label: "My Roster",
									icon: CalendarDays,
									href: "/dashboard/attendance/rosters"
								},
								{
									label: "Holidays",
									icon: CalendarDays,
									href: "/dashboard/attendance/holidays"
								},
								{
									label: "Support",
									icon: CircleQuestionMark,
									href: "/dashboard/help/raise-ticket"
								},
								{
									label: "Directory",
									icon: User,
									href: "/dashboard/workforce"
								}
							].map((ql) => {
								const Icon = ql.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: ql.href,
									className: "flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium transition-colors hover:bg-accent/60 hover:border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), ql.label]
								}, ql.label);
							})
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceAttendanceDialog, {
				open: faceModalOpen,
				mode: faceModalMode,
				onOpenChange: setFaceModalOpen,
				onSuccess: handleFaceSuccess,
				employeeDetails,
				currentUser: user,
				notes: noteEmp
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showEnrollModal,
				onOpenChange: (open) => {
					setShowEnrollModal(open);
					if (open) {
						setEnrollError(null);
						startModalCamera();
					} else stopModalCamera();
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md p-6 sm:rounded-2xl border-border bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Biometric Registration"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "font-display text-lg font-bold",
								children: "Face Registration Required"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: "Center your face inside the oval guide outline. Ensure clear ambient lighting and look directly into the camera."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/3] w-full rounded-2xl bg-black/95 overflow-hidden border border-border flex items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									ref: modalVideoRef,
									autoPlay: true,
									playsInline: true,
									muted: true,
									className: `h-full w-full object-cover ${modalCameraActive ? "block" : "hidden"}`
								}),
								!modalCameraActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2.5 p-6 text-center text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "h-10 w-10 text-muted-foreground/40" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-medium text-foreground",
											children: "Webcam Inactive"
										}),
										modalCameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-destructive max-w-xs",
											children: modalCameraError
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "mt-1 gap-1.5 text-xs",
											onClick: startModalCamera,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3.5 w-3.5" }), " Enable Webcam"]
										})
									]
								}),
								modalCameraActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-44 h-56 sm:w-48 sm:h-60 rounded-[50%] border-2 border-primary shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-white" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-white" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-white" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-white" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] text-white border border-white/10 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-3 w-3 text-primary" }), " Keep face centered inside the frame"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 text-[10px] text-muted-foreground text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/40 p-2 border border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground block",
										children: "Good Lighting"
									}), "Avoid dark shadows"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/40 p-2 border border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground block",
										children: "Look Straight"
									}), "Level with camera"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/40 p-2 border border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground block",
										children: "Neutral Pose"
									}), "No masks or glasses"]
								})
							]
						}),
						enrollError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: enrollError })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setShowEnrollModal(false);
									stopModalCamera();
								},
								disabled: isEnrolling,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: handleCaptureAndRegisterFace,
								disabled: !modalCameraActive || isEnrolling,
								className: "gap-2 text-xs",
								children: [isEnrolling ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-3.5 w-3.5" }), isEnrolling ? "Registering Face Profile..." : "Capture & Register Face"]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { CheckInPage as default };
