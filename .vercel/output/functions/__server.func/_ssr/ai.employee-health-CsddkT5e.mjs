import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as Timer, Fn as Flame, T as TriangleAlert, Tr as CircleAlert, U as Smile, gn as HeartPulse, lt as RefreshCw, mi as Activity } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { T as fetchEmployeeHealthDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.employee-health-CsddkT5e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectEmployeeHealthState = (state) => state.employeeHealth;
var selectEmployeeHealthLoading = createSelector([selectEmployeeHealthState], (state) => state?.loading ?? false);
var selectEmployeeHealthError = createSelector([selectEmployeeHealthState], (state) => state?.error ?? null);
var selectEmployeeHealthLastUpdated = createSelector([selectEmployeeHealthState], (state) => state?.lastUpdated ?? null);
var selectEmployeeHealthSummary = createSelector([selectEmployeeHealthState], (state) => state?.summary ?? null);
var selectEmployeeHealthKPIs = createSelector([selectEmployeeHealthState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
var selectEmployeeHealthCharts = createSelector([selectEmployeeHealthState], (state) => state?.charts ?? null);
var selectEmployeeHealthBurnoutTrend = createSelector([selectEmployeeHealthCharts], (charts) => Array.isArray(charts?.burnoutRiskTrend) ? charts.burnoutRiskTrend : []);
var selectEmployeeHealthOvertimeByTeam = createSelector([selectEmployeeHealthCharts], (charts) => Array.isArray(charts?.overtimeByTeam) ? charts.overtimeByTeam : []);
var ICON_MAP = {
	HeartPulse,
	Flame,
	Activity,
	AlertTriangle: TriangleAlert,
	Timer,
	Smile
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectEmployeeHealthLoading);
	const error = useAppSelector(selectEmployeeHealthError);
	const backendKpis = useAppSelector(selectEmployeeHealthKPIs);
	const summary = useAppSelector(selectEmployeeHealthSummary);
	const burnoutRiskTrend = useAppSelector(selectEmployeeHealthBurnoutTrend);
	const overtimeByTeam = useAppSelector(selectEmployeeHealthOvertimeByTeam);
	const lastUpdated = useAppSelector(selectEmployeeHealthLastUpdated);
	(0, import_react.useEffect)(() => {
		dispatch(fetchEmployeeHealthDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: `${k.score}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : HeartPulse,
			invert: k.invert
		}));
		if (summary) return [
			{
				label: "Wellbeing Score",
				value: summary.wellbeingScore != null ? `${summary.wellbeingScore}` : "—",
				icon: Smile
			},
			{
				label: "Burnout Risk",
				value: summary.burnoutRisk != null ? `${summary.burnoutRisk}` : "—",
				icon: Flame,
				invert: true
			},
			{
				label: "Avg Workload",
				value: summary.avgWorkload != null ? typeof summary.avgWorkload === "number" ? `${summary.avgWorkload}h` : `${summary.avgWorkload}` : "—",
				icon: Activity,
				invert: true
			},
			{
				label: "OT Hours",
				value: summary.otHours != null ? `${summary.otHours}` : "—",
				icon: Timer,
				invert: true
			}
		];
		return [
			{
				label: "Wellbeing Score",
				value: "—",
				icon: Smile
			},
			{
				label: "Burnout Risk",
				value: "—",
				icon: Flame,
				invert: true
			},
			{
				label: "Avg Workload",
				value: "—",
				icon: Activity,
				invert: true
			},
			{
				label: "OT Hours",
				value: "—",
				icon: Timer,
				invert: true
			}
		];
	}, [backendKpis, summary]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (burnoutRiskTrend && burnoutRiskTrend.length > 0) list.push({
			type: "area",
			title: "Burnout Risk Trend",
			xKey: "w",
			series: [{
				key: "risk",
				label: "Risk index"
			}],
			data: burnoutRiskTrend
		});
		if (overtimeByTeam && overtimeByTeam.length > 0) list.push({
			type: "bar",
			title: "Overtime by Team (hrs)",
			xKey: "t",
			series: [{
				key: "ot",
				label: "OT hrs"
			}],
			data: overtimeByTeam
		});
		return list;
	}, [burnoutRiskTrend, overtimeByTeam]);
	const features = (0, import_react.useMemo)(() => [
		{
			title: "Burnout Detection",
			description: "Composite model of overtime, leave gaps and pulse signals.",
			icon: Flame,
			metric: summary?.burnoutRisk != null ? `${summary.burnoutRisk}` : void 0,
			tone: "warn"
		},
		{
			title: "Workload Analysis",
			description: "Per-employee weekly load with anomaly bands.",
			icon: Activity,
			tone: "info"
		},
		{
			title: "Stress Indicators",
			description: "Aggregated signals from surveys and behavior.",
			icon: TriangleAlert,
			tone: "warn"
		},
		{
			title: "Overtime Monitoring",
			description: "Trends, top contributors and budget impact.",
			icon: Timer,
			tone: "info"
		},
		{
			title: "Wellbeing Score",
			description: "Single org score with team breakdowns.",
			icon: Smile,
			metric: summary?.wellbeingScore != null ? `${summary.wellbeingScore}` : void 0,
			progress: summary?.wellbeingScore != null ? Number(summary.wellbeingScore) : void 0,
			tone: "ok"
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
		icon: HeartPulse,
		eyebrow: "AI Employee Health",
		title: "Spot burnout before it spreads",
		description: "Detect burnout, analyze workload, monitor overtime and surface wellbeing risks.",
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
				onClick: () => dispatch(fetchEmployeeHealthDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null
	});
}
//#endregion
export { Page as component };
