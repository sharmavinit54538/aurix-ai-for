import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, D as TrendingDown, E as TrendingUp, H as Sparkles, Nt as Minus, er as Download, li as ArrowRight, mi as Activity, rr as Crown } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { C as Legend, S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CtoPortalPage-V8wBwylA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CtoKpiGrid({ kpis, loading }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3",
		children: Array.from({ length: 20 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-xl border border-border/60 bg-card/40 p-4 animate-pulse" }, idx))
	});
	if (!kpis || kpis.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
		children: "No KPI telemetry recorded."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3",
		children: kpis.map((kpi, index) => {
			const isUp = kpi.trend === "up";
			const isDown = kpi.trend === "down";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .25,
					delay: index * .02
				},
				className: "group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-xl transition-all duration-200 hover:border-accent hover:shadow-lg hover:shadow-accent/5 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate",
					children: kpi.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `mt-1.5 text-2xl font-bold font-display tracking-tight ${kpi.color || "text-foreground"}`,
					children: kpi.value
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-muted-foreground",
						children: kpi.change
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex items-center gap-0.5 font-medium shrink-0 ${isUp ? "text-emerald-400" : isDown ? "text-rose-400" : "text-muted-foreground"}`,
						children: isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : isDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
					})]
				})]
			}, kpi.id || index);
		})
	});
}
function CtoSystemHealth({ services }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-xl space-y-4 text-left shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border/50 pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-bold text-foreground uppercase tracking-wider",
					children: "Live System & Service Operational Health"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: services && services.length > 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold" : "bg-muted text-muted-foreground border-border text-[10px] uppercase font-bold",
				children: services && services.length > 0 ? "100% Operational SLA" : "No telemetry"
			})]
		}), !services || services.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border/40 bg-accent/5 p-6 text-center text-xs text-muted-foreground",
			children: "No active system health probes or services monitored."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
			children: services.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-border/40 bg-accent/10 p-3.5 transition-colors hover:bg-accent/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `relative flex h-2.5 w-2.5 shrink-0`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `animate-ping absolute inline-flex h-full w-full rounded-full ${item.indicator} opacity-75` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `relative inline-flex rounded-full h-2.5 w-2.5 ${item.indicator}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold text-foreground truncate",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted-foreground",
							children: [
								"Uptime: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-emerald-400",
									children: item.uptime
								}),
								" • Latency: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-cyan-400",
									children: item.latency
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "text-[10px] font-semibold border-emerald-500/30 text-emerald-400 shrink-0",
					children: item.status
				})]
			}, idx))
		})]
	});
}
function CtoCharts({ velocityTrend, deploymentTrend }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-2 gap-6 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-sm font-bold text-foreground",
				children: "Engineering Velocity & Tech Debt Reduction"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Sprint story points planned vs completed & technical debt backlog"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64 w-full pt-2",
				children: !velocityTrend || velocityTrend.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full w-full flex items-center justify-center text-xs text-muted-foreground",
					children: "No velocity or tech debt history recorded."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: velocityTrend,
						margin: {
							top: 10,
							right: 10,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "rgba(255,255,255,0.08)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "sprint",
								stroke: "#94a3b8",
								fontSize: 11,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "#94a3b8",
								fontSize: 11,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								backgroundColor: "#0f172a",
								borderColor: "rgba(255,255,255,0.15)",
								borderRadius: "12px",
								fontSize: "12px"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
								fontSize: "11px",
								paddingTop: "8px"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "planned",
								name: "Planned Points",
								fill: "#6366f1",
								radius: [
									4,
									4,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "completed",
								name: "Completed Points",
								fill: "#10b981",
								radius: [
									4,
									4,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "techDebt",
								name: "Tech Debt Solved",
								fill: "#38bdf8",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-sm font-bold text-foreground",
				children: "CI/CD Deployment History"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Daily production vs staging deployments & zero-rollback status"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64 w-full pt-2",
				children: !deploymentTrend || deploymentTrend.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full w-full flex items-center justify-center text-xs text-muted-foreground",
					children: "No deployment history recorded."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: deploymentTrend,
						margin: {
							top: 10,
							right: 10,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "grad-prod",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#38bdf8",
									stopOpacity: .4
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#38bdf8",
									stopOpacity: 0
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "grad-stag",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#a855f7",
									stopOpacity: .4
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#a855f7",
									stopOpacity: 0
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "rgba(255,255,255,0.08)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								stroke: "#94a3b8",
								fontSize: 11,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "#94a3b8",
								fontSize: 11,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								backgroundColor: "#0f172a",
								borderColor: "rgba(255,255,255,0.15)",
								borderRadius: "12px",
								fontSize: "12px"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
								fontSize: "11px",
								paddingTop: "8px"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "production",
								name: "Production Deploys",
								stroke: "#38bdf8",
								fill: "url(#grad-prod)",
								strokeWidth: 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "staging",
								name: "Staging Deploys",
								stroke: "#a855f7",
								fill: "url(#grad-stag)",
								strokeWidth: 2
							})
						]
					})
				})
			})]
		})]
	});
}
function CtoAiInsights({ insights }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-purple-950/20 to-card/60 p-5 backdrop-blur-xl space-y-4 text-left shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-violet-500/20 pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-7 w-7 place-items-center rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-sm font-bold text-foreground",
					children: "AI CTO Copilot Recommendations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Automated infrastructure, cost & performance optimization insights"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px] font-bold uppercase",
				children: "Autonomous AI Engine"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-3 gap-4",
			children: !insights || insights.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-span-full rounded-xl border border-border/60 bg-card/40 p-8 text-center text-xs text-muted-foreground",
				children: "No autonomous AI recommendations available."
			}) : insights.map((item, idx) => {
				const isHigh = item.severity === "High";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 space-y-3 backdrop-blur-sm transition-all hover:border-violet-500/40 hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-violet-400",
									children: item.type
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: `text-[9px] font-bold ${isHigh ? "border-rose-500/40 text-rose-400 bg-rose-500/10" : "border-amber-500/40 text-amber-400 bg-amber-500/10"}`,
									children: [item.severity, " Impact"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-bold text-foreground line-clamp-1",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground leading-relaxed line-clamp-3",
								children: item.description
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => toast.success(`Applied action: ${item.action}`),
						className: "w-full text-xs font-medium border-violet-500/30 text-violet-300 hover:bg-violet-500/20 cursor-pointer h-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.action }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-3 w-3" })]
					})]
				}, idx);
			})
		})]
	});
}
function CtoPortalPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [dateRange, setDateRange] = (0, import_react.useState)("month");
	const [kpis, setKpis] = (0, import_react.useState)([]);
	const [systemHealth, setSystemHealth] = (0, import_react.useState)([]);
	const [velocityTrend, setVelocityTrend] = (0, import_react.useState)([]);
	const [deploymentTrend, setDeploymentTrend] = (0, import_react.useState)([]);
	const [aiInsights, setAiInsights] = (0, import_react.useState)([]);
	const fetchCtoMetrics = async () => {
		setLoading(true);
		try {
			const json = await api.get("/api/v1/cto/dashboard");
			if (json && json.success && json.data) {
				setKpis(json.data.kpis || []);
				setSystemHealth(json.data.systemHealth || []);
				setVelocityTrend(json.data.velocityTrend || []);
				setDeploymentTrend(json.data.deploymentTrend || []);
				setAiInsights(json.data.aiInsights || []);
			}
		} catch (err) {
			toast.error("Failed to sync CTO Portal metrics");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchCtoMetrics();
	}, []);
	const handleExportCSV = () => {
		toast.success("Exporting CTO Executive Metrics to CSV...");
	};
	const filteredKpis = kpis.filter((k) => k.title.toLowerCase().includes(search.toLowerCase()) || k.value.toLowerCase().includes(search.toLowerCase()) || k.change.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-xl text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-40 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col md:flex-row md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold uppercase tracking-wider",
											children: "Enterprise Executive Hub"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold",
											children: "SOC2 & ISO27001 Certified"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
									children: "CTO Engineering & Technology Control Center"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-purple-200/70 max-w-2xl",
									children: "Real-time executive oversight across Engineering, DevOps, Infrastructure, AI Models, Databases, Security, and Cloud Infrastructure."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleExportCSV,
								className: "border-border/80 text-foreground hover:bg-accent text-xs cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Export CSV"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => toast.info("Opening AI Assistant..."),
								className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-glow cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5" }), "AI CTO Assistant"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-purple-500/20 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Filter metrics, servers, models...",
								className: "pl-9 text-xs h-9 bg-card/40 border-border/80"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 p-1 text-xs",
							children: [
								"day",
								"week",
								"month",
								"quarter"
							].map((range) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDateRange(range),
								className: `rounded-md px-3 py-1 font-medium capitalize transition-colors cursor-pointer ${dateRange === range ? "bg-purple-600 text-white font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: range
							}, range))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtoKpiGrid, {
				kpis: filteredKpis,
				loading
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtoSystemHealth, { services: systemHealth }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtoAiInsights, { insights: aiInsights }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtoCharts, {
				velocityTrend,
				deploymentTrend
			})
		]
	});
}
//#endregion
export { CtoPortalPage, CtoPortalPage as default };
