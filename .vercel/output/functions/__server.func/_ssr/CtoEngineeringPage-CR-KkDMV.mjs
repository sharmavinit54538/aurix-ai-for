import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Cn as GitPullRequest, E as TrendingUp, Gr as CalendarCheck, J as ShieldAlert, Yt as ListTodo, an as Layers, er as Download, ht as Plus, o as Wrench } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CtoEngineeringPage-CR-KkDMV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CtoEngineeringPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("sprint");
	const velocityData = [];
	const prStatusData = [];
	const sprintTasks = [];
	const pullRequests = [];
	const codeReviews = [];
	const storyPointBreakdown = [];
	const techDebtItems = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase",
									children: "Engineering Management Hub"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "Software Engineering & Development Management"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-indigo-200/70 max-w-2xl",
								children: "Sprint boards, code reviews, PR analytics, story point velocity tracking, technical debt backlog, architecture, and release planning."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => toast.success("Created new Sprint task"),
							className: "bg-indigo-600 hover:bg-indigo-500 text-white text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), "Create Task"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => toast.success("Exported Engineering report"),
							className: "border-border text-foreground text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Export Report"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Active Sprint Progress",
						val: "—",
						sub: "Backend API integration pending",
						color: "text-emerald-400",
						icon: ListTodo
					},
					{
						label: "Open Pull Requests",
						val: "0 PRs",
						sub: "Backend API integration pending",
						color: "text-indigo-400",
						icon: GitPullRequest
					},
					{
						label: "Sprint Velocity",
						val: "—",
						sub: "Backend API integration pending",
						color: "text-cyan-400",
						icon: TrendingUp
					},
					{
						label: "Tech Debt Score",
						val: "—",
						sub: "Backend API integration pending",
						color: "text-amber-400",
						icon: ShieldAlert
					}
				].map((kpi, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-xl space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: kpi.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(kpi.icon, { className: "h-4 w-4 text-muted-foreground" })]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Sprint Progress & Team Capacity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Planned vs Completed story points vs total capacity"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full pt-2 flex items-center justify-center",
							children: velocityData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: velocityData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "rgba(255,255,255,0.05)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "sprint",
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
											dataKey: "planned",
											fill: "#6366f1",
											radius: [
												4,
												4,
												0,
												0
											],
											name: "Planned Points"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "completed",
											fill: "#10b981",
											radius: [
												4,
												4,
												0,
												0
											],
											name: "Completed Points"
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No sprint capacity telemetry available. Backend API integration pending."
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Velocity Trend & Acceleration"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Story points delivery velocity trajectory"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full pt-2 flex items-center justify-center",
							children: velocityData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: velocityData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "colorVel",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "5%",
												stopColor: "#06b6d4",
												stopOpacity: .4
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "95%",
												stopColor: "#06b6d4",
												stopOpacity: 0
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "rgba(255,255,255,0.05)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "sprint",
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
											dataKey: "completed",
											stroke: "#06b6d4",
											fillOpacity: 1,
											fill: "url(#colorVel)",
											name: "Velocity (Pts)"
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No velocity history available. Backend API integration pending."
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "PR Status Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Pull requests review & approval pipeline status"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full flex items-center justify-center pt-2",
							children: prStatusData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: prStatusData,
									cx: "50%",
									cy: "50%",
									innerRadius: 50,
									outerRadius: 80,
									dataKey: "value",
									nameKey: "name",
									paddingAngle: 4,
									children: prStatusData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									backgroundColor: "#0f172a",
									borderColor: "#334155",
									borderRadius: "8px"
								} })] })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No pull requests data available. Backend API integration pending."
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Team Capacity Utilization"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Sprint engineering hours allocated vs total capacity"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full pt-2 flex items-center justify-center",
							children: velocityData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: velocityData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "rgba(255,255,255,0.05)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "sprint",
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
											dataKey: "capacity",
											fill: "#818cf8",
											radius: [
												4,
												4,
												0,
												0
											],
											name: "Max Capacity"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "completed",
											fill: "#10b981",
											radius: [
												4,
												4,
												0,
												0
											],
											name: "Utilized Capacity"
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No capacity utilization data available. Backend API integration pending."
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "sprint",
				onValueChange: setActiveTab,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "sprint",
								className: "text-xs font-semibold",
								children: "Sprint Board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "reviews",
								className: "text-xs font-semibold",
								children: "Code Reviews"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "prs",
								className: "text-xs font-semibold",
								children: "Pull Requests"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "techdebt",
								className: "text-xs font-semibold",
								children: "Technical Debt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "architecture",
								className: "text-xs font-semibold",
								children: "Architecture"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "storypoints",
								className: "text-xs font-semibold",
								children: "Story Points"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "velocity",
								className: "text-xs font-semibold",
								children: "Velocity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "releases",
								className: "text-xs font-semibold",
								children: "Release Planning"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "sprint",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-4 gap-4",
							children: [
								"Backlog",
								"In Progress",
								"Code Review",
								"Done"
							].map((colStatus) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/60 bg-card/40 p-3 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/40 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-foreground uppercase tracking-wider",
										children: colStatus
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] font-mono",
										children: sprintTasks.filter((t) => t.status === colStatus).length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: sprintTasks.filter((t) => t.status === colStatus).length > 0 ? sprintTasks.filter((t) => t.status === colStatus).map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border/60 bg-card/80 p-3 space-y-2 hover:border-indigo-500/50 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[10px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-indigo-400 font-bold",
													children: task.id
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: "text-[9px] bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
													children: task.priority
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-foreground leading-snug",
												children: task.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: task.assignee }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-bold text-foreground",
													children: [task.points, " pts"]
												})]
											})
										]
									}, task.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-4 text-center text-xs text-muted-foreground",
										children: "No tasks in this lane"
									})
								})]
							}, colStatus))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "reviews",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Review ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Review Title"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Reviewer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Security Score"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/40",
									children: codeReviews.length > 0 ? codeReviews.map((cr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-indigo-400 font-bold",
												children: cr.id
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-semibold text-foreground",
												children: cr.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground",
												children: cr.reviewer
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-emerald-400",
												children: cr.score
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: "text-[10px] bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
													children: cr.status
												})
											})
										]
									}, cr.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 5,
										className: "p-8 text-center text-xs text-muted-foreground",
										children: "No code reviews pending or recorded."
									}) })
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "prs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "PR ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Title"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Author"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Repository"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Review Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "CI Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/40",
									children: pullRequests.length > 0 ? pullRequests.map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-indigo-400 font-bold",
												children: pr.id
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-semibold text-foreground",
												children: pr.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground",
												children: pr.author
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-muted-foreground",
												children: pr.repo
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "text-[10px] border-indigo-500/30 text-indigo-400",
													children: [
														pr.status,
														" (",
														pr.reviews,
														")"
													]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: "text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
													children: pr.ci
												})
											})
										]
									}, pr.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 6,
										className: "p-8 text-center text-xs text-muted-foreground",
										children: "No active pull requests in repository queues."
									}) })
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "techdebt",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: techDebtItems.length > 0 ? techDebtItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-card/60 p-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-amber-400 font-bold text-xs",
											children: item.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-foreground",
											children: item.title
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: ["Effort Estimate: ", item.effort]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs",
										children: item.score
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "text-xs cursor-pointer",
										children: "Schedule Refactor"
									})]
								})]
							}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl",
								children: "No technical debt items tracked."
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "architecture",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 rounded-xl border border-border/80 bg-card/60 space-y-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-8 w-8 text-indigo-400 mx-auto" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "Microservices & Event-Driven Architecture Blueprint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-xl mx-auto",
									children: "Decoupled backend services, distributed cache, vector search, web layer, and container orchestration cluster."
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "storypoints",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Story Points Distribution"
							}), storyPointBreakdown.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
								children: storyPointBreakdown.map((sb, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border/60 bg-card/80 p-3 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground font-semibold",
											children: sb.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xl font-bold font-display text-indigo-400",
											children: [sb.points, " Pts"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-emerald-400",
											children: [sb.pct, " of total sprint"]
										})
									]
								}, idx))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg",
								children: "No story point breakdown available."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "velocity",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Velocity Analytics & Trajectory"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-60 w-full flex items-center justify-center",
								children: velocityData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
										data: velocityData,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												stroke: "rgba(255,255,255,0.05)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "sprint",
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
												dataKey: "completed",
												stroke: "#6366f1",
												fill: "#6366f1",
												fillOpacity: .3,
												name: "Velocity Pts"
											})
										]
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No historical velocity points available. Backend API integration pending."
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "releases",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 rounded-xl border border-border/80 bg-card/60 space-y-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-8 w-8 text-emerald-400 mx-auto" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "Release Planning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No upcoming releases scheduled."
								})
							]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { CtoEngineeringPage, CtoEngineeringPage as default };
