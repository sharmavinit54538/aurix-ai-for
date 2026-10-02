import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Tr as CircleAlert, er as Download, lt as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { a as normalizeRole, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as getErrorMessage } from "./utils-DQc9Fr86.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, s as LineChart, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ReportsPage-90MJYGRe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var reportsAnalyticsApi = {
	async getHeadcount(params) {
		const res = await apiInstance.get("/api/v2/reports/analytics/headcount", { params });
		const data = res.data?.data ?? res.data;
		if (!Array.isArray(data)) return [];
		return data;
	},
	async getDepartment(params) {
		const res = await apiInstance.get("/api/v2/reports/analytics/department", { params });
		const data = res.data?.data ?? res.data;
		if (!Array.isArray(data)) return [];
		return data;
	},
	async getTenure(params) {
		const res = await apiInstance.get("/api/v2/reports/analytics/tenure", { params });
		const data = res.data?.data ?? res.data;
		if (!Array.isArray(data)) return [];
		return data;
	},
	async getTurnover(params) {
		const res = await apiInstance.get("/api/v2/reports/analytics/turnover", { params });
		const data = res.data?.data ?? res.data;
		if (!Array.isArray(data)) return [];
		return data;
	},
	async getPayrollCost(params) {
		const res = await apiInstance.get("/api/v2/reports/analytics/payroll-cost", { params });
		const data = res.data?.data ?? res.data;
		if (!Array.isArray(data)) return [];
		return data;
	},
	async getCompliance(params) {
		const res = await apiInstance.get("/api/v2/reports/analytics/compliance", { params });
		const data = res.data?.data ?? res.data;
		if (!Array.isArray(data)) return [];
		return data;
	},
	async exportCsv(params) {
		return (await apiInstance.get("/api/v2/reports/analytics/export", {
			params: {
				...params,
				format: "csv"
			},
			responseType: "blob"
		})).data;
	}
};
var COLORS = [
	"oklch(0.6 0.2 285)",
	"oklch(0.7 0.18 320)",
	"oklch(0.65 0.16 200)",
	"oklch(0.75 0.15 90)",
	"oklch(0.55 0.18 25)"
];
function getDefaultDates() {
	const end = /* @__PURE__ */ new Date();
	const start = /* @__PURE__ */ new Date();
	start.setFullYear(start.getFullYear() - 1);
	return {
		startDate: start.toISOString().split("T")[0],
		endDate: end.toISOString().split("T")[0]
	};
}
function ReportsPage() {
	const normalizedRole = normalizeRole(useCurrentRole());
	const canViewPayrollCost = normalizedRole === "hr_admin" || normalizedRole === "executive";
	const defaultDates = (0, import_react.useMemo)(() => getDefaultDates(), []);
	const [startDate, setStartDate] = (0, import_react.useState)(defaultDates.startDate);
	const [endDate, setEndDate] = (0, import_react.useState)(defaultDates.endDate);
	const [department, setDepartment] = (0, import_react.useState)("");
	const [debouncedFilters, setDebouncedFilters] = (0, import_react.useState)({
		start_date: defaultDates.startDate,
		end_date: defaultDates.endDate,
		department: void 0
	});
	const [lastUpdated, setLastUpdated] = (0, import_react.useState)(null);
	const [isExporting, setIsExporting] = (0, import_react.useState)(false);
	const [exportError, setExportError] = (0, import_react.useState)(null);
	const [headcountState, setHeadcountState] = (0, import_react.useState)({
		data: [],
		loading: true,
		error: null
	});
	const [deptState, setDeptState] = (0, import_react.useState)({
		data: [],
		loading: true,
		error: null
	});
	const [tenureState, setTenureState] = (0, import_react.useState)({
		data: [],
		loading: true,
		error: null
	});
	const [turnoverState, setTurnoverState] = (0, import_react.useState)({
		data: [],
		loading: false,
		error: null,
		available: void 0
	});
	const [payrollCostState, setPayrollCostState] = (0, import_react.useState)({
		data: [],
		loading: false,
		error: null,
		available: void 0
	});
	const [complianceState, setComplianceState] = (0, import_react.useState)({
		data: [],
		loading: false,
		error: null,
		available: void 0
	});
	const [exportAvailable, setExportAvailable] = (0, import_react.useState)(void 0);
	const isDateRangeInvalid = Boolean(startDate && endDate && startDate > endDate);
	(0, import_react.useEffect)(() => {
		if (startDate && endDate && startDate > endDate) return;
		const timer = setTimeout(() => {
			setDebouncedFilters((prev) => {
				const nextStart = startDate || void 0;
				const nextEnd = endDate || void 0;
				const nextDept = department.trim() || void 0;
				if (prev.start_date === nextStart && prev.end_date === nextEnd && prev.department === nextDept) return prev;
				return {
					start_date: nextStart,
					end_date: nextEnd,
					department: nextDept
				};
			});
		}, 350);
		return () => clearTimeout(timer);
	}, [
		startDate,
		endDate,
		department
	]);
	const parseChartError = (err, defaultMsg) => {
		const status = err?.status || err?.response?.status;
		if (status === 403) return {
			message: "You do not have access to this report",
			status: 403
		};
		if (status === 401) return {
			message: "Session expired. Please log in again.",
			status: 401
		};
		return {
			message: getErrorMessage(err, defaultMsg),
			status
		};
	};
	const fetchHeadcount = (0, import_react.useCallback)(async (filters) => {
		setHeadcountState((prev) => ({
			...prev,
			loading: true,
			error: null
		}));
		try {
			const data = await reportsAnalyticsApi.getHeadcount(filters);
			setHeadcountState({
				data: Array.isArray(data) ? data : [],
				loading: false,
				error: null,
				status: 200
			});
			setLastUpdated((/* @__PURE__ */ new Date()).toLocaleTimeString());
		} catch (err) {
			const { message, status } = parseChartError(err, "Failed to load headcount analytics");
			setHeadcountState({
				data: [],
				loading: false,
				error: message,
				status
			});
		}
	}, []);
	const fetchDepartment = (0, import_react.useCallback)(async (filters) => {
		setDeptState((prev) => ({
			...prev,
			loading: true,
			error: null
		}));
		try {
			const data = await reportsAnalyticsApi.getDepartment(filters);
			setDeptState({
				data: Array.isArray(data) ? data : [],
				loading: false,
				error: null,
				status: 200
			});
			setLastUpdated((/* @__PURE__ */ new Date()).toLocaleTimeString());
		} catch (err) {
			const { message, status } = parseChartError(err, "Failed to load department analytics");
			setDeptState({
				data: [],
				loading: false,
				error: message,
				status
			});
		}
	}, []);
	const fetchTenure = (0, import_react.useCallback)(async (filters) => {
		setTenureState((prev) => ({
			...prev,
			loading: true,
			error: null
		}));
		try {
			const data = await reportsAnalyticsApi.getTenure(filters);
			setTenureState({
				data: Array.isArray(data) ? data : [],
				loading: false,
				error: null,
				status: 200
			});
			setLastUpdated((/* @__PURE__ */ new Date()).toLocaleTimeString());
		} catch (err) {
			const { message, status } = parseChartError(err, "Failed to load tenure analytics");
			setTenureState({
				data: [],
				loading: false,
				error: message,
				status
			});
		}
	}, []);
	const fetchTurnover = (0, import_react.useCallback)(async (filters) => {
		setTurnoverState((prev) => ({
			...prev,
			loading: true,
			error: null
		}));
		try {
			const data = await reportsAnalyticsApi.getTurnover(filters);
			setTurnoverState({
				data: Array.isArray(data) ? data : [],
				loading: false,
				error: null,
				status: 200,
				available: true
			});
		} catch (err) {
			const status = err?.status || err?.response?.status;
			if (status === 404) setTurnoverState({
				data: [],
				loading: false,
				error: null,
				available: false,
				status: 404
			});
			else {
				const { message } = parseChartError(err, "Failed to load turnover analytics");
				setTurnoverState({
					data: [],
					loading: false,
					error: message,
					available: true,
					status
				});
			}
		}
	}, []);
	const fetchPayrollCost = (0, import_react.useCallback)(async (filters) => {
		setPayrollCostState((prev) => ({
			...prev,
			loading: true,
			error: null
		}));
		try {
			const data = await reportsAnalyticsApi.getPayrollCost(filters);
			setPayrollCostState({
				data: Array.isArray(data) ? data : [],
				loading: false,
				error: null,
				status: 200,
				available: true
			});
		} catch (err) {
			const status = err?.status || err?.response?.status;
			if (status === 404) setPayrollCostState({
				data: [],
				loading: false,
				error: null,
				available: false,
				status: 404
			});
			else {
				const { message } = parseChartError(err, "Failed to load payroll cost analytics");
				setPayrollCostState({
					data: [],
					loading: false,
					error: message,
					available: true,
					status
				});
			}
		}
	}, []);
	const fetchCompliance = (0, import_react.useCallback)(async (filters) => {
		setComplianceState((prev) => ({
			...prev,
			loading: true,
			error: null
		}));
		try {
			const data = await reportsAnalyticsApi.getCompliance(filters);
			setComplianceState({
				data: Array.isArray(data) ? data : [],
				loading: false,
				error: null,
				status: 200,
				available: true
			});
		} catch (err) {
			const status = err?.status || err?.response?.status;
			if (status === 404) setComplianceState({
				data: [],
				loading: false,
				error: null,
				available: false,
				status: 404
			});
			else {
				const { message } = parseChartError(err, "Failed to load compliance analytics");
				setComplianceState({
					data: [],
					loading: false,
					error: message,
					available: true,
					status
				});
			}
		}
	}, []);
	const probedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (probedRef.current) return;
		probedRef.current = true;
		apiInstance.get("/api/v2/reports/analytics/export", {
			params: { probe: 1 },
			validateStatus: () => true
		}).then((res) => {
			if (res.status === 404) setExportAvailable(false);
			else setExportAvailable(true);
		}).catch(() => {
			setExportAvailable(false);
		});
	}, []);
	const turnoverAvailableRef = (0, import_react.useRef)(turnoverState.available);
	turnoverAvailableRef.current = turnoverState.available;
	const payrollCostAvailableRef = (0, import_react.useRef)(payrollCostState.available);
	payrollCostAvailableRef.current = payrollCostState.available;
	const complianceAvailableRef = (0, import_react.useRef)(complianceState.available);
	complianceAvailableRef.current = complianceState.available;
	(0, import_react.useEffect)(() => {
		if (isDateRangeInvalid) return;
		fetchHeadcount(debouncedFilters);
		fetchDepartment(debouncedFilters);
		fetchTenure(debouncedFilters);
		if (turnoverAvailableRef.current !== false) fetchTurnover(debouncedFilters);
		if (canViewPayrollCost && payrollCostAvailableRef.current !== false) fetchPayrollCost(debouncedFilters);
		if (complianceAvailableRef.current !== false) fetchCompliance(debouncedFilters);
	}, [
		debouncedFilters,
		isDateRangeInvalid,
		canViewPayrollCost,
		fetchHeadcount,
		fetchDepartment,
		fetchTenure,
		fetchTurnover,
		fetchPayrollCost,
		fetchCompliance
	]);
	const handleExportCsv = async () => {
		if (isDateRangeInvalid) return;
		setIsExporting(true);
		setExportError(null);
		try {
			const blob = await reportsAnalyticsApi.exportCsv(debouncedFilters);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `reports-analytics-${debouncedFilters.start_date || "all"}-${debouncedFilters.end_date || "all"}.csv`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (err) {
			if ((err?.status || err?.response?.status) === 404) {
				setExportAvailable(false);
				setExportError("Export endpoint is not supported by the backend.");
			} else setExportError(getErrorMessage(err, "Failed to download CSV export"));
		} finally {
			setIsExporting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			exportAvailable !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "default",
					size: "sm",
					onClick: handleExportCsv,
					disabled: isExporting || isDateRangeInvalid,
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), isExporting ? "Exporting..." : "Export CSV"]
				})
			}) : null,
			exportError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exportError })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setExportError(null),
					className: "h-6 px-2 text-xs",
					children: "Dismiss"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-medium text-muted-foreground",
							children: "Start Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: startDate,
							onChange: (e) => setStartDate(e.target.value),
							className: "h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-medium text-muted-foreground",
							children: "End Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: endDate,
							onChange: (e) => setEndDate(e.target.value),
							className: "h-9"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-medium text-muted-foreground",
							children: "Department (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "text",
							placeholder: "e.g. Engineering, Sales...",
							value: department,
							onChange: (e) => setDepartment(e.target.value),
							className: "h-9"
						})] })
					]
				}), isDateRangeInvalid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-xs font-medium text-destructive",
					children: "Start date must be before or equal to End date."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Headcount over time",
						className: "lg:col-span-2",
						loading: headcountState.loading,
						error: headcountState.error,
						onRetry: () => fetchHeadcount(debouncedFilters),
						children: headcountState.data?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 260,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: headcountState.data,
								margin: {
									top: 10,
									right: 10,
									left: -10
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(0.5 0.02 264 / 0.15)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "m",
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "n",
										name: "Headcount",
										stroke: "oklch(0.6 0.2 285)",
										strokeWidth: 2.5,
										dot: false
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "By department",
						loading: deptState.loading,
						error: deptState.error,
						onRetry: () => fetchDepartment(debouncedFilters),
						children: deptState.data?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 260,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: deptState.data,
									dataKey: "value",
									nameKey: "name",
									innerRadius: 50,
									outerRadius: 90,
									paddingAngle: 3,
									children: deptState.data.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } })
							] })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Tenure distribution",
						className: "lg:col-span-3",
						loading: tenureState.loading,
						error: tenureState.error,
						onRetry: () => fetchTenure(debouncedFilters),
						children: tenureState.data?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 240,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: tenureState.data,
								margin: {
									top: 10,
									right: 10,
									left: -20
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(0.5 0.02 264 / 0.15)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "range",
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "n",
										name: "Employees",
										radius: [
											6,
											6,
											0,
											0
										],
										fill: "oklch(0.7 0.18 320)"
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {})
					}),
					turnoverState.available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Turnover rate",
						className: "lg:col-span-3",
						loading: turnoverState.loading,
						error: turnoverState.error,
						onRetry: () => fetchTurnover(debouncedFilters),
						children: turnoverState.data?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 240,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: turnoverState.data,
								margin: {
									top: 10,
									right: 10,
									left: -20
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(0.5 0.02 264 / 0.15)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "period",
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "rate",
										name: "Turnover %",
										stroke: "oklch(0.65 0.16 200)",
										strokeWidth: 2,
										dot: false
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {})
					}) : null,
					canViewPayrollCost && payrollCostState.available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Payroll Cost Analysis",
						className: "lg:col-span-2",
						loading: payrollCostState.loading,
						error: payrollCostState.error,
						onRetry: () => fetchPayrollCost(debouncedFilters),
						children: payrollCostState.data?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: 260,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: payrollCostState.data,
								margin: {
									top: 10,
									right: 10,
									left: -10
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "oklch(0.5 0.02 264 / 0.15)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "m",
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "currentColor",
										className: "text-xs text-muted-foreground",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "cost",
										name: "Cost",
										fill: "oklch(0.75 0.15 90)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {})
					}) : null,
					complianceState.available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Compliance & Audit",
						className: "lg:col-span-1",
						loading: complianceState.loading,
						error: complianceState.error,
						onRetry: () => fetchCompliance(debouncedFilters),
						children: complianceState.data?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: complianceState.data.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium",
									children: c.category || `Metric #${i + 1}`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold",
									children: c.score ?? c.status ?? "Compliant"
								})]
							}, i))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {})
					}) : null
				]
			})
		]
	});
}
function Card({ title, children, className = "", loading = false, error = null, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-medium text-foreground",
				children: title
			})
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[260px] flex-col justify-center space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-1/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 w-full rounded-xl" })]
		}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-destructive/40 bg-destructive/5 p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mb-2 h-8 w-8 text-destructive" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xs text-xs font-medium text-destructive",
					children: error
				}),
				onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: onRetry,
					className: "mt-3 gap-1.5 border-destructive/30 hover:bg-destructive/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Retry"]
				}) : null
			]
		}) : children]
	});
}
function Empty() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-[260px] place-items-center text-sm text-muted-foreground",
		children: "Not enough data yet"
	});
}
//#endregion
export { ReportsPage, ReportsPage as default };
