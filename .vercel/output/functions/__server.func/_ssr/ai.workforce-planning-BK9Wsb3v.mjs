import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, H as Sparkles, P as Target, _ as UserPlus, li as ArrowRight, lt as RefreshCw, mi as Activity, qr as Building2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { l as recruitmentApi } from "./recruitmentThunk-t5FBRB6R.mjs";
import { c as aiInsightsApi, s as aiHubApi } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.workforce-planning-BK9Wsb3v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [forecasting, setForecasting] = (0, import_react.useState)(false);
	const [workforceData, setWorkforceData] = (0, import_react.useState)(null);
	const [insightsData, setInsightsData] = (0, import_react.useState)(null);
	const [jobsCount, setJobsCount] = (0, import_react.useState)(0);
	const [totalVacancies, setTotalVacancies] = (0, import_react.useState)(0);
	const [departmentCount, setDepartmentCount] = (0, import_react.useState)(0);
	const [employeeCount, setEmployeeCount] = (0, import_react.useState)(0);
	const [departmentsList, setDepartmentsList] = (0, import_react.useState)([]);
	const [lastSyncTime, setLastSyncTime] = (0, import_react.useState)("Live sync with backend");
	const loadData = (0, import_react.useCallback)(async () => {
		try {
			const [wfRes, insightsRes, jobsRes, deptRes, empRes] = await Promise.allSettled([
				aiHubApi.getWorkforcePlanning(),
				aiInsightsApi.getDashboard(),
				recruitmentApi.getJobs(),
				apiInstance.get("/departments", { params: { limit: 100 } }),
				apiInstance.get("/employees", { params: { limit: 1 } })
			]);
			if (wfRes.status === "fulfilled" && wfRes.value) setWorkforceData(wfRes.value);
			if (insightsRes.status === "fulfilled" && insightsRes.value) setInsightsData(insightsRes.value);
			if (jobsRes.status === "fulfilled" && jobsRes.value) {
				const rawJobs = jobsRes.value;
				const list = Array.isArray(rawJobs) ? rawJobs : Array.isArray(rawJobs?.data) ? rawJobs.data : Array.isArray(rawJobs?.items) ? rawJobs.items : [];
				setJobsCount(list.length);
				setTotalVacancies(list.reduce((acc, j) => acc + (Number(j.vacancies) || 1), 0));
			}
			if (deptRes.status === "fulfilled" && deptRes.value) {
				const dData = deptRes.value.data?.data ?? deptRes.value.data;
				const depts = Array.isArray(dData) ? dData : Array.isArray(dData?.items) ? dData.items : Array.isArray(dData?.departments) ? dData.departments : [];
				setDepartmentCount(depts.length || (typeof dData?.total === "number" ? dData.total : 0));
				const names = depts.map((d) => d.name || d.title || d.department_name).filter(Boolean);
				if (names.length > 0) setDepartmentsList(names);
			}
			if (empRes.status === "fulfilled" && empRes.value) {
				const eData = empRes.value.data?.data ?? empRes.value.data;
				setEmployeeCount(typeof eData?.total === "number" ? eData.total : Array.isArray(eData) ? eData.length : Array.isArray(eData?.items) ? eData.items.length : 0);
			}
			setLastSyncTime(`Live sync: ${(/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})}`);
		} catch (err) {
			console.warn("Failed to load workforce planning metrics:", err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const localReqs = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return [];
		try {
			const saved = localStorage.getItem("ofc360:workforce_requirements");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					const clean = parsed.filter((r) => ![
						"WFR-101",
						"WFR-102",
						"WFR-103",
						"WFR-104",
						"WFR-105"
					].includes(r.id));
					if (clean.length !== parsed.length) localStorage.setItem("ofc360:workforce_requirements", JSON.stringify(clean));
					return clean;
				}
			}
		} catch {}
		return [];
	}, []);
	const handleRefresh = async () => {
		setRefreshing(true);
		await loadData();
		toast.success("Workforce planning metrics updated from database.");
	};
	const handleRunForecast = async () => {
		setForecasting(true);
		try {
			const res = await aiHubApi.forecastWorkforce({ horizonMonths: 12 });
			if (res) {
				setWorkforceData((prev) => ({
					currentHeadcount: prev?.currentHeadcount ?? employeeCount,
					forecast: res,
					budgetEstimates: prev?.budgetEstimates,
					hiringPlan: prev?.hiringPlan
				}));
				toast.success("AI Workforce Forecast regenerated successfully!");
			}
		} catch (err) {
			toast.error(err?.message || "Failed to generate workforce forecast.");
		} finally {
			setForecasting(false);
		}
	};
	const localHeadcountNeeded = localReqs.reduce((acc, r) => acc + (Number(r.headcountNeeded) || 0), 0);
	const plannedHires = totalVacancies || localHeadcountNeeded || insightsData?.recruitment?.openPositions || workforceData?.hiringPlan?.length || 0;
	const currentHeadcount = employeeCount || workforceData?.currentHeadcount || 0;
	const totalDepartments = departmentCount || departmentsList.length || 0;
	const horizonMonths = workforceData?.forecast?.horizonMonths || 12;
	const totalDemand = currentHeadcount + plannedHires;
	const capacityUtil = totalDemand > 0 ? Math.min(100, Math.round(currentHeadcount / totalDemand * 100)) : currentHeadcount > 0 ? 100 : 0;
	const kpis = [
		{
			label: "Planned Hires",
			value: plannedHires,
			icon: UserPlus,
			hint: `${jobsCount} active job postings`
		},
		{
			label: "Capacity Util.",
			value: `${capacityUtil}%`,
			icon: Activity,
			hint: `${currentHeadcount} current employees`
		},
		{
			label: "Departments",
			value: totalDepartments,
			icon: Building2,
			hint: "Registered functional units"
		},
		{
			label: "Forecast Horizon",
			value: `${horizonMonths} mo`,
			icon: TrendingUp,
			hint: "Target capacity window"
		}
	];
	const charts = (0, import_react.useMemo)(() => {
		const list = [];
		if (insightsData?.charts?.headcountForecast && insightsData.charts.headcountForecast.length > 0) list.push({
			type: "area",
			title: "Headcount Forecast",
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
			data: insightsData.charts.headcountForecast
		});
		else if (workforceData?.hiringPlan && workforceData.hiringPlan.length > 0) list.push({
			type: "line",
			title: "Hiring Plan Schedule",
			description: "Scheduled headcount target by month",
			xKey: "targetMonth",
			series: [{
				key: "count",
				label: "Positions Target",
				color: "oklch(0.68 0.2 290)"
			}],
			data: workforceData.hiringPlan
		});
		if (insightsData?.charts?.hiringDemand && insightsData.charts.hiringDemand.length > 0) list.push({
			type: "bar",
			title: "Department Capacity vs. Demand",
			description: "Open positions vs target hiring demand per department",
			xKey: "dept",
			series: [{
				key: "open",
				label: "Open Positions",
				color: "oklch(0.78 0.18 70)"
			}, {
				key: "demand",
				label: "Target Demand",
				color: "oklch(0.68 0.2 290)"
			}],
			data: insightsData.charts.hiringDemand
		});
		else if (localReqs.length > 0) {
			const deptMap = {};
			localReqs.forEach((r) => {
				if (!deptMap[r.department]) deptMap[r.department] = {
					current: r.currentHeadcount || 0,
					needed: 0
				};
				deptMap[r.department].needed += r.headcountNeeded || 0;
			});
			const dataRows = Object.entries(deptMap).map(([d, val]) => ({
				d,
				cap: val.current,
				dem: val.needed
			}));
			if (dataRows.length > 0) list.push({
				type: "bar",
				title: "Department Headcount Requisitions",
				description: "Current department headcount vs. requisitions needed",
				xKey: "d",
				series: [{
					key: "cap",
					label: "Current Headcount",
					color: "oklch(0.7 0.16 200)"
				}, {
					key: "dem",
					label: "Requisitions Needed",
					color: "oklch(0.68 0.2 290)"
				}],
				data: dataRows
			});
		}
		return list;
	}, [
		insightsData,
		workforceData,
		localReqs
	]);
	const features = [
		{
			title: "Hiring Forecasts",
			description: "Quarter-by-quarter capacity modeling linked to verified job openings and vacancies.",
			icon: UserPlus,
			metric: `${plannedHires} Planned`,
			tone: plannedHires > 0 ? "info" : "ok"
		},
		{
			title: "Department Capacity Planning",
			description: "Real-time visibility into active functional units and staffing requirements.",
			icon: Building2,
			metric: `${totalDepartments} Depts`,
			tone: "info"
		},
		{
			title: "Resource Utilization",
			description: "Ratio of current productive headcount relative to overall staffing demand.",
			icon: Activity,
			metric: `${capacityUtil}%`,
			progress: capacityUtil,
			tone: capacityUtil >= 80 ? "ok" : "warn"
		},
		{
			title: "Future Workforce Needs",
			description: "Predictive modeling and skill requirements projected across rolling forecast window.",
			icon: TrendingUp,
			metric: `${horizonMonths}-mo horizon`,
			tone: "info"
		},
		{
			title: "Workforce Optimization",
			description: "AI suggests internal mobility, redeployments, and department allocations.",
			icon: Sparkles,
			metric: `${localReqs.length} Requisitions`,
			tone: "info"
		}
	];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-muted-foreground",
			children: "Loading workforce planning analytics from backend..."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
			icon: Target,
			eyebrow: "AI Workforce Planning",
			title: "Plan capacity, hiring and utilization with AI",
			description: "Model hiring forecasts, department capacity and resource utilization from live backend records.",
			lastAnalysis: lastSyncTime,
			kpis,
			charts,
			features,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold tracking-tight",
						children: "Department Headcount & Requisition Actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Manage headcount requirements, sync vacancies with recruitment, and run AI forecast simulations."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 text-xs gap-1.5",
								onClick: handleRefresh,
								disabled: refreshing,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}` }), refreshing ? "Syncing..." : "Sync DB"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 text-xs gap-1.5 bg-gradient-brand text-brand-foreground shadow-glow border-none",
								onClick: handleRunForecast,
								disabled: forecasting,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: `h-3.5 w-3.5 ${forecasting ? "animate-spin" : ""}` }), forecasting ? "Forecasting..." : "Run AI Forecast"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "h-8 text-xs gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/dashboard/recruitment/workforce-planning",
									children: ["Manage Requisitions ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
								})
							})
						]
					})]
				}), charts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-xl border border-dashed border-border p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "mx-auto h-8 w-8 text-muted-foreground/40 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: "No custom forecast charts available yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1 max-w-md mx-auto",
							children: "All mock data has been removed. Once you create department headcount requisitions or publish job vacancies, real trend and capacity charts will appear here automatically."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex justify-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								className: "text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/recruitment/workforce-planning",
									children: "Create Workforce Requirement"
								})
							})
						})
					]
				})]
			})
		})
	});
}
//#endregion
export { Page as component };
