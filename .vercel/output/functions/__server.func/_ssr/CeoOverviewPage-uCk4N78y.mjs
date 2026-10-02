import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Tr as CircleAlert, er as Download, lt as RefreshCw, mi as Activity, qr as Building2, rr as Crown } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CeoOverviewPage() {
	const financialData = [];
	const deptPerformance = [];
	const recentActivities = [];
	const upcomingDecisions = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider",
										children: "CEO Executive Control Hub"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold",
										children: "Healthy Enterprise Growth"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "Chief Executive Officer Strategy & Growth Portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-amber-200/70 max-w-2xl",
								children: "Real-time enterprise revenue, net profit, market expansion, department performance, cash flow trends, and executive decision-making."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => toast.success("Refreshed CEO Executive Metrics"),
							className: "bg-amber-600 hover:bg-amber-500 text-white text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5" }), "Refresh Data"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => toast.success("Exported CEO Executive Report"),
							className: "border-border text-foreground text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Export Summary"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
				children: [
					{
						label: "Company Revenue (YTD)",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-emerald-400"
					},
					{
						label: "Net Profit Margin",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-amber-400"
					},
					{
						label: "Active Employees",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-indigo-400"
					},
					{
						label: "Total Enterprise Clients",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-cyan-400"
					},
					{
						label: "Active Strategic Projects",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-purple-400"
					},
					{
						label: "Monthly Revenue Growth",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-emerald-400"
					},
					{
						label: "Customer Satisfaction",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-blue-400"
					},
					{
						label: "Company Health Score",
						val: "—",
						change: "Telemetry integration pending",
						color: "text-amber-400"
					}
				].map((w, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-card/60 p-4 space-y-1 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-semibold uppercase",
							children: w.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-2xl font-bold font-display ${w.color}`,
							children: w.val
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground flex items-center gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: w.change })
						})
					]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-foreground",
							children: "Revenue Growth vs Net Profit ($M)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Monthly revenue trajectory and profit margin"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full pt-2 flex items-center justify-center",
						children: financialData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: financialData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "rgba(255,255,255,0.05)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										stroke: "#888888",
										fontSize: 10
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#888888",
										fontSize: 10
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										backgroundColor: "#0f172a",
										borderColor: "#334155",
										borderRadius: "8px"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "revenue",
										stroke: "#10b981",
										fillOpacity: 1,
										fill: "#10b981",
										name: "Revenue ($M)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "profit",
										stroke: "#f59e0b",
										fillOpacity: .1,
										fill: "#f59e0b",
										name: "Net Profit ($M)"
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No financial telemetry data available. Backend API integration pending."
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-foreground",
							children: "Operating Cash Flow & Sales Volume ($M)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Liquidity reserve & sales deal acceleration"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full pt-2 flex items-center justify-center",
						children: financialData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: financialData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "rgba(255,255,255,0.05)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										stroke: "#888888",
										fontSize: 10
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#888888",
										fontSize: 10
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										backgroundColor: "#0f172a",
										borderColor: "#334155",
										borderRadius: "8px"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sales",
										fill: "#6366f1",
										radius: [
											4,
											4,
											0,
											0
										],
										name: "Sales Deals ($M)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "cashFlow",
										fill: "#06b6d4",
										radius: [
											4,
											4,
											0,
											0
										],
										name: "Cash Flow ($M)"
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No cash flow data available. Backend API integration pending."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-sm text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-amber-400" }), "Recent Executive Activities"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: recentActivities.length > 0 ? recentActivities.map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border/60 bg-card/80 p-3 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "border-amber-500/30 text-amber-400",
										children: act.tag
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: act.time
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-foreground",
									children: act.text
								})]
							}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground",
								children: "No recent executive activities recorded."
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-sm text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-indigo-400" }), "Department Health & Growth"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: deptPerformance.length > 0 ? deptPerformance.map((d, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-xs text-foreground",
										children: d.dept
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											d.headcount,
											" Employees • ",
											d.growth
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs",
									children: d.score
								})]
							}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground",
								children: "No department performance data available."
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-sm text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-rose-400" }), "Upcoming Executive Decisions"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: upcomingDecisions.length > 0 ? upcomingDecisions.map((dec, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border/60 bg-card/80 p-3 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[10px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											className: "bg-rose-500/20 text-rose-400 border-rose-500/30",
											children: [dec.priority, " Priority"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-mono",
											children: dec.deadline
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-foreground",
										children: dec.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => toast.success(`Opened decision review for ${dec.title}`),
										className: "w-full h-7 text-[10px] cursor-pointer",
										children: "Review & Sign"
									})
								]
							}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground",
								children: "No pending executive decisions."
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { CeoOverviewPage, CeoOverviewPage as default };
