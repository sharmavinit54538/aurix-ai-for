import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as TrendingDown, Dr as ChevronRight, Dt as Package, E as TrendingUp, H as Sparkles, Ln as FileText, Sr as CircleCheck, Ur as CalendarDays, Xr as Bot, a as X, er as Download, i as Zap, ni as Bell, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as useNotifications, i as useArchive, t as formatRelativeTime } from "./notification-utils-1y-FPLpt.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { S as Tooltip, c as YAxis, d as Line, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, s as LineChart, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeePage-CcGtukMu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMP_KPI = [];
var MY_ATTENDANCE = [];
var MY_LEAVES = [];
var LEAVE_QUOTA = [];
var MY_GOALS = [];
var MY_PAYSLIPS = [];
var MY_DOCUMENTS = [];
var COMPANY_EVENTS = [];
var MY_ATTENDANCE_TREND = [];
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
		delay: i * .06
	}
});
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card shadow-sm p-5 ${className}`,
		children
	});
}
function SectionHeader({ title, subtitle, link, linkLabel = "View More" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: subtitle
		})] }), link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
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
var ATTENDANCE_STATUS = {
	present: statusBadgeClass("approved"),
	late: statusBadgeClass("warning"),
	leave: statusBadgeClass("info"),
	wfh: statusBadgeClass("info"),
	absent: statusBadgeClass("critical")
};
var EVENT_COLOR = {
	meeting: statusBadgeClass("info"),
	holiday: statusBadgeClass("approved"),
	event: statusBadgeClass("warning")
};
var EMP_QUICK_ACTIONS = [
	{
		label: "Apply Leave",
		icon: FileText,
		link: "/dashboard/leaves"
	},
	{
		label: "View Payslip",
		icon: Download,
		link: "/dashboard/payroll/payslips"
	},
	{
		label: "My Attendance",
		icon: Clock,
		link: "/dashboard/attendance"
	},
	{
		label: "My Documents",
		icon: FileText,
		link: "/dashboard/documents"
	},
	{
		label: "My Assets",
		icon: Package,
		link: "/dashboard/assets"
	},
	{
		label: "AI Assistant",
		icon: Bot,
		link: "/ai/chat-assistant"
	}
];
function EmployeeHeader({ firstName: _firstName, companyName: _companyName } = {}) {
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
		className: "rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-end gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/ai/chat-assistant",
				className: "flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:-translate-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " AI Assistant"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
			children: EMP_QUICK_ACTIONS.map((a, i) => {
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
function EmployeeKpiCards() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
		children: EMP_KPI.map((kpi, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
						className: `mt-1.5 flex items-center gap-1 text-[11px] font-medium ${kpi.changeType === "up" ? "text-foreground" : kpi.changeType === "down" ? "text-destructive" : "text-muted-foreground"}`,
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
									stroke: "var(--primary)",
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
function MyAttendance() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "My Attendance",
				subtitle: "Recent check-in / check-out log",
				link: "/dashboard/attendance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 h-36",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: MY_ATTENDANCE_TREND,
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
								dataKey: "week",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false,
								domain: [0, 5]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									fontSize: 12
								},
								formatter: (v) => [`${v} days`, "Days Present"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "days",
								radius: [
									4,
									4,
									0,
									0
								],
								fill: "var(--primary)"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: MY_ATTENDANCE.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-20 shrink-0 text-xs text-muted-foreground",
							children: new Date(a.date).toLocaleDateString("en-IN", {
								day: "numeric",
								month: "short"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${ATTENDANCE_STATUS[a.status]}`,
							children: a.status === "wfh" ? "WFH" : a.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 text-xs text-muted-foreground",
							children: a.checkIn ? `${a.checkIn} → ${a.checkOut || "–"}` : "Not recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-xs font-medium",
							children: a.hours
						})
					]
				}, a.date))
			})
		] })
	});
}
function MyLeaves() {
	const [tab, setTab] = (0, import_react.useState)("history");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "My Leaves",
				subtitle: "Leave history and balance",
				link: "/dashboard/leaves"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-2",
				children: ["history", "balance"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: `rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${tab === t ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`,
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
				mode: "wait",
				children: [tab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
					children: MY_LEAVES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: l.type
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: l.status === "approved" ? "default" : l.status === "pending" ? "secondary" : "destructive",
										className: "text-[10px] capitalize",
										children: l.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										l.from,
										" → ",
										l.to,
										" · ",
										l.days,
										" day",
										l.days !== 1 ? "s" : "",
										" · Applied ",
										l.appliedOn
									]
								}),
								l.approvedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: ["Approved by ", l.approvedBy]
								})
							]
						})
					}, l.id))
				}, "history"), tab === "balance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
					className: "space-y-3",
					children: LEAVE_QUOTA.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: q.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: q.remaining
								}),
								"/",
								q.total,
								" remaining"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all duration-700",
							style: { width: `${q.remaining / q.total * 100}%` }
						})
					})] }, q.type))
				}, "balance")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard/leaves",
				className: "mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), " Apply New Leave"]
			})
		] })
	});
}
function MyPerformance() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "My Performance",
				subtitle: "Goals and self-assessment",
				link: "/dashboard/performance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-4 rounded-xl border border-border bg-background/50 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl font-bold text-foreground",
						children: "87"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Score"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Performance Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "87/100"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: 87,
							className: "h-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: "+5pts from last quarter · Excellent trajectory"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "My Goals"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: MY_GOALS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: g.goal
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [
							"Due ",
							g.due,
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [g.progress, "%"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all duration-700",
						style: { width: `${g.progress}%` }
					})
				})] }, g.goal))
			})
		] })
	});
}
function MyPayslips() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "My Payslips",
			subtitle: "Salary statements",
			link: "/dashboard/payroll/payslips"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: MY_PAYSLIPS.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground py-3 text-center",
				children: "No finalized payslips available yet."
			}) : MY_PAYSLIPS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: p.month
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Gross: ",
								p.gross,
								" · Paid on ",
								p.date
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-foreground",
							children: p.net
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "default",
							className: "text-[10px]",
							children: "Paid"
						})]
					})
				]
			}, p.month))
		})] })
	});
}
function MyDocuments() {
	const DOC_STATUS_STYLE = {
		verified: statusBadgeClass("approved"),
		pending: statusBadgeClass("pending"),
		rejected: statusBadgeClass("critical")
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "My Documents",
			subtitle: "Document verification status",
			link: "/dashboard/documents"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: MY_DOCUMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: d.name
						}), d.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: d.dueDate
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${DOC_STATUS_STYLE[d.status]}`,
						children: d.status
					})
				]
			}, d.name))
		})] })
	});
}
function MyAssets() {
	const ws = useAurix();
	const userName = (ws.user?.fullName || "").trim().toLowerCase();
	const userId = String(ws.user?.id || "").toLowerCase();
	const { data: listData, isLoading } = useQuery({
		queryKey: ["assets"],
		queryFn: () => api.get("assets?limit=100")
	});
	const raw = listData?.data?.items ?? listData?.data ?? listData?.items ?? (Array.isArray(listData) ? listData : []);
	const assignedAssets = (Array.isArray(raw) ? raw : []).filter((a) => {
		const assigned = (a.assignedTo || a.assigned_to || a.assigned_to_name || a.assigned_employee_name || "").toString().trim().toLowerCase();
		const assignedId = String(a.assignedToId || a.assigned_to_id || a.employeeId || a.employee_id || a.userId || a.user_id || "").toLowerCase();
		if (userName && (assigned === userName || assigned.includes(userName) || userName.includes(assigned))) return true;
		if (userId && (assigned === userId || assignedId === userId)) return true;
		return false;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "My Assets",
			subtitle: "Assigned company equipment",
			link: "/dashboard/assets"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-6 text-center text-xs text-muted-foreground",
				children: "Loading assigned equipment..."
			}) : assignedAssets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-6 text-center text-xs text-muted-foreground",
				children: "No company equipment currently assigned."
			}) : assignedAssets.slice(0, 4).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: a.name || a.asset_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Tag: ",
								a.tag || a.asset_tag || "AST",
								" · ",
								a.brand || "Hardware"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "text-[10px] capitalize",
						children: a.status || "active"
					})
				]
			}, a.id || a.tag))
		})] })
	});
}
function EmployeeCalendar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Company Calendar",
			subtitle: "Upcoming events and holidays",
			link: "/dashboard/attendance/holidays"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: COMPANY_EVENTS.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-start gap-3 rounded-xl border px-3 py-2.5 ${EVENT_COLOR[ev.type] ?? "bg-muted/40 border-border"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mt-0.5 h-4 w-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: ev.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs opacity-70",
							children: [new Date(ev.date).toLocaleDateString("en-IN", {
								day: "numeric",
								month: "short"
							}), ev.time ? ` · ${ev.time}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "shrink-0 capitalize text-[10px] border-current",
						children: ev.type
					})
				]
			}, i))
		})] })
	});
}
function EmployeeNotifications() {
	const { items } = useNotifications({ limit: 5 });
	const archiveMutation = useArchive();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Notifications",
			link: "/dashboard/notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [items.map((n) => {
				const isUrgent = n.priority === "critical" || n.priority === "high";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 rounded-xl border border-border bg-background/50 px-3 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${isUrgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-3.5 w-3.5" })
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
				className: "py-6 text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-2 h-7 w-7 text-muted-foreground" }), "All caught up! No notifications."]
			})]
		})] })
	});
}
function EmployeeDashboard() {
	const ws = useAurix();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeHeader, {
				firstName: ws.user?.fullName?.split(" ")[0] ?? "there",
				companyName: ws.company?.name ?? "OFC360"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeKpiCards, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyAttendance, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyLeaves, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyPerformance, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyPayslips, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyDocuments, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyAssets, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeCalendar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeNotifications, {})]
			})
		]
	});
}
function EmployeePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeDashboard, {});
}
//#endregion
export { EmployeePage };
