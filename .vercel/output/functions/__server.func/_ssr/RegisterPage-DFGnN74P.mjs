import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Jn as Eye, Yn as EyeOff, qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as authService } from "./auth-BRJn5RkQ.mjs";
import { Dt as stringType, Tt as objectType, xt as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { t as AuthShell } from "./AuthShell-09O7phGv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RegisterPage-DFGnN74P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	fullName: stringType().min(3, "Name must be at least 3 characters").max(100, "Name must be at most 100 characters").regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Name can contain only letters and single spaces"),
	email: stringType().email("Enter a valid work email"),
	phone: stringType().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
	companyName: stringType().min(2, "Enter your company name"),
	password: stringType().min(8, "At least 8 characters").max(64, "At most 64 characters").regex(/[A-Z]/, "Include at least one uppercase letter").regex(/[a-z]/, "Include at least one lowercase letter").regex(/[0-9]/, "Include at least one number").regex(/[^A-Za-z0-9]/, "Include at least one special character (e.g. @, #, !)"),
	confirm: stringType(),
	accept: booleanType()
}).refine((d) => d.password === d.confirm, {
	message: "Passwords do not match",
	path: ["confirm"]
}).refine((d) => d.accept, {
	message: "You must accept the terms",
	path: ["accept"]
});
function passwordScore(p) {
	let s = 0;
	if (p.length >= 8) s++;
	if (/[A-Z]/.test(p)) s++;
	if (/[a-z]/.test(p)) s++;
	if (/[0-9]/.test(p)) s++;
	if (/[^A-Za-z0-9]/.test(p)) s++;
	return Math.min(s, 4);
}
function RegisterPage() {
	const navigate = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		phone: "",
		companyName: "",
		password: "",
		confirm: "",
		accept: false
	});
	const [show, setShow] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function onSubmit(e) {
		e.preventDefault();
		const r = schema.safeParse(form);
		if (!r.success) {
			const fe = {};
			r.error.issues.forEach((i) => fe[i.path[0]] = i.message);
			setErrors(fe);
			return;
		}
		setErrors({});
		setLoading(true);
		try {
			const payload = {
				name: form.fullName,
				email: form.email,
				phone: form.phone,
				password: form.password,
				company_name: form.companyName
			};
			const res = await authService.register(payload);
			if (res.success) {
				aurix.set({
					user: {
						id: "",
						fullName: form.fullName,
						email: form.email,
						phone: form.phone,
						role: "hr_admin",
						companyId: "workspace",
						emailVerified: false,
						onboardingComplete: false,
						createdAt: (/* @__PURE__ */ new Date()).toISOString()
					},
					company: {
						id: "workspace",
						name: form.companyName
					}
				});
				toast.success(res.message || "Registration successful!");
				navigate({ to: "/verify-email" });
			} else toast.error(res.message || "Registration failed");
		} catch (err) {
			const apiErr = err;
			const apiErrors = apiErr?.data?.errors ?? [];
			if (apiErrors.length > 0) {
				const fieldMap = {
					name: "fullName",
					company_name: "companyName"
				};
				const fe = {};
				apiErrors.forEach(({ field, message }) => {
					if (field) {
						const key = fieldMap[field] ?? field;
						fe[key] = message;
					}
				});
				if (Object.keys(fe).length > 0) setErrors(fe);
				toast.error(apiErrors[0]?.message ?? apiErr.message ?? "Validation failed");
			} else toast.error(apiErr.message || "Registration failed. Please check your details.");
		} finally {
			setLoading(false);
		}
	}
	const score = passwordScore(form.password);
	const scoreLabel = [
		"Very weak",
		"Weak",
		"Fair",
		"Good",
		"Strong"
	][score];
	const scoreColor = [
		"bg-destructive",
		"bg-destructive",
		"bg-amber-500",
		"bg-emerald-500",
		"bg-emerald-500"
	][score];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		title: "Create your workspace",
		subtitle: "You'll be set up as the HR Administrator for your company",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Already have a workspace?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "font-medium text-foreground underline-offset-4 hover:underline",
				children: "Sign in"
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
							htmlFor: "fullName",
							children: "Full name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fullName",
							value: form.fullName,
							onChange: (e) => set("fullName", e.target.value),
							placeholder: "Jane Cooper",
							"aria-invalid": !!errors.fullName
						}),
						errors.fullName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.fullName
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "companyName",
							children: "Company Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "companyName",
							value: form.companyName,
							onChange: (e) => set("companyName", e.target.value),
							placeholder: "Acme Corp",
							"aria-invalid": !!errors.companyName
						}),
						errors.companyName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.companyName
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Work email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								value: form.email,
								onChange: (e) => set("email", e.target.value),
								placeholder: "you@company.com",
								"aria-invalid": !!errors.email
							}),
							errors.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: errors.email
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "phone",
								children: "Phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "phone",
								value: form.phone,
								onChange: (e) => set("phone", e.target.value),
								placeholder: "Enter 10-digit mobile number",
								"aria-invalid": !!errors.phone,
								maxLength: 10
							}),
							errors.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: errors.phone
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							children: "Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: show ? "text" : "password",
								value: form.password,
								onChange: (e) => set("password", e.target.value),
								placeholder: "••••••••",
								"aria-invalid": !!errors.password
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShow((s) => !s),
								className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground",
								"aria-label": show ? "Hide password" : "Show password",
								children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						form.password ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full transition-all ${scoreColor}`,
									style: { width: `${score / 4 * 100}%` }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: scoreLabel
							})]
						}) : null,
						!form.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Must be 8–64 chars with uppercase, lowercase, number & special character (e.g. @, #, !)"
						}),
						errors.password ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.password
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "confirm",
							children: "Confirm password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "confirm",
							type: show ? "text" : "password",
							value: form.confirm,
							onChange: (e) => set("confirm", e.target.value),
							placeholder: "••••••••",
							"aria-invalid": !!errors.confirm
						}),
						errors.confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors.confirm
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: form.accept,
							onCheckedChange: (v) => set("accept", Boolean(v)),
							className: "mt-0.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"I agree to the",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "text-foreground underline-offset-4 hover:underline",
								children: "Terms"
							}),
							" ",
							"and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "text-foreground underline-offset-4 hover:underline",
								children: "Privacy Policy"
							})
						] })]
					}), errors.accept ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: errors.accept
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Create workspace"]
				})
			]
		})
	});
}
//#endregion
export { RegisterPage as t };
