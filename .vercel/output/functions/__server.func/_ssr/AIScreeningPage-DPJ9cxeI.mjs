import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Cr as CircleCheckBig, E as TrendingUp, G as SlidersVertical, H as Sparkles, Jn as Eye, T as TriangleAlert, Tn as GitCompare, a as X, br as CircleQuestionMark, kt as OctagonAlert, ot as RotateCw, qt as LoaderCircle, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as Slider } from "./slider-DZzI4Odi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AIScreeningPage-DPJ9cxeI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AIScreeningPage() {
	const { candidates, jobs, screeningThresholds, screeningRun, screeningResults, screeningLoading, screeningSubmitting, runScreening, fetchScreeningResults, submitDecision } = useRecruitment();
	const [selectedJobId, setSelectedJobId] = (0, import_react.useState)(jobs[0]?.id || "");
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const [weights, setWeights] = (0, import_react.useState)({
		skill: 40,
		exp: 30,
		edu: 20,
		cert: 10
	});
	const [compareIds, setCompareIds] = (0, import_react.useState)([]);
	const [showCompareModal, setShowCompareModal] = (0, import_react.useState)(false);
	const [inspectCandidate, setInspectCandidate] = (0, import_react.useState)(null);
	const [confirmDialog, setConfirmDialog] = (0, import_react.useState)(null);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const [rejectReasonError, setRejectReasonError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if ((!selectedJobId || !jobs.some((j) => j.id === selectedJobId)) && jobs.length > 0) setSelectedJobId(jobs[0].id);
	}, [jobs, selectedJobId]);
	const selectedJob = (0, import_react.useMemo)(() => jobs.find((j) => j.id === selectedJobId) || null, [jobs, selectedJobId]);
	const jobCandidates = (0, import_react.useMemo)(() => {
		if (!selectedJobId) return [];
		return candidates.filter((c) => c.jobId === selectedJobId);
	}, [candidates, selectedJobId]);
	const lastFetchedJobIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!selectedJobId || lastFetchedJobIdRef.current === selectedJobId) return;
		lastFetchedJobIdRef.current = selectedJobId;
		fetchScreeningResults(selectedJobId).catch(() => {});
	}, [selectedJobId, fetchScreeningResults]);
	(0, import_react.useEffect)(() => {
		if (!selectedJobId || !screeningRun) return;
		if (!(screeningRun.status?.toUpperCase() === "RUNNING")) return;
		const timer = setInterval(() => {
			fetchScreeningResults(selectedJobId).catch(() => {});
		}, 3e3);
		return () => {
			clearInterval(timer);
		};
	}, [
		selectedJobId,
		screeningRun?.status,
		fetchScreeningResults
	]);
	const handleWeightChange = (0, import_react.useCallback)((key, newVal) => {
		const clampedVal = Math.max(5, Math.min(70, newVal));
		const remainingTarget = 100 - clampedVal;
		const otherKeys = [
			"skill",
			"exp",
			"edu",
			"cert"
		].filter((k) => k !== key);
		const currentOtherSum = otherKeys.reduce((acc, k) => acc + weights[k], 0);
		const nextWeights = {
			...weights,
			[key]: clampedVal
		};
		if (currentOtherSum > 0) {
			let distributedSum = 0;
			otherKeys.forEach((k, idx) => {
				if (idx === otherKeys.length - 1) nextWeights[k] = Math.max(5, remainingTarget - distributedSum);
				else {
					const scaled = Math.max(5, Math.round(weights[k] / currentOtherSum * remainingTarget));
					nextWeights[k] = scaled;
					distributedSum += scaled;
				}
			});
		} else {
			const share = Math.floor(remainingTarget / otherKeys.length);
			otherKeys.forEach((k, idx) => {
				nextWeights[k] = idx === otherKeys.length - 1 ? remainingTarget - share * (otherKeys.length - 1) : share;
			});
		}
		setWeights(nextWeights);
	}, [weights]);
	const totalWeight = weights.skill + weights.exp + weights.edu + weights.cert;
	const mergedCandidates = (0, import_react.useMemo)(() => {
		const list = jobCandidates.map((c) => {
			const res = screeningResults.find((r) => r.candidateId === c.id || c.applicationId && r.applicationId === c.applicationId || r.candidateName.toLowerCase() === c.name.toLowerCase());
			if (res) {
				const effDecision = res.humanDecision === "SHORTLIST" ? "SHORTLIST" : res.humanDecision === "REJECT" ? "REJECT" : res.humanDecision === "KEEP_REVIEW" ? "REVIEW" : res.decision;
				return {
					id: c.id,
					candidateId: c.id,
					applicationId: c.applicationId || res.applicationId || c.id,
					name: c.name,
					appliedPosition: c.appliedPosition || selectedJob?.title || "Candidate",
					currentCompany: c.currentCompany,
					yearsExperience: c.yearsExperience,
					education: c.education,
					noticeDays: c.noticeDays,
					expectedSalary: c.expectedSalary,
					skills: c.skills?.length ? c.skills : res.missingSkills,
					summary: c.summary,
					stage: c.stage,
					isScreened: true,
					status: res.status,
					decision: res.decision,
					confidence: res.confidence,
					matchScore: res.matchScore,
					strengths: res.strengths,
					weaknesses: res.weaknesses,
					missingSkills: res.missingSkills,
					redFlags: res.redFlags,
					greenFlags: res.greenFlags,
					hiringRecommendation: res.hiringRecommendation,
					hrNotes: res.hrNotes,
					questionsToAsk: res.questionsToAsk,
					modelUsed: res.modelUsed,
					screenedAt: res.screenedAt,
					humanDecision: res.humanDecision,
					humanDecisionBy: res.humanDecisionBy,
					humanDecisionReason: res.humanDecisionReason,
					screeningId: res.screeningId || res.id,
					effectiveDecision: effDecision
				};
			}
			return {
				id: c.id,
				candidateId: c.id,
				applicationId: c.applicationId || c.id,
				name: c.name,
				appliedPosition: c.appliedPosition || selectedJob?.title || "Candidate",
				currentCompany: c.currentCompany,
				yearsExperience: c.yearsExperience,
				education: c.education,
				noticeDays: c.noticeDays,
				expectedSalary: c.expectedSalary,
				skills: c.skills || [],
				summary: c.summary,
				stage: c.stage,
				isScreened: false,
				status: "NOT_SCREENED",
				decision: null,
				confidence: 0,
				matchScore: null,
				strengths: [],
				weaknesses: [],
				missingSkills: [],
				redFlags: [],
				greenFlags: [],
				hiringRecommendation: "",
				hrNotes: "",
				questionsToAsk: [],
				modelUsed: "",
				screenedAt: null,
				humanDecision: null,
				humanDecisionBy: null,
				humanDecisionReason: null,
				screeningId: void 0,
				effectiveDecision: null
			};
		});
		screeningResults.forEach((res) => {
			if (!list.some((c) => c.candidateId === res.candidateId || res.applicationId && c.applicationId === res.applicationId || c.name.toLowerCase() === res.candidateName.toLowerCase())) {
				const effDecision = res.humanDecision === "SHORTLIST" ? "SHORTLIST" : res.humanDecision === "REJECT" ? "REJECT" : res.humanDecision === "KEEP_REVIEW" ? "REVIEW" : res.decision;
				list.push({
					id: res.candidateId || res.id,
					candidateId: res.candidateId || res.id,
					applicationId: res.applicationId || res.id,
					name: res.candidateName,
					appliedPosition: selectedJob?.title || "Candidate",
					skills: [],
					isScreened: true,
					status: res.status,
					decision: res.decision,
					confidence: res.confidence,
					matchScore: res.matchScore,
					strengths: res.strengths,
					weaknesses: res.weaknesses,
					missingSkills: res.missingSkills,
					redFlags: res.redFlags,
					greenFlags: res.greenFlags,
					hiringRecommendation: res.hiringRecommendation,
					hrNotes: res.hrNotes,
					questionsToAsk: res.questionsToAsk,
					modelUsed: res.modelUsed,
					screenedAt: res.screenedAt,
					humanDecision: res.humanDecision,
					humanDecisionBy: res.humanDecisionBy,
					humanDecisionReason: res.humanDecisionReason,
					screeningId: res.screeningId || res.id,
					effectiveDecision: effDecision
				});
			}
		});
		return list;
	}, [
		jobCandidates,
		screeningResults,
		selectedJob
	]);
	const filteredCandidates = (0, import_react.useMemo)(() => {
		if (activeTab === "all") return mergedCandidates;
		if (activeTab === "shortlisted") return mergedCandidates.filter((c) => c.effectiveDecision === "SHORTLIST");
		if (activeTab === "review") return mergedCandidates.filter((c) => c.effectiveDecision === "REVIEW");
		if (activeTab === "rejected") return mergedCandidates.filter((c) => c.effectiveDecision === "REJECT");
		return mergedCandidates;
	}, [mergedCandidates, activeTab]);
	const handleToggleCompare = (id) => {
		if (compareIds.includes(id)) setCompareIds(compareIds.filter((x) => x !== id));
		else {
			if (compareIds.length >= 3) {
				toast.error("You can compare at most 3 candidates simultaneously.");
				return;
			}
			setCompareIds([...compareIds, id]);
		}
	};
	const compareList = (0, import_react.useMemo)(() => mergedCandidates.filter((c) => compareIds.includes(c.id)), [mergedCandidates, compareIds]);
	const handleRunScreening = async () => {
		if (!selectedJobId) {
			toast.error("Please select a job first.");
			return;
		}
		try {
			await runScreening({ jobId: selectedJobId });
			toast.success("AI Screening job started. Processing resumes...");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to run AI screening";
			toast.error(msg);
		}
	};
	const handleRetryCandidate = async (candidate) => {
		if (!selectedJobId) return;
		try {
			await runScreening({
				jobId: selectedJobId,
				applicationIds: candidate.applicationId ? [candidate.applicationId] : void 0
			});
			toast.info(`Retrying screening for ${candidate.name}...`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to retry screening";
			toast.error(msg);
		}
	};
	const openConfirmDialog = (candidate, type) => {
		setConfirmDialog({
			type,
			candidate
		});
		setRejectReason("");
		setRejectReasonError("");
	};
	const handleConfirmDecision = async () => {
		if (!confirmDialog) return;
		const { type, candidate } = confirmDialog;
		if (type === "REJECT") {
			if (rejectReason.trim().length < 10) {
				setRejectReasonError("Rejection reason must be at least 10 characters long.");
				return;
			}
		}
		const screeningId = candidate.screeningId || candidate.applicationId || candidate.id;
		if (!screeningId) {
			toast.error("No valid screening ID found for this candidate.");
			return;
		}
		try {
			await submitDecision({
				screeningId,
				action: type,
				reason: type === "REJECT" ? rejectReason.trim() : rejectReason.trim() || void 0,
				jobId: selectedJobId
			});
			toast.success(type === "SHORTLIST" ? `Successfully shortlisted ${candidate.name}` : `Successfully rejected ${candidate.name}`);
			setConfirmDialog(null);
			if (inspectCandidate?.id === candidate.id) setInspectCandidate(null);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to submit decision";
			toast.error(msg);
		}
	};
	const isRunning = screeningRun?.status?.toUpperCase() === "RUNNING" || screeningRun?.status?.toUpperCase() === "PENDING";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			compareIds.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowCompareModal(true),
					className: "gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "h-4 w-4" }),
						"Compare (",
						compareIds.length,
						") Candidates"
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 lg:col-span-1 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sm",
								children: "Active Requisition"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" })]
						}),
						jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 rounded-xl border border-dashed border-border text-xs text-muted-foreground bg-muted/20",
							children: "No jobs available. Create a job requisition first."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedJobId,
							onValueChange: setSelectedJobId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs",
								"aria-label": "Select Job Requisition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a job" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: j.id,
								children: j.title
							}, j.id)) })]
						}),
						selectedJob && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs space-y-2 pt-2 border-t border-border",
							children: [
								selectedJob.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Department:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: selectedJob.department
									})]
								}),
								selectedJob.experience && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Target Experience:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: selectedJob.experience
									})]
								}),
								selectedJob.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Key Required Skills:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1",
									children: selectedJob.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-[10px]",
										children: s
									}, s))
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full text-xs h-9 gap-1.5",
								onClick: handleRunScreening,
								disabled: isRunning || !selectedJobId || screeningSubmitting,
								children: isRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "Screening in Progress..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Run AI Screening"] })
							}), screeningRun && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 pt-1 text-xs",
								role: "status",
								"aria-live": "polite",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Progress: ",
										screeningRun.completed,
										" / ",
										screeningRun.total,
										" screened"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize font-medium text-foreground",
										children: screeningRun.status.toLowerCase()
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: screeningRun.total > 0 ? Math.round(screeningRun.completed / screeningRun.total * 100) : 0,
									className: "h-1.5"
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 lg:col-span-2 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-semibold text-sm flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-4 w-4 text-primary" }), "Screening Criteria Weightings"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Weights dynamically auto-balance to enforce a strict total of 100%."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: `text-xs font-semibold ${totalWeight === 100 ? statusBadgeClass("approved") : statusBadgeClass("warning")}`,
									children: [
										"Total: ",
										totalWeight,
										"%"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									className: "text-xs h-7",
									onClick: () => {
										setWeights({
											skill: 40,
											exp: 30,
											edu: 20,
											cert: 10
										});
										toast.info("Reset weights to balanced defaults");
									},
									children: "Reset Default"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Skills & Tech Stack (",
											weights.skill,
											"%)"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [weights.skill, "%"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [weights.skill],
										min: 5,
										max: 70,
										step: 5,
										onValueChange: (v) => handleWeightChange("skill", v[0]),
										"aria-label": "Skills & Tech Stack Weight"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Years of Experience (",
											weights.exp,
											"%)"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [weights.exp, "%"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [weights.exp],
										min: 5,
										max: 70,
										step: 5,
										onValueChange: (v) => handleWeightChange("exp", v[0]),
										"aria-label": "Years of Experience Weight"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Education (",
											weights.edu,
											"%)"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [weights.edu, "%"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [weights.edu],
										min: 5,
										max: 70,
										step: 5,
										onValueChange: (v) => handleWeightChange("edu", v[0]),
										"aria-label": "Education Weight"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Certifications & Projects (",
											weights.cert,
											"%)"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [weights.cert, "%"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [weights.cert],
										min: 5,
										max: 70,
										step: 5,
										onValueChange: (v) => handleWeightChange("cert", v[0]),
										"aria-label": "Certifications & Projects Weight"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border flex flex-wrap items-center justify-between text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Backend AI Thresholds:" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-foreground font-medium",
									children: [
										"Shortlist: ≥ ",
										screeningThresholds.shortlist,
										"%"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-destructive font-medium",
									children: [
										"Reject: < ",
										screeningThresholds.reject,
										"%"
									]
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: [
						"all",
						"shortlisted",
						"review",
						"rejected"
					].map((tab) => {
						const count = tab === "all" ? mergedCandidates.length : tab === "shortlisted" ? mergedCandidates.filter((c) => c.effectiveDecision === "SHORTLIST").length : tab === "review" ? mergedCandidates.filter((c) => c.effectiveDecision === "REVIEW").length : mergedCandidates.filter((c) => c.effectiveDecision === "REJECT").length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab(tab),
							className: `capitalize px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeTab === tab ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`,
							children: [
								tab === "all" ? "All" : tab,
								" (",
								count,
								")"
							]
						}, tab);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [compareIds.length, " candidate(s) selected for comparison"]
				})]
			}),
			screeningLoading && mergedCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 text-primary animate-spin mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-foreground",
					children: "Loading screening results..."
				})]
			}) : jobCandidates.length === 0 && mergedCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 text-muted-foreground/30 mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted-foreground",
						children: "No candidates found for this job requisition"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground/60 mt-1 max-w-sm",
						children: "Add or assign applicants to this specific job requisition to start AI screening."
					})
				]
			}) : filteredCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 text-muted-foreground/30 mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted-foreground",
						children: "No candidates in this tab"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground/60 mt-1",
						children: [
							"No candidates match the \"",
							activeTab,
							"\" filter criteria for this requisition."
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: filteredCandidates.map((cand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-2xl border bg-card p-4 transition-all duration-200 flex flex-col justify-between ${compareIds.includes(cand.id) ? "border-primary ring-1 ring-primary/30" : "border-border"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-semibold text-sm text-foreground",
								children: cand.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: cand.appliedPosition
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right flex flex-col items-end gap-1",
								children: cand.isScreened && cand.matchScore !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display text-lg font-bold text-foreground",
									children: [cand.matchScore, "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[9px] uppercase tracking-wider font-bold ${cand.effectiveDecision === "SHORTLIST" ? statusBadgeClass("approved") : cand.effectiveDecision === "REJECT" ? statusBadgeClass("critical") : statusBadgeClass("warning")}`,
									children: cand.effectiveDecision || "Review"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[9px] uppercase tracking-wider font-bold ${statusBadgeClass("pending")}`,
									children: "Not screened yet"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between text-[11px]",
							children: [cand.status === "RUNNING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: `text-[10px] flex items-center gap-1 ${statusBadgeClass("info")}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-2.5 w-2.5 animate-spin" }), "Running"]
							}) : cand.status === "PENDING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "border-border text-muted-foreground text-[10px]",
								children: "Pending"
							}) : cand.status === "FAILED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[10px] ${statusBadgeClass("critical")}`,
									children: "Failed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-5 px-1.5 text-[10px] text-primary hover:text-primary/80",
									onClick: () => handleRetryCandidate(cand),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-2.5 w-2.5 mr-1" }), "Retry"]
								})]
							}) : cand.confidence > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: [
									"Confidence: ",
									Math.round(cand.confidence * (cand.confidence <= 1 ? 100 : 1)),
									"%"
								]
							}) : null, cand.modelUsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground/60",
								children: cand.modelUsed
							})]
						}),
						cand.isScreened && (cand.hiringRecommendation || cand.hrNotes) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground leading-relaxed border border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground flex items-center gap-1 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-primary" }), "AI Rationale:"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2",
								children: cand.hiringRecommendation || cand.hrNotes || "Assessment complete."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-xl bg-muted/20 p-2.5 text-[11px] text-muted-foreground/70 border border-border/40",
							children: "Candidate has not been analyzed yet. Run AI screening to generate evaluation."
						}),
						cand.strengths.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground font-medium flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3 text-primary" }), "Top Strengths:"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: cand.strengths.slice(0, 2).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "text-[9px] bg-primary/10 text-primary border border-primary/20",
									children: s
								}, s))
							})]
						}),
						cand.missingSkills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground font-medium flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 text-muted-foreground" }), "Missing Skills:"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: cand.missingSkills.slice(0, 2).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "text-[9px] bg-muted text-muted-foreground border border-border",
									children: s
								}, s))
							})]
						}),
						cand.humanDecision && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-lg border border-border/80 bg-accent/30 p-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-[11px] text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-primary" }),
										"Human: ",
										cand.humanDecision
									]
								}), cand.humanDecisionBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["by ", cand.humanDecisionBy]
								})]
							}), cand.humanDecisionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[10px] text-muted-foreground italic line-clamp-1",
								children: [
									"\"",
									cand.humanDecisionReason,
									"\""
								]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 pt-3 border-t border-border flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: compareIds.includes(cand.id),
								onChange: () => handleToggleCompare(cand.id),
								className: "rounded border-border text-primary",
								"aria-label": `Compare ${cand.name}`
							}), "Compare"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-7 text-xs px-2",
									onClick: () => setInspectCandidate(cand),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 mr-1" }), "Inspect"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7 text-xs px-2 text-emerald-600 dark:text-emerald-400 border-border hover:bg-muted/50 disabled:opacity-40",
									disabled: Boolean(cand.humanDecision),
									onClick: () => openConfirmDialog(cand, "SHORTLIST"),
									title: cand.humanDecision ? "Decision already recorded" : "Shortlist Candidate",
									"aria-label": `Shortlist ${cand.name}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7 text-xs px-2 text-destructive border-destructive/30 hover:bg-destructive/10 disabled:opacity-40",
									disabled: Boolean(cand.humanDecision),
									onClick: () => openConfirmDialog(cand, "REJECT"),
									title: cand.humanDecision ? "Decision already recorded" : "Reject Candidate",
									"aria-label": `Reject ${cand.name}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})
							]
						})]
					})]
				}, cand.id))
			}),
			inspectCandidate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(inspectCandidate),
				onOpenChange: () => setInspectCandidate(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "capitalize",
								children: inspectCandidate.stage || "Screening"
							}), inspectCandidate.matchScore !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-lg font-bold text-foreground",
								children: [inspectCandidate.matchScore, "% Match"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: statusBadgeClass("pending"),
								children: "Not screened yet"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl font-bold",
							children: inspectCandidate.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: [
							inspectCandidate.appliedPosition ? `Applied for ${inspectCandidate.appliedPosition}` : "",
							inspectCandidate.yearsExperience ? `${inspectCandidate.yearsExperience} yrs experience` : "",
							inspectCandidate.currentCompany ? `at ${inspectCandidate.currentCompany}` : ""
						].filter(Boolean).join(" • ") })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2 text-xs",
						children: [
							inspectCandidate.hiringRecommendation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "font-semibold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), "AI Hiring Recommendation"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 p-3 rounded-xl border border-border bg-card leading-relaxed text-foreground",
								children: inspectCandidate.hiringRecommendation
							})] }),
							inspectCandidate.hrNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "font-semibold text-muted-foreground",
								children: "HR Notes & Observations"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 p-3 rounded-xl border border-border bg-muted/30 text-foreground",
								children: inspectCandidate.hrNotes
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "font-semibold text-foreground flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5 text-primary" }),
										"Key Strengths (",
										inspectCandidate.strengths.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 space-y-1",
									children: inspectCandidate.strengths.length > 0 ? inspectCandidate.strengths.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px]",
										children: s
									}, s)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground italic text-[11px]",
										children: "No specific strengths identified"
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "font-semibold text-foreground flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-muted-foreground" }),
										"Identified Weaknesses (",
										inspectCandidate.weaknesses.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 space-y-1",
									children: inspectCandidate.weaknesses.length > 0 ? inspectCandidate.weaknesses.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 rounded-lg bg-muted border border-border text-foreground text-[11px]",
										children: w
									}, w)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground italic text-[11px]",
										children: "No weaknesses noted"
									})
								})] })]
							}),
							inspectCandidate.missingSkills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "font-semibold text-muted-foreground",
								children: "Missing Required Skills"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 flex flex-wrap gap-1",
								children: inspectCandidate.missingSkills.map((ms) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-border text-muted-foreground text-[10px]",
									children: ms
								}, ms))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-3",
								children: [inspectCandidate.greenFlags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "font-semibold text-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), "Green Flags"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-1 space-y-1 list-disc list-inside text-muted-foreground text-[11px]",
									children: inspectCandidate.greenFlags.map((gf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: gf }, gf))
								})] }), inspectCandidate.redFlags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "font-semibold text-destructive flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "h-3.5 w-3.5 text-destructive" }), "Red Flags"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-1 space-y-1 list-disc list-inside text-destructive text-[11px]",
									children: inspectCandidate.redFlags.map((rf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: rf }, rf))
								})] })]
							}),
							inspectCandidate.questionsToAsk.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "font-semibold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 text-primary" }), "Suggested Interview Questions"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-1.5 space-y-1.5 list-decimal list-inside p-3 rounded-xl border border-border bg-card text-foreground text-[11px]",
								children: inspectCandidate.questionsToAsk.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "leading-relaxed",
									children: q
								}, q))
							})] }),
							inspectCandidate.humanDecision && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl border border-border bg-accent/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-foreground flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" }),
											"Recorded Human Decision: ",
											inspectCandidate.humanDecision
										]
									}),
									inspectCandidate.humanDecisionBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground text-[11px] mt-0.5",
										children: ["Decided by ", inspectCandidate.humanDecisionBy]
									}),
									inspectCandidate.humanDecisionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-muted-foreground italic text-[11px]",
										children: [
											"\"",
											inspectCandidate.humanDecisionReason,
											"\""
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center pt-3 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setInspectCandidate(null),
									children: "Close"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "text-destructive border-destructive/30 hover:bg-destructive/10 disabled:opacity-40",
										disabled: Boolean(inspectCandidate.humanDecision),
										onClick: () => openConfirmDialog(inspectCandidate, "REJECT"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3 mr-1" }), "Reject Candidate"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "disabled:opacity-40",
										disabled: Boolean(inspectCandidate.humanDecision),
										onClick: () => openConfirmDialog(inspectCandidate, "SHORTLIST"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 mr-1" }), "Shortlist Candidate"]
									})]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showCompareModal,
				onOpenChange: setShowCompareModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-4xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-xl font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "h-5 w-5 text-primary" }), "Side-by-Side Candidate Comparison"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Comparing ",
						compareList.length,
						" candidates",
						selectedJob ? ` for ${selectedJob.title}` : ""
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-3 overflow-x-auto text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2.5 w-1/4 font-semibold text-muted-foreground",
									children: "Evaluation Vector"
								}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
									className: "p-2.5 w-1/4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-sm text-foreground",
										children: c.name
									}), c.currentCompany && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: c.currentCompany
									})]
								}, c.id))]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "divide-y divide-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "ATS Match Score"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-2.5 font-bold text-sm text-foreground",
										children: [
											c.matchScore !== null ? `${c.matchScore}%` : "Not Screened",
											" (",
											c.effectiveDecision || "Review",
											")"
										]
									}, c.id))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "AI Recommendation"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 text-[11px] text-muted-foreground leading-normal",
										children: c.hiringRecommendation || "No recommendation generated"
									}, c.id))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "Key Strengths"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5",
										children: c.strengths.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1",
											children: c.strengths.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[9px] bg-primary/10 text-primary",
												children: s
											}, s))
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground italic",
											children: "—"
										})
									}, c.id))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "Missing Skills"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5",
										children: c.missingSkills.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1",
											children: c.missingSkills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-[9px] border-border text-muted-foreground",
												children: s
											}, s))
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground italic",
											children: "None noted"
										})
									}, c.id))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "Green & Red Flags"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-2.5 text-[11px] space-y-1",
										children: [
											c.greenFlags.map((gf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-foreground flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 shrink-0" }),
													" ",
													gf
												]
											}, gf)),
											c.redFlags.map((rf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-destructive flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "h-3 w-3 shrink-0" }),
													" ",
													rf
												]
											}, rf)),
											c.greenFlags.length === 0 && c.redFlags.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground italic",
												children: "—"
											})
										]
									}, c.id))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "HR Notes"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 text-[11px] text-muted-foreground",
										children: c.hrNotes || "No notes"
									}, c.id))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "Questions to Ask"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 text-[11px] text-muted-foreground",
										children: c.questionsToAsk.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "list-disc list-inside space-y-0.5",
											children: c.questionsToAsk.slice(0, 2).map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: q }, q))
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "italic",
											children: "—"
										})
									}, c.id))] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-medium text-muted-foreground",
										children: "Human Decision"
									}), compareList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5",
										children: c.humanDecision ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-xs",
											children: c.humanDecision
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "w-full h-8 text-xs",
											onClick: () => {
												setShowCompareModal(false);
												openConfirmDialog(c, "SHORTLIST");
											},
											children: "Shortlist"
										})
									}, c.id))] })
								]
							})]
						})
					})]
				})
			}),
			confirmDialog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(confirmDialog),
				onOpenChange: () => setConfirmDialog(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "flex items-center gap-2",
						children: confirmDialog.type === "SHORTLIST" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-5 w-5 text-primary" }), "Confirm Shortlist Decision"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-destructive" }), "Confirm Rejection Decision"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: confirmDialog.type === "SHORTLIST" ? `Are you sure you want to shortlist ${confirmDialog.candidate.name} for the ${selectedJob?.title || "selected"} position?` : `Please provide a documented rejection reason for ${confirmDialog.candidate.name}. A minimum 10-character explanation is required.` })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 py-2 text-xs",
						children: [
							confirmDialog.type === "REJECT" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "reject-reason",
										className: "font-semibold text-foreground",
										children: ["Rejection Reason ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "reject-reason",
										value: rejectReason,
										onChange: (e) => {
											setRejectReason(e.target.value);
											if (rejectReasonError && e.target.value.trim().length >= 10) setRejectReasonError("");
										},
										placeholder: "Provide a compliant, constructive reason (e.g. Lacks required 3+ years experience with Kubernetes)...",
										rows: 4,
										className: "text-xs",
										"aria-describedby": "reject-reason-help"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: "reject-reason-help",
										className: "flex justify-between items-center text-[11px] text-muted-foreground pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [rejectReason.trim().length, " / 10 minimum characters"] }), rejectReason.trim().length >= 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-medium",
											children: "Valid"
										})]
									}),
									rejectReasonError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-destructive text-[11px] font-medium",
										role: "alert",
										children: rejectReasonError
									})
								]
							}),
							confirmDialog.type === "SHORTLIST" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "shortlist-reason",
									className: "font-semibold text-foreground",
									children: "Optional Review Note"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "shortlist-reason",
									value: rejectReason,
									onChange: (e) => setRejectReason(e.target.value),
									placeholder: "Optional notes for the hiring team or interviewer...",
									rows: 3,
									className: "text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-3 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setConfirmDialog(null),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: confirmDialog.type === "REJECT" ? "destructive" : "default",
									disabled: screeningSubmitting || confirmDialog.type === "REJECT" && rejectReason.trim().length < 10,
									onClick: handleConfirmDecision,
									children: screeningSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin mr-1" }), "Saving..."] }) : confirmDialog.type === "SHORTLIST" ? "Confirm Shortlist" : "Confirm Rejection"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AIScreeningPage, AIScreeningPage as default };
