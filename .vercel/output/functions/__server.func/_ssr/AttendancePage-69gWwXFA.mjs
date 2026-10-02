import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, In as FingerprintPattern, O as TreePalm, Ur as CalendarDays, a as X, et as ScrollText, pr as Clock, qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as attendanceApi } from "./attendanceApi-CqMkuZD6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AttendancePage-69gWwXFA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ATTENDANCE_MODULES_LIST = [
	{
		id: "checkin",
		title: "Check In / Check Out",
		description: "Punch daily shift entries, view real-time break counters, and verify geofenced zones.",
		icon: FingerprintPattern,
		to: "/dashboard/attendance/checkin",
		color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "shifts",
		title: "Shifts",
		description: "Manage core timing schedules, night shift premiums, and grace-period rules.",
		icon: Clock,
		to: "/dashboard/attendance/shifts",
		color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "rosters",
		title: "Rosters",
		description: "Schedule dynamic rotational team rosters and assign backup resources.",
		icon: ScrollText,
		to: "/dashboard/attendance/rosters",
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	},
	{
		id: "holidays",
		title: "Holidays",
		description: "Setup the corporate holiday calendar, regional leaves, and optional off days.",
		icon: TreePalm,
		to: "/dashboard/attendance/holidays",
		color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30"
	}
];
function AttendancePage() {
	const isEmployee = (useAurix().user?.role || "").toLowerCase() === "employee";
	const [viewMode, setViewMode] = (0, import_react.useState)("modules");
	const [todayEmployees, setTodayEmployees] = (0, import_react.useState)([]);
	const [analytics, setAnalytics] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const modulesList = (0, import_react.useMemo)(() => {
		if (isEmployee) return [
			{
				id: "checkin",
				title: "Check In / Check Out",
				description: "Punch daily shift entries, view real-time break counters, and verify geofenced zones.",
				icon: FingerprintPattern,
				to: "/dashboard/attendance/checkin",
				color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30"
			},
			{
				id: "shifts",
				title: "My Shifts",
				description: "View your assigned work timings, shift specifications, and schedule history.",
				icon: Clock,
				to: "/dashboard/attendance/shifts",
				color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30"
			},
			{
				id: "rosters",
				title: "My Roster",
				description: "View your personal planned work schedule and shift assignment calendar.",
				icon: ScrollText,
				to: "/dashboard/attendance/rosters",
				color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
			},
			{
				id: "holidays",
				title: "Holidays",
				description: "View official public, regional, and company holidays for your branch.",
				icon: TreePalm,
				to: "/dashboard/attendance/holidays",
				color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30"
			}
		];
		return ATTENDANCE_MODULES_LIST;
	}, [isEmployee]);
	(0, import_react.useMemo)(() => {
		return (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}, []);
	const loadData = async (showToastNotice = false) => {
		setLoading(true);
		setError(null);
		try {
			const [empResult, analyticsResult] = await Promise.allSettled([attendanceApi.getTodayAttendance(), attendanceApi.getAttendanceAnalytics()]);
			let loadedEmployees = false;
			if (empResult.status === "fulfilled") {
				setTodayEmployees(empResult.value);
				loadedEmployees = true;
			} else {
				const errorMsg = empResult.reason?.message || "Failed to fetch attendance data from backend";
				console.warn("Backend error fetching today attendance:", empResult.reason);
				setError(errorMsg);
			}
			if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value);
			if (showToastNotice) if (loadedEmployees) toast.success("Attendance data refreshed from server");
			else toast.error("Failed to load attendance from backend");
		} catch (err) {
			const msg = err?.message || "Failed to load attendance records";
			setError(msg);
			if (showToastNotice) toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const stats = (0, import_react.useMemo)(() => {
		if (analytics && analytics.totalEmployees > 0) return {
			present: analytics.present,
			late: analytics.late,
			leave: analytics.onLeave,
			absent: analytics.absent
		};
		return todayEmployees.reduce((acc, e) => {
			const s = e.status || "absent";
			if (s === "present") acc.present++;
			else if (s === "late") acc.late++;
			else if (s === "leave") acc.leave++;
			else acc.absent++;
			return acc;
		}, {
			present: 0,
			late: 0,
			absent: 0,
			leave: 0
		});
	}, [analytics, todayEmployees]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: viewMode === "modules" ? "secondary" : "ghost",
						size: "sm",
						onClick: () => setViewMode("modules"),
						className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
						children: "Attendance Hub"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: viewMode === "analytics" ? "secondary" : "ghost",
						size: "sm",
						onClick: () => setViewMode("analytics"),
						className: "text-xs h-7 px-3 font-semibold rounded-md cursor-pointer",
						children: "Attendance Dashboard"
					})]
				})
			})
		}), viewMode === "modules" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6 animate-in fade-in duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: modulesList.map((module) => {
					const Icon = module.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: module.to,
						className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400",
									children: module.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-normal",
									children: module.description
								})]
							})]
						})
					}, module.id);
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 animate-in fade-in duration-300",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					{
						key: "present",
						label: "Present",
						color: "text-emerald-500",
						icon: Check
					},
					{
						key: "late",
						label: "Late",
						color: "text-amber-500",
						icon: Clock
					},
					{
						key: "leave",
						label: "On leave",
						color: "text-blue-500",
						icon: CalendarDays
					},
					{
						key: "absent",
						label: "Absent",
						color: "text-destructive",
						icon: X
					}
				].map((c) => {
					const Icon = c.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: c.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${c.color}` })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 font-display text-3xl font-semibold tracking-tight",
							children: loading && todayEmployees.length === 0 ? "..." : stats[c.key]
						})]
					}, c.key);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-4 py-3 text-left flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium text-sm",
						children: "Today's attendance records"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							todayEmployees.length,
							" ",
							todayEmployees.length === 1 ? "record" : "records"
						]
					})]
				}), loading && todayEmployees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center p-12 text-sm text-muted-foreground gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fetching real-time attendance from backend..." })]
				}) : todayEmployees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-12 text-center text-sm text-muted-foreground",
					children: "No attendance records recorded for today yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Employee"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Department"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Check-in"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Check-out"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Hours"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: todayEmployees.map((e) => {
							const checkIn = e.checkInTime ? new Date(e.checkInTime).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							}) : "—";
							const checkOut = e.checkOutTime ? new Date(e.checkOutTime).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							}) : "—";
							const hours = e.workingHours != null ? `${e.workingHours.toFixed(1)}h` : "—";
							const s = e.status || "absent";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.fullName }), e.employeeId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground font-mono",
												children: e.employeeId
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: e.department || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground font-mono text-xs",
										children: checkIn
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground font-mono text-xs",
										children: checkOut
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground font-mono text-xs",
										children: hours
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: s === "present" ? "secondary" : s === "absent" ? "destructive" : "outline",
											className: "capitalize text-[11px]",
											children: s
										})
									})
								]
							}, e.id);
						}) })]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { ATTENDANCE_MODULES_LIST, AttendancePage, AttendancePage as default };
