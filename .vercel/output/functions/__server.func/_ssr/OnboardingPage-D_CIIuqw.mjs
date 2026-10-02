import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, b as useSearch, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, H as Sparkles, Or as ChevronLeft, S as Upload, Sr as CircleCheck, _ as UserPlus, b as UserCog, bt as Pencil, ht as Plus, k as Trash2, li as ArrowRight, p as Users, qr as Building2, qt as LoaderCircle, z as Stamp } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, s as uid, t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api, d as setTokens } from "./apiInstance-C5A0vaLH.mjs";
import { t as AuthLoadingScreen } from "./AuthLoadingScreen-B5FD3SMB.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { n as TimezoneSelect, r as getDefaultTimezoneForCountry, t as CountrySelect } from "./CountrySelect-Bg7_a-Z_.mjs";
import { t as require_papaparse } from "../_libs/papaparse.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OnboardingPage-D_CIIuqw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_papaparse = /* @__PURE__ */ __toESM(require_papaparse());
function Stepper({ steps, current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-wrap items-center gap-2 sm:gap-3",
		children: steps.map((label, i) => {
			const isDone = i < current;
			const isActive = i === current;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2 sm:gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					layout: true,
					className: `flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${isActive ? "border-transparent text-brand-foreground shadow-glow" : isDone ? "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "border-border bg-card/40 text-muted-foreground"}`,
					style: isActive ? { background: "var(--gradient-brand)" } : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-5 w-5 place-items-center rounded-full text-[10px] ${isDone ? "bg-emerald-500 text-white" : isActive ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"}`,
						children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: label
					})]
				}), i < steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden h-px w-6 bg-border sm:inline-block" }) : null]
			}, label);
		})
	});
}
var STEPS = [
	"Company",
	"Admin Profile",
	"HR Settings",
	"Departments & Designations",
	"Invite Employees",
	"Complete"
];
var INDUSTRIES = [
	"Software",
	"Finance",
	"Healthcare",
	"Retail",
	"Manufacturing",
	"Education",
	"Other"
];
var SIZES = [
	"1–10",
	"11–50",
	"51–200",
	"201–500",
	"501–1000",
	"1000+"
];
var DAYS = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
function backendStepToUiIndex(backendStep) {
	return Math.max(0, Math.min(5, backendStep - 1));
}
async function syncDeptsAndDesignations(ws) {
	const depts = Array.from(new Set([
		"Management",
		...ws.hrs.map((h) => h.department),
		...ws.employees.map((e) => e.department),
		...ws.managers.map((m) => m.department)
	].filter(Boolean))).map((d, index) => ({
		department_code: d.substring(0, 3).toUpperCase() + "_" + (10 + index),
		department_name: d,
		description: `Department for ${d}`
	}));
	await api.post("onboarding/departments", { departments: depts });
	const designations = Array.from(new Set([
		"Company Owner",
		...ws.hrs.map((h) => h.designation),
		...ws.employees.map((e) => e.designation),
		...ws.managers.map((m) => m.designation)
	].filter(Boolean)));
	await api.post("onboarding/designations", { designations });
}
async function syncInvites(ws) {
	const allInvites = [
		...ws.hrs.map((h) => {
			const parts = h.fullName.split(" ");
			return {
				first_name: parts[0] || "HR",
				last_name: parts.slice(1).join(" ") || "Member",
				personal_email: h.email,
				phone: h.phone || "",
				department: h.department || "Human Resources",
				designation: h.designation || "HR Specialist"
			};
		}),
		...ws.employees.map((e) => {
			const parts = e.fullName.split(" ");
			return {
				first_name: parts[0] || "Employee",
				last_name: parts.slice(1).join(" ") || "Member",
				personal_email: e.email,
				phone: e.phone || "",
				department: e.department || "Engineering",
				designation: e.designation || "Software Engineer"
			};
		}),
		...ws.managers.map((m) => {
			const parts = m.fullName.split(" ");
			return {
				first_name: parts[0] || "Manager",
				last_name: parts.slice(1).join(" ") || "Member",
				personal_email: m.email,
				phone: m.phone || "",
				department: m.department || "Management",
				designation: m.designation || "Team Manager"
			};
		})
	].filter((x) => x.personal_email && x.first_name);
	allInvites.forEach((inv) => {
		inv.phone = (inv.phone || "").replace(/\D/g, "");
	});
	if (allInvites.length > 0) await api.post("onboarding/invite-employees", {
		employees: allInvites,
		skip: false
	});
	else await api.post("onboarding/invite-employees", {
		employees: [],
		skip: true
	});
}
function OnboardingPage() {
	const navigate = useNavigate();
	const ws = useAurix();
	const [step, setStep] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const token = useSearch({ strict: false })?.token;
	const [tokenLoading, setTokenLoading] = (0, import_react.useState)(token ? true : false);
	const [tokenError, setTokenError] = (0, import_react.useState)(null);
	const [empData, setEmpData] = (0, import_react.useState)(null);
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [profilePhoto, setProfilePhoto] = (0, import_react.useState)("");
	const [emergencyName, setEmergencyName] = (0, import_react.useState)("");
	const [emergencyPhone, setEmergencyPhone] = (0, import_react.useState)("");
	const [acceptPolicies, setAcceptPolicies] = (0, import_react.useState)(false);
	const [activating, setActivating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!token) return;
		setTokenLoading(true);
		setTokenError(null);
		api.get(`onboarding/validate?token=${token}`).then((res) => {
			if (res.success) {
				setEmpData(res.data);
				setPhone(res.data.phone || "");
			} else setTokenError(res.message || "Invitation expired. Request new invitation.");
		}).catch((err) => {
			setTokenError(err.message || "Invitation expired. Request new invitation.");
		}).finally(() => {
			setTokenLoading(false);
		});
	}, [token]);
	const [resuming, setResuming] = (0, import_react.useState)(true);
	const statusFetchedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (token) {
			setResuming(false);
			return;
		}
		if (ws.isRestoring) return;
		if (!ws.user) {
			navigate({ to: "/register" });
			return;
		}
		if (!ws.user.emailVerified) {
			navigate({ to: "/verify-email" });
			return;
		}
		if (ws.user.onboardingComplete) {
			navigate({ to: "/dashboard" });
			return;
		}
		if (statusFetchedRef.current) return;
		statusFetchedRef.current = true;
		let cancelled = false;
		(async () => {
			try {
				const statusRes = await api.get("onboarding/status");
				const backendStep = statusRes?.current_step ?? statusRes?.data?.current_step ?? 1;
				if ((statusRes?.onboarding_completed ?? statusRes?.data?.onboarding_completed ?? false) || backendStep >= 7) {
					if (ws.user) aurix.set({ user: {
						...ws.user,
						onboardingComplete: true
					} });
					navigate({
						to: "/dashboard",
						replace: true
					});
					return;
				}
				const progressRes = await api.get("onboarding/progress");
				const progress = progressRes?.data ?? progressRes;
				if (progress && !cancelled) {
					const profile = progress.company_profile;
					const companyName = profile?.company_name ?? progress.organization?.company_name ?? ws.company?.name ?? "";
					aurix.set({ company: {
						id: ws.company?.id ?? uid("co"),
						name: companyName,
						logoDataUrl: profile?.company_logo ?? ws.company?.logoDataUrl ?? void 0,
						industry: profile?.industry ?? ws.company?.industry ?? "",
						size: profile?.company_size ?? ws.company?.size ?? "",
						website: profile?.website ?? ws.company?.website ?? "",
						email: profile?.email ?? ws.company?.email ?? "",
						phone: profile?.phone ?? ws.company?.phone ?? "",
						address: profile?.address ?? ws.company?.address ?? "",
						country: profile?.country ?? ws.company?.country ?? "",
						state: profile?.state ?? ws.company?.state ?? "",
						city: profile?.city ?? ws.company?.city ?? "",
						timezone: profile?.timezone ?? ws.company?.timezone ?? "UTC"
					} });
				}
				if (!cancelled) setStep(backendStepToUiIndex(backendStep));
			} catch (err) {
				if (!cancelled) setStep(0);
			} finally {
				if (!cancelled) setResuming(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		ws.user,
		ws.isRestoring,
		navigate,
		token
	]);
	function next() {
		setStep((s) => Math.min(STEPS.length - 1, s + 1));
	}
	function back() {
		setStep((s) => Math.max(0, s - 1));
	}
	function goto(i) {
		setStep(i);
	}
	async function finish() {
		setLoading(true);
		try {
			await api.post("onboarding/complete");
			if (ws.user) aurix.set({ user: {
				...ws.user,
				onboardingComplete: true
			} });
			setStep(6);
		} catch (err) {
			toast.error(err.message || "Failed to complete onboarding. Please try again.");
		} finally {
			setLoading(false);
		}
	}
	if (ws.isRestoring) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	if (token) {
		if (tokenLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative min-h-screen flex items-center justify-center bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 -z-10",
				style: { background: "var(--gradient-hero)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin mx-auto text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Validating your invitation..."
				})]
			})]
		});
		if (tokenError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative min-h-screen flex items-center justify-center bg-background p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 -z-10",
				style: { background: "var(--gradient-hero)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full rounded-2xl border border-border bg-card/70 p-8 text-center shadow-elegant backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-6 grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold tracking-tight text-foreground",
						children: "Invitation Expired"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Invitation expired. Request new invitation."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => navigate({ to: "/login" }),
							className: "w-full",
							children: "Go to Login"
						})
					})
				]
			})]
		});
		if (empData) {
			const handleActivate = async (e) => {
				e.preventDefault();
				if (!password) return toast.error("Password is required");
				if (password.length < 8) return toast.error("Password must be at least 8 characters long");
				if (!/[A-Z]/.test(password)) return toast.error("Password must contain at least 1 uppercase letter");
				if (!/[a-z]/.test(password)) return toast.error("Password must contain at least 1 lowercase letter");
				if (!/[0-9]/.test(password)) return toast.error("Password must contain at least 1 number");
				if (!/[^A-Za-z0-9]/.test(password)) return toast.error("Password must contain at least 1 special character");
				if (password !== confirmPassword) return toast.error("Passwords do not match");
				if (!acceptPolicies) return toast.error("You must accept the company policies and terms of service");
				setActivating(true);
				try {
					const res = await api.post("onboarding/activate", {
						token,
						password,
						phone,
						emergency_contact_name: emergencyName || null,
						emergency_contact_phone: emergencyPhone || null,
						profile_photo_url: profilePhoto || null
					});
					if (res.success) {
						toast.success("Account activated successfully! Logging you in...");
						if (res.data?.user) aurix.set({ user: res.data.user });
						if (res.data?.access_token && res.data?.refresh_token) setTokens({
							accessToken: res.data.access_token,
							refreshToken: res.data.refresh_token
						});
						const role = res.data?.user?.role;
						setTimeout(() => {
							if (role === "admin" || role === "hr") navigate({ to: "/dashboard" });
							else if (role === "manager") navigate({ to: "/dashboard/manager" });
							else navigate({ to: "/dashboard/employee" });
						}, 1e3);
					} else toast.error(res.message || "Failed to activate account. Please try again.");
				} catch (err) {
					toast.error(err.message || "Failed to activate account. Please try again.");
				} finally {
					setActivating(false);
				}
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-screen overflow-hidden bg-background",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-hidden": true,
						className: "pointer-events-none absolute inset-0 -z-10",
						style: { background: "var(--gradient-hero)" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center justify-between px-6 py-5 sm:px-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow",
								style: { background: "var(--gradient-brand)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg font-semibold tracking-tight",
								children: "OFC360"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Account Setup"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-2xl px-6 pb-16 sm:px-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border bg-card/70 p-6 shadow-elegant backdrop-blur-xl sm:p-8",
							style: { borderColor: "var(--glass-border)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow",
									style: { background: "var(--gradient-brand)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-semibold tracking-tight",
									children: "Complete Your Account Setup"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Welcome! Please fill in the details below to activate your employee profile."
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleActivate,
								className: "space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Employee ID"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: empData.employee_id,
													readOnly: true,
													disabled: true,
													className: "bg-muted/50 cursor-not-allowed opacity-80"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Full Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: `${empData.first_name} ${empData.last_name}`,
													readOnly: true,
													disabled: true,
													className: "bg-muted/50 cursor-not-allowed opacity-80"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5 sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: empData.personal_email,
													readOnly: true,
													disabled: true,
													className: "bg-muted/50 cursor-not-allowed opacity-80"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Department"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: empData.department,
													readOnly: true,
													disabled: true,
													className: "bg-muted/50 cursor-not-allowed opacity-80"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Designation"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: empData.designation,
													readOnly: true,
													disabled: true,
													className: "bg-muted/50 cursor-not-allowed opacity-80"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Joining Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: empData.joining_date,
													readOnly: true,
													disabled: true,
													className: "bg-muted/50 cursor-not-allowed opacity-80"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Phone Number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: phone,
													onChange: (e) => setPhone(e.target.value),
													placeholder: "Enter phone number",
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border sm:col-span-2 my-2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs",
														children: "Password"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "password",
														value: password,
														onChange: (e) => setPassword(e.target.value),
														placeholder: "Create a strong password",
														required: true
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground",
														children: "Min 8 chars · 1 uppercase · 1 lowercase · 1 number · 1 special character"
													}),
													password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex gap-1 mt-1",
														children: [
															password.length >= 8,
															/[A-Z]/.test(password),
															/[a-z]/.test(password),
															/[0-9]/.test(password),
															/[^A-Za-z0-9]/.test(password)
														].map((ok, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 flex-1 rounded-full transition-colors ${ok ? "bg-emerald-500" : "bg-muted"}` }, i))
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs",
														children: "Confirm Password"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "password",
														value: confirmPassword,
														onChange: (e) => setConfirmPassword(e.target.value),
														placeholder: "Verify your password",
														required: true
													}),
													confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `text-[11px] ${password === confirmPassword ? "text-emerald-500" : "text-destructive"}`,
														children: password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border sm:col-span-2 my-2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-sm font-medium sm:col-span-2",
												children: "Additional Information (Optional)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5 sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Profile Photo URL"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: profilePhoto,
													onChange: (e) => setProfilePhoto(e.target.value),
													placeholder: "https://example.com/photo.jpg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Emergency Contact Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: emergencyName,
													onChange: (e) => setEmergencyName(e.target.value),
													placeholder: "Contact Name"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs",
													children: "Emergency Contact Phone"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: emergencyPhone,
													onChange: (e) => setEmergencyPhone(e.target.value),
													placeholder: "Contact Phone"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2.5 mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											id: "terms",
											checked: acceptPolicies,
											onCheckedChange: (checked) => setAcceptPolicies(checked === true)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "terms",
											className: "text-xs text-muted-foreground leading-normal cursor-pointer select-none",
											children: "I accept the company policies, code of conduct, and employee terms of service."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end mt-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: activating,
											className: "w-full sm:w-auto",
											children: [activating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Activate Account & Login"]
										})
									})
								]
							})]
						})
					})
				]
			});
		}
	}
	if (resuming) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen flex items-center justify-center bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 -z-10",
			style: { background: "var(--gradient-hero)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin mx-auto text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Restoring your progress..."
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 -z-10",
				style: { background: "var(--gradient-hero)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-6 py-5 sm:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow",
						style: { background: "var(--gradient-brand)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "OFC360"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						"Step ",
						Math.min(step + 1, 6),
						" of 6"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl px-6 pb-16 sm:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-8 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
						steps: STEPS,
						current: Math.min(step, 5)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -16
						},
						transition: {
							duration: .25,
							ease: "easeOut"
						},
						children: [
							step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyStep, { onNext: next }) : null,
							step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminProfileStep, {
								onNext: next,
								onBack: back
							}) : null,
							step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HRSettingsStep, {
								onNext: next,
								onBack: back
							}) : null,
							step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentsDesignationsStep, {
								onNext: next,
								onBack: back
							}) : null,
							step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteEmployeesStep, {
								onNext: next,
								onBack: back
							}) : null,
							step === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStep, {
								onBack: back,
								onFinish: finish,
								onEdit: goto,
								loading
							}) : null,
							step === 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessStep, {}) : null
						]
					}, step)
				})]
			})
		]
	});
}
function StepCard({ title, description, icon: Icon, children, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border bg-card/70 p-6 shadow-elegant backdrop-blur-xl sm:p-8",
		style: { borderColor: "var(--glass-border)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow",
					style: { background: "var(--gradient-brand)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: title
				}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: description
				}) : null] })]
			}),
			children,
			footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex items-center justify-between border-t border-border pt-6",
				children: footer
			}) : null
		]
	});
}
function CompanyStep({ onNext }) {
	const ws = useAurix();
	const [c, setC] = (0, import_react.useState)(ws.company ?? {
		id: uid("co"),
		name: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const editedFields = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const wsCompany = ws.company;
	(0, import_react.useEffect)(() => {
		if (!wsCompany) return;
		setC((prev) => {
			let changed = false;
			const next = { ...prev };
			for (const field of [
				"name",
				"logoDataUrl",
				"stampDataUrl",
				"industry",
				"size",
				"website",
				"email",
				"phone",
				"address",
				"city",
				"state",
				"country",
				"timezone"
			]) if (!editedFields.current.has(field)) {
				const val = wsCompany[field];
				if (val !== void 0 && val !== null && val !== "" && next[field] !== val) {
					next[field] = val;
					changed = true;
				}
			}
			if (wsCompany.id && next.id !== wsCompany.id) {
				next.id = wsCompany.id;
				changed = true;
			}
			return changed ? next : prev;
		});
	}, [wsCompany]);
	function set(k, v) {
		editedFields.current.add(k);
		setC((p) => ({
			...p,
			[k]: v
		}));
	}
	function onLogo(file) {
		if (!file) return;
		editedFields.current.add("logoDataUrl");
		const reader = new FileReader();
		reader.onload = () => set("logoDataUrl", reader.result);
		reader.readAsDataURL(file);
	}
	function onStamp(file) {
		if (!file) return;
		editedFields.current.add("stampDataUrl");
		const reader = new FileReader();
		reader.onload = () => set("stampDataUrl", reader.result);
		reader.readAsDataURL(file);
	}
	async function submit() {
		const fe = {};
		if (!c.name) fe.name = "Required";
		if (!c.industry) fe.industry = "Required";
		if (!c.size) fe.size = "Required";
		if (!c.email) fe.email = "Required";
		if (!c.country) fe.country = "Required";
		if (Object.keys(fe).length) {
			setErrors(fe);
			return;
		}
		setLoading(true);
		try {
			const companyPayload = {
				company_name: c.name,
				company_logo: c.logoDataUrl || null,
				company_stamp: c.stampDataUrl || null,
				industry: c.industry || "Software",
				company_size: c.size || "11–50",
				country: c.country || "USA",
				state: c.state || null,
				city: c.city || null,
				timezone: c.timezone || "UTC",
				currency: "USD"
			};
			await api.post("onboarding/company", companyPayload);
			aurix.set({ company: c });
			onNext();
		} catch (err) {
			toast.error(err.message || "Failed to save company details. Please try again.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
		title: "Tell us about your company",
		description: "This sets up your workspace identity. You can edit any of it later.",
		icon: Building2,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: submit,
			disabled: loading,
			children: [
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
				"Continue",
				!loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" }) : null
			]
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company logo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-16 w-16 place-items-center overflow-hidden rounded-xl border border-border bg-muted text-muted-foreground",
						children: c.logoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.logoDataUrl,
							alt: "Logo",
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
							"Upload logo",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => onLogo(e.target.files?.[0] ?? null)
							})
						]
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company stamp / seal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-16 w-16 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/60 text-muted-foreground",
						children: c.stampDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.stampDataUrl,
							alt: "Stamp",
							className: "h-full w-full object-contain p-1"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { className: "h-6 w-6 text-muted-foreground/70" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
							"Upload stamp",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => onStamp(e.target.files?.[0] ?? null)
							})
						]
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Company name",
					error: errors.name,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: c.name,
						onChange: (e) => set("name", e.target.value),
						placeholder: "OFC360, Inc."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Industry",
					error: errors.industry,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: c.industry,
						onValueChange: (v) => set("industry", v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select industry" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: INDUSTRIES.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: i,
							children: i
						}, i)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Company size",
					error: errors.size,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: c.size,
						onValueChange: (v) => set("size", v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Number of employees" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Website",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: c.website ?? "",
						onChange: (e) => set("website", e.target.value),
						placeholder: "https://ofc360.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Company email",
					error: errors.email,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: c.email ?? "",
						onChange: (e) => set("email", e.target.value),
						placeholder: "hello@ofc360.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Company phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: c.phone ?? "",
						onChange: (e) => set("phone", e.target.value),
						placeholder: "+1 555 0100"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: c.address ?? "",
							onChange: (e) => set("address", e.target.value),
							placeholder: "Street, building, suite"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "City",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: c.city ?? "",
						onChange: (e) => set("city", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "State / Region",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: c.state ?? "",
						onChange: (e) => set("state", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Country",
					error: errors.country,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountrySelect, {
						value: c.country ?? "",
						onChange: (countryName, countryOpt) => {
							set("country", countryName);
							const targetTz = countryOpt?.primaryTimezone || getDefaultTimezoneForCountry(countryName).id;
							if (targetTz) set("timezone", targetTz);
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Timezone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimezoneSelect, {
						value: c.timezone,
						country: c.country,
						onChange: (v) => set("timezone", v)
					})
				})
			]
		})
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: error
			}) : null
		]
	});
}
function AdminProfileStep({ onNext, onBack }) {
	const ws = useAurix();
	const nameParts = ws.user?.fullName?.split(" ") || [];
	const [firstName, setFirstName] = (0, import_react.useState)(nameParts[0] || "");
	const [lastName, setLastName] = (0, import_react.useState)(nameParts.slice(1).join(" ") || "");
	const [phone, setPhone] = (0, import_react.useState)((ws.user?.phone || "").replace(/\D/g, ""));
	const [designation, setDesignation] = (0, import_react.useState)("Company Owner");
	const [language, setLanguage] = (0, import_react.useState)("English");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function submit() {
		if (!firstName || !lastName || !phone) {
			toast.error("First name, last name, and phone number are required.");
			return;
		}
		setLoading(true);
		try {
			const adminPayload = {
				first_name: firstName,
				last_name: lastName,
				profile_photo: null,
				mobile_number: phone.trim(),
				designation,
				preferred_language: language
			};
			await api.post("onboarding/admin-profile", adminPayload);
			onNext();
		} catch (err) {
			toast.error(err.message || "Failed to save admin profile. Please try again.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
		title: "Create your Admin Profile",
		description: "Tell us about yourself. You will be the primary administrator for this workspace.",
		icon: UserCog,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			onClick: onBack,
			disabled: loading,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-2 h-4 w-4" }), " Back"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: submit,
			disabled: loading,
			children: [
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
				"Continue",
				!loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" }) : null
			]
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "First name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: firstName,
						onChange: (e) => setFirstName(e.target.value),
						placeholder: "First Name"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Last name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: lastName,
						onChange: (e) => setLastName(e.target.value),
						placeholder: "Last Name"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mobile number",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						placeholder: "Enter mobile number"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Designation",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: designation,
						onChange: (e) => setDesignation(e.target.value),
						placeholder: "Company Owner"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Preferred language",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: language,
							onValueChange: setLanguage,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select language" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"English",
								"Spanish",
								"French",
								"German",
								"Hindi",
								"Mandarin"
							].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: l,
								children: l
							}, l)) })]
						})
					})
				})
			]
		})
	});
}
function HRSettingsStep({ onNext, onBack }) {
	const [workingDays, setWorkingDays] = (0, import_react.useState)([
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday"
	]);
	const [weekStart, setWeekStart] = (0, import_react.useState)("Monday");
	const [officeTimingStart, setOfficeTimingStart] = (0, import_react.useState)("09:00");
	const [officeTimingEnd, setOfficeTimingEnd] = (0, import_react.useState)("18:00");
	const [defaultShift, setDefaultShift] = (0, import_react.useState)("General Shift");
	const [timeFormat, setTimeFormat] = (0, import_react.useState)("12h");
	const [dateFormat, setDateFormat] = (0, import_react.useState)("YYYY-MM-DD");
	const [financialYear, setFinancialYear] = (0, import_react.useState)("2026-2027");
	const [leaveTemplate, setLeaveTemplate] = (0, import_react.useState)("Standard Template");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const WEEKDAYS = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	];
	function toggleDay(d) {
		setWorkingDays((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);
	}
	async function submit() {
		setLoading(true);
		try {
			const hrSettings = {
				working_days: workingDays,
				week_start_day: weekStart,
				office_timing: `${officeTimingStart} - ${officeTimingEnd}`,
				default_shift: defaultShift,
				time_format: timeFormat,
				date_format: dateFormat,
				financial_year: financialYear,
				leave_policy_template: leaveTemplate
			};
			await api.post("onboarding/hr-settings", hrSettings);
			onNext();
		} catch (err) {
			toast.error(err.message || "Failed to save HR settings. Please try again.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
		title: "Configure HR Settings",
		description: "Define the default work week, shifts, and policy configurations for your workspace.",
		icon: UserCog,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			onClick: onBack,
			disabled: loading,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-2 h-4 w-4" }), " Back"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: submit,
			disabled: loading,
			children: [
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
				"Continue",
				!loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" }) : null
			]
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-2 block",
						children: "Working Days"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: WEEKDAYS.map((d) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleDay(d),
								className: `rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${workingDays.includes(d) ? "border-transparent bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`,
								children: d
							}, d);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Week Start Day",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: weekStart,
						onValueChange: setWeekStart,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select day" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: d,
							children: d
						}, d)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Default Shift Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: defaultShift,
						onChange: (e) => setDefaultShift(e.target.value),
						placeholder: "General Shift"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Office Start Time",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: officeTimingStart,
							onChange: (e) => setOfficeTimingStart(e.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Office End Time",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: officeTimingEnd,
							onChange: (e) => setOfficeTimingEnd(e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Time Format",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: timeFormat,
						onValueChange: setTimeFormat,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select format" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "12h",
							children: "12-Hour (AM/PM)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "24h",
							children: "24-Hour"
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date Format",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: dateFormat,
						onValueChange: setDateFormat,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select format" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
							"YYYY-MM-DD",
							"DD-MM-YYYY",
							"MM-DD-YYYY"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: f,
							children: f
						}, f)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Financial Year",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: financialYear,
						onChange: (e) => setFinancialYear(e.target.value),
						placeholder: "2026-2027"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Leave Policy Template",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: leaveTemplate,
						onValueChange: setLeaveTemplate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select template" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
							"Standard Template",
							"Startup Policy",
							"Flexible Leave"
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: t,
							children: t
						}, t)) })]
					})
				})
			]
		})
	});
}
function DepartmentsDesignationsStep({ onNext, onBack }) {
	const [depts, setDepts] = (0, import_react.useState)([
		{
			department_code: "MGMT_10",
			department_name: "Management",
			description: "Leadership & Admin"
		},
		{
			department_code: "ENG_11",
			department_name: "Engineering",
			description: "Product Development"
		},
		{
			department_code: "HR_12",
			department_name: "Human Resources",
			description: "People Ops & Recruiting"
		},
		{
			department_code: "SLS_13",
			department_name: "Sales & Marketing",
			description: "Sales & Marketing Team"
		}
	]);
	const [designations, setDesignations] = (0, import_react.useState)([
		"Company Owner",
		"HR Manager",
		"Engineering Manager",
		"Software Engineer",
		"Sales Executive"
	]);
	const [deptName, setDeptName] = (0, import_react.useState)("");
	const [deptCode, setDeptCode] = (0, import_react.useState)("");
	const [deptDesc, setDeptDesc] = (0, import_react.useState)("");
	const [desigName, setDesigName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	function addDept() {
		if (!deptName) {
			toast.error("Department name is required.");
			return;
		}
		const code = deptCode || deptName.substring(0, 3).toUpperCase() + "_" + (10 + depts.length);
		if (depts.some((d) => d.department_code === code)) {
			toast.error("Department code must be unique.");
			return;
		}
		setDepts([...depts, {
			department_code: code,
			department_name: deptName,
			description: deptDesc || `Department for ${deptName}`
		}]);
		setDeptName("");
		setDeptCode("");
		setDeptDesc("");
	}
	function removeDept(code) {
		if (code === "MGMT_10") {
			toast.error("Management department cannot be removed.");
			return;
		}
		setDepts(depts.filter((d) => d.department_code !== code));
	}
	function addDesignation() {
		if (!desigName) {
			toast.error("Designation name is required.");
			return;
		}
		if (designations.includes(desigName)) {
			toast.error("Designation already exists.");
			return;
		}
		setDesignations([...designations, desigName]);
		setDesigName("");
	}
	function removeDesignation(name) {
		if (name === "Company Owner") {
			toast.error("Company Owner designation cannot be removed.");
			return;
		}
		setDesignations(designations.filter((d) => d !== name));
	}
	async function submit() {
		setLoading(true);
		try {
			await api.post("onboarding/departments", { departments: depts });
			await api.post("onboarding/designations", { designations });
			onNext();
		} catch (err) {
			toast.error(err.message || "Failed to save departments and designations.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
		title: "Define Departments & Designations",
		description: "Create structures and job titles for your workspace.",
		icon: Building2,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			onClick: onBack,
			disabled: loading,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-2 h-4 w-4" }), " Back"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: submit,
			disabled: loading,
			children: [
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
				"Continue",
				!loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" }) : null
			]
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-8 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" }), "Departments"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-xl border p-4 bg-muted/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Dept Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: deptName,
										onChange: (e) => setDeptName(e.target.value),
										placeholder: "Engineering"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Code (Optional)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: deptCode,
										onChange: (e) => setDeptCode(e.target.value),
										placeholder: "ENG"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: deptDesc,
									onChange: (e) => setDeptDesc(e.target.value),
									placeholder: "Software and Product development"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: addDept,
								variant: "outline",
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add Department"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-60 overflow-y-auto space-y-2 pr-1",
						children: depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between p-3 rounded-lg border bg-card/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium text-sm",
								children: [
									d.department_name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground font-normal",
										children: [
											"(",
											d.department_code,
											")"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: d.description
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => removeDept(d.department_code),
								className: "rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						}, d.department_code))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary" }), "Designations"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-xl border p-4 bg-muted/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Designation Title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: desigName,
								onChange: (e) => setDesigName(e.target.value),
								placeholder: "Senior Software Engineer"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: addDesignation,
							variant: "outline",
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add Designation"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-60 overflow-y-auto space-y-2 pr-1",
						children: designations.map((des) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between p-3 rounded-lg border bg-card/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-sm",
								children: des
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => removeDesignation(des),
								className: "rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						}, des))
					})
				]
			})]
		})
	});
}
function InviteEmployeesStep({ onNext, onBack }) {
	const ws = useAurix();
	const [activeTab, setActiveTab] = (0, import_react.useState)("employees");
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function save() {
		setSaving(true);
		try {
			await syncDeptsAndDesignations(ws);
			await syncInvites(ws);
			onNext();
		} catch (err) {
			toast.error(err.message || "Failed to save invites. Please try again.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepCard, {
		title: "Invite your Team",
		description: "Add employees, managers, and HR team members to your workspace.",
		icon: UserPlus,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			onClick: onBack,
			disabled: saving,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-2 h-4 w-4" }), " Back"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: save,
				disabled: saving,
				children: "Skip for now"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: save,
				disabled: saving,
				children: [
					saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
					"Continue",
					!saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" }) : null
				]
			})]
		})] }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 inline-flex rounded-lg border border-border bg-muted/40 p-1 w-full sm:w-auto",
			children: [
				"employees",
				"managers",
				"hr"
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab(t),
				className: `flex-1 sm:flex-initial rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${activeTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
				children: t === "employees" ? "Employees" : t === "managers" ? "Managers" : "HR Team"
			}, t))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			mode: "wait",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -10
				},
				transition: { duration: .15 },
				children: [
					activeTab === "employees" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesSection, {}) : null,
					activeTab === "managers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagersSection, {}) : null,
					activeTab === "hr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HRSection, {}) : null
				]
			}, activeTab)
		})]
	});
}
function HRSection() {
	const hrs = useAurix().hrs;
	const [draft, setDraft] = (0, import_react.useState)(blankHr());
	const [editing, setEditing] = (0, import_react.useState)(null);
	function blankHr() {
		return {
			id: uid("hr"),
			fullName: "",
			email: "",
			phone: "",
			department: "",
			designation: ""
		};
	}
	function add() {
		if (!draft.fullName || !draft.email) {
			toast.error("HR name and email required");
			return;
		}
		let updated;
		if (editing) updated = hrs.map((h) => h.id === editing ? draft : h);
		else updated = [...hrs, draft];
		aurix.set({ hrs: updated });
		setDraft(blankHr());
		setEditing(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Full name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.fullName,
						onChange: (e) => setDraft({
							...draft,
							fullName: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Work email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: draft.email,
						onChange: (e) => setDraft({
							...draft,
							email: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.phone,
						onChange: (e) => setDraft({
							...draft,
							phone: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Department",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.department,
						onChange: (e) => setDraft({
							...draft,
							department: e.target.value
						}),
						placeholder: "People Ops"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Designation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.designation,
							onChange: (e) => setDraft({
								...draft,
								designation: e.target.value
							}),
							placeholder: "HR Business Partner"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: add,
						variant: "outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), editing ? "Save changes" : "Add HR"]
					})
				})
			]
		}), hrs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5",
							children: "Department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5",
							children: "Designation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2.5" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: hrs.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5 font-medium",
							children: h.fullName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5 text-muted-foreground",
							children: h.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5",
							children: h.department || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5",
							children: h.designation || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-2.5 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setDraft(h);
									setEditing(h.id);
								},
								className: "mr-1 rounded p-1.5 text-muted-foreground hover:bg-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => aurix.set({ hrs: hrs.filter((x) => x.id !== h.id) }),
								className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})
					]
				}, h.id)) })]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, { text: "No HRs yet. Add at least one to manage employees." })]
	});
}
function EmployeesSection() {
	const employees = useAurix().employees;
	const [tab, setTab] = (0, import_react.useState)("manual");
	const [draft, setDraft] = (0, import_react.useState)(blankEmp());
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)([]);
	function blankEmp() {
		return {
			id: uid("emp"),
			employeeId: "",
			fullName: "",
			email: "",
			phone: "",
			department: "",
			designation: "",
			joiningDate: "",
			managerName: "",
			shift: "General"
		};
	}
	function add() {
		if (!draft.fullName || !draft.email) {
			toast.error("Name and email required");
			return;
		}
		let updated;
		if (editing) updated = employees.map((e) => e.id === editing ? draft : e);
		else updated = [...employees, draft];
		aurix.set({ employees: updated });
		setDraft(blankEmp());
		setEditing(null);
	}
	function onFile(file) {
		import_papaparse.default.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (res) => {
				const errs = [];
				setPreview(res.data.map((r, idx) => {
					const fullName = r["Full Name"] || r["full_name"] || r["name"] || "";
					const email = r["Email"] || r["email"] || "";
					if (!fullName || !email) errs.push(`Row ${idx + 2}: missing name or email`);
					return {
						id: uid("emp"),
						employeeId: r["Employee ID"] || r["employee_id"] || "",
						fullName,
						email,
						phone: r["Phone Number"] || r["phone"] || "",
						department: r["Department"] || "",
						designation: r["Designation"] || "",
						joiningDate: r["Joining Date"] || "",
						managerName: r["Manager Name"] || "",
						shift: r["Shift"] || "General"
					};
				}));
				setErrors(errs);
			}
		});
	}
	function confirmImport() {
		if (!preview) return;
		aurix.set({ employees: [...employees, ...preview] });
		toast.success(`${preview.length} employees imported`, { description: errors.length ? `${errors.length} rows had warnings` : void 0 });
		setPreview(null);
		setErrors([]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex rounded-lg border border-border bg-muted/40 p-1",
				children: ["manual", "import"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: `rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
					children: t === "manual" ? "Manual entry" : "CSV / Excel import"
				}, t))
			}),
			tab === "manual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-5 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Employee ID",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.employeeId,
							onChange: (e) => setDraft({
								...draft,
								employeeId: e.target.value
							}),
							placeholder: "EMP-001"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.fullName,
							onChange: (e) => setDraft({
								...draft,
								fullName: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: draft.email,
							onChange: (e) => setDraft({
								...draft,
								email: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.phone,
							onChange: (e) => setDraft({
								...draft,
								phone: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Department",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.department,
							onChange: (e) => setDraft({
								...draft,
								department: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Designation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.designation,
							onChange: (e) => setDraft({
								...draft,
								designation: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Joining date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: draft.joiningDate,
							onChange: (e) => setDraft({
								...draft,
								joiningDate: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Shift",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: draft.shift,
							onValueChange: (v) => setDraft({
								...draft,
								shift: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"General",
								"Morning",
								"Evening",
								"Night"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: add,
							variant: "outline",
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), editing ? "Save" : "Add employee"]
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:bg-muted/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mb-3 h-6 w-6 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Drop a CSV file here or click to browse"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Columns: Employee ID, Full Name, Email, Phone Number, Department, Designation, Joining Date, Manager Name, Shift"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".csv,.xlsx",
						className: "hidden",
						onChange: (e) => e.target.files?.[0] && onFile(e.target.files[0])
					})
				]
			}), preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-4 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium",
									children: [preview.length, " rows ready"]
								}),
								" ",
								errors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-destructive",
									children: [
										"· ",
										errors.length,
										" warnings"
									]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									setPreview(null);
									setErrors([]);
								},
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: confirmImport,
								children: "Import all"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-64 overflow-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2",
										children: "Dept"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: preview.slice(0, 50).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-1.5",
										children: e.employeeId || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-1.5",
										children: e.fullName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-1.5 text-muted-foreground",
										children: e.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-1.5",
										children: e.department
									})
								]
							}, e.id)) })]
						})
					}),
					errors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border bg-destructive/5 px-4 py-2 text-xs text-destructive",
						children: [errors.slice(0, 5).join(" · "), errors.length > 5 ? ` · +${errors.length - 5} more` : ""]
					}) : null
				]
			}) : null] }),
			employees.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between border-b border-border px-4 py-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-medium",
						children: [employees.length, " employees added"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-72 overflow-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2",
									children: "ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2",
									children: "Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2",
									children: "Dept"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2",
									children: "Shift"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: e.employeeId || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 font-medium",
									children: e.fullName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 text-muted-foreground",
									children: e.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: e.department || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: e.shift
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-2 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setDraft(e);
											setEditing(e.id);
											setTab("manual");
										},
										className: "mr-1 rounded p-1.5 text-muted-foreground hover:bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => aurix.set({ employees: employees.filter((x) => x.id !== e.id) }),
										className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							]
						}, e.id)) })]
					})
				})]
			}) : null
		]
	});
}
function ManagersSection() {
	const ws = useAurix();
	const managers = ws.managers;
	const [draft, setDraft] = (0, import_react.useState)(blank());
	const [editing, setEditing] = (0, import_react.useState)(null);
	function blank() {
		return {
			id: uid("mgr"),
			fullName: "",
			email: "",
			phone: "",
			department: "",
			designation: "",
			team: [],
			shiftStart: "09:00",
			shiftEnd: "18:00",
			workingDays: [
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri"
			]
		};
	}
	function add() {
		if (!draft.fullName || !draft.email) {
			toast.error("Manager name and email required");
			return;
		}
		let updated;
		if (editing) updated = managers.map((m) => m.id === editing ? draft : m);
		else updated = [...managers, draft];
		aurix.set({ managers: updated });
		setDraft(blank());
		setEditing(null);
	}
	function toggleDay(d) {
		setDraft((p) => ({
			...p,
			workingDays: p.workingDays.includes(d) ? p.workingDays.filter((x) => x !== d) : [...p.workingDays, d]
		}));
	}
	function toggleEmp(id) {
		setDraft((p) => ({
			...p,
			team: p.team.includes(id) ? p.team.filter((x) => x !== id) : [...p.team, id]
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Manager name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.fullName,
						onChange: (e) => setDraft({
							...draft,
							fullName: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: draft.email,
						onChange: (e) => setDraft({
							...draft,
							email: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.phone,
						onChange: (e) => setDraft({
							...draft,
							phone: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Department",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.department,
						onChange: (e) => setDraft({
							...draft,
							department: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Designation",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft.designation,
						onChange: (e) => setDraft({
							...draft,
							designation: e.target.value
						}),
						placeholder: "Engineering Manager"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Shift start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: draft.shiftStart,
							onChange: (e) => setDraft({
								...draft,
								shiftStart: e.target.value
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Shift end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: draft.shiftEnd,
							onChange: (e) => setDraft({
								...draft,
								shiftEnd: e.target.value
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-2 block",
						children: "Working days"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: DAYS.map((d) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleDay(d),
								className: `rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${draft.workingDays.includes(d) ? "border-transparent bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`,
								children: d
							}, d);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-2 block",
						children: "Assign team members"
					}), ws.employees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, { text: "No employees yet. You can assign managers later from the dashboard." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-44 overflow-auto rounded-xl border border-border p-2",
						children: ws.employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: draft.team.includes(e.id),
									onCheckedChange: () => toggleEmp(e.id)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: e.fullName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: e.department || "—"
								})
							]
						}, e.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: add,
						variant: "outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), editing ? "Save changes" : "Add manager"]
					})
				})
			]
		}), managers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
			children: managers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card/40 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: m.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: m.designation || m.department
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setDraft(m);
								setEditing(m.id);
							},
							className: "rounded p-1.5 text-muted-foreground hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => aurix.set({ managers: managers.filter((x) => x.id !== m.id) }),
							className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [m.team.length, " reports"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [
								m.shiftStart,
								"–",
								m.shiftEnd
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [m.workingDays.length, " days/wk"]
						})
					]
				})]
			}, m.id))
		}) : null]
	});
}
function ReviewStep({ onBack, onFinish, onEdit, loading }) {
	const ws = useAurix();
	const c = ws.company;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
		title: "Review your workspace",
		description: "Verify everything looks right before launching.",
		icon: CircleCheck,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			onClick: onBack,
			disabled: loading,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-2 h-4 w-4" }), "Back"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: onFinish,
			disabled: loading,
			children: [
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
				"Confirm & launch",
				!loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" }) : null
			]
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReviewCard, {
					title: "Company",
					onEdit: () => onEdit(0),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Name",
							value: c?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Industry",
							value: c?.industry
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Size",
							value: c?.size
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Email",
							value: c?.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Location",
							value: [c?.city, c?.country].filter(Boolean).join(", ")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReviewCard, {
					title: "Admin Profile",
					onEdit: () => onEdit(1),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Name",
							value: ws.user?.fullName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Phone",
							value: ws.user?.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Role",
							value: ws.user?.role
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReviewCard, {
					title: "HR Settings",
					onEdit: () => onEdit(2),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Week Start",
							value: "Monday"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Shift",
							value: "General Shift"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Time Format",
							value: "12h"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewCard, {
					title: "Departments & Designations",
					onEdit: () => onEdit(3),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
						label: "Setup Done",
						value: "Yes"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReviewCard, {
					title: "Invite Team",
					onEdit: () => onEdit(4),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Employees",
							value: String(ws.employees.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "Managers",
							value: String(ws.managers.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, {
							label: "HR Members",
							value: String(ws.hrs.length)
						})
					]
				})
			]
		})
	});
}
function ReviewCard({ title, children, onEdit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card/40 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onEdit,
				className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" }), "Edit"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "space-y-1.5 text-sm",
			children
		})]
	});
}
function ReviewLine({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "truncate text-right font-medium",
			children: value || "—"
		})]
	});
}
function EmptyHint({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-center text-xs text-muted-foreground",
		children: text
	});
}
function SuccessStep() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl rounded-2xl border bg-card/70 p-10 text-center shadow-elegant backdrop-blur-xl",
		style: { borderColor: "var(--glass-border)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					scale: .7,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				transition: {
					type: "spring",
					stiffness: 200,
					damping: 14
				},
				className: "mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "Your OFC360 workspace is ready"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Everything is set up. Jump into the dashboard or invite the rest of your team."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => navigate({ to: "/dashboard" }),
					children: "Go to dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => navigate({ to: "/dashboard/hr" }),
					children: "Invite team members"
				})]
			})
		]
	});
}
//#endregion
export { OnboardingPage, OnboardingPage as default };
