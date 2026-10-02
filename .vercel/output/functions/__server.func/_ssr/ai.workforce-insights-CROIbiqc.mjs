import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, H as Sparkles, Tr as CircleAlert, Yr as Brain, gn as HeartPulse, i as Zap, lt as RefreshCw, mi as Activity, p as Users, qr as Building2, y as UserMinus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { R as fetchWorkforceInsightsDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.workforce-insights-CROIbiqc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectWorkforceInsightsState = (state) => state.workforceInsights;
var selectWorkforceInsightsLoading = createSelector([selectWorkforceInsightsState], (state) => state?.loading ?? false);
var selectWorkforceInsightsError = createSelector([selectWorkforceInsightsState], (state) => state?.error ?? null);
var selectWorkforceInsightsLastUpdated = createSelector([selectWorkforceInsightsState], (state) => state?.lastUpdated ?? null);
var selectWorkforceInsightsSummary = createSelector([selectWorkforceInsightsState], (state) => state?.summary ?? null);
var selectWorkforceInsightsKPIs = createSelector([selectWorkforceInsightsState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
var selectWorkforceInsightsCharts = createSelector([selectWorkforceInsightsState], (state) => state?.charts ?? null);
var selectWorkforceInsightsHeadcountTrends = createSelector([selectWorkforceInsightsCharts], (charts) => Array.isArray(charts?.headcountTrends) ? charts.headcountTrends : []);
var selectWorkforceInsightsDepartmentComparison = createSelector([selectWorkforceInsightsCharts], (charts) => Array.isArray(charts?.departmentComparison) ? charts.departmentComparison : []);
var ICON_MAP = {
	Brain,
	HeartPulse,
	Users,
	UserMinus,
	Zap,
	TrendingUp,
	Building2,
	Activity,
	Sparkles
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectWorkforceInsightsLoading);
	const error = useAppSelector(selectWorkforceInsightsError);
	const backendKpis = useAppSelector(selectWorkforceInsightsKPIs);
	const summary = useAppSelector(selectWorkforceInsightsSummary);
	const headcountTrends = useAppSelector(selectWorkforceInsightsHeadcountTrends);
	const departmentComparison = useAppSelector(selectWorkforceInsightsDepartmentComparison);
	const lastUpdated = useAppSelector(selectWorkforceInsightsLastUpdated);
	(0, import_react.useEffect)(() => {
		dispatch(fetchWorkforceInsightsDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: `${k.score}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Brain,
			invert: k.invert
		}));
		if (summary) return [
			{
				label: "Workforce Health",
				value: summary.workforceHealth != null ? `${summary.workforceHealth}` : "—",
				icon: HeartPulse,
				hint: "Workforce health index"
			},
			{
				label: "Attrition Risk",
				value: summary.attritionRisk != null ? typeof summary.attritionRisk === "number" ? `${summary.attritionRisk}%` : `${summary.attritionRisk}` : "—",
				icon: UserMinus,
				invert: true,
				hint: "Employees flagged at risk"
			},
			{
				label: "Productivity Score",
				value: summary.productivityScore != null ? `${summary.productivityScore}` : "—",
				icon: Zap,
				hint: "Composite team productivity"
			},
			{
				label: "Headcount",
				value: summary.headcount != null ? typeof summary.headcount === "number" ? summary.headcount.toLocaleString() : `${summary.headcount}` : "—",
				icon: Users,
				hint: "Active workforce count"
			}
		];
		return [
			{
				label: "Workforce Health",
				value: "—",
				icon: HeartPulse
			},
			{
				label: "Attrition Risk",
				value: "—",
				icon: UserMinus,
				invert: true
			},
			{
				label: "Productivity Score",
				value: "—",
				icon: Zap
			},
			{
				label: "Headcount",
				value: "—",
				icon: Users
			}
		];
	}, [backendKpis, summary]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (headcountTrends && headcountTrends.length > 0) list.push({
			type: "area",
			title: "Headcount Trends",
			description: "Monthly active employees",
			xKey: "m",
			series: [{
				key: "hc",
				label: "Headcount"
			}],
			data: headcountTrends
		});
		if (departmentComparison && departmentComparison.length > 0) list.push({
			type: "bar",
			title: "Department Comparison",
			description: "Productivity vs. attrition risk by team",
			xKey: "d",
			series: [{
				key: "prod",
				label: "Productivity"
			}, {
				key: "risk",
				label: "Risk"
			}],
			data: departmentComparison
		});
		return list;
	}, [headcountTrends, departmentComparison]);
	const features = (0, import_react.useMemo)(() => [
		{
			title: "Workforce Health Score",
			description: "Composite signal across engagement, attendance and performance.",
			icon: HeartPulse,
			metric: summary?.workforceHealth != null ? `${summary.workforceHealth}` : void 0,
			progress: summary?.workforceHealth != null ? Number(summary.workforceHealth) : void 0,
			tone: "ok"
		},
		{
			title: "Attrition Prediction",
			description: "Model flags employees likely to leave in the next 90 days.",
			icon: UserMinus,
			metric: summary?.attritionRisk != null ? typeof summary.attritionRisk === "number" ? `${summary.attritionRisk}%` : `${summary.attritionRisk}` : void 0,
			tone: "warn"
		},
		{
			title: "Team Productivity Analysis",
			description: "Identify high-output squads and bottlenecks.",
			icon: Zap,
			metric: summary?.productivityScore != null ? `${summary.productivityScore}` : void 0,
			tone: "ok"
		},
		{
			title: "Employee Risk Detection",
			description: "Surface burnout, disengagement and salary-band risks.",
			icon: Activity,
			metric: summary?.riskSignalsCount != null ? `${summary.riskSignalsCount} signals` : void 0,
			tone: "info"
		},
		{
			title: "Headcount Trends",
			description: "Visualize hiring vs. exits over time, segmented by team.",
			icon: TrendingUp,
			metric: summary?.headcount != null ? `${summary.headcount}` : void 0,
			tone: "ok"
		},
		{
			title: "Department Comparison",
			description: "Benchmark performance across business units.",
			icon: Building2,
			tone: "info"
		},
		{
			title: "Workforce Forecasting",
			description: "Project headcount and skills mix 12 months out.",
			icon: Sparkles,
			metric: "12-mo",
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
		icon: Brain,
		eyebrow: "AI Workforce Insights",
		title: "Workforce intelligence, predicted in real time",
		description: "Track workforce health, predict attrition and forecast headcount across every department.",
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
				onClick: () => dispatch(fetchWorkforceInsightsDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null
	});
}
//#endregion
export { Page as component };
