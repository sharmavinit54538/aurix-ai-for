import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, J as ShieldAlert, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Xn as ExternalLink, Xt as ListOrdered, an as Layers, di as ArrowLeft, lt as RefreshCw, p as Users, pr as Clock, st as RotateCcw, un as Info, vr as CircleX, yr as CircleStop } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { c as Skeleton, l as StatCard, n as EmptyState, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollProcessingPage-DUi7sIdU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CONCEPTUAL_PIPELINE_STEPS = [
	{
		id: "employee_data",
		name: "Employee Data",
		description: "Active headcount, joining & exit validations"
	},
	{
		id: "salary_structure",
		name: "Salary Structure",
		description: "Base CTC, HRA, allowances breakdown"
	},
	{
		id: "attendance",
		name: "Attendance",
		description: "Payable days, LOP & biometric reconciliation"
	},
	{
		id: "leave",
		name: "Leave",
		description: "Paid leaves, unpaid leaves & sandwich rules"
	},
	{
		id: "overtime",
		name: "Overtime",
		description: "Approved OT hours & statutory multipliers"
	},
	{
		id: "bonus_incentives",
		name: "Bonus / Incentives",
		description: "Performance awards & periodic incentives"
	},
	{
		id: "loans_advances",
		name: "Loans / Advances",
		description: "EMI installments & salary advances recovery"
	},
	{
		id: "deductions",
		name: "Deductions",
		description: "Voluntary & internal policy deductions"
	},
	{
		id: "tax_statutory",
		name: "Tax / Statutory",
		description: "PF, ESI, PT, and TDS (Section 192)"
	},
	{
		id: "payroll_calculation",
		name: "Payroll Calculation",
		description: "Gross earnings and net payable synthesis"
	},
	{
		id: "validation",
		name: "Validation",
		description: "Cross-checks, negative pay & threshold audits"
	},
	{
		id: "provision_payslips",
		name: "Provision Payslips",
		description: "Provisional statement generation for audit"
	}
];
var TERMINAL_STATUSES = /* @__PURE__ */ new Set([
	"completed",
	"provision generated",
	"failed",
	"cancelled",
	"canceled",
	"void",
	"closed",
	"locked",
	"finalized",
	"approved"
]);
function isTerminalStatus(status) {
	if (!status) return false;
	return TERMINAL_STATUSES.has(status.toLowerCase().trim());
}
function getStatusTone(status) {
	if (!status) return {
		tone: "muted",
		label: "Unknown",
		badgeClass: "border-border bg-muted/30 text-muted-foreground"
	};
	const s = status.toLowerCase().trim();
	if (s === "completed" || s === "finalized" || s === "approved") return {
		tone: "success",
		label: status,
		badgeClass: statusBadgeClass("approved")
	};
	if (s === "failed" || s.includes("fail") || s.includes("error")) return {
		tone: "danger",
		label: status,
		badgeClass: statusBadgeClass("critical")
	};
	if (s === "cancelled" || s === "canceled" || s === "void") return {
		tone: "muted",
		label: status,
		badgeClass: statusBadgeClass("default")
	};
	if (s.includes("provision") || s.includes("validat")) return {
		tone: "warning",
		label: status,
		badgeClass: statusBadgeClass("warning")
	};
	if (s === "queued" || s.includes("queue") || s === "draft") return {
		tone: "info",
		label: status,
		badgeClass: statusBadgeClass("info")
	};
	if (s === "processing" || s.includes("process") || s.includes("running")) return {
		tone: "warning",
		label: status,
		badgeClass: statusBadgeClass("warning")
	};
	return {
		tone: "muted",
		label: status,
		badgeClass: "border-border bg-muted/40 text-foreground"
	};
}
function getStepStatusTone(status) {
	const s = status.toLowerCase();
	if (s === "completed" || s === "success" || s === "done") return {
		icon: CircleCheck,
		color: "text-primary",
		badge: statusBadgeClass("completed")
	};
	if (s === "in_progress" || s === "running" || s === "processing") return {
		icon: RefreshCw,
		color: "text-primary animate-spin",
		badge: statusBadgeClass("info")
	};
	if (s === "failed" || s === "error") return {
		icon: CircleX,
		color: "text-destructive",
		badge: statusBadgeClass("critical")
	};
	return {
		icon: Clock,
		color: "text-muted-foreground/60",
		badge: "border-border bg-muted/30 text-muted-foreground"
	};
}
function PayrollProcessingPage() {
	const runId = useParams({ strict: false })?.runId?.trim() || "";
	const navigate = useNavigate();
	const ws = useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isHr = useCurrentRole() === "hr_admin";
	const canViewPayroll = isHr || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canRunPayroll = isHr || userPermissions.includes("payroll.process") || userPermissions.includes("*");
	const [runData, setRunData] = (0, import_react.useState)(null);
	const [loadingInitial, setLoadingInitial] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [isUnavailable, setIsUnavailable] = (0, import_react.useState)(false);
	const [cancelModalOpen, setCancelModalOpen] = (0, import_react.useState)(false);
	const [isCancelling, setIsCancelling] = (0, import_react.useState)(false);
	const [retryModalOpen, setRetryModalOpen] = (0, import_react.useState)(false);
	const [isRetrying, setIsRetrying] = (0, import_react.useState)(false);
	const inFlightRef = (0, import_react.useRef)(false);
	const pollingTimerRef = (0, import_react.useRef)(null);
	const fetchStatus = (0, import_react.useCallback)(async (isBackgroundPoll = false) => {
		if (!runId) return;
		if (inFlightRef.current) return;
		inFlightRef.current = true;
		if (!isBackgroundPoll) {
			setIsRefreshing(true);
			setApiError(null);
		}
		try {
			setRunData(await payrollApi.getPayrollRunStatus(runId));
			setIsUnavailable(false);
			setApiError(null);
		} catch (err) {
			const status = err?.response?.status;
			if (status === 404) {
				setIsUnavailable(true);
				setApiError("Payroll processing service is currently unavailable or the specified run ID was not found on the backend (404 Not Found).");
			} else if (status === 401 || status === 403) setApiError("You are not authorized to view this payroll processing run.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to retrieve live payroll processing status from the server.");
		} finally {
			inFlightRef.current = false;
			setLoadingInitial(false);
			setIsRefreshing(false);
		}
	}, [runId]);
	(0, import_react.useEffect)(() => {
		if (!runId) {
			setLoadingInitial(false);
			return;
		}
		fetchStatus(false);
		pollingTimerRef.current = window.setInterval(() => {
			setRunData((current) => {
				if (current && isTerminalStatus(current.status)) {
					if (pollingTimerRef.current) {
						window.clearInterval(pollingTimerRef.current);
						pollingTimerRef.current = null;
					}
					return current;
				}
				fetchStatus(true);
				return current;
			});
		}, 4e3);
		return () => {
			if (pollingTimerRef.current) {
				window.clearInterval(pollingTimerRef.current);
				pollingTimerRef.current = null;
			}
		};
	}, [runId, fetchStatus]);
	(0, import_react.useEffect)(() => {
		if (runData && isTerminalStatus(runData.status)) {
			if (pollingTimerRef.current) {
				window.clearInterval(pollingTimerRef.current);
				pollingTimerRef.current = null;
			}
		}
	}, [runData]);
	const handleConfirmCancel = async () => {
		if (!runId) return;
		setIsCancelling(true);
		try {
			const res = await payrollApi.cancelPayrollRun(runId);
			toast.success(res?.message || "Payroll run cancellation request sent.");
			setCancelModalOpen(false);
			await fetchStatus(false);
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to cancel payroll run on the server.";
			toast.error(msg);
		} finally {
			setIsCancelling(false);
		}
	};
	const handleConfirmRetry = async () => {
		if (!runId) return;
		setIsRetrying(true);
		try {
			const res = await payrollApi.retryPayrollRun(runId);
			toast.success(res?.message || "Payroll calculation retry initiated successfully.");
			setRetryModalOpen(false);
			await fetchStatus(false);
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to retry payroll calculation on the server.";
			toast.error(msg);
		} finally {
			setIsRetrying(false);
		}
	};
	if (ws.isRestoring) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64 rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-2xl" })
		]
	});
	if (!canViewPayroll) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Access Restricted",
			description: "You do not have permission to view Payroll Processing runs. Please contact your system administrator for access.",
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
	if (!runId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Invalid Payroll Run Identifier",
			description: "No payroll run ID was provided in the route parameters. Please start a payroll run from the dashboard or select an existing run.",
			icon: CircleAlert
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex justify-center gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => navigate({ to: "/dashboard/payroll" }),
				style: { background: "var(--gradient-brand)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 h-3.5 w-3.5" }), "Go to Payroll Dashboard"]
			})
		})]
	});
	const statusTone = getStatusTone(runData?.status);
	const isCancellable = Boolean(runData && !isTerminalStatus(runData.status) && canRunPayroll && (runData.status.toLowerCase().includes("queued") || runData.status.toLowerCase().includes("process") || runData.status.toLowerCase().includes("draft")));
	const isRetryable = Boolean(runData && runData.status?.toLowerCase().includes("fail") && canRunPayroll);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll",
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Payroll Dashboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/periods",
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Payroll Periods"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm",
							children: "Processing Run"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/preview`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Payroll Preview"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/payroll",
					className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Payroll Dashboard" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-foreground",
							children: "Payroll Processing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px] font-medium border-border/80 bg-muted/30",
							title: `Payroll Run Identifier: ${runId}`,
							children: ["Run: ", runId]
						}),
						!loadingInitial && runData?.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `text-xs font-semibold capitalize ${statusTone.badgeClass}`,
							children: statusTone.label
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Live provisional payroll calculation pipeline and backend execution monitoring."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [isCancellable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setCancelModalOpen(true),
						className: "h-9 gap-1.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 shadow-sm",
						title: "Cancel this payroll calculation run on the backend",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleStop, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cancel Run" })]
					}) : null, isRetryable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setRetryModalOpen(true),
						className: "h-9 gap-1.5 text-xs shadow-sm",
						style: { background: "var(--gradient-brand)" },
						title: "Retry calculation run on the backend",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retry Calculation" })]
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-border bg-muted text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-primary mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "text-xs font-bold uppercase tracking-wider text-foreground",
						children: "Provisional Payroll Run"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: [
							"Payroll processing produces ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "provisional calculations" }),
							" for auditing, statutory compliance, and executive preview.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payroll processing does NOT finalize payroll or initiate employee payment transfers." })
						]
					})]
				})]
			}),
			loadingInitial ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-28" })]
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-48" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-4 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-32 w-full" })
					]
				})]
			}) : null,
			!loadingInitial && (isUnavailable || apiError) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "border-border/80 p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold text-foreground",
						children: isUnavailable ? "Payroll Processing Service Unavailable" : "Unable to Retrieve Processing Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground",
						children: apiError || "The payroll processing endpoint is currently unavailable or still pending deployment on the backend server. Live execution status will reflect here once the backend service responds."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => fetchStatus(false),
							disabled: isRefreshing,
							className: "gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retry Connection" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => navigate({ to: "/dashboard/payroll" }),
							className: "gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Payroll Dashboard" })]
						})]
					})
				]
			}) : null,
			!loadingInitial && runData && !isUnavailable && !apiError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Payroll Period",
								value: runData.periodName || "—",
								icon: Calendar,
								accent: "brand",
								hint: runData.periodId ? `Period ID: ${runData.periodId}` : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Status",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: runData.status || "Unknown"
									})
								}),
								icon: Clock,
								accent: statusTone.tone === "danger" ? "danger" : statusTone.tone === "success" ? "success" : statusTone.tone === "warning" ? "warning" : "muted",
								hint: isTerminalStatus(runData.status) ? "Terminal State" : "Actively monitoring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Employees Processed",
								value: runData.employees?.total != null ? `${runData.employees.processed ?? 0} / ${runData.employees.total}` : "—",
								icon: Users,
								accent: "muted",
								hint: runData.employees?.total != null ? `${runData.employees.failed ?? 0} failed / excluded` : "Backend processing count"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Calculation Progress",
								value: typeof runData.progress === "number" ? `${Math.round(runData.progress)}%` : isTerminalStatus(runData.status) ? "Completed" : "In Progress",
								icon: Layers,
								accent: statusTone.tone === "success" ? "success" : statusTone.tone === "danger" ? "danger" : "warning",
								hint: typeof runData.progress === "number" ? "Reported by backend" : "Indeterminate progress"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Current Operational Status"
										}), !isTerminalStatus(runData.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 text-[11px] font-medium text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-ping rounded-full bg-primary" }), "Live polling active"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-medium text-muted-foreground",
											children: "Polling finished"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 font-display text-xl font-bold tracking-tight text-foreground",
										children: [
											runData.status.toLowerCase() === "queued" && "Payroll run queued",
											runData.status.toLowerCase().includes("process") && "Payroll processing in progress",
											runData.status.toLowerCase().includes("validat") && "Validating payroll",
											(runData.status.toLowerCase().includes("provision") || runData.status.toLowerCase() === "provision generated") && "Provision payroll generated",
											runData.status.toLowerCase() === "completed" && "Payroll processing completed",
											(runData.status.toLowerCase().includes("fail") || runData.status.toLowerCase() === "failed") && "Payroll processing failed",
											(runData.status.toLowerCase().includes("cancel") || runData.status.toLowerCase() === "cancelled") && "Payroll run cancelled",
											![
												"queued",
												"process",
												"validat",
												"provision",
												"completed",
												"fail",
												"cancel"
											].some((k) => runData.status.toLowerCase().includes(k)) && runData.status
										]
									}),
									runData.currentStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"Currently processing:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: runData.currentStep
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Processing payroll… Status reported by backend calculation engine."
									})
								] }), typeof runData.progress === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-3xl font-bold tracking-tight text-foreground",
										children: [Math.round(runData.progress), "%"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: "Completion"
									})]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: typeof runData.progress === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2.5 w-full overflow-hidden rounded-full bg-muted/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all duration-500 ease-out",
										style: {
											width: `${Math.min(100, Math.max(0, runData.progress))}%`,
											background: statusTone.tone === "danger" ? "rgb(239 68 68)" : statusTone.tone === "success" ? "rgb(16 185 129)" : "var(--gradient-brand)"
										}
									})
								}) : !isTerminalStatus(runData.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative h-2 w-full overflow-hidden rounded-full bg-muted/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 w-1/3 animate-indeterminate rounded-full bg-primary" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full overflow-hidden rounded-full bg-muted/40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full rounded-full ${statusTone.tone === "success" ? "w-full bg-primary" : statusTone.tone === "danger" ? "w-full bg-destructive" : "w-full bg-muted-foreground/30"}` })
								})
							}),
							runData.error?.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Backend Failure:"
										}),
										" ",
										runData.error.message,
										runData.error.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1 font-mono text-[10px] text-destructive",
											children: [
												"(",
												runData.error.code,
												")"
											]
										}) : null
									] })]
								})
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold text-foreground",
								children: "India Payroll Processing Pipeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Statutory stages from workforce inputs to provisional payslips generation."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListOrdered, { className: "h-4 w-4 text-muted-foreground" })]
						}), runData.steps && runData.steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
							children: runData.steps.map((step) => {
								const stepTone = getStepStatusTone(step.status);
								const Icon = stepTone.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2 rounded-xl border border-border bg-background/40 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `mt-0.5 h-4 w-4 shrink-0 ${stepTone.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: step.name
										}), step.details ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: step.details
										}) : null] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `shrink-0 text-[10px] capitalize ${stepTone.badge}`,
										children: step.status
									})]
								}, step.id);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-medium text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pipeline Granularity Note" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] leading-relaxed",
									children: "The backend execution engine reports overall progress and run status. Individual step-by-step progress flags are evaluated atomically on the server."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
								children: CONCEPTUAL_PIPELINE_STEPS.map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 rounded-xl border border-border bg-card p-2.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-5 w-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground",
										children: idx + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground",
										children: step.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: step.description
									})] })]
								}, step.id))
							})]
						})]
					}),
					runData.validationIssues && runData.validationIssues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold text-foreground",
								children: "Validation Findings"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Issues flagged by backend calculation engine during validation."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-muted-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-2",
							children: runData.validationIssues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-start justify-between gap-3 rounded-xl border p-3 text-xs ${issue.severity === "critical" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-muted text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [issue.severity === "critical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [issue.category || "Validation", ":"]
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: issue.message }),
										issue.employeeName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-[11px] opacity-80",
											children: ["Employee: ", issue.employeeName]
										}) : null
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "shrink-0 text-[10px] uppercase",
									children: issue.severity
								})]
							}, issue.id))
						})]
					}) : null,
					runData.status?.toLowerCase() === "completed" || runData.status?.toLowerCase() === "provision generated" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "border-border bg-card p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-foreground font-semibold text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Calculation Run Finished" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Provisional calculations are ready. Return to the Payroll Dashboard to review summary figures and audit records."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` }),
									style: { background: "var(--gradient-brand)" },
									className: "gap-1.5 text-xs shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Payroll Preview" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => navigate({ to: "/dashboard/payroll" }),
									className: "gap-1.5 text-xs shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payroll Dashboard" })
								})]
							})]
						})
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: cancelModalOpen,
				onOpenChange: setCancelModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleStop, { className: "h-4 w-4" }), "Cancel Payroll Processing Run"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Confirm cancellation of the current active payroll calculation job on the server."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Cancelling will abort active calculation workers and mark this run as cancelled. Any partial calculations generated will be discarded."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Run Identifier:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-foreground",
										children: runId
									})]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-row justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setCancelModalOpen(false),
								disabled: isCancelling,
								children: "Keep Running"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "destructive",
								size: "sm",
								onClick: handleConfirmCancel,
								disabled: isCancelling,
								children: isCancelling ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Cancelling..."] }) : "Confirm Cancel"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: retryModalOpen,
				onOpenChange: setRetryModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-primary" }), "Retry Payroll Calculation"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Trigger a new calculation cycle for this payroll run."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Retrying will re-trigger calculation workers on the backend engine."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Run Identifier:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-foreground",
										children: runId
									})]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-row justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setRetryModalOpen(false),
								disabled: isRetrying,
								children: "Dismiss"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								onClick: handleConfirmRetry,
								disabled: isRetrying,
								style: { background: "var(--gradient-brand)" },
								children: isRetrying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Retrying..."] }) : "Confirm & Retry"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollProcessingPage, PayrollProcessingPage as default };
