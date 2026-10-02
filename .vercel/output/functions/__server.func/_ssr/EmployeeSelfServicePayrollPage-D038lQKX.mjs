import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { K as Shield, Ln as FileText, Sr as CircleCheck, Tr as CircleAlert, an as Layers, br as CircleQuestionMark, d as Wallet, er as Download, lt as RefreshCw, pr as Clock, q as ShieldCheck, ri as Banknote } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { a as maskAccountNumber, i as formatINR, n as formatDate } from "./format-8CvzIoFt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeeSelfServicePayrollPage-D038lQKX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Employee Self-Service (ESS) Payroll API Service.
* Ensures strict security: employees can only fetch their own payroll, payslips, and tax declarations.
*/
var essApi = {
	/**
	* Fetch current user's personal payroll summary (strict self-access).
	*/
	async getMyPayrollDashboard() {
		return (await apiInstance.get("/api/v2/payroll/employee/dashboard", { headers: { "Cache-Control": "no-store" } })).data.data;
	},
	/**
	* List personal payslip history for current employee.
	*/
	async getMyPayslips(params) {
		return (await apiInstance.get("/api/v2/payroll/my-payslips", {
			params,
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	/**
	* Fetch personal provisional payslips (if supported by backend).
	*/
	async getMyProvisionSlips() {
		return (await apiInstance.get("/api/v2/payroll/employee/provision-slips", { headers: { "Cache-Control": "no-store" } })).data.data || [];
	},
	/**
	* Download own payslip PDF.
	*/
	async downloadMyPayslip(runId) {
		return (await apiInstance.get(`/api/v2/payroll/my-payslips/${runId}/download`, {
			responseType: "blob",
			headers: { "Cache-Control": "no-store" }
		})).data;
	}
};
function EmployeeSelfServicePayrollPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [data, setData] = (0, import_react.useState)(null);
	const [payslips, setPayslips] = (0, import_react.useState)([]);
	const [payslipsTotal, setPayslipsTotal] = (0, import_react.useState)(0);
	const [payslipsLoading, setPayslipsLoading] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(1);
	const [provisionSlips, setProvisionSlips] = (0, import_react.useState)([]);
	const [provisionLoading, setProvisionLoading] = (0, import_react.useState)(false);
	const [provisionUnavailable, setProvisionUnavailable] = (0, import_react.useState)(false);
	const [downloadingRunId, setDownloadingRunId] = (0, import_react.useState)(null);
	const loadDashboard = async () => {
		setLoading(true);
		setBackendUnavailable(false);
		try {
			setData(await essApi.getMyPayrollDashboard());
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
			else toast.error("Failed to load your payroll details.");
		} finally {
			setLoading(false);
		}
	};
	const loadPayslips = async () => {
		setPayslipsLoading(true);
		try {
			const res = await essApi.getMyPayslips({
				page,
				limit: 10
			});
			setPayslips(res.items || []);
			setPayslipsTotal(res.total || 0);
		} catch (err) {} finally {
			setPayslipsLoading(false);
		}
	};
	const loadProvisionSlips = async () => {
		setProvisionLoading(true);
		setProvisionUnavailable(false);
		try {
			setProvisionSlips(await essApi.getMyProvisionSlips() || []);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) setProvisionUnavailable(true);
		} finally {
			setProvisionLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadDashboard();
		loadPayslips();
		loadProvisionSlips();
	}, [page]);
	const handleDownloadPayslip = async (runId, periodName) => {
		setDownloadingRunId(runId);
		try {
			const blob = await essApi.downloadMyPayslip(runId);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `Payslip_${periodName.replace(/\s+/g, "_")}.pdf`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
			toast.success("Payslip downloaded successfully");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to download payslip PDF");
		} finally {
			setDownloadingRunId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: "My Payroll & Payslips"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "Strict Self-Isolation"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "View your salary statements, download digitally signed payslips, and review your tax declarations."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							loadDashboard();
							loadPayslips();
							loadProvisionSlips();
						},
						disabled: loading,
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }), "Refresh"]
					})
				})]
			}),
			backendUnavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				variant: "destructive",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "Backend Endpoint Pending" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: "The Employee Self-Service API endpoint (`/api/v2/payroll/employee/dashboard`) is not yet deployed on this environment. Refer to `docs/PAYROLL_BACKEND_TODO.md` for the required contract specification." })
				]
			}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent p-5 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/20 text-brand-600 dark:text-brand-300 font-bold text-lg",
							children: data.employeeName?.charAt(0) || "U"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-semibold",
								children: data.employeeName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "font-mono text-xs",
								children: data.employeeCode
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.department || "General" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.designation || "Staff" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-emerald-600 dark:text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), "Authorized Personal Session"]
								})
							]
						})] })]
					}), data.bankDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground font-medium",
							children: "Disbursement Account"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono font-medium",
							children: [
								data.bankDetails.bankName,
								" • ",
								data.bankDetails.accountNumberMasked || maskAccountNumber("1234567890")
							]
						})] })]
					})]
				})
			}),
			data?.ytdSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: `YTD Gross (${data.ytdSummary.financialYear})`,
						value: data.ytdSummary.grossFormatted || formatINR(data.ytdSummary.totalGrossPaise / 100),
						hint: "Gross taxable earnings",
						accent: "brand",
						icon: Wallet
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "YTD Total Deductions",
						value: data.ytdSummary.deductionsFormatted || formatINR(data.ytdSummary.totalDeductionsPaise / 100),
						hint: "PF, PT, TDS & recoveries",
						accent: "warning",
						icon: Layers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "YTD Net Disbursed",
						value: data.ytdSummary.netFormatted || formatINR(data.ytdSummary.totalNetPaise / 100),
						hint: "Total net take-home",
						accent: "success",
						icon: CircleCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "YTD Income Tax (TDS)",
						value: formatINR(data.ytdSummary.totalTdsPaise / 100),
						hint: "Deposited with IT Dept",
						accent: "muted",
						icon: FileText
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "payslips",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "payslips",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), "Payslips & Statements"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "tax",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" }), "Tax & Deductions"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "bank",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4" }), "Disbursement & Bank Details"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "provisional",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }), "Provisional Slips"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "payslips",
						className: "space-y-4",
						children: [data?.latestPayslip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "border-brand-500/20 bg-brand-500/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "border-brand-500/40 text-brand-600 dark:text-brand-300",
												children: "Latest Finalized Payslip"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: ["Paid on ", data.latestPayslip.payDate ? formatDate(data.latestPayslip.payDate) : "—"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-lg font-bold",
											children: data.latestPayslip.periodName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: "Gross: "
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: data.latestPayslip.grossFormatted
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: "Deductions: "
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-rose-500",
													children: data.latestPayslip.deductionsFormatted
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: "Net Pay: "
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-emerald-600 dark:text-emerald-400",
													children: data.latestPayslip.netPayFormatted
												})] })
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => handleDownloadPayslip(data.latestPayslip.runId, data.latestPayslip.periodName),
									disabled: downloadingRunId === data.latestPayslip.runId,
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), downloadingRunId === data.latestPayslip.runId ? "Downloading..." : "Download PDF"]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Payslip History"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "All digitally approved payslips for your account"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto rounded-xl border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Period"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Disbursement Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Gross Earnings"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Net Take-Home"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-center",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Action"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border",
									children: payslipsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 6,
										className: "py-8 text-center text-muted-foreground",
										children: "Loading your payslips..."
									}) }) : payslips.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 6,
										className: "py-8 text-center text-muted-foreground",
										children: "No historical payslips found for your account."
									}) }) : payslips.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-muted/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 font-medium",
												children: p.periodName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-muted-foreground",
												children: p.payDate ? formatDate(p.payDate) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right font-medium",
												children: p.grossAmountFormatted
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400",
												children: p.netPayFormatted
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
													children: p.status || "FINALIZED"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => handleDownloadPayslip(p.runId, p.periodName),
													disabled: downloadingRunId === p.runId,
													className: "gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), downloadingRunId === p.runId ? "..." : "PDF"]
												})
											})
										]
									}, p.id))
								})]
							})
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "tax",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Income Tax & Statutory Declarations"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Authoritative calculations performed by backend payroll engine under Indian Income Tax Act."
							})]
						}), data?.taxOverview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground font-medium uppercase",
											children: "Active Regime"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-bold",
												children: [data.taxOverview.taxRegime, " REGIME"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "border-brand-500/30 text-brand-600 dark:text-brand-300",
												children: "Locked"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: [
												"Regime election for FY ",
												data.ytdSummary?.financialYear || "current",
												"."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground font-medium uppercase",
											children: "Declared Deductions / Exemptions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-2xl font-bold",
											children: formatINR(data.taxOverview.declaredExemptionsPaise / 100)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: "Section 80C, 80D, HRA & Chapter VI-A investments."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground font-medium uppercase",
											children: "Projected Annual Tax"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-2xl font-bold",
											children: data.taxOverview.annualTaxFormatted || formatINR(data.taxOverview.projectedAnnualTaxPaise / 100)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: "Total computed tax liability for current financial year."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground font-medium uppercase",
											children: "TDS Deducted So Far"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400",
											children: data.taxOverview.taxDeductedFormatted || formatINR(data.taxOverview.taxDeductedSoFarPaise / 100)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: "Deposited with NSDL under Form 24Q."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground font-medium uppercase",
											children: "Remaining Projected Tax"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400",
											children: formatINR(data.taxOverview.remainingTaxPaise / 100)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: "To be amortized over remaining payroll periods."
										})
									]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-muted-foreground",
							children: "No active tax declarations found."
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "bank",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Disbursement Bank Account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "The authenticated bank account designated for your direct salary transfers."
							})]
						}), data?.bankDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-xl space-y-4 rounded-xl border border-border bg-card/30 p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Account Holder Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-semibold",
										children: data.bankDetails.accountHolderName
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Bank Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-semibold",
										children: data.bankDetails.bankName
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Account Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono font-semibold",
										children: data.bankDetails.accountNumberMasked || maskAccountNumber("1234567890")
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "IFSC Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono font-semibold",
										children: data.bankDetails.ifscCode
									})] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), "Security & Compliance Notice"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: "To prevent payroll diversion attacks, bank account modifications require a verified cancelled cheque submission and HR maker-checker validation."
								})]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-muted-foreground",
							children: "No disbursement account configured."
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "provisional",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Provisional Salary Slips"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Advance draft slips prior to finalization or for visa / loan application requirements."
							})]
						}), provisionUnavailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-medium text-sm",
									children: "Feature Unavailable on Backend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground max-w-md mx-auto",
									children: "Provisional salary slips are not supported by the current backend environment. This requirement is tracked in `docs/PAYROLL_BACKEND_TODO.md`."
								})
							]
						}) : provisionLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-muted-foreground",
							children: "Loading provisional slips..."
						}) : provisionSlips.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-muted-foreground",
							children: "No active provisional salary slips issued."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto rounded-xl border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Period"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Generated At"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Provisional Gross"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Provisional Net"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-center",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border",
									children: provisionSlips.map((ps) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-muted/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 font-medium",
												children: ps.periodName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-muted-foreground",
												children: formatDate(ps.generatedAt)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right font-medium",
												children: ps.provisionalGrossFormatted
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400",
												children: ps.provisionalNetFormatted
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "capitalize",
													children: ps.status.replace(/_/g, " ")
												})
											})
										]
									}, ps.provisionId))
								})]
							})
						})] })
					})
				]
			})
		]
	});
}
//#endregion
export { EmployeeSelfServicePayrollPage as default };
