import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, D as TrendingDown, E as TrendingUp, Rn as FileSpreadsheet, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, an as Layers, gt as Play, lt as RefreshCw, p as Users, pr as Clock, q as ShieldCheck, ri as Banknote, un as Info, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { c as Skeleton, l as StatCard, n as EmptyState, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { n as AlertDescription, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollDashboardPage-DAQwTicH.js
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
function formatCount(value) {
	if (value === null || value === void 0 || isNaN(value)) return "—";
	return new Intl.NumberFormat("en-IN").format(value);
}
function PayrollDashboardPage() {
	const ws = useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const navigate = useNavigate();
	const isHr = useCurrentRole() === "hr_admin";
	const canViewPayroll = isHr || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canRunPayroll = isHr || userPermissions.includes("payroll.process") || userPermissions.includes("*");
	const [periods, setPeriods] = (0, import_react.useState)([]);
	const [selectedPeriodId, setSelectedPeriodId] = (0, import_react.useState)("");
	const [dashboardData, setDashboardData] = (0, import_react.useState)(null);
	const [loadingPeriods, setLoadingPeriods] = (0, import_react.useState)(true);
	const [loadingDashboard, setLoadingDashboard] = (0, import_react.useState)(true);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [confirmModalOpen, setConfirmModalOpen] = (0, import_react.useState)(false);
	const [isRunningPayroll, setIsRunningPayroll] = (0, import_react.useState)(false);
	const selectedPeriod = (0, import_react.useMemo)(() => {
		return periods.find((p) => p.id === selectedPeriodId) || null;
	}, [periods, selectedPeriodId]);
	const fetchPeriods = (0, import_react.useCallback)(async () => {
		setLoadingPeriods(true);
		setApiError(null);
		try {
			const data = await payrollApi.getPeriods();
			setPeriods(data);
			if (data.length > 0) setSelectedPeriodId((data.find((p) => p.isCurrent) || data[0]).id);
			else setSelectedPeriodId("");
		} catch (err) {
			setPeriods([]);
			setSelectedPeriodId("");
			if (err?.response?.status === 404) setApiError("Backend payroll service is currently unavailable or pending deployment (404 Not Found). The dashboard will display live data once the backend endpoint is deployed.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to load payroll periods from the server.");
		} finally {
			setLoadingPeriods(false);
		}
	}, []);
	const fetchDashboardData = (0, import_react.useCallback)(async (periodId) => {
		setLoadingDashboard(true);
		try {
			setDashboardData(await payrollApi.getDashboard(periodId));
		} catch (err) {
			setDashboardData(null);
			if (err?.response?.status === 404) setApiError("Backend payroll service is currently unavailable or pending deployment (404 Not Found). The dashboard will display live data once the backend endpoint is deployed.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to load payroll dashboard data.");
		} finally {
			setLoadingDashboard(false);
		}
	}, []);
	(0, import_react.useCallback)(() => {
		fetchPeriods();
		if (selectedPeriodId) fetchDashboardData(selectedPeriodId);
		else fetchDashboardData();
	}, [
		fetchPeriods,
		fetchDashboardData,
		selectedPeriodId
	]);
	(0, import_react.useEffect)(() => {
		fetchPeriods();
	}, [fetchPeriods]);
	(0, import_react.useEffect)(() => {
		if (selectedPeriodId) fetchDashboardData(selectedPeriodId);
		else if (!loadingPeriods && periods.length === 0) fetchDashboardData();
	}, [
		selectedPeriodId,
		loadingPeriods,
		periods.length,
		fetchDashboardData
	]);
	const handlePeriodChange = (val) => {
		setSelectedPeriodId(val);
	};
	const handleConfirmRunPayroll = async () => {
		if (!selectedPeriodId) {
			toast.error("No payroll period selected.");
			return;
		}
		setIsRunningPayroll(true);
		try {
			const result = await payrollApi.runPayroll(selectedPeriodId);
			if (result && result.success) {
				toast.success(result.message || "Provisional payroll processing initiated successfully.");
				setConfirmModalOpen(false);
				const runId = result.runId || result.run_id || result.id || result.cycleId || result.cycle_id || result.data?.runId || result.data?.run_id || result.data?.id;
				if (runId) navigate({ to: `/dashboard/payroll/runs/${runId}/processing` });
				else await fetchDashboardData(selectedPeriodId);
			} else {
				toast.warning(result?.message || "Payroll processing responded with an unexpected status.");
				setConfirmModalOpen(false);
				await fetchDashboardData(selectedPeriodId);
			}
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Payroll processing service is currently unavailable.";
			toast.error(msg);
		} finally {
			setIsRunningPayroll(false);
		}
	};
	if (ws.isRestoring) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
			children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-2xl" }, i))
		})]
	});
	if (!canViewPayroll) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-4xl py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Access Restricted",
			description: "You do not have permission to view the Payroll Dashboard. Please contact your system administrator for access.",
			icon: CircleAlert
		})
	});
	const hasBlockingReadinessErrors = Boolean(dashboardData?.readiness?.items?.some((item) => item.status === "Error"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "secondary",
								size: "sm",
								className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/payroll",
									children: "Payroll Dashboard"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/payroll/periods",
									children: "Payroll Periods"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/payroll/payments",
									children: "Disbursements"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-auto min-w-[280px] sm:min-w-[300px]",
						children: loadingPeriods ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full rounded-lg" }) : periods.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedPeriodId,
							onValueChange: handlePeriodChange,
							"aria-label": "Select payroll period",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
								className: "h-9 w-full bg-card/85 border-border/80 hover:bg-accent/40 font-medium text-xs px-3 shadow-xs rounded-lg transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select period" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "min-w-[280px] sm:min-w-[300px]",
								children: periods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: p.id,
									className: "text-xs cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: p.name
									}), p.isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-semibold",
										children: "Current"
									}) : null]
								}, p.id))
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-xs text-muted-foreground",
							title: "No payroll periods available from backend",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "No payroll periods available"
							})]
						})
					}),
					canRunPayroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setConfirmModalOpen(true),
						disabled: loadingDashboard || !selectedPeriodId || hasBlockingReadinessErrors,
						className: "h-9 gap-1.5 shadow-md cursor-pointer bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
						title: hasBlockingReadinessErrors ? "Cannot run payroll while readiness errors exist" : !selectedPeriodId ? "Select a payroll period first" : "Run provisional payroll",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 fill-white text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white font-semibold",
							children: "Run Payroll"
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "summary-cards-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "summary-cards-heading",
					className: "sr-only",
					children: "Payroll Summary Metrics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
					children: loadingDashboard ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-28" })]
					}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Employees",
							value: formatCount(dashboardData?.summary?.employeeCount),
							icon: Users,
							accent: "brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Gross Payroll",
							value: formatINR(dashboardData?.summary?.grossPayroll),
							icon: Banknote,
							accent: "muted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total Deductions",
							value: formatINR(dashboardData?.summary?.totalDeductions),
							icon: TrendingDown,
							accent: "warning"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Net Payroll",
							value: formatINR(dashboardData?.summary?.netPayroll),
							icon: TrendingUp,
							accent: "success"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Employer Cost",
							value: formatINR(dashboardData?.summary?.employerCost),
							icon: Layers,
							accent: "muted"
						})
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Payroll Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Selected Period:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: selectedPeriod ? selectedPeriod.name : "None selected"
								})
							]
						}), loadingDashboard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-48" })]
						}) : dashboardData?.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-background/50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${dashboardData.status.toLowerCase() === "finalized" || dashboardData.status.toLowerCase() === "approved" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : dashboardData.status.toLowerCase() === "failed" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-amber-500/15 text-amber-700 dark:text-amber-400"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), dashboardData.status]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Current stage of the payroll lifecycle for this period as reported by the system."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border bg-background/30 p-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-sm text-muted-foreground",
								children: "No payroll run"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "No payroll run has been executed for this period yet."
							})]
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Running payroll generates ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "provisional calculations" }),
								". It does not finalize compensation or disburse funds."
							] })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Payroll Readiness"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Verification checks determined by backend validation services."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: loadingDashboard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16" })]
							}, i))
						}) : dashboardData?.readiness?.items && dashboardData.readiness.items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2.5 sm:grid-cols-2",
							children: dashboardData.readiness.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border bg-background/50 p-3 transition-colors hover:bg-background/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium text-foreground truncate",
										children: item.area
									}), item.details ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground truncate",
										children: item.details
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${item.status === "Ready" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : item.status === "Warning" ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400"}`,
									children: [item.status === "Ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }) : item.status === "Warning" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" }), item.status]
								})]
							}, idx))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border bg-background/30 p-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mx-auto h-8 w-8 text-muted-foreground/60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-medium text-sm",
									children: "Readiness information unavailable"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "The backend has not returned pre-payroll validation readiness metrics for this period."
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-semibold",
					children: "Issues"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Backend validation findings categorized by severity."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-muted-foreground" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: loadingDashboard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" })]
				}) : dashboardData?.issues && (dashboardData.issues.errors?.length > 0 || dashboardData.issues.warnings?.length > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "errors",
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "errors",
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Errors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "destructive",
									className: "h-4 px-1.5 text-[10px]",
									children: dashboardData.issues.errors?.length || 0
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "warnings",
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Warnings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "h-4 px-1.5 text-[10px]",
									children: dashboardData.issues.warnings?.length || 0
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "errors",
							className: "space-y-2",
							children: dashboardData.issues.errors?.length > 0 ? dashboardData.issues.errors.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 h-4 w-4 shrink-0 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-rose-700 dark:text-rose-300",
											children: [issue.category, ":"]
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: issue.message
										}),
										issue.employeeName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: ["Employee: ", issue.employeeName]
										}) : null
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "destructive",
									className: "shrink-0 text-[10px] uppercase",
									children: "Error"
								})]
							}, issue.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border p-4 text-center text-xs text-muted-foreground",
								children: "No errors found."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "warnings",
							className: "space-y-2",
							children: dashboardData.issues.warnings?.length > 0 ? dashboardData.issues.warnings.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-amber-700 dark:text-amber-300",
											children: [issue.category, ":"]
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: issue.message
										}),
										issue.employeeName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: ["Employee: ", issue.employeeName]
										}) : null
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "shrink-0 text-[10px] uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300",
									children: "Warning"
								})]
							}, issue.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-border p-4 text-center text-xs text-muted-foreground",
								children: "No warnings found."
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-dashed border-border bg-background/30 p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-8 w-8 text-emerald-500/70" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-medium text-sm",
							children: "No issues found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "There are no backend validation errors or warnings reported for this payroll period."
						})
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-semibold",
					children: "Recent Payroll Runs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "History of executed payroll calculations reported by backend."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-muted-foreground" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: loadingDashboard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full" })
					]
				}) : dashboardData?.recentRuns && dashboardData.recentRuns.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "bg-muted/40 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payroll Period" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Employee Count"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Gross Payroll"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Net Payroll"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Run Date" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Action"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: dashboardData.recentRuns.map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium text-foreground",
								children: run.periodName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: formatCount(run.employeeCount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: formatINR(run.grossPayroll)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: formatINR(run.netPayroll)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `text-[10px] font-semibold uppercase ${run.status.toLowerCase() === "finalized" || run.status.toLowerCase() === "approved" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : run.status.toLowerCase() === "failed" ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400" : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"}`,
								children: run.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-muted-foreground",
								children: run.runDate ? new Date(run.runDate).toLocaleDateString("en-IN", {
									year: "numeric",
									month: "short",
									day: "numeric"
								}) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-7 text-xs text-muted-foreground hover:text-foreground",
									onClick: () => {
										if (run.id) {
											const s = (run.status || "").toLowerCase();
											if (s.includes("provision") || s.includes("completed") || s.includes("final") || s.includes("approved") || s.includes("review")) navigate({ to: `/dashboard/payroll/runs/${run.id}/preview` });
											else navigate({ to: `/dashboard/payroll/runs/${run.id}/processing` });
										} else toast.info(`Viewing payroll details for ${run.periodName}`);
									},
									children: "View"
								})
							})
						]
					}, run.id)) })] })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-dashed border-border bg-background/30 p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto h-8 w-8 text-muted-foreground/60" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-medium text-sm",
							children: "No payroll runs yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "There are no historic or active payroll runs recorded in the backend for this workspace."
						})
					]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: confirmModalOpen,
				onOpenChange: setConfirmModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current text-primary" }), "Confirm Provisional Payroll Run"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Review period details and operational parameters before triggering calculation."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Payroll Period:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: selectedPeriod ? selectedPeriod.name : "None selected"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Estimated Employees:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: formatCount(dashboardData?.summary?.employeeCount)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-amber-800 dark:text-amber-300",
												children: "Important Process Disclosures:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
												className: "list-disc pl-4 space-y-0.5 text-[11px] text-amber-800/90 dark:text-amber-200/90",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"Payroll processing generates ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "provisional results" }),
														" for review."
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"Payroll is ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT finalized" }),
														" at this stage."
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"Salary payment / bank transfer is ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT initiated" }),
														"."
													] })
												]
											})]
										})]
									})
								}),
								hasBlockingReadinessErrors ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
									variant: "destructive",
									className: "py-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: "There are blocking readiness errors reported by backend services. Please resolve them before executing." })]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-row justify-end gap-2 sm:gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setConfirmModalOpen(false),
								disabled: isRunningPayroll,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								onClick: handleConfirmRunPayroll,
								disabled: isRunningPayroll || hasBlockingReadinessErrors,
								className: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold shadow-md disabled:opacity-50 border-0",
								children: isRunningPayroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5 animate-spin text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white",
									children: "Initiating..."
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1.5 h-3.5 w-3.5 fill-white text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white",
									children: "Confirm & Run"
								})] })
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollDashboardPage, PayrollDashboardPage as default };
