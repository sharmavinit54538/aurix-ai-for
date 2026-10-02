import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Cn as GitPullRequest, D as TrendingDown, Dr as ChevronRight, E as TrendingUp, Gn as FileCheck, H as Sparkles, J as ShieldAlert, O as TreePalm, Or as ChevronLeft, Ot as PackageCheck, P as Target, Rt as Megaphone, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Z as Server, ai as BadgeCheck, ar as Cpu, ci as ArrowUpDown, d as Wallet, dr as CodeXml, er as Download, ft as Printer, i as Zap, ir as CreditCard, j as TicketCheck, jn as Funnel, lt as RefreshCw, nr as Database, on as Laptop, p as Users, pr as Clock, q as ShieldCheck, rr as Crown, s as Workflow, si as ArrowUpRight, tr as DollarSign, ur as Code, x as UserCheck, xn as Globe, yt as Percent } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExecutiveRoleDashboardView-a57a5a5A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES_NAV = [
	{
		role: "ceo",
		label: "CEO Dashboard",
		icon: Crown,
		color: "text-amber-400 border-amber-500/30 bg-amber-500/10"
	},
	{
		role: "cto",
		label: "CTO Dashboard",
		icon: CodeXml,
		color: "text-purple-400 border-purple-500/30 bg-purple-500/10"
	},
	{
		role: "cfo",
		label: "CFO Dashboard",
		icon: DollarSign,
		color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
	},
	{
		role: "cio",
		label: "CIO Dashboard",
		icon: Server,
		color: "text-blue-400 border-blue-500/30 bg-blue-500/10"
	},
	{
		role: "coo",
		label: "COO Dashboard",
		icon: Workflow,
		color: "text-sky-400 border-sky-500/30 bg-sky-500/10"
	},
	{
		role: "cmo",
		label: "CMO Dashboard",
		icon: Megaphone,
		color: "text-rose-400 border-rose-500/30 bg-rose-500/10"
	}
];
function ExecutiveHeader({ role, title, subtitle, healthScore, dateRange, setDateRange, onRefresh }) {
	const navigate = useNavigate();
	const handleExport = (format) => {
		if (format === "print") {
			window.print();
			return;
		}
		toast.success(`Exporting ${role.toUpperCase()} Executive Report as ${format.toUpperCase()}...`);
	};
	const currentRoleObj = ROLES_NAV.find((r) => r.role === role) || ROLES_NAV[0];
	const RoleIcon = currentRoleObj.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "hover:text-foreground transition-colors",
						children: "Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/executive",
						className: "hover:text-foreground transition-colors",
						children: "Executive Control Center"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground capitalize",
						children: [role.toUpperCase(), " Dashboard"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 h-56 w-56 rounded-full bg-brand/10 blur-3xl pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${currentRoleObj.color}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleIcon, { className: "h-3.5 w-3.5" }),
										role.toUpperCase(),
										" Executive Command"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }),
										"Health Score: ",
										healthScore,
										"%"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-2xl text-sm text-muted-foreground leading-relaxed",
								children: subtitle
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 bg-accent/30 border border-border/60 rounded-lg p-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground ml-1.5" }), [
								"today",
								"week",
								"month",
								"quarter",
								"year"
							].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDateRange(r),
								className: `px-2 py-1 rounded-md capitalize font-medium transition-all cursor-pointer ${dateRange === r ? "bg-brand text-brand-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
								children: r
							}, r))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-9 text-xs gap-1.5 border-border/60 hover:bg-accent cursor-pointer",
									onClick: () => handleExport("pdf"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-emerald-400" }), " Export PDF"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-9 text-xs gap-1.5 border-border/60 hover:bg-accent cursor-pointer",
									onClick: () => handleExport("excel"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-blue-400" }), " Excel"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "h-9 w-9 border-border/60 hover:bg-accent cursor-pointer",
									onClick: () => handleExport("print"),
									title: "Print Report",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "h-9 w-9 border-border/60 hover:bg-accent cursor-pointer",
									onClick: onRefresh || (() => toast.success("Refreshed executive dataset.")),
									title: "Refresh Dataset",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" })
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5 overflow-x-auto pb-1",
				children: ROLES_NAV.map((nav) => {
					const Icon = nav.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => navigate({ to: `/dashboard/executive/${nav.role}` }),
						className: `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${nav.role === role ? `${nav.color} shadow-sm border-brand/50` : "border-border/40 bg-card/40 text-muted-foreground hover:bg-accent/40 hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: nav.label })]
					}, nav.role);
				})
			})
		]
	});
}
var ICON_MAP = {
	TrendingUp,
	TrendingDown,
	DollarSign,
	Users,
	UserCheck,
	CreditCard,
	Target,
	ShieldCheck,
	Zap,
	Code,
	GitPullRequest,
	Server,
	Cpu,
	Wallet,
	Percent,
	FileCheck,
	BadgeCheck,
	Laptop,
	ShieldAlert,
	TicketCheck,
	PackageCheck,
	Database,
	Workflow,
	Palmtree: TreePalm,
	Globe,
	Filter: Funnel
};
function ExecutiveKpiCard({ kpi, loading }) {
	const Icon = ICON_MAP[kpi.iconName] || TrendingUp;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-md animate-pulse space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-24 bg-muted/60 rounded" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-32 bg-muted/80 rounded" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-28 bg-muted/40 rounded" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		whileHover: {
			y: -3,
			scale: 1.01
		},
		transition: { duration: .2 },
		className: "relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
				children: kpi.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-2xl font-bold mt-1 text-foreground tracking-tight",
				children: kpi.value
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `p-2.5 rounded-xl bg-accent/40 ${kpi.color}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-full border ${kpi.isPositive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`,
				children: [kpi.isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }), kpi.change]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-medium text-muted-foreground truncate max-w-[140px]",
				children: kpi.subtext
			})]
		})]
	});
}
function ExecutiveAiInsightCard({ insights, roleTitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 backdrop-blur-xl text-left space-y-4 shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 font-display text-sm font-bold text-indigo-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-brand animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [roleTitle, " AI Intelligence Recommendations"] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-mono font-semibold bg-brand/10 text-brand px-2.5 py-0.5 rounded-full border border-brand/30",
				children: "Autonomous Copilot"
			})]
		}), insights.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-3 gap-3",
			children: insights.map((item, idx) => {
				const isHigh = item.severity === "high";
				const isSuccess = item.severity === "success";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .2,
						delay: idx * .05
					},
					className: `rounded-xl border p-3.5 space-y-1.5 bg-card/60 backdrop-blur-md transition-all duration-200 hover:border-brand/40 ${isHigh ? "border-amber-500/30 bg-amber-500/5" : isSuccess ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/60"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
								children: item.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground/80",
								children: item.timestamp
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "font-display text-xs font-bold text-foreground flex items-center justify-between gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title }), isSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-400 shrink-0" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground leading-relaxed",
							children: item.description
						}),
						item.actionText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.actionText }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
						})
					]
				}, item.id);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border/70 p-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"No executive AI recommendations generated for ",
					roleTitle,
					" at this time."
				]
			})
		})]
	});
}
function ExecutiveDataTable({ title, description, headers, rows }) {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [sortKey, setSortKey] = (0, import_react.useState)("name");
	const [sortOrder, setSortOrder] = (0, import_react.useState)("asc");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const pageSize = 5;
	const categories = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		rows.forEach((r) => {
			if (r.category) set.add(r.category);
		});
		return Array.from(set);
	}, [rows]);
	const filteredRows = (0, import_react.useMemo)(() => {
		return rows.filter((r) => {
			const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.owner.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
			return matchesSearch && matchesCategory;
		});
	}, [
		rows,
		searchTerm,
		categoryFilter
	]);
	const sortedRows = (0, import_react.useMemo)(() => {
		return [...filteredRows].sort((a, b) => {
			const valA = String(a[sortKey] || "").toLowerCase();
			const valB = String(b[sortKey] || "").toLowerCase();
			if (valA < valB) return sortOrder === "asc" ? -1 : 1;
			if (valA > valB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
	}, [
		filteredRows,
		sortKey,
		sortOrder
	]);
	const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
	const paginatedRows = (0, import_react.useMemo)(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedRows.slice(start, start + pageSize);
	}, [
		sortedRows,
		currentPage,
		pageSize
	]);
	const toggleSort = (key) => {
		if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		else {
			setSortKey(key);
			setSortOrder("asc");
		}
	};
	const handleExportCSV = () => {
		const csvContent = "data:text/csv;charset=utf-8," + [headers.map((h) => h.label).join(","), ...rows.map((r) => headers.map((h) => `"${r[h.key] || ""}"`).join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_report.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Exported CSV data report!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4 text-left shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-bold text-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: description
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-48",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								placeholder: "Search records...",
								className: "pl-8 h-8 text-xs bg-muted/20 border-border/60"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: categoryFilter,
							onChange: (e) => setCategoryFilter(e.target.value),
							className: "h-8 rounded-lg border border-border/60 bg-background px-2.5 text-xs font-medium text-foreground cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Categories"
							}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handleExportCSV,
							className: "h-8 text-xs gap-1.5 border-border/60 hover:bg-accent cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " CSV"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-muted-foreground font-semibold border-b border-border/50 uppercase tracking-wider text-[10px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							onClick: () => toggleSort(h.key),
							className: "px-4 py-3 cursor-pointer hover:text-foreground transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 opacity-60" })]
							})
						}, h.key)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border/40",
						children: paginatedRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: headers.length,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: "No matching executive records found."
						}) }) : paginatedRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "hover:bg-accent/30 transition-colors",
							children: headers.map((h) => {
								const val = row[h.key];
								if (h.key === "status") {
									const isOk = String(val).toLowerCase().includes("track") || String(val).toLowerCase().includes("complete") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("healthy") || String(val).toLowerCase().includes("optimal") || String(val).toLowerCase().includes("active");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOk ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`,
											children: [isOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), String(val)]
										})
									}, h.key);
								}
								if (h.key === "progress" && row.progress !== void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 min-w-[120px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
											value: row.progress,
											className: "h-1.5 flex-1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] text-muted-foreground",
											children: [row.progress, "%"]
										})]
									})
								}, h.key);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium text-foreground",
									children: val ?? "—"
								}, h.key);
							})
						}, row.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Showing ",
					paginatedRows.length,
					" of ",
					sortedRows.length,
					" entries"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							disabled: currentPage === 1,
							onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
							className: "h-7 w-7 text-xs border-border/60 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2 font-mono font-semibold",
							children: [
								currentPage,
								" / ",
								totalPages
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							disabled: currentPage === totalPages,
							onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
							className: "h-7 w-7 text-xs border-border/60 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
						})
					]
				})]
			})
		]
	});
}
var ROLE_META = {
	ceo: {
		title: "Chief Executive Officer Command Center",
		subtitle: "Enterprise Business Performance, ARR Growth, OKR Tracking & Strategic Health",
		tableTitle: "Strategic Corporate Projects & Initiatives",
		tableDesc: "High-priority enterprise initiatives monitored by executive committee"
	},
	cto: {
		title: "Chief Technology Officer Command Center",
		subtitle: "System Health, Engineering Velocity, Infrastructure Cost, CI/CD & AI Architecture",
		tableTitle: "Engineering Milestones & Critical Infrastructure Deliverables",
		tableDesc: "Strategic engineering initiatives and core platform roadmap deliverables"
	},
	cfo: {
		title: "Chief Financial Officer Command Center",
		subtitle: "Corporate Financials, Runway, Cash Flow, OPEX & Department Budget Allocations",
		tableTitle: "Capital Expenditures & Department Budget Allocations",
		tableDesc: "Enterprise financial outlays, capital expenditures and department burn monitoring"
	},
	cio: {
		title: "Chief Information Officer Command Center",
		subtitle: "Enterprise IT Operations, Global Infrastructure, Cybersecurity & Compliance",
		tableTitle: "IT Projects, System Migrations & Compliance Audits",
		tableDesc: "Enterprise technology deployments, security assessments and infrastructure lifecycle"
	},
	coo: {
		title: "Chief Operating Officer Command Center",
		subtitle: "Workforce Productivity, Operational Bottlenecks, Facility SLA & Supply Chain",
		tableTitle: "Operational Efficiency & Process Optimization Initiatives",
		tableDesc: "Enterprise operations, SLA compliance and business continuity programs"
	},
	cmo: {
		title: "Chief Marketing Officer Command Center",
		subtitle: "Brand Presence, Customer Acquisition Cost, Pipeline Generation & Marketing ROI",
		tableTitle: "Strategic Marketing Campaigns & Brand Growth Initiatives",
		tableDesc: "Global customer acquisition campaigns, brand equity and go-to-market initiatives"
	}
};
function getDataset(role) {
	const meta = ROLE_META[role] ?? ROLE_META.ceo;
	return {
		role,
		title: meta.title,
		subtitle: meta.subtitle,
		healthScore: 0,
		kpis: [],
		charts: [],
		tableData: {
			title: meta.tableTitle,
			description: meta.tableDesc,
			headers: [
				{
					key: "name",
					label: "Initiative / Project"
				},
				{
					key: "category",
					label: "Business Unit"
				},
				{
					key: "owner",
					label: "Executive Sponsor"
				},
				{
					key: "value",
					label: "Impact / Budget"
				},
				{
					key: "status",
					label: "Status"
				},
				{
					key: "progress",
					label: "Completion"
				}
			],
			rows: []
		},
		aiInsights: [],
		okrs: []
	};
}
function ExecutiveRoleDashboardView({ role }) {
	const [dateRange, setDateRange] = (0, import_react.useState)("month");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const dataset = getDataset(role);
	const handleRefresh = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			toast.success(`Refreshed ${role.toUpperCase()} Executive Analytics.`);
		}, 400);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveHeader, {
				role,
				title: dataset.title,
				subtitle: dataset.subtitle,
				healthScore: dataset.healthScore,
				dateRange,
				setDateRange,
				onRefresh: handleRefresh
			}),
			dataset.kpis.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4",
				children: dataset.kpis.map((kpi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveKpiCard, {
					kpi,
					loading: isLoading
				}, kpi.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-8 w-8 text-muted-foreground/60 mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "No executive KPI metrics available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-md mx-auto",
						children: [
							"Live ",
							role.toUpperCase(),
							" operational telemetry is not currently configured or backend integration is pending."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveAiInsightCard, {
				insights: dataset.aiInsights,
				roleTitle: role.toUpperCase()
			}),
			dataset.charts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: dataset.charts.map((chart, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3 text-left shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-bold text-foreground",
						children: chart.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: chart.description
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72 w-full pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: chart.type === "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: chart.data,
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: chart.dataKeys.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: `grad-${dk.key}`,
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: dk.color,
											stopOpacity: .4
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: dk.color,
											stopOpacity: 0
										})]
									}, dk.key)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "rgba(255,255,255,0.08)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
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
									chart.dataKeys.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: dk.key,
										name: dk.label,
										stroke: dk.color,
										fill: `url(#grad-${dk.key})`,
										strokeWidth: 2
									}, dk.key))
								]
							}) : chart.type === "pie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									backgroundColor: "#0f172a",
									borderColor: "rgba(255,255,255,0.15)",
									borderRadius: "12px",
									fontSize: "12px"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: "11px" } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: chart.data,
									dataKey: "value",
									nameKey: "name",
									cx: "50%",
									cy: "50%",
									outerRadius: 95,
									innerRadius: 50,
									paddingAngle: 4,
									children: chart.data.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: [
										"#10b981",
										"#6366f1",
										"#38bdf8",
										"#f59e0b",
										"#ec4899"
									][index % 5] }, `cell-${index}`))
								})
							] }) : chart.type === "line" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: chart.data,
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
										dataKey: "name",
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: "11px" } }),
									chart.dataKeys.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: dk.key,
										name: dk.label,
										stroke: dk.color,
										strokeWidth: 2.5,
										dot: { r: 4 }
									}, dk.key))
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chart.data,
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
										dataKey: "name",
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: "11px" } }),
									chart.dataKeys.map((dk) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: dk.key,
										name: dk.label,
										fill: dk.color,
										radius: [
											6,
											6,
											0,
											0
										]
									}, dk.key))
								]
							})
						})
					})]
				}, idx))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-8 w-8 text-muted-foreground/60 mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "No telemetry charts available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-md mx-auto",
						children: [
							"Historical metric trends and predictive visual models for ",
							role.toUpperCase(),
							" will appear once backend telemetry feeds are connected."
						]
					})
				]
			}),
			dataset.okrs && dataset.okrs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3 text-left shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-bold font-display text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Corporate Key Results & Executive OKRs" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: dataset.okrs.map((okr, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/50 bg-accent/20 p-3.5 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: okr.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-indigo-400",
									children: okr.target
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: okr.current,
								className: "h-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sponsor: ", okr.owner] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-foreground",
									children: [okr.current, "% Achieved"]
								})]
							})
						]
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveDataTable, {
				title: dataset.tableData.title,
				description: dataset.tableData.description,
				headers: dataset.tableData.headers,
				rows: dataset.tableData.rows
			})
		]
	});
}
//#endregion
export { ExecutiveRoleDashboardView as t };
