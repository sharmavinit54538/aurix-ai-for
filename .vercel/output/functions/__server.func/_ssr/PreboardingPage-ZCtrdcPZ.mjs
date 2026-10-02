import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Vt as Mail, p as Users, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PreboardingPage-ZCtrdcPZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_PREBOARDING = [];
function PreboardingPage() {
	const [candidates, setCandidates] = (0, import_react.useState)(INITIAL_PREBOARDING);
	const [selectedCandidateId, setSelectedCandidateId] = (0, import_react.useState)("");
	const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0] || null;
	const handleToggleTask = (taskId) => {
		if (!activeCandidate) return;
		setCandidates(candidates.map((c) => {
			if (c.id !== activeCandidate.id) return c;
			return {
				...c,
				tasks: c.tasks.map((t) => t.id === taskId ? {
					...t,
					completed: !t.completed
				} : t)
			};
		}));
		toast.success("Preboarding checklist item updated!");
	};
	const completedCount = activeCandidate?.tasks.filter((t) => t.completed).length ?? 0;
	const totalTasks = activeCandidate?.tasks.length ?? 0;
	const progressPct = totalTasks > 0 ? Math.round(completedCount / totalTasks * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between font-semibold text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upcoming Joiners" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs",
						children: [candidates.length, " In Preboarding"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [candidates.map((c) => {
						const comp = c.tasks.filter((t) => t.completed).length;
						const pct = c.tasks.length > 0 ? Math.round(comp / c.tasks.length * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedCandidateId(c.id),
							className: `w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${activeCandidate?.id === c.id ? "border-indigo-500 bg-accent/60 shadow-sm" : "border-border bg-card/40 hover:bg-accent/30"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-sm text-foreground",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
										children: [
											"Joins in ",
											c.daysToJoin,
											"d"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: c.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[10px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preboarding Readiness:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [pct, "%"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: pct,
										className: "h-1"
									})]
								})
							]
						}, c.id);
					}), candidates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground text-center py-6",
						children: "No upcoming joiners in preboarding."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 space-y-4",
				children: activeCandidate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-lg text-foreground",
								children: activeCandidate.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Target Role: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: activeCandidate.role
									}),
									" • Target Start: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeCandidate.joiningDate })
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 text-xs gap-1.5",
									onClick: () => toast.success(`Welcome nudge sent to ${activeCandidate.name}!`),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Send Reminder Nudge"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-xs text-foreground flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-indigo-500" }),
											"Countdown to Day 1: ",
											activeCandidate.daysToJoin,
											" Days Remaining"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-xs text-indigo-500",
										children: [progressPct, "% Completed"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: progressPct,
									className: "h-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[11px] text-muted-foreground pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Buddy Assigned: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeCandidate.assignedBuddy })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Swag Kit: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeCandidate.welcomePackStatus })] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-semibold text-xs text-muted-foreground uppercase tracking-wider",
								children: [
									"Preboarding Action Items (",
									completedCount,
									"/",
									activeCandidate.tasks.length,
									")"
								]
							}), activeCandidate.tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => handleToggleTask(task.id),
								className: `p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${task.completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card/40 hover:bg-accent/30"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid h-5 w-5 place-items-center rounded-full border ${task.completed ? "bg-emerald-500 text-white border-emerald-500" : "border-border"}`,
										children: task.completed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: task.completed ? "line-through text-muted-foreground" : "font-medium text-foreground",
										children: task.title
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: ["Owner: ", task.owner]
								})]
							}, task.id))]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[300px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-10 w-10 text-muted-foreground/40 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm text-foreground",
							children: "No Preboarding Candidates"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1 max-w-xs",
							children: "There are no candidates currently in the preboarding pipeline. Accepted offers will appear here."
						})
					]
				})
			})]
		})
	});
}
//#endregion
export { PreboardingPage };
