import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Gn as FileCheck, Kr as Building, Tr as CircleAlert, er as Download, it as Scale, lt as RefreshCw, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { i as formatINR, t as formatCount } from "./format-8CvzIoFt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatutoryCompliancePage-BCVS5KL-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Statutory Compliance API Service (India Context).
*
* All rates, ceilings, state PT slabs, and tax computations are authoritative backend responses.
*/
var statutoryApi = {
	/**
	* Fetch government statutory configuration rules from backend.
	*/
	async getStatutoryConfig() {
		return (await apiInstance.get("/api/v2/payroll/statutory/config", { headers: { "Cache-Control": "no-store" } })).data.data;
	},
	/**
	* Fetch statutory deduction summary for a payroll period.
	*/
	async getStatutorySummary(periodId, component) {
		return (await apiInstance.get("/api/v2/payroll/statutory/summary", {
			params: {
				periodId,
				component
			},
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	/**
	* Request backend generation of official statutory filing reports (e.g. PF ECR text file, ESI return).
	*/
	async requestStatutoryReport(component, periodId, format) {
		return (await apiInstance.post(`/api/v2/payroll/statutory/reports/${component}`, {
			periodId,
			format
		}, {
			responseType: "blob",
			headers: { "Cache-Control": "no-store" }
		})).data;
	}
};
function StatutoryCompliancePage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [config, setConfig] = (0, import_react.useState)(null);
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [downloadingReport, setDownloadingReport] = (0, import_react.useState)(null);
	const loadData = async () => {
		setLoading(true);
		setBackendUnavailable(false);
		try {
			const [cfgRes, sumRes] = await Promise.all([statutoryApi.getStatutoryConfig().catch((err) => {
				if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
				return null;
			}), statutoryApi.getStatutorySummary().catch((err) => {
				if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
				return null;
			})]);
			setConfig(cfgRes);
			setSummary(sumRes);
		} catch {
			toast.error("Failed to load statutory compliance data");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleDownloadReport = async (comp, format) => {
		setDownloadingReport(comp);
		try {
			const blob = await statutoryApi.requestStatutoryReport(comp, "current", format);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${comp}_RETURN_REPORT.${format}`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			toast.success(`${comp} return report downloaded.`);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) {
				setBackendUnavailable(true);
				toast.error("Statutory return service unavailable — backend pending");
			} else toast.error(`Failed to download ${comp} report`);
		} finally {
			setDownloadingReport(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight text-foreground",
						children: "Statutory Compliance & Government Returns"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary",
						children: "India Regulatory"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Authoritative computation of PF, ESI, Professional Tax, and TDS returns. Backend is authoritative for rates and slabs."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: loadData,
						disabled: loading,
						className: "h-8 gap-1.5 text-xs rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					})
				})]
			}),
			backendUnavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "font-semibold text-sm",
						children: "Feature unavailable — backend pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "text-xs mt-1 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Statutory Compliance API endpoints (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/api/v2/payroll/statutory/*" }),
							") are awaiting backend deployment. Regulatory rule models and ECR return export pipelines are ready."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] opacity-80",
							children: [
								"Contract reference: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_CONTRACT.md" }),
								" • Requirements: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_TODO.md" })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Provident Fund (PF)",
						value: summary?.pfTotals?.formattedTotal || "—",
						hint: summary ? `${summary.pfTotals.eligibleCount} employees covered` : "Authoritative backend calculation",
						icon: Building,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Employee State Insurance (ESI)",
						value: summary?.esiTotals?.formattedTotal || "—",
						hint: summary ? `${summary.esiTotals.eligibleCount} employees covered` : "Authoritative backend calculation",
						icon: ShieldCheck,
						accent: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Professional Tax (PT)",
						value: summary?.ptTotals?.formattedTotal || "—",
						hint: summary ? `${summary.ptTotals.coveredCount} employees covered` : "State slab jurisdiction",
						icon: Scale,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Income Tax / TDS",
						value: summary?.tdsTotals?.formattedTotal || "—",
						hint: summary ? `${summary.tdsTotals.deductedCount} employees deducted` : "Regime & slab calculations",
						icon: FileCheck,
						accent: "muted"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Statutory Authority & Compliance Policy" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-[11px] leading-relaxed",
					children: "Statutory contribution formulas, wage ceilings, state slabs, and income tax exemptions are strictly executed on the server. The frontend does not duplicate or hardcode government rules."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: (val) => setActiveTab(val),
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted/50 p-1 rounded-2xl border border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "overview",
								className: "rounded-xl text-xs",
								children: "Employee Contributions Overview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "pf",
								className: "rounded-xl text-xs",
								children: "Provident Fund (PF)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "esi",
								className: "rounded-xl text-xs",
								children: "Employee State Insurance (ESI)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "pt",
								className: "rounded-xl text-xs",
								children: "Professional Tax (PT)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "tds",
								className: "rounded-xl text-xs",
								children: "Income Tax / TDS"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "overview",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "overflow-hidden p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Employee"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 font-mono",
												children: "UAN (PF)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 font-mono text-right",
												children: "PF Deduction"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 font-mono",
												children: "IP Number (ESI)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 font-mono text-right",
												children: "ESI Deduction"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "PT State"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 font-mono text-right",
												children: "PT Amount"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Regime"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 font-mono text-right",
												children: "Monthly TDS"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/60",
										children: !summary || summary.records.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											colSpan: 9,
											className: "px-4 py-12 text-center text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground text-sm",
													children: "No Statutory Records Available"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mt-0.5",
													children: backendUnavailable ? "Statutory summary endpoint pending backend deployment." : "Run payroll calculation to generate official statutory withholdings."
												})
											]
										}) }) : summary.records.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-foreground",
														children: r.employeeName
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-muted-foreground font-mono",
														children: r.employeeCode
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-muted-foreground",
													children: r.pfUan || "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-right font-semibold text-foreground",
													children: formatINR(r.employeePfPaise / 100)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-muted-foreground",
													children: r.esiIpNumber || "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-right font-semibold text-foreground",
													children: formatINR(r.employeeEsiPaise / 100)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: r.ptState
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-right font-semibold text-foreground",
													children: formatINR(r.ptAmountPaise / 100)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-[10px]",
														children: r.taxRegime
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-right font-semibold text-emerald-600 dark:text-emerald-400",
													children: formatINR(r.monthlyTdsPaise / 100)
												})
											]
										}, r.employeeId))
									})]
								})
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "pf",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: "Employees' Provident Fund (EPF & EPS)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Statutory rates: Employee contribution (12%), Employer EPF (3.67%), Employer EPS (8.33%)."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => handleDownloadReport("PF", "txt"),
									disabled: Boolean(downloadingReport),
									className: "h-8 gap-1.5 text-xs rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download ECR Return (.txt)" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Covered Employees"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-foreground mt-1",
											children: formatCount(summary?.pfTotals?.eligibleCount || 0)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Total Contributory Wages"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-foreground mt-1",
											children: formatINR((summary?.pfTotals?.totalWagesPaise || 0) / 100)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employee PF (12%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1",
											children: formatINR((summary?.pfTotals?.totalEmployeePfPaise || 0) / 100)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employer Share (12%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-primary mt-1",
											children: formatINR((summary?.pfTotals?.totalEmployerPfPaise || 0) / 100)
										})]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "esi",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: "Employee State Insurance (ESIC)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Coverage for employees earning up to ₹21,000/month gross: Employee (0.75%), Employer (3.25%)."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => handleDownloadReport("ESI", "csv"),
									disabled: Boolean(downloadingReport),
									className: "h-8 gap-1.5 text-xs rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download ESI Monthly Filing" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Covered Employees"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-foreground mt-1",
											children: formatCount(summary?.esiTotals?.eligibleCount || 0)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Gross Insurable Wages"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-foreground mt-1",
											children: formatINR((summary?.esiTotals?.totalWagesPaise || 0) / 100)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employee Share (0.75%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1",
											children: formatINR((summary?.esiTotals?.totalEmployeeEsiPaise || 0) / 100)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl border border-border/60 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employer Share (3.25%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono font-semibold text-primary mt-1",
											children: formatINR((summary?.esiTotals?.totalEmployerEsiPaise || 0) / 100)
										})]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "pt",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: "Professional Tax (State Jurisdiction Slabs)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Withholding mapped to respective state tax schedules (Karnataka, Maharashtra, etc.)."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => handleDownloadReport("PT", "csv"),
									disabled: Boolean(downloadingReport),
									className: "h-8 gap-1.5 text-xs rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export PT Statement" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl border border-border/60 bg-muted/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Employees Under PT Coverage"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono font-semibold text-foreground mt-1",
										children: formatCount(summary?.ptTotals?.coveredCount || 0)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl border border-border/60 bg-muted/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Total State PT Withheld"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1",
										children: summary?.ptTotals?.formattedTotal || "—"
									})]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "tds",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: "Income Tax / TDS (Form 24Q Summary)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Monthly tax deductions computed under Old vs New tax regimes."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => handleDownloadReport("TDS", "csv"),
									disabled: Boolean(downloadingReport),
									className: "h-8 gap-1.5 text-xs rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Form 24Q TDS Schedule" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl border border-border/60 bg-muted/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Employees with TDS Withholdings"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono font-semibold text-foreground mt-1",
										children: formatCount(summary?.tdsTotals?.deductedCount || 0)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl border border-border/60 bg-muted/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Total Monthly TDS Deducted"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1",
										children: summary?.tdsTotals?.formattedTotal || "—"
									})]
								})]
							})]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { StatutoryCompliancePage as default };
