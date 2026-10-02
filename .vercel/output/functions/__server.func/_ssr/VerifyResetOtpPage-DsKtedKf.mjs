import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as useSearch, l as useLocation, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as authService } from "./auth-BRJn5RkQ.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as AuthShell } from "./AuthShell-09O7phGv.mjs";
import { n as InputOTPGroup, r as InputOTPSlot, t as InputOTP } from "./input-otp-jcYIC_qR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VerifyResetOtpPage-DsKtedKf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyResetOtpPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { email: searchEmail } = useSearch({ strict: false });
	const state = location.state;
	const email = searchEmail || state?.email || "";
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [expiryTime, setExpiryTime] = (0, import_react.useState)(300);
	const [resendCooldown, setResendCooldown] = (0, import_react.useState)(30);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!email) {
			toast.error("Please enter your email first.");
			navigate({ to: "/forgot-password" });
		}
	}, [email, navigate]);
	(0, import_react.useEffect)(() => {
		if (expiryTime <= 0) return;
		const t = setTimeout(() => setExpiryTime((s) => s - 1), 1e3);
		return () => clearTimeout(t);
	}, [expiryTime]);
	(0, import_react.useEffect)(() => {
		if (resendCooldown <= 0) return;
		const t = setTimeout(() => setResendCooldown((s) => s - 1), 1e3);
		return () => clearTimeout(t);
	}, [resendCooldown]);
	const formatTime = (sec) => {
		const mins = Math.floor(sec / 60);
		const secs = sec % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};
	async function onSubmit(e) {
		e.preventDefault();
		if (loading) return;
		if (code.length !== 6) return setError("Enter the 6-digit code");
		setError(null);
		setLoading(true);
		try {
			const res = await authService.verifyResetOtp({
				email,
				otp: code
			});
			if (res.success && res.data) {
				toast.success(res.message || "OTP verified successfully!");
				const { resetToken } = res.data;
				navigate({
					to: "/reset-password",
					search: {
						email,
						resetToken
					},
					state: {
						email,
						resetToken
					}
				});
			} else {
				setError(res.message || "Verification failed");
				toast.error(res.message || "Verification failed");
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Incorrect or expired code";
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}
	async function handleResend() {
		if (resendCooldown > 0) return;
		setLoading(true);
		setError(null);
		try {
			const res = await authService.forgotPassword({ email });
			if (res.success) {
				setExpiryTime(300);
				setResendCooldown(30);
				setCode("");
				toast.success(res.message || "New OTP sent successfully!");
			} else toast.error(res.message || "Failed to resend OTP");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to resend OTP";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Verify security code",
		subtitle: "We sent a 6-digit verification code to your email.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email-display",
						children: "Email Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email-display",
						type: "email",
						value: email,
						readOnly: true,
						disabled: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 flex flex-col items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "self-start",
							children: "Verification Code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTP, {
							maxLength: 6,
							value: code,
							onChange: (val) => setCode(val),
							disabled: loading,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InputOTPGroup, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: 0 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: 1 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: 2 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: 3 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: 4 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, { index: 5 })
							] })
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive self-start mt-1",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full justify-between items-center text-xs mt-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Code expires in:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatTime(expiryTime)
								})
							] }), resendCooldown > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Resend in ",
								resendCooldown,
								"s"
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleResend,
								className: "text-primary hover:underline font-medium",
								disabled: loading,
								children: "Resend OTP"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading || code.length !== 6,
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Verify code"]
				})
			]
		})
	});
}
//#endregion
export { VerifyResetOtpPage as t };
