import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Jr as Briefcase, Sr as CircleCheck, Tr as CircleAlert, Wr as CalendarClock, a as X, jn as Funnel, pr as Clock, si as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { s as computeAverageTimeToHire } from "./dashboard-Z73MyXDx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HiringManagerRecruitmentPage-zW8ftJrh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HiringManagerRecruitmentPage() {
	const { jobs, candidates, interviews, moveStage } = useRecruitment();
	const [selectedJobId, setSelectedJobId] = (0, import_react.useState)("all");
	const myJobs = (0, import_react.useMemo)(() => {
		return jobs.filter((j) => selectedJobId === "all" || j.id === selectedJobId);
	}, [jobs, selectedJobId]);
	const activeCandidates = (0, import_react.useMemo)(() => {
		return candidates.filter((c) => selectedJobId === "all" || c.jobId === selectedJobId);
	}, [candidates, selectedJobId]);
	const pendingReviews = (0, import_react.useMemo)(() => {
		return activeCandidates.filter((c) => [
			"screening",
			"technical",
			"interview"
		].includes(c.stage));
	}, [activeCandidates]);
	const avgTimeToHire = (0, import_react.useMemo)(() => {
		return computeAverageTimeToHire(activeCandidates);
	}, [activeCandidates]);
	const handleDecision = (candId, decision) => {
		const cand = candidates.find((c) => c.id === candId);
		if (!cand) return;
		const targetId = cand.applicationId || cand.id;
		if (!targetId) return;
		if (decision === "advance") {
			moveStage(targetId, "offer");
			toast.success(`${cand.name} approved and advanced to Offer Stage!`);
		} else {
			moveStage(targetId, "rejected");
			toast.info(`${cand.name} marked as Rejected with feedback.`);
		}
	};
	const scheduledInterviews = (0, import_react.useMemo)(() => {
		return interviews.filter((i) => i.status === "scheduled");
	}, [interviews]);
	const formatInterviewDate = (dateStr) => {
		if (!dateStr) return "Date TBD";
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return dateStr;
		return date.toLocaleDateString("en-IN", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			jobs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedJobId,
						onChange: (e) => setSelectedJobId(e.target.value),
						className: "h-9 rounded-xl border border-border bg-card/60 px-3 text-xs text-foreground backdrop-blur-xl focus:outline-none focus:ring-1 focus:ring-indigo-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: "all",
							children: [
								"All Requisitions (",
								jobs.length,
								")"
							]
						}), jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: j.id,
							children: j.title
						}, j.id))]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Positions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-indigo-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: [myJobs.length, " Active"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: myJobs.length > 0 ? "Assigned to your engineering unit" : "No active open positions"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending Reviews" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400",
								children: [pendingReviews.length, " Candidates"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: pendingReviews.length > 0 ? "Awaiting manager score evaluation" : "Queue is fully up to date"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interviews Scheduled" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4 text-emerald-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold text-foreground",
								children: [scheduledInterviews.length, " Sessions"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: scheduledInterviews.length > 0 ? "Active sessions across panel members" : "No upcoming sessions"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Avg Time-to-Hire" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-purple-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: avgTimeToHire > 0 ? `${avgTimeToHire} Days` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground font-medium",
								children: avgTimeToHire > 0 ? "Calculated from hired candidates" : "No hire data yet"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2 space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm text-foreground",
								children: "Pending Candidate Approvals"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Candidates requiring your hire / no-hire decision."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: [pendingReviews.length, " in Queue"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: pendingReviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8 text-muted-foreground/40 mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "No pending candidate reviews"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground/60 mt-1",
										children: "All candidates in your pipeline have been reviewed."
									})
								]
							}) : pendingReviews.map((cand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-accent/20 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm text-foreground",
												children: cand.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px] capitalize",
												children: cand.stage
											}),
											cand.atsScore != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-indigo-500",
												children: [cand.atsScore, "% Match"]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											"Role: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: cand.appliedPosition || "General Requisition"
											}),
											cand.yearsExperience ? ` • ${cand.yearsExperience} yrs exp` : "",
											cand.location ? ` • ${cand.location}` : ""
										]
									}),
									cand.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground mt-1 line-clamp-1",
										children: cand.summary
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 gap-1",
										onClick: () => handleDecision(cand.id, "reject"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), " Reject"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-8 text-xs bg-gradient-brand text-brand-foreground shadow-glow gap-1",
										onClick: () => handleDecision(cand.id, "advance"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Advance to Offer"]
									})]
								})]
							}, cand.id))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold text-sm text-foreground",
							children: "Your Active Open Roles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: myJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground",
								children: "No active open roles found."
							}) : myJobs.slice(0, 4).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl border border-border bg-card/40 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold text-foreground flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: j.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[9px]",
										children: [j.vacancies || 0, " open"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground mt-1 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [j.applicants || 0, " Applicants"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/dashboard/recruitment/jobs/$jobId",
										params: { jobId: j.id },
										className: "text-indigo-500 hover:underline inline-flex items-center",
										children: ["Details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3 ml-0.5" })]
									})]
								})]
							}, j.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold text-sm text-foreground",
							children: "Upcoming Interview Schedule"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: scheduledInterviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground",
								children: "No upcoming interviews scheduled."
							}) : scheduledInterviews.slice(0, 3).map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl border border-border bg-card/40 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-foreground",
										children: iv.candidateName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: iv.round
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-indigo-500 mt-1 font-mono",
										children: formatInterviewDate(iv.date)
									})
								]
							}, iv.id))
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { HiringManagerRecruitmentPage };
