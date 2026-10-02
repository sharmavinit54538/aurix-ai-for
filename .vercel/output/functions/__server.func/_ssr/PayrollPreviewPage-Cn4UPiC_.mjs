import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, D as TrendingDown, Dr as ChevronRight, E as TrendingUp, J as ShieldAlert, Jn as Eye, Or as ChevronLeft, Rn as FileSpreadsheet, T as TriangleAlert, Tr as CircleAlert, Xn as ExternalLink, a as X, an as Layers, ci as ArrowUpDown, di as ArrowLeft, lt as RefreshCw, p as Users, pr as Clock, q as ShieldCheck, ri as Banknote, st as RotateCcw, vr as CircleX, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { c as Skeleton, l as StatCard, n as EmptyState, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollPreviewPage-Cn4UPiC_.js
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
		badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	};
	if (s === "failed" || s.includes("fail") || s.includes("error")) return {
		tone: "danger",
		label: status,
		badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
	};
	if (s === "provision generated" || s.includes("provision")) return {
		tone: "warning",
		label: status,
		badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
	};
	if (s === "under review" || s.includes("review")) return {
		tone: "info",
		label: status,
		badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
	};
	return {
		tone: "muted",
		label: status,
		badgeClass: "border-border bg-muted/40 text-foreground"
	};
}
function getValidationBadge(status) {
	const s = (status || "valid").toLowerCase();
	if (s === "error" || s === "invalid") return {
		label: "Error",
		className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
	};
	if (s === "warning" || s === "warn") return {
		label: "Warning",
		className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
	};
	return {
		label: "Valid",
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	};
}
function PayrollPreviewPage() {
	const runId = useParams({ strict: false })?.runId?.trim() || "";
	const navigate = useNavigate();
	const ws = useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isHr = useCurrentRole() === "hr_admin";
	const canViewPayroll = isHr || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canRunPayroll = isHr || userPermissions.includes("payroll.process") || userPermissions.includes("*");
	const [previewData, setPreviewData] = (0, import_react.useState)(null);
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const [totalEmployees, setTotalEmployees] = (0, import_react.useState)(0);
	const [totalPages, setTotalPages] = (0, import_react.useState)(1);
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [pageSize, setPageSize] = (0, import_react.useState)(10);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedDept, setSelectedDept] = (0, import_react.useState)("all");
	const [selectedValidation, setSelectedValidation] = (0, import_react.useState)("all");
	const [sortBy, setSortBy] = (0, import_react.useState)("name");
	const [sortDir, setSortDir] = (0, import_react.useState)("asc");
	const [selectedEmployee, setSelectedEmployee] = (0, import_react.useState)(null);
	const [detailSheetOpen, setDetailSheetOpen] = (0, import_react.useState)(false);
	const [loadingDetail, setLoadingDetail] = (0, import_react.useState)(false);
	const [loadingPreview, setLoadingPreview] = (0, import_react.useState)(true);
	const [loadingEmployees, setLoadingEmployees] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [isUnavailable, setIsUnavailable] = (0, import_react.useState)(false);
	const [recalculateModalOpen, setRecalculateModalOpen] = (0, import_react.useState)(false);
	const [isRecalculating, setIsRecalculating] = (0, import_react.useState)(false);
	const fetchPreviewSummary = (0, import_react.useCallback)(async () => {
		if (!runId) return;
		setLoadingPreview(true);
		try {
			setPreviewData(await payrollApi.getPayrollPreview(runId));
			setIsUnavailable(false);
			setApiError(null);
		} catch (err) {
			const status = err?.response?.status;
			if (status === 404) {
				setIsUnavailable(true);
				setApiError("Payroll preview data is currently unavailable on the backend server or pending calculation (404 Not Found).");
			} else if (status === 401 || status === 403) setApiError("You are not authorized to view this payroll preview.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to load payroll preview from the server.");
			setPreviewData(null);
		} finally {
			setLoadingPreview(false);
		}
	}, [runId]);
	const fetchEmployeesList = (0, import_react.useCallback)(async () => {
		if (!runId) return;
		setLoadingEmployees(true);
		try {
			const res = await payrollApi.getRunEmployees(runId, {
				page: currentPage,
				limit: pageSize,
				search: searchQuery.trim() || void 0,
				department: selectedDept !== "all" ? selectedDept : void 0,
				validationStatus: selectedValidation !== "all" ? selectedValidation : void 0,
				sortBy,
				sortDir
			});
			setEmployees(res.items || []);
			setTotalEmployees(res.total || 0);
			setTotalPages(res.totalPages || 1);
		} catch (err) {
			setEmployees([]);
			setTotalEmployees(0);
			setTotalPages(1);
		} finally {
			setLoadingEmployees(false);
		}
	}, [
		runId,
		currentPage,
		pageSize,
		searchQuery,
		selectedDept,
		selectedValidation,
		sortBy,
		sortDir
	]);
	(0, import_react.useEffect)(() => {
		if (!runId) {
			setLoadingPreview(false);
			setLoadingEmployees(false);
			return;
		}
		fetchPreviewSummary();
	}, [runId, fetchPreviewSummary]);
	(0, import_react.useEffect)(() => {
		if (runId && !isUnavailable) fetchEmployeesList();
	}, [
		runId,
		isUnavailable,
		fetchEmployeesList
	]);
	const handleRefresh = async () => {
		setIsRefreshing(true);
		await Promise.all([fetchPreviewSummary(), fetchEmployeesList()]);
		setIsRefreshing(false);
	};
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
	const handleSort = (field) => {
		if (sortBy === field) setSortDir((prev) => prev === "asc" ? "desc" : "asc");
		else {
			setSortBy(field);
			setSortDir("asc");
		}
	};
	const availableDepartments = (0, import_react.useMemo)(() => {
		const depts = /* @__PURE__ */ new Set();
		employees.forEach((e) => {
			if (e.department) depts.add(e.department);
		});
		return Array.from(depts);
	}, [employees]);
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
			description: "You do not have permission to view Payroll Preview. Please contact your system administrator for access.",
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
	const statusTone = getStatusTone(previewData?.status);
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/processing`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Processing Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm",
							children: "Payroll Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/validation`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Validation & Issues"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/approval`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Review & Approval"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/finalize`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Finalization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/payslips",
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Final Payslips"
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
							children: "Payroll Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px] font-medium border-border/80 bg-muted/30",
							title: `Payroll Run Identifier: ${runId}`,
							children: ["Run: ", runId]
						}),
						!loadingPreview && previewData?.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `text-xs font-semibold capitalize ${statusTone.badgeClass}`,
							children: statusTone.label
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Review and audit backend-calculated provisional payroll figures prior to formal review & approval."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` }),
							className: "h-9 gap-1.5 text-xs shadow-sm text-primary border-primary/30 hover:bg-primary/5",
							title: "View validation findings and rule violations",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validation & Issues" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` }),
							className: "h-9 gap-1.5 text-xs shadow-sm text-foreground hover:bg-muted/60",
							title: "Proceed to Step 7 Review & Approval",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Review & Approval" })]
						}),
						canRunPayroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setRecalculateModalOpen(true),
							className: "h-9 gap-1.5 text-xs shadow-sm",
							title: "Recalculate payroll figures on backend",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recalculate Payroll" })]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200",
						children: "Provisional Payroll Results"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300",
						children: [
							"These payroll results are for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "review and audit purposes only" }),
							" and have not been finalized.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payroll is not finalized, final payslips have not been generated, and employee payment has not been initiated." })
						]
					})]
				})]
			}),
			!loadingPreview && (isUnavailable || apiError) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "border-border/80 p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold text-foreground",
						children: isUnavailable ? "Payroll Preview Data Unavailable" : "Unable to Load Payroll Preview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground",
						children: apiError || "The payroll preview endpoint is currently unavailable or pending deployment on the backend server. Live payroll calculations will render here once available."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: handleRefresh,
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
			loadingPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-6",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-24" })]
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-48 w-full" })]
				})]
			}) : null,
			!loadingPreview && !isUnavailable && !apiError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "preview-summary-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "preview-summary-heading",
							className: "sr-only",
							children: "Payroll Preview Summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Employees",
									value: formatCount(previewData?.summary?.employeeCount),
									icon: Users,
									accent: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Gross Payroll",
									value: formatINR(previewData?.summary?.grossPayroll),
									icon: Banknote,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Total Earnings",
									value: formatINR(previewData?.summary?.totalEarnings ?? previewData?.summary?.grossPayroll),
									icon: TrendingUp,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Total Deductions",
									value: formatINR(previewData?.summary?.totalDeductions),
									icon: TrendingDown,
									accent: "warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Net Payroll",
									value: formatINR(previewData?.summary?.netPayroll),
									icon: Banknote,
									accent: "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Employer Cost",
									value: formatINR(previewData?.summary?.employerCost),
									icon: Layers,
									accent: "muted"
								})
							]
						})]
					}),
					previewData?.validation && (previewData.validation.errors?.length > 0 || previewData.validation.warnings?.length > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold",
									children: "Backend Validation Findings"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "destructive",
										className: "text-[10px]",
										children: [previewData.validation.errors.length, " Errors"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "text-[10px]",
										children: [previewData.validation.warnings.length, " Warnings"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` }),
										className: "h-7 text-xs gap-1 ml-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Validation Center" })]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [previewData.validation.errors.map((err) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-900 dark:text-rose-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [err.category || "Error", ":"]
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: err.message }),
										err.employeeName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] opacity-80",
											children: ["Employee: ", err.employeeName]
										}) : null
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "destructive",
									className: "shrink-0 text-[9px] uppercase",
									children: "Error"
								})]
							}, err.id)), previewData.validation.warnings.map((warn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:text-amber-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [warn.category || "Warning", ":"]
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: warn.message }),
										warn.employeeName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] opacity-80",
											children: ["Employee: ", warn.employeeName]
										}) : null
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "shrink-0 text-[9px] uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300",
									children: "Warning"
								})]
							}, warn.id))]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-4 sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold text-foreground",
									children: "Employee Payroll Records"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Individual computed payroll lines generated by the backend calculation engine."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "w-fit text-xs font-normal",
									children: [
										"Total Records:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "ml-1 font-semibold",
											children: totalEmployees
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative w-full sm:w-64",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: searchQuery,
													onChange: (e) => {
														setSearchQuery(e.target.value);
														setCurrentPage(1);
													},
													placeholder: "Search name or ID…",
													className: "h-8 pl-8 text-xs bg-background/50"
												}),
												searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setSearchQuery("");
														setCurrentPage(1);
													},
													className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
												}) : null
											]
										}),
										availableDepartments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedDept,
											onValueChange: (v) => {
												setSelectedDept(v);
												setCurrentPage(1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-8 w-36 text-xs bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Department" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All Departments"
											}), availableDepartments.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: dept,
												children: dept
											}, dept))] })]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedValidation,
											onValueChange: (v) => {
												setSelectedValidation(v);
												setCurrentPage(1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-8 w-36 text-xs bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Validation" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Statuses"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "valid",
													children: "Valid Only"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "warning",
													children: "Warnings"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "error",
													children: "Errors"
												})
											] })]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rows:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: String(pageSize),
										onValueChange: (v) => {
											setPageSize(Number(v));
											setCurrentPage(1);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-8 w-20 text-xs bg-background/50",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "10",
												children: "10"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "25",
												children: "25"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "50",
												children: "50"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 overflow-x-auto rounded-xl border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "bg-muted/40 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "cursor-pointer select-none",
											onClick: () => handleSort("name"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 text-muted-foreground" })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Employee ID" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "cursor-pointer select-none",
											onClick: () => handleSort("department"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 text-muted-foreground" })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right cursor-pointer select-none",
											onClick: () => handleSort("grossSalary"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Earnings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 text-muted-foreground" })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Total Deductions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right cursor-pointer select-none",
											onClick: () => handleSort("netSalary"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net Pay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 text-muted-foreground" })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Validation" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Actions"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loadingEmployees ? Array.from({ length: pageSize }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 8,
									className: "py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-full" })
								}) }, i)) : employees.length > 0 ? employees.map((emp) => {
									const vBadge = getValidationBadge(emp.validationStatus);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "font-medium text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: emp.name }), emp.designation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground",
													children: emp.designation
												}) : null] })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "font-mono text-muted-foreground",
												children: emp.employeeId
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-muted-foreground",
												children: emp.department || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-right font-mono",
												children: formatINR(emp.grossEarnings)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-right font-mono text-rose-600 dark:text-rose-400",
												children: formatINR(emp.totalDeductions)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400",
												children: formatINR(emp.netPay)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: `text-[10px] font-medium ${vBadge.className}`,
												children: [vBadge.label, emp.issuesCount && emp.issuesCount > 0 ? ` (${emp.issuesCount})` : ""]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${emp.employeeId || emp.id}` }),
													className: "h-7 text-xs text-primary hover:text-primary gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View" })]
												})
											})
										]
									}, emp.id || emp.employeeId);
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 8,
									className: "py-12 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mx-auto max-w-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mx-auto h-8 w-8 text-muted-foreground/60" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 font-display text-sm font-semibold text-foreground",
												children: "No payroll results available"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground",
												children: searchQuery || selectedDept !== "all" || selectedValidation !== "all" ? "No employee records matched your filter criteria." : "Payroll results have not been generated for this run."
											})
										]
									})
								}) }) })] })
							}),
							totalPages > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"Page ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: currentPage
									}),
									" of",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: totalPages
									}),
									" (",
									totalEmployees,
									" total records)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
										disabled: currentPage <= 1 || loadingEmployees,
										className: "h-8 px-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Previous" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
										disabled: currentPage >= totalPages || loadingEmployees,
										className: "h-8 px-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
									})]
								})]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "border-border p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-display text-sm font-semibold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next Step: Formal Review & Approval" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "After auditing preview calculations, submit the run for formal review & authorization. Payment transfers cannot be initiated until approval is granted."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => {
										toast.info("Review & Approval workflow is handled in the next stage.");
									},
									style: { background: "var(--gradient-brand)" },
									className: "gap-1.5 text-xs shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Review & Approval" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
								})
							})]
						})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: detailSheetOpen,
				onOpenChange: setDetailSheetOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					className: "w-full sm:max-w-xl overflow-y-auto p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
							className: "border-b border-border pb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "font-display text-lg font-bold text-foreground",
									children: selectedEmployee?.name || "Employee Payroll Detail"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
									className: "text-xs text-muted-foreground",
									children: [
										"ID: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: selectedEmployee?.employeeId
										}),
										selectedEmployee?.department ? ` • ${selectedEmployee.department}` : "",
										selectedEmployee?.designation ? ` • ${selectedEmployee.designation}` : ""
									]
								})] }), selectedEmployee?.validationStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-xs ${getValidationBadge(selectedEmployee.validationStatus).className}`,
									children: getValidationBadge(selectedEmployee.validationStatus).label
								}) : null]
							})
						}),
						selectedEmployee ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => {
									setDetailSheetOpen(false);
									navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${selectedEmployee.employeeId || selectedEmployee.id}` });
								},
								className: "w-full gap-1.5 text-xs shadow-sm",
								style: { background: "var(--gradient-brand)" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Dedicated Employee Payroll Page" })]
							})
						}) : null,
						loadingDetail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full" })
							]
						}) : selectedEmployee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-6 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Net Payable"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400",
											children: formatINR(selectedEmployee.netPay)
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: ["Gross: ", formatINR(selectedEmployee.grossEarnings)]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-rose-600 dark:text-rose-400",
												children: ["Deductions: -", formatINR(selectedEmployee.totalDeductions)]
											})]
										})]
									})
								}),
								selectedEmployee.attendance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-foreground mb-3 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Attendance & Payable Days" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-xs sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg bg-muted/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground",
													children: "Working Days"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-foreground",
													children: selectedEmployee.attendance.workingDays ?? "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg bg-muted/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground",
													children: "Paid Days"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-emerald-600 dark:text-emerald-400",
													children: selectedEmployee.attendance.paidDays ?? "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg bg-muted/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground",
													children: "Unpaid / LOP"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-rose-600 dark:text-rose-400",
													children: selectedEmployee.attendance.unpaidDays ?? selectedEmployee.attendance.lopDays ?? "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg bg-muted/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground",
													children: "Leave Days"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-foreground",
													children: selectedEmployee.attendance.leaveDays ?? "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg bg-muted/40 p-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground",
													children: "Overtime Hours"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-foreground",
													children: selectedEmployee.attendance.overtimeHours ?? "—"
												})]
											})
										]
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-foreground mb-3 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Earnings Breakdown" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-foreground",
											children: formatINR(selectedEmployee.grossEarnings)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5",
										children: selectedEmployee.earnings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											selectedEmployee.earnings.basic != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Basic Salary"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.earnings.basic)
												})]
											}) : null,
											selectedEmployee.earnings.hra != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "House Rent Allowance (HRA)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.earnings.hra)
												})]
											}) : null,
											selectedEmployee.earnings.specialAllowance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Special Allowance"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.earnings.specialAllowance)
												})]
											}) : null,
											selectedEmployee.earnings.conveyance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Conveyance Allowance"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.earnings.conveyance)
												})]
											}) : null,
											selectedEmployee.earnings.overtime != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Overtime Earnings"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.earnings.overtime)
												})]
											}) : null,
											selectedEmployee.earnings.bonus != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Bonus / Incentives"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.earnings.bonus)
												})]
											}) : null,
											selectedEmployee.earnings.other != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Other Allowances"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.earnings.other)
												})]
											}) : null
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "py-2 text-center text-muted-foreground text-[11px]",
											children: "Detailed earnings breakdown not reported by backend."
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-foreground mb-3 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Statutory & Policy Deductions" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-rose-600 dark:text-rose-400",
											children: ["-", formatINR(selectedEmployee.totalDeductions)]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5",
										children: selectedEmployee.deductions ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											selectedEmployee.deductions.pf != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Provident Fund (PF)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.deductions.pf)
												})]
											}) : null,
											selectedEmployee.deductions.esi != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Employee State Insurance (ESI)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.deductions.esi)
												})]
											}) : null,
											selectedEmployee.deductions.pt != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Professional Tax (PT)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.deductions.pt)
												})]
											}) : null,
											selectedEmployee.deductions.tds != null || selectedEmployee.deductions.incomeTax != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "TDS / Income Tax (Sec 192)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.deductions.tds ?? selectedEmployee.deductions.incomeTax)
												})]
											}) : null,
											selectedEmployee.deductions.loan != null || selectedEmployee.deductions.advance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Loan / Advance Recovery"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR((selectedEmployee.deductions.loan || 0) + (selectedEmployee.deductions.advance || 0))
												})]
											}) : null,
											selectedEmployee.deductions.other != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Other Deductions"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatINR(selectedEmployee.deductions.other)
												})]
											}) : null
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "py-2 text-center text-muted-foreground text-[11px]",
											children: "Detailed deduction components not reported by backend."
										})
									})]
								}),
								selectedEmployee.issues && selectedEmployee.issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Employee Validation Findings" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5",
										children: selectedEmployee.issues.map((iss, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-amber-800 dark:text-amber-300",
											children: ["• ", iss.message]
										}, iss.id || idx))
									})]
								}) : null
							]
						}) : null
					]
				})
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Recalculating will re-evaluate attendance, salary structures, statutory taxes (PF, ESI, TDS), and deductions for all employees in this period."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Run ID:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-foreground",
										children: runId
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Period:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: previewData?.periodName || "—"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-row justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setRecalculateModalOpen(false),
								disabled: isRecalculating,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								onClick: handleConfirmRecalculate,
								disabled: isRecalculating,
								style: { background: "var(--gradient-brand)" },
								children: isRecalculating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Recalculating..."] }) : "Confirm & Recalculate"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollPreviewPage, PayrollPreviewPage as default };
