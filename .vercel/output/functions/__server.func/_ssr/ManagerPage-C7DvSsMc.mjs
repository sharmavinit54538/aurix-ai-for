import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Bt as MapPin, D as TrendingDown, Dr as ChevronRight, Dt as Package, E as TrendingUp, H as Sparkles, Jr as Briefcase, Ln as FileText, P as Target, Sr as CircleCheck, T as TriangleAlert, Ur as CalendarDays, Xr as Bot, _ as UserPlus, a as X, er as Download, i as Zap, lt as RefreshCw, p as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { c as useNotifications, i as useArchive, t as formatRelativeTime } from "./notification-utils-1y-FPLpt.mjs";
import { n as trendTextClass, t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ManagerPage-C7DvSsMc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MANAGER_KPI = [];
var TEAM_MEMBERS = [];
var DEPT_DISTRIBUTION = [];
var ATTENDANCE_SUMMARY = [];
var WEEKLY_TEAM_ATTENDANCE = [];
var ATTENDANCE_RECORDS = [];
var TEAM_GOALS = [];
var PERF_MONTHLY = [];
var TOP_PERFORMERS = [];
var LOW_PERFORMERS = [];
var HIRING_REQUESTS = [];
var MANAGER_INTERVIEWS = [];
var CANDIDATE_PIPELINE = [];
var TEAM_ASSET_SUMMARY = [];
var TEAM_ASSETS = [];
var AI_TEAM_INSIGHTS = [];
var MANAGER_REPORTS = [
	{
		label: "Team Attendance",
		link: "/dashboard/attendance"
	},
	{
		label: "Team Performance",
		link: "/dashboard/performance"
	},
	{
		label: "Leave Summary",
		link: "/dashboard/leaves"
	},
	{
		label: "Productivity",
		link: "/dashboard/reports"
	},
	{
		label: "Hiring Status",
		link: "/dashboard/recruitment"
	},
	{
		label: "Asset Report",
		link: "/dashboard/assets"
	}
];
var fadeUp = {
	initial: {
		opacity: 0,
		y: 20
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .35,
		ease: "easeOut"
	}
};
var stagger = (i) => ({
	initial: {
		opacity: 0,
		y: 20
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .35,
		ease: "easeOut",
		delay: i * .055
	}
});
function Card({ children, className = "", noPad = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card shadow-sm shadow-sm ${noPad ? "" : "p-5"} ${className}`,
		children
	});
}
function SectionHeader({ title, subtitle, link, linkLabel = "View More", action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: subtitle
		})] }), action || link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: link,
			className: "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
			children: [
				linkLabel,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })
			]
		})]
	});
}
var STATUS_CONFIG = {
	present: {
		label: "Present",
		class: statusBadgeClass("active")
	},
	absent: {
		label: "Absent",
		class: statusBadgeClass("critical")
	},
	leave: {
		label: "On Leave",
		class: statusBadgeClass("warning")
	},
	wfh: {
		label: "WFH",
		class: statusBadgeClass("info")
	},
	late: {
		label: "Late",
		class: statusBadgeClass("warning")
	}
};
var QUICK_ACTIONS = [
	{
		label: "Approve Leave",
		icon: FileText,
		link: "/dashboard/leaves"
	},
	{
		label: "Approve Attendance",
		icon: CircleCheck,
		link: "/dashboard/attendance"
	},
	{
		label: "Performance Review",
		icon: Target,
		link: "/dashboard/performance"
	},
	{
		label: "Assign Asset",
		icon: Package,
		link: "/dashboard/assets"
	},
	{
		label: "Schedule Interview",
		icon: CalendarDays,
		link: "/dashboard/recruitment/calendar"
	},
	{
		label: "Add Team Member",
		icon: UserPlus,
		link: "/dashboard/employees"
	}
];
function ManagerHeader({ greeting, userName, companyName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: -16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .45,
			ease: "easeOut"
		},
		className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-lg",
					style: { background: "var(--gradient-brand)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: [
						greeting,
						", ",
						userName,
						" 👋"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [companyName, " · Manager Dashboard · Engineering Team"]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden text-right sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tabular-nums",
						children: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
							weekday: "long",
							day: "numeric",
							month: "long"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ai/chat-assistant",
					className: "flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold shadow transition-all hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3.5 w-3.5" }), " AI Copilot"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
			children: QUICK_ACTIONS.map((a, i) => {
				const Icon = a.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					...stagger(i),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: a.link,
						className: "group flex flex-col items-center gap-2 rounded-xl border border-border bg-background/60 p-3 text-center transition-all hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium leading-tight text-muted-foreground group-hover:text-foreground",
							children: a.label
						})]
					})
				}, a.label);
			})
		})]
	});
}
function KpiCards() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8",
		children: MANAGER_KPI.map((kpi, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			...stagger(i),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mb-3 inline-flex items-center rounded-lg p-2 ${kpi.bgAccent}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: `h-3.5 w-3.5 ${kpi.accent}` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl font-bold tracking-tight",
						children: kpi.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[11px] text-muted-foreground",
						children: kpi.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-1.5 flex items-center gap-1 text-[11px] font-medium ${kpi.changeType === "up" ? trendTextClass(true) : kpi.changeType === "down" ? trendTextClass(false) : "text-muted-foreground"}`,
						children: [kpi.changeType === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : kpi.changeType === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }) : null, kpi.change]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-8 w-full opacity-60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineChart, {
								data: kpi.spark,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "v",
									stroke: "var(--chart-1)",
									strokeWidth: 2,
									dot: false
								})
							})
						})
					})
				]
			})
		}, kpi.id))
	});
}
function TeamOverview() {
	const office = TEAM_MEMBERS.filter((m) => m.location === "office").length;
	const remote = TEAM_MEMBERS.filter((m) => m.location === "remote").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Team Overview",
			subtitle: "Current team status and structure",
			link: "/dashboard/employees"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "Team Members"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 max-h-72 overflow-y-auto pr-1",
					children: TEAM_MEMBERS.map((m) => {
						const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.present;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5 transition-colors hover:bg-accent/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-sm font-semibold",
									children: m.avatar
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: m.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.class}`,
											children: cfg.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.role }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-2.5 w-2.5" }), m.location === "office" ? "Office" : "Remote"]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold text-foreground",
										children: m.performanceScore
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "perf"
									})]
								})
							]
						}, m.id);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "Department Split"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-36",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: DEPT_DISTRIBUTION,
								cx: "50%",
								cy: "50%",
								innerRadius: 32,
								outerRadius: 56,
								dataKey: "count",
								paddingAngle: 4,
								children: DEPT_DISTRIBUTION.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.fill }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8,
								fontSize: 11
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								iconSize: 8,
								wrapperStyle: { fontSize: 11 }
							})
						] })
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-background/50 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Work Location"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl font-semibold text-foreground",
									children: office
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "In Office"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-primary",
										style: { width: `${office / TEAM_MEMBERS.length * 100}%` }
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl font-semibold text-foreground",
									children: remote
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Remote"
								})]
							})
						]
					})]
				})]
			})]
		})] })
	});
}
function AttendanceCenter() {
	const [selected, setSelected] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Attendance Center",
				subtitle: "Today's team attendance",
				link: "/dashboard/attendance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex flex-wrap gap-2",
				children: ATTENDANCE_SUMMARY.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-2 rounded-xl border px-4 py-2 ${s.bg} border-border`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `font-display text-xl font-bold ${s.color}`,
						children: s.count
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: s.label
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 h-48",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: WEEKLY_TEAM_ATTENDANCE,
						margin: {
							top: 4,
							right: 8,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.1)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "present",
								name: "Present",
								stackId: "a",
								fill: "var(--chart-1)",
								radius: [
									0,
									0,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "wfh",
								name: "WFH",
								stackId: "a",
								fill: "var(--chart-2)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "late",
								name: "Late",
								stackId: "a",
								fill: "var(--chart-3)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "absent",
								name: "Absent",
								stackId: "a",
								fill: "var(--chart-4)",
								radius: [
									4,
									4,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								iconSize: 10,
								wrapperStyle: { fontSize: 11 }
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "Attendance Actions Required"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: ATTENDANCE_RECORDS.filter((r) => r.status === "late" || r.status === "absent" || r.regularisationRequired).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold bg-primary/10 text-primary",
							children: r.name.split(" ").map((n) => n[0]).join("")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[10px] capitalize ${statusBadgeClass(r.status)}`,
									children: r.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									r.date,
									" ",
									r.checkIn ? `· Check-in: ${r.checkIn}` : "· No check-in recorded",
									r.overtime ? ` · OT: ${r.overtime}` : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-7 text-xs text-emerald-600 dark:text-emerald-400 border-border",
								children: "Approve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-7 text-xs border-border",
								children: "Correct"
							})]
						})
					]
				}, r.id))
			})
		] })
	});
}
function toLeaveStatus(status) {
	switch (String(status || "pending").toLowerCase()) {
		case "approved": return "approved";
		case "rejected": return "rejected";
		default: return "pending";
	}
}
function LeaveCenter() {
	const [tab, setTab] = (0, import_react.useState)("Pending");
	const [leaveRequests, setLeaveRequests] = (0, import_react.useState)([]);
	const [leaveLoading, setLeaveLoading] = (0, import_react.useState)(false);
	const loadLeaveRequests = (0, import_react.useCallback)(async () => {
		setLeaveLoading(true);
		try {
			const response = await api.get("/leaves/pending");
			if (!response?.success) throw new Error(response?.message || "Failed to load pending leave requests.");
			setLeaveRequests((Array.isArray(response.data) ? response.data : []).map((request) => ({
				id: String(request.id),
				name: request.employee?.fullName || request.employee?.full_name || request.employee_name || "Employee",
				type: request.leave_type || "Leave",
				from: request.start_date,
				to: request.end_date,
				days: Number(request.total_days) || 0,
				reason: request.reason || "No reason provided",
				requestedAt: request.created_at || request.applied_at || "Recently",
				status: toLeaveStatus(request.status),
				urgent: false
			})));
		} catch (error) {
			console.error("Error loading manager leave requests", error);
			toast.error(error?.message || "Failed to load pending leave requests.");
		} finally {
			setLeaveLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadLeaveRequests();
	}, [loadLeaveRequests]);
	const reviewLeave = async (id, status) => {
		try {
			const response = await api.post(`/leaves/${id}/review`, { status });
			if (!response?.success) throw new Error(response?.message || "Failed to review leave request.");
			toast.success(status === "APPROVED" ? "Leave request approved." : "Leave request rejected.");
			await loadLeaveRequests();
		} catch (error) {
			console.error("Error reviewing manager leave request", error);
			toast.error(error?.message || "Failed to review leave request.");
		}
	};
	const filtered = {
		Pending: leaveRequests.filter((l) => l.status === "pending"),
		Approved: leaveRequests.filter((l) => l.status === "approved"),
		Upcoming: leaveRequests.filter((l) => l.status === "approved" && new Date(l.from) > /* @__PURE__ */ new Date())
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					title: "Leave Center",
					subtitle: "Team leave requests and approvals",
					link: "/dashboard/leaves"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: loadLeaveRequests,
					disabled: leaveLoading,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${leaveLoading ? "animate-spin" : ""}` }), "Refresh"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-2",
				children: [
					"Pending",
					"Approved",
					"Upcoming"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(t),
					className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${tab === t ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`,
					children: [t, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === t ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`,
						children: filtered[t].length
					})]
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: 8
					},
					animate: {
						opacity: 1,
						x: 0
					},
					exit: {
						opacity: 0,
						x: -8
					},
					transition: { duration: .18 },
					className: "space-y-2",
					children: [filtered[tab].length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground" }),
							"No ",
							tab.toLowerCase(),
							" leave requests."
						]
					}), filtered[tab].map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: req.name
										}),
										req.urgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "destructive",
											className: "h-4 px-1.5 text-[10px]",
											children: "Urgent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[10px]",
											children: req.type
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: [
										req.from,
										" → ",
										req.to,
										" · ",
										req.days,
										" day",
										req.days !== 1 ? "s" : "",
										" · \"",
										req.reason,
										"\""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-xs text-muted-foreground",
								children: req.requestedAt
							}),
							tab === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => void reviewLeave(req.id, "APPROVED"),
									disabled: leaveLoading,
									className: "h-7 text-xs text-emerald-600 dark:text-emerald-400 border-border gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Approve"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => void reviewLeave(req.id, "REJECTED"),
									disabled: leaveLoading,
									className: "h-7 text-xs text-destructive border-destructive/30 gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Reject"]
								})]
							}),
							tab !== "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: req.status === "approved" ? "default" : "destructive",
								className: "shrink-0 text-[10px] capitalize",
								children: req.status
							})
						]
					}, req.id))]
				}, tab)
			})
		] })
	});
}
var PRIORITY_COLORS = {
	high: "text-destructive",
	medium: "text-muted-foreground",
	low: "text-muted-foreground"
};
function PerformanceCenter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Performance Center",
				subtitle: "Team KPIs, goals & reviews",
				link: "/dashboard/performance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "Team Score Trend"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: PERF_MONTHLY,
							margin: {
								top: 4,
								right: 8,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "perfGrad",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "5%",
										stopColor: "var(--chart-1)",
										stopOpacity: .25
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "95%",
										stopColor: "var(--chart-1)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.1)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false,
									domain: [70, 100]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "score",
									stroke: "var(--chart-1)",
									strokeWidth: 2,
									fill: "url(#perfGrad)",
									name: "Score"
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Team Goal Progress"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: TEAM_GOALS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium truncate",
									children: g.goal
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `shrink-0 font-semibold text-[10px] uppercase ${PRIORITY_COLORS[g.priority] || ""}`,
									children: g.priority
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2 ml-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: g.owner.split(" ")[0]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [g.progress, "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["· ", g.dueDate]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full rounded-full transition-all duration-700 bg-primary`,
								style: { width: `${g.progress}%` }
							})
						})] }, g.goal))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "🏆 Top Performers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: TOP_PERFORMERS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: p.role
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: p.score
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: p.trend
								})]
							})
						]
					}, p.name))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "⚠️ Needs Attention"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: LOW_PERFORMERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: p.role
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground",
									children: p.score
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: p.trend
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }),
								" ",
								p.action
							]
						})]
					}, p.name))
				})] })]
			})
		] })
	});
}
function RecruitmentSection() {
	const PRIORITY_BG = {
		high: statusBadgeClass("critical"),
		medium: statusBadgeClass("warning"),
		low: statusBadgeClass("default")
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Recruitment",
			subtitle: "Team hiring requests and pipeline",
			link: "/dashboard/recruitment"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "Hiring Requests"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: HIRING_REQUESTS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: r.role
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										r.department,
										" · Target: ",
										r.targetDate
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_BG[r.priority]}`,
									children: r.priority
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: r.status === "interviewing" ? "default" : "secondary",
									className: "text-[10px] capitalize",
									children: r.status
								})]
							})
						]
					}, r.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "Candidate Pipeline"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-36",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: CANDIDATE_PIPELINE,
							layout: "vertical",
							margin: {
								left: 0,
								right: 16,
								top: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.1)",
									horizontal: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "stage",
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false,
									width: 64
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									radius: [
										0,
										6,
										6,
										0
									],
									fill: "var(--chart-1)"
								})
							]
						})
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "Upcoming Interviews"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: MANAGER_INTERVIEWS.map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: iv.candidate
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										iv.role,
										" · ",
										iv.type
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium",
									children: iv.time
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "mt-0.5 text-[10px]",
									children: iv.stage
								})]
							})
						]
					}, iv.candidate))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/recruitment/calendar",
						className: "flex-1 rounded-xl border border-border bg-background/50 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
						children: "View Calendar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/recruitment/candidates",
						className: "flex-1 rounded-xl border border-border bg-background/50 py-2.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
						children: "All Candidates"
					})]
				})
			] })]
		})] })
	});
}
function AssetsSection() {
	const STATUS_COLORS = {
		assigned: statusBadgeClass("default"),
		"pending-return": statusBadgeClass("warning"),
		damaged: statusBadgeClass("critical"),
		returned: statusBadgeClass("approved")
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Team Assets",
				subtitle: "Asset inventory for your team",
				link: "/dashboard/assets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: TEAM_ASSET_SUMMARY.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl font-semibold text-foreground",
						children: a.count
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: a.label
					})]
				}, a.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: TEAM_ASSETS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: a.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									a.assignedTo,
									" · Tag: ",
									a.tag,
									" · Since: ",
									a.since
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[a.status] ?? "bg-muted text-muted-foreground"}`,
							children: a.status.replace("-", " ")
						})
					]
				}, a.id))
			})
		] })
	});
}
var LEVEL_BADGE = {
	high: statusBadgeClass("approved"),
	moderate: statusBadgeClass("warning"),
	low: statusBadgeClass("critical"),
	positive: statusBadgeClass("approved")
};
function AIInsights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "AI Insights",
			subtitle: "AI-powered team intelligence",
			link: "/ai/workforce-insights"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: AI_TEAM_INSIGHTS.map((insight, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				...stagger(i),
				className: "flex flex-col gap-3 rounded-xl bg-card border border-border p-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-foreground",
								children: insight.category
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `text-[10px] capitalize border ${LEVEL_BADGE[insight.level]}`,
							children: insight.level
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground leading-relaxed",
						children: insight.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto rounded-lg bg-muted/40 border border-border px-3 py-2 text-[11px] text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-primary",
							children: "Action: "
						}), insight.action]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "AI Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold text-foreground",
							children: insight.score
						})]
					})
				]
			}, insight.category))
		})] })
	});
}
function NotificationsSection() {
	const { items } = useNotifications({ limit: 5 });
	const archiveMutation = useArchive();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Notifications",
			subtitle: "Pending actions and alerts",
			link: "/dashboard/notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [items.map((n) => {
				const isUrgent = n.priority === "critical" || n.priority === "high";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-start gap-3 rounded-xl border border-border px-3 py-2.5 ${isUrgent ? "bg-destructive/5 border-destructive/20" : "bg-card border-border"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${isUrgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: n.title
									}),
									isUrgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										className: "h-4 px-1.5 text-[10px] uppercase font-bold",
										children: n.priority
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "h-4 px-1 text-[9px] capitalize",
										children: n.category.replace(/_/g, " ")
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: n.body
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground font-mono",
								children: formatRelativeTime(n.createdAt)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => archiveMutation.mutate(n.id),
								className: "rounded-md p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground cursor-pointer",
								"aria-label": "Dismiss notification",
								title: "Dismiss",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})]
						})
					]
				}, n.id);
			}), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground" }), "All caught up! No pending notifications."]
			})]
		})] })
	});
}
function ReportsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Reports",
			subtitle: "Generate team reports instantly",
			link: "/dashboard/reports"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
			children: MANAGER_REPORTS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: r.link,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group flex flex-col items-center gap-2.5 rounded-xl bg-card border border-border p-4 text-center transition-all hover:bg-muted/50 hover:shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-foreground leading-tight",
						children: r.label
					})]
				})
			}, r.label))
		})] })
	});
}
function ManagerDashboard() {
	const ws = useAurix();
	const firstName = ws.user?.fullName?.split(" ")[0] ?? "Manager";
	const companyName = ws.company?.name ?? "OFC360";
	const hour = (/* @__PURE__ */ new Date()).getHours();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagerHeader, {
				greeting: hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening",
				userName: firstName,
				companyName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCards, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamOverview, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsSection, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceCenter, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveCenter, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceCenter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentSection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetsSection, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIInsights, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsSection, {})
		]
	});
}
function ManagerPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagerDashboard, {});
}
//#endregion
export { ManagerPage };
