import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, Fn as Flame, Fr as ChartLine, H as Sparkles, It as MessageSquare, J as ShieldAlert, Jr as Briefcase, K as Shield, Ln as FileText, P as Target, Q as Send, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Yr as Brain, _ as UserPlus, ar as Cpu, bn as GraduationCap, fi as ArrowDownRight, fn as Inbox, gn as HeartPulse, i as Zap, lt as RefreshCw, oi as Award, p as Users, si as ArrowUpRight, y as UserMinus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { y as fetchAIInsightsDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { n as trendTextClass, t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { i as getToneDot } from "./color-maps-DnqgCmfa.mjs";
import { C as selectAIInsightsSupportPerformers, S as selectAIInsightsSummary, _ as selectAIInsightsPayrollTrend, a as selectAIInsightsCandidates, b as selectAIInsightsSatisfactionTrend, c as selectAIInsightsHasDataFlag, d as selectAIInsightsKPIs, f as selectAIInsightsLoading, g as selectAIInsightsPayrollAlerts, h as selectAIInsightsPayroll, i as selectAIInsightsBurnout, l as selectAIInsightsHeadcountForecast, m as selectAIInsightsPartialErrors, n as selectAIInsightsAttendance, o as selectAIInsightsDocuments, p as selectAIInsightsPartial, r as selectAIInsightsAttrition, s as selectAIInsightsError, t as selectAIInsightsAlerts, u as selectAIInsightsHiringDemand, v as selectAIInsightsRecommendations, w as selectAIInsightsTopPerformers, x as selectAIInsightsSkillGap, y as selectAIInsightsRecruitment } from "./aiInsightsSelectors-C_ka5XtA.mjs";
import { C as Legend, S as Tooltip, c as YAxis, d as Line, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AIInsightsPage-bsV3NzT2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICON_MAP = {
	HeartPulse,
	Sparkles,
	UserMinus,
	Zap,
	CheckCircle2: CircleCheck,
	Briefcase,
	AlertTriangle: TriangleAlert,
	Flame,
	ShieldAlert,
	Shield,
	TrendingUp,
	Target,
	GraduationCap,
	Cpu,
	Users,
	LineChart: ChartLine
};
function getIconComponent(name, fallback = Brain) {
	if (!name) return fallback;
	return ICON_MAP[name] ?? fallback;
}
function AIInsightsPage() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectAIInsightsLoading);
	const error = useAppSelector(selectAIInsightsError);
	const summary = useAppSelector(selectAIInsightsSummary);
	const kpis = useAppSelector(selectAIInsightsKPIs);
	const attrition = useAppSelector(selectAIInsightsAttrition);
	const burnout = useAppSelector(selectAIInsightsBurnout);
	const attendance = useAppSelector(selectAIInsightsAttendance);
	const recruitment = useAppSelector(selectAIInsightsRecruitment);
	const candidates = useAppSelector(selectAIInsightsCandidates);
	const topPerformers = useAppSelector(selectAIInsightsTopPerformers);
	const supportPerformers = useAppSelector(selectAIInsightsSupportPerformers);
	const skillGap = useAppSelector(selectAIInsightsSkillGap);
	const payroll = useAppSelector(selectAIInsightsPayroll);
	const payrollAlerts = useAppSelector(selectAIInsightsPayrollAlerts);
	const payrollTrend = useAppSelector(selectAIInsightsPayrollTrend);
	const headcountForecast = useAppSelector(selectAIInsightsHeadcountForecast);
	const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
	const satisfactionTrend = useAppSelector(selectAIInsightsSatisfactionTrend);
	const alerts = useAppSelector(selectAIInsightsAlerts);
	const recommendations = useAppSelector(selectAIInsightsRecommendations);
	const documents = useAppSelector(selectAIInsightsDocuments);
	const hasDataFlag = useAppSelector(selectAIInsightsHasDataFlag);
	const partial = useAppSelector(selectAIInsightsPartial);
	const partialErrors = useAppSelector(selectAIInsightsPartialErrors);
	(0, import_react.useEffect)(() => {
		dispatch(fetchAIInsightsDashboard());
	}, [dispatch]);
	const handleRetry = () => {
		dispatch(fetchAIInsightsDashboard());
	};
	const hasData = (0, import_react.useMemo)(() => {
		if (hasDataFlag === false) return false;
		return Boolean(Array.isArray(kpis) && kpis.length > 0 || Array.isArray(attrition) && attrition.length > 0 || Array.isArray(burnout) && burnout.length > 0 || Array.isArray(attendance) && attendance.length > 0 || Array.isArray(candidates) && candidates.length > 0 || Array.isArray(topPerformers) && topPerformers.length > 0 || Array.isArray(recommendations) && recommendations.length > 0 || Array.isArray(alerts) && alerts.length > 0 || summary !== null && (summary.totalInsights > 0 || summary.actionedCount > 0));
	}, [
		hasDataFlag,
		kpis,
		attrition,
		burnout,
		attendance,
		candidates,
		topPerformers,
		recommendations,
		alerts,
		summary
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "AI Predictive Insights",
				description: "Predictive attrition analytics, team sentiment monitoring, burnout risk alerts, and salary benchmarks.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handleRetry,
					disabled: loading,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }), "Refresh"]
				})
			}),
			partial ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex items-center justify-between rounded-xl border p-3.5 text-xs ${statusBadgeClass("warning")}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Notice: Some insight metrics are based on partial workforce data.", partialErrors && typeof partialErrors === "object" ? ` (${Object.keys(partialErrors).length} section(s) reported issues)` : ""] })]
				})
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBanner, {
				message: error,
				onRetry: handleRetry
			}) : null,
			loading && !hasData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSkeletonView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [kpis.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No KPI metrics currently available." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
				children: kpis.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					kpi: k,
					delay: i * .04
				}, k.label))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							eyebrow: "Workforce",
							title: "AI Workforce Analytics",
							icon: Brain
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Attrition Prediction",
									icon: UserMinus,
									children: attrition.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No attrition risk predictions found." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-left border-collapse text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
												className: "border-b border-border text-xs uppercase tracking-wide text-muted-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 pr-4 font-medium",
														children: "Employee"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-medium",
														children: "Risk"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 pl-2 font-medium",
														children: "Reason"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: attrition.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-3 pr-4 align-top min-w-[140px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-medium text-foreground",
															children: a.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs text-muted-foreground",
															children: a.dept
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-3 align-top whitespace-nowrap",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskPill, { score: a.risk })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-3 pl-2 align-top text-xs text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "leading-relaxed",
															children: a.reason
														}), a.action ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-1.5 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground border border-border",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-primary" }),
																" ",
																a.action
															]
														}) : null]
													})
												]
											}, a.name)) })]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Burnout Detection",
									icon: Flame,
									children: burnout.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No burnout warnings detected." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: burnout.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border bg-card p-3 shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium text-foreground",
														children: b.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: statusBadgeClass(b.score > 80 ? "critical" : "warning"),
														children: [b.score, " burnout"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Overtime: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-medium text-foreground",
														children: [b.overtime, "h"]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Leave balance: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-medium text-foreground",
														children: [b.leave, " days"]
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
													value: b.score,
													className: "mt-2 h-1.5"
												})
											]
										}, b.name))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Attendance Insights",
									icon: CircleCheck,
									className: "lg:col-span-2",
									children: attendance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No attendance insight alerts recorded." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
										children: attendance.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-border bg-card p-4 shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToneDot, { tone: a.tone }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-medium text-foreground",
														children: a.title
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 font-display text-2xl font-semibold text-foreground",
													children: a.count
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 text-xs text-muted-foreground",
													children: a.note
												})
											]
										}, a.title))
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							eyebrow: "Hiring",
							title: "AI Recruitment Assistant",
							icon: Briefcase
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Open Positions",
									value: recruitment?.openPositions != null ? String(recruitment.openPositions) : "—",
									hint: "across active departments",
									icon: Briefcase
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Recommended Candidates",
									value: recruitment?.recommendedCandidatesCount != null ? String(recruitment.recommendedCandidatesCount) : "—",
									hint: "match score > 80%",
									icon: UserPlus
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Pipeline Health",
									value: recruitment?.pipelineHealth ?? "N/A",
									hint: "active hiring pipeline",
									icon: ChartLine
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Top Candidate Matches",
									icon: Target,
									className: "lg:col-span-3",
									children: candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No recommended candidate matches available." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-left border-collapse text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
												className: "border-b border-border text-xs uppercase tracking-wide text-muted-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 pr-4 font-medium",
														children: "Candidate"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-medium",
														children: "Role"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-medium",
														children: "Resume Match"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "py-2.5 px-3 font-medium",
														children: "Interview Readiness"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2.5 pl-3 font-medium text-right" })
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 pr-4 align-middle font-medium text-foreground whitespace-nowrap",
														children: c.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-3 align-middle text-muted-foreground whitespace-nowrap",
														children: c.role
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-3 align-middle w-48",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarMeter, { value: c.match })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-3 align-middle w-48",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarMeter, { value: c.readiness })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 pl-3 align-middle text-right",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "outline",
															children: "Shortlist"
														})
													})
												]
											}, c.name)) })]
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							eyebrow: "Performance",
							title: "AI Performance Insights",
							icon: Award
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Top Performers",
									icon: TrendingUp,
									children: topPerformers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No top performers listed." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-3",
										children: topPerformers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium text-foreground",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: p.dept
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: statusBadgeClass("positive"),
													children: [p.growth, " growth"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-lg font-semibold text-foreground",
													children: p.score
												})]
											})]
										}, p.name))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Needs Support",
									icon: GraduationCap,
									children: supportPerformers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No performers requiring support flagged." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-3",
										children: supportPerformers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "rounded-lg border border-border bg-card p-3 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium text-foreground",
													children: p.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: p.dept
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display text-lg font-semibold text-foreground",
													children: p.score
												})]
											}), p.coach ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground border border-border",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-primary" }),
													" AI coaching: ",
													p.coach
												]
											}) : null]
										}, p.name))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Skill Gap Analysis",
									icon: Cpu,
									className: "lg:col-span-2",
									children: skillGap.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No skill gap data available." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-64",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
												data: skillGap,
												margin: {
													top: 10,
													right: 10,
													left: -20,
													bottom: 0
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
														strokeDasharray: "3 3",
														stroke: "var(--border)",
														opacity: .4,
														vertical: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
														dataKey: "skill",
														stroke: "var(--muted-foreground)",
														fontSize: 12,
														tickLine: false,
														axisLine: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
														stroke: "var(--muted-foreground)",
														fontSize: 12,
														tickLine: false,
														axisLine: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
														contentStyle: chartTooltip,
														itemStyle: { color: "var(--foreground)" },
														labelStyle: { color: "var(--foreground)" }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "have",
														name: "Current",
														fill: "var(--primary)",
														radius: [
															6,
															6,
															0,
															0
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "need",
														name: "Target",
														fill: "var(--muted-foreground)",
														radius: [
															6,
															6,
															0,
															0
														],
														opacity: .4
													})
												]
											})
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							eyebrow: "Payroll",
							title: "AI Payroll Insights",
							icon: ShieldAlert
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Payroll Health",
									value: payroll?.payrollHealth != null ? String(payroll.payrollHealth) : "—",
									hint: "payroll score",
									icon: HeartPulse
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Savings Opportunities",
									value: payroll?.savingsOpportunities ?? "—",
									hint: "vendor + reimb optimization",
									icon: TrendingUp
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Anomalies Detected",
									value: payroll?.anomaliesDetected != null ? String(payroll.anomaliesDetected) : "—",
									hint: "flagged anomalies",
									icon: TriangleAlert
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Payroll Alerts",
									icon: ShieldAlert,
									className: "lg:col-span-2",
									children: payrollAlerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No active payroll alerts." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-3",
										children: payrollAlerts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium text-foreground",
												children: p.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													p.who,
													" · ",
													p.delta
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: p.severity })]
										}, p.title))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Payroll Cost Forecast",
									icon: ChartLine,
									children: payrollTrend.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No payroll forecast trend data." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-64",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
												data: payrollTrend,
												margin: {
													top: 10,
													right: 10,
													left: -20,
													bottom: 0
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
														id: "cost",
														x1: "0",
														y1: "0",
														x2: "0",
														y2: "1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
															offset: "0%",
															stopColor: "var(--primary)",
															stopOpacity: .35
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
															offset: "100%",
															stopColor: "var(--primary)",
															stopOpacity: .02
														})]
													}) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
														strokeDasharray: "3 3",
														stroke: "var(--border)",
														opacity: .4,
														vertical: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
														dataKey: "m",
														stroke: "var(--muted-foreground)",
														fontSize: 12,
														tickLine: false,
														axisLine: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
														stroke: "var(--muted-foreground)",
														fontSize: 12,
														tickLine: false,
														axisLine: false
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
														contentStyle: chartTooltip,
														itemStyle: { color: "var(--foreground)" },
														labelStyle: { color: "var(--foreground)" }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
														type: "monotone",
														dataKey: "cost",
														name: "Cost",
														stroke: "var(--primary)",
														fill: "url(#cost)",
														strokeWidth: 2
													})
												]
											})
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							eyebrow: "Planning",
							title: "AI Workforce Planning",
							icon: Users
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Headcount Forecast",
								icon: ChartLine,
								children: headcountForecast.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No headcount forecast available." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-64",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
											data: headcountForecast,
											margin: {
												top: 10,
												right: 10,
												left: -20,
												bottom: 0
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													stroke: "var(--border)",
													opacity: .4,
													vertical: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "month",
													stroke: "var(--muted-foreground)",
													fontSize: 12,
													tickLine: false,
													axisLine: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													stroke: "var(--muted-foreground)",
													fontSize: 12,
													tickLine: false,
													axisLine: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
													contentStyle: chartTooltip,
													itemStyle: { color: "var(--foreground)" },
													labelStyle: { color: "var(--foreground)" }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
													type: "monotone",
													dataKey: "current",
													name: "Actual",
													stroke: "var(--foreground)",
													strokeWidth: 2,
													dot: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
													type: "monotone",
													dataKey: "forecast",
													name: "AI Forecast",
													stroke: "var(--primary)",
													strokeWidth: 2,
													strokeDasharray: "5 4",
													dot: false
												})
											]
										})
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Hiring Demand by Dept",
								icon: Briefcase,
								children: hiringDemand.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No department hiring demand data." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-64",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: hiringDemand,
											layout: "vertical",
											margin: {
												top: 10,
												right: 10,
												left: 10,
												bottom: 0
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													stroke: "var(--border)",
													opacity: .4,
													horizontal: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													type: "number",
													stroke: "var(--muted-foreground)",
													fontSize: 12,
													tickLine: false,
													axisLine: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													dataKey: "dept",
													type: "category",
													stroke: "var(--muted-foreground)",
													fontSize: 12,
													width: 90,
													tickLine: false,
													axisLine: false
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
													contentStyle: chartTooltip,
													itemStyle: { color: "var(--foreground)" },
													labelStyle: { color: "var(--foreground)" }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "open",
													name: "Open",
													fill: "var(--muted-foreground)",
													opacity: .4,
													radius: [
														0,
														6,
														6,
														0
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "demand",
													name: "AI Demand",
													fill: "var(--primary)",
													radius: [
														0,
														6,
														6,
														0
													]
												})
											]
										})
									})
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							eyebrow: "Generate",
							title: "AI Document Generator",
							icon: FileText
						}),
						documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No AI document templates configured." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
							children: documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentCard, { document: d }, d.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Employee Satisfaction Trend",
							icon: Sparkles,
							children: satisfactionTrend.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No satisfaction trend points available." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
										data: satisfactionTrend,
										margin: {
											top: 10,
											right: 10,
											left: -20,
											bottom: 0
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
												id: "sat",
												x1: "0",
												y1: "0",
												x2: "0",
												y2: "1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "0%",
													stopColor: "var(--primary)",
													stopOpacity: .35
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "100%",
													stopColor: "var(--primary)",
													stopOpacity: .02
												})]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												stroke: "var(--border)",
												opacity: .4,
												vertical: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "m",
												stroke: "var(--muted-foreground)",
												fontSize: 12,
												tickLine: false,
												axisLine: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												stroke: "var(--muted-foreground)",
												fontSize: 12,
												domain: [0, 100],
												tickLine: false,
												axisLine: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												contentStyle: chartTooltip,
												itemStyle: { color: "var(--foreground)" },
												labelStyle: { color: "var(--foreground)" }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
												type: "monotone",
												dataKey: "s",
												name: "Score",
												stroke: "var(--primary)",
												fill: "url(#sat)",
												strokeWidth: 2
											})
										]
									})
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIChatPanel, { recommendations }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "AI Alerts Center",
							icon: TriangleAlert,
							children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No active AI alerts." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: alerts.map((a) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(getIconComponent(a.icon, TriangleAlert), { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "truncate text-sm font-medium text-foreground",
													children: a.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: a.severity })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: a.note
											})]
										})]
									}, a.title);
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "AI Recommendations",
							icon: Sparkles,
							children: recommendations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, { message: "No recommendations available." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 text-sm",
								children: recommendations.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2 rounded-lg border border-border bg-card p-3 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: r
									})]
								}, i))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: "Full conversation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard/payroll/copilot",
								className: "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-muted-foreground" }), " Open AI Copilot"]
							})]
						})
					]
				})]
			})] })
		]
	});
}
var chartTooltip = {
	backgroundColor: "var(--card)",
	border: "1px solid var(--border)",
	borderRadius: 8,
	fontSize: 12,
	color: "var(--foreground)"
};
var ErrorBanner = (0, import_react.memo)(function ErrorBanner({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-semibold text-sm",
				children: "Failed to load AI Insights"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs opacity-90",
				children: message
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			onClick: onRetry,
			className: "border-destructive/30 text-destructive hover:bg-destructive/20 hover:text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-3.5 w-3.5" }), " Retry"]
		})]
	});
});
var EmptySection = (0, import_react.memo)(function EmptySection({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "mb-2 h-6 w-6 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium",
			children: message
		})]
	});
});
var SectionTitle = (0, import_react.memo)(function SectionTitle({ eyebrow, title, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 mt-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
			children: eyebrow
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-base font-semibold tracking-tight text-foreground",
			children: title
		})] })]
	});
});
var KpiCard = (0, import_react.memo)(function KpiCard({ kpi, delay = 0 }) {
	const Icon = getIconComponent(kpi.icon, HeartPulse);
	const up = kpi.trend >= 0;
	const positive = kpi.invert ? !up : up;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			delay
		},
		className: "rounded-xl border border-border bg-card p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: kpi.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-2xl font-semibold tracking-tight text-foreground",
					children: [kpi.score, kpi.label?.toLowerCase().includes("risk") ? "%" : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `inline-flex items-center gap-0.5 text-xs font-medium ${trendTextClass(positive)}`,
					children: [
						up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3.5 w-3.5" }),
						Math.abs(kpi.trend),
						"%"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: Math.min(100, Math.max(0, kpi.score)),
				className: "mt-3 h-1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-start gap-1.5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-3 w-3 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: kpi.hint
				})]
			})
		]
	});
});
var Panel = (0, import_react.memo)(function Panel({ title, icon: Icon, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border border-border bg-card shadow-sm ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium text-foreground",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children
		})]
	});
});
var MiniStat = (0, import_react.memo)(function MiniStat({ label, value, hint, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-display text-2xl font-semibold text-foreground",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
});
var DocumentCard = (0, import_react.memo)(function DocumentCard({ document }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "group relative rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(getIconComponent(document.type, FileText), { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium text-foreground",
				children: document.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Auto-fill from employee data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground",
				children: "AI"
			})
		]
	});
});
var RiskPill = (0, import_react.memo)(function RiskPill({ score }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "outline",
		className: statusBadgeClass(score >= 80 ? "critical" : score >= 65 ? "warning" : "low"),
		children: [score, "%"]
	});
});
var ToneDot = (0, import_react.memo)(function ToneDot({ tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 shrink-0 rounded-full ${getToneDot(tone)}` });
});
var SeverityBadge = (0, import_react.memo)(function SeverityBadge({ severity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: statusBadgeClass(severity),
		children: severity
	});
});
var BarMeter = (0, import_react.memo)(function BarMeter({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
			value: Math.min(100, Math.max(0, value)),
			className: "h-1.5 flex-1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "w-9 text-right text-xs font-medium text-foreground",
			children: [value, "%"]
		})]
	});
});
var AIChatPanel = (0, import_react.memo)(function AIChatPanel({ recommendations }) {
	const [text, setText] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "ai",
		text: "Hi! I’m OFC360 AI. Ask me about workforce metrics, attrition, burnout, or hiring forecasts."
	}]);
	const examples = (0, import_react.useMemo)(() => {
		if (Array.isArray(recommendations) && recommendations.length > 0) return recommendations.slice(0, 4);
		return [];
	}, [recommendations]);
	function send(value) {
		const t = (value ?? text).trim();
		if (!t) return;
		setText("");
		setMessages((m) => [...m, {
			role: "user",
			text: t
		}]);
		setMessages((m) => [...m, {
			role: "ai",
			text: `Querying workforce intelligence backend for: "${t}"...`
		}]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium text-foreground",
						children: "AI Assistant"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: statusBadgeClass("active"),
					children: "Live"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-72 space-y-2 overflow-y-auto p-3",
				children: messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`,
						children: m.text
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: examples.map((e, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => send(e),
						className: "truncate max-w-[280px] rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						children: e
					}, idx))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						send();
					},
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "Ask AI anything...",
						className: "h-9"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						"aria-label": "Send message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				})]
			})
		]
	});
});
function LoadingSkeletonView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl lg:col-span-2" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl lg:col-span-3" })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" })]
				})]
			})
		]
	});
}
//#endregion
export { AIInsightsPage, AIInsightsPage as default };
