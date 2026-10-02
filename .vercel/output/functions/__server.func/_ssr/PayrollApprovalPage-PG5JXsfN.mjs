import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as TrendingDown, E as TrendingUp, Gt as Lock, J as ShieldAlert, Jn as Eye, M as ThumbsUp, N as ThumbsDown, Qt as ListChecks, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Xn as ExternalLink, an as Layers, di as ArrowLeft, lt as RefreshCw, mn as History, p as Users, pr as Clock, q as ShieldCheck, ri as Banknote, un as Info, vr as CircleX, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole, n as canManagePayroll } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { c as Skeleton, l as StatCard, n as EmptyState, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollApprovalPage-PG5JXsfN.js
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
function getApprovalStatusTone(status) {
	if (!status) return {
		tone: "muted",
		label: "Unknown",
		badgeClass: "border-border bg-muted/30 text-muted-foreground"
	};
	const s = status.toLowerCase().trim();
	if (s === "approved" || s === "completed") return {
		tone: "success",
		label: "Approved",
		badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	};
	if (s === "rejected" || s.includes("reject") || s.includes("fail")) return {
		tone: "danger",
		label: "Rejected",
		badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
	};
	if (s === "under review" || s === "pending approval" || s.includes("review")) return {
		tone: "info",
		label: status,
		badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
	};
	if (s === "provision generated" || s.includes("provision")) return {
		tone: "warning",
		label: status,
		badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
	};
	if (s === "finalized" || s === "closed" || s === "locked") return {
		tone: "muted",
		label: status,
		badgeClass: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400"
	};
	return {
		tone: "muted",
		label: status,
		badgeClass: "border-border bg-muted/40 text-foreground"
	};
}
function getValidationBadge(status) {
	if (!status) return {
		label: "Pending",
		className: "border-border bg-muted/40 text-muted-foreground"
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
	return {
		label: status,
		className: "border-border bg-muted/40 text-foreground"
	};
}
function PayrollApprovalPage() {
	const runId = useParams({ strict: false })?.runId?.trim() || "";
	const navigate = useNavigate();
	useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isPayrollAdmin = canManagePayroll(useCurrentRole());
	const canViewPayroll = isPayrollAdmin || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canApprovePayroll = isPayrollAdmin || userPermissions.includes("payroll.approve") || userPermissions.includes("payroll.admin") || userPermissions.includes("*");
	const [reviewData, setReviewData] = (0, import_react.useState)(null);
	const [loadingReview, setLoadingReview] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [isUnavailable, setIsUnavailable] = (0, import_react.useState)(false);
	const [approvalModalOpen, setApprovalModalOpen] = (0, import_react.useState)(false);
	const [approvalComments, setApprovalComments] = (0, import_react.useState)("");
	const [isApproving, setIsApproving] = (0, import_react.useState)(false);
	const [rejectionModalOpen, setRejectionModalOpen] = (0, import_react.useState)(false);
	const [rejectionReason, setRejectionReason] = (0, import_react.useState)("");
	const [rejectionComments, setRejectionComments] = (0, import_react.useState)("");
	const [isRejecting, setIsRejecting] = (0, import_react.useState)(false);
	const fetchReview = (0, import_react.useCallback)(async (showToast = false) => {
		if (!runId) return;
		try {
			setLoadingReview(true);
			setApiError(null);
			setIsUnavailable(false);
			setReviewData(await payrollApi.getPayrollReview(runId));
			if (showToast) toast.success("Payroll review data refreshed from backend.");
		} catch (err) {
			const status = err?.response?.status;
			const msg = err?.response?.data?.message || err?.message || "Failed to load payroll review data.";
			if (status === 404) {
				setIsUnavailable(true);
				setApiError(`Payroll run "${runId}" was not found on the backend (404). Approval workflow is currently unavailable for this run identifier.`);
			} else setApiError(msg);
			setReviewData(null);
		} finally {
			setLoadingReview(false);
			setIsRefreshing(false);
		}
	}, [runId]);
	(0, import_react.useEffect)(() => {
		fetchReview();
	}, [fetchReview]);
	const handleRefresh = (0, import_react.useCallback)(() => {
		setIsRefreshing(true);
		fetchReview(true);
	}, [fetchReview]);
	const handleConfirmApproval = async () => {
		if (!runId || isApproving) return;
		try {
			setIsApproving(true);
			const res = await payrollApi.approvePayroll(runId, { comments: approvalComments.trim() || void 0 });
			toast.success(res.message || "Payroll run approved successfully.");
			setApprovalModalOpen(false);
			setApprovalComments("");
			await fetchReview(false);
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to approve payroll run.";
			toast.error(msg);
		} finally {
			setIsApproving(false);
		}
	};
	const handleConfirmRejection = async () => {
		if (!runId || isRejecting) return;
		if (!rejectionReason.trim()) {
			toast.error("Please provide a reason for rejecting or sending back payroll.");
			return;
		}
		try {
			setIsRejecting(true);
			const res = await payrollApi.rejectPayroll(runId, {
				reason: rejectionReason.trim(),
				comments: rejectionComments.trim() || void 0
			});
			toast.success(res.message || "Payroll run sent back for correction.");
			setRejectionModalOpen(false);
			setRejectionReason("");
			setRejectionComments("");
			await fetchReview(false);
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to return payroll run.";
			toast.error(msg);
		} finally {
			setIsRejecting(false);
		}
	};
	const statusLower = (reviewData?.status || "").toLowerCase().trim();
	const isApproved = statusLower === "approved";
	const isRejected = statusLower === "rejected";
	const isFinalized = statusLower === "finalized" || statusLower === "closed" || statusLower === "locked";
	const isProcessing = statusLower === "processing";
	const validationErrorsCount = Number(reviewData?.validation?.errorsCount || 0);
	const validationBlockingCount = reviewData?.validation?.blockingCount != null ? Number(reviewData.validation.blockingCount) : validationErrorsCount;
	const hasBlockingErrors = validationBlockingCount > 0;
	const canApproveNow = canApprovePayroll && !isApproved && !isFinalized && !isProcessing && !hasBlockingErrors;
	const canRejectNow = canApprovePayroll && !isFinalized && !isProcessing;
	const statusTone = getApprovalStatusTone(reviewData?.status);
	const valBadge = getValidationBadge(reviewData?.validation?.status);
	const checklistItems = (0, import_react.useMemo)(() => {
		if (!reviewData) return [];
		const isCalcDone = !isProcessing && Boolean(reviewData.summary?.employeeCount);
		const isValDone = Boolean(reviewData.validation?.status);
		const isErrorsResolved = !hasBlockingErrors;
		const isStatutoryAvailable = Boolean(reviewData.summary?.totalDeductions != null);
		const isReadyForApproval = isCalcDone && isValDone && isErrorsResolved && !isFinalized;
		return [
			{
				id: "calc",
				title: "Provisional Calculation Completed",
				description: "Backend calculation engine has evaluated gross, allowances, and attendance.",
				completed: isCalcDone,
				required: true
			},
			{
				id: "val",
				title: "Validation Cycle Executed",
				description: "Server audit rules ran against compliance, salary structures, and tax parameters.",
				completed: isValDone,
				required: true
			},
			{
				id: "errors",
				title: "Blocking Validation Errors Resolved",
				description: hasBlockingErrors ? `${validationBlockingCount} blocking error(s) must be addressed before approval sign-off.` : "Zero blocking errors reported by backend engine.",
				completed: isErrorsResolved,
				required: true
			},
			{
				id: "statutory",
				title: "Statutory Deductions Available",
				description: "PF, ESI, Professional Tax, and TDS calculations are present in totals.",
				completed: isStatutoryAvailable,
				required: true
			},
			{
				id: "readiness",
				title: "Governance Approval Eligibility",
				description: isReadyForApproval ? "All prerequisites satisfied. Authorized reviewer may execute sign-off." : "Prerequisites incomplete or blocked by validation errors.",
				completed: isReadyForApproval,
				required: true
			}
		];
	}, [
		reviewData,
		isProcessing,
		hasBlockingErrors,
		validationBlockingCount,
		isFinalized
	]);
	if (!runId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Missing Payroll Run Identifier",
			description: "No payroll run ID was provided in the route parameters. Please select a payroll run from the dashboard.",
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
	if (!canViewPayroll) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Access Restricted",
			description: "You do not have permission to view payroll review & approval. Please contact your system administrator.",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/validation`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Validation & Issues"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm",
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
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-foreground",
							children: "Payroll Review & Approval"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px] font-medium border-border/80 bg-muted/30",
							title: `Payroll Run Identifier: ${runId}`,
							children: ["Run: ", runId]
						}),
						!loadingReview && reviewData?.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `text-xs font-semibold capitalize ${statusTone.badgeClass}`,
							children: statusTone.label
						}) : null,
						!loadingReview && reviewData?.validation?.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: `text-xs font-semibold ${valBadge.className}`,
							children: ["Validation: ", valBadge.label]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [reviewData?.periodName ? `Review provisional results and execute sign-off for ${reviewData.periodName}.` : "Review actual provisional calculation results, assess validation readiness, and execute sign-off.", reviewData?.lastUpdatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
							"Updated ",
							formatDate(reviewData.lastUpdatedAt)
						]
					}) : null]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` }),
							className: "h-9 gap-1.5 text-xs shadow-sm text-primary border-primary/30 hover:bg-primary/5",
							title: "Inspect validation issues and audit findings in Step 6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validation Center" })]
						}),
						canRejectNow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setRejectionModalOpen(true),
							disabled: loadingReview || isApproving || isRejecting,
							className: "h-9 gap-1.5 text-xs shadow-sm border-rose-500/30 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
							title: "Return payroll run for corrections",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send Back / Reject" })]
						}) : null,
						canApprovePayroll && !isApproved && !isFinalized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "default",
							size: "sm",
							onClick: () => setApprovalModalOpen(true),
							disabled: !canApproveNow || loadingReview || isApproving || isRejecting,
							className: "h-9 gap-1.5 text-xs shadow-sm",
							style: { background: canApproveNow ? "var(--gradient-brand)" : void 0 },
							title: hasBlockingErrors ? "Approval blocked by validation errors" : isProcessing ? "Payroll calculation is still processing" : "Approve this payroll run",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve Payroll" })]
						}) : null,
						isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/finalize` }),
							className: "h-9 gap-1.5 text-xs shadow-sm border-violet-500/30 text-violet-600 hover:bg-violet-500/10 dark:text-violet-400",
							title: "Proceed to Step 8 Payroll Finalization",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Finalize Payroll (Step 8)" })]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200",
						children: "PROVISIONAL PAYROLL — UNDER REVIEW & APPROVAL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300",
						children: [
							"Payroll has been calculated and is undergoing governance review.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payroll is not final, final payslips have not been issued, and payment has NOT been made." }),
							" ",
							"Approving payroll signifies managerial authorization of computed figures; approval does",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT" }),
							" trigger bank disbursement or create payment batches."
						]
					})]
				})]
			}),
			!loadingReview && (isUnavailable || apiError) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "border-border/80 p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold text-foreground",
						children: isUnavailable ? "Payroll Review Data Unavailable" : "Unable to Load Payroll Review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground",
						children: apiError || "The payroll review endpoint is currently unavailable on the backend server. Live payroll calculation and approval state will render here once available."
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
			loadingReview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			!loadingReview && !isUnavailable && !apiError && reviewData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "border-emerald-500/30 bg-emerald-500/10 p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-sm font-semibold text-emerald-950 dark:text-emerald-200",
										children: "Payroll Run Approved"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-0.5",
										children: "This payroll run has been formally approved. It is pending subsequent finalization and disbursement workflows."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-emerald-900/80 dark:text-emerald-300/80",
										children: [reviewData.approval?.approvedByName || reviewData.approval?.approvedBy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Approved by:" }),
											" ",
											reviewData.approval.approvedByName || reviewData.approval.approvedBy
										] }) : null, reviewData.approval?.approvedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Approved at:" }),
											" ",
											formatDate(reviewData.approval.approvedAt)
										] }) : null]
									}),
									reviewData.approval?.comments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1.5 text-xs text-emerald-900/90 dark:text-emerald-200/90 italic bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20",
										children: [
											"“",
											reviewData.approval.comments,
											"”"
										]
									}) : null
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-end sm:items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-emerald-500/40 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold uppercase text-[10px] px-2.5 py-1",
									children: "Status: Approved"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/finalize` }),
									className: "h-8 gap-1.5 text-xs font-semibold",
									style: { background: "var(--gradient-brand)" },
									title: "Proceed to Step 8 Payroll Finalization",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proceed to Finalization (Step 8)" })]
								})]
							})]
						})
					}) : null,
					isRejected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "border-rose-500/30 bg-rose-500/10 p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-sm font-semibold text-rose-950 dark:text-rose-200",
										children: "Payroll Run Returned for Correction"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-rose-800/90 dark:text-rose-300/90 mt-0.5",
										children: "This payroll run was sent back by the reviewer. Required adjustments must be processed before re-submitting for approval."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-rose-900/80 dark:text-rose-300/80",
										children: [reviewData.approval?.rejectedByName || reviewData.approval?.rejectedBy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Returned by:" }),
											" ",
											reviewData.approval.rejectedByName || reviewData.approval.rejectedBy
										] }) : null, reviewData.approval?.rejectedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Returned at:" }),
											" ",
											formatDate(reviewData.approval.rejectedAt)
										] }) : null]
									}),
									reviewData.approval?.rejectionReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-xs text-rose-950 dark:text-rose-200",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: "Reason:"
											}),
											" ",
											reviewData.approval.rejectionReason,
											reviewData.approval.comments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 text-[11px] opacity-90",
												children: ["Notes: ", reviewData.approval.comments]
											}) : null
										]
									}) : null
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "destructive",
								className: "font-semibold uppercase text-[10px] px-2.5 py-1",
								children: "Status: Returned"
							})]
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "payroll-summary-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "payroll-summary-heading",
							className: "sr-only",
							children: "Payroll Totals & Summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Employees Processed",
									value: formatCount(reviewData.summary?.employeeCount),
									icon: Users,
									accent: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Gross Payroll",
									value: formatINR(reviewData.summary?.grossPayroll),
									icon: Banknote,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Total Earnings",
									value: formatINR(reviewData.summary?.totalEarnings ?? reviewData.summary?.grossPayroll),
									icon: TrendingUp,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Total Deductions",
									value: formatINR(reviewData.summary?.totalDeductions),
									icon: TrendingDown,
									accent: "warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Net Payroll",
									value: formatINR(reviewData.summary?.netPayroll),
									icon: Banknote,
									accent: "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Employer Cost",
									value: formatINR(reviewData.summary?.employerCost),
									icon: Layers,
									accent: "muted"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 lg:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
									className: "p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-display text-base font-semibold text-foreground",
													children: "Validation Readiness & Rule Audits"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: "Backend validation rule verification prior to approval sign-off."
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-xs font-semibold ${valBadge.className}`,
													children: valBadge.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													size: "sm",
													onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` }),
													className: "h-7 text-xs gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Step 6" })]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl border border-border/60 bg-muted/20 p-3 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-muted-foreground uppercase font-medium",
														children: "Total Issues"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 font-display text-xl font-bold",
														children: reviewData.validation?.totalIssues != null ? formatCount(reviewData.validation.totalIssues) : "0"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl border border-border/60 bg-muted/20 p-3 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-rose-600 dark:text-rose-400 uppercase font-medium",
														children: "Errors"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 font-display text-xl font-bold text-rose-600 dark:text-rose-400",
														children: reviewData.validation?.errorsCount != null ? formatCount(reviewData.validation.errorsCount) : "0"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl border border-border/60 bg-muted/20 p-3 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-amber-600 dark:text-amber-400 uppercase font-medium",
														children: "Warnings"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 font-display text-xl font-bold text-amber-600 dark:text-amber-400",
														children: reviewData.validation?.warningsCount != null ? formatCount(reviewData.validation.warningsCount) : "0"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl border border-border/60 bg-muted/20 p-3 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-muted-foreground uppercase font-medium",
														children: "Affected Emps"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 font-display text-xl font-bold",
														children: reviewData.validation?.affectedEmployeesCount != null ? formatCount(reviewData.validation.affectedEmployeesCount) : "0"
													})]
												})
											]
										}),
										hasBlockingErrors ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
											variant: "destructive",
											className: "mt-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
													className: "text-xs font-bold uppercase tracking-wider",
													children: "Approval Blocked by Backend Engine"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
													className: "mt-1 text-xs leading-relaxed",
													children: [
														"The backend payroll engine reported",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [validationBlockingCount, " blocking error(s)"] }),
														". India statutory compliance and payroll policy mandate that all blocking errors must be resolved in ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Step 6 Validation & Issues" }),
														" before management approval can proceed."
													]
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "No Blocking Errors Detected:" }), " Backend validation passed essential statutory threshold checks (PF, ESI, Section 192 TDS, Professional Tax). This run is ready for authorized approval sign-off."] })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
									className: "p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-base font-semibold text-foreground",
												children: "Employee Payroll Review"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Inspect individual employee line items calculated by the backend."
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` }),
											className: "h-8 text-xs gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Payroll Preview (Step 4)" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground leading-relaxed",
											children: [
												"Reviewers can audit individual employee calculations, attendance metrics, deductions (PF, ESI, PT, TDS), and statutory employer contributions before approving. Individual employee payroll details are inspected in",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Step 5: Employee Payroll Detail" }),
												"."
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-3 pt-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg border border-border/80 bg-muted/30 px-3 py-2 text-xs",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "Processed Employees:"
														}),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "font-semibold text-foreground",
															children: formatCount(reviewData.summary?.employeeCount)
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg border border-border/80 bg-muted/30 px-3 py-2 text-xs",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "Average Net Pay:"
														}),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "font-semibold text-foreground",
															children: reviewData.summary?.employeeCount && reviewData.summary?.netPayroll ? formatINR(Math.round(reviewData.summary.netPayroll / reviewData.summary.employeeCount)) : "—"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` }),
													className: "h-8 text-xs text-primary hover:text-primary/80 gap-1 ml-auto",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Employee Table" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
												})
											]
										})]
									})]
								}),
								reviewData.auditLog && reviewData.auditLog.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
									className: "p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border-b border-border pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-sm font-semibold text-foreground",
											children: "Approval & Governance History"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 space-y-2",
										children: reviewData.auditLog.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/20 p-2.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: entry.action
												}),
												entry.userName || entry.user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground ml-2",
													children: ["by ", entry.userName || entry.user]
												}) : null,
												entry.comment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground mt-0.5 italic",
													children: [
														"“",
														entry.comment,
														"”"
													]
												}) : null
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground font-mono",
												children: formatDate(entry.timestamp)
											})]
										}, idx))
									})]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border-b border-border pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-sm font-semibold text-foreground",
											children: "Review Sign-off Checklist"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: "Prerequisite checkpoints evaluated in real-time from backend calculation results."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 space-y-3",
										children: checklistItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs",
											children: [item.completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold text-foreground flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: item.completed ? "outline" : "secondary",
													className: "text-[9px] px-1.5 py-0 uppercase",
													children: item.completed ? "Passed" : "Action Required"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-0.5 leading-relaxed",
												children: item.description
											})] })]
										}, item.id))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "p-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border-b border-border pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-sm font-semibold text-foreground",
											children: "Approval Governance"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Role Authorization:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: canApprovePayroll ? "Authorized Approver" : "Review Only"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Eligibility:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: canApproveNow ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
													children: isApproved ? "Already Approved" : hasBlockingErrors ? "Blocked by Errors" : isProcessing ? "Processing" : canApproveNow ? "Eligible for Approval" : "Not Eligible"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approval Scope:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-mono",
													children: "Step 7 (Review Sign-off)"
												})]
											})
										]
									}),
									!isApproved && !isFinalized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => setApprovalModalOpen(true),
											disabled: !canApproveNow || isApproving || isRejecting,
											className: "w-full gap-2 text-xs font-semibold",
											style: { background: canApproveNow ? "var(--gradient-brand)" : void 0 },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve Payroll Run" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => setRejectionModalOpen(true),
											disabled: !canRejectNow || isApproving || isRejecting,
											className: "w-full gap-2 text-xs border-rose-500/30 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reject / Send Back" })]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											disabled: true,
											className: "w-full gap-2 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approval Already Completed" })]
										})
									})
								]
							})]
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: approvalModalOpen,
				onOpenChange: setApprovalModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }), "Confirm Payroll Approval"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs",
							children: [
								"Execute formal management sign-off for payroll run",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-mono text-foreground",
									children: runId
								}),
								"."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Period:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: reviewData?.periodName || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employees:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: formatCount(reviewData?.summary?.employeeCount)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Net Payroll:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-emerald-600 dark:text-emerald-400",
												children: formatINR(reviewData?.summary?.netPayroll)
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
									className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
										className: "text-[11px] leading-relaxed ml-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Important:" }),
											" Approval verifies that calculations, deductions, and validations are authorized. It does ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT" }),
											" generate final payslips, lock payroll, or initiate bank transfers."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-medium text-foreground text-xs",
										children: "Reviewer Sign-Off Comments (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Enter any notes, approval rationale, or sign-off references...",
										value: approvalComments,
										onChange: (e) => setApprovalComments(e.target.value),
										rows: 3,
										className: "text-xs resize-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setApprovalModalOpen(false),
								disabled: isApproving,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								size: "sm",
								onClick: handleConfirmApproval,
								disabled: isApproving,
								className: "text-xs gap-1.5",
								style: { background: "var(--gradient-brand)" },
								children: [isApproving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isApproving ? "Approving..." : "Confirm & Approve" })]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: rejectionModalOpen,
				onOpenChange: setRejectionModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base text-rose-600 dark:text-rose-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-4 w-4" }), "Return Payroll for Correction"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs",
							children: [
								"Reject or send back payroll run",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-mono text-foreground",
									children: runId
								}),
								" to payroll administrators."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "font-medium text-foreground text-xs",
									children: ["Rejection Reason ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "e.g. Discrepancy in overtime hours, missing PF adjustment...",
									value: rejectionReason,
									onChange: (e) => setRejectionReason(e.target.value),
									className: "w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-medium text-foreground text-xs",
									children: "Detailed Feedback & Required Adjustments (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "Explain the required corrections or adjustments for the payroll processing team...",
									value: rejectionComments,
									onChange: (e) => setRejectionComments(e.target.value),
									rows: 3,
									className: "text-xs resize-none"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setRejectionModalOpen(false),
								disabled: isRejecting,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "destructive",
								size: "sm",
								onClick: handleConfirmRejection,
								disabled: isRejecting || !rejectionReason.trim(),
								className: "text-xs gap-1.5",
								children: [isRejecting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRejecting ? "Returning..." : "Send Back Payroll" })]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollApprovalPage, PayrollApprovalPage as default };
