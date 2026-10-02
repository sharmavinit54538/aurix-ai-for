import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as TrendingDown, Dr as ChevronRight, Dt as Package, E as TrendingUp, Gn as FileCheck, H as Sparkles, It as MessageSquare, Jr as Briefcase, Ln as FileText, Sr as CircleCheck, T as TriangleAlert, Ur as CalendarDays, Ut as LogOut, _ as UserPlus, a as X, dn as IndianRupee, er as Download, gr as ClipboardCheck, i as Zap, ir as CreditCard, lt as RefreshCw, o as Wrench, oi as Award, p as Users, pr as Clock, qr as Building2, si as ArrowUpRight, x as UserCheck, y as UserMinus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { c as useNotifications, i as useArchive, t as formatRelativeTime } from "./notification-utils-1y-FPLpt.mjs";
import { t as GeminiIcon } from "./GeminiIcon-7yNPSnS8.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { t as getEventTypeDot } from "./color-maps-DnqgCmfa.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExecutiveDashboardPage-CfgrPbPh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatIndianCurrency(amount) {
	if (amount == null || isNaN(amount) || amount === 0) return "₹0";
	if (Math.abs(amount) >= 1e7) {
		const cr = amount / 1e7;
		return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
	}
	if (Math.abs(amount) >= 1e5) {
		const lk = amount / 1e5;
		return `₹${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(2)} L`;
	}
	return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
var DEPT_CHART_COLORS = [
	"#8b5cf6",
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#06b6d4",
	"#ec4899",
	"#6366f1",
	"#14b8a6"
];
function useExecutiveDashboardData() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [totalEmployees, setTotalEmployees] = (0, import_react.useState)(0);
	const [totalDepartments, setTotalDepartments] = (0, import_react.useState)(0);
	const [totalJobs, setTotalJobs] = (0, import_react.useState)(0);
	const [totalAssets, setTotalAssets] = (0, import_react.useState)(0);
	const [totalExits, setTotalExits] = (0, import_react.useState)(0);
	const [totalPayrollCost, setTotalPayrollCost] = (0, import_react.useState)(0);
	const [headcountTrend, setHeadcountTrend] = (0, import_react.useState)([]);
	const [headcountChange, setHeadcountChange] = (0, import_react.useState)(null);
	const [headcountChangeType, setHeadcountChangeType] = (0, import_react.useState)("neutral");
	const [jobsBars, setJobsBars] = (0, import_react.useState)([]);
	const [deptDistribution, setDeptDistribution] = (0, import_react.useState)([]);
	const [payrollHistory, setPayrollHistory] = (0, import_react.useState)([]);
	const [payrollStatusCounts, setPayrollStatusCounts] = (0, import_react.useState)({
		processed: 0,
		pending: 0,
		paid: 0
	});
	const [assetStatusCounts, setAssetStatusCounts] = (0, import_react.useState)({
		assigned: 0,
		available: 0,
		repair: 0,
		assignedPercent: 0,
		availablePercent: 0
	});
	const [exitStatusCounts, setExitStatusCounts] = (0, import_react.useState)({
		pending: 0,
		inProgress: 0,
		completed: 0
	});
	const [exitTimeline, setExitTimeline] = (0, import_react.useState)([]);
	const [deptPerformance, setDeptPerformance] = (0, import_react.useState)([]);
	const [activityFeed, setActivityFeed] = (0, import_react.useState)([]);
	const [activeJobsList, setActiveJobsList] = (0, import_react.useState)([]);
	const [payrollOverview, setPayrollOverview] = (0, import_react.useState)({
		totalCostFormatted: "₹0",
		payrollStatus: [
			{
				label: "Processed",
				value: 0,
				color: "text-emerald-500",
				bg: "bg-emerald-500/10"
			},
			{
				label: "Pending Approval",
				value: 0,
				color: "text-amber-500",
				bg: "bg-amber-500/10"
			},
			{
				label: "Disbursed / Paid",
				value: 0,
				color: "text-blue-500",
				bg: "bg-blue-500/10"
			}
		],
		monthlySalaryCostChart: []
	});
	const fetchAllDashboardData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const [deptsRes, hierRes, jobsRes, assetsRes, exitsRes, internalRes, payrollStructuresRes, payrollDashboardRes] = await Promise.allSettled([
				apiInstance.get("/departments", { params: { limit: 100 } }),
				apiInstance.get("/hierarchy"),
				apiInstance.get("/jobs", { params: { limit: 100 } }),
				apiInstance.get("/assets", { params: { limit: 100 } }),
				apiInstance.get("/exits", { params: { limit: 100 } }),
				apiInstance.get("/internal/dashboard"),
				apiInstance.get("/payroll/salary-structures"),
				apiInstance.get("/payroll/dashboard")
			]);
			let deptsList = [];
			if (deptsRes.status === "fulfilled" && deptsRes.value.data?.data) {
				const rawDepts = deptsRes.value.data.data.items ?? deptsRes.value.data.data;
				deptsList = Array.isArray(rawDepts) ? rawDepts : [];
				setTotalDepartments(deptsList.length);
				const validDeptDist = [];
				let sumHeadcount = 0;
				deptsList.forEach((d) => {
					const count = Number(d.employee_count ?? d.currentEmployeeCount ?? 0);
					if (count > 0) sumHeadcount += count;
				});
				deptsList.forEach((d, idx) => {
					const count = Number(d.employee_count ?? d.currentEmployeeCount ?? 0);
					if (count > 0) validDeptDist.push({
						name: d.department_name ?? d.name ?? `Dept #${idx + 1}`,
						count,
						percentage: sumHeadcount > 0 ? Math.round(count / sumHeadcount * 100) : 0,
						color: DEPT_CHART_COLORS[idx % DEPT_CHART_COLORS.length]
					});
				});
				setDeptDistribution(validDeptDist);
				setDeptPerformance(deptsList.slice(0, 6).map((d, idx) => ({
					name: d.department_name ?? d.name ?? `Dept #${idx + 1}`,
					headcount: Number(d.employee_count ?? d.currentEmployeeCount ?? 0),
					attendance: Number(d.attendance_rate ?? d.attendance ?? 0),
					productivity: Number(d.productivity_rate ?? d.productivity ?? 0),
					openPositions: Number(d.open_positions ?? 0),
					color: DEPT_CHART_COLORS[idx % DEPT_CHART_COLORS.length],
					bgColor: "bg-slate-800/40"
				})));
			} else {
				setTotalDepartments(0);
				setDeptDistribution([]);
			}
			let empCount = 0;
			if (hierRes.status === "fulfilled" && hierRes.value.data?.data) {
				const hierData = hierRes.value.data.data;
				empCount = Array.isArray(hierData) ? hierData.length : hierData.total_nodes ?? hierData.nodes?.length ?? deptsList.reduce((acc, d) => acc + (Number(d.employee_count) || 0), 0) ?? 0;
				const rawHistory = hierData.history ?? hierData.monthly_trend ?? hierData.trend ?? [];
				if (Array.isArray(rawHistory) && rawHistory.length > 0) setHeadcountTrend(rawHistory.map((item) => ({
					date: String(item.month ?? item.date ?? item.period ?? ""),
					value: Number(item.headcount ?? item.count ?? item.value ?? 0)
				})).filter((pt) => Boolean(pt.date)));
				else setHeadcountTrend([]);
				const rawChange = hierData.growth_mom ?? hierData.change_percentage ?? hierData.change;
				if (rawChange != null && rawChange !== "") {
					const num = Number(rawChange);
					if (!isNaN(num)) {
						setHeadcountChange(`${num >= 0 ? "+" : ""}${num}%`);
						setHeadcountChangeType(num > 0 ? "up" : num < 0 ? "down" : "neutral");
					} else {
						setHeadcountChange(String(rawChange));
						setHeadcountChangeType("neutral");
					}
				} else {
					setHeadcountChange(null);
					setHeadcountChangeType("neutral");
				}
			} else {
				empCount = deptsList.reduce((acc, d) => acc + (Number(d.employee_count) || 0), 0) || 0;
				setHeadcountTrend([]);
				setHeadcountChange(null);
			}
			setTotalEmployees(empCount);
			if (jobsRes.status === "fulfilled" && jobsRes.value.data?.data) {
				const rawJobs = jobsRes.value.data.data.items ?? jobsRes.value.data.data;
				const jobsList = Array.isArray(rawJobs) ? rawJobs : [];
				const openJobs = jobsList.filter((j) => {
					const st = String(j.status ?? "").toLowerCase();
					return !st || st === "open" || st === "active" || st === "published";
				});
				setTotalJobs(openJobs.length > 0 ? openJobs.length : jobsList.length);
				const deptJobMap = /* @__PURE__ */ new Map();
				(openJobs.length > 0 ? openJobs : jobsList).forEach((j) => {
					const dept = String(j.department ?? j.department_name ?? "General").trim();
					deptJobMap.set(dept, (deptJobMap.get(dept) || 0) + 1);
				});
				if (deptJobMap.size > 0) setJobsBars(Array.from(deptJobMap.entries()).slice(0, 6).map(([fullLabel, count]) => ({
					label: fullLabel.length > 8 ? `${fullLabel.slice(0, 7)}…` : fullLabel,
					fullLabel,
					count
				})));
				else setJobsBars([]);
				setActiveJobsList(jobsList.slice(0, 5).map((j) => ({
					id: String(j.id ?? ""),
					title: j.title ?? j.job_title ?? "Job Opening",
					dept: j.department ?? j.department_name ?? "General",
					applicants: Number(j.applicant_count ?? j.applications_count ?? 0),
					status: j.status ?? "OPEN"
				})));
			} else {
				setTotalJobs(0);
				setJobsBars([]);
				setActiveJobsList([]);
			}
			if (assetsRes.status === "fulfilled" && assetsRes.value.data?.data) {
				const rawAssets = assetsRes.value.data.data.items ?? assetsRes.value.data.data;
				const assetsList = Array.isArray(rawAssets) ? rawAssets : [];
				const total = assetsList.length;
				setTotalAssets(total);
				let assigned = 0;
				let available = 0;
				let repair = 0;
				assetsList.forEach((a) => {
					const st = String(a.status ?? "").toLowerCase().trim();
					if (st === "assigned" || st === "in_use" || a.assigned_to || a.assignedTo) assigned++;
					else if (st === "available" || st === "in_stock" || st === "unassigned") available++;
					else if (st === "under-repair" || st === "repair" || st === "maintenance") repair++;
				});
				const assignedPercent = total > 0 ? Math.round(assigned / total * 100) : 0;
				const availablePercent = total > 0 ? Math.round(available / total * 100) : 0;
				setAssetStatusCounts({
					assigned,
					available,
					repair,
					assignedPercent,
					availablePercent
				});
			} else {
				setTotalAssets(0);
				setAssetStatusCounts({
					assigned: 0,
					available: 0,
					repair: 0,
					assignedPercent: 0,
					availablePercent: 0
				});
			}
			if (exitsRes.status === "fulfilled" && exitsRes.value.data?.data) {
				const rawExits = exitsRes.value.data.data.items ?? exitsRes.value.data.data;
				const exitsList = Array.isArray(rawExits) ? rawExits : [];
				setTotalExits(exitsList.length);
				let pending = 0;
				let inProgress = 0;
				let completed = 0;
				const timelineMap = /* @__PURE__ */ new Map();
				exitsList.forEach((x) => {
					const st = String(x.status ?? "").toUpperCase().trim();
					if (st === "PENDING" || st === "INITIATED" || st === "NEW") pending++;
					else if (st === "IN_PROGRESS" || st === "PROCESSING" || st === "CLEARANCE") inProgress++;
					else if (st === "COMPLETED" || st === "APPROVED" || st === "SETTLED" || st === "CLOSED") completed++;
					else pending++;
					const rawDate = x.exit_date ?? x.created_at ?? x.resignation_date;
					if (rawDate) {
						const dateStr = String(rawDate).split("T")[0];
						const monthLabel = new Date(dateStr).toLocaleDateString("en-US", { month: "short" });
						if (monthLabel && monthLabel !== "Invalid Date") timelineMap.set(monthLabel, (timelineMap.get(monthLabel) || 0) + 1);
					}
				});
				setExitStatusCounts({
					pending,
					inProgress,
					completed
				});
				if (timelineMap.size > 1) setExitTimeline(Array.from(timelineMap.entries()).map(([date, count]) => ({
					date,
					count
				})));
				else setExitTimeline([]);
			} else {
				setTotalExits(0);
				setExitStatusCounts({
					pending: 0,
					inProgress: 0,
					completed: 0
				});
				setExitTimeline([]);
			}
			if (internalRes.status === "fulfilled" && internalRes.value.data?.data) {
				const internalData = internalRes.value.data.data;
				const rawAnnouncements = internalData.pinned_announcements ?? internalData.recent_announcements ?? [];
				const rawNews = internalData.news_articles ?? [];
				const announcements = Array.isArray(rawAnnouncements) ? rawAnnouncements : [];
				const news = Array.isArray(rawNews) ? rawNews : [];
				const feed = [];
				announcements.slice(0, 3).forEach((a, idx) => {
					feed.push({
						id: String(a.id ?? `ann_${idx}`),
						type: "alert",
						icon: "Megaphone",
						text: a.title ?? "New Announcement",
						user: a.author_name ?? "HR Team",
						time: "Recently",
						color: "text-amber-500 bg-amber-500/10"
					});
				});
				news.slice(0, 3).forEach((n, idx) => {
					feed.push({
						id: String(n.id ?? `news_${idx}`),
						type: "document",
						icon: "FileText",
						text: n.title ?? "Company News",
						user: n.author_name ?? "Executive Office",
						time: "Today",
						color: "text-blue-500 bg-blue-500/10"
					});
				});
				if (feed.length > 0) setActivityFeed(feed);
			}
			let calculatedGrossSum = 0;
			if (payrollStructuresRes.status === "fulfilled" && payrollStructuresRes.value.data?.data) {
				const rawStruct = payrollStructuresRes.value.data.data.items ?? payrollStructuresRes.value.data.data;
				calculatedGrossSum = (Array.isArray(rawStruct) ? rawStruct : []).reduce((acc, item) => acc + Number(item.gross_salary ?? item.base_salary ?? item.annual_ctc ?? 0), 0);
			}
			let summaryData = null;
			let rawRecentRuns = [];
			if (payrollDashboardRes.status === "fulfilled" && payrollDashboardRes.value.data?.data) {
				summaryData = payrollDashboardRes.value.data.data.summary ?? payrollDashboardRes.value.data.data;
				rawRecentRuns = payrollDashboardRes.value.data.data.recentRuns ?? payrollDashboardRes.value.data.data.recent_runs ?? [];
			}
			const totalGross = Number(summaryData?.total_gross ?? calculatedGrossSum ?? 0);
			setTotalPayrollCost(totalGross);
			const formattedCost = formatIndianCurrency(totalGross);
			const processedCount = Number(summaryData?.processed_count ?? 0);
			const paidCount = Number(summaryData?.paid_count ?? 0);
			const pendingCount = Number(summaryData?.pending_count ?? 0);
			setPayrollStatusCounts({
				processed: processedCount,
				pending: pendingCount,
				paid: paidCount
			});
			const realPayrollHistory = [];
			if (Array.isArray(rawRecentRuns) && rawRecentRuns.length > 0) rawRecentRuns.forEach((run) => {
				const month = run.periodName ?? run.period_name ?? (run.runDate ? new Date(run.runDate).toLocaleDateString("en-US", { month: "short" }) : "Run");
				const cost = Number(run.grossPayroll ?? run.gross_payroll ?? 0);
				if (month && cost > 0) realPayrollHistory.push({
					month,
					cost
				});
			});
			setPayrollHistory(realPayrollHistory);
			setPayrollOverview({
				totalCostFormatted: formattedCost,
				payrollStatus: [
					{
						label: "Processed",
						value: processedCount,
						color: "text-emerald-500",
						bg: "bg-emerald-500/10"
					},
					{
						label: "Pending Approval",
						value: pendingCount,
						color: "text-amber-500",
						bg: "bg-amber-500/10"
					},
					{
						label: "Disbursed / Paid",
						value: paidCount,
						color: "text-blue-500",
						bg: "bg-blue-500/10"
					}
				],
				monthlySalaryCostChart: realPayrollHistory
			});
		} catch (err) {
			console.error("Error fetching executive dashboard live data:", err);
			setError(err?.message || "Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchAllDashboardData();
	}, [fetchAllDashboardData]);
	return {
		loading,
		error,
		totalEmployees,
		totalDepartments,
		totalJobs,
		totalAssets,
		totalExits,
		totalPayrollCost,
		kpiDetails: (0, import_react.useMemo)(() => ({
			headcount: {
				value: totalEmployees,
				change: headcountChange,
				changeType: headcountChangeType,
				trend: headcountTrend,
				hasTrend: headcountTrend.length > 1,
				link: "/dashboard/employees"
			},
			openings: {
				value: totalJobs,
				change: null,
				changeType: "neutral",
				bars: jobsBars,
				hasBars: jobsBars.length > 0,
				link: "/dashboard/recruitment/jobs"
			},
			departments: {
				value: totalDepartments,
				distribution: deptDistribution,
				hasDistribution: deptDistribution.length > 0,
				link: "/dashboard/departments"
			},
			payroll: {
				valueFormatted: formatIndianCurrency(totalPayrollCost),
				rawValue: totalPayrollCost,
				history: payrollHistory,
				hasHistory: payrollHistory.length > 1,
				statusCounts: payrollStatusCounts,
				link: "/dashboard/payroll"
			},
			assets: {
				value: totalAssets,
				assignedCount: assetStatusCounts.assigned,
				availableCount: assetStatusCounts.available,
				repairCount: assetStatusCounts.repair,
				assignedPercent: assetStatusCounts.assignedPercent,
				availablePercent: assetStatusCounts.availablePercent,
				hasStatusData: totalAssets > 0 && (assetStatusCounts.assigned > 0 || assetStatusCounts.available > 0),
				link: "/dashboard/assets"
			},
			exits: {
				value: totalExits,
				statusCounts: exitStatusCounts,
				timeline: exitTimeline,
				hasTimeline: exitTimeline.length > 1,
				link: "/dashboard/exit"
			}
		}), [
			totalEmployees,
			headcountChange,
			headcountChangeType,
			headcountTrend,
			totalJobs,
			jobsBars,
			totalDepartments,
			deptDistribution,
			totalPayrollCost,
			payrollHistory,
			payrollStatusCounts,
			totalAssets,
			assetStatusCounts,
			totalExits,
			exitStatusCounts,
			exitTimeline
		]),
		kpiCards: (0, import_react.useMemo)(() => [
			{
				id: "total_emp",
				label: "Total Headcount",
				value: totalEmployees,
				change: headcountChange || "",
				changeType: headcountChangeType,
				accent: "text-emerald-500",
				bgAccent: "bg-emerald-500/10",
				spark: headcountTrend.map((pt) => ({ v: pt.value })),
				link: "/dashboard/employees"
			},
			{
				id: "active_jobs",
				label: "Active Openings",
				value: totalJobs,
				change: "",
				changeType: "neutral",
				accent: "text-blue-500",
				bgAccent: "bg-blue-500/10",
				spark: jobsBars.map((b) => ({ v: b.count })),
				link: "/dashboard/recruitment/jobs"
			},
			{
				id: "departments",
				label: "Departments",
				value: totalDepartments,
				change: "",
				changeType: "neutral",
				accent: "text-violet-500",
				bgAccent: "bg-violet-500/10",
				spark: deptDistribution.map((d) => ({ v: d.count })),
				link: "/dashboard/departments"
			},
			{
				id: "payroll_cost",
				label: "Monthly Payroll Cost",
				value: formatIndianCurrency(totalPayrollCost),
				change: "",
				changeType: "neutral",
				accent: "text-amber-500",
				bgAccent: "bg-amber-500/10",
				spark: payrollHistory.map((p) => ({ v: p.cost })),
				link: "/dashboard/payroll"
			},
			{
				id: "asset_count",
				label: "Assets Tracked",
				value: totalAssets,
				change: assetStatusCounts.assignedPercent > 0 ? `${assetStatusCounts.assignedPercent}% Assigned` : "",
				changeType: "neutral",
				accent: "text-cyan-500",
				bgAccent: "bg-cyan-500/10",
				spark: [],
				link: "/dashboard/assets"
			},
			{
				id: "exit_requests",
				label: "Offboarding & Exits",
				value: totalExits,
				change: exitStatusCounts.pending > 0 ? `${exitStatusCounts.pending} Pending` : "",
				changeType: exitStatusCounts.pending > 0 ? "down" : "neutral",
				accent: "text-rose-500",
				bgAccent: "bg-rose-500/10",
				spark: exitTimeline.map((t) => ({ v: t.count })),
				link: "/dashboard/exit"
			}
		], [
			totalEmployees,
			headcountChange,
			headcountChangeType,
			headcountTrend,
			totalJobs,
			jobsBars,
			totalDepartments,
			deptDistribution,
			totalPayrollCost,
			payrollHistory,
			totalAssets,
			assetStatusCounts,
			totalExits,
			exitStatusCounts,
			exitTimeline
		]),
		deptPerformance,
		activityFeed,
		activeJobsList,
		payrollOverview,
		refetch: fetchAllDashboardData
	};
}
var cardMotion = (index) => ({
	initial: {
		opacity: 0,
		y: 16
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .35,
		ease: "easeOut",
		delay: index * .05
	}
});
function CustomTooltip({ active, payload, label, unit = "" }) {
	if (active && payload && payload.length) {
		const pt = payload[0];
		const val = pt.value;
		const dispLabel = pt.payload?.label ?? label;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground shadow-md",
			children: [dispLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-medium text-muted-foreground mr-1",
				children: [dispLabel, ":"]
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-semibold text-foreground",
				children: [typeof val === "number" ? val.toLocaleString("en-IN") : val, unit]
			})]
		});
	}
	return null;
}
function buildSparklineData(actualPoints, currentValue, pattern = "growth") {
	if (actualPoints && actualPoints.length >= 2) return actualPoints;
	const v = Number(currentValue) || 0;
	if (pattern === "growth") {
		const base = Math.max(v, 1);
		return [
			{ v: Math.max(0, Math.round(base * .72)) },
			{ v: Math.max(0, Math.round(base * .8)) },
			{ v: Math.max(0, Math.round(base * .84)) },
			{ v: Math.max(0, Math.round(base * .92)) },
			{ v: Math.max(0, Math.round(base * .96)) },
			{ v: base }
		];
	}
	if (pattern === "fluctuate") {
		const base = Math.max(v, 1);
		return [
			{ v: Math.max(0, Math.round(base * .6)) },
			{ v: Math.max(0, Math.round(base * .9)) },
			{ v: Math.max(0, Math.round(base * .7)) },
			{ v: Math.max(0, Math.round(base * .95)) },
			{ v: Math.max(0, Math.round(base * .85)) },
			{ v: base }
		];
	}
	if (pattern === "financial") {
		const base = v > 0 ? v : 12;
		return [
			{ v: +(base * .85).toFixed(1) },
			{ v: +(base * .9).toFixed(1) },
			{ v: +(base * .92).toFixed(1) },
			{ v: +(base * .96).toFixed(1) },
			{ v: +(base * .98).toFixed(1) },
			{ v: +base.toFixed(1) }
		];
	}
	const base = Math.max(v, 1);
	return [
		{ v: Math.max(0, Math.round(base * .85)) },
		{ v: Math.max(0, Math.round(base * .9)) },
		{ v: Math.max(0, Math.round(base * .95)) },
		{ v: Math.max(0, Math.round(base * .92)) },
		{ v: Math.max(0, Math.round(base * .98)) },
		{ v: base }
	];
}
var KpiSparkline = (0, import_react.memo)(function KpiSparkline({ data, color = "var(--primary)", gradientId, unit = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-14 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					top: 2,
					right: 2,
					left: 2,
					bottom: 2
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: gradientId,
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: color,
							stopOpacity: .35
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: color,
							stopOpacity: 0
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, { unit }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "v",
						stroke: color,
						strokeWidth: 2,
						fill: `url(#${gradientId})`,
						isAnimationActive: false
					})
				]
			})
		})
	});
});
var ExecutiveKpiCards = (0, import_react.memo)(function ExecutiveKpiCards({ details, loading = false }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
		children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-[195px] flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-8 rounded-lg bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-12 rounded bg-muted" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-2 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-20 rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-28 rounded bg-muted" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full rounded-lg bg-muted" })
			]
		}, i))
	});
	const { headcount, openings, departments, payroll, assets, exits } = details;
	const headcountData = buildSparklineData(headcount.trend?.map((t) => ({
		v: t.value,
		label: t.date
	})), headcount.value, "growth");
	const openingsData = buildSparklineData(openings.bars?.length >= 2 ? openings.bars.map((b) => ({
		v: b.count,
		label: b.label
	})) : void 0, openings.value, "fluctuate");
	const departmentsData = buildSparklineData(departments.distribution?.length >= 2 ? departments.distribution.map((d) => ({
		v: d.count,
		label: d.name
	})) : void 0, departments.value, "stable");
	const payrollData = buildSparklineData(payroll.history?.map((p) => ({
		v: p.cost,
		label: p.month
	})), payroll.rawValue, "financial");
	const assetsData = buildSparklineData(void 0, assets.value, "stable");
	const exitsData = buildSparklineData(exits.timeline?.map((t) => ({
		v: t.count,
		label: t.date
	})), exits.value, "growth");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				...cardMotion(0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: headcount.link,
					className: "block h-full outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex rounded-xl bg-primary/10 p-2 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
							}), headcount.change ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusBadgeClass(headcount.changeType === "up" ? "positive" : headcount.changeType === "down" ? "critical" : "default")}`,
								children: [headcount.changeType === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-2.5 w-2.5" }) : headcount.changeType === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-2.5 w-2.5" }) : null, headcount.change]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground transition-colors group-hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Total Headcount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl",
									children: headcount.value.toLocaleString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: "Active across all depts"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSparkline, {
								data: headcountData,
								gradientId: "kpi-headcount"
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				...cardMotion(1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: openings.link,
					className: "block h-full outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex rounded-xl bg-primary/10 p-2 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" })
							}), openings.change ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusBadgeClass(openings.changeType === "up" ? "positive" : openings.changeType === "down" ? "critical" : "default")}`,
								children: [openings.changeType === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-2.5 w-2.5" }) : openings.changeType === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-2.5 w-2.5" }) : null, openings.change]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground transition-colors group-hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Open Positions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl",
									children: openings.value.toLocaleString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: "Across active job posts"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSparkline, {
								data: openingsData,
								gradientId: "kpi-openings"
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				...cardMotion(2),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: departments.link,
					className: "block h-full outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex rounded-xl bg-primary/10 p-2 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground transition-colors group-hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Departments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl",
									children: departments.value.toLocaleString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: "Operational business units"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSparkline, {
								data: departmentsData,
								gradientId: "kpi-departments"
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				...cardMotion(3),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: payroll.link,
					className: "block h-full outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex rounded-xl bg-primary/10 p-2 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground transition-colors group-hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Monthly Payroll Cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl",
									children: payroll.valueFormatted
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: "This billing cycle"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSparkline, {
								data: payrollData,
								gradientId: "kpi-payroll",
								unit: "L"
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				...cardMotion(4),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: assets.link,
					className: "block h-full outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex rounded-xl bg-primary/10 p-2 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground transition-colors group-hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Assets Tracked"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl",
									children: assets.value.toLocaleString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: "Laptops, devices & gear"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSparkline, {
								data: assetsData,
								gradientId: "kpi-assets"
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				...cardMotion(5),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: exits.link,
					className: "block h-full outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative flex h-full min-h-[195px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex rounded-xl bg-primary/10 p-2 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground transition-colors group-hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Offboarding & Exits"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl",
									children: exits.value.toLocaleString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: "In pipeline / processed"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiSparkline, {
								data: exitsData,
								gradientId: "kpi-exits"
							})
						})]
					})
				})
			})
		]
	});
});
var AI_FEATURES = [
	{
		title: "HR Copilot",
		desc: "AI-powered HR Q&A and policy guidance",
		link: "/ai/chat-assistant"
	},
	{
		title: "Resume Screening",
		desc: "Automated resume parsing & scoring",
		link: "/ai/recruiter"
	},
	{
		title: "AI Analytics",
		desc: "Predictive workforce intelligence",
		link: "/ai/analytics-center"
	},
	{
		title: "Policy Assistant",
		desc: "Instant policy answers & summaries",
		link: "/ai/policy-assistant"
	},
	{
		title: "AI Chat",
		desc: "Multi-modal HR assistant",
		link: "/ai/chat-assistant"
	}
];
var AI_METRICS = [];
var AI_RECENT = [];
var ACTIVE_JOBS = [];
var ACTIVITY_FEED = [];
var APPROVAL_DATA = {
	Leave: [],
	Attendance: [],
	Recruitment: [],
	Onboarding: [],
	Exit: [],
	Assets: [],
	Documents: [],
	Expenses: []
};
var ASSET_STATS = [];
var ATTRITION_RATE = [];
var CALENDAR_EVENTS = [];
var DEPT_ATTENDANCE = [];
var DEPT_DISTRIBUTION = [];
var DEPT_PERFORMANCE = [];
var EXIT_STAGES = [];
var GENDER_DIVERSITY = [];
var HEADCOUNT_GROWTH = [];
var INTERVIEWS_TODAY = [];
var MONTHLY_PAYROLL = [];
var ONBOARDING_STAGES = [];
var PAYROLL_STATUS = [];
var PIPELINE_STAGES = [];
var SALARY_DISTRIBUTION = [];
var WEEKLY_ATTENDANCE = [];
var WIDGET_SCORES = [];
var WORLD_CLOCKS = [];
var fadeUp = {
	initial: {
		opacity: 0,
		y: 24
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .4,
		ease: "easeOut"
	}
};
var stagger = (i) => ({
	initial: {
		opacity: 0,
		y: 24
	},
	animate: {
		opacity: 1,
		y: 0
	},
	transition: {
		duration: .4,
		ease: "easeOut",
		delay: i * .06
	}
});
var chartTooltipStyle = {
	backgroundColor: "var(--card)",
	border: "1px solid var(--border)",
	borderRadius: 8,
	fontSize: 12,
	color: "var(--foreground)"
};
function Card({ children, className = "", noPad = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-xl border border-border bg-card shadow-sm ${noPad ? "" : "p-5"} ${className}`,
		children
	});
}
var WidgetErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	componentDidCatch(error, info) {
		console.error(`Error in widget "${this.props.name || "DashboardWidget"}":`, error, info);
	}
	render() {
		if (this.state.hasError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-destructive" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium text-destructive",
						children: ["Unable to load ", this.props.name || "this section"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => this.setState({ hasError: false }),
						className: "h-7 border-destructive/30 text-xs text-destructive hover:bg-destructive/20 cursor-pointer",
						children: "Retry"
					})
				]
			})
		});
		return this.props.children;
	}
};
function SectionHeader({ title, subtitle, link, linkLabel = "View More", action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold tracking-tight text-foreground",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: subtitle
		})] }), action || link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: link,
			className: "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
			children: [
				linkLabel,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })
			]
		})]
	});
}
var ICON_MAP = {
	Package,
	UserCheck,
	CheckCircle2: CircleCheck,
	AlertTriangle: TriangleAlert,
	Clock,
	Wrench,
	UserPlus,
	Briefcase,
	FileText,
	CreditCard,
	MessageSquare,
	ClipboardCheck,
	LogOut,
	FileCheck,
	Award
};
var QUICK_ACTIONS = [
	{
		label: "Add Employee",
		icon: UserPlus,
		link: "/dashboard/employees"
	},
	{
		label: "Create Job",
		icon: Briefcase,
		link: "/dashboard/recruitment/jobs/new"
	},
	{
		label: "Run Payroll",
		icon: CreditCard,
		link: "/dashboard/payroll"
	},
	{
		label: "Start Onboarding",
		icon: UserCheck,
		link: "/dashboard/onboarding-checklist"
	},
	{
		label: "Approve Leave",
		icon: FileText,
		link: "/dashboard/leaves"
	},
	{
		label: "Assign Asset",
		icon: Package,
		link: "/dashboard/assets"
	},
	{
		label: "Generate Report",
		icon: Download,
		link: "/dashboard/reports"
	},
	{
		label: "AI Copilot",
		icon: GeminiIcon,
		link: "/ai/chat-assistant"
	}
];
var QuickActions = (0, import_react.memo)(function QuickActions() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8",
			children: QUICK_ACTIONS.map((a, i) => {
				const Icon = a.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					...stagger(i),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: a.link,
						className: "group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center shadow-sm transition-all hover:bg-muted/50 hover:border-foreground/20 hover:-translate-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium leading-tight text-muted-foreground group-hover:text-foreground",
							children: a.label
						})]
					})
				}, a.label);
			})
		})
	});
});
var APPROVAL_TABS = [
	"Leave",
	"Attendance",
	"Recruitment",
	"Onboarding",
	"Exit",
	"Assets",
	"Documents",
	"Expenses"
];
function ApprovalCenter() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("Leave");
	const items = APPROVAL_DATA[activeTab] ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "HR Operations Center",
				subtitle: "Unified approval hub across all modules",
				link: "/dashboard/hr-ops"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-1.5 overflow-x-auto rounded-lg bg-muted p-1 pb-1",
				children: APPROVAL_TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(tab),
					className: `shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
					children: [tab, APPROVAL_DATA[tab].length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === tab ? "bg-muted text-foreground" : "bg-card text-muted-foreground"}`,
						children: APPROVAL_DATA[tab].length
					})]
				}, tab))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: 10
					},
					animate: {
						opacity: 1,
						x: 0
					},
					exit: {
						opacity: 0,
						x: -10
					},
					transition: { duration: .2 },
					className: "space-y-2",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm hover:bg-muted/40 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-foreground",
										children: item.name
									}), item.urgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										className: "h-4 px-1.5 text-[10px]",
										children: "Urgent"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex items-center gap-2 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.department }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.type }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.detail })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground shrink-0",
								children: item.requestedAt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7 text-xs text-emerald-600 dark:text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " Approve"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7 text-xs text-destructive border-destructive/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1 h-3 w-3" }), " Reject"]
								})]
							})
						]
					}, item.id))
				}, activeTab)
			})
		] })
	});
}
function RecruitmentDashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Recruitment Dashboard",
			subtitle: "Hiring pipeline and active roles",
			link: "/dashboard/recruitment"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Candidate Pipeline"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: PIPELINE_STAGES,
						layout: "vertical",
						margin: {
							left: 0,
							right: 16,
							top: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								horizontal: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								stroke: "var(--muted-foreground)",
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "category",
								dataKey: "stage",
								stroke: "var(--muted-foreground)",
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: false,
								width: 64
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: chartTooltipStyle,
								itemStyle: { color: "var(--foreground)" },
								labelStyle: { color: "var(--foreground)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								radius: [
									0,
									6,
									6,
									0
								],
								fill: "var(--primary)"
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Active Jobs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: ACTIVE_JOBS.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium text-foreground",
							children: job.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								job.dept,
								" · ",
								job.posted
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: statusBadgeClass("active"),
								children: [job.applicants, " applicants"]
							})
						})]
					}, job.title))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Interviews Today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: INTERVIEWS_TODAY.map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium text-foreground",
									children: iv.candidate
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										iv.role,
										" · ",
										iv.type
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-xs font-medium text-muted-foreground",
								children: iv.time
							})
						]
					}, iv.candidate))
				})] })]
			})]
		})] })
	});
}
var AttendanceAnalytics = (0, import_react.memo)(function AttendanceAnalytics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Attendance Analytics",
			subtitle: "Weekly trends and department breakdown",
			link: "/dashboard/attendance"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Daily Attendance — This Week"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-52",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: WEEKLY_ATTENDANCE,
						margin: {
							top: 6,
							right: 8,
							left: -16,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "attGrad",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "var(--primary)",
									stopOpacity: .35
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "var(--primary)",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								stroke: "var(--muted-foreground)",
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "var(--muted-foreground)",
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: chartTooltipStyle,
								itemStyle: { color: "var(--foreground)" },
								labelStyle: { color: "var(--foreground)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "present",
								stroke: "var(--primary)",
								strokeWidth: 2,
								fill: "url(#attGrad)",
								name: "Present"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "late",
								stroke: "var(--muted-foreground)",
								strokeWidth: 1.5,
								fill: "transparent",
								name: "Late"
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Dept Attendance %"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-52",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: DEPT_ATTENDANCE,
						margin: {
							top: 6,
							right: 8,
							left: -16,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								stroke: "var(--muted-foreground)",
								tick: {
									fontSize: 10,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "var(--muted-foreground)",
								tick: {
									fontSize: 11,
									fill: "var(--muted-foreground)"
								},
								tickLine: false,
								axisLine: false,
								domain: [80, 100]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: chartTooltipStyle,
								itemStyle: { color: "var(--foreground)" },
								labelStyle: { color: "var(--foreground)" },
								formatter: (v) => [`${v}%`, "Attendance"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "value",
								radius: [
									6,
									6,
									0,
									0
								],
								fill: "var(--primary)"
							})
						]
					})
				})
			})] })]
		})] })
	});
});
var PayrollOverview = (0, import_react.memo)(function PayrollOverview({ data }) {
	const statusItems = data?.payrollStatus && data.payrollStatus.length > 0 ? data.payrollStatus : PAYROLL_STATUS;
	const totalCostText = data?.totalCostFormatted ?? "₹0.0L";
	const chartData = data?.monthlySalaryCostChart && data.monthlySalaryCostChart.length > 0 ? data.monthlySalaryCostChart : MONTHLY_PAYROLL;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Payroll Overview",
			subtitle: "Monthly salary cost & status",
			link: "/dashboard/payroll"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: "Payroll Status"
					}),
					statusItems.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-medium text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary shrink-0" }), s.label]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-semibold text-foreground",
							children: s.value
						})]
					}, s.label)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card px-4 py-3 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Total Cost This Month"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-2xl font-bold text-foreground",
							children: totalCostText
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Monthly Salary Cost (Lakhs ₹)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chartData,
							margin: {
								top: 6,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 11,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 11,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: chartTooltipStyle,
									itemStyle: { color: "var(--foreground)" },
									labelStyle: { color: "var(--foreground)" },
									formatter: (v) => [`₹${v}L`, "Payroll"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "cost",
									radius: [
										6,
										6,
										0,
										0
									],
									fill: "var(--primary)"
								})
							]
						})
					})
				})]
			})]
		})] })
	});
});
function AssetOverview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Asset Management",
			subtitle: "Company asset inventory at a glance",
			link: "/dashboard/assets"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
			children: ASSET_STATS.map((a) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ICON_MAP[a.icon] ?? Package, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl font-bold text-foreground",
							children: a.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-medium leading-tight text-muted-foreground",
							children: a.label
						})
					]
				}, a.label);
			})
		})] })
	});
}
function OnboardingCenter() {
	const total = ONBOARDING_STAGES.reduce((s, o) => s + o.count, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Onboarding Center",
			subtitle: "New employee journey tracking",
			link: "/dashboard/onboarding-checklist"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
			children: ONBOARDING_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4 text-center shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl font-bold text-foreground",
						children: s.count
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: s.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: total > 0 ? s.count / total * 100 : 0,
							className: "h-1.5 w-full"
						})
					})
				]
			}, s.label))
		})] })
	});
}
function ExitManagement() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Exit Management",
			subtitle: "Offboarding pipeline status",
			link: "/dashboard/exit"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
			children: EXIT_STAGES.map((s) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 text-center shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-2 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ICON_MAP[s.icon] ?? Clock, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl font-bold text-foreground",
							children: s.count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: s.label
						})
					]
				}, s.label);
			})
		})] })
	});
}
function DocumentsCenter() {
	const docs = useAurix().documents ?? [];
	const pending = docs.filter((d) => d.status === "Pending");
	const missing = docs.filter((d) => d.status === "Rejected");
	const expiring = docs.filter((d) => {
		if (!d.expiryDate) return false;
		const diff = (new Date(d.expiryDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24);
		return diff < 60 && diff > 0;
	});
	const recent = [...docs].sort((a, b) => (b.uploadDate || "").localeCompare(a.uploadDate || "")).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Documents Center",
				subtitle: "Document status and verifications",
				link: "/dashboard/documents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4",
				children: [
					{
						label: "Missing/Rejected",
						value: missing.length
					},
					{
						label: "Pending Review",
						value: pending.length
					},
					{
						label: "Expiring Soon",
						value: expiring.length
					},
					{
						label: "Total Documents",
						value: docs.length
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 text-center shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl font-bold text-foreground",
						children: s.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: s.label
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Recent Uploads"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-6 text-center shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-8 w-8 text-muted-foreground mb-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No recent documents uploaded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/documents",
							className: "mt-2 text-xs font-medium text-primary hover:underline",
							children: "Upload or manage documents →"
						})
					]
				}) : recent.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-sm hover:bg-muted/40 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium text-foreground",
								children: d.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: d.uploadDate || "Recent"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `shrink-0 text-[10px] ${statusBadgeClass(d.status)}`,
							children: d.status
						})
					]
				}, d.id))
			})
		] })
	});
}
function AICommandCenter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "AI Command Center",
				subtitle: "Powered by OFC360",
				link: "/ai"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: AI_METRICS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-3 text-center shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl font-bold text-foreground",
							children: m.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[10px] text-muted-foreground",
							children: m.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[10px] font-medium text-muted-foreground",
							children: m.change
						})
					]
				}, m.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5",
				children: AI_FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: f.link,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:bg-muted/50 hover:border-foreground/20 hover:-translate-y-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeminiIcon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-foreground",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground leading-snug",
								children: f.desc
							})
						]
					})
				}, f.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
				children: "Recent AI Activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: AI_RECENT.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium text-foreground",
								children: [r.action, ": "]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: r.detail
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: r.time
						})
					]
				}, i))
			})
		] })
	});
}
function ExecutiveAnalytics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Executive Analytics",
			subtitle: "Key workforce metrics and trends",
			link: "/dashboard/reports"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Headcount Growth"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: HEADCOUNT_GROWTH,
							margin: {
								top: 4,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "hcGrad",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "5%",
										stopColor: "var(--primary)",
										stopOpacity: .35
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "95%",
										stopColor: "var(--primary)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 10,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 10,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false,
									domain: [230, 295]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: chartTooltipStyle,
									itemStyle: { color: "var(--foreground)" },
									labelStyle: { color: "var(--foreground)" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "headcount",
									stroke: "var(--primary)",
									strokeWidth: 2,
									fill: "url(#hcGrad)"
								})
							]
						})
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Attrition Rate (%)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: ATTRITION_RATE,
							margin: {
								top: 4,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 10,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 10,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false,
									domain: [2, 5]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: chartTooltipStyle,
									itemStyle: { color: "var(--foreground)" },
									labelStyle: { color: "var(--foreground)" },
									formatter: (v) => [`${v}%`, "Attrition"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "rate",
									stroke: "var(--destructive)",
									strokeWidth: 2,
									dot: false
								})
							]
						})
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Gender Diversity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: GENDER_DIVERSITY,
								cx: "50%",
								cy: "50%",
								innerRadius: 40,
								outerRadius: 65,
								dataKey: "value",
								paddingAngle: 3,
								children: GENDER_DIVERSITY.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: i === 0 ? "var(--primary)" : i === 1 ? "var(--muted-foreground)" : "var(--chart-1)" }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: chartTooltipStyle,
								itemStyle: { color: "var(--foreground)" },
								labelStyle: { color: "var(--foreground)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								iconSize: 10,
								wrapperStyle: {
									fontSize: 11,
									color: "var(--muted-foreground)"
								}
							})
						] })
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
					children: "Salary Distribution"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: SALARY_DISTRIBUTION,
							margin: {
								top: 4,
								right: 8,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "band",
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 10,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									tick: {
										fontSize: 10,
										fill: "var(--muted-foreground)"
									},
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: chartTooltipStyle,
									itemStyle: { color: "var(--foreground)" },
									labelStyle: { color: "var(--foreground)" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "employees",
									radius: [
										4,
										4,
										0,
										0
									],
									fill: "var(--primary)"
								})
							]
						})
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: "Department Distribution"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: DEPT_DISTRIBUTION,
								margin: {
									top: 4,
									right: 8,
									left: -16,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "dept",
										stroke: "var(--muted-foreground)",
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--muted-foreground)",
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: chartTooltipStyle,
										itemStyle: { color: "var(--foreground)" },
										labelStyle: { color: "var(--foreground)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "employees",
										radius: [
											4,
											4,
											0,
											0
										],
										fill: "var(--primary)"
									})
								]
							})
						})
					})]
				})
			]
		})] })
	});
}
function CompanyCalendar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Company Calendar",
			subtitle: "Upcoming meetings, holidays & key dates",
			link: "/dashboard/attendance/holidays"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
			children: CALENDAR_EVENTS.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 h-2 w-2 shrink-0 rounded-full ${getEventTypeDot(ev.type)}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium text-foreground truncate",
							children: ev.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [new Date(ev.date).toLocaleDateString("en-IN", {
								day: "numeric",
								month: "short"
							}), ev.time ? ` · ${ev.time}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: `ml-auto shrink-0 capitalize text-[10px] ${statusBadgeClass(ev.type)}`,
						children: ev.type
					})
				]
			}, ev.id))
		})] })
	});
}
function ActivityFeed() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Live Activity Feed",
			subtitle: "Real-time HR system activity",
			link: "/dashboard/timeline"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 max-h-96 overflow-y-auto pr-1",
			children: ACTIVITY_FEED.map((a) => {
				const Icon = ICON_MAP[a.icon] ?? Zap;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: -12
					},
					animate: {
						opacity: 1,
						x: 0
					},
					className: "flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground",
								children: a.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: a.user
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: a.time
						})
					]
				}, a.id);
			})
		})] })
	});
}
function NotificationCenter() {
	const { items } = useNotifications({
		priority: "high,critical",
		limit: 5
	});
	const archiveMutation = useArchive();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Smart Notification Center",
			subtitle: "Alerts, compliance & AI suggestions",
			link: "/dashboard/notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-foreground",
								children: n.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `shrink-0 text-[10px] capitalize ${statusBadgeClass(n.priority)}`,
								children: n.category.replace(/_/g, " ")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: n.body
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground font-mono",
							children: formatRelativeTime(n.createdAt)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => archiveMutation.mutate(n.id),
							className: "rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer",
							"aria-label": "Dismiss notification",
							title: "Dismiss",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
						})]
					})
				]
			}, n.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-2 h-8 w-8 text-primary" }), "All caught up! No active high-priority alerts."]
			})]
		})] })
	});
}
function DepartmentPerformance() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Department Performance",
			subtitle: "Workforce metrics by department",
			link: "/dashboard/departments"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: DEPT_PERFORMANCE.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				...stagger(i),
				className: "rounded-xl border border-border bg-card p-4 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-foreground",
						children: d.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-[10px]",
						children: [d.headcount, " employees"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Attendance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-foreground",
								children: [d.attendance, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: d.attendance,
							className: "h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Productivity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-foreground",
								children: [d.productivity, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: d.productivity,
							className: "h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Open Positions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [d.openPositions, " open"]
							})]
						})
					]
				})]
			}, d.name))
		})] })
	});
}
var REPORT_CARD_ITEMS = [
	{
		label: "Attendance",
		link: "/dashboard/attendance"
	},
	{
		label: "Payroll",
		link: "/dashboard/payroll/reports"
	},
	{
		label: "Recruitment",
		link: "/dashboard/recruitment/reports",
		isLong: true
	},
	{
		label: "Assets",
		link: "/dashboard/assets"
	},
	{
		label: "Leave",
		link: "/dashboard/leaves"
	},
	{
		label: "Exit",
		link: "/dashboard/exit"
	},
	{
		label: "Analytics",
		link: "/dashboard/recruitment/analytics"
	}
];
function ReportsCenter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		...fadeUp,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold tracking-tight text-foreground",
				children: "Reports Center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: "One-click report generation"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard/reports",
				className: "group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-accent hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View More" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "reports-center-container w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reports-center-grid",
				children: REPORT_CARD_ITEMS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: r.link,
					className: "group flex flex-col justify-center outline-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 py-3 text-center shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-muted/50 hover:border-foreground/20 active:translate-y-0 cursor-pointer select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 transition-transform duration-200 group-hover:scale-110" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `w-full max-w-full truncate px-1 text-center font-medium text-foreground tracking-tight leading-none ${r.isLong ? "text-[11px]" : "text-xs"}`,
							title: r.label,
							children: r.label
						})]
					})
				}, r.label))
			})
		})] })
	});
}
function WorldClock() {
	const [clocks, setClocks] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		function update() {
			setClocks(WORLD_CLOCKS.map((wc) => ({
				city: wc.city,
				flag: wc.flag,
				time: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
					timeZone: wc.tz,
					hour: "2-digit",
					minute: "2-digit",
					hour12: false
				})
			})));
		}
		update();
		const t = setInterval(update, 1e3);
		return () => clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, { title: "World Clock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2",
		children: clocks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lg",
				children: c.flag
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: c.city
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-base font-semibold tabular-nums text-foreground",
				children: c.time
			})] })]
		}, c.city))
	})] });
}
function ScoreWidgets() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		title: "Company Scores",
		subtitle: "Health, Satisfaction & Productivity"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: WIDGET_SCORES.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: w.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold text-foreground",
					children: [
						w.value,
						"/",
						w.max
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: w.max > 0 ? w.value / w.max * 100 : 0,
				className: "h-2 w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[10px] text-muted-foreground",
				children: w.description
			})
		] }, w.label))
	})] });
}
function ExecutiveDashboard() {
	const live = useExecutiveDashboardData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			live.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Some live metrics could not be loaded (",
						live.error,
						"). Showing cached metrics."
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: live.refetch,
					disabled: live.loading,
					className: "h-7 border-destructive/30 text-destructive hover:bg-destructive/20 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `mr-1.5 h-3 w-3 ${live.loading ? "animate-spin" : ""}` }), "Retry"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
				name: "Quick Actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickActions, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
				name: "KPI Metrics",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveKpiCards, {
					details: live.kpiDetails,
					loading: live.loading
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
						name: "HR Approvals",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalCenter, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Activity Feed",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityFeed, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Notifications",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationCenter, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Department Performance",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentPerformance, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
				name: "Recruitment Pipeline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruitmentDashboard, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
				name: "Attendance Analytics",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceAnalytics, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Payroll Overview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayrollOverview, { data: live.payrollOverview })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Onboarding Center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingCenter, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Exit Management",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExitManagement, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Assets Overview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetOverview, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
						name: "Documents Center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsCenter, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
						name: "World Clock",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldClock, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
						name: "Company Scores",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreWidgets, {})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
				name: "AI Command Center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICommandCenter, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
				name: "Executive Analytics",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveAnalytics, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Company Calendar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyCalendar, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WidgetErrorBoundary, {
					name: "Reports Center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsCenter, {})
				})]
			})
		]
	});
}
function ExecutiveDashboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveDashboard, {});
}
//#endregion
export { ExecutiveDashboardPage };
