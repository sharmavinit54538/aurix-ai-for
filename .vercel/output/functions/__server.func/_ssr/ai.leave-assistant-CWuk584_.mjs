import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, Hr as CalendarRange, Ln as FileText, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, lt as RefreshCw, p as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { D as fetchLeaveAssistantDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.leave-assistant-CWuk584_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectLeaveAssistantState = (state) => state.leaveAssistant;
var selectLeaveAssistantLoading = createSelector([selectLeaveAssistantState], (state) => state?.loading ?? false);
var selectLeaveAssistantError = createSelector([selectLeaveAssistantState], (state) => state?.error ?? null);
var selectLeaveAssistantLastUpdated = createSelector([selectLeaveAssistantState], (state) => state?.lastUpdated ?? null);
var selectLeaveAssistantSummary = createSelector([selectLeaveAssistantState], (state) => state?.summary ?? null);
var selectLeaveAssistantKPIs = createSelector([selectLeaveAssistantState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
var selectLeaveAssistantCharts = createSelector([selectLeaveAssistantState], (state) => state?.charts ?? null);
var selectLeaveAssistantForecast = createSelector([selectLeaveAssistantCharts], (charts) => Array.isArray(charts?.leaveForecast) ? charts.leaveForecast : []);
var selectLeaveAssistantDistribution = createSelector([selectLeaveAssistantCharts], (charts) => Array.isArray(charts?.leaveTypeDistribution) ? charts.leaveTypeDistribution : []);
var ICON_MAP = {
	FileText,
	CheckCircle2: CircleCheck,
	AlertTriangle: TriangleAlert,
	Users,
	TrendingUp,
	CalendarRange
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectLeaveAssistantLoading);
	const error = useAppSelector(selectLeaveAssistantError);
	const backendKpis = useAppSelector(selectLeaveAssistantKPIs);
	const summary = useAppSelector(selectLeaveAssistantSummary);
	const leaveForecast = useAppSelector(selectLeaveAssistantForecast);
	const leaveDistribution = useAppSelector(selectLeaveAssistantDistribution);
	const lastUpdated = useAppSelector(selectLeaveAssistantLastUpdated);
	(0, import_react.useEffect)(() => {
		dispatch(fetchLeaveAssistantDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: `${k.score}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : FileText,
			invert: k.invert
		}));
		if (summary) return [
			{
				label: "Pending Requests",
				value: summary.pendingRequests != null ? `${summary.pendingRequests}` : "—",
				icon: FileText,
				invert: true
			},
			{
				label: "Approval Suggestions",
				value: summary.approvalSuggestions != null ? `${summary.approvalSuggestions}` : "—",
				icon: CircleCheck
			},
			{
				label: "Conflicts Detected",
				value: summary.conflictsDetected != null ? `${summary.conflictsDetected}` : "—",
				icon: TriangleAlert,
				invert: true
			},
			{
				label: "Team Availability",
				value: summary.teamAvailability != null ? typeof summary.teamAvailability === "number" ? `${summary.teamAvailability}%` : `${summary.teamAvailability}` : "—",
				icon: Users
			}
		];
		return [
			{
				label: "Pending Requests",
				value: "—",
				icon: FileText,
				invert: true
			},
			{
				label: "Approval Suggestions",
				value: "—",
				icon: CircleCheck
			},
			{
				label: "Conflicts Detected",
				value: "—",
				icon: TriangleAlert,
				invert: true
			},
			{
				label: "Team Availability",
				value: "—",
				icon: Users
			}
		];
	}, [backendKpis, summary]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (leaveForecast && leaveForecast.length > 0) list.push({
			type: "area",
			title: "Leave Forecast (next 12 weeks)",
			xKey: "w",
			series: [{
				key: "leaves",
				label: "Forecasted leaves"
			}],
			data: leaveForecast
		});
		if (leaveDistribution && leaveDistribution.length > 0) list.push({
			type: "bar",
			title: "Leave Type Distribution",
			xKey: "t",
			series: [{
				key: "days",
				label: "Days"
			}],
			data: leaveDistribution
		});
		return list;
	}, [leaveForecast, leaveDistribution]);
	const features = (0, import_react.useMemo)(() => [
		{
			title: "Leave Approval Suggestions",
			description: "AI recommends approve / discuss / decline with rationale.",
			icon: CircleCheck,
			tone: "ok"
		},
		{
			title: "Leave Conflict Detection",
			description: "Flag overlaps in critical roles and small teams.",
			icon: TriangleAlert,
			metric: summary?.conflictsDetected != null ? `${summary.conflictsDetected}` : void 0,
			tone: "warn"
		},
		{
			title: "Team Availability Analysis",
			description: "See real-time team capacity by week.",
			icon: Users,
			tone: "info"
		},
		{
			title: "Leave Forecasting",
			description: "Predict leave volume across quarters.",
			icon: TrendingUp,
			tone: "info"
		},
		{
			title: "Leave Trends",
			description: "Historic patterns by team, season and type.",
			icon: CalendarRange,
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
		icon: FileText,
		eyebrow: "AI Leave Assistant",
		title: "Approve smarter, forecast availability",
		description: "Suggest approvals, flag conflicts and forecast team availability before crunch time.",
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
				onClick: () => dispatch(fetchLeaveAssistantDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null
	});
}
//#endregion
export { Page as component };
