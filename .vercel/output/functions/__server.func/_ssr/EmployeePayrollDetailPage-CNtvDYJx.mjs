import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, D as TrendingDown, E as TrendingUp, J as ShieldAlert, Ln as FileText, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, di as ArrowLeft, h as User, it as Scale, lt as RefreshCw, mn as History, pr as Clock, q as ShieldCheck, qr as Building2, ri as Banknote, st as RotateCcw, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole, n as canManagePayroll } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { c as Skeleton, l as StatCard, n as EmptyState, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeePayrollDetailPage-CNtvDYJx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatINR(value) {
	if (value === null || value === void 0 || isNaN(value)) return "—";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(value);
}
function formatDate(val) {
	if (!val) return "—";
	try {
		const d = new Date(val);
		if (isNaN(d.getTime())) return String(val);
		return d.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	} catch {
		return String(val);
	}
}
function getStatusBadge(status) {
	if (!status) return {
		label: "Processed",
		className: "border-border bg-muted/40 text-foreground"
	};
	const s = status.toLowerCase().trim();
	if (s === "completed" || s === "finalized" || s === "approved" || s === "valid") return {
		label: status,
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	};
	if (s === "failed" || s.includes("fail") || s.includes("error") || s === "invalid") return {
		label: status,
		className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
	};
	if (s.includes("warn") || s.includes("provision")) return {
		label: status,
		className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
	};
	return {
		label: status,
		className: "border-border bg-muted/40 text-foreground"
	};
}
function EmployeePayrollDetailPage() {
	const params = useParams({ strict: false });
	const runId = params?.runId?.trim() || "";
	const employeeId = params?.employeeId?.trim() || "";
	const navigate = useNavigate();
	const ws = useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isPayrollAdmin = canManagePayroll(useCurrentRole());
	const canViewPayroll = isPayrollAdmin || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canRunPayroll = isPayrollAdmin || userPermissions.includes("payroll.process") || userPermissions.includes("*");
	const [employee, setEmployee] = (0, import_react.useState)(null);
	const [runMeta, setRunMeta] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [isNotFound, setIsNotFound] = (0, import_react.useState)(false);
	const [recalculateModalOpen, setRecalculateModalOpen] = (0, import_react.useState)(false);
	const [isRecalculating, setIsRecalculating] = (0, import_react.useState)(false);
	const fetchEmployeePayrollDetail = (0, import_react.useCallback)(async () => {
		if (!runId || !employeeId) return;
		setIsLoading(true);
		setApiError(null);
		setIsNotFound(false);
		try {
			const empData = await payrollApi.getRunEmployeeDetail(runId, employeeId);
			if (!empData) {
				setIsNotFound(true);
				setEmployee(null);
			} else setEmployee(empData);
			try {
				setRunMeta(await payrollApi.getPayrollPreview(runId));
			} catch {}
		} catch (err) {
			const status = err?.response?.status;
			if (status === 404) {
				setIsNotFound(true);
				setApiError("Employee payroll calculation record was not found on the backend for this run (404 Not Found).");
			} else if (status === 401 || status === 403) setApiError("You are not authorized to view this employee's payroll details.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to load employee payroll detail from the server.");
			setEmployee(null);
		} finally {
			setIsLoading(false);
		}
	}, [runId, employeeId]);
	(0, import_react.useEffect)(() => {
		fetchEmployeePayrollDetail();
	}, [fetchEmployeePayrollDetail]);
	const handleConfirmRecalculate = async () => {
		if (!runId) return;
		setIsRecalculating(true);
		try {
			const res = await payrollApi.recalculatePayroll(runId);
			toast.success(res?.message || "Payroll recalculation initiated successfully.");
			setRecalculateModalOpen(false);
			navigate({ to: `/dashboard/payroll/runs/${runId}/processing` });
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to trigger payroll recalculation on the backend.";
			toast.error(msg);
		} finally {
			setIsRecalculating(false);
		}
	};
	if (ws.isRestoring) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 py-6 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64 rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full rounded-2xl" })
		]
	});
	if (!canViewPayroll) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Access Restricted",
			description: "You do not have permission to view employee payroll details. Please contact your system administrator for access.",
			icon: CircleAlert
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => navigate({ to: "/dashboard/payroll" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 h-3.5 w-3.5" }), "Back to Payroll Dashboard"]
			})
		})]
	});
	if (!runId || !employeeId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Missing Run or Employee Identifier",
			description: "Both the payroll run ID and employee ID must be specified in the route parameters.",
			icon: CircleAlert
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex justify-center gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => navigate({ to: "/dashboard/payroll" }),
				children: "Back to Dashboard"
			})
		})]
	});
	const periodName = employee?.periodName || runMeta?.periodName || "Current Period";
	const runStatus = employee?.runStatus || runMeta?.status || "Provisional";
	const statusBadgeInfo = getStatusBadge(employee?.status || runStatus);
	const employeeErrors = (employee?.issues || []).filter((iss) => iss.severity?.toLowerCase() === "error" || iss.severity?.toLowerCase() === "critical");
	const employeeWarnings = (employee?.issues || []).filter((iss) => iss.severity?.toLowerCase() !== "error" && iss.severity?.toLowerCase() !== "critical");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl space-y-6 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` }),
							className: "h-9 gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Payroll Preview" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block h-4 w-[1px] bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Run:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border",
								children: runId
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` }),
							className: "h-9 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5",
							title: "View all validation issues for this payroll run",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validation Issues" })]
						}),
						canRunPayroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setRecalculateModalOpen(true),
							className: "h-9 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recalculate Run" })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "default",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${employeeId}/payslip` }),
							className: "h-9 gap-1.5 text-xs",
							style: { background: "var(--gradient-brand)" },
							title: "View official final payslip for this employee",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Final Payslip (Step 9)" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "text-xs font-semibold tracking-wide uppercase",
						children: "PROVISIONAL PAYROLL — Pending Final Review & Authorization"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "text-xs text-amber-800/90 dark:text-amber-300/90 mt-1",
						children: [
							"The values displayed on this screen are provisional calculations generated by the payroll engine for review and auditing purposes. These values are not final until formal payroll approval and finalization. Salary has ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT" }),
							" been paid."
						]
					})
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-64 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-48 rounded" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-28 rounded-full" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 rounded-2xl" })]
					})
				]
			}) : isNotFound || !employee ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "p-12 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-md space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold text-foreground",
							children: "Employee Payroll Detail Unavailable"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground leading-relaxed",
							children: apiError || `No calculated payroll record was found for employee "${employeeId}" in run "${runId}". The backend may not have calculated payroll for this employee yet or the endpoint is unavailable.`
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: fetchEmployeePayrollDetail,
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retry Connection" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "default",
								size: "sm",
								onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` }),
								className: "text-xs",
								children: "Return to Payroll Preview"
							})]
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "font-display text-xl font-bold tracking-tight text-foreground",
											children: employee.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-xs font-semibold uppercase tracking-wider ${statusBadgeInfo.className}`,
											children: statusBadgeInfo.label
										}),
										employee.validationStatus && employee.validationStatus !== "valid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-amber-500/30 bg-amber-500/10 text-amber-600 text-xs font-medium",
											children: employee.validationStatus
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"Employee ID:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-medium text-foreground",
												children: employee.employeeId
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"Payroll Period:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: periodName
											})
										] }),
										employee.department ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"Department:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: employee.department
											})
										] })] }) : null,
										employee.designation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"Designation:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: employee.designation
											})
										] })] }) : null
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col items-start md:items-end gap-1 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/40 px-3 py-1.5 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Period:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: periodName
										}),
										employee.financialYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground border-l border-border pl-2",
											children: ["FY ", employee.financialYear]
										}) : null
									]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Gross Earnings",
								value: formatINR(employee.grossEarnings),
								hint: "Total earnings calculated by backend",
								icon: TrendingUp,
								accent: "brand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Total Deductions",
								value: formatINR(employee.totalDeductions),
								hint: "Statutory & policy deductions",
								icon: TrendingDown,
								accent: "warning"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Net Pay",
								value: formatINR(employee.netPay),
								hint: "Backend calculated net payable",
								icon: Banknote,
								accent: "success"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-semibold text-foreground",
									children: "Employee Information"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground mt-0.5",
											children: employee.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Employee Code / ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-medium text-foreground mt-0.5",
											children: employee.employeeId
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Department"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground mt-0.5",
											children: employee.department || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Designation"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground mt-0.5",
											children: employee.designation || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Employment Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground mt-0.5",
											children: employee.employmentStatus || "Active"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Joining Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground mt-0.5",
											children: formatDate(employee.joiningDate)
										})]
									}),
									employee.location ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-2.5 col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Work Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground mt-0.5",
											children: employee.location
										})]
									}) : null,
									employee.bankInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/60 p-2.5 col-span-2 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] font-semibold text-muted-foreground uppercase",
												children: "Payment Account Details (Confidential)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Bank:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: employee.bankInfo.bankName || "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Account:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-foreground",
													children: employee.bankInfo.accountNumber || "•••• ••••"
												})]
											}),
											employee.bankInfo.ifscCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "IFSC:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-foreground",
													children: employee.bankInfo.ifscCode
												})]
											}) : null
										]
									}) : null
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-semibold text-foreground",
									children: "Attendance & Payable Days"
								})]
							}), employee.attendance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Working Days"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-display text-lg font-semibold text-foreground",
											children: employee.attendance.workingDays ?? "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-emerald-700 dark:text-emerald-300",
											children: "Paid Days"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-display text-lg font-semibold text-emerald-600 dark:text-emerald-400",
											children: employee.attendance.paidDays ?? "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-rose-500/10 border border-rose-500/20 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-rose-700 dark:text-rose-300",
											children: "Unpaid / LOP"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-display text-lg font-semibold text-rose-600 dark:text-rose-400",
											children: employee.attendance.unpaidDays ?? employee.attendance.lopDays ?? "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Leave Days"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-display text-lg font-semibold text-foreground",
											children: employee.attendance.leaveDays ?? "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Overtime Hours"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-display text-lg font-semibold text-foreground",
											children: employee.attendance.overtimeHours ?? "—"
										})]
									}),
									employee.attendance.lopDays != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "Loss of Pay Days"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-display text-lg font-semibold text-rose-600 dark:text-rose-400",
											children: employee.attendance.lopDays
										})]
									}) : null
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-xs text-muted-foreground",
								children: "Attendance metrics were not returned by the backend for this payroll run."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-sm font-semibold text-foreground",
										children: "Earnings Breakdown"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-right font-mono text-sm font-bold text-foreground",
									children: formatINR(employee.grossEarnings)
								})]
							}), employee.earnings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs",
								children: [
									employee.earnings.basic != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Basic Salary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.basic)
										})]
									}) : null,
									employee.earnings.hra != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "House Rent Allowance (HRA)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.hra)
										})]
									}) : null,
									employee.earnings.specialAllowance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Special Allowance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.specialAllowance)
										})]
									}) : null,
									employee.earnings.conveyance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Conveyance Allowance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.conveyance)
										})]
									}) : null,
									employee.earnings.overtime != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Overtime Amount"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.overtime)
										})]
									}) : null,
									employee.earnings.bonus != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Bonus"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.bonus)
										})]
									}) : null,
									employee.earnings.incentives != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Incentives"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.incentives)
										})]
									}) : null,
									employee.earnings.allowances != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Other Allowances"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.allowances)
										})]
									}) : null,
									employee.earnings.other != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Miscellaneous Earnings"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.earnings.other)
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 pt-3 border-t border-border flex items-center justify-between font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: "Gross Earnings"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-sm text-foreground",
											children: formatINR(employee.grossEarnings)
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-6 text-center text-xs text-muted-foreground",
								children: [
									"Component-level earnings were not reported by the backend. Aggregated Gross:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: formatINR(employee.grossEarnings)
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-sm font-semibold text-foreground",
										children: "Deductions Breakdown"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right font-mono text-sm font-bold text-rose-600 dark:text-rose-400",
									children: ["-", formatINR(employee.totalDeductions)]
								})]
							}), employee.deductions ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs",
								children: [
									employee.deductions.pf != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employee EPF (Provident Fund)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.deductions.pf)
										})]
									}) : null,
									employee.deductions.esi != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employee ESI (State Insurance)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.deductions.esi)
										})]
									}) : null,
									employee.deductions.pt != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Professional Tax (PT)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.deductions.pt)
										})]
									}) : null,
									employee.deductions.tds != null || employee.deductions.incomeTax != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "TDS / Income Tax (Sec 192)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.deductions.tds ?? employee.deductions.incomeTax)
										})]
									}) : null,
									employee.deductions.loan != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Loan Deduction"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.deductions.loan)
										})]
									}) : null,
									employee.deductions.advance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Salary Advance Recovery"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.deductions.advance)
										})]
									}) : null,
									employee.deductions.other != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Other Deductions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: formatINR(employee.deductions.other)
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 pt-3 border-t border-border flex items-center justify-between font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: "Total Deductions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-sm text-rose-600 dark:text-rose-400",
											children: ["-", formatINR(employee.totalDeductions)]
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-6 text-center text-xs text-muted-foreground",
								children: [
									"Component-level deductions were not reported by the backend. Total Deductions:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: ["-", formatINR(employee.totalDeductions)]
									})
								]
							})]
						})]
					}),
					employee.statutory || employee.employerContribution != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-semibold text-foreground",
									children: "Statutory Contributions & Employer Cost"
								})]
							}), employee.employerContribution != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Employer Contribution:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono text-foreground",
										children: formatINR(employee.employerContribution)
									})
								]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/20 p-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: "Employee Statutory Deductions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employee EPF"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: formatINR(employee.statutory?.employee?.epf ?? employee.deductions?.pf)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employee ESI"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: formatINR(employee.statutory?.employee?.esi ?? employee.deductions?.esi)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Professional Tax"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: formatINR(employee.statutory?.employee?.pt ?? employee.deductions?.pt)
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/20 p-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: "Employer Statutory Contributions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employer EPF"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: formatINR(employee.statutory?.employer?.epf)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employer ESI"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: formatINR(employee.statutory?.employer?.esi)
											})]
										}),
										employee.statutory?.employer?.eps != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "EPS (Pension)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: formatINR(employee.statutory?.employer?.eps)
											})]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Total Employer Cost"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-semibold text-foreground",
												children: formatINR(employee.employerContribution)
											})]
										})
									]
								})]
							})]
						})]
					}) : null,
					employee.salaryStructure ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-sm font-semibold text-foreground",
								children: "Applicable Salary Structure"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/30 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Structure Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-foreground mt-0.5",
										children: employee.salaryStructure.name || "Default Structure"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/30 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Effective Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-foreground mt-0.5",
										children: formatDate(employee.salaryStructure.effectiveDate)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/30 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Structure Basic"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono font-medium text-foreground mt-0.5",
										children: formatINR(employee.salaryStructure.basic)
									})]
								})
							]
						})]
					}) : null,
					employee.ytd || employee.previousComparison ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-2",
						children: [employee.ytd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-semibold text-foreground",
									children: "Year-To-Date (YTD) Summary"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "YTD Gross Earnings:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: formatINR(employee.ytd.gross)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "YTD Total Deductions:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-rose-600 dark:text-rose-400",
											children: formatINR(employee.ytd.deductions)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "YTD Income Tax (TDS):"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: formatINR(employee.ytd.tax)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-semibold",
											children: "YTD Net Pay:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-emerald-600 dark:text-emerald-400",
											children: formatINR(employee.ytd.netPay)
										})]
									})
								]
							})]
						}) : null, employee.previousComparison ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-semibold text-foreground",
									children: "Previous Run Comparison"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Previous Gross:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: formatINR(employee.previousComparison.previousGross)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Current Gross:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: formatINR(employee.previousComparison.currentGross ?? employee.grossEarnings)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Previous Net Pay:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: formatINR(employee.previousComparison.previousNetPay)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-semibold",
											children: "Current Net Pay:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-emerald-600 dark:text-emerald-400",
											children: formatINR(employee.previousComparison.currentNetPay ?? employee.netPay)
										})]
									})
								]
							})]
						}) : null]
					}) : null,
					employee.issues && employee.issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-semibold text-foreground",
									children: "Validation Findings for this Employee"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									employeeErrors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "destructive",
										className: "text-[10px]",
										children: [employeeErrors.length, " Errors"]
									}) : null,
									employeeWarnings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "text-[10px]",
										children: [employeeWarnings.length, " Warnings"]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` }),
										className: "h-7 text-xs text-primary border-primary/30 hover:bg-primary/5 gap-1 ml-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All Run Issues (Step 6)" })]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [employeeErrors.map((err, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-900 dark:text-rose-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 shrink-0 text-rose-500 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: "Blocking Issue:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: err.message })] })]
							}, err.id || idx)), employeeWarnings.map((warn, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-amber-500 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: "Advisory Warning:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: warn.message })] })]
							}, warn.id || idx))]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "p-4 border-emerald-500/30 bg-emerald-500/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No validation findings reported for this employee record." })]
						})
					}),
					employee.audit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "p-4 text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"Calculation Timestamp:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: formatDate(employee.audit.calculatedAt)
									})
								] }),
								employee.audit.version ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"Engine Version:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground font-mono",
										children: employee.audit.version
									})
								] }) : null,
								employee.audit.lastRecalculatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"Last Recalculated:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: formatDate(employee.audit.lastRecalculatedAt)
									})
								] }) : null
							]
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: recalculateModalOpen,
				onOpenChange: setRecalculateModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-primary" }), "Recalculate Payroll Run"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Trigger a fresh calculation cycle for this payroll run on the backend engine."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Recalculating will re-evaluate attendance, salary components, statutory deductions (PF, ESI, TDS), and allowances for all employees in run",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: runId
								}),
								"."
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setRecalculateModalOpen(false),
								disabled: isRecalculating,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								size: "sm",
								onClick: handleConfirmRecalculate,
								disabled: isRecalculating,
								className: "text-xs gap-1.5",
								children: [isRecalculating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confirm Recalculate" })]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { EmployeePayrollDetailPage, EmployeePayrollDetailPage as default };
