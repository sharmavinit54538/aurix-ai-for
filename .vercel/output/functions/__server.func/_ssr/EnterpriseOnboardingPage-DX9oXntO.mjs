import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, on as Laptop, p as Users, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EnterpriseOnboardingPage-DX9oXntO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_HIRES = [];
function EnterpriseOnboardingPage() {
	const [newHires, setNewHires] = (0, import_react.useState)(INITIAL_HIRES);
	const [selectedHireId, setSelectedHireId] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("all");
	const activeHire = newHires.find((h) => h.id === selectedHireId) || newHires[0] || null;
	const handleToggleTaskStatus = (taskId) => {
		if (!activeHire) return;
		setNewHires(newHires.map((hire) => {
			if (hire.id !== activeHire.id) return hire;
			return {
				...hire,
				tasks: hire.tasks.map((t) => t.id === taskId ? {
					...t,
					status: t.status === "Completed" ? "Pending" : "Completed"
				} : t)
			};
		}));
		toast.success("Task status updated!");
	};
	const filteredTasks = activeHire?.tasks.filter((t) => deptFilter === "all" || t.department === deptFilter) ?? [];
	const completedTasks = activeHire?.tasks.filter((t) => t.status === "Completed").length ?? 0;
	const totalTasks = activeHire?.tasks.length ?? 0;
	const calculatedReadiness = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
	const statusColors = {
		Completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
		Pending: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
		Overdue: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
		Blocked: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between font-semibold text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Incoming Cohort" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs",
						children: [newHires.length, " New Hires"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [newHires.map((hire) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelectedHireId(hire.id),
						className: `w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${activeHire?.id === hire.id ? "border-indigo-500 bg-accent/60 shadow-sm" : "border-border bg-card/40 hover:bg-accent/30"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-foreground",
									children: hire.employeeName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "text-[10px]",
									children: [hire.dayOneReadinessScore, "% Ready"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: hire.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground mt-2 flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Dept: ", hire.department] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Day 1: ", hire.joinDate] })]
							})
						]
					}, hire.id)), newHires.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground text-center py-6",
						children: "No new hires in the pipeline."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 space-y-4",
				children: activeHire ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-lg text-foreground",
								children: activeHire.employeeName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									activeHire.role,
									" • ",
									activeHire.department,
									" • Target Start: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeHire.joinDate })
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground uppercase font-bold tracking-wider",
									children: "Day-One Readiness Gauge"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-display font-bold text-emerald-600 dark:text-emerald-400",
									children: [calculatedReadiness, "% Ready"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl border border-border bg-card/40 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4 text-indigo-500" }), "Hardware & IT Asset Allocation"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground font-mono text-[11px]",
									children: activeHire.laptopAssigned
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl border border-border bg-card/40 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold text-foreground flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }),
										"System Access Badges (",
										activeHire.accessGranted.length,
										" Enabled)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1",
									children: activeHire.accessGranted.map((acc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-[9px]",
										children: acc
									}, acc))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 border-b border-border pb-2 pt-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground mr-1 text-[11px]",
								children: "Department:"
							}), [
								"all",
								"HR",
								"IT",
								"Admin",
								"Finance",
								"Manager"
							].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeptFilter(d),
								className: `px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${deptFilter === d ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:bg-accent"}`,
								children: d === "all" ? "All Tasks" : d
							}, d))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: filteredTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${t.status === "Completed" ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[9px]",
											children: t.department
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-semibold ${t.status === "Completed" ? "line-through text-muted-foreground" : "text-foreground"}`,
											children: t.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[9px] ${statusColors[t.status]}`,
											children: t.status
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground mt-1",
									children: [
										"Assigned to: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: t.assignee
										}),
										" • Due: ",
										t.dueDate
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: t.status === "Completed" ? "outline" : "default",
									className: "h-7 text-xs px-2.5 shrink-0 gap-1",
									onClick: () => handleToggleTaskStatus(t.id),
									children: t.status === "Completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-emerald-500" }), " Completed"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Mark Completed" })
								})]
							}, t.id))
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[300px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-10 w-10 text-muted-foreground/40 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm text-foreground",
							children: "No Onboarding Cases"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1 max-w-xs",
							children: "There are no employees currently in the onboarding pipeline. New hires will appear here once added."
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { EnterpriseOnboardingPage };
