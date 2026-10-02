import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { T as TriangleAlert, Tr as CircleAlert, Un as FileExclamationPoint, gr as ClipboardCheck, it as Scale, lt as RefreshCw, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { w as fetchComplianceDashboard } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.compliance-monitor-BiJwUlTj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectComplianceState = (state) => state.compliance;
var selectComplianceLoading = createSelector([selectComplianceState], (state) => state?.loading ?? false);
var selectComplianceError = createSelector([selectComplianceState], (state) => state?.error ?? null);
var selectComplianceLastUpdated = createSelector([selectComplianceState], (state) => state?.lastUpdated ?? null);
var selectComplianceSummary = createSelector([selectComplianceState], (state) => state?.summary ?? null);
var selectComplianceKPIs = createSelector([selectComplianceState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
createSelector([selectComplianceState], (state) => Array.isArray(state?.risks) ? state.risks : []);
var selectComplianceCharts = createSelector([selectComplianceState], (state) => state?.charts ?? null);
var selectComplianceTrend = createSelector([selectComplianceCharts], (charts) => Array.isArray(charts?.complianceTrend) ? charts.complianceTrend : []);
var selectComplianceRisksByCategory = createSelector([selectComplianceCharts], (charts) => Array.isArray(charts?.risksByCategory) ? charts.risksByCategory : []);
var ICON_MAP = {
	ShieldCheck,
	AlertTriangle: TriangleAlert,
	FileWarning: FileExclamationPoint,
	ClipboardCheck,
	Scale
};
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectComplianceLoading);
	const error = useAppSelector(selectComplianceError);
	const backendKpis = useAppSelector(selectComplianceKPIs);
	const summary = useAppSelector(selectComplianceSummary);
	const complianceTrend = useAppSelector(selectComplianceTrend);
	const risksByCategory = useAppSelector(selectComplianceRisksByCategory);
	const lastUpdated = useAppSelector(selectComplianceLastUpdated);
	(0, import_react.useEffect)(() => {
		dispatch(fetchComplianceDashboard());
	}, [dispatch]);
	const kpis = (0, import_react.useMemo)(() => {
		if (backendKpis && backendKpis.length > 0) return backendKpis.map((k) => ({
			label: k.label,
			value: typeof k.score === "number" && (k.label.includes("Score") || k.label.includes("Readiness")) ? `${k.score}%` : `${k.score}`,
			trend: k.trend,
			hint: k.hint,
			icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : ShieldCheck,
			invert: k.invert
		}));
		if (summary) return [
			{
				label: "Compliance Score",
				value: summary.complianceScore != null ? `${summary.complianceScore}%` : "—",
				icon: ShieldCheck
			},
			{
				label: "Open Risks",
				value: summary.openRisks != null ? `${summary.openRisks}` : "—",
				icon: TriangleAlert,
				invert: true
			},
			{
				label: "Missing Docs",
				value: summary.missingDocs != null ? `${summary.missingDocs}` : "—",
				icon: FileExclamationPoint,
				invert: true
			},
			{
				label: "Audit Readiness",
				value: summary.auditReadiness != null ? `${summary.auditReadiness}%` : "—",
				icon: ClipboardCheck
			}
		];
		return [
			{
				label: "Compliance Score",
				value: "—",
				icon: ShieldCheck
			},
			{
				label: "Open Risks",
				value: "—",
				icon: TriangleAlert,
				invert: true
			},
			{
				label: "Missing Docs",
				value: "—",
				icon: FileExclamationPoint,
				invert: true
			},
			{
				label: "Audit Readiness",
				value: "—",
				icon: ClipboardCheck
			}
		];
	}, [backendKpis, summary]);
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (complianceTrend && complianceTrend.length > 0) list.push({
			type: "area",
			title: "Compliance Trend",
			xKey: "m",
			series: [{
				key: "score",
				label: "Score"
			}],
			data: complianceTrend
		});
		if (risksByCategory && risksByCategory.length > 0) list.push({
			type: "bar",
			title: "Risks by Category",
			xKey: "c",
			series: [{
				key: "n",
				label: "Open risks"
			}],
			data: risksByCategory
		});
		return list;
	}, [complianceTrend, risksByCategory]);
	const features = (0, import_react.useMemo)(() => [
		{
			title: "Compliance Checks",
			description: "Continuous checks across HR and payroll workflows.",
			icon: ShieldCheck,
			metric: summary?.complianceScore != null ? `${summary.complianceScore}%` : void 0,
			progress: summary?.complianceScore != null ? Number(summary.complianceScore) : void 0,
			tone: "ok"
		},
		{
			title: "Labor Law Monitoring",
			description: "Stay aligned with applicable jurisdiction rules.",
			icon: Scale,
			tone: "info"
		},
		{
			title: "Missing Documents",
			description: "Detect missing or expired employee docs.",
			icon: FileExclamationPoint,
			metric: summary?.missingDocs != null ? `${summary.missingDocs}` : void 0,
			tone: "warn"
		},
		{
			title: "Risk Detection",
			description: "Predictive risk scores across compliance domains.",
			icon: TriangleAlert,
			metric: summary?.openRisks != null ? `${summary.openRisks}` : void 0,
			tone: "warn"
		},
		{
			title: "Audit Readiness",
			description: "One-click prep with full evidence trail.",
			icon: ClipboardCheck,
			metric: summary?.auditReadiness != null ? `${summary.auditReadiness}%` : void 0,
			progress: summary?.auditReadiness != null ? Number(summary.auditReadiness) : void 0,
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
		icon: ShieldCheck,
		eyebrow: "AI Compliance Monitor",
		title: "Stay audit-ready, automatically",
		description: "Monitor labor law compliance, missing documents, risk and audit readiness.",
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
				onClick: () => dispatch(fetchComplianceDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null
	});
}
//#endregion
export { Page as component };
