import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { H as Sparkles, It as MessageSquare, Qt as ListChecks, Tr as CircleAlert, f as Video, hr as ClipboardList, lt as RefreshCw, p as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { O as fetchMeetingIntelligenceDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.meeting-intelligence-BYs8PKHF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectMeetingIntelligenceState = (state) => state.meetingIntelligence;
var selectMeetingIntelligenceLoading = createSelector([selectMeetingIntelligenceState], (state) => state?.loading ?? false);
var selectMeetingIntelligenceError = createSelector([selectMeetingIntelligenceState], (state) => state?.error ?? null);
var selectMeetingIntelligenceLastUpdated = createSelector([selectMeetingIntelligenceState], (state) => state?.lastUpdated ?? null);
var selectMeetingIntelligenceSummary = createSelector([selectMeetingIntelligenceState], (state) => state?.summary ?? null);
var selectMeetingIntelligenceKPIs = createSelector([selectMeetingIntelligenceState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
createSelector([selectMeetingIntelligenceState], (state) => Array.isArray(state?.actionItems) ? state.actionItems : []);
var selectMeetingIntelligenceCharts = createSelector([selectMeetingIntelligenceState], (state) => state?.charts ?? null);
var selectMeetingIntelligenceActionItemsByWeek = createSelector([selectMeetingIntelligenceCharts], (charts) => Array.isArray(charts?.actionItemsByWeek) ? charts.actionItemsByWeek : []);
var selectMeetingIntelligenceVolume = createSelector([selectMeetingIntelligenceCharts], (charts) => Array.isArray(charts?.meetingVolume) ? charts.meetingVolume : []);
var ICON_MAP = {
	Video,
	ListChecks,
	Users,
	Sparkles,
	MessageSquare,
	ClipboardList
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectMeetingIntelligenceLoading);
	const error = useAppSelector(selectMeetingIntelligenceError);
	const backendKpis = useAppSelector(selectMeetingIntelligenceKPIs);
	const summary = useAppSelector(selectMeetingIntelligenceSummary);
	const actionItemsByWeek = useAppSelector(selectMeetingIntelligenceActionItemsByWeek);
	const meetingVolume = useAppSelector(selectMeetingIntelligenceVolume);
	const lastUpdated = useAppSelector(selectMeetingIntelligenceLastUpdated);
	(0, import_react.useEffect)(() => {
		dispatch(fetchMeetingIntelligenceDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: `${k.score}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Video,
			invert: k.invert
		}));
		if (summary) return [
			{
				label: "Meetings analyzed",
				value: summary.meetingsAnalyzed != null ? `${summary.meetingsAnalyzed}` : "—",
				icon: Video
			},
			{
				label: "Action items",
				value: summary.actionItems != null ? `${summary.actionItems}` : "—",
				icon: ListChecks
			},
			{
				label: "Follow-ups",
				value: summary.followUps != null ? `${summary.followUps}` : "—",
				icon: ClipboardList,
				invert: true
			},
			{
				label: "Avg duration",
				value: summary.avgDuration != null ? typeof summary.avgDuration === "number" ? `${summary.avgDuration}m` : `${summary.avgDuration}` : "—",
				icon: Sparkles,
				invert: true
			}
		];
		return [
			{
				label: "Meetings analyzed",
				value: "—",
				icon: Video
			},
			{
				label: "Action items",
				value: "—",
				icon: ListChecks
			},
			{
				label: "Follow-ups",
				value: "—",
				icon: ClipboardList,
				invert: true
			},
			{
				label: "Avg duration",
				value: "—",
				icon: Sparkles,
				invert: true
			}
		];
	}, [backendKpis, summary]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (actionItemsByWeek && actionItemsByWeek.length > 0) list.push({
			type: "bar",
			title: "Action Items by Week",
			xKey: "w",
			series: [{
				key: "items",
				label: "Items"
			}],
			data: actionItemsByWeek
		});
		if (meetingVolume && meetingVolume.length > 0) list.push({
			type: "line",
			title: "Meeting Volume",
			xKey: "d",
			series: [{
				key: "n",
				label: "Meetings"
			}],
			data: meetingVolume
		});
		return list;
	}, [actionItemsByWeek, meetingVolume]);
	const features = (0, import_react.useMemo)(() => [
		{
			title: "Meeting Summaries",
			description: "Concise recap with key decisions & owners.",
			icon: Sparkles,
			tone: "info"
		},
		{
			title: "Action Items",
			description: "Extracted, assigned and tracked automatically.",
			icon: ListChecks,
			metric: summary?.actionItems != null ? `${summary.actionItems}` : void 0,
			tone: "ok"
		},
		{
			title: "Follow-up Tracking",
			description: "Open items with status across cycles.",
			icon: ClipboardList,
			metric: summary?.followUps != null ? `${summary.followUps}` : void 0,
			tone: "info"
		},
		{
			title: "Team Insights",
			description: "Who talks most, who is silent, sentiment trend.",
			icon: Users,
			tone: "info"
		},
		{
			title: "Discussion Analytics",
			description: "Topics, time spent, recurring themes.",
			icon: MessageSquare,
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
		icon: Video,
		eyebrow: "AI Meeting Intelligence",
		title: "Every meeting, summarized and actioned",
		description: "Auto-generate summaries, action items and follow-ups from your team meetings.",
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
				onClick: () => dispatch(fetchMeetingIntelligenceDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null
	});
}
//#endregion
export { Page as component };
