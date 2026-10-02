import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Bt as MapPin, Dr as ChevronRight, F as Tag, H as Sparkles, Jn as Eye, Jt as List, O as TreePalm, Or as ChevronLeft, Rn as FileSpreadsheet, S as Upload, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Ur as CalendarDays, V as SquarePen, er as Download, ft as Printer, ht as Plus, jn as Funnel, k as Trash2, lt as RefreshCw, or as Copy, pi as Archive, pr as Clock, qr as Building2, qt as LoaderCircle, xn as Globe } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { t as attendanceApi } from "./attendanceApi-CqMkuZD6.mjs";
import { t as MONTH_NAMES$1 } from "./dates-BeKhMkn9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HolidaysPage-l8kECy2c.js
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
function EmployeeHolidaysView({ branch }) {
	const [holidays, setHolidays] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedYear, setSelectedYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth() + 1);
	const [regionFilter, setRegionFilter] = (0, import_react.useState)("all");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("year");
	const [selectedHoliday, setSelectedHoliday] = (0, import_react.useState)(null);
	const [detailsOpen, setDetailsOpen] = (0, import_react.useState)(false);
	const loadHolidays = async (showNotice = false) => {
		setLoading(true);
		setError(null);
		try {
			setHolidays(await attendanceApi.getHolidays({
				year: selectedYear,
				branch: regionFilter !== "all" ? regionFilter : branch || void 0
			}));
			if (showNotice) toast.success("Holidays updated from server");
		} catch (err) {
			console.error("Failed to load holidays:", err);
			const msg = err?.message || "Unable to load your schedule. Please try again.";
			setError(msg);
			if (showNotice) toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadHolidays();
	}, [selectedYear, regionFilter]);
	const availableRegions = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		if (branch && branch.trim()) set.add(branch.trim());
		holidays.forEach((h) => {
			if (h.office && h.office !== "All Offices" && h.office !== "all") set.add(h.office);
			if (h.state && h.state !== "All States") set.add(h.state);
		});
		return Array.from(set).sort();
	}, [holidays, branch]);
	const normalizeHolidayType = (rawType) => {
		const t = (rawType || "").toLowerCase();
		if (t.includes("nation") || t.includes("public")) return "National Holiday";
		if (t.includes("reg")) return "Regional Holiday";
		if (t.includes("opt")) return "Optional Holiday";
		return "Company Holiday";
	};
	const getHolidayTypeBadge = (rawType) => {
		switch (normalizeHolidayType(rawType)) {
			case "National Holiday": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-blue-500/15 text-blue-400 border-blue-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3" }), " National Holiday"]
			});
			case "Regional Holiday": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), " Regional Holiday"]
			});
			case "Optional Holiday": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3" }), " Optional Holiday"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 gap-1 font-medium text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), " Company Holiday"]
			});
		}
	};
	const filteredHolidays = (0, import_react.useMemo)(() => {
		return holidays.filter((h) => {
			if (search.trim()) {
				const q = search.toLowerCase();
				const matchName = h.name.toLowerCase().includes(q);
				const matchDesc = h.description.toLowerCase().includes(q);
				if (!matchName && !matchDesc) return false;
			}
			if (regionFilter !== "all") {
				const rLower = regionFilter.toLowerCase();
				const matchOffice = h.office?.toLowerCase().includes(rLower);
				const matchState = h.state?.toLowerCase().includes(rLower);
				const isGlobal = !h.office || h.office === "All Offices" || h.applyToAll;
				if (!matchOffice && !matchState && !isGlobal) return false;
			}
			if (typeFilter !== "all") {
				if (normalizeHolidayType(h.type).toLowerCase() !== typeFilter.toLowerCase()) return false;
			}
			return true;
		});
	}, [
		holidays,
		search,
		regionFilter,
		typeFilter
	]);
	const upcomingHolidays = (0, import_react.useMemo)(() => {
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		return filteredHolidays.filter((h) => h.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
	}, [filteredHolidays]);
	const holidaysByMonth = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (let m = 1; m <= 12; m++) map.set(m, []);
		filteredHolidays.forEach((h) => {
			const parts = h.date.split("-");
			const m = parseInt(parts[1], 10);
			if (map.has(m)) map.get(m).push(h);
		});
		for (let m = 1; m <= 12; m++) map.get(m).sort((a, b) => a.date.localeCompare(b.date));
		return map;
	}, [filteredHolidays]);
	const monthCalendarCells = (0, import_react.useMemo)(() => {
		let startDayIndex = new Date(selectedYear, selectedMonth - 1, 1).getDay() - 1;
		if (startDayIndex === -1) startDayIndex = 6;
		const daysCount = new Date(selectedYear, selectedMonth, 0).getDate();
		const cells = [];
		for (let i = 0; i < startDayIndex; i++) cells.push(null);
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		for (let d = 1; d <= daysCount; d++) {
			const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
			const matching = filteredHolidays.filter((h) => h.date === dateStr);
			cells.push({
				dayNum: d,
				dateStr,
				isToday: dateStr === todayStr,
				holidays: matching
			});
		}
		return cells;
	}, [
		selectedYear,
		selectedMonth,
		filteredHolidays
	]);
	const getWeekdayName = (dateStr) => {
		const [y, m, d] = dateStr.split("-").map(Number);
		return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long" });
	};
	const formatDisplayDate = (dateStr) => {
		const [y, m, d] = dateStr.split("-").map(Number);
		return new Date(y, m - 1, d).toLocaleDateString("en-US", {
			day: "2-digit",
			month: "long",
			year: "numeric"
		});
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-semibold text-foreground",
			children: "Loading holidays..."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-1",
			children: "Retrieving company and regional holiday calendar from backend database."
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
				onClick: () => loadHolidays(true),
				className: "mt-5 gap-2 border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Retry"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight font-display text-foreground",
						children: "Holidays"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs border-border bg-card/40",
						children: [selectedYear, " Official Calendar"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Applicable public, national, and company holiday schedule for your work location."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						onClick: () => loadHolidays(true),
						className: "h-9 w-9 border-border bg-card/60 hover:bg-accent/60",
						title: "Refresh holidays",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 text-muted-foreground" })
					})
				})]
			}),
			upcomingHolidays.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-sm font-semibold uppercase tracking-wider text-foreground",
							children: "Upcoming Holidays"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Next scheduled days off"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
					children: upcomingHolidays.map((h) => {
						const weekday = getWeekdayName(h.date);
						const displayDate = formatDisplayDate(h.date);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								setSelectedHoliday(h);
								setDetailsOpen(true);
							},
							className: "rounded-xl border border-border/70 bg-card p-4 hover:border-amber-500/40 hover:bg-accent/40 transition-all cursor-pointer flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-amber-400 uppercase tracking-wider",
										children: weekday
									}), getHolidayTypeBadge(h.type)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-sm text-foreground mt-2 line-clamp-1",
									title: h.name,
									children: h.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: displayDate
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), h.office && h.office !== "All Offices" ? h.office : "Company-wide"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-indigo-400 font-medium",
									children: "Details"
								})]
							})]
						}, h.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[200px] flex-1 sm:flex-initial",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search holiday name...",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "h-9 pl-8 text-xs border-border bg-background"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									onClick: () => setSelectedYear((y) => y - 1),
									className: "h-9 w-9 border-border bg-background",
									title: "Previous year",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold px-2 py-1.5 rounded-md border border-border bg-background",
									children: selectedYear
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									onClick: () => setSelectedYear((y) => y + 1),
									className: "h-9 w-9 border-border bg-background",
									title: "Next year",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
								})
							]
						}),
						availableRegions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: regionFilter,
							onChange: (e) => setRegionFilter(e.target.value),
							className: "h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Regions / Global"
							}), availableRegions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r,
								children: r
							}, r))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: typeFilter,
							onChange: (e) => setTypeFilter(e.target.value),
							className: "h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Holiday Types"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "National Holiday",
									children: "National Holiday"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Company Holiday",
									children: "Company Holiday"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Regional Holiday",
									children: "Regional Holiday"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Optional Holiday",
									children: "Optional Holiday"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center border border-border rounded-xl p-1 bg-muted/40 self-start lg:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: viewMode === "year" ? "default" : "ghost",
						size: "sm",
						onClick: () => setViewMode("year"),
						className: `h-7 px-3 text-xs gap-1.5 ${viewMode === "year" ? "bg-amber-600 text-white shadow-xs" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }), " Year View"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: viewMode === "month" ? "default" : "ghost",
						size: "sm",
						onClick: () => setViewMode("month"),
						className: `h-7 px-3 text-xs gap-1.5 ${viewMode === "month" ? "bg-amber-600 text-white shadow-xs" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), " Month View"]
					})]
				})]
			}),
			filteredHolidays.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center flex flex-col items-center justify-center min-h-[350px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl bg-muted/40 p-4 mb-4 border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: "h-8 w-8 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-foreground",
						children: "No Holidays Available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed",
						children: "There are no holidays configured for the selected calendar year or location filter."
					})
				]
			}),
			filteredHolidays.length > 0 && viewMode === "year" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5",
				children: MONTH_NAMES.map((monthName, idx) => {
					const m = idx + 1;
					const monthHolidays = holidaysByMonth.get(m) || [];
					if (monthHolidays.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display font-bold text-base text-foreground",
								children: monthName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-[11px] border-border",
								children: [
									monthHolidays.length,
									" ",
									monthHolidays.length === 1 ? "Holiday" : "Holidays"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-3 flex-1",
							children: monthHolidays.map((h) => {
								const weekday = getWeekdayName(h.date);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => {
										setSelectedHoliday(h);
										setDetailsOpen(true);
									},
									className: "rounded-xl p-3 border border-border/60 bg-muted/15 hover:border-amber-500/40 hover:bg-muted/30 transition-all cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-foreground",
											children: h.name
										}), getHolidayTypeBadge(h.type)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 font-medium text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 text-muted-foreground" }),
												h.date.split("-")[2],
												" ",
												monthName.slice(0, 3),
												" (",
												weekday,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px]",
											children: h.office && h.office !== "All Offices" ? h.office : "Company-wide"
										})]
									})]
								}, h.id);
							})
						})]
					}, monthName);
				})
			}),
			filteredHolidays.length > 0 && viewMode === "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl border border-border bg-card/60 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								if (selectedMonth === 1) {
									setSelectedMonth(12);
									setSelectedYear((y) => y - 1);
								} else setSelectedMonth((m) => m - 1);
							},
							className: "h-8 gap-1 text-xs border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), " Previous"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display font-bold text-base text-foreground",
							children: [
								MONTH_NAMES[selectedMonth - 1],
								" ",
								selectedYear
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								if (selectedMonth === 12) {
									setSelectedMonth(1);
									setSelectedYear((y) => y + 1);
								} else setSelectedMonth((m) => m + 1);
							},
							className: "h-8 gap-1 text-xs border-border",
							children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm p-5 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-2 mb-2 text-center",
						children: WEEK_DAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-muted-foreground py-1 uppercase tracking-wider",
							children: day
						}, day))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-2",
						children: monthCalendarCells.map((cell, idx) => {
							if (!cell) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[100px] rounded-xl border border-transparent bg-muted/5 p-2 opacity-30 pointer-events-none" }, `month-blank-${idx}`);
							const hasHols = cell.holidays.length > 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `min-h-[100px] rounded-xl p-2 border transition-all flex flex-col justify-between ${cell.isToday ? "border-amber-500 bg-amber-500/10 shadow-xs" : hasHols ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500 hover:bg-amber-500/10 cursor-pointer" : "border-border/40 bg-card/40"}`,
								onClick: () => {
									if (hasHols) {
										setSelectedHoliday(cell.holidays[0]);
										setDetailsOpen(true);
									}
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-xs font-bold ${cell.isToday ? "rounded-full bg-amber-500 text-white h-5 w-5 flex items-center justify-center text-[10px]" : "text-foreground"}`,
											children: cell.dayNum
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "my-1 space-y-1",
										children: cell.holidays.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-md bg-amber-500/20 border border-amber-500/30 px-1.5 py-1 text-[10px] font-semibold text-amber-300 truncate",
											title: `${h.name} (${normalizeHolidayType(h.type)})`,
											children: h.name
										}, h.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] text-muted-foreground",
										children: hasHols ? `${cell.holidays.length} Off` : ""
									})
								]
							}, cell.dateStr);
						})
					})]
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
								children: "Holiday Details"
							}), selectedHoliday && getHolidayTypeBadge(selectedHoliday.type)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Official company holiday schedule specification."
						})] }),
						selectedHoliday && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Holiday Name:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm text-foreground",
											children: selectedHoliday.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Date:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [
												formatDisplayDate(selectedHoliday.date),
												" (",
												getWeekdayName(selectedHoliday.date),
												")"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Category / Classification:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: normalizeHolidayType(selectedHoliday.type)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Applicable Region:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selectedHoliday.office && selectedHoliday.office !== "All Offices" ? selectedHoliday.office : "Company-wide / All Branches"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Recurring Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: selectedHoliday.recurring ? "Annual Recurring Holiday" : "One-Time Holiday"
										})]
									})
								]
							}), selectedHoliday.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground block mb-0.5",
									children: "Description:"
								}), selectedHoliday.description]
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
			})
		]
	});
}
var PRESET_COLORS = [
	{
		value: "#3B82F6",
		label: "Blue (Public)"
	},
	{
		value: "#10B981",
		label: "Green (Company)"
	},
	{
		value: "#F59E0B",
		label: "Amber (Regional)"
	},
	{
		value: "#8B5CF6",
		label: "Purple (Optional)"
	},
	{
		value: "#EC4899",
		label: "Pink"
	},
	{
		value: "#EF4444",
		label: "Red"
	}
];
function fmtShortDate(dateStr) {
	const [year, month, day] = dateStr.split("-").map(Number);
	return new Date(year, month - 1, day).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
}
function fmtWeekday(dateStr) {
	const [year, month, day] = dateStr.split("-").map(Number);
	return new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "long" });
}
function HolidaysPage() {
	const ws = useAurix();
	const router = useRouterState();
	const pathname = router.location.pathname;
	const viewParam = router.location.search?.view;
	const isEmployee = useCurrentRole() === "employee" || viewParam === "my" || pathname.startsWith("/dashboard/employee");
	const [holidays, setHolidays] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [viewMode, setViewMode] = (0, import_react.useState)("calendar");
	const [search, setSearch] = (0, import_react.useState)("");
	const [countryFilter, setCountryFilter] = (0, import_react.useState)("all");
	const [stateFilter, setStateFilter] = (0, import_react.useState)("all");
	const [officeFilter, setOfficeFilter] = (0, import_react.useState)("all");
	const [departmentFilter, setDepartmentFilter] = (0, import_react.useState)("all");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [yearFilter, setYearFilter] = (0, import_react.useState)("2026");
	const [selectedHoliday, setSelectedHoliday] = (0, import_react.useState)(null);
	const [isDetailsOpen, setIsDetailsOpen] = (0, import_react.useState)(false);
	const [isAddModalOpen, setIsAddModalOpen] = (0, import_react.useState)(false);
	const [modalMode, setModalMode] = (0, import_react.useState)("add");
	const [editingHolidayId, setEditingHolidayId] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formDescription, setFormDescription] = (0, import_react.useState)("");
	const [formDate, setFormDate] = (0, import_react.useState)("2026-06-25");
	const [formCountry, setFormCountry] = (0, import_react.useState)("USA");
	const [formState, setFormState] = (0, import_react.useState)("All States");
	const [formOffice, setFormOffice] = (0, import_react.useState)("All Offices");
	const [formDepartment, setFormDepartment] = (0, import_react.useState)("All Departments");
	const [formType, setFormType] = (0, import_react.useState)("Public");
	const [formColor, setFormColor] = (0, import_react.useState)("#3B82F6");
	const [formRecurring, setFormRecurring] = (0, import_react.useState)(false);
	const [formEveryYear, setFormEveryYear] = (0, import_react.useState)(true);
	const [formApplyToAll, setFormApplyToAll] = (0, import_react.useState)(true);
	const [formNotes, setFormNotes] = (0, import_react.useState)("");
	const [isImportModalOpen, setIsImportModalOpen] = (0, import_react.useState)(false);
	const [importedFile, setImportedFile] = (0, import_react.useState)(null);
	const [importPreviewData, setImportPreviewData] = (0, import_react.useState)([]);
	const fileInputRef = (0, import_react.useRef)(null);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = (0, import_react.useState)(false);
	const [holidayToDelete, setHolidayToDelete] = (0, import_react.useState)(null);
	const [calendarYear, setCalendarYear] = (0, import_react.useState)(2026);
	const [calendarMonth, setCalendarMonth] = (0, import_react.useState)(5);
	const sysYear = 2026;
	const sysMonth = 5;
	const sysDay = 25;
	const loadHolidays = async (showNotice = false) => {
		setLoading(true);
		setError(null);
		try {
			const year = yearFilter !== "all" ? Number(yearFilter) : calendarYear;
			const branch = officeFilter !== "all" ? officeFilter : void 0;
			setHolidays(await attendanceApi.getHolidays({
				year,
				branch
			}));
			if (showNotice) toast.success("Holidays refreshed from backend");
		} catch (err) {
			const msg = err?.message || "Failed to load holidays from server";
			setError(msg);
			if (showNotice) toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isEmployee) loadHolidays();
	}, [
		calendarYear,
		yearFilter,
		isEmployee
	]);
	(0, import_react.useEffect)(() => {
		if (yearFilter !== "all") setCalendarYear(parseInt(yearFilter, 10));
	}, [yearFilter]);
	const filteredHolidays = (0, import_react.useMemo)(() => {
		return holidays.filter((h) => {
			if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.description.toLowerCase().includes(search.toLowerCase())) return false;
			if (countryFilter !== "all" && h.country !== "Global" && h.country.toLowerCase() !== countryFilter.toLowerCase()) return false;
			if (stateFilter !== "all" && h.state !== "All States" && h.state.toLowerCase() !== stateFilter.toLowerCase()) return false;
			if (officeFilter !== "all" && h.office !== "All Offices" && h.office.toLowerCase() !== officeFilter.toLowerCase()) return false;
			if (departmentFilter !== "all" && h.department !== "All Departments" && h.department.toLowerCase() !== departmentFilter.toLowerCase()) return false;
			if (typeFilter !== "all" && h.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
			if (yearFilter !== "all") {
				if (h.date.split("-")[0] !== yearFilter) return false;
			}
			return true;
		});
	}, [
		holidays,
		search,
		countryFilter,
		stateFilter,
		officeFilter,
		departmentFilter,
		typeFilter,
		yearFilter
	]);
	const stats = (0, import_react.useMemo)(() => {
		const active = holidays.filter((h) => h.status === "Active");
		const upcoming = active.filter((h) => {
			const [y, m, d] = h.date.split("-").map(Number);
			if (y > sysYear) return true;
			if (y === sysYear && m - 1 > sysMonth) return true;
			if (y === sysYear && m - 1 === sysMonth && d >= sysDay) return true;
			return false;
		});
		const publicH = active.filter((h) => h.type === "Public");
		const companyH = active.filter((h) => h.type === "Company");
		const optionalH = active.filter((h) => h.type === "Optional");
		return {
			total: active.length,
			upcoming: upcoming.length,
			public: publicH.length,
			company: companyH.length,
			optional: optionalH.length
		};
	}, [holidays]);
	const timelineHolidays = (0, import_react.useMemo)(() => {
		const upcoming = holidays.filter((h) => h.status === "Active").filter((h) => {
			const [y, m, d] = h.date.split("-").map(Number);
			if (y > sysYear) return true;
			if (y === sysYear && m - 1 > sysMonth) return true;
			if (y === sysYear && m - 1 === sysMonth && d >= sysDay) return true;
			return false;
		});
		upcoming.sort((a, b) => a.date.localeCompare(b.date));
		const todayList = [];
		const tomorrowList = [];
		const nextWeekList = [];
		const nextMonthList = [];
		const laterList = [];
		upcoming.forEach((h) => {
			const [hY, hM, hD] = h.date.split("-").map(Number);
			const hDate = new Date(hY, hM - 1, hD);
			const sysDate = new Date(sysYear, sysMonth, sysDay);
			const diffDays = Math.ceil((hDate.getTime() - sysDate.getTime()) / (1e3 * 60 * 60 * 24));
			if (diffDays === 0) todayList.push(h);
			else if (diffDays === 1) tomorrowList.push(h);
			else if (diffDays <= 7) nextWeekList.push(h);
			else if (diffDays <= 30) nextMonthList.push(h);
			else laterList.push(h);
		});
		return {
			today: todayList,
			tomorrow: tomorrowList,
			nextWeek: nextWeekList,
			nextMonth: nextMonthList,
			later: laterList
		};
	}, [holidays]);
	const categoryCounts = (0, import_react.useMemo)(() => {
		const active = holidays.filter((h) => h.status === "Active");
		return {
			Public: active.filter((h) => h.type === "Public").length,
			Company: active.filter((h) => h.type === "Company").length,
			Regional: active.filter((h) => h.type === "Regional").length,
			Optional: active.filter((h) => h.type === "Optional").length
		};
	}, [holidays]);
	const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
	const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
	const calendarCells = (0, import_react.useMemo)(() => {
		const totalDays = getDaysInMonth(calendarYear, calendarMonth);
		const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
		const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
		const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
		const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
		const prevCells = [];
		for (let i = firstDay - 1; i >= 0; i--) prevCells.push({
			day: prevMonthDays - i,
			month: prevMonth,
			year: prevYear,
			isPadding: true
		});
		const currentCells = [];
		for (let i = 1; i <= totalDays; i++) currentCells.push({
			day: i,
			month: calendarMonth,
			year: calendarYear,
			isPadding: false
		});
		const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
		const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
		const nextCellsCount = 42 - prevCells.length - currentCells.length;
		const nextCells = [];
		for (let i = 1; i <= nextCellsCount; i++) nextCells.push({
			day: i,
			month: nextMonth,
			year: nextYear,
			isPadding: true
		});
		return [
			...prevCells,
			...currentCells,
			...nextCells
		];
	}, [calendarYear, calendarMonth]);
	if (isEmployee) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeHolidaysView, { branch: ws.company?.city || void 0 });
	const resetFilters = () => {
		setSearch("");
		setCountryFilter("all");
		setStateFilter("all");
		setOfficeFilter("all");
		setDepartmentFilter("all");
		setTypeFilter("all");
		setYearFilter("2026");
		toast.success("Filters reset successfully");
	};
	const handlePrevMonth = () => {
		if (calendarMonth === 0) {
			setCalendarMonth(11);
			setCalendarYear((y) => y - 1);
		} else setCalendarMonth((m) => m - 1);
	};
	const handleNextMonth = () => {
		if (calendarMonth === 11) {
			setCalendarMonth(0);
			setCalendarYear((y) => y + 1);
		} else setCalendarMonth((m) => m + 1);
	};
	const isSameDay = (dateStr, cellYear, cellMonth, cellDay) => {
		const [hYear, hMonth, hDay] = dateStr.split("-").map(Number);
		return hYear === cellYear && hMonth - 1 === cellMonth && hDay === cellDay;
	};
	const openHolidayDetails = (holiday) => {
		setSelectedHoliday(holiday);
		setIsDetailsOpen(true);
	};
	const openAddModal = (mode, holiday) => {
		setModalMode(mode);
		if (mode === "add") {
			setEditingHolidayId(null);
			setFormName("");
			setFormDescription("");
			setFormDate("2026-06-25");
			setFormCountry("USA");
			setFormState("All States");
			setFormOffice("All Offices");
			setFormDepartment("All Departments");
			setFormType("Public");
			setFormColor("#3B82F6");
			setFormRecurring(false);
			setFormEveryYear(true);
			setFormApplyToAll(true);
			setFormNotes("");
		} else if (holiday) {
			setEditingHolidayId(holiday.id);
			setFormName(holiday.name);
			setFormDescription(holiday.description);
			setFormDate(holiday.date);
			setFormCountry(holiday.country);
			setFormState(holiday.state);
			setFormOffice(holiday.office);
			setFormDepartment(holiday.department);
			setFormType(holiday.type);
			setFormColor(holiday.color || "#3B82F6");
			setFormRecurring(holiday.recurring);
			setFormEveryYear(holiday.everyYear);
			setFormApplyToAll(holiday.applyToAll);
			setFormNotes(holiday.notes || "");
		}
		setIsAddModalOpen(true);
	};
	const handleSaveHoliday = async (e) => {
		e.preventDefault();
		if (!formName.trim()) {
			toast.error("Holiday name is required");
			return;
		}
		if (!formDate) {
			toast.error("Holiday date is required");
			return;
		}
		try {
			if (modalMode === "add" || modalMode === "duplicate") {
				const created = await attendanceApi.createHoliday({
					name: formName,
					description: formDescription,
					date: formDate,
					type: formType,
					country: formCountry,
					state: formState,
					office: formOffice,
					department: formDepartment,
					color: formColor,
					recurring: formRecurring,
					everyYear: formEveryYear,
					applyToAll: formApplyToAll,
					notes: formNotes
				});
				setHolidays((prev) => [created, ...prev]);
				toast.success(`Holiday "${formName}" created successfully on backend`);
			} else if (modalMode === "edit" && editingHolidayId) {
				const updated = await attendanceApi.updateHoliday(editingHolidayId, {
					name: formName,
					description: formDescription,
					date: formDate,
					type: formType,
					country: formCountry,
					state: formState,
					office: formOffice,
					department: formDepartment,
					color: formColor,
					recurring: formRecurring,
					everyYear: formEveryYear,
					applyToAll: formApplyToAll,
					notes: formNotes
				});
				setHolidays((prev) => prev.map((h) => h.id === editingHolidayId ? updated : h));
				toast.success(`Holiday "${formName}" updated successfully on backend`);
			}
			setIsAddModalOpen(false);
		} catch (err) {
			toast.error(err?.message || "Failed to save holiday to backend");
		}
	};
	const triggerDeleteHoliday = (holiday) => {
		setHolidayToDelete(holiday);
		setIsDeleteConfirmOpen(true);
	};
	const confirmDeleteHoliday = async () => {
		if (!holidayToDelete) return;
		try {
			await attendanceApi.deleteHoliday(holidayToDelete.id);
			setHolidays((prev) => prev.filter((h) => h.id !== holidayToDelete.id));
			setIsDeleteConfirmOpen(false);
			setIsDetailsOpen(false);
			toast.success(`Deleted holiday "${holidayToDelete.name}"`);
		} catch (err) {
			toast.error(err?.message || "Failed to delete holiday on backend");
		}
	};
	const toggleArchiveHoliday = (holiday) => {
		const nextStatus = holiday.status === "Active" ? "Archived" : "Active";
		setHolidays((prev) => prev.map((h) => h.id === holiday.id ? {
			...h,
			status: nextStatus
		} : h));
		toast.success(`Holiday "${holiday.name}" has been ${nextStatus === "Archived" ? "archived" : "unarchived"}`);
		setIsDetailsOpen(false);
	};
	const exportHolidaysCSV = () => {
		const csvContent = "data:text/csv;charset=utf-8,ID,Name,Date,Type,Country,Region/State,Office,Department,Status,CreatedBy,CreatedDate\n" + filteredHolidays.map((h) => `"${h.id}","${h.name}","${h.date}","${h.type}","${h.country}","${h.state}","${h.office}","${h.department}","${h.status}","${h.createdBy}","${h.createdDate}"`).join("\n");
		const link = document.createElement("a");
		link.setAttribute("href", encodeURI(csvContent));
		link.setAttribute("download", `ofc360_holidays_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("CSV export started successfully!");
	};
	const handleDragOver = (e) => e.preventDefault();
	const handleDrop = (e) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) processImportedFile(e.dataTransfer.files[0]);
	};
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) processImportedFile(e.target.files[0]);
	};
	const processImportedFile = (file) => {
		setImportedFile(file);
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const content = e.target?.result;
				if (!content || !content.trim()) {
					setImportPreviewData([]);
					toast.error("The selected file is empty");
					return;
				}
				if (file.name.endsWith(".json")) {
					const parsed = JSON.parse(content);
					if (Array.isArray(parsed)) {
						setImportPreviewData(parsed);
						toast.success(`Loaded ${parsed.length} holidays for preview`);
						return;
					}
				}
				const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
				if (lines.length <= 1) {
					setImportPreviewData([]);
					toast.error("CSV file contains no data rows");
					return;
				}
				const parseLine = (line) => {
					const result = [];
					let current = "";
					let inQuotes = false;
					for (let i = 0; i < line.length; i++) {
						const char = line[i];
						if (char === "\"") inQuotes = !inQuotes;
						else if (char === "," && !inQuotes) {
							result.push(current.trim());
							current = "";
						} else current += char;
					}
					result.push(current.trim());
					return result.map((s) => s.replace(/^"|"$/g, "").trim());
				};
				const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
				const rows = lines.slice(1).map((line) => {
					const cols = parseLine(line);
					const getCol = (names, fallback = "") => {
						for (const name of names) {
							const idx = headers.indexOf(name.toLowerCase());
							if (idx !== -1 && cols[idx] !== void 0) return cols[idx];
						}
						return fallback;
					};
					return {
						name: getCol([
							"name",
							"holiday",
							"holiday_name",
							"title"
						], cols[0] || "Holiday"),
						date: getCol([
							"date",
							"holiday_date",
							"day"
						], cols[1] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]),
						type: getCol([
							"type",
							"holiday_type",
							"category"
						], cols[2] || "Public"),
						country: getCol(["country"], cols[3] || "All"),
						state: getCol(["state", "region"], cols[4] || "All States"),
						office: getCol(["office", "location"], cols[5] || "All Offices"),
						department: getCol(["department", "dept"], cols[6] || "All Departments"),
						description: getCol([
							"description",
							"desc",
							"notes"
						], cols[7] || "")
					};
				}).filter((r) => r.name);
				setImportPreviewData(rows);
				toast.success(`Parsed ${rows.length} holidays from ${file.name}`);
			} catch {
				toast.error("Failed to parse file for preview");
				setImportPreviewData([]);
			}
		};
		reader.onerror = () => {
			toast.error("Failed to read file");
			setImportPreviewData([]);
		};
		reader.readAsText(file);
	};
	const handleConfirmImport = async () => {
		if (importPreviewData.length === 0 && !importedFile) {
			toast.error("No data available to import");
			return;
		}
		try {
			if (importedFile) {
				const res = await attendanceApi.importHolidays(importedFile);
				toast.success(`Imported ${res.importedCount} holidays to backend`);
			} else {
				const payloads = importPreviewData.map((row) => ({
					name: row.name,
					description: row.description,
					date: row.date,
					type: row.type,
					country: row.country,
					state: row.state,
					office: row.office,
					department: row.department,
					color: row.type === "Public" ? "#3B82F6" : row.type === "Company" ? "#10B981" : "#F59E0B",
					recurring: true,
					everyYear: true,
					applyToAll: true
				}));
				const res = await attendanceApi.importHolidays(payloads);
				toast.success(`Imported ${res.importedCount} holidays to backend`);
			}
			await loadHolidays();
			setIsImportModalOpen(false);
			setImportedFile(null);
			setImportPreviewData([]);
		} catch (err) {
			toast.error(err?.message || "Failed to import holidays to backend");
		}
	};
	const highlightText = (text, searchStr) => {
		if (!searchStr) return text;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.split(new RegExp(`(${searchStr})`, "gi")).map((part, i) => part.toLowerCase() === searchStr.toLowerCase() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: "bg-amber-500/35 text-amber-200 px-0.5 rounded",
			children: part
		}, i) : part) });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				showBack: true,
				backText: "Back",
				title: "Holidays",
				description: "Manage public, regional, and company holidays.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setIsImportModalOpen(true),
							className: "h-9 border-border bg-card/40 text-xs hover:bg-accent/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-3.5 w-3.5" }), " Import Holidays"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: exportHolidaysCSV,
							className: "h-9 border-border bg-card/40 text-xs hover:bg-accent/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-3.5 w-3.5" }), " Export CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => openAddModal("add"),
							className: "h-9 bg-primary text-xs text-primary-foreground shadow-glow hover:bg-primary/95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), " Add Holiday"]
						})
					]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Backend Calendar Notice:"
						}),
						" ",
						error
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => loadHolidays(true),
					className: "h-7 text-xs border-destructive/40 hover:bg-destructive/15",
					children: "Retry"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5",
				children: [
					{
						label: "Total Holidays",
						value: stats.total,
						trend: "All active",
						icon: TreePalm,
						color: "text-blue-500 bg-blue-500/10"
					},
					{
						label: "Upcoming",
						value: stats.upcoming,
						trend: "Next 12 months",
						icon: CalendarDays,
						color: "text-indigo-500 bg-indigo-500/10"
					},
					{
						label: "Public Holidays",
						value: stats.public,
						trend: "National / Federal",
						icon: Globe,
						color: "text-emerald-500 bg-emerald-500/10"
					},
					{
						label: "Company Holidays",
						value: stats.company,
						trend: "Internal paid",
						icon: Building2,
						color: "text-purple-500 bg-purple-500/10"
					},
					{
						label: "Optional / Floating",
						value: stats.optional,
						trend: "Discretionary",
						icon: Sparkles,
						color: "text-amber-500 bg-amber-500/10"
					}
				].map((c, i) => {
					const IconComponent = c.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/75 hover:shadow-elegant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: c.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `rounded-lg p-1.5 ${c.color}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl font-bold tracking-tight text-foreground",
									children: c.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors",
								children: c.trend
							})
						]
					}, i);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl",
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
									placeholder: "Search holiday name/info…",
									className: "h-9 pl-9 border-border text-xs focus:ring-1 focus:ring-ring focus:border-border"
								})]
							}),
							[
								{
									icon: Funnel,
									label: "Country",
									value: countryFilter,
									set: setCountryFilter,
									opts: [
										["all", "All Countries"],
										["usa", "USA"],
										["india", "India"],
										["global", "Global"]
									]
								},
								{
									icon: MapPin,
									label: "State",
									value: stateFilter,
									set: setStateFilter,
									opts: [
										["all", "All States"],
										["delhi", "Delhi"],
										["california", "California"],
										["karnataka", "Karnataka"]
									]
								},
								{
									icon: Building2,
									label: "Office",
									value: officeFilter,
									set: setOfficeFilter,
									opts: [
										["all", "All Offices"],
										["san francisco hq", "San Francisco HQ"],
										["bengaluru tech park", "Bengaluru Tech Park"]
									]
								}
							].map(({ icon: Icon, label, value, set, opts }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [label, ":"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value,
										onChange: (e) => set(e.target.value),
										className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
										children: opts.map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: v,
											className: "bg-background",
											children: l
										}, v))
									})
								]
							}, label)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: typeFilter,
									onChange: (e) => setTypeFilter(e.target.value),
									className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Types"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "public",
											className: "bg-background",
											children: "Public"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "company",
											className: "bg-background",
											children: "Company"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "regional",
											className: "bg-background",
											children: "Regional"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "optional",
											className: "bg-background",
											children: "Optional"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Year:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: yearFilter,
									onChange: (e) => setYearFilter(e.target.value),
									className: "bg-transparent font-medium text-foreground outline-none cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											className: "bg-background",
											children: "All Years"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2026",
											className: "bg-background",
											children: "2026"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2025",
											className: "bg-background",
											children: "2025"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: resetFilters,
								className: "h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 h-3 w-3" }), " Reset Filters"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex border border-border rounded-lg bg-card/80 p-0.5 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("calendar"),
							className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "calendar" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
							"aria-label": "Calendar view",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), " Calendar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("list"),
							className: `inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
							"aria-label": "List view",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" }), " List View"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-3 space-y-6",
					children: filteredHolidays.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground/80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: "h-6 w-6 animate-pulse" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold tracking-tight",
								children: "No holidays found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
								children: "No holidays match your current filter settings."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: resetFilters,
									className: "h-9 text-xs border border-border bg-card/60",
									variant: "outline",
									children: "Clear Filters"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => openAddModal("add"),
									className: "h-9 text-xs bg-primary text-primary-foreground shadow-glow hover:bg-primary/95",
									children: "Create First Holiday"
								})]
							})
						]
					}) : viewMode === "calendar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border px-5 py-4 bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-display text-base font-semibold tracking-tight text-foreground",
										children: [
											MONTH_NAMES$1[calendarMonth],
											" ",
											calendarYear
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[10px] py-0.5 px-2 text-muted-foreground border-border",
										children: [filteredHolidays.length, " active in view"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handlePrevMonth,
											className: "rounded-lg border border-border bg-card/50 p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
											"aria-label": "Previous month",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setCalendarMonth(sysMonth);
												setCalendarYear(sysYear);
											},
											className: "rounded-lg border border-border bg-card/50 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
											children: "Today"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handleNextMonth,
											className: "rounded-lg border border-border bg-card/50 p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
											"aria-label": "Next month",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-7 border-b border-border bg-muted/10 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2.5",
								children: [
									"Sun",
									"Mon",
									"Tue",
									"Wed",
									"Thu",
									"Fri",
									"Sat"
								].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: d }, d))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-7 bg-border/5",
								children: calendarCells.map((cell, idx) => {
									const isToday = cell.year === sysYear && cell.month === sysMonth && cell.day === sysDay;
									const isWeekend = new Date(cell.year, cell.month, cell.day).getDay() === 0 || new Date(cell.year, cell.month, cell.day).getDay() === 6;
									const cellHolidays = filteredHolidays.filter((h) => isSameDay(h.date, cell.year, cell.month, cell.day));
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => {
											if (cellHolidays.length > 0) openHolidayDetails(cellHolidays[0]);
											else {
												const monthStr = String(cell.month + 1).padStart(2, "0");
												const dayStr = String(cell.day).padStart(2, "0");
												setFormDate(`${cell.year}-${monthStr}-${dayStr}`);
												openAddModal("add");
											}
										},
										className: `group relative min-h-[92px] border-b border-r border-border p-2 transition-all hover:bg-accent/15 cursor-pointer ${cell.isPadding ? "text-muted-foreground/35" : "text-foreground"} ${isWeekend ? "bg-muted/10" : "bg-card/30"} ${isToday ? "ring-1 ring-inset ring-blue-500/80 bg-blue-500/5" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${isToday ? "bg-blue-600 text-white font-bold shadow-glow" : ""}`,
												children: cell.day
											}), isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-medium tracking-tight text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded",
												children: "Today"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 space-y-1 overflow-hidden",
											children: [
												cellHolidays.slice(0, 2).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													title: h.name,
													onClick: (e) => {
														e.stopPropagation();
														openHolidayDetails(h);
													},
													style: {
														borderLeftColor: h.color || "#3B82F6",
														backgroundColor: `${h.color}15` || "rgba(59,130,246,0.1)",
														color: h.color || "#3B82F6"
													},
													className: "hidden md:block truncate rounded px-1.5 py-0.5 text-[9px] font-semibold border-l-2 leading-normal transition-all hover:scale-[1.02] hover:shadow",
													children: h.name
												}, h.id)),
												cellHolidays.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex justify-center gap-0.5 mt-1.5 md:hidden",
													children: cellHolidays.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "h-1.5 w-1.5 rounded-full",
														style: { backgroundColor: h.color || "#3B82F6" }
													}, h.id))
												}),
												cellHolidays.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "hidden md:block text-[8px] font-semibold text-muted-foreground pl-1.5",
													children: [
														"+ ",
														cellHolidays.length - 2,
														" more"
													]
												})
											]
										})]
									}, idx);
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Holiday Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Day"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Holiday Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Country"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Office Scope"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3",
											children: "Created By"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-5 py-3 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredHolidays.map((h) => {
									const dayName = fmtWeekday(h.date);
									const isArchived = h.status === "Archived";
									const typeBadge = {
										Public: "bg-blue-500/10 text-blue-400 border-blue-500/30",
										Company: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
										Regional: "bg-amber-500/10 text-amber-400 border-amber-500/30",
										Optional: "bg-purple-500/10 text-purple-400 border-purple-500/30"
									}[h.type];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border transition-colors hover:bg-muted/10 group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5 font-medium text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "h-2 w-2 rounded-full shrink-0",
														style: { backgroundColor: h.color || "#3B82F6" }
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-col",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-xs leading-normal",
															children: highlightText(h.name, search)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground line-clamp-1 max-w-[200px] mt-0.5",
															children: highlightText(h.description, search)
														})]
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5 text-xs text-muted-foreground font-mono",
												children: h.date
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5 text-xs text-muted-foreground",
												children: dayName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-[10px] font-semibold py-0.5 px-2 ${typeBadge}`,
													children: h.type
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5 text-xs text-muted-foreground",
												children: h.country
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5 text-xs text-muted-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate max-w-[120px] inline-block",
													title: h.office,
													children: h.office
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: isArchived ? "outline" : "secondary",
													className: `text-[9px] py-0.5 px-1.5 capitalize font-medium ${isArchived ? "text-muted-foreground border-border bg-muted/15" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`,
													children: h.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5 text-xs text-muted-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-4 w-4 rounded-full bg-accent/60 grid place-items-center text-[9px] text-foreground font-semibold",
														children: h.createdBy.charAt(0)
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] truncate max-w-[90px]",
														children: h.createdBy
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-5 py-3.5 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => openHolidayDetails(h),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: "View Details",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => openAddModal("edit", h),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: "Edit",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => openAddModal("duplicate", h),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: "Duplicate",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => toggleArchiveHoliday(h),
															className: "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
															title: isArchived ? "Activate" : "Archive",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => triggerDeleteHoliday(h),
															className: "rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
															title: "Delete",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
														})
													]
												})
											})
										]
									}, h.id);
								}) })]
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground mb-4",
								children: "Quick Actions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: [
									{
										icon: Plus,
										label: "Add Holiday",
										color: "text-blue-500",
										onClick: () => openAddModal("add")
									},
									{
										icon: Upload,
										label: "Import Holidays",
										color: "text-emerald-500",
										onClick: () => setIsImportModalOpen(true)
									},
									{
										icon: Download,
										label: "Export CSV",
										color: "text-purple-500",
										onClick: exportHolidaysCSV
									},
									{
										icon: Printer,
										label: "Print List",
										color: "text-amber-500",
										onClick: () => window.print()
									},
									{
										icon: CircleCheck,
										label: "Sync Calendar",
										color: "text-blue-400",
										onClick: () => {
											navigator.clipboard.writeText(window.location.href);
											toast.success("Calendar link copied to clipboard");
										}
									}
								].map(({ icon: Icon, label, color, onClick }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick,
									className: "w-full h-10 justify-start text-xs border-border bg-card/30 hover:bg-accent gap-2.5 px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${color} shrink-0` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: label
									})]
								}, label))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground mb-4",
								children: "Upcoming Holidays"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [[
									{
										label: "Today",
										list: timelineHolidays.today
									},
									{
										label: "Tomorrow",
										list: timelineHolidays.tomorrow
									},
									{
										label: "Next Week",
										list: timelineHolidays.nextWeek
									},
									{
										label: "Next Month",
										list: timelineHolidays.nextMonth
									},
									{
										label: "Later",
										list: timelineHolidays.later.slice(0, 2)
									}
								].map((timegroup, idx) => {
									if (timegroup.list.length === 0) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
											children: timegroup.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1.5 border-l border-border/80 pl-3 ml-1.5",
											children: timegroup.list.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => openHolidayDetails(h),
												className: "group/item flex items-start justify-between cursor-pointer rounded p-1 hover:bg-muted/15",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: "text-xs font-semibold text-foreground group-hover/item:text-primary transition-colors",
														children: h.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground",
														children: fmtShortDate(h.date)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: "text-[9px] scale-90 px-1 py-0 border-none font-semibold text-white",
													style: { backgroundColor: h.color || "#3B82F6" },
													children: h.type
												})]
											}, h.id))
										})]
									}, idx);
								}), stats.upcoming === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 text-center text-xs text-muted-foreground bg-muted/10 rounded-xl",
									children: "No upcoming holidays."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground mb-4",
								children: "Holiday Categories"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3.5",
								children: [
									{
										label: "Public Holidays",
										desc: "National or federal statutory paid off.",
										count: categoryCounts.Public,
										color: "bg-blue-500"
									},
									{
										label: "Company Holidays",
										desc: "Strategic operations days off by OFC360.",
										count: categoryCounts.Company,
										color: "bg-emerald-500"
									},
									{
										label: "Regional Holidays",
										desc: "State or territory level local festivals.",
										count: categoryCounts.Regional,
										color: "bg-amber-500"
									},
									{
										label: "Optional / Floating",
										desc: "Personal cultural or religious choices.",
										count: categoryCounts.Optional,
										color: "bg-purple-500"
									}
								].map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${cat.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs font-semibold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px] py-0 px-1.5",
												children: cat.count
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground leading-snug",
											children: cat.desc
										})]
									})]
								}, i))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: isDetailsOpen,
				onOpenChange: setIsDetailsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "right",
					className: "w-full border-l border-border bg-card/95 backdrop-blur-xl sm:max-w-md p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
						className: "pb-4 border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] font-semibold text-white px-2 py-0.5 border-none",
									style: { backgroundColor: selectedHoliday?.color || "#3B82F6" },
									children: selectedHoliday?.type
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => selectedHoliday && openAddModal("edit", selectedHoliday),
											className: "rounded p-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-accent",
											title: "Edit Holiday",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => selectedHoliday && openAddModal("duplicate", selectedHoliday),
											className: "rounded p-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-accent",
											title: "Duplicate Holiday",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => selectedHoliday && toggleArchiveHoliday(selectedHoliday),
											className: "rounded p-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-accent",
											title: selectedHoliday?.status === "Active" ? "Archive" : "Unarchive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => selectedHoliday && triggerDeleteHoliday(selectedHoliday),
											className: "rounded p-1.5 border border-destructive/20 text-destructive/80 hover:bg-destructive/10 hover:text-destructive",
											title: "Delete Holiday",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "mt-4 font-display text-xl font-bold tracking-tight text-foreground",
								children: selectedHoliday?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
								className: "mt-1.5 text-xs text-muted-foreground",
								children: selectedHoliday?.description
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-6 space-y-4 text-xs overflow-y-auto max-h-[calc(100vh-220px)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 border-b border-border/80 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase font-bold text-muted-foreground",
									children: "Holiday Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-semibold text-foreground font-mono",
									children: selectedHoliday?.date
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase font-bold text-muted-foreground",
									children: "Day of Week"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-semibold text-foreground",
									children: selectedHoliday?.date ? fmtWeekday(selectedHoliday.date) : "—"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3.5 border-b border-border/80 pb-4",
								children: [
									["Country Scope", selectedHoliday?.country],
									["Region / State", selectedHoliday?.state],
									["Office Location", selectedHoliday?.office],
									["Department", selectedHoliday?.department]
								].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: value
									})]
								}, label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 border-b border-border/80 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Recurring Every Year"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] py-0 px-2",
										children: selectedHoliday?.recurring ? "Yes" : "No"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Apply to All Employees"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] py-0 px-2",
										children: selectedHoliday?.applyToAll ? "Yes" : "No"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 border-b border-border/80 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase font-bold text-muted-foreground",
									children: "Notes & Special Instructions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-normal italic",
									children: selectedHoliday?.notes || "No special notes configured for this holiday."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 text-[10px] text-muted-foreground pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Created By:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground/80 mt-0.5",
									children: selectedHoliday?.createdBy
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last Updated:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground/80 mt-0.5",
									children: selectedHoliday?.updatedDate
								})] })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAddModalOpen,
				onOpenChange: setIsAddModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-semibold tracking-tight text-foreground",
						children: modalMode === "add" ? "Add New Holiday" : modalMode === "edit" ? "Edit Holiday Details" : "Duplicate Holiday"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Configure parameters to define the operational holiday scope."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveHoliday,
						className: "space-y-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Holiday Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formName,
										onChange: (e) => setFormName(e.target.value),
										placeholder: "e.g. Independence Day",
										required: true,
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formDescription,
										onChange: (e) => setFormDescription(e.target.value),
										placeholder: "Briefly state significance of this day off…",
										className: "h-9 text-xs border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Date *"
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
										children: "Holiday Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formType,
										onChange: (e) => setFormType(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Public",
												children: "Public Holiday"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Company",
												children: "Company Holiday"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Regional",
												children: "Regional Holiday"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Optional",
												children: "Optional Holiday"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Country"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formCountry,
										onChange: (e) => setFormCountry(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Global",
												children: "Global / Universal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "USA",
												children: "USA"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "India",
												children: "India"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "UK",
												children: "United Kingdom"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "State / Region"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formState,
										onChange: (e) => setFormState(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All States",
												children: "All States"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "California",
												children: "California"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Delhi",
												children: "Delhi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Karnataka",
												children: "Karnataka"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Office Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formOffice,
										onChange: (e) => setFormOffice(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All Offices",
												children: "All Offices"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "San Francisco HQ",
												children: "San Francisco HQ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Bengaluru Tech Park",
												children: "Bengaluru Tech Park"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Department Scope"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formDepartment,
										onChange: (e) => setFormDepartment(e.target.value),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All Departments",
												children: "All Departments"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Engineering",
												children: "Engineering"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Product",
												children: "Product"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Marketing",
												children: "Marketing"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sales",
												children: "Sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "HR",
												children: "HR & Ops"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Calendar Color Theme"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [PRESET_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setFormColor(c.value),
											style: { backgroundColor: c.value },
											className: `h-6 w-6 rounded-full border transition-all ${formColor === c.value ? "ring-2 ring-white ring-offset-2 scale-110 border-white" : "border-transparent opacity-85 hover:opacity-100"}`,
											title: c.label
										}, c.value)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: formColor,
											onChange: (e) => setFormColor(e.target.value),
											className: "h-6 w-8 rounded bg-transparent border-0 cursor-pointer"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 grid grid-cols-2 gap-3 py-1 bg-muted/10 rounded-xl px-3 border border-border",
									children: [[{
										label: "Recurring Holiday",
										id: "recurring",
										value: formRecurring,
										set: setFormRecurring
									}, {
										label: "Every Year",
										id: "everyYear",
										value: formEveryYear,
										set: setFormEveryYear
									}].map(({ label, id, value, set }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-medium text-foreground cursor-pointer",
											htmlFor: id,
											children: label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											id,
											checked: value,
											onChange: (e) => set(e.target.checked),
											className: "h-3.5 w-3.5 rounded text-primary focus:ring-primary accent-primary"
										})]
									}, id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between col-span-2 border-t border-border pt-2 mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-medium text-foreground cursor-pointer",
											htmlFor: "applyAll",
											children: "Apply to All Employees"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											id: "applyAll",
											checked: formApplyToAll,
											onChange: (e) => setFormApplyToAll(e.target.checked),
											className: "h-3.5 w-3.5 rounded text-primary focus:ring-primary accent-primary"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Special Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: formNotes,
										onChange: (e) => setFormNotes(e.target.value),
										placeholder: "Any operational guidelines…",
										rows: 2,
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-muted-foreground",
										children: "Upload Holiday Icon (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border border-dashed border-border rounded-lg px-3 py-2 bg-muted/5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: "h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground flex-1",
												children: "Upload SVG/PNG icon for custom visual lists"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: "h-6 text-[10px] border-border bg-card",
												onClick: () => toast.info("Custom icon asset uploaded successfully (simulation)"),
												children: "Select file"
											})
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsAddModalOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-muted text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs",
								children: "Save Changes"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isImportModalOpen,
				onOpenChange: setIsImportModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-semibold tracking-tight text-foreground",
						children: "Import Holidays from CSV/Excel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Bulk upload public and custom regional holidays instantly."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onDragOver: handleDragOver,
								onDrop: handleDrop,
								onClick: () => fileInputRef.current?.click(),
								className: "border-2 border-dashed border-border/80 rounded-2xl bg-muted/5 p-8 text-center cursor-pointer hover:bg-muted/15 transition-all flex flex-col items-center justify-center space-y-2 group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										ref: fileInputRef,
										onChange: handleFileChange,
										accept: ".csv,.xlsx,.xls",
										className: "hidden"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-xl bg-muted text-muted-foreground/80 grid place-items-center group-hover:scale-105 transition-transform",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5 text-emerald-500" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: importedFile ? importedFile.name : "Drag & drop CSV/Excel here"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "or click to select file from your system (Max 10MB)"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: "Follow sample layout parameters for clean import."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#",
									onClick: (e) => {
										e.preventDefault();
										toast.success("Sample template downloaded");
									},
									className: "text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-2.5 w-2.5" }), " Download sample template"]
								})]
							}),
							importPreviewData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
									children: [
										"File Data Preview (",
										importPreviewData.length,
										" records found)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-h-[140px] overflow-y-auto rounded-lg border border-border bg-card/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-[11px] border-collapse",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-muted/20 text-muted-foreground border-b border-border sticky top-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-3 py-1.5",
													children: "Name"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-3 py-1.5",
													children: "Date"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-3 py-1.5",
													children: "Type"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-3 py-1.5",
													children: "Scope"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: importPreviewData.map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-border/60 hover:bg-muted/10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-1.5 font-medium text-foreground",
													children: row.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-1.5 font-mono text-muted-foreground",
													children: row.date
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3 py-1.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[9px] px-1.5 py-0.5 rounded bg-muted/60 text-foreground font-semibold",
														children: row.type
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-3 py-1.5 text-muted-foreground",
													children: [
														row.country,
														" - ",
														row.office
													]
												})
											]
										}, idx)) })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => {
										setIsImportModalOpen(false);
										setImportedFile(null);
										setImportPreviewData([]);
									},
									className: "h-9 border-border bg-transparent text-xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									onClick: handleConfirmImport,
									disabled: importPreviewData.length === 0,
									className: "h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs disabled:opacity-50",
									children: [
										"Import ",
										importPreviewData.length,
										" Holidays"
									]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDeleteConfirmOpen,
				onOpenChange: setIsDeleteConfirmOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl",
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
									children: "Delete Holiday Confirmation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
									className: "text-xs text-muted-foreground",
									children: [
										"Are you sure you want to permanently delete the holiday ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-foreground",
											children: [
												"\"",
												holidayToDelete?.name,
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
							children: "This action will remove the holiday from calendar schedules and operation timesheets."
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
								onClick: confirmDeleteHoliday,
								className: "h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs",
								children: "Delete Holiday"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HolidaysPage as default };
