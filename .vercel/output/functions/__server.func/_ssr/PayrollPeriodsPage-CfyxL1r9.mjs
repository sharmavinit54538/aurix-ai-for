import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Dr as ChevronRight, Gt as Lock, Jn as Eye, Kt as LockOpen, Or as ChevronLeft, Tr as CircleAlert, Ur as CalendarDays, Zn as Ellipsis, ht as Plus, lt as RefreshCw, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { c as Skeleton, n as EmptyState, r as GlassCard, u as StatusBadge } from "./Shared-C_skH1kb.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { n as AlertDescription, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
import { t as MONTH_NAMES } from "./dates-BeKhMkn9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollPeriodsPage-CfyxL1r9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(dateStr) {
	if (!dateStr) return "—";
	try {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return String(dateStr);
		return new Intl.DateTimeFormat("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		}).format(d);
	} catch {
		return String(dateStr);
	}
}
function formatCount(value) {
	if (value === null || value === void 0 || isNaN(value)) return "—";
	return new Intl.NumberFormat("en-IN").format(value);
}
function getPeriodStatusTone(status) {
	if (!status) return "muted";
	const normalized = String(status).toLowerCase().trim();
	if (normalized.includes("approved") || normalized.includes("finalized") || normalized.includes("closed")) return "success";
	if (normalized.includes("processing") || normalized.includes("review") || normalized.includes("provision") || normalized.includes("pending") || normalized.includes("locked")) return "warning";
	if (normalized.includes("fail") || normalized.includes("error") || normalized.includes("void")) return "danger";
	if (normalized.includes("draft") || normalized.includes("open")) return "info";
	return "muted";
}
function PayrollPeriodsPage() {
	useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isPayrollAdmin = useCurrentRole() === "hr_admin";
	const canViewPeriods = isPayrollAdmin || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canCreatePeriod = isPayrollAdmin || userPermissions.includes("payroll.create") || userPermissions.includes("payroll.process") || userPermissions.includes("*");
	const canLockPeriod = isPayrollAdmin || userPermissions.includes("payroll.process") || userPermissions.includes("*");
	const [periods, setPeriods] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const [limit] = (0, import_react.useState)(10);
	const [totalPages, setTotalPages] = (0, import_react.useState)(1);
	const [totalRecords, setTotalRecords] = (0, import_react.useState)(0);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [yearFilter, setYearFilter] = (0, import_react.useState)("all");
	const [createModalOpen, setCreateModalOpen] = (0, import_react.useState)(false);
	const [isSubmittingCreate, setIsSubmittingCreate] = (0, import_react.useState)(false);
	const [createFormError, setCreateFormError] = (0, import_react.useState)(null);
	const now = /* @__PURE__ */ new Date();
	const [formMonth, setFormMonth] = (0, import_react.useState)(now.getMonth() + 1);
	const [formYear, setFormYear] = (0, import_react.useState)(now.getFullYear());
	const [formName, setFormName] = (0, import_react.useState)(`${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`);
	const [formStartDate, setFormStartDate] = (0, import_react.useState)(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`);
	const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
	const [formEndDate, setFormEndDate] = (0, import_react.useState)(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`);
	const [formPayDate, setFormPayDate] = (0, import_react.useState)(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`);
	const [formRemarks, setFormRemarks] = (0, import_react.useState)("");
	const [selectedDetailsPeriod, setSelectedDetailsPeriod] = (0, import_react.useState)(null);
	const [detailsModalOpen, setDetailsModalOpen] = (0, import_react.useState)(false);
	const [actionInProgressId, setActionInProgressId] = (0, import_react.useState)(null);
	const fetchPeriods = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setApiError(null);
		try {
			const res = await payrollApi.getPeriodsList({
				page,
				limit,
				status: statusFilter !== "all" ? statusFilter : void 0,
				year: yearFilter !== "all" ? Number(yearFilter) : void 0,
				search: searchQuery.trim() || void 0
			});
			setPeriods(res.items);
			setTotalPages(res.totalPages || 1);
			setTotalRecords(res.total || res.items.length);
		} catch (err) {
			setPeriods([]);
			setTotalPages(1);
			setTotalRecords(0);
			if (err?.response?.status === 404) setApiError("Backend payroll service is currently unavailable or pending deployment (404 Not Found). Live payroll periods will appear once the backend endpoint is accessible.");
			else if (err?.response?.status === 401) setApiError("Authentication session has expired or is invalid. Please sign in to view payroll periods.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to load payroll periods from the server.");
		} finally {
			setLoading(false);
		}
	}, [
		page,
		limit,
		statusFilter,
		yearFilter,
		searchQuery
	]);
	(0, import_react.useEffect)(() => {
		fetchPeriods();
	}, [fetchPeriods]);
	const availableYears = (0, import_react.useMemo)(() => {
		const years = /* @__PURE__ */ new Set();
		periods.forEach((p) => {
			if (p.periodYear) years.add(p.periodYear);
			else if (p.startDate) {
				const yr = new Date(p.startDate).getFullYear();
				if (!isNaN(yr)) years.add(yr);
			}
		});
		return Array.from(years).sort((a, b) => b - a);
	}, [periods]);
	const filteredPeriods = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return periods;
		const q = searchQuery.toLowerCase().trim();
		return periods.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.status && p.status.toLowerCase().includes(q));
	}, [periods, searchQuery]);
	const handleMonthYearChange = (newMonth, newYear) => {
		setFormMonth(newMonth);
		setFormYear(newYear);
		setFormName(`${MONTH_NAMES[newMonth - 1] || `Month ${newMonth}`} ${newYear}`);
		const sDay = "01";
		const lDay = String(new Date(newYear, newMonth, 0).getDate()).padStart(2, "0");
		const mStr = String(newMonth).padStart(2, "0");
		setFormStartDate(`${newYear}-${mStr}-${sDay}`);
		setFormEndDate(`${newYear}-${mStr}-${lDay}`);
		setFormPayDate(`${newYear}-${mStr}-${lDay}`);
	};
	const handleCreatePeriodSubmit = async (e) => {
		e.preventDefault();
		setCreateFormError(null);
		if (!formName.trim()) {
			setCreateFormError("Payroll Period Name is required.");
			return;
		}
		if (!formStartDate) {
			setCreateFormError("Start Date is required.");
			return;
		}
		if (!formEndDate) {
			setCreateFormError("End Date is required.");
			return;
		}
		if (!formPayDate) {
			setCreateFormError("Pay Date is required.");
			return;
		}
		const start = new Date(formStartDate);
		const end = new Date(formEndDate);
		const pay = new Date(formPayDate);
		if (isNaN(start.getTime())) {
			setCreateFormError("Start Date is invalid.");
			return;
		}
		if (isNaN(end.getTime())) {
			setCreateFormError("End Date is invalid.");
			return;
		}
		if (isNaN(pay.getTime())) {
			setCreateFormError("Pay Date is invalid.");
			return;
		}
		if (end < start) {
			setCreateFormError("End Date cannot be earlier than Start Date.");
			return;
		}
		setIsSubmittingCreate(true);
		try {
			const newPeriod = await payrollApi.createPeriod({
				name: formName.trim(),
				startDate: formStartDate,
				endDate: formEndDate,
				payDate: formPayDate,
				periodMonth: formMonth,
				periodYear: formYear,
				remarks: formRemarks.trim() || void 0
			});
			toast.success(`Payroll period "${newPeriod.name || formName}" created successfully.`);
			setCreateModalOpen(false);
			setFormRemarks("");
			await fetchPeriods();
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to create payroll period on backend.";
			setCreateFormError(msg);
			toast.error(msg);
		} finally {
			setIsSubmittingCreate(false);
		}
	};
	const handleToggleLock = async (period) => {
		if (!period.id) return;
		setActionInProgressId(period.id);
		try {
			if (period.isLocked) {
				await payrollApi.reopenPeriod(period.id, "Reopened by administrator request");
				toast.success(`Period "${period.name}" unlocked successfully.`);
			} else {
				await payrollApi.lockPeriod(period.id, "Locked by administrator request");
				toast.success(`Period "${period.name}" locked successfully.`);
			}
			await fetchPeriods();
		} catch (err) {
			toast.error(err?.response?.data?.message || err?.message || "Failed to update period lock status.");
		} finally {
			setActionInProgressId(null);
		}
	};
	const handleVoidPeriod = async (period) => {
		if (!period.id) return;
		if (!window.confirm(`Are you sure you want to void the payroll period "${period.name}"? This action cancels the period.`)) return;
		setActionInProgressId(period.id);
		try {
			await payrollApi.voidPeriod(period.id, "Voided by user request");
			toast.success(`Period "${period.name}" has been voided.`);
			await fetchPeriods();
		} catch (err) {
			toast.error(err?.response?.data?.message || err?.message || "Failed to void payroll period.");
		} finally {
			setActionInProgressId(null);
		}
	};
	const handleViewDetails = (period) => {
		setSelectedDetailsPeriod(period);
		setDetailsModalOpen(true);
	};
	if (!canViewPeriods) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-4xl py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Access Restricted",
			description: "You do not have permission to view Payroll Periods. Please contact your system administrator for access.",
			icon: CircleAlert
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
					children: "Payroll Periods"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Create, manage, and monitor payroll periods."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/payroll",
								children: "Payroll Dashboard"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "sm",
							className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/payroll/periods",
								children: "Payroll Periods"
							})
						})]
					}), canCreatePeriod ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => {
							setCreateFormError(null);
							setCreateModalOpen(true);
						},
						className: "h-8 gap-1.5 cursor-pointer text-xs text-brand-foreground shadow-sm",
						style: { background: "var(--gradient-brand)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Payroll Period" })]
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: "Search by period name or ID…",
									className: "h-9 pl-9 text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: statusFilter,
									onValueChange: setStatusFilter,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Statuses" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "All Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Draft",
											children: "Draft"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Open",
											children: "Open"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Processing",
											children: "Processing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Provision Generated",
											children: "Provision Generated"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Under Review",
											children: "Under Review"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Pending Approval",
											children: "Pending Approval"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Approved",
											children: "Approved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Finalized",
											children: "Finalized"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Closed",
											children: "Closed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Locked",
											children: "Locked"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Void",
											children: "Void"
										})
									] })]
								})
							}),
							availableYears.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-32",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: yearFilter,
									onValueChange: setYearFilter,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Years" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Years"
									}), availableYears.map((yr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: String(yr),
										children: yr
									}, yr))] })]
								})
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: totalRecords > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Showing ",
							filteredPeriods.length,
							" of ",
							totalRecords,
							" record",
							totalRecords === 1 ? "" : "s"
						] }) : null
					})]
				})
			}),
			apiError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				variant: "destructive",
				className: "border-destructive/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, {
						className: "text-xs font-medium",
						children: apiError
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: fetchPeriods,
						className: "h-7 text-xs",
						children: "Retry"
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mb-4 h-6 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-lg" }, i))
					})]
				})
			}) : filteredPeriods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No payroll periods found",
					description: "Create a payroll period to begin payroll processing.",
					icon: Calendar
				}), canCreatePeriod ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => {
							setCreateFormError(null);
							setCreateModalOpen(true);
						},
						className: "gap-1.5 text-brand-foreground shadow-sm",
						style: { background: "var(--gradient-brand)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Payroll Period" })]
					})
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "border-b border-border bg-muted/40 hover:bg-muted/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold",
								children: "Payroll Period"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold",
								children: "Start Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold",
								children: "End Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold",
								children: "Pay Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold text-right",
								children: "Employee Count"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold text-center",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold",
								children: "Created Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-semibold text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredPeriods.map((period) => {
						const tone = getPeriodStatusTone(period.status);
						const isLockedOrFinalized = Boolean(period.isLocked || period.status?.toLowerCase() === "finalized" || period.status?.toLowerCase() === "closed");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "border-b border-border/60 hover:bg-accent/40 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: period.name }),
											period.isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
												children: "Current"
											}) : null,
											period.isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												title: "Locked period",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-amber-500 shrink-0" })
											}) : null
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: formatDate(period.startDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: formatDate(period.endDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: formatDate(period.payDate)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-right font-mono text-muted-foreground",
									children: formatCount(period.employeeCount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
										status: period.status || "Draft",
										tone
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: formatDate(period.createdAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-8 w-8 p-0",
											disabled: actionInProgressId === period.id,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "sr-only",
												children: "Open menu"
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "end",
										className: "w-44",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => handleViewDetails(period),
												className: "gap-2 cursor-pointer text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Details" })]
											}),
											canLockPeriod ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
												onClick: () => handleToggleLock(period),
												className: "gap-2 cursor-pointer text-xs",
												children: period.isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-3.5 w-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reopen Period" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lock Period" })] })
											}) : null,
											!isLockedOrFinalized && canCreatePeriod ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => handleVoidPeriod(period),
												className: "gap-2 cursor-pointer text-xs text-destructive focus:text-destructive",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Void Period" })]
											})] }) : null
										]
									})] })
								})
							]
						}, period.id);
					}) })] })
				}), totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"Page ",
						page,
						" of ",
						totalPages,
						" (",
						totalRecords,
						" total periods)"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setPage((prev) => Math.max(prev - 1, 1)),
							disabled: page <= 1 || loading,
							className: "h-8 px-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5 mr-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Previous" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setPage((prev) => Math.min(prev + 1, totalPages)),
							disabled: page >= totalPages || loading,
							className: "h-8 px-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 ml-1" })]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createModalOpen,
				onOpenChange: setCreateModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreatePeriodSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Payroll Period" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs",
								children: "Configure a new payroll period based on your company's pay cycle."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 py-4",
								children: [
									createFormError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
										variant: "destructive",
										className: "py-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: createFormError })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "period-month",
												className: "text-xs font-medium",
												children: ["Month ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(formMonth),
												onValueChange: (val) => handleMonthYearChange(Number(val), formYear),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "period-month",
													className: "h-9 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Month" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MONTH_NAMES.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: String(idx + 1),
													children: m
												}, idx + 1)) })]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "period-year",
												className: "text-xs font-medium",
												children: ["Year ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(formYear),
												onValueChange: (val) => handleMonthYearChange(formMonth, Number(val)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "period-year",
													className: "h-9 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Year" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
													formYear - 1,
													formYear,
													formYear + 1
												].map((yr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: String(yr),
													children: yr
												}, yr)) })]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "period-name",
											className: "text-xs font-medium",
											children: ["Payroll Period Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "period-name",
											value: formName,
											onChange: (e) => setFormName(e.target.value),
											placeholder: "e.g., September 2026",
											required: true,
											className: "h-9 text-xs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "period-start-date",
												className: "text-xs font-medium",
												children: ["Start Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "period-start-date",
												type: "date",
												value: formStartDate,
												onChange: (e) => setFormStartDate(e.target.value),
												required: true,
												className: "h-9 text-xs"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "period-end-date",
												className: "text-xs font-medium",
												children: ["End Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "period-end-date",
												type: "date",
												value: formEndDate,
												onChange: (e) => setFormEndDate(e.target.value),
												required: true,
												className: "h-9 text-xs"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "period-pay-date",
												className: "text-xs font-medium",
												children: ["Pay Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "period-pay-date",
												type: "date",
												value: formPayDate,
												onChange: (e) => setFormPayDate(e.target.value),
												required: true,
												className: "h-9 text-xs"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: "The scheduled date when salary disbursement is planned."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "period-remarks",
											className: "text-xs font-medium",
											children: "Remarks / Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "period-remarks",
											value: formRemarks,
											onChange: (e) => setFormRemarks(e.target.value),
											placeholder: "Optional operational remarks or cycle notes",
											rows: 2,
											className: "text-xs"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "gap-2 sm:gap-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setCreateModalOpen(false),
									disabled: isSubmittingCreate,
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									disabled: isSubmittingCreate,
									className: "gap-1.5 text-brand-foreground shadow-sm",
									style: { background: "var(--gradient-brand)" },
									children: isSubmittingCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Creating Period…" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Period" })
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: detailsModalOpen,
				onOpenChange: setDetailsModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-5 w-5 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedDetailsPeriod?.name || "Payroll Period Details" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Review live period configurations and status recorded on backend."
						})] }),
						selectedDetailsPeriod && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 rounded-xl border border-border bg-card/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Status:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
										status: selectedDetailsPeriod.status || "Draft",
										tone: getPeriodStatusTone(selectedDetailsPeriod.status)
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Lock State:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-medium",
									children: selectedDetailsPeriod.isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-amber-500 font-semibold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), " Locked"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-500 font-semibold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-3 w-3" }), " Open"]
									})
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 rounded-xl border border-border bg-card/40 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Period ID:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px]",
											children: selectedDetailsPeriod.id || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Start Date:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: formatDate(selectedDetailsPeriod.startDate)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "End Date:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: formatDate(selectedDetailsPeriod.endDate)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Pay Date:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: formatDate(selectedDetailsPeriod.payDate)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employee Count:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: formatCount(selectedDetailsPeriod.employeeCount)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Created At:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(selectedDetailsPeriod.createdAt) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Updated At:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(selectedDetailsPeriod.updatedAt) })]
									}),
									selectedDetailsPeriod.remarks ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Remarks:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-foreground",
											children: selectedDetailsPeriod.remarks
										})]
									}) : null
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setDetailsModalOpen(false),
							children: "Close"
						}) })
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollPeriodsPage, PayrollPeriodsPage as default };
