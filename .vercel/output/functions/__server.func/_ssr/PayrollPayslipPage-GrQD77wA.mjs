import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, D as TrendingDown, E as TrendingUp, Gt as Lock, J as ShieldAlert, K as Shield, Ln as FileText, Tr as CircleAlert, di as ArrowLeft, er as Download, ft as Printer, h as User, lt as RefreshCw, mn as History } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { c as Skeleton, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollPayslipPage-GrQD77wA.js
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
			year: "numeric"
		});
	} catch {
		return String(val);
	}
}
function formatDateTime(val) {
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
function maskAccountNumber(acc) {
	if (!acc) return "—";
	const str = String(acc).trim();
	if (str.length <= 4) return str;
	return `••••••••${str.slice(-4)}`;
}
function maskIdentifier(val) {
	if (!val) return "—";
	const str = String(val).trim();
	if (str.length <= 4) return str;
	return `${str.slice(0, 2)}••••••${str.slice(-2)}`;
}
function PayrollPayslipPage() {
	const params = useParams({ strict: false });
	const runId = params?.runId?.trim() || "";
	const employeeId = params?.employeeId?.trim() || "";
	const navigate = useNavigate();
	const ws = useAurix();
	const userPermissions = useAppSelector(selectUserPermissions);
	const isHr = useCurrentRole() === "hr_admin";
	const currentUserId = ws.user?.id || ws.user?.employeeId || "";
	const isSelf = Boolean(currentUserId && (currentUserId === employeeId || ws.user?.employee_id === employeeId || ws.user?.empId === employeeId));
	const canViewThisPayslip = isHr || userPermissions.includes("payroll.view") || userPermissions.includes("payroll.admin") || userPermissions.includes("*") || isSelf;
	const [payslipData, setPayslipData] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [isDownloading, setIsDownloading] = (0, import_react.useState)(false);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [isNotFound, setIsNotFound] = (0, import_react.useState)(false);
	const fetchPayslip = (0, import_react.useCallback)(async () => {
		if (!runId || !employeeId) {
			setIsLoading(false);
			setIsNotFound(true);
			return;
		}
		setIsLoading(true);
		setApiError(null);
		setIsNotFound(false);
		try {
			const data = await payrollApi.getPayslip(runId, employeeId);
			if (!data) {
				setIsNotFound(true);
				setPayslipData(null);
			} else setPayslipData(data);
		} catch (err) {
			const status = err?.response?.status;
			if (status === 404) {
				setIsNotFound(true);
				setApiError("Final payslip record was not found on the backend for this run and employee (404 Not Found).");
			} else if (status === 401 || status === 403) setApiError("You are not authorized to view this employee's payslip.");
			else setApiError(err?.response?.data?.message || err?.message || "Unable to load payslip data from the server.");
			setPayslipData(null);
		} finally {
			setIsLoading(false);
		}
	}, [runId, employeeId]);
	(0, import_react.useEffect)(() => {
		fetchPayslip();
	}, [fetchPayslip]);
	const handleRefresh = async () => {
		setIsRefreshing(true);
		await fetchPayslip();
		setIsRefreshing(false);
	};
	const handlePrint = () => {
		window.print();
	};
	const handleDownloadDocument = async () => {
		if (!runId || !employeeId || isDownloading) return;
		setIsDownloading(true);
		try {
			const blob = await payrollApi.downloadPayslip(runId, employeeId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `payslip_${employeeId}_${payslipData?.periodName || runId}.pdf`.replace(/\s+/g, "_").toLowerCase();
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			toast.success("Payslip document downloaded successfully.");
		} catch (err) {
			if (err?.response?.status === 404) toast.info("Backend payslip PDF file endpoint is not available yet. Using the Print action generates a clean official PDF statement.", { duration: 5e3 });
			else {
				const msg = err?.response?.data?.message || err?.message || "Failed to download payslip from backend.";
				toast.error(msg);
			}
		} finally {
			setIsDownloading(false);
		}
	};
	const isFinalized = Boolean(payslipData?.isFinalized || String(payslipData?.status).toLowerCase() === "finalized" || String(payslipData?.status).toLowerCase() === "closed" || String(payslipData?.status).toLowerCase() === "locked");
	if (ws.isRestoring) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 py-6 max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64 rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full rounded-2xl" })
		]
	});
	if (!canViewThisPayslip) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-4xl mx-auto py-12 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			className: "p-8 text-center border-rose-500/30 bg-rose-500/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-12 w-12 text-rose-500 mx-auto mb-4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-display font-semibold text-foreground",
					children: "Access Denied"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-2 max-w-md mx-auto",
					children: "You do not have permission to view this employee's payslip. Employees may only view their own payslips, and HR administrators require appropriate payroll permissions."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => navigate({ to: "/dashboard/payroll/payslips" }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-2" }), "My Payslips"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => navigate({ to: "/dashboard" }),
						children: "Go to Dashboard"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 py-6 max-w-5xl mx-auto px-4 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, nav, aside, footer, .no-print, .print\\:hidden {
            display: none !important;
          }
          .payslip-print-sheet {
            border: 1px solid #000000 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px !important;
            margin: 0 !important;
            max-width: 100% !important;
            font-size: 11pt !important;
          }
          .payslip-print-sheet table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          .payslip-print-sheet th, .payslip-print-sheet td {
            border: 1px solid #cccccc !important;
            padding: 6px 8px !important;
            color: #000000 !important;
          }
          .payslip-print-sheet .bg-muted,
          .payslip-print-sheet .bg-muted\\/30,
          .payslip-print-sheet .bg-background\\/50 {
            background: #f9f9f9 !important;
          }
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 text-xs text-muted-foreground print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll",
							className: "hover:text-foreground transition-colors font-medium",
							children: "Payroll Hub"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
						runId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/payroll/runs/$runId/finalize",
							params: { runId },
							className: "hover:text-foreground transition-colors font-medium font-mono",
							children: ["Run ", runId]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" })] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-semibold",
							children: "Final Payslip"
						})
					]
				}), runId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden lg:flex items-center gap-1.5 text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/periods",
							className: "px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors",
							children: "Step 2: Periods"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-border",
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/runs/$runId/processing",
							params: { runId },
							className: "px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors",
							children: "Step 3: Process"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-border",
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/runs/$runId/preview",
							params: { runId },
							className: "px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors",
							children: "Step 4: Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-border",
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/runs/$runId/validation",
							params: { runId },
							className: "px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors",
							children: "Step 6: Validation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-border",
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/runs/$runId/approval",
							params: { runId },
							className: "px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors",
							children: "Step 7: Approval"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-border",
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/payroll/runs/$runId/finalize",
							params: { runId },
							className: "px-2 py-0.5 rounded-md hover:bg-muted/60 transition-colors",
							children: "Step 8: Finalize"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-border",
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold",
							children: "Step 9: Payslip"
						})
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							if (runId) navigate({ to: `/dashboard/payroll/runs/${runId}/finalize` });
							else navigate({ to: "/dashboard/payroll/payslips" });
						},
						className: "h-9 w-9 p-0",
						title: "Go Back",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight",
							children: "Final Payslip"
						}), isFinalized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 mr-1 inline-block" }), "Finalized"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold",
							children: payslipData?.status || "Unfinalized"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: [
							"Official salary statement for",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: payslipData?.employee?.name || employeeId
							}),
							" ",
							"· ",
							payslipData?.periodName || runId || "Current Period"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handlePrint,
						disabled: isLoading || !payslipData,
						className: "text-xs gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print Payslip" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "default",
						size: "sm",
						onClick: handleDownloadDocument,
						disabled: isLoading || !payslipData || isDownloading,
						className: "text-xs gap-1.5",
						style: { background: "var(--gradient-brand)" },
						children: [isDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDownloading ? "Downloading..." : "Download PDF" })]
					})]
				})]
			}),
			!isLoading && payslipData && !isFinalized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "font-semibold text-sm",
						children: "Final Payslip Not Available (Payroll Unfinalized)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "text-xs mt-1 leading-relaxed",
						children: [
							"Final payslips are official documents issued ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "only for finalized payroll records" }),
							". This payroll run is currently in status",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] mx-1",
								children: payslipData.status || "Not Finalized"
							}),
							". To generate and access authoritative final payslips, an authorized administrator must first complete Step 8 (Payroll Finalization).",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/finalize` }),
									className: "text-xs gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go to Step 8: Payroll Finalization" })]
								})
							})
						]
					})
				]
			}) : null,
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-64" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-4 w-96" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4",
							children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-28" })]
							}, i))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-32 mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-32 mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" })]
					})]
				})]
			}) : null,
			!isLoading && (isNotFound || apiError) && !payslipData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-8 text-center border-border/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-display font-semibold text-foreground",
						children: "Payslip Record Unavailable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1.5 max-w-md mx-auto",
						children: apiError || "The requested employee payslip was not found on the backend. This occurs when the run has not completed processing or the employee was not included."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: handleRefresh,
							disabled: isRefreshing,
							className: "gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retry Connection" })]
						}), runId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/finalize` }),
							className: "gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Finalization" })]
						}) : null]
					})
				]
			}) : null,
			!isLoading && payslipData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "payslip-print-sheet rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8 space-y-6 print:border-black print:p-6 print:shadow-none print:bg-white print:text-black",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border/80 pb-6 print:border-black",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row justify-between items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm",
									children: "OFC"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-display font-bold text-foreground tracking-tight",
									children: "OFC360 HRMS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Enterprise India Payroll Automation System"
								})] })]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left sm:text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-block px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold text-xs uppercase tracking-wider mb-1",
										children: "FINAL PAYSLIP"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-mono text-muted-foreground",
										children: [
											"Ref:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: payslipData.payslipNumber || payslipData.referenceNumber || payslipData.id
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											"Status:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: payslipData.status
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-dashed border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Payroll Period:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: payslipData.periodName || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Financial Year:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: payslipData.financialYear || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Pay Cycle Dates:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-foreground",
									children: [
										formatDate(payslipData.startDate),
										" – ",
										formatDate(payslipData.endDate)
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Finalized On:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: formatDateTime(payslipData.finalizedAt)
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/80 bg-muted/20 p-4 print:border-black print:bg-transparent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-primary print:hidden" }), "Employee Information"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Employee Name:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: payslipData.employee.name
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Employee ID:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: payslipData.employee.id
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Department:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: payslipData.employee.department || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Designation:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: payslipData.employee.designation || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Work Location:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: payslipData.employee.location || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Date of Joining:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: formatDate(payslipData.employee.joiningDate)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "PAN (Masked):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: maskIdentifier(payslipData.employee.pan)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "UAN (Masked):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: maskIdentifier(payslipData.employee.uan)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "PF Account Number:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: payslipData.employee.pfNumber || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "ESI Number:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: payslipData.employee.esiNumber || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Bank Name:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: payslipData.employee.bankInfo?.bankName || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Account Number (Masked):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: maskAccountNumber(payslipData.employee.bankInfo?.accountNumber)
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/80 bg-muted/10 p-3 print:border-black",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-primary print:hidden" }), "Attendance & Payroll Inputs"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Working Days"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground text-sm",
										children: formatCount(payslipData.attendance.workingDays)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Paid Days"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground text-sm text-emerald-600 dark:text-emerald-400 print:text-black",
										children: formatCount(payslipData.attendance.paidDays)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Present"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: formatCount(payslipData.attendance.presentDays)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Leaves"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: formatCount(payslipData.attendance.leaveDays)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Loss of Pay (LOP)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-rose-600 dark:text-rose-400 print:text-black",
										children: formatCount(payslipData.attendance.lopDays)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Holidays"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: formatCount(payslipData.attendance.holidays)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Weekly Offs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: formatCount(payslipData.attendance.weeklyOffs)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-background/50 border border-border/50 print:border-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: "Overtime (Hrs)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold",
										children: formatCount(payslipData.attendance.overtimeHours)
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border/80 rounded-xl overflow-hidden print:border-black",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-2.5 border-b border-border/80 flex items-center justify-between print:bg-gray-100 print:border-black",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 print:text-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 print:hidden" }), "Earnings"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-emerald-700 dark:text-emerald-400 print:text-black",
									children: "Authoritative (INR)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y divide-border/60 print:divide-black",
									children: [
										payslipData.earnings.basic != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Basic Salary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.basic)
										})] }) : null,
										payslipData.earnings.hra != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "House Rent Allowance (HRA)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.hra)
										})] }) : null,
										payslipData.earnings.conveyance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Conveyance Allowance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.conveyance)
										})] }) : null,
										payslipData.earnings.specialAllowance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Special Allowance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.specialAllowance)
										})] }) : null,
										payslipData.earnings.medicalAllowance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Medical Allowance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.medicalAllowance)
										})] }) : null,
										payslipData.earnings.otherAllowances != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Other Allowances"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.otherAllowances)
										})] }) : null,
										payslipData.earnings.overtime != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Overtime Pay"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.overtime)
										})] }) : null,
										payslipData.earnings.bonus != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Bonus / Ex-gratia"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.bonus)
										})] }) : null,
										payslipData.earnings.incentives != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Incentives / Variable"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.incentives)
										})] }) : null,
										payslipData.earnings.arrears != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Salary Arrears"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.arrears)
										})] }) : null,
										payslipData.earnings.reimbursements != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Reimbursements"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.reimbursements)
										})] }) : null,
										payslipData.earnings.otherEarnings != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Other Earnings"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.earnings.otherEarnings)
										})] }) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
									className: "bg-muted/40 font-semibold border-t-2 border-border print:bg-gray-100 print:border-black",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2.5 text-foreground",
										children: "Gross Earnings"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2.5 text-right font-mono text-emerald-700 dark:text-emerald-400 print:text-black",
										children: formatINR(payslipData.earnings.grossEarnings)
									})] })
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border/80 rounded-xl overflow-hidden print:border-black",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-rose-500/10 dark:bg-rose-500/20 px-4 py-2.5 border-b border-border/80 flex items-center justify-between print:bg-gray-100 print:border-black",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5 print:text-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5 print:hidden" }), "Deductions"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-rose-700 dark:text-rose-400 print:text-black",
									children: "Authoritative (INR)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y divide-border/60 print:divide-black",
									children: [
										payslipData.deductions.pf != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Provident Fund (Employee EPF)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.deductions.pf)
										})] }) : null,
										payslipData.deductions.esi != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Employee State Insurance (ESI)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.deductions.esi)
										})] }) : null,
										payslipData.deductions.pt != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Professional Tax (PT)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.deductions.pt)
										})] }) : null,
										payslipData.deductions.tds != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Tax Deducted at Source (TDS / Income Tax)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.deductions.tds)
										})] }) : null,
										payslipData.deductions.loan != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Loan Repayment"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.deductions.loan)
										})] }) : null,
										payslipData.deductions.advance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Salary Advance Recovery"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.deductions.advance)
										})] }) : null,
										payslipData.deductions.otherDeductions != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: "Other Deductions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right font-mono font-medium text-foreground",
											children: formatINR(payslipData.deductions.otherDeductions)
										})] }) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
									className: "bg-muted/40 font-semibold border-t-2 border-border print:bg-gray-100 print:border-black",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2.5 text-foreground",
										children: "Total Deductions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2.5 text-right font-mono text-rose-700 dark:text-rose-400 print:text-black",
										children: formatINR(payslipData.deductions.totalDeductions)
									})] })
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border-2 border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 print:border-black print:bg-gray-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-wider text-muted-foreground block font-semibold",
								children: "Final Net Salary Disbursable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl sm:text-3xl font-display font-bold text-foreground",
								children: formatINR(payslipData.netPay)
							}),
							payslipData.netPayInWords ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-0.5 capitalize italic",
								children: ["In words: ", payslipData.netPayInWords]
							}) : null
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left sm:text-right text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"Gross:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono text-foreground",
										children: formatINR(payslipData.earnings.grossEarnings)
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"Total Deductions:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono text-rose-600 dark:text-rose-400 print:text-black",
										children: formatINR(payslipData.deductions.totalDeductions)
									})
								] }),
								payslipData.paymentDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[11px] font-medium text-foreground",
									children: ["Scheduled Credit Date: ", formatDate(payslipData.paymentDate)]
								}) : null
							]
						})]
					}),
					payslipData.employerContributions || payslipData.statutory ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/80 bg-muted/10 p-4 print:border-black",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5 text-primary print:hidden" }), "Employer Statutory Contributions (Not Deducted From Pay)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Employer PF Contribution:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.employerContributions?.pf ?? payslipData.statutory?.employerPf)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Employer ESI Contribution:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.employerContributions?.esi ?? payslipData.statutory?.employerEsi)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "Pension Scheme (EPS):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.employerContributions?.eps ?? payslipData.statutory?.eps)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "EDLI Contribution:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.employerContributions?.edli ?? payslipData.statutory?.edli)
								})] })
							]
						})]
					}) : null,
					payslipData.ytd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/80 bg-muted/10 p-4 print:border-black",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5 text-primary print:hidden" }), "Year-to-Date (YTD) Summary"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "YTD Gross Earnings:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.ytd.grossEarnings)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "YTD Taxable Income:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.ytd.taxableIncome)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "YTD TDS Deducted:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.ytd.tds)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[11px]",
									children: "YTD Net Salary:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-foreground",
									children: formatINR(payslipData.ytd.netPay)
								})] })
							]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-border/80 text-[11px] text-muted-foreground space-y-1 print:border-black",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "* This is a computer-generated official final payslip issued by OFC360 Payroll Engine and requires no signature." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "* Note: Payslip generation seals payroll calculations. Actual salary disbursement is handled during the separate Payment Batch phase." }),
							payslipData.finalizedByName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Authorized & Finalized by: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: payslipData.finalizedByName })] }) : null
						]
					})
				]
			}) : null
		]
	});
}
//#endregion
export { PayrollPayslipPage, PayrollPayslipPage as default };
