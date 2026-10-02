import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { En as GitCompareArrows, Ir as ChartColumn, It as MessageSquare, Jr as Briefcase, M as ThumbsUp, R as Star, Tr as CircleAlert, lt as RefreshCw, w as Trophy, zn as FileSearch } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { P as fetchRecruiterDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.recruiter-Dl57T1J3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectRecruiterState = (state) => state.aiRecruiter;
var selectRecruiterLoading = createSelector([selectRecruiterState], (state) => state?.loading ?? false);
var selectRecruiterError = createSelector([selectRecruiterState], (state) => state?.error ?? null);
var selectRecruiterLastUpdated = createSelector([selectRecruiterState], (state) => state?.lastUpdated ?? null);
var selectRecruiterSummary = createSelector([selectRecruiterState], (state) => state?.summary ?? null);
var selectRecruiterKPIs = createSelector([selectRecruiterState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
var selectRecruiterCharts = createSelector([selectRecruiterState], (state) => state?.charts ?? null);
var selectRecruiterCandidateFunnel = createSelector([selectRecruiterCharts], (charts) => Array.isArray(charts?.candidateFunnel) ? charts.candidateFunnel : []);
var selectRecruiterJdMatchDistribution = createSelector([selectRecruiterCharts], (charts) => Array.isArray(charts?.jdMatchDistribution) ? charts.jdMatchDistribution : []);
var ICON_MAP = {
	Briefcase,
	FileSearch,
	Trophy,
	BarChart3: ChartColumn,
	GitCompareArrows,
	MessageSquare,
	ThumbsUp,
	Star
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectRecruiterLoading);
	const error = useAppSelector(selectRecruiterError);
	const backendKpis = useAppSelector(selectRecruiterKPIs);
	const summary = useAppSelector(selectRecruiterSummary);
	const candidateFunnel = useAppSelector(selectRecruiterCandidateFunnel);
	const jdMatchDistribution = useAppSelector(selectRecruiterJdMatchDistribution);
	const lastUpdated = useAppSelector(selectRecruiterLastUpdated);
	(0, import_react.useEffect)(() => {
		dispatch(fetchRecruiterDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: `${k.score}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Briefcase,
			invert: k.invert
		}));
		if (summary) return [
			{
				label: "Open Roles",
				value: summary.openRoles != null ? `${summary.openRoles}` : "—",
				icon: Briefcase
			},
			{
				label: "Candidates Screened",
				value: summary.candidatesScreened != null ? typeof summary.candidatesScreened === "number" ? summary.candidatesScreened.toLocaleString() : `${summary.candidatesScreened}` : "—",
				icon: FileSearch
			},
			{
				label: "Top Matches",
				value: summary.topMatches != null ? `${summary.topMatches}` : "—",
				icon: Trophy
			},
			{
				label: "Time to Hire",
				value: summary.timeToHire != null ? typeof summary.timeToHire === "number" ? `${summary.timeToHire}d` : `${summary.timeToHire}` : "—",
				icon: ChartColumn,
				invert: true
			}
		];
		return [
			{
				label: "Open Roles",
				value: "—",
				icon: Briefcase
			},
			{
				label: "Candidates Screened",
				value: "—",
				icon: FileSearch
			},
			{
				label: "Top Matches",
				value: "—",
				icon: Trophy
			},
			{
				label: "Time to Hire",
				value: "—",
				icon: ChartColumn,
				invert: true
			}
		];
	}, [backendKpis, summary]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (candidateFunnel && candidateFunnel.length > 0) list.push({
			type: "line",
			title: "Candidate Funnel",
			description: "Last 8 weeks",
			xKey: "w",
			series: [
				{
					key: "applied",
					label: "Applied"
				},
				{
					key: "shortlist",
					label: "Shortlist"
				},
				{
					key: "offers",
					label: "Offers"
				}
			],
			data: candidateFunnel
		});
		if (jdMatchDistribution && jdMatchDistribution.length > 0) list.push({
			type: "bar",
			title: "JD Match Distribution",
			xKey: "band",
			series: [{
				key: "n",
				label: "Candidates"
			}],
			data: jdMatchDistribution
		});
		return list;
	}, [candidateFunnel, jdMatchDistribution]);
	const features = (0, import_react.useMemo)(() => [
		{
			title: "Resume Screening",
			description: "Parse and score thousands of resumes in minutes.",
			icon: FileSearch,
			metric: summary?.candidatesScreened != null ? typeof summary.candidatesScreened === "number" ? `${summary.candidatesScreened}` : `${summary.candidatesScreened}` : void 0,
			tone: "info"
		},
		{
			title: "Candidate Ranking",
			description: "Rank candidates by JD fit, experience and signals.",
			icon: Trophy,
			metric: summary?.topMatches != null ? `${summary.topMatches}` : void 0,
			tone: "ok"
		},
		{
			title: "JD Matching",
			description: "Semantic match between job descriptions and profiles.",
			icon: GitCompareArrows,
			metric: summary?.jdMatchAvg ?? "0.92 avg",
			tone: "ok"
		},
		{
			title: "AI Interview Questions",
			description: "Auto-generate tailored questions per role and seniority.",
			icon: MessageSquare,
			tone: "info"
		},
		{
			title: "Hiring Recommendations",
			description: "Hire / hold / pass suggestions with reasoning.",
			icon: ThumbsUp,
			tone: "info"
		},
		{
			title: "Candidate Scoring",
			description: "Holistic score across skill, culture and growth signals.",
			icon: Star,
			metric: "0–100",
			tone: "ok"
		},
		{
			title: "Recruitment Analytics",
			description: "Funnel, source-of-hire, time-to-fill dashboards.",
			icon: ChartColumn,
			tone: "info"
		}
	], [summary]);
	if (loading && (!backendKpis || backendKpis.length === 0) && !summary) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 w-full rounded-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-2xl" })]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: Briefcase,
		eyebrow: "AI Recruiter",
		title: "Hire smarter, faster, with AI ranking & matching",
		description: "Auto-screen resumes, rank candidates, match to JDs and generate tailored interview questions.",
		lastAnalysis: summary?.lastAnalysis ?? (lastUpdated ? "Live DB Sync" : "Live DB Sync"),
		kpis,
		charts,
		features,
		children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => dispatch(fetchRecruiterDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null
	});
}
//#endregion
export { Page as component };
