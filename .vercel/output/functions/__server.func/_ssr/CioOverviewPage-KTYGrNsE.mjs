import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { er as Download, lt as RefreshCw, mi as Activity, on as Laptop, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Tooltip, c as YAxis, d as Line, f as CartesianGrid, l as XAxis, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CioOverviewPage() {
	const infraData = [];
	const recentActivities = [];
	const upcomingMaintenance = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold uppercase tracking-wider",
										children: "CIO Enterprise IT Control Center"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-muted text-muted-foreground border border-border text-[11px] font-bold",
										children: "IT Systems Offline / Unconfigured"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "Chief Information Officer Technology & Infrastructure Hub"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-blue-200/70 max-w-2xl",
								children: "Enterprise IT operations, global infrastructure health, SOC2 security score, cloud utilization, digital transformation, and IT governance."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => toast.info("IT telemetry sync pending backend integration."),
							className: "bg-blue-600 hover:bg-blue-500 text-white text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5" }), "Refresh Telemetry"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => toast.info("No audit reports available to export."),
							className: "border-border text-foreground text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Export Report"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
				children: [
					{
						label: "Total IT Managed Assets",
						val: "—",
						sub: "No assets cataloged",
						color: "text-blue-400"
					},
					{
						label: "Active Enterprise Users",
						val: "—",
						sub: "Directory sync pending",
						color: "text-indigo-400"
					},
					{
						label: "Critical Incidents",
						val: "—",
						sub: "Incident tracker offline",
						color: "text-emerald-400"
					},
					{
						label: "Infrastructure Health",
						val: "—",
						sub: "Probes pending",
						color: "text-cyan-400"
					},
					{
						label: "Cloud Resource Usage",
						val: "—",
						sub: "Cloud telemetry unlinked",
						color: "text-purple-400"
					},
					{
						label: "Cyber Security Score",
						val: "—",
						sub: "Audit pending",
						color: "text-emerald-400"
					},
					{
						label: "Annual IT Budget",
						val: "—",
						sub: "Budget unconfigured",
						color: "text-amber-400"
					},
					{
						label: "System Availability",
						val: "—",
						sub: "No SLA metrics recorded",
						color: "text-blue-400"
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
							className: "text-[11px] text-muted-foreground",
							children: w.sub
						})
					]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-foreground",
							children: "Infrastructure CPU & Memory Load (%)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Cluster compute utilization across data centers"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] border-border text-muted-foreground",
							children: "—"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full pt-2",
						children: infraData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-full flex items-center justify-center text-xs text-muted-foreground",
							children: "No infrastructure compute telemetry recorded."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: infraData,
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "cpu",
										stroke: "#3b82f6",
										strokeWidth: 2,
										name: "CPU Load (%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "memory",
										stroke: "#818cf8",
										strokeWidth: 2,
										name: "RAM Load (%)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-foreground",
							children: "Cloud Cost Trajectory ($k / Month)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "AWS, Azure & GCP multi-cloud expenditure"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] border-border text-muted-foreground",
							children: "—"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full pt-2",
						children: infraData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-full flex items-center justify-center text-xs text-muted-foreground",
							children: "No cloud spend telemetry recorded."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: infraData,
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
										dataKey: "cloudCost",
										stroke: "#10b981",
										fill: "#10b981",
										fillOpacity: .2,
										name: "Cloud Spend ($k)"
									})
								]
							})
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-blue-400" }), "Recent Enterprise IT Activities"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: recentActivities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-8 text-center text-xs text-muted-foreground",
							children: "No recent IT activities recorded."
						}) : recentActivities.map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border/60 bg-card/80 p-3 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-blue-500/30 text-blue-400",
									children: act.tag
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: act.time
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground",
								children: act.text
							})]
						}, idx))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-400" }), "Upcoming Scheduled IT Maintenance"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: upcomingMaintenance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-8 text-center text-xs text-muted-foreground",
							children: "No upcoming maintenance windows scheduled."
						}) : upcomingMaintenance.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-xs text-foreground",
									children: m.service
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: m.window
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]",
								children: m.impact
							})]
						}, idx))
					})]
				})]
			})
		]
	});
}
//#endregion
export { CioOverviewPage, CioOverviewPage as default };
