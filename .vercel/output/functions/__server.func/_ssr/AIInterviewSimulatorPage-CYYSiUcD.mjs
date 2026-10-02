import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Dr as ChevronRight, Ft as Mic, H as Sparkles, Rr as Camera, Sr as CircleCheck, T as TriangleAlert, f as Video, gt as Play, oi as Award, pr as Clock, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AIInterviewSimulatorPage-CYYSiUcD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AIInterviewSimulatorPage() {
	const { candidates, jobs } = useRecruitment();
	const [sessionState, setSessionState] = (0, import_react.useState)("setup");
	const [interviewType, setInterviewType] = (0, import_react.useState)("Technical");
	const [selectedCandidateId, setSelectedCandidateId] = (0, import_react.useState)("");
	const [currentQuestionIdx, setCurrentQuestionIdx] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(0);
	const [candidateAnswer, setCandidateAnswer] = (0, import_react.useState)("");
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [tabSwitchCount, setTabSwitchCount] = (0, import_react.useState)(0);
	const [multiplePersonsDetected, setMultiplePersonsDetected] = (0, import_react.useState)(false);
	const [integrityScore, setIntegrityScore] = (0, import_react.useState)(100);
	const [flaggedMoments, setFlaggedMoments] = (0, import_react.useState)([]);
	const [humanReviewerNotes, setHumanReviewerNotes] = (0, import_react.useState)("");
	const [humanOverrideRating, setHumanOverrideRating] = (0, import_react.useState)("");
	const [questionBanks, setQuestionBanks] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem("aurix:ai_interview_questions");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed && typeof parsed === "object") return parsed;
			}
		} catch {}
		return {
			Technical: [],
			Behavioral: []
		};
	});
	const [showAddQuestion, setShowAddQuestion] = (0, import_react.useState)(false);
	const [newQuestion, setNewQuestion] = (0, import_react.useState)("");
	const [newCategory, setNewCategory] = (0, import_react.useState)("");
	const [newTimeLimit, setNewTimeLimit] = (0, import_react.useState)(90);
	(0, import_react.useMemo)(() => {
		if ((!selectedCandidateId || !candidates.some((c) => c.id === selectedCandidateId)) && candidates.length > 0) setSelectedCandidateId(candidates[0].id);
	}, [candidates, selectedCandidateId]);
	const candidate = candidates.find((c) => c.id === selectedCandidateId) || null;
	const questions = questionBanks[interviewType] || [];
	const currentQ = questions[currentQuestionIdx] || null;
	(0, import_react.useEffect)(() => {
		let timer;
		if (sessionState === "in-progress" && timeLeft > 0) timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1e3);
		return () => clearInterval(timer);
	}, [sessionState, timeLeft]);
	const saveQuestionBanks = (updated) => {
		setQuestionBanks(updated);
		if (typeof window !== "undefined") localStorage.setItem("aurix:ai_interview_questions", JSON.stringify(updated));
	};
	const handleAddQuestion = () => {
		if (!newQuestion.trim()) {
			toast.error("Please enter a question.");
			return;
		}
		const bank = [...questionBanks[interviewType] || []];
		bank.push({
			id: Date.now(),
			question: newQuestion.trim(),
			category: newCategory.trim() || interviewType,
			expectedKeypoints: [],
			timeLimitSec: newTimeLimit
		});
		saveQuestionBanks({
			...questionBanks,
			[interviewType]: bank
		});
		setNewQuestion("");
		setNewCategory("");
		setNewTimeLimit(90);
		setShowAddQuestion(false);
		toast.success("Question added to bank.");
	};
	const handleStartInterview = () => {
		if (!candidate) {
			toast.error("Please select a candidate first.");
			return;
		}
		if (questions.length === 0) {
			toast.error("Please add at least one question to the question bank first.");
			return;
		}
		setSessionState("in-progress");
		setCurrentQuestionIdx(0);
		setTimeLeft(questions[0].timeLimitSec);
		setCandidateAnswer("");
		setAnswers({});
		setTabSwitchCount(0);
		setMultiplePersonsDetected(false);
		setIntegrityScore(100);
		setFlaggedMoments([]);
		toast.success(`AI Interview session initialized for ${candidate.name}!`);
	};
	const handleNextQuestion = () => {
		const updatedAnswers = {
			...answers,
			[currentQuestionIdx]: candidateAnswer
		};
		setAnswers(updatedAnswers);
		if (currentQuestionIdx < questions.length - 1) {
			const nextIdx = currentQuestionIdx + 1;
			setCurrentQuestionIdx(nextIdx);
			setTimeLeft(questions[nextIdx].timeLimitSec);
			setCandidateAnswer(updatedAnswers[nextIdx] || "");
		} else {
			setSessionState("completed");
			toast.success("AI Interview session completed!");
		}
	};
	const triggerSimulatedTabSwitch = () => {
		setTabSwitchCount((p) => p + 1);
		setIntegrityScore((p) => Math.max(50, p - 8));
		const moment = `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] Tab switched: Browser lost focus`;
		setFlaggedMoments((prev) => [moment, ...prev]);
		toast.warning("Integrity Flag: Tab switch detected during session.");
	};
	const triggerSimulatedMultiplePersons = () => {
		setMultiplePersonsDetected(true);
		setIntegrityScore((p) => Math.max(40, p - 15));
		const moment = `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] Visual Anomaly: Second face detected in viewport`;
		setFlaggedMoments((prev) => [moment, ...prev]);
		toast.error("Integrity Flag: Multiple individuals detected on camera.");
	};
	Object.keys(answers).length + (sessionState === "completed" ? 0 : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			sessionState === "setup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-display text-lg font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-indigo-500" }), "Configure AI Interview Session"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Candidate to Interview"
							}), candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 p-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground bg-muted/20",
								children: "No candidates available in pipeline"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedCandidateId,
								onValueChange: setSelectedCandidateId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1 h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a candidate" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [c.name || "Unnamed", c.appliedPosition ? ` — ${c.appliedPosition}` : ""]
								}, c.id)) })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Interview Type & Question Bank"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: interviewType,
								onValueChange: (v) => setInterviewType(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1 h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Technical",
									children: "Technical & System Design"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Behavioral",
									children: "Behavioral & Culture Alignment"
								})] })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted/40 rounded-xl space-y-2 border border-border/70",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: ["Question Bank: ", interviewType]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: [questions.length, " questions"]
										})]
									}),
									questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground text-[11px]",
										children: "No questions added yet. Add questions to start an interview session."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "list-disc pl-4 space-y-1 text-muted-foreground text-[11px]",
										children: questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "line-clamp-1",
											children: q.question
										}, q.id))
									}),
									!showAddQuestion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-7 text-[11px] w-full mt-1",
										onClick: () => setShowAddQuestion(true),
										children: "+ Add Question"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 pt-2 border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												className: "text-xs",
												rows: 2,
												placeholder: "Enter interview question...",
												value: newQuestion,
												onChange: (e) => setNewQuestion(e.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "flex-1 h-7 rounded-md border border-border bg-background px-2 text-xs",
													placeholder: "Category (optional)",
													value: newCategory,
													onChange: (e) => setNewCategory(e.target.value)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "w-20 h-7 rounded-md border border-border bg-background px-2 text-xs",
													type: "number",
													placeholder: "Secs",
													value: newTimeLimit,
													onChange: (e) => setNewTimeLimit(Number(e.target.value) || 90)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													className: "h-7 text-[11px] flex-1",
													onClick: handleAddQuestion,
													children: "Save Question"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-7 text-[11px]",
													onClick: () => {
														setShowAddQuestion(false);
														setNewQuestion("");
													},
													children: "Cancel"
												})]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleStartInterview,
								disabled: !candidate || questions.length === 0,
								className: "w-full mt-3 bg-gradient-brand text-brand-foreground shadow-glow gap-2 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }), "Launch AI Interview Room"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4 flex flex-col justify-between",
					children: candidate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase text-muted-foreground tracking-wider font-semibold",
								children: "Candidate Brief"
							}), candidate.appliedPosition && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: candidate.appliedPosition
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold mt-2",
							children: candidate.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								candidate.location,
								candidate.yearsExperience ? `${candidate.yearsExperience} yrs experience` : "",
								candidate.source ? `Source: ${candidate.source}` : ""
							].filter(Boolean).join(" • ")
						}),
						candidate.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 p-3 rounded-lg border border-border bg-background/50 text-xs text-foreground leading-relaxed",
							children: candidate.summary
						}),
						candidate.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: candidate.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: s
							}, s))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground border-t border-border pt-3",
						children: "Results available immediately upon completion."
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center p-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-8 w-8 text-muted-foreground/30 mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground",
								children: "Select a candidate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground/60 mt-1",
								children: "Choose a candidate from the left panel to view their brief."
							})
						]
					})
				})]
			}),
			sessionState === "in-progress" && candidate && currentQ && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-video rounded-2xl border border-border bg-zinc-950 overflow-hidden flex flex-col justify-between p-4 shadow-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between z-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-rose-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Interviewer Active" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [timeLeft, "s remaining"] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center my-auto z-10 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-24 w-24 place-items-center rounded-full bg-gradient-brand text-white shadow-glow mb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl font-bold",
											children: candidate.name.split(" ").map((n) => n[0]).join("")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-white font-semibold text-sm",
										children: candidate.name
									}),
									candidate.appliedPosition && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-zinc-400 text-xs",
										children: candidate.appliedPosition
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between z-10 pt-2 border-t border-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "p-2 rounded-full bg-white/10 text-white hover:bg-white/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "p-2 rounded-full bg-white/10 text-white hover:bg-white/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-zinc-300 bg-black/40 px-2.5 py-1 rounded",
									children: [
										"Question ",
										currentQuestionIdx + 1,
										" of ",
										questions.length
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: currentQ.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Response Area"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-semibold text-base text-foreground leading-snug",
								children: [
									"\"",
									currentQ.question,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Candidate Response"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: candidateAnswer,
								onChange: (e) => setCandidateAnswer(e.target.value),
								className: "mt-1 text-xs font-mono",
								rows: 3,
								placeholder: "Enter or record candidate's response..."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleNextQuestion,
									className: "bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 text-xs",
									children: [currentQuestionIdx < questions.length - 1 ? "Submit & Next Question" : "Complete & Generate Report", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
								})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold text-sm flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }), "Integrity & Fraud Signals"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground",
									children: ["Score: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: integrityScore > 80 ? "text-emerald-500" : "text-amber-500",
										children: [integrityScore, "%"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center p-2 rounded-lg bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tab-Switching Events:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-semibold ${tabSwitchCount > 0 ? "text-rose-500" : "text-foreground"}`,
										children: [tabSwitchCount, " detected"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center p-2 rounded-lg bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Multiple Persons Signal:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-semibold ${multiplePersonsDetected ? "text-rose-500" : "text-emerald-500"}`,
										children: multiplePersonsDetected ? "Flagged" : "Normal"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase font-bold text-muted-foreground",
									children: "Test Integrity Signals:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7 text-[11px] justify-start text-amber-600 border-amber-500/30",
										onClick: triggerSimulatedTabSwitch,
										children: "Simulate Tab Switch Event"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7 text-[11px] justify-start text-rose-600 border-rose-500/30",
										onClick: triggerSimulatedMultiplePersons,
										children: "Simulate Multiple Person Detected"
									})]
								})]
							}),
							flaggedMoments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-700 dark:text-rose-300 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), "Flagged Incidents:"]
								}), flaggedMoments.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-[10px]",
									children: ["• ", m]
								}, i))]
							})
						]
					})
				})]
			}),
			sessionState === "completed" && candidate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-bold text-lg text-foreground",
								children: ["Interview Completed: ", candidate.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									questions.length,
									" questions answered • Integrity Score: ",
									integrityScore,
									"%"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								setSessionState("setup");
								setHumanReviewerNotes("");
								setHumanOverrideRating("");
							},
							className: "text-xs",
							children: "Start Another Interview"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Questions Answered"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 font-display text-2xl font-bold text-foreground",
										children: [
											Object.keys(answers).length,
											" / ",
											questions.length
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: "All questions completed"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Integrity & Proctoring"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `mt-2 font-display text-2xl font-bold ${integrityScore > 80 ? "text-emerald-500" : "text-amber-500"}`,
										children: [integrityScore, "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: [
											integrityScore > 80 ? "High Trust" : "Review Required",
											" • ",
											tabSwitchCount,
											" tab switches"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Flagged Incidents"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `mt-2 font-display text-2xl font-bold ${flaggedMoments.length === 0 ? "text-emerald-500" : "text-rose-500"}`,
										children: flaggedMoments.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: flaggedMoments.length === 0 ? "Clean session" : "Requires manual review"
									})
								]
							})
						]
					}),
					Object.keys(answers).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-semibold text-sm text-foreground",
							children: "Candidate Responses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: questions.map((q, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl border border-border bg-card/40 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold text-foreground mb-1",
									children: [
										"Q",
										idx + 1,
										": ",
										q.question
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground whitespace-pre-line",
									children: answers[idx] || "No response recorded"
								})]
							}, q.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-sm text-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-indigo-500" }), "Human Reviewer Sign-off"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 md:grid-cols-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Reviewer Recommendation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: humanOverrideRating,
									onValueChange: setHumanOverrideRating,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "mt-1 h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a decision" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Strong Hire",
											children: "Strong Hire (Advance to Offer)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Hire",
											children: "Hire (Standard)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Hold",
											children: "Hold / Review Next Round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Reject",
											children: "Reject"
										})
									] })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Next Hiring Action"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										disabled: !humanOverrideRating,
										className: "h-9 text-xs bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 disabled:opacity-50",
										onClick: () => {
											if (candidate) toast.success(`Decision "${humanOverrideRating}" recorded for ${candidate.name}!`);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), "Submit Decision"]
									})
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Interviewer Notes & Commentary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1 text-xs",
								rows: 3,
								placeholder: "Add your observations, notes, and recommendations...",
								value: humanReviewerNotes,
								onChange: (e) => setHumanReviewerNotes(e.target.value)
							})] })
						]
					})
				]
			})
		]
	});
}
//#endregion
export { AIInterviewSimulatorPage };
