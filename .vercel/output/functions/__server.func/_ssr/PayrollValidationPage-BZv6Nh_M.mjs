import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Dr as ChevronRight, Gn as FileCheck, J as ShieldAlert, Jn as Eye, Or as ChevronLeft, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, a as X, an as Layers, di as ArrowLeft, jn as Funnel, lt as RefreshCw, p as Users, q as ShieldCheck, st as RotateCcw, un as Info, vr as CircleX, x as UserCheck } from "../_libs/lucide-react.mjs";
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
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollValidationPage-BZv6Nh_M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(val) {
	if (!val) return "—";
	try {
		const d = new Date(val);
		if (isNaN(d.getTime())) return String(val);
		return d.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {
		return String(val);
	}
}
function getValidationStatusBadge(status) {
	if (!status) return {
		label: "Pending",
		className: "border-border bg-muted/40 text-foreground"
	};
	const s = status.toLowerCase().trim();
	if (s === "passed" || s === "completed" || s === "valid") return {
		label: "Passed",
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	};
	if (s === "failed" || s.includes("fail") || s === "error") return {
		label: "Failed",
		className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
	};
	if (s === "warning" || s.includes("warn")) return {
		label: "Warning",
		className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
	};
	if (s === "validating" || s === "in_progress") return {
		label: "Validating",
		className: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
	};
	if (s === "not started" || s === "draft") return {
		label: "Not Started",
		className: "border-border bg-muted/40 text-foreground"
	};
	return {
		label: status,
		className: "border-border bg-muted/40 text-foreground"
	};
}
function renderSeverityBadge(severity) {
	const s = (severity || "").toLowerCase().trim();
	if (s === "error" || s === "critical" || s === "fatal") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "destructive",
		className: "text-[10px] font-semibold gap-1 uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s === "critical" ? "Critical" : "Error" })]
	});
	if (s === "info") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "outline",
		className: "text-[10px] font-medium border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 gap-1 uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Info" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "outline",
		className: "text-[10px] font-medium border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1 uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: severity ? severity : "Warning" })]
	});
}
function PayrollValidationPage() {
	const runId = useParams({ strict: false })?.runId?.trim() || "";
	const navigate = useNavigate();
	const ws = useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isHr = useCurrentRole() === "hr_admin";
	const canViewPayroll = isHr || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canRunPayroll = isHr || userPermissions.includes("payroll.process") || userPermissions.includes("*");
	const [validationData, setValidationData] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [isUnavailable, setIsUnavailable] = (0, import_react.useState)(false);
	const [revalidateModalOpen, setRevalidateModalOpen] = (0, import_react.useState)(false);
	const [isValidating, setIsValidating] = (0, import_react.useState)(false);
	const [recalculateModalOpen, setRecalculateModalOpen] = (0, import_react.useState)(false);
	const [isRecalculating, setIsRecalculating] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedSeverity, setSelectedSeverity] = (0, import_react.useState)("all");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [selectedDepartment, setSelectedDepartment] = (0, import_react.useState)("all");
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)("all");
	const [selectedBlocking, setSelectedBlocking] = (0, import_react.useState)("all");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [pageSize, setPageSize] = (0, import_react.useState)(10);
	const [selectedIssue, setSelectedIssue] = (0, import_react.useState)(null);
	const [issueSheetOpen, setIssueSheetOpen] = (0, import_react.useState)(false);
	const fetchValidationData = (0, import_react.useCallback)(async () => {
		if (!runId) return;
		setIsLoading(true);
		setApiError(null);
		setIsUnavailable(false);
		try {
			setValidationData(await payrollApi.getPayrollValidation(runId));
		} catch (err) {
			const status = err?.response?.status;
			if (status === 404) {
				setIsUnavailable(true);
				setApiError("Payroll validation data is currently unavailable on the backend server (404 Not Found).");
			} else if (status === 401 || status === 403) setApiError("You do not have permission to view validation issues for this payroll run.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to load payroll validation findings from the backend.");
			setValidationData(null);
		} finally {
			setIsLoading(false);
		}
	}, [runId]);
	(0, import_react.useEffect)(() => {
		fetchValidationData();
	}, [fetchValidationData]);
	const handleTriggerRevalidation = async () => {
		if (!runId) return;
		setIsValidating(true);
		try {
			const res = await payrollApi.runPayrollValidation(runId);
			toast.success(res?.message || "Payroll revalidation completed successfully.");
			setRevalidateModalOpen(false);
			await fetchValidationData();
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to trigger backend validation.";
			toast.error(msg);
		} finally {
			setIsValidating(false);
		}
	};
	const handleTriggerRecalculate = async () => {
		if (!runId) return;
		setIsRecalculating(true);
		try {
			const res = await payrollApi.recalculatePayroll(runId);
			toast.success(res?.message || "Payroll recalculation triggered successfully.");
			setRecalculateModalOpen(false);
			await fetchValidationData();
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to trigger recalculation.";
			toast.error(msg);
		} finally {
			setIsRecalculating(false);
		}
	};
	const availableCategories = (0, import_react.useMemo)(() => {
		if (!validationData?.issues) return [];
		const cats = /* @__PURE__ */ new Set();
		validationData.issues.forEach((iss) => {
			if (iss.category) cats.add(iss.category);
		});
		return Array.from(cats).sort();
	}, [validationData?.issues]);
	const availableDepartments = (0, import_react.useMemo)(() => {
		if (!validationData?.issues) return [];
		const depts = /* @__PURE__ */ new Set();
		validationData.issues.forEach((iss) => {
			if (iss.department) depts.add(iss.department);
		});
		return Array.from(depts).sort();
	}, [validationData?.issues]);
	const hasBlockingInfo = (0, import_react.useMemo)(() => {
		return Boolean(validationData?.blockingCount != null || validationData?.issues?.some((iss) => iss.blocking !== void 0));
	}, [validationData]);
	const hasStatusInfo = (0, import_react.useMemo)(() => {
		return Boolean(validationData?.issues?.some((iss) => iss.status || iss.resolved !== void 0));
	}, [validationData]);
	const filteredIssues = (0, import_react.useMemo)(() => {
		if (!validationData?.issues) return [];
		return validationData.issues.filter((iss) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const matchEmpName = iss.employeeName?.toLowerCase().includes(q);
				const matchEmpId = iss.employeeId?.toLowerCase().includes(q);
				const matchMsg = iss.message?.toLowerCase().includes(q);
				const matchCat = iss.category?.toLowerCase().includes(q);
				const matchComp = iss.component?.toLowerCase().includes(q);
				const matchCode = iss.code?.toLowerCase().includes(q);
				const matchDept = iss.department?.toLowerCase().includes(q);
				if (!matchEmpName && !matchEmpId && !matchMsg && !matchCat && !matchComp && !matchCode && !matchDept) return false;
			}
			if (selectedSeverity !== "all") {
				const s = (iss.severity || "warning").toLowerCase();
				if (selectedSeverity === "error") {
					if (s !== "error" && s !== "critical" && s !== "fatal") return false;
				} else if (selectedSeverity === "warning") {
					if (s !== "warning" && s !== "advisory") return false;
				} else if (selectedSeverity === "info") {
					if (s !== "info") return false;
				}
			}
			if (selectedCategory !== "all") {
				if (iss.category !== selectedCategory) return false;
			}
			if (selectedDepartment !== "all") {
				if (iss.department !== selectedDepartment) return false;
			}
			if (selectedStatus !== "all") {
				const isResolved = Boolean(iss.resolved || iss.status === "resolved");
				if (selectedStatus === "resolved" && !isResolved) return false;
				if (selectedStatus === "open" && isResolved) return false;
			}
			if (hasBlockingInfo && selectedBlocking !== "all") {
				const isBlocking = Boolean(iss.blocking);
				if (selectedBlocking === "blocking" && !isBlocking) return false;
				if (selectedBlocking === "non_blocking" && isBlocking) return false;
			}
			return true;
		});
	}, [
		validationData?.issues,
		searchQuery,
		selectedSeverity,
		selectedCategory,
		selectedDepartment,
		selectedStatus,
		selectedBlocking,
		hasBlockingInfo
	]);
	const totalPages = Math.max(1, Math.ceil(filteredIssues.length / pageSize));
	const paginatedIssues = (0, import_react.useMemo)(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredIssues.slice(start, start + pageSize);
	}, [
		filteredIssues,
		currentPage,
		pageSize
	]);
	(0, import_react.useEffect)(() => {
		setCurrentPage(1);
	}, [
		searchQuery,
		selectedSeverity,
		selectedCategory,
		selectedDepartment,
		selectedStatus,
		selectedBlocking
	]);
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
			description: "You do not have permission to view payroll validation findings. Please contact your system administrator.",
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
			title: "Missing Payroll Run Identifier",
			description: "No payroll run ID was provided in the route parameters. Please select a payroll run.",
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
	const statusBadge = getValidationStatusBadge(validationData?.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl space-y-6 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/preview`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Payroll Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm",
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
					to: `/dashboard/payroll/runs/${runId}/preview`,
					className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Payroll Preview" })]
				})]
			}),
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` }),
						className: "h-9 gap-1.5 text-xs text-foreground hover:bg-muted/50",
						title: "Proceed to Step 7 Payroll Review & Approval",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Review & Approval" })]
					}), canRunPayroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setRecalculateModalOpen(true),
						disabled: isLoading || isRecalculating,
						className: "h-9 gap-1.5 text-xs text-foreground hover:bg-muted/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recalculate Run" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setRevalidateModalOpen(true),
						disabled: isLoading || isValidating,
						className: "h-9 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Revalidate Payroll" })]
					})] }) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "text-xs font-semibold tracking-wide uppercase",
						children: "PROVISIONAL PAYROLL AUDIT — Validation & Issues"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "text-xs text-amber-800/90 dark:text-amber-300/90 mt-1",
						children: [
							"Validation issues are generated by the server-side payroll engine to highlight inconsistencies, missing statutory numbers, or calculation discrepancies. Reviewing these issues does not finalize payroll, generate final payslips, or initiate bank disbursement. Salary has ",
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
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-2xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-2xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-2xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-2xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-2xl" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-xl" })
					})
				]
			}) : isUnavailable || !validationData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
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
							children: "Payroll Validation Findings Unavailable"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground leading-relaxed",
							children: apiError || `Validation results could not be retrieved from the backend for run "${runId}". The backend validation service may still be processing or the endpoint is currently unreachable.`
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: fetchValidationData,
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retry Connection" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "default",
								size: "sm",
								onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` }),
								className: "text-xs",
								children: "Back to Preview"
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-xl font-bold tracking-tight text-foreground",
										children: "Payroll Validation & Issues"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `text-xs font-semibold uppercase tracking-wider ${statusBadge.className}`,
										children: statusBadge.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Run ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-medium text-foreground",
											children: runId
										})] }),
										validationData.periodName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"Period:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: validationData.periodName
											})
										] })] }) : null,
										validationData.runStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"Run Status:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: validationData.runStatus
											})
										] })] }) : null,
										validationData.lastValidatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"Last Validated:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: formatDate(validationData.lastValidatedAt)
											})
										] })] }) : null
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` }),
									className: "gap-1.5 text-xs shadow-sm",
									title: "Proceed to Step 7 Review & Approval",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Review & Approval (Step 7)" })]
								}), canRunPayroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setRecalculateModalOpen(true),
									disabled: isRecalculating,
									className: "gap-1.5 text-xs shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recalculate Run" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => setRevalidateModalOpen(true),
									disabled: isValidating,
									className: "gap-1.5 text-xs shadow-sm",
									style: { background: "var(--gradient-brand)" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Run Validation Check" })]
								})] }) : null]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Total Findings",
								value: validationData.totalIssues,
								hint: "Detected validation issues",
								icon: Layers,
								accent: "brand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Errors / Critical",
								value: validationData.errorsCount,
								hint: "Requires remediation",
								icon: CircleX,
								accent: "danger"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Advisory Warnings",
								value: validationData.warningsCount,
								hint: "Non-blocking recommendations",
								icon: TriangleAlert,
								accent: "warning"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Employees Affected",
								value: validationData.affectedEmployeesCount,
								hint: "Individuals requiring review",
								icon: Users,
								accent: "muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Validation Status",
								value: statusBadge.label,
								hint: validationData.errorsCount > 0 ? "Remediation required" : "Validation cycle completed",
								icon: ShieldCheck,
								accent: validationData.errorsCount > 0 ? "danger" : "success"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 max-w-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: searchQuery,
											onChange: (e) => setSearchQuery(e.target.value),
											placeholder: "Search by employee name, ID, issue, rule code, department…",
											className: "h-9 pl-9 text-xs bg-background/50"
										}),
										searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSearchQuery(""),
											className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedSeverity,
											onValueChange: setSelectedSeverity,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 w-32 text-xs bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Severity" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Severity"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "error",
													children: "Errors Only"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "warning",
													children: "Warnings Only"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "info",
													children: "Info Only"
												})
											] })]
										}),
										availableCategories.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedCategory,
											onValueChange: setSelectedCategory,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 w-36 text-xs bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All Categories"
											}), availableCategories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: cat,
												children: cat
											}, cat))] })]
										}) : null,
										availableDepartments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedDepartment,
											onValueChange: setSelectedDepartment,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 w-36 text-xs bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Department" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "All Departments"
											}), availableDepartments.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: dept,
												children: dept
											}, dept))] })]
										}) : null,
										hasStatusInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedStatus,
											onValueChange: setSelectedStatus,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 w-32 text-xs bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Statuses"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "open",
													children: "Open"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "resolved",
													children: "Resolved"
												})
											] })]
										}) : null,
										hasBlockingInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: selectedBlocking,
											onValueChange: setSelectedBlocking,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 w-36 text-xs bg-background/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Impact" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Impact"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "blocking",
													children: "Blocking Only"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "non_blocking",
													children: "Non-Blocking Only"
												})
											] })]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-muted-foreground ml-auto sm:ml-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rows:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(pageSize),
												onValueChange: (v) => {
													setPageSize(Number(v));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-9 w-18 text-xs bg-background/50",
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
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 overflow-x-auto rounded-xl border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
									className: "bg-muted/40 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "w-24",
											children: "Severity"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Employee" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Issue Description" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Component" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Blocking" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Action"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paginatedIssues.length > 0 ? paginatedIssues.map((iss) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										className: "text-xs hover:bg-muted/30 cursor-pointer",
										onClick: () => {
											setSelectedIssue(iss);
											setIssueSheetOpen(true);
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: renderSeverityBadge(iss.severity) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "font-medium text-foreground",
												children: iss.employeeName || iss.employeeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: iss.employeeName || "—" }), iss.department ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-[9px] bg-muted/40 font-normal px-1.5 py-0",
														children: iss.department
													}) : null]
												}), iss.employeeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-[10px] text-muted-foreground",
													children: iss.employeeId
												}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground italic",
													children: "Run-Level Check"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
												className: "max-w-md",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "line-clamp-2 text-foreground font-normal leading-relaxed",
													children: iss.message
												}), iss.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "font-mono text-[9px] text-muted-foreground mt-0.5",
													children: ["Rule: ", iss.code]
												}) : null]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[10px] bg-muted/40 font-normal",
												children: iss.category || "General"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-muted-foreground",
												children: iss.component || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: iss.blocking !== void 0 ? iss.blocking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[9px] border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold",
												children: "Blocking"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[9px] border-border bg-muted/40 text-muted-foreground",
												children: "Non-blocking"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "—"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-right",
												onClick: (e) => e.stopPropagation(),
												children: iss.employeeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${iss.employeeId}` }),
													className: "h-7 text-xs text-primary hover:text-primary gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Payroll" })]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => {
														setSelectedIssue(iss);
														setIssueSheetOpen(true);
													},
													className: "h-7 text-xs text-muted-foreground hover:text-foreground gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Details" })]
												})
											})
										]
									}, iss.id);
								}) : validationData.issues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 7,
									className: "py-14 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mx-auto max-w-sm space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-base font-bold text-foreground",
												children: "All Payroll Validations Passed"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground leading-relaxed",
												children: "Zero validation issues were detected by the backend payroll engine for this run. All salary, statutory, and attendance checks conform to policy rules."
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "pt-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "sm",
													onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` }),
													className: "text-xs",
													children: "Return to Payroll Preview"
												})
											})
										]
									})
								}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									colSpan: 7,
									className: "py-12 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mx-auto max-w-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mx-auto h-8 w-8 text-muted-foreground/60" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 font-display text-sm font-semibold text-foreground",
												children: "No matching validation issues"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground",
												children: "No issues matched your current search and filter criteria. Try resetting your filters."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => {
													setSearchQuery("");
													setSelectedSeverity("all");
													setSelectedCategory("all");
													setSelectedDepartment("all");
													setSelectedStatus("all");
													setSelectedBlocking("all");
												},
												className: "mt-3 text-xs text-primary",
												children: "Clear Filters"
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
									filteredIssues.length,
									" ",
									"total issues)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
										disabled: currentPage <= 1,
										className: "h-8 px-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Previous" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
										disabled: currentPage >= totalPages,
										className: "h-8 px-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
									})]
								})]
							}) : null
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: issueSheetOpen,
				onOpenChange: setIssueSheetOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					className: "w-full sm:max-w-md overflow-y-auto p-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
						className: "border-b border-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "font-display text-base font-bold text-foreground",
								children: "Validation Issue Detail"
							}), selectedIssue ? renderSeverityBadge(selectedIssue.severity) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
							className: "text-xs text-muted-foreground",
							children: "Detailed breakdown of the validation finding reported by the payroll engine."
						})]
					}), selectedIssue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-xl border p-3.5 ${selectedIssue.severity === "error" || selectedIssue.severity === "critical" ? "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200" : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold mb-1 flex items-center gap-1.5",
									children: [selectedIssue.severity === "error" || selectedIssue.severity === "critical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-rose-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Finding Statement" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "leading-relaxed",
									children: selectedIssue.message
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/60 p-3.5 space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Category:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selectedIssue.category || "General"
										})]
									}),
									selectedIssue.component ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Affected Component:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selectedIssue.component
										})]
									}) : null,
									selectedIssue.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Rule Code:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-foreground",
											children: selectedIssue.code
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Blocking Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: selectedIssue.blocking !== void 0 ? selectedIssue.blocking ? "Yes — Prevents finalization" : "No — Advisory warning" : "Not specified by backend"
										})]
									}),
									selectedIssue.status || selectedIssue.resolved !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Issue Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground capitalize",
											children: selectedIssue.status || (selectedIssue.resolved ? "Resolved" : "Open")
										})]
									}) : null,
									selectedIssue.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Reference / Source:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] text-foreground",
											children: selectedIssue.source
										})]
									}) : null,
									selectedIssue.resolution ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-1 py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Resolution Notes:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground leading-relaxed",
											children: selectedIssue.resolution
										})]
									}) : null,
									selectedIssue.detectedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Detected At:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: formatDate(selectedIssue.detectedAt)
										})]
									}) : null,
									selectedIssue.employeeName || selectedIssue.employeeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employee Name:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: selectedIssue.employeeName || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-border/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employee ID:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-foreground",
												children: selectedIssue.employeeId || "—"
											})]
										}),
										selectedIssue.department ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Department:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: selectedIssue.department
											})]
										}) : null
									] }) : null
								]
							}),
							selectedIssue.employeeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => {
										setIssueSheetOpen(false);
										navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${selectedIssue.employeeId}` });
									},
									className: "w-full gap-1.5 text-xs",
									style: { background: "var(--gradient-brand)" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Employee Payroll Detail (Step 5)" })]
								})
							}) : null
						]
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: revalidateModalOpen,
				onOpenChange: setRevalidateModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4 text-primary" }), "Revalidate Payroll Run"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Execute a fresh validation cycle on the server-side payroll engine."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Revalidating will re-audit all statutory deductions, tax slabs (Section 192), attendance thresholds, and CTC structures for run",
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
								onClick: () => setRevalidateModalOpen(false),
								disabled: isValidating,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								size: "sm",
								onClick: handleTriggerRevalidation,
								disabled: isValidating,
								className: "text-xs gap-1.5",
								children: [isValidating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Execute Validation" })]
							})]
						})
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
								onClick: handleTriggerRecalculate,
								disabled: isRecalculating,
								className: "text-xs gap-1.5",
								children: [isRecalculating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Execute Recalculation" })]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollValidationPage, PayrollValidationPage as default };
