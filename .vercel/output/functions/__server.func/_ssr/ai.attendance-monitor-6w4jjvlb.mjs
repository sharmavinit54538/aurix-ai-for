import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as Timer, J as ShieldAlert, Sr as CircleCheck, T as TriangleAlert, Vr as CalendarX, di as ArrowLeft, g as UserX, lt as RefreshCw, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { t as attendanceApi } from "./attendanceApi-CqMkuZD6.mjs";
import { n as AIModulePage } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.attendance-monitor-6w4jjvlb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const role = useCurrentRole();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [analytics, setAnalytics] = (0, import_react.useState)(null);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [forbidden, setForbidden] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function loadData() {
			try {
				const [analyticsRes, historyRes] = await Promise.allSettled([attendanceApi.getAttendanceAnalytics(), attendanceApi.getMyAttendanceHistory(1, 30)]);
				if (mounted) {
					if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value);
					else if (analyticsRes.status === "rejected") {
						if ((analyticsRes.reason?.status ?? analyticsRes.reason?.response?.status) === 403) setForbidden(true);
					}
					if (historyRes.status === "fulfilled" && historyRes.value?.items) setHistory(historyRes.value.items);
				}
			} catch (err) {
				console.warn("Failed to fetch attendance monitor metrics:", err);
			} finally {
				if (mounted) setLoading(false);
			}
		}
		loadData();
		return () => {
			mounted = false;
		};
	}, []);
	const isRoleRestricted = Boolean(role && ![
		"super_admin",
		"hr_admin",
		"manager",
		"executive"
	].includes(role));
	if (!loading && (forbidden || isRoleRestricted)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold tracking-tight",
				children: "Access Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted-foreground",
				children: "You don't have permission to view company-wide attendance analytics. This enterprise module requires manager, HR administrator, or executive authorization."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "mt-6 gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Return to Dashboard"]
				})
			})
		]
	});
	const totalEmployees = analytics?.totalEmployees ?? 0;
	const presentCount = analytics?.present ?? 0;
	const lateCount = analytics?.late ?? 0;
	const absentCount = analytics?.absent ?? 0;
	const attendanceHealth = analytics?.onTimeRate != null ? Math.round(analytics.onTimeRate) : totalEmployees > 0 ? Math.round(presentCount / totalEmployees * 100) : presentCount > 0 ? 100 : 0;
	const totalOtHours = history.reduce((acc, h) => {
		if (h.workingHours && h.workingHours > 8) return acc + (h.workingHours - 8);
		return acc;
	}, 0);
	const daysOfWeek = [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	];
	const dayPresenceMap = {
		Mon: {
			present: 0,
			late: 0,
			count: 0
		},
		Tue: {
			present: 0,
			late: 0,
			count: 0
		},
		Wed: {
			present: 0,
			late: 0,
			count: 0
		},
		Thu: {
			present: 0,
			late: 0,
			count: 0
		},
		Fri: {
			present: 0,
			late: 0,
			count: 0
		},
		Sat: {
			present: 0,
			late: 0,
			count: 0
		},
		Sun: {
			present: 0,
			late: 0,
			count: 0
		}
	};
	history.forEach((item) => {
		if (item.date) {
			const d = new Date(item.date);
			if (!isNaN(d.getTime())) {
				const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
				if (dayPresenceMap[dayName]) {
					dayPresenceMap[dayName].count += 1;
					if (item.status === "Present") dayPresenceMap[dayName].present += 1;
					else if (item.status === "Late") dayPresenceMap[dayName].late += 1;
				}
			}
		}
	});
	const trendChartData = daysOfWeek.map((d) => ({
		d,
		present: dayPresenceMap[d].count > 0 ? Math.round((dayPresenceMap[d].present + dayPresenceMap[d].late) / dayPresenceMap[d].count * 100) : 0
	}));
	const lateChartData = daysOfWeek.slice(0, 5).map((d) => ({
		d,
		late: dayPresenceMap[d].late
	}));
	const kpis = [
		{
			label: "Attendance Health",
			value: `${attendanceHealth}%`,
			icon: CircleCheck
		},
		{
			label: "Anomalies",
			value: lateCount + absentCount,
			icon: TriangleAlert,
			invert: true
		},
		{
			label: "Late Arrivals",
			value: lateCount,
			icon: Clock,
			invert: true
		},
		{
			label: "OT Hours",
			value: `${Math.round(totalOtHours * 10) / 10}h`,
			icon: Timer
		}
	];
	const charts = [{
		type: "area",
		title: "Attendance Trend",
		xKey: "d",
		series: [{
			key: "present",
			label: "Present %"
		}],
		data: trendChartData
	}, {
		type: "bar",
		title: "Late Arrivals by Day",
		xKey: "d",
		series: [{
			key: "late",
			label: "Late Count"
		}],
		data: lateChartData
	}];
	const features = [
		{
			title: "Attendance Anomalies",
			description: "Detect unusual punches, missed swipes, and outliers from database records.",
			icon: TriangleAlert,
			metric: String(lateCount + absentCount),
			tone: lateCount + absentCount > 0 ? "warn" : "ok"
		},
		{
			title: "Late Arrival Detection",
			description: "Spot recurring late arrivals recorded beyond grace windows.",
			icon: Clock,
			metric: String(lateCount),
			tone: lateCount > 0 ? "warn" : "ok"
		},
		{
			title: "Absence Pattern Analysis",
			description: "Monitor unexplained absences across working schedules.",
			icon: CalendarX,
			metric: String(absentCount),
			tone: absentCount > 0 ? "crit" : "ok"
		},
		{
			title: "Overtime Tracking",
			description: "Monitor OT trends based on authenticated daily punch timestamps.",
			icon: Timer,
			metric: `${Math.round(totalOtHours * 10) / 10}h`,
			tone: "info"
		},
		{
			title: "Shift Violations",
			description: "Detect missed shifts and policy breaches logged by the biometric engine.",
			icon: ShieldAlert,
			metric: String(absentCount),
			tone: absentCount > 0 ? "crit" : "ok"
		},
		{
			title: "Attendance Health Score",
			description: "Composite metric across verified punctuality and presence.",
			icon: CircleCheck,
			metric: `${attendanceHealth}%`,
			progress: attendanceHealth,
			tone: attendanceHealth >= 80 ? "ok" : "warn"
		},
		{
			title: "Absentee Watchlist",
			description: "Employees with frequent absences or missed attendance records.",
			icon: UserX,
			metric: String(absentCount),
			tone: absentCount > 0 ? "warn" : "ok"
		}
	];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[60vh] flex-col items-center justify-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-muted-foreground",
			children: "Loading attendance analytics from backend..."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIModulePage, {
		icon: Clock,
		eyebrow: "AI Attendance Monitor",
		title: "Anomalies detected before they become problems",
		description: "Real-time attendance anomalies, late arrivals, and absence patterns from backend database logs.",
		lastAnalysis: "Live sync with backend",
		kpis,
		charts,
		features
	});
}
//#endregion
export { Page as component };
