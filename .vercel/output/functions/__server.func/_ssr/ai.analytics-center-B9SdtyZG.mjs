import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { An as Gauge, Fr as ChartLine, H as Sparkles, Ir as ChartColumn, Jr as Briefcase, Sr as CircleCheck, Tr as CircleAlert, Yr as Brain, gn as HeartPulse, i as Zap, lt as RefreshCw, ri as Banknote, y as UserMinus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { y as fetchAIInsightsDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { _ as selectAIInsightsPayrollTrend, d as selectAIInsightsKPIs, f as selectAIInsightsLoading, l as selectAIInsightsHeadcountForecast, s as selectAIInsightsError, u as selectAIInsightsHiringDemand, x as selectAIInsightsSkillGap } from "./aiInsightsSelectors-C_ka5XtA.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.analytics-center-B9SdtyZG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICON_MAP = {
	HeartPulse,
	Sparkles,
	UserMinus,
	Zap,
	CheckCircle2: CircleCheck,
	Briefcase,
	Brain,
	BarChart3: ChartColumn,
	Gauge,
	Banknote
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectAIInsightsLoading);
	const error = useAppSelector(selectAIInsightsError);
	const backendKpis = useAppSelector(selectAIInsightsKPIs);
	const headcountForecast = useAppSelector(selectAIInsightsHeadcountForecast);
	const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
	const payrollTrend = useAppSelector(selectAIInsightsPayrollTrend);
	const skillGap = useAppSelector(selectAIInsightsSkillGap);
	(0, import_react.useEffect)(() => {
		dispatch(fetchAIInsightsDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: `${k.score}${k.label.includes("Risk") || k.label.includes("Score") || k.label.includes("Health") || k.label.includes("Satisfaction") || k.label.includes("Efficiency") ? "%" : ""}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Sparkles,
			invert: k.invert
		}));
		return [];
	}, [backendKpis]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (headcountForecast && headcountForecast.length > 0) list.push({
			type: "area",
			title: "Workforce Headcount Forecast",
			description: "AI projection based on current headcount & hiring velocity",
			xKey: "month",
			series: [{
				key: "current",
				label: "Actual Headcount",
				color: "oklch(0.7 0.16 200)"
			}, {
				key: "forecast",
				label: "AI Forecasted",
				color: "oklch(0.68 0.2 290)"
			}],
			data: headcountForecast
		});
		if (hiringDemand && hiringDemand.length > 0) list.push({
			type: "bar",
			title: "Department Hiring Demand",
			description: "Open positions vs target hiring demand per department",
			xKey: "dept",
			series: [{
				key: "open",
				label: "Open Positions",
				color: "oklch(0.78 0.18 70)"
			}, {
				key: "demand",
				label: "Target Demand",
				color: "oklch(0.72 0.18 320)"
			}],
			data: hiringDemand
		});
		if (payrollTrend && payrollTrend.length > 0) list.push({
			type: "line",
			title: "Payroll Cost Projection",
			description: "Monthly payroll expenditure trends in ₹ Lakhs",
			xKey: "m",
			series: [{
				key: "cost",
				label: "Payroll Cost (₹L)",
				color: "oklch(0.68 0.2 290)"
			}],
			data: payrollTrend
		});
		if (skillGap && skillGap.length > 0) list.push({
			type: "bar",
			title: "Org Skill Gap Index",
			description: "Current proficiency vs benchmark requirements",
			xKey: "skill",
			series: [{
				key: "have",
				label: "Current Level",
				color: "oklch(0.7 0.16 200)"
			}, {
				key: "need",
				label: "Target Level",
				color: "oklch(0.72 0.18 320)"
			}],
			data: skillGap
		});
		return list;
	}, [
		headcountForecast,
		hiringDemand,
		payrollTrend,
		skillGap
	]);
	const features = [
		{
			title: "Executive Dashboard",
			description: "Board-ready workforce metrics & real-time DB analytics.",
			icon: ChartColumn,
			tone: "info"
		},
		{
			title: "Predictive Analytics",
			description: "Forecasts for attrition, headcount growth, and budget impact.",
			icon: Brain,
			tone: "info"
		},
		{
			title: "Workforce Intelligence",
			description: "Multi-tenant insights across health, productivity, & retention.",
			icon: ChartLine,
			tone: "info"
		},
		{
			title: "Hiring Intelligence",
			description: "Funnel quality, candidate matching, and time-to-fill ROI.",
			icon: Briefcase,
			tone: "info"
		},
		{
			title: "Payroll Intelligence",
			description: "Cost distribution, overtime anomalies, and savings opportunities.",
			icon: Banknote,
			tone: "info"
		},
		{
			title: "Performance Intelligence",
			description: "Skill gap index, top performers calibration, & career trajectory.",
			icon: Gauge,
			tone: "info"
		}
	];
	if (loading && (!backendKpis || backendKpis.length === 0)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AIModulePage, {
		kpis,
		charts,
		features,
		children: [error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => dispatch(fetchAIInsightsDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null, !loading && !error && kpis.length === 0 && charts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "mb-3 h-10 w-10 stroke-1 text-muted-foreground/60" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold text-foreground",
					children: "No insights available yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-xs text-muted-foreground",
					children: "Workforce intelligence and predictive analytics will appear once the system collects enough operational metrics."
				})
			]
		}) : null]
	});
}
//#endregion
export { Page as component };
