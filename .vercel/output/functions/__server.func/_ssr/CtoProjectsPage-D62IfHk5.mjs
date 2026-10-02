import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, Jn as Eye, Mn as Folder, Sr as CircleCheck, T as TriangleAlert, ht as Plus, mi as Activity, wt as Paperclip } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-3YlcNW_l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CtoProjectsPage-D62IfHk5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CtoProjectsPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("list");
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedProject, setSelectedProject] = (0, import_react.useState)(null);
	const projects = [];
	const milestones = [];
	const risks = [];
	const teamAllocations = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[11px] font-bold uppercase ${statusBadgeClass("info")}`,
									children: "Project Portfolio Management"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
								children: "Engineering Project Portfolio & Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground max-w-2xl",
								children: "Project list, timeline, Kanban board, Gantt chart view, milestones, risk matrix, budget tracking, team allocation, and detailed project drawers."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => toast.success("New Project Modal Opened"),
							className: "text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), "New Project"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Active Portfolio",
						val: "0 Projects",
						sub: "Backend API integration pending"
					},
					{
						label: "Engineering Budget",
						val: "—",
						sub: "Backend API integration pending"
					},
					{
						label: "Milestones Target",
						val: "—",
						sub: "Backend API integration pending"
					},
					{
						label: "Open Portfolio Risks",
						val: "0 Tracked",
						sub: "No active risks"
					}
				].map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-semibold uppercase",
							children: k.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold font-display text-foreground",
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
				defaultValue: "list",
				onValueChange: setActiveTab,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted border border-border p-1 rounded-xl flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "list",
								className: "text-xs font-semibold",
								children: "Project List"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "timeline",
								className: "text-xs font-semibold",
								children: "Timeline"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "kanban",
								className: "text-xs font-semibold",
								children: "Kanban"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "gantt",
								className: "text-xs font-semibold",
								children: "Gantt View"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "milestones",
								className: "text-xs font-semibold",
								children: "Milestones"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "risks",
								className: "text-xs font-semibold",
								children: "Risks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "budget",
								className: "text-xs font-semibold",
								children: "Budget"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "allocation",
								className: "text-xs font-semibold",
								children: "Team Allocation"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "list",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border bg-card overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Project ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Project Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Lead Engineer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Progress"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Budget"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Risk Level"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-right",
											children: "Action"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/40",
									children: projects.length > 0 ? projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-foreground font-bold",
												children: p.id
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-bold text-foreground",
												children: p.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground",
												children: p.lead
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3 font-mono text-foreground font-semibold",
												children: [p.progress, "%"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-foreground font-semibold",
												children: p.budget
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-[10px] ${statusBadgeClass(p.risk === "Low" ? "approved" : "warning")}`,
													children: p.risk
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-[10px] ${statusBadgeClass(p.status)}`,
													children: p.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => setSelectedProject(p),
													className: "h-7 px-2 text-xs text-primary hover:bg-muted cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3 w-3" }), " Details"]
												})
											})
										]
									}, p.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 8,
										className: "p-8 text-center text-xs text-muted-foreground",
										children: "No engineering projects found. Backend API integration pending."
									}) })
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "timeline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Project Timeline Roadmap"
							}), projects.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-bold text-foreground",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Due Date: ",
												p.dueDate,
												" • Lead: ",
												p.lead
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 w-full md:w-auto",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-32 bg-muted rounded-full h-2 overflow-hidden border border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-primary h-full rounded-full",
													style: { width: `${p.progress}%` }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-mono font-bold text-foreground",
												children: [p.progress, "%"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setSelectedProject(p),
												className: "text-[10px] h-7 cursor-pointer",
												children: "View"
											})
										]
									})]
								}, p.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-xs text-muted-foreground",
								children: "No active project timelines."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "kanban",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-4",
							children: [
								"In Progress",
								"On Track",
								"Completed"
							].map((statusCol) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-3 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/40 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-foreground uppercase tracking-wider",
										children: statusCol
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] font-mono",
										children: projects.filter((p) => p.status === statusCol).length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: projects.filter((p) => p.status === statusCol).length > 0 ? projects.filter((p) => p.status === statusCol).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => setSelectedProject(p),
										className: "rounded-lg border border-border bg-card p-3 space-y-2 hover:border-primary/50 transition-colors cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[10px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-foreground font-bold",
													children: p.id
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[9px] bg-primary/10 text-primary border-primary/20",
													children: p.dept
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold text-foreground",
												children: p.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.lead }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-bold text-foreground",
													children: p.budget
												})]
											})
										]
									}, p.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-4 text-center text-xs text-muted-foreground",
										children: "No projects in this stage"
									})
								})]
							}, statusCol))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "gantt",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 rounded-xl border border-dashed border-border bg-card text-center space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-8 w-8 text-muted-foreground mx-auto" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "Gantt View Blueprint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-xl mx-auto",
									children: "Visualizing engineering task dependencies and critical path schedules will be active once projects are loaded."
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "milestones",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Engineering Milestones Tracker"
							}), milestones.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5",
								children: milestones.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-xs text-foreground",
											children: m.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Project: ",
												m.project,
												" • Target Date: ",
												m.date
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `text-[10px] ${statusBadgeClass(m.status === "Completed" ? "approved" : "info")}`,
										children: m.status
									})]
								}, idx))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg",
								children: "No engineering milestones scheduled."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "risks",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: risks.length > 0 ? risks.map((r, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-foreground",
											children: r.title
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"Project: ",
											r.project,
											" • Impact: ",
											r.impact,
											" • Likelihood: ",
											r.likelihood
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-xs ${statusBadgeClass(r.status)}`,
									children: r.status
								})]
							}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl",
								children: "No active portfolio risks identified."
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "budget",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Project Budget & Expenditure"
							}), projects.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
								children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-3 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-bold text-foreground truncate",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg font-bold font-mono text-foreground",
											children: [
												p.spent,
												" / ",
												p.budget
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Utilized: ",
												Math.round(parseInt(p.spent.replace(/[^0-9]/g, "")) / parseInt(p.budget.replace(/[^0-9]/g, "")) * 100),
												"%"
											]
										})
									]
								}, p.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg",
								children: "No budget allocations tracked yet."
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "allocation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border bg-card overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Engineer Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Assigned Project"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Role"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Allocation Pct"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/40",
									children: teamAllocations.length > 0 ? teamAllocations.map((ta, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-bold text-foreground",
												children: ta.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-foreground font-semibold",
												children: ta.project
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground",
												children: ta.role
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-foreground font-bold",
												children: ta.allocation
											})
										]
									}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 4,
										className: "p-8 text-center text-xs text-muted-foreground",
										children: "No engineering allocations assigned yet."
									}) })
								})]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!selectedProject,
				onOpenChange: (open) => !open && setSelectedProject(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					side: "right",
					className: "w-full sm:max-w-xl bg-card text-foreground border-l border-border p-6 space-y-6 overflow-y-auto",
					children: selectedProject && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
								className: "space-y-1 text-left border-b border-border pb-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-foreground font-bold text-xs",
											children: selectedProject.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[10px] ${statusBadgeClass(selectedProject.status)}`,
											children: selectedProject.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
										className: "text-xl font-bold text-foreground",
										children: selectedProject.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
										className: "text-xs text-muted-foreground",
										children: [
											"Department: ",
											selectedProject.dept,
											" • Lead Engineer: ",
											selectedProject.lead,
											" • Due: ",
											selectedProject.dueDate
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-3 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground uppercase font-semibold",
										children: "Completion Progress"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xl font-bold font-mono text-foreground",
										children: [selectedProject.progress, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-card p-3 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground uppercase font-semibold",
										children: "Budget Spent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xl font-bold font-mono text-foreground",
										children: [
											selectedProject.spent,
											" / ",
											selectedProject.budget
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
								defaultValue: "tasks",
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
										className: "bg-muted border border-border p-1 rounded-lg w-full flex",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
												value: "tasks",
												className: "text-xs flex-1",
												children: "Tasks"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
												value: "files",
												className: "text-xs flex-1",
												children: "Files"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
												value: "comments",
												className: "text-xs flex-1",
												children: "Comments"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
												value: "activity",
												className: "text-xs flex-1",
												children: "Activity"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "tasks",
										className: "space-y-2",
										children: selectedProject.tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border bg-card p-3 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: `h-4 w-4 ${task.status === "Done" ? "text-primary" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-foreground",
													children: task.name
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[9px] font-mono",
												children: task.status
											})]
										}, task.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "files",
										className: "space-y-2",
										children: selectedProject.files.map((file, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border bg-card p-3 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold font-mono text-foreground",
													children: file
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => toast.success(`Downloading ${file}`),
												className: "h-6 text-[10px] text-primary cursor-pointer",
												children: "Download"
											})]
										}, idx))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "comments",
										className: "space-y-3",
										children: selectedProject.comments.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border bg-card p-3 space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground",
													children: c.author
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: c.time
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: c.text
											})]
										}, idx))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "activity",
										className: "space-y-2",
										children: selectedProject.activities.map((act, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border bg-card p-3 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-foreground",
												children: act
											})]
										}, idx))
									})
								]
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { CtoProjectsPage, CtoProjectsPage as default };
