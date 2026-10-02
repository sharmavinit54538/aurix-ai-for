import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Jn as Eye, Yn as EyeOff, qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { o as rememberStore, t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as getErrorMessage } from "./utils-DQc9Fr86.mjs";
import { t as authService } from "./auth-BRJn5RkQ.mjs";
import { Dt as stringType, Tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { B as getSafeRedirectUrl, V as hasValidAccessToken, W as persistAuthSession, nt as useAuthReady } from "./auth-bootstrap-CR9kF6gO.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { n as parseLoginResponse, t as getApiResponseMessage } from "./parseLoginResponse-KUjZ0IxY.mjs";
import { t as AuthShell } from "./AuthShell-09O7phGv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LoginPage-Bsr8NwNw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	email: stringType().email("Enter a valid work email"),
	password: stringType().min(8, "Password must be at least 8 characters")
});
function formatLoginError(message) {
	return message === "Invalid email or password." ? "Invalid email or password" : message;
}
function LoginPage() {
	const navigate = useNavigate();
	const authReady = useAuthReady();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(false);
	const [show, setShow] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!authReady) return;
		const ws = aurix.get();
		if (ws.user && hasValidAccessToken()) {
			const params = new URLSearchParams(window.location.search);
			navigate({
				to: getSafeRedirectUrl(params.get("redirect") || params.get("callbackUrl"), ws.user),
				replace: true
			});
		}
	}, [authReady, navigate]);
	(0, import_react.useEffect)(() => {
		const savedEmail = rememberStore.get();
		if (savedEmail) {
			setEmail(savedEmail);
			setRemember(true);
		}
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		const r = schema.safeParse({
			email,
			password
		});
		if (!r.success) {
			const fe = {};
			r.error.issues.forEach((i) => fe[i.path[0]] = i.message);
			setErrors(fe);
			return;
		}
		setErrors({});
		setLoading(true);
		try {
			if (remember) rememberStore.set(email);
			else rememberStore.clear();
			const res = await authService.login({
				identifier: email,
				password
			});
			const login = parseLoginResponse(res);
			if (login) {
				const { accessToken, refreshToken, user } = login;
				persistAuthSession(user, {
					accessToken,
					refreshToken
				});
				toast.success(`Welcome back, ${user.name}!`);
				const params = new URLSearchParams(window.location.search);
				navigate({ to: getSafeRedirectUrl(params.get("redirect") || params.get("callbackUrl"), user) });
				return;
			}
			toast.error(formatLoginError(getApiResponseMessage(res)));
		} catch (err) {
			toast.error(formatLoginError(getErrorMessage(err, "Server error")));
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Welcome back",
		subtitle: "Sign in to your OFC360 workspace",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"New to OFC360?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/register",
				className: "font-medium text-foreground underline-offset-4 hover:underline",
				children: "Create a workspace"
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			noValidate: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Work email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							autoComplete: "email",
							placeholder: "you@company.com",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							"aria-invalid": !!errors.email
						}),
						errors.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.email
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/forgot-password",
								className: "text-xs text-muted-foreground hover:text-foreground",
								children: "Forgot password?"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: show ? "text" : "password",
								autoComplete: "current-password",
								placeholder: "••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								"aria-invalid": !!errors.password
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShow((s) => !s),
								className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground",
								"aria-label": show ? "Hide password" : "Show password",
								children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						errors.password ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.password
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: remember,
						onCheckedChange: (v) => setRemember(Boolean(v))
					}), "Remember me on this device"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Sign in"]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as t };
