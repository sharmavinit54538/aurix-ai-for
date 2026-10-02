import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, E as TrendingUp, Gr as CalendarCheck, H as Sparkles, J as ShieldAlert, Jr as Briefcase, Ut as LogOut, Vn as FilePenLine, _t as Plane, a as X, b as UserCog, bn as GraduationCap, d as Wallet, er as Download, ht as Plus, oi as Award, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { r as useHrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TimelinePage-B43oDJxS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_META = {
	joining: {
		icon: UserCheck,
		tone: "primary",
		label: "Joining & Onboarding",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	promotion: {
		icon: TrendingUp,
		tone: "primary",
		label: "Promotion & Rank",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	"department-change": {
		icon: UserCog,
		tone: "primary",
		label: "Department Transfer",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	"salary-revision": {
		icon: Wallet,
		tone: "primary",
		label: "Salary & Compensation",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	attendance: {
		icon: CalendarCheck,
		tone: "primary",
		label: "Attendance & Shift",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	leave: {
		icon: Plane,
		tone: "muted",
		label: "Leave & Sabbatical",
		gradient: "",
		bg: "bg-muted text-muted-foreground border-border"
	},
	performance: {
		icon: Sparkles,
		tone: "primary",
		label: "Performance Review",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	training: {
		icon: GraduationCap,
		tone: "muted",
		label: "Training & Upskilling",
		gradient: "",
		bg: "bg-muted text-foreground border-border"
	},
	certification: {
		icon: FilePenLine,
		tone: "primary",
		label: "Certification",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	award: {
		icon: Award,
		tone: "primary",
		label: "Award & Recognition",
		gradient: "",
		bg: "bg-primary/10 text-primary border-primary/20"
	},
	warning: {
		icon: ShieldAlert,
		tone: "destructive",
		label: "Compliance & Warning",
		gradient: "",
		bg: "bg-destructive/10 text-destructive border-destructive/20"
	},
	project: {
		icon: Briefcase,
		tone: "muted",
		label: "Project Assignment",
		gradient: "",
		bg: "bg-muted text-foreground border-border"
	},
	exit: {
		icon: LogOut,
		tone: "destructive",
		label: "Exit & Offboarding",
		gradient: "",
		bg: "bg-destructive/10 text-destructive border-destructive/20"
	}
};
var ALL_KINDS = Object.keys(KIND_META);
function TimelinePage() {
	useHrms((s) => s.timeline);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedEmployee, setSelectedEmployee] = (0, import_react.useState)("all");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [dateRange, setDateRange] = (0, import_react.useState)("all");
	const [addModalOpen, setAddModalOpen] = (0, import_react.useState)(false);
	const [newTitle, setNewTitle] = (0, import_react.useState)("");
	const [newEmployee, setNewEmployee] = (0, import_react.useState)("");
	const [newDepartment, setNewDepartment] = (0, import_react.useState)("");
	const [newKind, setNewKind] = (0, import_react.useState)("joining");
	const [newDate, setNewDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [newDescription, setNewDescription] = (0, import_react.useState)("");
	const [newPerformedBy, setNewPerformedBy] = (0, import_react.useState)("HR Admin");
	const fetchLiveTimelineEvents = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const [empRes, intRes, deptsRes, exitsRes] = await Promise.allSettled([
				apiInstance.get("/employees"),
				apiInstance.get("/internal/dashboard"),
				apiInstance.get("/departments"),
				apiInstance.get("/exits")
			]);
			const liveList = [];
			if (empRes.status === "fulfilled" && empRes.value.data?.data) (empRes.value.data.data.items ?? empRes.value.data.data ?? []).forEach((e, idx) => {
				const empName = [e.first_name, e.last_name].filter(Boolean).join(" ").trim() || e.full_name || e.name || `Employee #${e.employee_id || idx + 1}`;
				const desig = e.designation || e.role || "Specialist";
				const dept = e.department || e.department_name || "General";
				const joinDate = e.joining_date ? String(e.joining_date).split("T")[0] : e.created_at ? String(e.created_at).split("T")[0] : "2026-07-21";
				liveList.push({
					id: `api_emp_join_${e.id ?? idx}`,
					kind: "joining",
					title: `Joined Enterprise as ${desig}`,
					employeeName: empName,
					employeeId: e.employee_id || `EMP-${1e3 + idx}`,
					department: dept,
					date: joinDate,
					description: `Onboarding completed. System account active (${e.company_email || e.personal_email || "N/A"}).`,
					performedBy: "HR Automated Sync"
				});
			});
			if (deptsRes.status === "fulfilled" && deptsRes.value.data?.data) (deptsRes.value.data.data.items ?? deptsRes.value.data.data ?? []).forEach((d, idx) => {
				liveList.push({
					id: `api_dept_${d.id ?? idx}`,
					kind: "department-change",
					title: `Department Established: ${d.department_name || d.name}`,
					employeeName: d.manager_name || d.departmentHeadName || "Department Head",
					department: d.department_name || d.name,
					date: d.created_at ? String(d.created_at).split("T")[0] : "2026-07-20",
					description: `Department code ${d.department_code || "DEP"} configured with location ${d.location || "Office"}.`,
					performedBy: "Enterprise Admin"
				});
			});
			if (intRes.status === "fulfilled" && intRes.value.data?.data) (intRes.value.data.data.pinned_announcements ?? intRes.value.data.data.recent_announcements ?? []).forEach((a, idx) => {
				liveList.push({
					id: `api_ann_${a.id ?? idx}`,
					kind: "project",
					title: a.title ?? "Enterprise Milestone Event",
					employeeName: a.author_name ?? "Leadership Office",
					department: "Enterprise",
					date: a.created_at ? String(a.created_at).split("T")[0] : "2026-07-15",
					description: a.content ?? a.summary ?? "Official company announcement logged in timeline history.",
					performedBy: a.author_name ?? "Executive Team"
				});
			});
			if (exitsRes.status === "fulfilled" && exitsRes.value.data?.data) (exitsRes.value.data.data.items ?? exitsRes.value.data.data ?? []).forEach((x, idx) => {
				liveList.push({
					id: `api_exit_${x.id ?? idx}`,
					kind: "exit",
					title: `Offboarding Initiated: ${x.employee_name || "Employee"}`,
					employeeName: x.employee_name || "Employee",
					department: x.department || "Operations",
					date: x.exit_date ? String(x.exit_date).split("T")[0] : "2026-07-01",
					description: `Reason: ${x.reason || "Resignation"}. Clearance workflow active.`,
					performedBy: "Offboarding Manager"
				});
			});
			const uniqueMap = /* @__PURE__ */ new Map();
			liveList.forEach((item) => uniqueMap.set(item.id, item));
			setEvents(Array.from(uniqueMap.values()));
		} catch (err) {
			console.error("Failed to load live timeline events", err);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchLiveTimelineEvents();
	}, [fetchLiveTimelineEvents]);
	const allEmployees = (0, import_react.useMemo)(() => {
		return Array.from(new Set(events.map((e) => e.employeeName))).sort();
	}, [events]);
	(0, import_react.useMemo)(() => {
		return Array.from(new Set(events.map((e) => e.department).filter(Boolean))).sort();
	}, [events]);
	const filteredEvents = (0, import_react.useMemo)(() => {
		return events.filter((e) => selectedEmployee === "all" ? true : e.employeeName === selectedEmployee).filter((e) => selectedCategory === "all" ? true : e.kind === selectedCategory).filter((e) => {
			if (!query.trim()) return true;
			const q = query.trim().toLowerCase();
			return e.title.toLowerCase().includes(q) || e.employeeName.toLowerCase().includes(q) || (e.department || "").toLowerCase().includes(q) || (e.description || "").toLowerCase().includes(q);
		}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}, [
		events,
		selectedEmployee,
		selectedCategory,
		query
	]);
	const groupedEvents = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		filteredEvents.forEach((evt) => {
			const d = new Date(evt.date);
			const groupKey = isNaN(d.getTime()) ? "Recent Activity" : d.toLocaleDateString("en-US", {
				month: "long",
				year: "numeric"
			});
			if (!map.has(groupKey)) map.set(groupKey, []);
			map.get(groupKey).push(evt);
		});
		return Array.from(map.entries());
	}, [filteredEvents]);
	const totalEventsCount = events.length;
	const joiningCount = events.filter((e) => e.kind === "joining").length;
	const promotionCount = events.filter((e) => e.kind === "promotion" || e.kind === "award").length;
	const transferCount = events.filter((e) => e.kind === "department-change" || e.kind === "salary-revision").length;
	function handleCreateEvent() {
		if (!newTitle.trim() || !newEmployee.trim()) {
			toast.error("Please enter event title and employee name.");
			return;
		}
		const created = {
			id: `evt_user_${Date.now()}`,
			kind: newKind,
			title: newTitle.trim(),
			employeeName: newEmployee.trim(),
			department: newDepartment.trim() || "General",
			date: newDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			description: newDescription.trim(),
			performedBy: newPerformedBy.trim() || "HR Lead"
		};
		setEvents((prev) => [created, ...prev]);
		toast.success("Timeline event logged successfully!");
		setAddModalOpen(false);
		setNewTitle("");
		setNewEmployee("");
		setNewDepartment("");
		setNewDescription("");
	}
	function handleExportCSV() {
		const headers = "ID,Kind,Title,Employee,Department,Date,PerformedBy,Description\n";
		const rows = filteredEvents.map((e) => [
			e.id,
			e.kind,
			`"${e.title.replace(/"/g, "\"\"")}"`,
			`"${e.employeeName.replace(/"/g, "\"\"")}"`,
			`"${(e.department || "").replace(/"/g, "\"\"")}"`,
			e.date,
			`"${(e.performedBy || "").replace(/"/g, "\"\"")}"`,
			`"${(e.description || "").replace(/"/g, "\"\"")}"`
		].join(",")).join("\n");
		const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `HR_Lifecycle_Timeline_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Timeline exported to CSV successfully.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .3 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
										children: "Total Events"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-display text-2xl font-bold",
									children: totalEventsCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Logged lifecycle records"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .3,
							delay: .05
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
										children: "Onboarding & Joins"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-display text-2xl font-bold",
									children: joiningCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "New team members"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .3,
							delay: .1
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
										children: "Promotions & Awards"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-display text-2xl font-bold",
									children: promotionCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Recognitions & rank ups"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .3,
							delay: .15
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
										children: "Transfers & Salaries"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-display text-2xl font-bold",
									children: transferCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Internal role movements"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-3 space-y-2.5 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 min-w-[220px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search employee, title, department...",
								className: "pl-8 h-8 text-xs bg-background/80"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedEmployee,
								onValueChange: setSelectedEmployee,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 text-xs bg-background/80",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Employees" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "all",
									children: [
										"All Employees (",
										allEmployees.length,
										")"
									]
								}), allEmployees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: emp,
									children: emp
								}, emp))] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-[190px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedCategory,
								onValueChange: setSelectedCategory,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 text-xs bg-background/80",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Event Types" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Categories"
								}), ALL_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: k,
									children: KIND_META[k].label
								}, k))] })]
							})
						}),
						(query || selectedEmployee !== "all" || selectedCategory !== "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setQuery("");
								setSelectedEmployee("all");
								setSelectedCategory("all");
							},
							className: "h-8 text-xs px-2.5 text-muted-foreground hover:text-foreground gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Reset"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleExportCSV,
								className: "h-8 text-xs gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export CSV"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setAddModalOpen(true),
								className: "h-8 text-xs gap-1.5 bg-primary text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Log New Event"]
							})]
						})
					]
				})
			}),
			filteredEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-xl bg-muted mx-auto text-muted-foreground mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "No Timeline Events Found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: "Try resetting your search parameters or category filters."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							setQuery("");
							setSelectedEmployee("all");
							setSelectedCategory("all");
						},
						className: "mt-4 text-xs",
						children: "Reset Filters"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-8",
				children: groupedEvents.map(([groupName, groupItems]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-semibold tracking-tight text-foreground",
								children: groupName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-[10px] rounded-full px-2",
								children: [
									groupItems.length,
									" ",
									groupItems.length === 1 ? "event" : "events"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative ml-4 border-l-2 border-border/60 space-y-6 pl-6",
						children: groupItems.map((evt, idx) => {
							const meta = KIND_META[evt.kind] ?? KIND_META.joining;
							const Icon = meta.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									x: -12
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: {
									duration: .3,
									delay: idx * .04
								},
								className: "relative group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute -left-[35px] top-1.5 grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary shadow-sm ring-4 ring-background transition-transform group-hover:scale-110",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card p-4 shadow-sm transition-all group-hover:border-foreground/20 group-hover:shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 flex-wrap",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-display text-sm font-semibold text-foreground",
													children: evt.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `text-[10px] font-medium border ${meta.bg}`,
													children: meta.label
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium text-foreground",
														children: evt.employeeName
													}),
													evt.employeeId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[11px]",
														children: evt.employeeId
													})] }),
													evt.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: evt.department })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(evt.date).toLocaleDateString("en-IN", {
														day: "numeric",
														month: "short",
														year: "numeric"
													}) })
												]
											})]
										}), evt.performedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md border border-border/40",
											children: [
												"Logged by:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "font-medium text-foreground",
													children: evt.performedBy
												})
											]
										})]
									}), evt.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs text-muted-foreground leading-relaxed bg-background/40 p-2.5 rounded-lg border border-border/30",
										children: evt.description
									})]
								})]
							}, evt.id);
						})
					})]
				}, groupName))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addModalOpen,
				onOpenChange: setAddModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[500px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display text-lg",
							children: "Log Lifecycle & Activity Event"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Record an official milestone event into the employee timeline history."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Employee Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newEmployee,
										onChange: (e) => setNewEmployee(e.target.value),
										placeholder: "e.g. Aarav Sharma",
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Event Type *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: newKind,
											onValueChange: (val) => setNewKind(val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ALL_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: k,
												children: KIND_META[k].label
											}, k)) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Event Date *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: newDate,
											onChange: (e) => setNewDate(e.target.value),
											className: "h-9 text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Title / Event Headline *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: newTitle,
											onChange: (e) => setNewTitle(e.target.value),
											placeholder: "e.g. Promoted to Senior Lead",
											className: "h-9 text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Department"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: newDepartment,
											onChange: (e) => setNewDepartment(e.target.value),
											placeholder: "e.g. Engineering",
											className: "h-9 text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Description & Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newDescription,
										onChange: (e) => setNewDescription(e.target.value),
										placeholder: "Add event context or resolution details...",
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Logged By"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newPerformedBy,
										onChange: (e) => setNewPerformedBy(e.target.value),
										placeholder: "e.g. HR Operations",
										className: "h-9 text-xs"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setAddModalOpen(false),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleCreateEvent,
								className: "text-xs",
								children: "Save Event Record"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { TimelinePage, TimelinePage as default };
