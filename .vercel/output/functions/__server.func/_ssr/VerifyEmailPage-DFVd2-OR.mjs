import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Sr as CircleCheck, qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { c as useAurix, t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as authService } from "./auth-BRJn5RkQ.mjs";
import { t as AuthLoadingScreen } from "./AuthLoadingScreen-B5FD3SMB.mjs";
import { t as AuthShell } from "./AuthShell-09O7phGv.mjs";
import { n as InputOTPGroup, r as InputOTPSlot, t as InputOTP } from "./input-otp-jcYIC_qR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VerifyEmailPage-DFVd2-OR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyEmailPage() {
	const navigate = useNavigate();
	const ws = useAurix();
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [secondsLeft, setSecondsLeft] = (0, import_react.useState)(30);
	const [resending, setResending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (ws.isRestoring) return;
		if (!ws.user) navigate({ to: "/register" });
		else if (ws.user.emailVerified) navigate({ to: "/onboarding" });
	}, [
		ws.user,
		ws.isRestoring,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (secondsLeft <= 0) return;
		const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1e3);
		return () => clearTimeout(t);
	}, [secondsLeft]);
	if (ws.isRestoring) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	async function onSubmit(e) {
		e.preventDefault();
		if (code.length !== 6) return setError("Enter the 6-digit code");
		setError(null);
		setLoading(true);
		try {
			const email = ws.user?.email || "";
			const res = await authService.verifyEmail({
				email,
				otp: code
			});
			if (res.success) {
				if (ws.user) aurix.set({ user: {
					...ws.user,
					emailVerified: true
				} });
				setSuccess(true);
				toast.success(res.message || "Email verified successfully!");
				setTimeout(() => navigate({ to: "/onboarding" }), 1100);
			} else setError(res.message || "Verification failed");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Incorrect or expired code");
		} finally {
			setLoading(false);
		}
	}
	async function resend() {
		const payload = { email: ws.user?.email || "" };
		setResending(true);
		try {
			const res = await authService.resendOtp(payload);
			if (res.success) {
				setSecondsLeft(30);
				toast.success(res.message || "OTP sent successfully.");
			} else toast.error(res.message || "Failed to resend code");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Too many attempts, please try again later.";
			toast.error(message);
		} finally {
			setResending(false);
		}
	}
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Email verified",
		subtitle: "Redirecting to onboarding…",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-500",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"All set, ",
					ws.user?.fullName?.split(" ")[0],
					"."
				]
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Verify your email",
		subtitle: ws.user ? `We sent a 6-digit code to ${ws.user.email}` : "We sent you a 6-digit code",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-5",
			noValidate: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTP, {
						maxLength: 6,
						value: code,
						onChange: setCode,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPGroup, { children: [
							0,
							1,
							2,
							3,
							4,
							5
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: i }, i)) })
					})
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-destructive",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Verify email"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: secondsLeft > 0 ? `Code expires in ${secondsLeft}s` : "Code expired" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: resend,
						disabled: secondsLeft > 0 || resending,
						className: "inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline",
						children: [resending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : null, "Resend code"]
					})]
				})
			]
		})
	});
}
//#endregion
export { VerifyEmailPage as t };
