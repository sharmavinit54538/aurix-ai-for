import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Gn as FileCheck, Gt as Lock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CtoSecurityPage() {
	const auditLogs = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold uppercase",
									children: "Security Operations & Monitoring"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "Enterprise Security Operations & Audit Logs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-200/70 max-w-2xl",
								children: "Security Operations Center (SOC), threat detection alerts, application audit logs, system health checks, API keys manager, and secrets vault."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => toast.info("No audit logs available to export."),
							className: "bg-rose-600 hover:bg-rose-500 text-white text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "mr-1.5 h-3.5 w-3.5" }), "Export Audit Logs"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Security Health Score",
						val: "—",
						sub: "Compliance scan pending",
						color: "text-emerald-400"
					},
					{
						label: "Threat Detection Alerts",
						val: "—",
						sub: "IDS/IPS sensor offline",
						color: "text-rose-400"
					},
					{
						label: "MFA Enrollment",
						val: "—",
						sub: "Directory auth telemetry pending",
						color: "text-indigo-400"
					},
					{
						label: "System Health SLA",
						val: "—",
						sub: "Awaiting probe telemetry",
						color: "text-cyan-400"
					}
				].map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-card/60 p-4 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-semibold uppercase",
							children: k.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-2xl font-bold font-display ${k.color}`,
							children: k.val
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: k.sub
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "audit",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "audit",
								className: "text-xs font-semibold",
								children: "Audit Logs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "threats",
								className: "text-xs font-semibold",
								children: "Threat Detection"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "monitoring",
								className: "text-xs font-semibold",
								children: "System Monitoring & Logs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "apikeys",
								className: "text-xs font-semibold",
								children: "API Keys & Secrets"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "audit",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Timestamp"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "User / Actor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Action Event"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "IP Address"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/40",
									children: auditLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 5,
										className: "p-8 text-center text-xs text-muted-foreground",
										children: "No security audit events or access logs recorded."
									}) }) : auditLogs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-muted-foreground",
												children: log.time
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-semibold text-foreground",
												children: log.actor
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-foreground",
												children: log.action
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-indigo-400",
												children: log.ip
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: `text-[10px] ${log.status === "Blocked" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`,
													children: log.status
												})
											})
										]
									}, idx))
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "threats",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No active threat alerts or intrusion detection incidents reported."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "monitoring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "System logs and daemon telemetry stream unconfigured."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "apikeys",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No API keys or integration credentials registered."
						})
					})
				]
			})
		]
	});
}
//#endregion
export { CtoSecurityPage, CtoSecurityPage as default };
