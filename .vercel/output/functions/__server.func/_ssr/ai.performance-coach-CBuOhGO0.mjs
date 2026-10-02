import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { An as Gauge, E as TrendingUp, P as Target, Tr as CircleAlert, bn as GraduationCap, lt as RefreshCw, oi as Award, tn as Lightbulb } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { A as fetchPerformanceCoachDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.performance-coach-CBuOhGO0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectPerformanceCoachState = (state) => state.performanceCoach;
var selectPerformanceCoachLoading = createSelector([selectPerformanceCoachState], (state) => state?.loading ?? false);
var selectPerformanceCoachError = createSelector([selectPerformanceCoachState], (state) => state?.error ?? null);
var selectPerformanceCoachLastUpdated = createSelector([selectPerformanceCoachState], (state) => state?.lastUpdated ?? null);
var selectPerformanceCoachSummary = createSelector([selectPerformanceCoachState], (state) => state?.summary ?? null);
var selectPerformanceCoachKPIs = createSelector([selectPerformanceCoachState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
var selectPerformanceCoachCharts = createSelector([selectPerformanceCoachState], (state) => state?.charts ?? null);
var selectPerformanceCoachTrend = createSelector([selectPerformanceCoachCharts], (charts) => Array.isArray(charts?.performanceTrend) ? charts.performanceTrend : []);
var selectPerformanceCoachAttainment = createSelector([selectPerformanceCoachCharts], (charts) => Array.isArray(charts?.kpiAttainment) ? charts.kpiAttainment : []);
var ICON_MAP = {
	Gauge,
	Target,
	Award,
	GraduationCap,
	TrendingUp,
	Lightbulb
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectPerformanceCoachLoading);
	const error = useAppSelector(selectPerformanceCoachError);
	const backendKpis = useAppSelector(selectPerformanceCoachKPIs);
	const summary = useAppSelector(selectPerformanceCoachSummary);
	const performanceTrend = useAppSelector(selectPerformanceCoachTrend);
	const kpiAttainment = useAppSelector(selectPerformanceCoachAttainment);
	const lastUpdated = useAppSelector(selectPerformanceCoachLastUpdated);
	(0, import_react.useEffect)(() => {
		dispatch(fetchPerformanceCoachDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: `${k.score}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Gauge,
			invert: k.invert
		}));
		if (summary) return [
			{
				label: "Avg Performance",
				value: summary.avgPerformance != null ? `${summary.avgPerformance}` : "—",
				icon: Gauge
			},
			{
				label: "Top Performers",
				value: summary.topPerformers != null ? `${summary.topPerformers}` : "—",
				icon: Award
			},
			{
				label: "Skill Gaps",
				value: summary.skillGaps != null ? `${summary.skillGaps}` : "—",
				icon: GraduationCap,
				invert: true
			},
			{
				label: "Promotion Picks",
				value: summary.promotionPicks != null ? `${summary.promotionPicks}` : "—",
				icon: TrendingUp
			}
		];
		return [
			{
				label: "Avg Performance",
				value: "—",
				icon: Gauge
			},
			{
				label: "Top Performers",
				value: "—",
				icon: Award
			},
			{
				label: "Skill Gaps",
				value: "—",
				icon: GraduationCap,
				invert: true
			},
			{
				label: "Promotion Picks",
				value: "—",
				icon: TrendingUp
			}
		];
	}, [backendKpis, summary]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (performanceTrend && performanceTrend.length > 0) list.push({
			type: "line",
			title: "Performance Trend",
			xKey: "q",
			series: [{
				key: "team",
				label: "Team avg"
			}, {
				key: "top",
				label: "Top quartile"
			}],
			data: performanceTrend
		});
		if (kpiAttainment && kpiAttainment.length > 0) list.push({
			type: "bar",
			title: "KPI Attainment by Function",
			xKey: "f",
			series: [{
				key: "att",
				label: "Attainment %"
			}],
			data: kpiAttainment
		});
		return list;
	}, [performanceTrend, kpiAttainment]);
	const features = (0, import_react.useMemo)(() => [
		{
			title: "Employee Performance Score",
			description: "Composite quarterly score per employee.",
			icon: Gauge,
			metric: summary?.avgPerformance != null ? `${summary.avgPerformance}` : void 0,
			progress: summary?.avgPerformance != null ? Number(summary.avgPerformance) : void 0,
			tone: "ok"
		},
		{
			title: "KPI Analysis",
			description: "Drill into attainment vs. targets by team.",
			icon: Target,
			tone: "info"
		},
		{
			title: "Promotion Recommendations",
			description: "AI surfaces ready-for-promotion candidates.",
			icon: Award,
			metric: summary?.promotionPicks != null ? `${summary.promotionPicks}` : void 0,
			tone: "ok"
		},
		{
			title: "Skill Gap Analysis",
			description: "Identify org-wide and individual skill gaps.",
			icon: GraduationCap,
			metric: summary?.skillGaps != null ? `${summary.skillGaps}` : void 0,
			tone: "warn"
		},
		{
			title: "Performance Trends",
			description: "Multi-quarter performance trajectory.",
			icon: TrendingUp,
			tone: "info"
		},
		{
			title: "Coaching Suggestions",
			description: "Personalized nudges for managers and ICs.",
			icon: Lightbulb,
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
		icon: Gauge,
		eyebrow: "AI Performance Coach",
		title: "Personal coaching at organizational scale",
		description: "Track KPIs, spot skill gaps, recommend promotions and generate coaching nudges.",
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
				onClick: () => dispatch(fetchPerformanceCoachDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null
	});
}
//#endregion
export { Page as component };
