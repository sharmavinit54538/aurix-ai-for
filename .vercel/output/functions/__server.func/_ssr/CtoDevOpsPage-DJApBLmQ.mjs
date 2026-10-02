import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { ct as Rocket, xr as CirclePlay } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CtoDevOpsPage() {
	const pipelines = [];
	const servers = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase",
									children: "DevOps & Infrastructure Control"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "CI/CD Pipelines, Kubernetes & Infrastructure Hub"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-purple-200/70 max-w-2xl",
								children: "Automated pipelines, Kubernetes pod cluster orchestration, Docker container registry, EC2 instances, SSL certificates, and load balancing."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => toast.info("CI/CD pipeline webhook integration pending."),
							className: "bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "mr-1.5 h-3.5 w-3.5" }), "Trigger Deploy"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Build Success Rate",
						val: "—",
						sub: "No pipeline runs recorded",
						color: "text-emerald-400"
					},
					{
						label: "Avg Deploy Duration",
						val: "—",
						sub: "Pipeline telemetry pending",
						color: "text-cyan-400"
					},
					{
						label: "Active Containers",
						val: "—",
						sub: "Kubernetes cluster offline",
						color: "text-purple-400"
					},
					{
						label: "Zero-Downtime Rollback",
						val: "—",
						sub: "Rollback target unconfigured",
						color: "text-emerald-400"
					}
				].map((kpi, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-xl space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-semibold uppercase",
							children: kpi.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-2xl font-bold font-display ${kpi.color}`,
							children: kpi.val
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: kpi.sub
						})
					]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "pipelines",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "pipelines",
								className: "text-xs font-semibold",
								children: "CI/CD Pipelines"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "deployments",
								className: "text-xs font-semibold",
								children: "Deployments & Builds"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "k8s",
								className: "text-xs font-semibold",
								children: "Kubernetes & Docker"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "servers",
								className: "text-xs font-semibold",
								children: "Servers & Storage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "networking",
								className: "text-xs font-semibold",
								children: "Networking & SSL"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "pipelines",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Active CI/CD Pipelines"
							}), pipelines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-xs text-muted-foreground",
								children: "No active CI/CD pipelines connected. Configure GitHub Actions, GitLab CI, or Jenkins."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border/40",
								children: pipelines.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-bold text-foreground flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[9px] border-purple-500/30 text-purple-400",
												children: p.env
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Duration: ",
												p.duration,
												" • Ran: ",
												p.lastRun
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: `text-[10px] ${p.status === "Running" ? "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`,
										children: p.status
									})]
								}, idx))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "deployments",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No deployment logs or artifact releases recorded."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "k8s",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No Kubernetes clusters or Docker daemon connections detected."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "servers",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Server Instance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Instance Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "IP Address"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "CPU Usage"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "RAM Usage"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/40",
									children: servers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 6,
										className: "p-8 text-center text-xs text-muted-foreground",
										children: "No cloud or on-premise compute servers connected."
									}) }) : servers.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-bold text-foreground",
												children: s.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground",
												children: s.type
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-purple-400",
												children: s.ip
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-emerald-400",
												children: s.cpu
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-indigo-400",
												children: s.ram
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: "text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
													children: s.status
												})
											})
										]
									}, idx))
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "networking",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No active load balancers, DNS zones, or SSL certificates configured."
						})
					})
				]
			})
		]
	});
}
//#endregion
export { CtoDevOpsPage, CtoDevOpsPage as default };
