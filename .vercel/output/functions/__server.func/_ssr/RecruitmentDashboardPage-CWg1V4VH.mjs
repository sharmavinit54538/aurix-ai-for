import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, H as Sparkles, It as MessageSquare, Jr as Briefcase, Kn as FileCheckCorner, Ln as FileText, Mn as Folder, P as Target, Q as Send, Sr as CircleCheck, Vn as FilePenLine, Wr as CalendarClock, X as Settings, _ as UserPlus, bn as GraduationCap, cr as Coins, f as Video, lt as RefreshCw, on as Laptop, p as Users, pr as Clock, q as ShieldCheck, s as Workflow, sr as Compass, vr as CircleX, x as UserCheck, xn as Globe, zn as FileSearch } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { o as fetchRecruitmentData } from "./recruitmentThunk-t5FBRB6R.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { s as fmtDate, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
import { a as buildHiringTrendData, c as computeDashboardStats, i as buildFunnelData, n as CHART_TOOLTIP_STYLE, o as buildRecentActivity, r as buildDepartmentHiringData, t as CHART_COLORS } from "./dashboard-Z73MyXDx.mjs";
import { t as Loader } from "./Loader-Cc5dgb_b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentDashboardPage-CWg1V4VH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChartCard({ title, subtitle, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex items-end justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-sm font-semibold",
				children: title
			}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: subtitle
			}) : null] })
		}), children]
	});
}
function RecruitmentDashboardCharts({ funnel, byDept }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Hiring Funnel",
			subtitle: "Candidates per stage",
			className: "lg:col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: 280,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: funnel,
					margin: {
						top: 10,
						right: 10,
						left: -10,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "oklch(0.5 0.02 264 / 0.15)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "stage",
							stroke: "currentColor",
							className: "text-[10px] text-muted-foreground",
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							stroke: "currentColor",
							className: "text-xs text-muted-foreground",
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: CHART_TOOLTIP_STYLE }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "count",
							radius: [
								8,
								8,
								0,
								0
							],
							children: funnel.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, index))
						})
					]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Department Hiring",
			subtitle: "Applicants by department",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: 280,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: byDept,
						dataKey: "value",
						nameKey: "name",
						cx: "50%",
						cy: "50%",
						innerRadius: 50,
						outerRadius: 90,
						paddingAngle: 3,
						children: byDept.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, index))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: CHART_TOOLTIP_STYLE }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
				] })
			})
		})]
	});
}
function RecruitmentHiringTrendChart({ monthlyHires, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
		title: "Hiring Trend",
		subtitle: "Hires vs offers, last 6 months",
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: 260,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: monthlyHires,
				margin: {
					top: 10,
					right: 10,
					left: -10,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "gh",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: CHART_COLORS[0],
							stopOpacity: .5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: CHART_COLORS[0],
							stopOpacity: 0
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "go",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: CHART_COLORS[2],
							stopOpacity: .5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: CHART_COLORS[2],
							stopOpacity: 0
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: "oklch(0.5 0.02 264 / 0.15)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "m",
						stroke: "currentColor",
						className: "text-xs text-muted-foreground",
						tickLine: false,
						axisLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						stroke: "currentColor",
						className: "text-xs text-muted-foreground",
						tickLine: false,
						axisLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: CHART_TOOLTIP_STYLE }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "offers",
						stroke: CHART_COLORS[2],
						strokeWidth: 2,
						fill: "url(#go)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "hires",
						stroke: CHART_COLORS[0],
						strokeWidth: 2,
						fill: "url(#gh)"
					})
				]
			})
		})
	});
}
function buildKpiConfigs(stats) {
	return [
		{
			label: "Total Jobs",
			value: stats.totalJobs,
			icon: Briefcase,
			accent: "from-violet-500/20 to-fuchsia-500/10"
		},
		{
			label: "Active Jobs",
			value: stats.activeJobs,
			icon: TrendingUp,
			accent: "from-emerald-500/20 to-teal-500/10"
		},
		{
			label: "Draft Jobs",
			value: stats.draftJobs,
			icon: FileCheckCorner,
			accent: "from-sky-500/20 to-cyan-500/10"
		},
		{
			label: "Closed Jobs",
			value: stats.closedJobs,
			icon: CircleX,
			accent: "from-rose-500/15 to-red-500/10"
		},
		{
			label: "Candidates",
			value: stats.totalCandidates,
			icon: Users,
			accent: "from-indigo-500/20 to-violet-500/10"
		},
		{
			label: "Shortlisted",
			value: stats.shortlisted,
			icon: UserCheck,
			accent: "from-amber-500/20 to-orange-500/10"
		},
		{
			label: "Interviews",
			value: stats.interviewScheduled,
			icon: CalendarClock,
			accent: "from-cyan-500/20 to-sky-500/10"
		},
		{
			label: "Selected",
			value: stats.selected,
			icon: CircleCheck,
			accent: "from-emerald-500/20 to-green-500/10"
		},
		{
			label: "Rejected",
			value: stats.rejected,
			icon: CircleX,
			accent: "from-rose-500/15 to-pink-500/10"
		},
		{
			label: "Offers Sent",
			value: stats.offersSent,
			icon: FileCheckCorner,
			accent: "from-fuchsia-500/20 to-purple-500/10"
		},
		{
			label: "Offers Accepted",
			value: stats.offersAccepted,
			icon: UserPlus,
			accent: "from-emerald-500/20 to-teal-500/10"
		},
		{
			label: "Time to Hire",
			value: stats.timeToHireDays > 0 ? `${stats.timeToHireDays}d` : "—",
			icon: Clock,
			accent: "from-amber-500/20 to-yellow-500/10"
		}
	];
}
function RecruitmentDashboardKpis({ stats }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4",
		children: buildKpiConfigs(stats).map((kpi, index) => {
			const Icon = kpi.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { animation: `fade-in 400ms ease-out ${index * 30}ms both` },
				className: `relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${kpi.accent} p-4 backdrop-blur-xl shadow-sm`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
						children: kpi.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-semibold tracking-tight",
						children: kpi.value
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-background/60 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					})]
				})
			}, kpi.label);
		})
	});
}
function RecruitmentRecentActivity({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-sm font-semibold",
				children: "Recent Activity"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: "Latest pipeline events"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
					name: item.who,
					size: 28
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: item.who
							}),
							" — ",
							item.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-[11px] text-muted-foreground",
						children: [
							item.jobTitle,
							" · ",
							fmtDate(item.at)
						]
					})]
				})]
			}, item.id))
		})]
	});
}
var RECRUITMENT_MODULES_LIST = [
	{
		id: "workforce-planning",
		title: "Workforce Planning",
		description: "Align headcount demands with company strategy, budget cap modeling, and requisition approvals.",
		icon: Target,
		to: "/dashboard/recruitment/workforce-planning",
		color: "from-blue-600/20 to-indigo-600/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "sourcing",
		title: "Candidate Sourcing",
		description: "Multi-channel sourcing across LinkedIn, job boards, referrals, and personalized outreach sequences.",
		icon: Globe,
		to: "/dashboard/recruitment/sourcing",
		color: "from-sky-500/20 to-teal-500/20 text-sky-400 border-sky-500/30"
	},
	{
		id: "requisitions",
		title: "Requisitions",
		description: "Manage open headcount requests, budget allocations, and review pending approval workflows.",
		icon: FilePenLine,
		to: "/dashboard/recruitment/requisitions",
		color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30"
	},
	{
		id: "jobs",
		title: "All Jobs",
		description: "Post, edit, and publish active career listings and track active application pipelines.",
		icon: Briefcase,
		to: "/dashboard/recruitment/jobs",
		color: "from-blue-500/20 to-sky-500/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "candidates",
		title: "Candidates",
		description: "Track candidate profiles, stage progressions, screening scores, and BGV checks.",
		icon: Users,
		to: "/dashboard/recruitment/candidates",
		color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "ai-screening",
		title: "AI Resume Screening",
		description: "Dynamic criteria weighting, ATS scoring breakdown, and multi-candidate comparative intelligence.",
		icon: FileSearch,
		to: "/dashboard/recruitment/ai-screening",
		color: "from-violet-500/20 to-fuchsia-500/20 text-violet-400 border-violet-500/30"
	},
	{
		id: "interviews",
		title: "Interviews & Scheduling",
		description: "Coordinate scheduler calendars, assign panel members, and manage candidate scorecards.",
		icon: CalendarClock,
		to: "/dashboard/recruitment/interviews",
		color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
	},
	{
		id: "ai-interview",
		title: "AI Interview & Integrity",
		description: "Simulate candidate video interviews, real-time speech evaluation, fraud & integrity signals.",
		icon: Video,
		to: "/dashboard/recruitment/ai-interview",
		color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
	},
	{
		id: "communication",
		title: "Candidate Communications",
		description: "Automated multi-channel messaging templates, WhatsApp/SMS/Email previews, and delivery logs.",
		icon: Send,
		to: "/dashboard/recruitment/communication",
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	},
	{
		id: "hiring-manager",
		title: "Hiring Manager Hub",
		description: "Role-specific pipeline reviews, pending candidate approvals, schedule tracking, and feedback.",
		icon: UserCheck,
		to: "/dashboard/recruitment/hiring-manager",
		color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "verification",
		title: "Background Verification (BGV)",
		description: "Identity, education, criminal, and employment verification tracking with exception resolution.",
		icon: ShieldCheck,
		to: "/dashboard/recruitment/verification",
		color: "from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30"
	},
	{
		id: "compensation",
		title: "Compensation & Offer Builder",
		description: "Salary benchmarking, interactive component modeling, executive approvals, and e-signatures.",
		icon: Coins,
		to: "/dashboard/recruitment/compensation",
		color: "from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30"
	},
	{
		id: "offers",
		title: "Offers & Contracts",
		description: "Generate customized offer letters, manage salary models, and track accepts.",
		icon: FileText,
		to: "/dashboard/recruitment/offers",
		color: "from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
	},
	{
		id: "preboarding",
		title: "Preboarding Engagement",
		description: "Keep accepted joiners engaged before Day 1, document submission, buddy chats, and readiness tracker.",
		icon: Compass,
		to: "/dashboard/recruitment/preboarding",
		color: "from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30"
	},
	{
		id: "employee-onboarding",
		title: "Enterprise Onboarding Hub",
		description: "Cross-functional task execution across HR, IT, Admin, and Finance with Day-1 launch metrics.",
		icon: Laptop,
		to: "/dashboard/recruitment/employee-onboarding",
		color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30"
	},
	{
		id: "kt-probation",
		title: "Knowledge Transfer & Probation",
		description: "Structured KT curriculum checklists, mentor pairing, 30-60-90 review gates, and confirmation.",
		icon: GraduationCap,
		to: "/dashboard/recruitment/kt-probation",
		color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "onboarding",
		title: "Onboarding Checklists",
		description: "Prepare welcome checklists, verify candidate documentation, and assign onboarding buddies.",
		icon: UserPlus,
		to: "/dashboard/recruitment/onboarding",
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	},
	{
		id: "crm",
		title: "Candidate CRM",
		description: "Nurture relationships with email templates, pipeline triggers, and updates.",
		icon: MessageSquare,
		to: "/dashboard/recruitment/crm",
		color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30"
	},
	{
		id: "talent-pool",
		title: "Talent Pool",
		description: "Access secondary candidate profiles, skills inventories, and past applications repository.",
		icon: Folder,
		to: "/dashboard/recruitment/talent-pool",
		color: "from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30"
	},
	{
		id: "analytics",
		title: "Recruitment Analytics",
		description: "Monitor hiring pipeline conversion statistics, recruitment cost sources, and KPIs.",
		icon: TrendingUp,
		to: "/dashboard/recruitment/analytics",
		color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30"
	},
	{
		id: "automation",
		title: "Automation & Workflows",
		description: "Design trigger rules to auto-generate letters, update stages, and notify managers.",
		icon: Workflow,
		to: "/dashboard/recruitment/automation",
		color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30"
	},
	{
		id: "settings",
		title: "Recruitment Settings",
		description: "Configure candidate pipeline columns, career pages, and feedback templates.",
		icon: Settings,
		to: "/dashboard/recruitment/templates",
		color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30"
	}
];
var EMPTY_STATS = {
	totalJobs: 0,
	activeJobs: 0,
	draftJobs: 0,
	closedJobs: 0,
	totalCandidates: 0,
	shortlisted: 0,
	interviewScheduled: 0,
	selected: 0,
	rejected: 0,
	offersSent: 0,
	offersAccepted: 0,
	timeToHireDays: 0
};
function useRecruitmentDashboard() {
	const dispatch = useAppDispatch();
	const { jobs, candidates, interviews, offers, loading, error } = useAppSelector((state) => state.recruitment);
	(0, import_react.useEffect)(() => {
		dispatch(fetchRecruitmentData());
	}, [dispatch]);
	const refetch = (0, import_react.useCallback)(() => {
		dispatch(fetchRecruitmentData());
	}, [dispatch]);
	return {
		...(0, import_react.useMemo)(() => {
			if (loading && jobs.length === 0 && candidates.length === 0) return {
				stats: EMPTY_STATS,
				funnel: [],
				byDept: [],
				monthlyHires: [],
				recent: []
			};
			return {
				stats: computeDashboardStats(jobs, candidates, interviews, offers),
				funnel: buildFunnelData(candidates),
				byDept: buildDepartmentHiringData(jobs),
				monthlyHires: buildHiringTrendData(candidates, offers),
				recent: buildRecentActivity(candidates)
			};
		}, [
			jobs,
			candidates,
			interviews,
			offers,
			loading
		]),
		isLoading: loading,
		isError: !!error,
		error,
		refetch
	};
}
function RecruitmentDashboardPage() {
	const [viewMode, setViewMode] = (0, import_react.useState)("modules");
	const { stats, funnel, byDept, monthlyHires, recent, isLoading, isError, refetch } = useRecruitmentDashboard();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHubHeader, {
			viewMode,
			onViewModeChange: setViewMode
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
			variant: "panel",
			label: "Loading recruitment dashboard...",
			skeletonRows: 6
		})]
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHubHeader, {
			viewMode,
			onViewModeChange: setViewMode
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Could not load dashboard data from the API. Please try again."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "mt-4",
				onClick: () => refetch(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Retry"]
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHubHeader, {
			viewMode,
			onViewModeChange: setViewMode
		}), viewMode === "modules" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6 animate-in fade-in duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: RECRUITMENT_MODULES_LIST.map((module) => {
					const Icon = module.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: module.to,
						className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400",
									children: module.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-normal",
									children: module.description
								})]
							})]
						})
					}, module.id);
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 animate-in fade-in duration-300 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentDashboardKpis, { stats }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentDashboardCharts, {
					funnel,
					byDept
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentHiringTrendChart, {
						monthlyHires,
						className: "lg:col-span-2"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentRecentActivity, { items: recent })]
				})
			]
		})]
	});
}
function RecruitmentHubHeader({ viewMode, onViewModeChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap items-center justify-end gap-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: viewMode === "modules" ? "secondary" : "ghost",
				size: "sm",
				onClick: () => onViewModeChange("modules"),
				className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
				children: "Modules"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: viewMode === "analytics" ? "secondary" : "ghost",
				size: "sm",
				onClick: () => onViewModeChange("analytics"),
				className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
				children: "Hiring Metrics"
			})]
		})
	});
}
//#endregion
export { RecruitmentDashboardPage };
