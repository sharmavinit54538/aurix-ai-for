import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Bt as MapPin, Cr as CircleCheckBig, Dr as ChevronRight, H as Sparkles, Jt as List, O as TreePalm, Or as ChevronLeft, Q as Send, S as Upload, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Ur as CalendarDays, V as SquarePen, a as X, an as Layers, er as Download, et as ScrollText, h as User, ht as Plus, jt as Moon, k as Trash2, lr as Coffee, lt as RefreshCw, or as Copy, pr as Clock, q as ShieldCheck, qr as Building2, qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { r as getShiftTypeDot } from "./color-maps-DnqgCmfa.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { t as attendanceApi } from "./attendanceApi-CqMkuZD6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RostersPage-DVikB7Lw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var WEEK_DAYS = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
function EmployeeRostersView({ employeeId }) {
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [hasRoster, setHasRoster] = (0, import_react.useState)(false);
	const [employeeName, setEmployeeName] = (0, import_react.useState)("");
	const [shiftName, setShiftName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [selectedYear, setSelectedYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth() + 1);
	const [viewMode, setViewMode] = (0, import_react.useState)("calendar");
	const [filterScope, setFilterScope] = (0, import_react.useState)("month");
	const [selectedEntry, setSelectedEntry] = (0, import_react.useState)(null);
	const [detailsOpen, setDetailsOpen] = (0, import_react.useState)(false);
	const [requestModalOpen, setRequestModalOpen] = (0, import_react.useState)(false);
	const [requestedShift, setRequestedShift] = (0, import_react.useState)("Morning Shift");
	const [effectiveDate, setEffectiveDate] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 1);
		return d.toISOString().split("T")[0];
	});
	const [changeReason, setChangeReason] = (0, import_react.useState)("");
	const [submittingRequest, setSubmittingRequest] = (0, import_react.useState)(false);
	const loadRoster = async (showNotice = false) => {
		setLoading(true);
		setError(null);
		try {
			const data = await attendanceApi.getMyRoster(selectedMonth, selectedYear, employeeId);
			setEntries(data.entries);
			setHasRoster(data.hasRoster);
			setEmployeeName(data.employeeName);
			setShiftName(data.shiftName);
			if (showNotice) toast.success("Roster refreshed from server");
		} catch (err) {
			console.error("Failed to load roster:", err);
			const msg = err?.message || "Unable to load your schedule. Please try again.";
			setError(msg);
			if (showNotice) toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadRoster();
	}, [
		selectedMonth,
		selectedYear,
		employeeId
	]);
	const handlePrevMonth = () => {
		if (selectedMonth === 1) {
			setSelectedMonth(12);
			setSelectedYear((y) => y - 1);
		} else setSelectedMonth((m) => m - 1);
	};
	const handleNextMonth = () => {
		if (selectedMonth === 12) {
			setSelectedMonth(1);
			setSelectedYear((y) => y + 1);
		} else setSelectedMonth((m) => m + 1);
	};
	const handleRequestChangeSubmit = async (e) => {
		e.preventDefault();
		if (!changeReason.trim()) {
			toast.error("Please provide a reason for the roster schedule adjustment.");
			return;
		}
		setSubmittingRequest(true);
		try {
			const result = await attendanceApi.requestScheduleChange({
				type: "roster",
				requestedShift,
				effectiveDate,
				reason: changeReason.trim()
			});
			toast.success(result.message || "Roster schedule change request submitted successfully.");
			setRequestModalOpen(false);
			setChangeReason("");
		} catch (err) {
			console.error("Roster request error:", err);
			toast.error(err?.message || "Failed to submit roster change request. Please try again.");
		} finally {
			setSubmittingRequest(false);
		}
	};
	const filteredEntries = (0, import_react.useMemo)(() => {
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		const now = /* @__PURE__ */ new Date();
		if (filterScope === "today") return entries.filter((e) => e.date === todayStr);
		if (filterScope === "week") {
			const currentDay = now.getDay();
			const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
			const monday = new Date(now);
			monday.setDate(now.getDate() + distanceToMonday);
			const sunday = new Date(monday);
			sunday.setDate(monday.getDate() + 6);
			const monStr = monday.toISOString().split("T")[0];
			const sunStr = sunday.toISOString().split("T")[0];
			return entries.filter((e) => e.date >= monStr && e.date <= sunStr);
		}
		if (filterScope === "upcoming") return entries.filter((e) => e.date >= todayStr);
		if (filterScope === "history") return entries.filter((e) => e.date < todayStr);
		return entries;
	}, [entries, filterScope]);
	const calendarDays = (0, import_react.useMemo)(() => {
		let startDayIndex = new Date(selectedYear, selectedMonth - 1, 1).getDay() - 1;
		if (startDayIndex === -1) startDayIndex = 6;
		const daysCount = new Date(selectedYear, selectedMonth, 0).getDate();
		const cells = [];
		for (let i = 0; i < startDayIndex; i++) cells.push(null);
		for (let day = 1; day <= daysCount; day++) {
			const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
			const entry = entries.find((e) => e.date === dateStr);
			if (entry) cells.push(entry);
			else {
				const dObj = new Date(selectedYear, selectedMonth - 1, day);
				cells.push({
					id: `empty-${dateStr}`,
					date: dateStr,
					day: dObj.toLocaleDateString("en-US", { weekday: "long" }),
					shiftName: "—",
					startTime: "—",
					endTime: "—",
					workingHours: 0,
					status: "Weekly Off"
				});
			}
		}
		return cells;
	}, [
		entries,
		selectedMonth,
		selectedYear
	]);
	const getStatusBadge = (status) => {
		switch (status) {
			case "Working": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Working"]
			});
			case "Weekly Off": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-slate-500/15 text-slate-400 border-slate-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { className: "h-3 w-3" }), " Weekly Off"]
			});
			case "Holiday": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: "h-3 w-3" }), " Holiday"]
			});
			case "Leave": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-blue-500/15 text-blue-400 border-blue-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3 w-3" }), " Leave"]
			});
			case "Rest Day": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3 w-3" }), " Rest Day"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "text-[11px]",
				children: status
			});
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-semibold text-foreground",
			children: "Loading your roster..."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-1",
			children: "Retrieving planned schedule and duty assignments from backend."
		})] })]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[400px] text-center p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-full bg-destructive/10 p-4 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 text-destructive" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold text-foreground",
				children: "Unable to load your schedule"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1.5 max-w-md",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => loadRoster(true),
				className: "mt-5 gap-2 border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Retry"]
			})
		]
	});
	if (!hasRoster || entries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight font-display text-foreground",
				children: "My Roster"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "Your personal planned work schedule and shift assignment calendar."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center flex flex-col items-center justify-center min-h-[350px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl bg-muted/40 p-4 mb-4 border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "h-8 w-8 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "No Roster Available"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed",
					children: "Your work schedule will appear here once it is assigned."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/30 border border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Employee Self-Service"]
					})
				})
			]
		})]
	});
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight font-display text-foreground",
						children: "My Roster"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs border-border bg-card/40",
						children: shiftName
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Your personal planned work schedule, scheduled working days, and rest days."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setRequestModalOpen(true),
						className: "h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Request Schedule Change"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						onClick: () => loadRoster(true),
						className: "h-9 w-9 border-border bg-card/60 hover:bg-accent/60",
						title: "Refresh roster",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 text-muted-foreground" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: handlePrevMonth,
								className: "h-8 w-8 border-border bg-card",
								title: "Previous month",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: handleNextMonth,
								className: "h-8 w-8 border-border bg-card",
								title: "Next month",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-base font-bold font-display text-foreground min-w-[150px]",
							children: [
								MONTH_NAMES[selectedMonth - 1],
								" ",
								selectedYear
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
						value: filterScope,
						onValueChange: (v) => setFilterScope(v),
						className: "w-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-muted/40 border border-border/60 p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "month",
									className: "text-xs",
									children: "This Month"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "today",
									className: "text-xs",
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "week",
									className: "text-xs",
									children: "This Week"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "upcoming",
									className: "text-xs",
									children: "Upcoming"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "history",
									className: "text-xs",
									children: "History"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center border border-border rounded-xl p-1 bg-muted/40 self-start md:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: viewMode === "calendar" ? "default" : "ghost",
							size: "sm",
							onClick: () => setViewMode("calendar"),
							className: `h-7 px-3 text-xs gap-1.5 ${viewMode === "calendar" ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), " Calendar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: viewMode === "list" ? "default" : "ghost",
							size: "sm",
							onClick: () => setViewMode("list"),
							className: `h-7 px-3 text-xs gap-1.5 ${viewMode === "list" ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" }), " List"]
						})]
					})
				]
			}),
			viewMode === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-2 mb-2 text-center",
					children: WEEK_DAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold text-muted-foreground py-2 uppercase tracking-wider",
						children: day
					}, day))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-2",
					children: calendarDays.map((entry, idx) => {
						if (!entry) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[105px] rounded-xl border border-transparent bg-muted/5 p-2.5 opacity-30 pointer-events-none" }, `blank-${idx}`);
						const isToday = entry.date === todayStr;
						const isWorking = entry.status === "Working";
						const isHoliday = entry.status === "Holiday";
						entry.status;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								setSelectedEntry(entry);
								setDetailsOpen(true);
							},
							className: `min-h-[105px] rounded-xl p-2.5 border transition-all cursor-pointer flex flex-col justify-between group ${isToday ? "border-emerald-500 bg-emerald-500/10 shadow-sm" : isWorking ? "border-border/60 bg-card hover:border-emerald-500/40 hover:bg-accent/40" : isHoliday ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50" : "border-border/40 bg-muted/10 hover:border-border/70"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-bold ${isToday ? "rounded-full bg-emerald-500 text-white h-5 w-5 flex items-center justify-center text-[10px]" : "text-foreground"}`,
										children: entry.date.split("-")[2]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground hidden sm:inline",
										children: entry.day.slice(0, 3)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "my-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold text-foreground truncate",
											title: entry.shiftName,
											children: entry.shiftName
										}),
										isWorking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: [
												entry.startTime,
												" – ",
												entry.endTime
											]
										}),
										isHoliday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-amber-400 truncate mt-0.5",
											children: "Public Holiday"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-1",
									children: getStatusBadge(entry.status)
								})
							]
						}, entry.id);
					})
				})]
			}),
			viewMode === "list" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-5 border-b border-border/50 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-base font-semibold text-foreground",
						children: [
							"Roster Entries (",
							filteredEntries.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Detailed day-by-day roster table for the selected scope."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							MONTH_NAMES[selectedMonth - 1],
							" ",
							selectedYear
						]
					})]
				}), filteredEntries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-12 text-center text-xs text-muted-foreground",
					children: "No roster entries matching the selected filter scope."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border/40",
					children: filteredEntries.map((item) => {
						const isToday = item.date === todayStr;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isToday ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : "hover:bg-muted/15"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/40 border border-border p-2.5 text-center min-w-[58px] shrink-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold uppercase text-muted-foreground block",
											children: item.day.slice(0, 3)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-bold text-foreground block leading-tight",
											children: item.date.split("-")[2]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-muted-foreground block",
											children: MONTH_NAMES[selectedMonth - 1].slice(0, 3)
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-sm text-foreground",
										children: item.shiftName
									}), isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]",
										children: "Today"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3",
									children: item.status === "Working" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												" ",
												item.startTime,
												" – ",
												item.endTime
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Working Hours: ",
											item.workingHours,
											"h"
										] })
									] }) : item.status === "Holiday" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-amber-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: "h-3 w-3" }), " Company / National Holiday"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Scheduled Off Day"
									})
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 self-end sm:self-center shrink-0",
								children: [getStatusBadge(item.status), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										setSelectedEntry(item);
										setDetailsOpen(true);
									},
									className: "h-8 text-xs text-muted-foreground hover:text-foreground",
									children: "Details"
								})]
							})]
						}, item.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: detailsOpen,
				onOpenChange: setDetailsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md border-border bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-lg font-bold font-display text-foreground",
								children: "Roster Details"
							}), selectedEntry && getStatusBadge(selectedEntry.status)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: [
								"Planned schedule details for ",
								selectedEntry?.day,
								", ",
								selectedEntry?.date,
								"."
							]
						})] }),
						selectedEntry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Assigned Employee:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: employeeName || "Current Employee"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Date:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: [
												selectedEntry.date,
												" (",
												selectedEntry.day,
												")"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Shift:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selectedEntry.shiftName
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Schedule Timing:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: [
												selectedEntry.startTime,
												" – ",
												selectedEntry.endTime
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Productive Hours:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: [selectedEntry.workingHours, " Hours"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Schedule Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selectedEntry.status
										})]
									})
								]
							}), selectedEntry.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground block mb-0.5",
									children: "Notes:"
								}), selectedEntry.notes]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "border-t border-border/50 pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setDetailsOpen(false),
								className: "text-xs border-border",
								children: "Close"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: requestModalOpen,
				onOpenChange: setRequestModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-lg font-bold font-display text-foreground",
						children: "Request Schedule Change"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Submit a formal request to your supervisor to modify your planned roster schedule."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRequestChangeSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "req-shift",
								className: "text-xs text-foreground",
								children: "Desired Shift / Roster Assignment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "req-shift",
								value: requestedShift,
								onChange: (e) => setRequestedShift(e.target.value),
								className: "mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Morning Shift",
										children: "Morning Shift (09:00 AM – 06:00 PM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Evening Shift",
										children: "Evening Shift (02:00 PM – 11:00 PM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Night Shift",
										children: "Night Shift (10:00 PM – 07:00 AM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Flexible Shift",
										children: "Flexible Shift (10:00 AM – 07:00 PM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Off Day Swap",
										children: "Rest Day / Off Day Swap"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "roster-effective-date",
								className: "text-xs text-foreground",
								children: "Requested Effective Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "roster-effective-date",
								type: "date",
								value: effectiveDate,
								onChange: (e) => setEffectiveDate(e.target.value),
								className: "mt-1 text-xs border-border",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "roster-change-reason",
								className: "text-xs text-foreground",
								children: "Reason / Justification"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "roster-change-reason",
								rows: 3,
								placeholder: "Describe your request and the reason for the schedule adjustment...",
								value: changeReason,
								onChange: (e) => setChangeReason(e.target.value),
								className: "mt-1 text-xs border-border",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "border-t border-border/50 pt-3 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setRequestModalOpen(false),
									className: "text-xs border-border",
									disabled: submittingRequest,
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									className: "text-xs bg-emerald-600 hover:bg-emerald-700 text-white",
									disabled: submittingRequest,
									children: submittingRequest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1.5" }), " Submitting..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 mr-1.5" }), " Submit Request"] })
								})]
							})
						]
					})]
				})
			})
		]
	});
}
var SHIFT_TYPES = [
	"Morning",
	"Evening",
	"Night",
	"Off Day",
	"Leave",
	"Holiday",
	"Training",
	"WFH",
	"Overtime"
];
function RostersPage() {
	useAurix();
	const router = useRouterState();
	const pathname = router.location.pathname;
	const searchParams = router.location.search;
	const viewParam = searchParams?.view;
	const employeeIdParam = searchParams?.employeeId;
	const isEmployee = useCurrentRole() === "employee" || viewParam === "my" || pathname.startsWith("/dashboard/employee");
	const [rosters, setRosters] = (0, import_react.useState)([]);
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [viewMode, setViewMode] = (0, import_react.useState)("calendar");
	const [calendarView, setCalendarView] = (0, import_react.useState)("Week");
	const [search, setSearch] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("all");
	const [shiftFilter, setShiftFilter] = (0, import_react.useState)("all");
	const [locationFilter, setLocationFilter] = (0, import_react.useState)("all");
	const [managerFilter, setManagerFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [autoSaveStatus, setAutoSaveStatus] = (0, import_react.useState)("All changes auto-saved");
	const [selectedEntry, setSelectedEntry] = (0, import_react.useState)(null);
	const [isAssignModalOpen, setIsAssignModalOpen] = (0, import_react.useState)(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = (0, import_react.useState)(false);
	const [formEmployeeId, setFormEmployeeId] = (0, import_react.useState)("");
	const [formShift, setFormShift] = (0, import_react.useState)("Morning");
	const [formDate, setFormDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [formStartTime, setFormStartTime] = (0, import_react.useState)("08:00");
	const [formEndTime, setFormEndTime] = (0, import_react.useState)("16:00");
	const [formBreak, setFormBreak] = (0, import_react.useState)("45 mins");
	const [formLocation, setFormLocation] = (0, import_react.useState)("Corporate HQ");
	const [formStatus, setFormStatus] = (0, import_react.useState)("Approved");
	const [formRecurring, setFormRecurring] = (0, import_react.useState)(false);
	const [createRosterName, setCreateRosterName] = (0, import_react.useState)("");
	const [createRosterDept, setCreateRosterDept] = (0, import_react.useState)("General");
	const [createRosterStart, setCreateRosterStart] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [createRosterEnd, setCreateRosterEnd] = (0, import_react.useState)(() => new Date(Date.now() + 6 * 864e5).toISOString().split("T")[0]);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = (0, import_react.useState)(false);
	const [entryToDelete, setEntryToDelete] = (0, import_react.useState)(null);
	const [draggingEntryId, setDraggingEntryId] = (0, import_react.useState)(null);
	const currentWeekDays = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const currentDay = now.getDay();
		const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
		const monday = new Date(now);
		monday.setDate(now.getDate() + distanceToMonday);
		const daysNames = [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		];
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(monday);
			d.setDate(monday.getDate() + i);
			const dateStr = d.toISOString().split("T")[0];
			const label = d.toLocaleDateString("en-IN", {
				day: "numeric",
				month: "short"
			});
			return {
				dayName: daysNames[i],
				dateStr,
				label
			};
		});
	}, []);
	const loadData = async (showNotice = false) => {
		setLoading(true);
		setError(null);
		try {
			const [rosterRes, empRes] = await Promise.allSettled([attendanceApi.getRosters(), apiInstance.get("/employees?limit=200")]);
			if (rosterRes.status === "fulfilled") setRosters(rosterRes.value);
			else setError(rosterRes.reason?.message || "Failed to load rosters from server");
			if (empRes.status === "fulfilled") {
				const data = empRes.value.data?.data;
				const parsed = (Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []).map((e) => ({
					id: e.id || e.employee_id,
					name: e.full_name || `${e.first_name || ""} ${e.last_name || ""}`.trim() || e.name || "Employee",
					code: e.employee_id || e.code || `EMP-${(e.id || "").slice(0, 4)}`,
					dept: e.department || "General",
					role: e.designation || e.role || "Staff",
					mgr: e.manager_name || e.manager || ""
				}));
				setEmployees(parsed);
				if (parsed.length > 0 && !formEmployeeId) setFormEmployeeId(parsed[0].code);
			}
			if (showNotice) if (rosterRes.status === "fulfilled") toast.success("Roster data refreshed from server");
			else toast.error("Failed to load rosters from backend");
		} catch (err) {
			setError(err?.message || "Failed to load rosters");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isEmployee) loadData();
	}, [isEmployee]);
	const availableManagers = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		employees.forEach((e) => {
			if (e.mgr && e.mgr.trim()) set.add(e.mgr.trim());
		});
		rosters.forEach((r) => {
			if (r.managerName && r.managerName.trim()) set.add(r.managerName.trim());
		});
		return Array.from(set);
	}, [employees, rosters]);
	const availableLocations = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set(["Corporate HQ", "Remote"]);
		rosters.forEach((r) => {
			if (r.location && r.location.trim()) set.add(r.location.trim());
		});
		return Array.from(set);
	}, [rosters]);
	const filteredRosters = (0, import_react.useMemo)(() => {
		return rosters.filter((r) => {
			if (search && !`${r.employeeName} ${r.department} ${r.shift}`.toLowerCase().includes(search.toLowerCase())) return false;
			if (deptFilter !== "all" && r.department.toLowerCase() !== deptFilter.toLowerCase()) return false;
			if (shiftFilter !== "all" && r.shift.toLowerCase() !== shiftFilter.toLowerCase()) return false;
			if (locationFilter !== "all" && r.location.toLowerCase() !== locationFilter.toLowerCase()) return false;
			if (managerFilter !== "all" && r.manager.toLowerCase() !== managerFilter.toLowerCase()) return false;
			if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
			return true;
		});
	}, [
		rosters,
		search,
		deptFilter,
		shiftFilter,
		locationFilter,
		managerFilter,
		statusFilter
	]);
	const stats = (0, import_react.useMemo)(() => {
		const assignedCount = new Set(filteredRosters.map((r) => r.employeeId)).size;
		const openShifts = filteredRosters.filter((r) => r.shift === "Off Day").length;
		const overtimeHours = filteredRosters.filter((r) => r.shift === "Overtime").reduce((sum, r) => sum + r.workingHours, 0);
		const pendingCount = filteredRosters.filter((r) => r.status === "Pending").length;
		let conflicts = 0;
		const doubleShiftTracker = /* @__PURE__ */ new Set();
		filteredRosters.forEach((r) => {
			const key = `${r.employeeId}-${r.date}`;
			if (doubleShiftTracker.has(key)) conflicts++;
			else doubleShiftTracker.add(key);
			if (r.shift === "Overtime") conflicts++;
			if (r.shift === "Leave" && r.workingHours > 0) conflicts++;
		});
		return {
			activeRosters: filteredRosters.length > 0 ? 1 : 0,
			employeesAssigned: assignedCount,
			openShifts,
			coverage: assignedCount > 0 ? "100%" : "0%",
			overtime: overtimeHours,
			pending: pendingCount,
			conflicts
		};
	}, [filteredRosters]);
	const conflictList = (0, import_react.useMemo)(() => {
		const list = [];
		const dayMap = /* @__PURE__ */ new Map();
		rosters.forEach((r) => {
			const key = `${r.employeeId}-${r.date}`;
			const existing = dayMap.get(key) || [];
			existing.push(r);
			dayMap.set(key, existing);
		});
		dayMap.forEach((entries, key) => {
			const empName = entries[0].employeeName;
			const date = key.slice(key.indexOf("-") + 1);
			if (entries.length > 1) list.push({
				id: `ds-${key}`,
				employeeName: empName,
				type: "Double Shift Detected",
				date,
				message: `${empName} has multiple shifts scheduled on ${date}.`
			});
		});
		rosters.forEach((r) => {
			if (r.shift === "Leave" && r.status === "Approved") list.push({
				id: `l-${r.id}`,
				employeeName: r.employeeName,
				type: "Leave Overlap",
				date: r.date,
				message: `${r.employeeName} is on leave on ${r.date} but has a schedule.`
			});
			if (r.shift === "Holiday" && r.workingHours > 0) list.push({
				id: `h-${r.id}`,
				employeeName: r.employeeName,
				type: "Holiday Conflict",
				date: r.date,
				message: `${r.employeeName} has a working shift scheduled on ${r.date} (Public Holiday).`
			});
		});
		return list;
	}, [rosters]);
	if (isEmployee) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeRostersView, { employeeId: employeeIdParam || void 0 });
	const triggerAutoSave = () => {
		setAutoSaveStatus("Saving changes...");
		setTimeout(() => {
			setAutoSaveStatus("Saved a few seconds ago");
		}, 800);
	};
	const handleResetFilters = () => {
		setSearch("");
		setDeptFilter("all");
		setShiftFilter("all");
		setLocationFilter("all");
		setManagerFilter("all");
		setStatusFilter("all");
		toast.success("Filters reset successfully");
	};
	const handleAssignShift = async (e) => {
		e.preventDefault();
		const emp = employees.find((item) => item.code === formEmployeeId);
		if (!emp) {
			toast.error("Please select an employee");
			return;
		}
		try {
			const created = await attendanceApi.createRoster({
				employeeId: emp.code,
				employeeName: emp.name,
				department: emp.dept,
				designation: emp.role,
				date: formDate,
				shift: formShift,
				startTime: formStartTime,
				endTime: formEndTime,
				workingHours: formShift === "Off Day" || formShift === "Leave" || formShift === "Holiday" ? 0 : 8,
				breakTime: formBreak,
				location: formLocation,
				manager: emp.mgr,
				status: formStatus
			});
			setRosters((prev) => [created, ...prev]);
			setIsAssignModalOpen(false);
			toast.success(`Assigned shift "${formShift}" to ${emp.name} on ${formDate}`);
			triggerAutoSave();
		} catch (err) {
			toast.error(err?.message || "Failed to save roster entry to backend");
		}
	};
	const handleCreateRoster = (e) => {
		e.preventDefault();
		if (!createRosterName.trim()) {
			toast.error("Roster name is required");
			return;
		}
		setIsCreateModalOpen(false);
		toast.success(`Roster planner "${createRosterName}" generated for department "${createRosterDept}"`);
		triggerAutoSave();
	};
	const handleQuickFixConflicts = () => {
		setRosters((prev) => {
			const doubleShiftTracker = /* @__PURE__ */ new Set();
			return prev.map((r) => {
				const key = `${r.employeeId}-${r.date}`;
				if (doubleShiftTracker.has(key)) return {
					...r,
					shift: "Off Day",
					workingHours: 0,
					startTime: "—",
					endTime: "—"
				};
				else {
					doubleShiftTracker.add(key);
					return r;
				}
			});
		});
		toast.success("AI resolved all schedule conflicts by re-assigning off days!");
		triggerAutoSave();
	};
	const handleAction = (action, entry) => {
		if (action === "Approve") {
			setRosters((prev) => prev.map((r) => r.id === entry.id ? {
				...r,
				status: "Approved"
			} : r));
			toast.success(`Roster entry approved for ${entry.employeeName}`);
			triggerAutoSave();
		} else if (action === "Reject") {
			setRosters((prev) => prev.map((r) => r.id === entry.id ? {
				...r,
				status: "Rejected"
			} : r));
			toast.success(`Roster entry rejected for ${entry.employeeName}`);
			triggerAutoSave();
		} else if (action === "Delete") {
			setEntryToDelete(entry);
			setIsDeleteConfirmOpen(true);
		} else if (action === "Duplicate") (async () => {
			try {
				const created = await attendanceApi.createRoster({
					employeeId: entry.employeeId,
					employeeName: entry.employeeName,
					department: entry.department,
					designation: entry.designation,
					date: entry.date,
					shift: entry.shift,
					startTime: entry.startTime,
					endTime: entry.endTime,
					workingHours: entry.workingHours,
					breakTime: entry.breakTime,
					location: entry.location,
					manager: entry.manager,
					status: "Pending"
				});
				setRosters((prev) => [created, ...prev]);
				toast.success(`Duplicated schedule row for ${entry.employeeName}`);
				triggerAutoSave();
			} catch (err) {
				toast.error(err?.message || "Failed to duplicate roster entry");
			}
		})();
		else if (action === "Assign") {
			setFormEmployeeId(entry.employeeId);
			setFormShift(entry.shift);
			setFormDate(entry.date);
			setFormStartTime(entry.startTime);
			setFormEndTime(entry.endTime);
			setFormBreak(entry.breakTime);
			setFormLocation(entry.location);
			setFormStatus(entry.status);
			setIsAssignModalOpen(true);
		}
	};
	const confirmDeleteEntry = async () => {
		if (!entryToDelete) return;
		try {
			await attendanceApi.deleteRoster(entryToDelete.id);
			setRosters((prev) => prev.filter((r) => r.id !== entryToDelete.id));
			setIsDeleteConfirmOpen(false);
			toast.success(`Deleted schedule for ${entryToDelete.employeeName}`);
			triggerAutoSave();
		} catch (err) {
			toast.error(err?.message || "Failed to delete schedule on backend");
		}
	};
	const handleDragStart = (id) => {
		setDraggingEntryId(id);
	};
	const handleDropCell = async (employeeId, dateStr) => {
		if (!draggingEntryId) return;
		const entryToMove = rosters.find((r) => r.id === draggingEntryId);
		if (!entryToMove) return;
		const targetEmployee = employees.find((item) => item.code === employeeId);
		if (!targetEmployee) return;
		try {
			const updated = await attendanceApi.updateRoster(entryToMove.id, {
				employeeId: targetEmployee.code,
				employeeName: targetEmployee.name,
				department: targetEmployee.dept,
				designation: targetEmployee.role,
				date: dateStr,
				manager: targetEmployee.mgr
			});
			setRosters((prev) => prev.map((r) => r.id === draggingEntryId ? updated : r));
			toast.success(`Moved ${entryToMove.employeeName}'s shift to ${targetEmployee.name} on ${dateStr}`);
			triggerAutoSave();
		} catch (err) {
			toast.error(err?.message || "Failed to update roster on backend");
		} finally {
			setDraggingEntryId(null);
		}
	};
	const highlightText = (text, searchStr) => {
		if (!searchStr) return text;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.split(new RegExp(`(${searchStr})`, "gi")).map((part, i) => part.toLowerCase() === searchStr.toLowerCase() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: "bg-primary/20 text-foreground px-0.5 rounded",
			children: part
		}, i) : part) });
	};
	const getShiftBadgeStyle = (shift) => {
		switch (shift) {
			case "Morning": return "bg-primary/10 text-primary border-primary/20";
			case "Evening": return "bg-muted text-foreground border-border";
			case "Night": return "bg-primary/15 text-primary border-primary/30";
			case "Off Day": return "bg-muted text-muted-foreground border-border";
			case "Leave": return "bg-destructive/10 text-destructive border-destructive/20";
			case "Holiday": return "bg-primary/10 text-primary border-primary/20";
			case "Training": return "bg-muted text-foreground border-border";
			case "WFH": return "bg-primary/10 text-primary border-primary/20";
			case "Overtime": return "bg-muted text-foreground border-border";
			default: return "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				showBack: true,
				backText: "Back",
				title: "Roster Planner",
				description: "Plan employee shifts, weekly schedules, monthly rosters, and workforce allocation.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden sm:inline-flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border bg-card rounded-lg px-2.5 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3 text-primary" }), autoSaveStatus]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
									loading: "AI generating optimal shift coverage...",
									success: "Optimal shift schedule generated with 0 conflicts!",
									error: "AI generation failed."
								});
							},
							className: "h-9 border-border text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-3.5 w-3.5 text-primary" }), "Generate AI Roster"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => toast.info("Import schedule simulation active"),
							className: "h-9 border-border text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-3.5 w-3.5" }), "Import Schedule"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => toast.success("Export started"),
							className: "h-9 border-border text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-3.5 w-3.5" }), "Export"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setIsCreateModalOpen(true),
							className: "h-9 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), "Create Roster"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8",
				children: [
					{
						label: "Active Rosters",
						value: stats.activeRosters,
						prog: stats.activeRosters > 0 ? 100 : 0,
						sub: stats.activeRosters > 0 ? "Active" : "None"
					},
					{
						label: "Employees Assigned",
						value: stats.employeesAssigned,
						prog: stats.employeesAssigned > 0 ? 100 : 0,
						sub: `${stats.employeesAssigned} staff`
					},
					{
						label: "Open Shifts",
						value: stats.openShifts,
						prog: 0,
						sub: `${stats.openShifts} open`
					},
					{
						label: "Weekly Coverage",
						value: stats.coverage,
						prog: parseInt(stats.coverage) || 0,
						sub: "Coverage"
					},
					{
						label: "Monthly Coverage",
						value: stats.coverage,
						prog: parseInt(stats.coverage) || 0,
						sub: "Coverage"
					},
					{
						label: "Overtime Hours",
						value: `${stats.overtime}h`,
						prog: stats.overtime > 0 ? 50 : 0,
						sub: `${stats.overtime}h total`
					},
					{
						label: "Pending Approvals",
						value: stats.pending,
						prog: stats.pending > 0 ? 80 : 0,
						sub: stats.pending > 0 ? "Requires action" : "Clean"
					},
					{
						label: "Conflicts Detected",
						value: stats.conflicts,
						isDestructive: stats.conflicts > 0,
						prog: stats.conflicts * 10,
						sub: stats.conflicts > 0 ? `${stats.conflicts} warnings` : "Clean"
					}
				].map((c, i) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold uppercase tracking-wider text-muted-foreground block truncate",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl font-bold tracking-tight text-foreground",
									children: c.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-muted-foreground",
									children: c.sub
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-1 w-full bg-border rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full rounded-full transition-all duration-500 ${c.isDestructive ? "bg-destructive" : "bg-primary"}`,
									style: { width: `${c.prog}%` }
								})
							})
						]
					}, i);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-w-[200px] flex-1 md:max-w-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search employee, dept, shift…",
									className: "h-9 pl-9 border-border text-xs focus:ring-1 focus:ring-ring focus:border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dept:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: deptFilter,
										onChange: (e) => setDeptFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "all",
												className: "bg-background",
												children: "All Departments"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "engineering",
												className: "bg-background",
												children: "Engineering"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "sales",
												className: "bg-background",
												children: "Sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "hr",
												className: "bg-background",
												children: "HR & Ops"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "finance",
												className: "bg-background",
												children: "Finance"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shift Type:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: shiftFilter,
										onChange: (e) => setShiftFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Shifts"
										}), SHIFT_TYPES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: st.toLowerCase(),
											className: "bg-background",
											children: st
										}, st))]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Location:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: locationFilter,
										onChange: (e) => setLocationFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Locations"
										}), availableLocations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: loc.toLowerCase(),
											className: "bg-background",
											children: loc
										}, loc))]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Manager:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: managerFilter,
										onChange: (e) => setManagerFilter(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Managers"
										}), availableManagers.map((mgr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: mgr.toLowerCase(),
											className: "bg-background",
											children: mgr
										}, mgr))]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "approved",
											className: "bg-background",
											children: "Approved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pending",
											className: "bg-background",
											children: "Pending"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rejected",
											className: "bg-background",
											children: "Rejected"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleResetFilters,
								className: "h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3 w-3" }), "Reset Filters"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex border border-border rounded-lg bg-card p-0.5 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("calendar"),
							className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "calendar" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
							"aria-label": "Scheduler calendar view",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), "Scheduler"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("list"),
							className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
							"aria-label": "List view table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" }), "List Table"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-3 space-y-6",
					children: [viewMode === "calendar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border px-5 py-4 bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold tracking-tight text-foreground",
									children: "Weekly Shift Planner"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md font-mono",
									children: "22 Jun 2026 - 28 Jun 2026"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex border border-border rounded-lg p-0.5 bg-card text-[11px]",
									children: [
										"Day",
										"Week",
										"Month",
										"Timeline"
									].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setCalendarView(v);
										},
										className: `px-2.5 py-1 rounded ${calendarView === v ? "bg-muted font-bold text-foreground" : "text-muted-foreground hover:text-foreground"}`,
										children: v
									}, v))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toast.info("Previous week"),
										className: "rounded border border-border p-1 hover:bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toast.info("Next week"),
										className: "rounded border border-border p-1 hover:bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-[800px] divide-y divide-border text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-8 bg-muted/10 font-semibold text-muted-foreground py-3 border-b border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-4",
										children: "Employee / Role"
									}), currentWeekDays.map((d) => {
										const isToday = d.dateStr === "2026-06-25";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `text-center flex flex-col items-center justify-center ${isToday ? "text-primary font-bold" : ""}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase tracking-wider",
												children: d.dayName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs mt-0.5 rounded-full px-1.5 py-0.5 ${isToday ? "bg-primary/10 border border-primary/20 text-primary" : ""}`,
												children: d.label
											})]
										}, d.dateStr);
									})]
								}), employees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-8 text-center text-xs text-muted-foreground",
									children: loading ? "Loading employees from backend..." : "No employees found in directory."
								}) : employees.map((emp) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-8 hover:bg-muted/5 transition-colors items-center py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-7 w-7 rounded-full bg-accent text-[10px] font-bold text-foreground grid place-items-center uppercase",
												children: emp.name.split(" ").map((n) => n.charAt(0)).join("")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground leading-snug",
													children: emp.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] text-muted-foreground truncate max-w-[100px]",
													children: emp.role
												})]
											})]
										}), currentWeekDays.map((day) => {
											const isToday = day.dateStr === "2026-06-25";
											const cellEntries = rosters.filter((r) => r.employeeId === emp.code && r.date === day.dateStr);
											const cellConflicts = conflictList.filter((c) => c.employeeName === emp.name && c.date === day.dateStr);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												onDragOver: (e) => e.preventDefault(),
												onDrop: () => handleDropCell(emp.code, day.dateStr),
												className: `p-1.5 min-h-[74px] h-auto flex flex-col justify-stretch gap-1 border-l border-border relative group/cell ${isToday ? "bg-primary/5" : ""}`,
												children: cellEntries.length > 0 ? cellEntries.map((entry) => {
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														draggable: true,
														onDragStart: () => handleDragStart(entry.id),
														onClick: () => handleAction("Assign", entry),
														className: `w-full rounded-md border p-1.5 text-[10px] font-medium leading-tight flex flex-col gap-1 cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:shadow transition-all ${getShiftBadgeStyle(entry.shift)}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-start justify-between gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold truncate",
																children: entry.shift
															}), cellConflicts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																title: cellConflicts[0].type,
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 text-destructive shrink-0 animate-bounce" })
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between text-[8px] opacity-75",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entry.startTime === "—" ? "" : `${entry.startTime}-${entry.endTime}` }), entry.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-ping" })]
														})]
													}, entry.id);
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setFormEmployeeId(emp.code);
														setFormShift("Morning");
														setFormDate(day.dateStr);
														setFormStartTime("08:00");
														setFormEndTime("16:00");
														setFormStatus("Pending");
														setIsAssignModalOpen(true);
													},
													className: "w-full flex-1 min-h-[58px] rounded border border-dashed border-border/50 opacity-0 group-hover/cell:opacity-100 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all text-[10px]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-0.5" }), " Assign"]
												})
											}, day.dateStr);
										})]
									}, emp.id);
								})]
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/30 font-semibold uppercase tracking-wider text-muted-foreground border-b border-border text-[10px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Employee"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Department"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Shift Pattern"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Hours"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Break"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Location"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Manager"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredRosters.map((entry) => {
									const isPending = entry.status === "Pending";
									entry.status;
									const badgeStyle = getShiftBadgeStyle(entry.shift);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border transition-colors hover:bg-muted/10 group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 font-semibold text-foreground",
												children: highlightText(entry.employeeName, search)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 font-mono text-muted-foreground",
												children: entry.employeeId
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground",
												children: entry.department
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground font-mono",
												children: entry.date
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-[9px] font-semibold py-0.5 px-1.5 ${badgeStyle}`,
													children: entry.shift
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground",
												children: entry.workingHours > 0 ? `${entry.workingHours} hrs` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground",
												children: entry.breakTime
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground truncate max-w-[100px]",
												children: entry.location
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-muted-foreground text-[10px]",
												children: entry.manager
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-[9px] py-0.5 px-1.5 font-medium ${statusBadgeClass(entry.status)}`,
													children: entry.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity",
													children: [
														isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Approve", entry),
															className: "rounded p-1 border border-border text-emerald-600 dark:text-emerald-400 hover:bg-muted/50",
															title: "Approve Shift",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Reject", entry),
															className: "rounded p-1 border border-destructive/30 text-destructive hover:bg-destructive/10",
															title: "Reject Shift",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Assign", entry),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: "Edit",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3 w-3" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Duplicate", entry),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: "Duplicate",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleAction("Delete", entry),
															className: "rounded p-1 text-muted-foreground hover:bg-destructive/15 hover:text-destructive",
															title: "Delete",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
														})
													]
												})
											})
										]
									}, entry.id);
								}) })]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground",
								children: "Roster Allocation Analytics"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "Shift Distribution (Assigned Rows)"
								}), filteredRosters.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: [
										{
											label: "Morning Shifts",
											value: filteredRosters.filter((r) => r.shift === "Morning").length,
											color: "bg-primary"
										},
										{
											label: "Evening Shifts",
											value: filteredRosters.filter((r) => r.shift === "Evening").length,
											color: "bg-muted-foreground"
										},
										{
											label: "Night Shifts",
											value: filteredRosters.filter((r) => r.shift === "Night").length,
											color: "bg-primary/80"
										},
										{
											label: "WFH / Hybrid",
											value: filteredRosters.filter((r) => r.shift === "WFH").length,
											color: "bg-primary/50"
										}
									].map((bar, i) => {
										const pctVal = filteredRosters.length > 0 ? Math.round(bar.value / filteredRosters.length * 100) : 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-[11px] font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: bar.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold text-foreground",
													children: [
														bar.value,
														" employees (",
														pctVal,
														"%)"
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 w-full bg-border rounded-full overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `h-full rounded-full ${bar.color}`,
													style: { width: `${pctVal}%` }
												})
											})]
										}, i);
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg",
									children: "No active shifts assigned yet."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "Workforce Density Heatmap (Active Coverage)"
								}), filteredRosters.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-7 gap-1 bg-border/20 rounded-lg p-2.5 border border-border",
									children: [[
										"M",
										"T",
										"W",
										"T",
										"F",
										"S",
										"S"
									].map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-center font-bold text-[9px] text-muted-foreground/80 mb-1",
										children: l
									}, i)), Array.from({ length: 28 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 rounded bg-primary/20 transition-all hover:scale-105" }, idx))]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg",
									children: "No active shift density data recorded yet."
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-sm font-semibold tracking-tight text-foreground",
										children: "AI Roster Guard"
									})]
								}), conflictList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "destructive",
									className: "text-[9px] py-0 px-1 animate-pulse",
									children: [conflictList.length, " Warning"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [conflictList.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-destructive/20 bg-destructive/10 p-3 space-y-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1.5 font-semibold text-destructive-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 leading-none text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), item.type]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] opacity-75 font-mono",
											children: item.date
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground leading-normal",
										children: item.message
									})]
								}, idx)), conflictList.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleQuickFixConflicts,
									className: "w-full h-9 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 mr-1.5" }), " Apply AI Quick Fix"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 text-center rounded-xl bg-card border border-border text-foreground flex flex-col items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-xs mt-1",
											children: "No Schedule Conflicts"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[9px] text-muted-foreground",
											children: [
												"AI checked ",
												rosters.length,
												" active shift sequence. Overlap clearance is 100%."
											]
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground mb-4",
								children: "Today's Schedule & Timeline"
							}), rosters.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3 text-xs",
								children: rosters.slice(0, 5).map((shift) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 pb-2.5 border-b border-border last:border-b-0 last:pb-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full mt-1.5 shrink-0 ${getShiftTypeDot(shift.shift)}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-baseline font-semibold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: shift.employeeName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[9px] text-muted-foreground font-mono font-medium",
												children: [
													shift.startTime,
													" - ",
													shift.endTime
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: shift.shift
										})]
									})]
								}, shift.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground text-center py-4",
								children: "No shifts scheduled for today."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground",
								children: "Weekly Allocation Summary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Total Active Shifts"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [rosters.length, " shifts"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Average Shift Length"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [rosters.length > 0 ? (rosters.reduce((s, r) => s + r.workingHours, 0) / rosters.length).toFixed(1) : "0.0", " hours"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "WFH Days Approved"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [rosters.filter((r) => r.shift === "WFH").length, " days"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Leave Absences"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [rosters.filter((r) => r.shift === "Leave").length, " days"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Estimated Overtime"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [rosters.filter((r) => r.shift === "Overtime").reduce((s, r) => s + r.workingHours, 0).toFixed(1), " hours"]
										})]
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAssignModalOpen,
				onOpenChange: setIsAssignModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md border border-border bg-card p-6 shadow-lg sm:rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-base font-semibold tracking-tight text-foreground",
						children: "Assign Workforce Shift"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Directly assign or edit shift patterns for specific employee dates."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAssignShift,
						className: "space-y-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Select Employee"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: formEmployeeId,
										onChange: (e) => setFormEmployeeId(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: emp.code,
											children: [
												emp.name,
												" (",
												emp.code,
												")"
											]
										}, emp.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Shift Pattern"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: formShift,
										onChange: (e) => setFormShift(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring font-medium",
										children: SHIFT_TYPES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: st,
											children: st
										}, st))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Schedule Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: formDate,
										onChange: (e) => setFormDate(e.target.value),
										required: true,
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Work Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formLocation,
										onChange: (e) => setFormLocation(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "San Francisco HQ",
												children: "San Francisco HQ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "London office",
												children: "London office"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Bengaluru Tech Park",
												children: "Bengaluru Tech Park"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Remote",
												children: "Remote / WFH"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Start Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formStartTime,
										onChange: (e) => setFormStartTime(e.target.value),
										placeholder: "e.g. 08:00",
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "End Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formEndTime,
										onChange: (e) => setFormEndTime(e.target.value),
										placeholder: "e.g. 16:00",
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Break Duration"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formBreak,
										onChange: (e) => setFormBreak(e.target.value),
										placeholder: "e.g. 45 mins",
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Approval Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formStatus,
										onChange: (e) => setFormStatus(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Approved",
												children: "Approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Pending",
												children: "Pending"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Rejected",
												children: "Rejected"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 flex items-center justify-between py-2 border-t border-border mt-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-medium text-foreground cursor-pointer",
											htmlFor: "rec-shift",
											children: "Recurring Weekly Schedule"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "Repeat this exact shift pattern for next 4 calendar weeks."
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "rec-shift",
										checked: formRecurring,
										onChange: (e) => setFormRecurring(e.target.checked),
										className: "h-4 w-4 rounded text-primary focus:ring-primary accent-primary"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsAssignModalOpen(false),
								className: "h-9 border-border bg-transparent text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs",
								children: "Save Schedule"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isCreateModalOpen,
				onOpenChange: setIsCreateModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md border border-border bg-card p-6 shadow-lg sm:rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-base font-semibold tracking-tight text-foreground",
						children: "Create New Roster Template"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Create a weekly or monthly empty schedule shell to start assigning shifts."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateRoster,
						className: "space-y-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Roster Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: createRosterName,
										onChange: (e) => setCreateRosterName(e.target.value),
										placeholder: "e.g. Engineering Team A Week 26",
										required: true,
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Department Scope"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: createRosterDept,
										onChange: (e) => setCreateRosterDept(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Engineering",
												children: "Engineering"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sales",
												children: "Sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "HR",
												children: "HR & Operations"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "hq",
												children: "San Francisco HQ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "london",
												children: "London branch"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "blr",
												children: "Bengaluru Tech Park"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Start Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: createRosterStart,
										onChange: (e) => setCreateRosterStart(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "End Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: createRosterEnd,
										onChange: (e) => setCreateRosterEnd(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Notes / Handover Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										placeholder: "Key schedule deliverables, mandatory weekend standbys, or custom swap policies…",
										rows: 2,
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsCreateModalOpen(false),
								className: "h-9 border-border bg-transparent text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs",
								children: "Create Shell"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDeleteConfirmOpen,
				onOpenChange: setIsDeleteConfirmOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md border border-border bg-card p-6 shadow-lg sm:rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "flex flex-row items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-full bg-destructive/10 p-2 text-destructive shrink-0 mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
									className: "font-display text-base font-semibold tracking-tight text-foreground",
									children: "Delete Schedule Row"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
									className: "text-xs text-muted-foreground",
									children: [
										"Are you sure you want to delete the schedule entry for",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-foreground",
											children: [
												"\"",
												entryToDelete?.employeeName,
												"\""
											]
										}),
										"?"
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-normal px-1",
							children: "Deleting this roster row leaves the employee unassigned (Off Day status) for this schedule period. Any active approvals will be voided."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsDeleteConfirmOpen(false),
								className: "h-9 border-border bg-transparent text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: confirmDeleteEntry,
								className: "h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs",
								children: "Confirm Delete"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { RostersPage as default };
