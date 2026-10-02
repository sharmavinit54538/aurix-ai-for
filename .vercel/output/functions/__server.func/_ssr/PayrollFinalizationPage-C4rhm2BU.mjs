import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as TrendingDown, E as TrendingUp, Gn as FileCheck, Gt as Lock, J as ShieldAlert, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, an as Layers, di as ArrowLeft, lt as RefreshCw, p as Users, pr as Clock, ri as Banknote, vr as CircleX, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { c as Skeleton, l as StatCard, n as EmptyState, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollFinalizationPage-C4rhm2BU.js
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
function getFinalizationStatusTone(status, isFinalized, isLocked) {
	if (isFinalized || status && String(status).toLowerCase().includes("final")) return {
		tone: "muted",
		label: "Finalized",
		badgeClass: statusBadgeClass("completed")
	};
	if (isLocked || status && String(status).toLowerCase().includes("lock")) return {
		tone: "muted",
		label: "Locked",
		badgeClass: statusBadgeClass("default")
	};
	if (!status) return {
		tone: "muted",
		label: "Unknown",
		badgeClass: statusBadgeClass("default")
	};
	const s = status.toLowerCase().trim();
	if (s === "approved") return {
		tone: "success",
		label: "Approved",
		badgeClass: statusBadgeClass("approved")
	};
	if (s === "rejected" || s.includes("reject")) return {
		tone: "danger",
		label: "Rejected",
		badgeClass: statusBadgeClass("critical")
	};
	if (s.includes("review") || s.includes("approval")) return {
		tone: "info",
		label: status,
		badgeClass: statusBadgeClass("info")
	};
	if (s.includes("provision")) return {
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
function PayrollFinalizationPage() {
	const runId = useParams({ strict: false })?.runId?.trim() || "";
	const navigate = useNavigate();
	useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isPayrollAdmin = useCurrentRole() === "hr_admin";
	const canViewPayroll = isPayrollAdmin || userPermissions.includes("payroll.view") || userPermissions.includes("*");
	const canFinalizePayroll = isPayrollAdmin || userPermissions.includes("payroll.finalize") || userPermissions.includes("payroll.admin") || userPermissions.includes("*");
	const [finalizationData, setFinalizationData] = (0, import_react.useState)(null);
	const [loadingData, setLoadingData] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [isUnavailable, setIsUnavailable] = (0, import_react.useState)(false);
	const [finalizeModalOpen, setFinalizeModalOpen] = (0, import_react.useState)(false);
	const [finalizationNotes, setFinalizationNotes] = (0, import_react.useState)("");
	const [isFinalizing, setIsFinalizing] = (0, import_react.useState)(false);
	const fetchFinalization = (0, import_react.useCallback)(async (showToast = false) => {
		if (!runId) return;
		try {
			setLoadingData(true);
			setApiError(null);
			setIsUnavailable(false);
			setFinalizationData(await payrollApi.getPayrollFinalization(runId));
			if (showToast) toast.success("Payroll finalization status refreshed from backend.");
		} catch (err) {
			const status = err?.response?.status;
			const msg = err?.response?.data?.message || err?.message || "Failed to load payroll finalization data.";
			if (status === 404) {
				setIsUnavailable(true);
				setApiError(`Payroll run "${runId}" was not found on the backend (404). Finalization workflow is currently unavailable for this run identifier.`);
			} else setApiError(msg);
			setFinalizationData(null);
		} finally {
			setLoadingData(false);
			setIsRefreshing(false);
		}
	}, [runId]);
	(0, import_react.useEffect)(() => {
		fetchFinalization();
	}, [fetchFinalization]);
	const handleRefresh = (0, import_react.useCallback)(() => {
		setIsRefreshing(true);
		fetchFinalization(true);
	}, [fetchFinalization]);
	const handleConfirmFinalization = async () => {
		if (!runId || isFinalizing) return;
		try {
			setIsFinalizing(true);
			const res = await payrollApi.finalizePayroll(runId, {
				notes: finalizationNotes.trim() || void 0,
				lock: true
			});
			toast.success(res.message || "Payroll run finalized and locked successfully.");
			setFinalizeModalOpen(false);
			setFinalizationNotes("");
			await fetchFinalization(false);
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Failed to finalize payroll run.";
			toast.error(msg);
		} finally {
			setIsFinalizing(false);
		}
	};
	const statusLower = (finalizationData?.status || "").toLowerCase().trim();
	const isApproved = statusLower === "approved" || (finalizationData?.approval?.status || "").toLowerCase() === "approved" || (finalizationData?.approvalStatus || "").toLowerCase() === "approved";
	const isFinalized = Boolean(finalizationData?.isFinalized) || statusLower === "finalized" || statusLower === "closed";
	const isLocked = Boolean(finalizationData?.isLocked) || statusLower === "locked" || isFinalized;
	const isProcessing = statusLower === "processing";
	const validationErrorsCount = Number(finalizationData?.validation?.errorsCount || 0);
	const validationBlockingCount = finalizationData?.validation?.blockingCount != null ? Number(finalizationData.validation.blockingCount) : validationErrorsCount;
	const hasBlockingErrors = validationBlockingCount > 0;
	const canFinalizeNow = canFinalizePayroll && isApproved && !hasBlockingErrors && !isProcessing && !isFinalized;
	const statusTone = getFinalizationStatusTone(finalizationData?.status, isFinalized, isLocked);
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
			description: "You do not have permission to view payroll finalization. Please contact your system administrator.",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/payroll/runs/${runId}/approval`,
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Review & Approval"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm",
							children: "Finalization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/payslips",
							className: "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
							children: "Final Payslips"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/dashboard/payroll/runs/${runId}/approval`,
					className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Review & Approval" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-foreground",
							children: "Payroll Finalization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "font-mono text-[11px] font-medium border-border/80 bg-muted/30",
							title: `Payroll Run Identifier: ${runId}`,
							children: ["Run: ", runId]
						}),
						!loadingData && finalizationData?.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: `text-xs font-semibold capitalize ${statusTone.badgeClass}`,
							children: [isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-1 h-3 w-3 inline-block" }) : null, statusTone.label]
						}) : null,
						!loadingData && isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `text-xs font-semibold ${statusBadgeClass("approved")}`,
							children: "Approval: Approved"
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [finalizationData?.periodName ? `Execute authoritative finalization and lock calculations for ${finalizationData.periodName}.` : "Execute authoritative finalization and freeze calculation numbers for this payroll run.", finalizationData?.lastUpdatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
							"Updated ",
							formatDate(finalizationData.lastUpdatedAt)
						]
					}) : null]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` }),
						className: "h-9 gap-1.5 text-xs shadow-sm text-foreground hover:bg-muted/60",
						title: "Inspect Step 7 review sign-off",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Review & Approval" })]
					}), !isFinalized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "default",
						size: "sm",
						onClick: () => setFinalizeModalOpen(true),
						disabled: !canFinalizeNow || loadingData || isFinalizing,
						className: "h-9 gap-1.5 text-xs shadow-sm",
						title: !isApproved ? "Payroll must be approved in Step 7 before finalization" : hasBlockingErrors ? "Finalization blocked by validation errors" : isProcessing ? "Calculation is currently processing" : "Finalize and lock this payroll run",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Finalize Payroll" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "default",
						size: "sm",
						onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/payment` }),
						className: "h-9 gap-1.5 text-xs shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Step 9: Payment & Disbursement" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-border bg-muted text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "text-xs font-bold uppercase tracking-wider text-foreground",
						children: "PAYROLL FINALIZATION — CRITICAL GOVERNANCE ACTION"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: [
							"Finalization transitions the payroll run to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Final" }),
							" and freezes all computed salary figures. Once finalized, numbers are locked to prevent inadvertent tampering or modifications.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "PAYMENT IS SEPARATE:" }),
							" Finalization does ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT" }),
							" execute bank transfers, create payment batches, or mark employees as paid. Salary has",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NOT" }),
							" been paid."
						]
					})]
				})]
			}),
			!loadingData && !isUnavailable && !isFinalized && !isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "border-border bg-card p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-destructive shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold text-foreground",
							children: "Approval Required Prior to Finalization"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: [
								"This payroll run has not yet received formal managerial approval. Corporate governance and statutory compliance require that payroll must be formally approved in",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Step 7: Review & Approval" }),
								" before it can be finalized and locked."
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` }),
						className: "gap-1.5 text-xs shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go to Step 7 Approval" })]
					})]
				})
			}) : null,
			!loadingData && (isUnavailable || apiError) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "border-border/80 p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold text-foreground",
						children: isUnavailable ? "Payroll Finalization Data Unavailable" : "Unable to Load Payroll Finalization"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground",
						children: apiError || "The payroll finalization endpoint is currently unavailable on the backend server. Live payroll finalization state will render here once available."
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
			loadingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-6",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-7 w-24" })]
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-48 w-full" })]
				})]
			}) : null,
			!loadingData && !isUnavailable && !apiError && finalizationData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					isFinalized || isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
						className: "border-border bg-card p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-sm font-semibold text-foreground",
										children: "Payroll Finalized & Locked"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "This payroll run is authoritative and frozen. All individual employee salary lines, attendance adjustments, and tax calculations are locked against further modification."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground",
										children: [
											finalizationData.finalization?.finalizedByName || finalizationData.finalization?.finalizedBy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Finalized by:" }),
												" ",
												finalizationData.finalization.finalizedByName || finalizationData.finalization.finalizedBy
											] }) : null,
											finalizationData.finalization?.finalizedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Finalized at:" }),
												" ",
												formatDate(finalizationData.finalization.finalizedAt)
											] }) : null,
											finalizationData.finalization?.referenceNumber ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ref #:" }),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: finalizationData.finalization.referenceNumber
												})
											] }) : null
										]
									}),
									finalizationData.finalization?.finalizationNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1.5 text-xs text-foreground italic bg-muted p-2 rounded-lg border border-border",
										children: [
											"“",
											finalizationData.finalization.finalizationNotes,
											"”"
										]
									}) : null
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: `font-semibold uppercase text-[10px] px-2.5 py-1 ${statusBadgeClass("completed")}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-1 h-3 w-3 inline-block" }), "Locked & Final"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "default",
									onClick: () => navigate({ to: "/dashboard/payroll/payslips" }),
									className: "text-xs gap-1.5",
									style: { background: "var(--gradient-brand)" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Final Payslips (Step 9)" })]
								})]
							})]
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "payroll-readiness-totals",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "payroll-readiness-totals",
							className: "sr-only",
							children: "Payroll Readiness & Final Totals"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Employees",
									value: formatCount(finalizationData.summary?.employeeCount),
									icon: Users,
									accent: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Gross Payroll",
									value: formatINR(finalizationData.summary?.grossPayroll),
									icon: Banknote,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Total Earnings",
									value: formatINR(finalizationData.summary?.totalEarnings ?? finalizationData.summary?.grossPayroll),
									icon: TrendingUp,
									accent: "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Total Deductions",
									value: formatINR(finalizationData.summary?.totalDeductions),
									icon: TrendingDown,
									accent: "warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Net Payroll",
									value: formatINR(finalizationData.summary?.netPayroll),
									icon: Banknote,
									accent: "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Employer Cost",
									value: formatINR(finalizationData.summary?.employerCost),
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-semibold text-foreground",
										children: "Finalization Readiness Check"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Mandatory governance prerequisites evaluated against backend state."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs",
											children: [!isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold text-foreground flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. Payroll Calculation Engine Completed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: !isProcessing ? "outline" : "secondary",
													className: "text-[9px] px-1.5 py-0 uppercase",
													children: !isProcessing ? "Completed" : "In Progress"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: "Provisional salary components, gross earnings, and attendance deductions evaluated."
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs",
											children: [!hasBlockingErrors ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold text-foreground flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. Statutory Validation Free of Blocking Errors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: !hasBlockingErrors ? "outline" : "destructive",
													className: "text-[9px] px-1.5 py-0 uppercase",
													children: !hasBlockingErrors ? "Passed" : "Blocking Errors"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: hasBlockingErrors ? `${validationBlockingCount} blocking error(s) must be remediated in Step 6.` : "Zero blocking errors detected by server compliance rules."
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs",
											children: [isApproved || isFinalized ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-muted-foreground mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold text-foreground flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. Management Review & Approval (Step 7)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: isApproved || isFinalized ? "outline" : "secondary",
													className: "text-[9px] px-1.5 py-0 uppercase",
													children: isApproved || isFinalized ? "Approved" : "Pending Sign-off"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: "Formal authorization executed by an authorized payroll reviewer/admin."
											})] })]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-semibold text-foreground",
										children: "Locked State & Safeguards"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Policy enforcement applied once a payroll run transitions to Final."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-foreground",
												children: "Recalculation Freeze"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-1 leading-relaxed",
												children: "Server prevents triggering new calculation runs or modifying attendance and CTC components for this cycle."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-foreground",
												children: "Authoritative Final Records"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-1 leading-relaxed",
												children: "Finalized net pay and statutory deductions become the permanent records for reporting and downstream banking."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-foreground",
												children: "Separate Payment Lifecycle"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-1 leading-relaxed",
												children: "Disbursement batches, NEFT/RTGS generation, and bank payment confirmations belong to the payment phase (Step 9)."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-foreground",
												children: "Audit Traceability"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-1 leading-relaxed",
												children: "Finalization timestamp and user ID are recorded in backend audit logs for compliance review."
											})]
										})
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "p-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border-b border-border pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-sm font-semibold text-foreground",
											children: "Finalization Execution"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Target Period:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: finalizationData.periodName || "—"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Role Authorization:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: canFinalizePayroll ? "Authorized Administrator" : "View Only"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1 border-b border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Eligibility:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: isFinalized ? "text-primary" : canFinalizeNow ? "text-primary" : "text-muted-foreground",
													children: isFinalized ? "Already Finalized" : !isApproved ? "Approval Required" : hasBlockingErrors ? "Blocked by Errors" : canFinalizeNow ? "Ready to Finalize" : "Not Eligible"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lock Behavior:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-mono",
													children: "Immutable Lock"
												})]
											})
										]
									}),
									!isFinalized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => setFinalizeModalOpen(true),
											disabled: !canFinalizeNow || isFinalizing,
											className: "w-full gap-2 text-xs font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Execute Finalization & Lock" })]
										}), !isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` }),
											className: "w-full gap-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go to Step 7 Approval First" })]
										}) : null]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-muted p-3 text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-primary mx-auto mb-1" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs font-semibold text-foreground",
													children: "Payroll is Final & Locked"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: "Modification actions are disabled."
												})
											]
										})
									})
								]
							})
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: finalizeModalOpen,
				onOpenChange: setFinalizeModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 font-display text-base text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-primary" }), "Confirm Payroll Finalization"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs",
							children: [
								"Permanently finalize and lock payroll run",
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
												children: finalizationData?.periodName || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Employees:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: formatCount(finalizationData?.summary?.employeeCount)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Final Net Payroll:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: formatINR(finalizationData?.summary?.netPayroll)
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
									className: "border-destructive/20 bg-destructive/10 text-destructive py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-destructive shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
										className: "text-[11px] leading-relaxed ml-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Irreversible Operation:" }),
											" After finalization, this payroll run will be locked against recalculation or adjustments.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Note:" }),
											" Payment disbursement is not performed by this action."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-medium text-foreground text-xs",
										children: "Finalization Notes / Audit Reference (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Enter any audit reference, board sign-off number, or finalization notes...",
										value: finalizationNotes,
										onChange: (e) => setFinalizationNotes(e.target.value),
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
								onClick: () => setFinalizeModalOpen(false),
								disabled: isFinalizing,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								size: "sm",
								onClick: handleConfirmFinalization,
								disabled: isFinalizing,
								className: "text-xs gap-1.5",
								style: { background: "var(--gradient-brand)" },
								children: [isFinalizing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isFinalizing ? "Finalizing..." : "Confirm & Finalize" })]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollFinalizationPage, PayrollFinalizationPage as default };
