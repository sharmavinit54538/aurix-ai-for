import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Gn as FileCheck, Gt as Lock, Ln as FileText, Xn as ExternalLink, er as Download, lt as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as selectUserPermissions } from "./sidebarSelectors-Crjhx3nM.mjs";
import { c as Skeleton, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollPayslipsHubPage-BQL9JPsS.js
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
function PayrollPayslipsHubPage() {
	const navigate = useNavigate();
	const ws = useAurix();
	useAppSelector(selectUserPermissions);
	const isHr = useCurrentRole() === "hr_admin";
	const currentUserId = ws.user?.id || ws.user?.employeeId || "";
	const [payslips, setPayslips] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [downloadingId, setDownloadingId] = (0, import_react.useState)(null);
	const [apiError, setApiError] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const fetchPayslips = (0, import_react.useCallback)(async () => {
		setIsLoading(true);
		setApiError(null);
		try {
			if (isHr) setPayslips((await payrollApi.getMyPayslips())?.items || []);
			else if (currentUserId) setPayslips((await payrollApi.getEmployeePayslipHistory(currentUserId))?.items || []);
			else setPayslips((await payrollApi.getMyPayslips())?.items || []);
		} catch (err) {
			if (err?.response?.status === 404) setPayslips([]);
			else {
				setApiError(err?.response?.data?.message || err?.message || "Unable to load payslips from backend.");
				setPayslips([]);
			}
		} finally {
			setIsLoading(false);
		}
	}, [isHr, currentUserId]);
	(0, import_react.useEffect)(() => {
		fetchPayslips();
	}, [fetchPayslips]);
	const handleRefresh = async () => {
		setIsRefreshing(true);
		await fetchPayslips();
		setIsRefreshing(false);
	};
	const handleDownload = async (item) => {
		if (!item.runId || !item.employeeId) {
			toast.info("Run or Employee identifier not provided for document download.");
			return;
		}
		setDownloadingId(item.id);
		try {
			const blob = await payrollApi.downloadPayslip(item.runId, item.employeeId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `payslip_${item.employeeId}_${item.periodName || item.runId}.pdf`.replace(/\s+/g, "_").toLowerCase();
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			toast.success("Payslip downloaded successfully.");
		} catch (err) {
			if (err?.response?.status === 404) toast.info("Backend PDF download endpoint is unavailable. Click 'View' to see and print your official statement.");
			else toast.error("Failed to download payslip from backend.");
		} finally {
			setDownloadingId(null);
		}
	};
	const filteredPayslips = payslips.filter((p) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase();
		return p.periodName && p.periodName.toLowerCase().includes(q) || p.payslipNumber && p.payslipNumber.toLowerCase().includes(q) || p.runId && p.runId.toLowerCase().includes(q) || p.employeeName && p.employeeName.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "hover:text-foreground transition-colors font-medium",
							children: "Dashboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-semibold",
							children: "My Payslips"
						})
					]
				}), isHr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/payroll",
					className: "hover:text-foreground transition-colors font-medium flex items-center gap-1 text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go to Payroll Management" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight",
						children: "Payslips & Salary Statements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-primary/30 bg-primary/10 text-primary text-xs font-semibold",
						children: "Self-Service Portal"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Access and download your official finalized salary payslips generated by the OFC360 Payroll Engine."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by period, slip number, or run...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						className: "pl-9 text-xs h-9"
					})]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-28" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-24" })]
						})]
					})
				}, i))
			}) : null,
			!isLoading && apiError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-8 text-center border-border/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "Unable to Retrieve Payslip History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-md mx-auto",
						children: apiError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: handleRefresh,
						disabled: isRefreshing,
						className: "mt-4 text-xs gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retry Connection" })]
					})
				]
			}) : null,
			!isLoading && !apiError && filteredPayslips.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-10 text-center border-border/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-display font-semibold text-foreground",
						children: "No Final Payslips Available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed",
						children: searchQuery ? `No payslip records matching "${searchQuery}".` : "Official final payslips will appear here once monthly payroll runs have been formally approved and finalized by your HR payroll team."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center justify-center gap-3",
						children: [searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setSearchQuery(""),
							className: "text-xs",
							children: "Clear Search"
						}) : null, isHr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "default",
							onClick: () => navigate({ to: "/dashboard/payroll" }),
							className: "text-xs gap-1.5",
							style: { background: "var(--gradient-brand)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go to Payroll Finalization" })]
						}) : null]
					})
				]
			}) : null,
			!isLoading && !apiError && filteredPayslips.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: filteredPayslips.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: item.periodName || "Payroll Cycle"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-2.5 w-2.5 mr-1 inline-block" }), "Finalized"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1",
							children: [
								item.payslipNumber ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Ref:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono text-foreground",
										children: item.payslipNumber
									})
								] }) : null,
								item.finalizedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Finalized on ", formatDate(item.finalizedAt)] }) : null,
								item.paymentDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Paid on ", formatDate(item.paymentDate)] }) : null
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left sm:text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground uppercase font-semibold",
								children: "Net Pay"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base font-display font-bold text-emerald-600 dark:text-emerald-400",
								children: formatINR(item.netPay)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [item.runId && item.employeeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => navigate({ to: `/dashboard/payroll/runs/${item.runId}/employees/${item.employeeId}/payslip` }),
								className: "text-xs gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View" })]
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => handleDownload(item),
								disabled: downloadingId === item.id,
								className: "text-xs gap-1.5",
								children: [downloadingId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "PDF"
								})]
							})]
						})]
					})]
				}, item.id))
			}) : null
		]
	});
}
//#endregion
export { PayrollPayslipsHubPage, PayrollPayslipsHubPage as default };
