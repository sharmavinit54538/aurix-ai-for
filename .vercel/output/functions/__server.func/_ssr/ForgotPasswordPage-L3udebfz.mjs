import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as authService } from "./auth-BRJn5RkQ.mjs";
import { Dt as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as AuthShell } from "./AuthShell-09O7phGv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ForgotPasswordPage-L3udebfz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPasswordPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (loading) return;
		if (!stringType().email().safeParse(email).success) return setError("Enter a valid email");
		setError(null);
		setLoading(true);
		try {
			const res = await authService.forgotPassword({ email });
			if (res.success) {
				toast.success(res.message || "OTP sent successfully.");
				navigate({
					to: "/verify-reset-otp",
					search: { email },
					state: { email }
				});
			} else toast.error(res.message || "Failed to send OTP.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "User not found or connection error";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Reset your password",
		subtitle: "Enter the email tied to your workspace and we'll send a verification OTP.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: "font-medium text-foreground underline-offset-4 hover:underline",
			children: "Back to sign in"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			noValidate: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "forgot-email",
						children: "Work email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "forgot-email",
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "you@company.com",
						"aria-invalid": !!error,
						disabled: loading
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: error
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				className: "w-full",
				disabled: loading,
				children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Send OTP"]
			})]
		})
	});
}
//#endregion
export { ForgotPasswordPage as t };
