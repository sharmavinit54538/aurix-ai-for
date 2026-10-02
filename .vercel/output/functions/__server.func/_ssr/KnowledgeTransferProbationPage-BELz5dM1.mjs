import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, bn as GraduationCap, ei as BookOpen, oi as Award } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/KnowledgeTransferProbationPage-BELz5dM1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_PROBATION_CASES = [];
function KnowledgeTransferProbationPage() {
	const [cases, setCases] = (0, import_react.useState)(INITIAL_PROBATION_CASES);
	const [selectedCaseId, setSelectedCaseId] = (0, import_react.useState)("");
	const [showConfirmModal, setShowConfirmModal] = (0, import_react.useState)(false);
	const [recommendationDecision, setRecommendationDecision] = (0, import_react.useState)("Confirmed");
	const [recommendationFeedback, setRecommendationFeedback] = (0, import_react.useState)("");
	const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0] || null;
	const handleToggleModule = (moduleId) => {
		if (!activeCase) return;
		setCases(cases.map((c) => {
			if (c.id !== activeCase.id) return c;
			return {
				...c,
				trainingModules: c.trainingModules.map((m) => m.id === moduleId ? {
					...m,
					completed: !m.completed
				} : m)
			};
		}));
		toast.success("Training module progress updated!");
	};
	const handleCompleteProbation = (e) => {
		e.preventDefault();
		if (!activeCase) return;
		setCases(cases.map((c) => c.id === activeCase.id ? {
			...c,
			probationStatus: recommendationDecision
		} : c));
		toast.success(`Probation recommendation recorded: ${recommendationDecision}!`);
		setShowConfirmModal(false);
	};
	const completedModules = activeCase?.trainingModules.filter((m) => m.completed).length ?? 0;
	const totalModules = activeCase?.trainingModules.length ?? 0;
	const trainingPct = totalModules > 0 ? Math.round(completedModules / totalModules * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowConfirmModal(true),
					className: "bg-gradient-brand text-brand-foreground shadow-glow gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" }), "Submit Probation Recommendation"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between font-semibold text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Employees on Probation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "text-xs",
							children: [cases.length, " Tracking"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedCaseId(c.id),
							className: `w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${activeCase?.id === c.id ? "border-indigo-500 bg-accent/60 shadow-sm" : "border-border bg-card/40 hover:bg-accent/30"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-sm text-foreground",
										children: c.employeeName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `text-[9px] ${c.probationStatus === "Confirmed" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-indigo-500/15 text-indigo-600 border-indigo-500/30"}`,
										children: c.probationStatus
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: c.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground mt-2 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Mentor: ", c.mentor.split(" ")[0]] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Ends in ",
										c.daysRemaining,
										" days"
									] })]
								})
							]
						}, c.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2 space-y-4",
					children: activeCase ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-lg text-foreground",
									children: activeCase.employeeName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										activeCase.role,
										" • Mentor: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: activeCase.mentor
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground uppercase font-bold tracking-wider",
										children: "Probation Timeline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-semibold text-foreground",
										children: [
											activeCase.startDate,
											" → ",
											activeCase.endDate,
											" (",
											activeCase.daysRemaining,
											"d left)"
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-xs text-foreground flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 text-indigo-500" }),
											"Knowledge Transfer Curriculum (",
											completedModules,
											"/",
											activeCase.trainingModules.length,
											" Modules)"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-xs text-indigo-500",
										children: [trainingPct, "% Completed"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: trainingPct,
									className: "h-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-xs text-muted-foreground uppercase tracking-wider",
									children: "Training Modules & Resource Checklist"
								}), activeCase.trainingModules.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => handleToggleModule(m.id),
									className: `p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${m.completed ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card/40 hover:bg-accent/30"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `grid h-5 w-5 place-items-center rounded-full border ${m.completed ? "bg-emerald-500 text-white border-emerald-500" : "border-border"}`,
											children: m.completed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: m.completed ? "line-through text-muted-foreground" : "font-medium text-foreground",
											children: m.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-muted-foreground",
											children: ["Mentor: ", m.mentor]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: m.category
									})]
								}, m.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-3 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-xs text-muted-foreground uppercase tracking-wider",
									children: "Probation Review Checkpoints (30-60-90 Day Milestones)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 md:grid-cols-3 gap-3",
									children: activeCase.checkpoints.map((cp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 rounded-xl border border-border bg-card/40 space-y-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-foreground",
													children: [cp.milestone, " Review"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: `text-[9px] ${cp.status === "Completed" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`,
													children: cp.status
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground",
												children: ["Scheduled: ", cp.date]
											}),
											cp.status === "Completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1 pt-1 border-t border-border/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] font-semibold text-emerald-600",
													children: [
														"Rating: ",
														cp.managerRating,
														" / 5 Stars"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground leading-normal italic",
													children: [
														"\"",
														cp.managerNotes,
														"\""
													]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "pt-2 text-[10px] text-muted-foreground italic",
												children: "Evaluation form opens on milestone date."
											})
										]
									}, cp.milestone))
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[300px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-10 w-10 text-muted-foreground/40 mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm text-foreground",
								children: "No Probation Cases"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1 max-w-xs",
								children: "There are no employees currently in probation tracking. New hires entering probation will appear here."
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showConfirmModal,
				onOpenChange: setShowConfirmModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCompleteProbation,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-base font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-5 w-5 text-indigo-500" }), "Probation Completion Recommendation"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
								"Record manager sign-off for ",
								activeCase?.employeeName,
								" (",
								activeCase?.role,
								")."
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 py-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Final Decision"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: recommendationDecision,
									onValueChange: (v) => setRecommendationDecision(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "mt-1 h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Confirmed",
										children: "Confirm Full-Time Permanent Employment"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Extended",
										children: "Extend Probation by 30 Days"
									})] })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Manager Reviewer Notes & Feedback"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1 text-xs",
									rows: 4,
									value: recommendationFeedback,
									onChange: (e) => setRecommendationFeedback(e.target.value),
									required: true
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowConfirmModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "bg-gradient-brand text-brand-foreground shadow-glow",
								children: "Submit Recommendation"
							})] })
						]
					})
				})
			})
		]
	});
}
//#endregion
export { KnowledgeTransferProbationPage };
