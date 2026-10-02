import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $n as Earth, Br as Calendar, Bt as MapPin, F as Tag, H as Sparkles, It as MessageSquare, Jr as Briefcase, Ln as FileText, Q as Send, R as Star, Sr as CircleCheck, Vt as Mail, a as X, bn as GraduationCap, er as Download, mi as Activity, oi as Award, vt as Phone } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useRecruitment, t as newId } from "./useRecruitment-Cuznx8sx.mjs";
import { a as Progress } from "./Shared-C_skH1kb.mjs";
import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
import { a as ScoreRing, c as fmtMoney, o as StageBadge, s as fmtDate, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CandidateProfilePage-o3C3J94G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CandidateProfilePage() {
	const { candidateId } = useParams({ from: "/dashboard/recruitment/candidates/$candidateId" });
	const { candidates, moveStage, addNote: saveNote, upsertInterview, upsertOffer } = useRecruitment();
	const candidate = candidates.find((c) => c.id === candidateId);
	const [tab, setTab] = (0, import_react.useState)("resume");
	const [note, setNote] = (0, import_react.useState)("");
	const [freshScore, setFreshScore] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!candidateId) return;
		api.get(`/candidates/${candidateId}`).then((res) => {
			if (res?.data) {
				const d = res.data;
				setFreshScore({
					ats: typeof d.ats_score === "number" ? d.ats_score : null,
					jobMatch: typeof d.job_match === "number" ? d.job_match : null,
					skillCoverage: Array.isArray(d.skills) && d.skills.length > 0 ? Math.min(100, d.skills.length * 10) : null
				});
			}
		}).catch(() => {});
	}, [candidateId]);
	const displayAts = freshScore !== null ? freshScore.ats : candidate?.atsScore ?? null;
	const displayJobMatch = freshScore !== null ? freshScore.jobMatch : candidate?.jobMatch ?? null;
	const displaySkillCoverage = freshScore !== null ? freshScore.skillCoverage : null;
	const [showEmailModal, setShowEmailModal] = (0, import_react.useState)(false);
	const [showScheduleModal, setShowScheduleModal] = (0, import_react.useState)(false);
	const [showOfferModal, setShowOfferModal] = (0, import_react.useState)(false);
	const [emailSubject, setEmailSubject] = (0, import_react.useState)("");
	const [emailBody, setEmailBody] = (0, import_react.useState)("");
	const [sendingEmail, setSendingEmail] = (0, import_react.useState)(false);
	const [scheduleRound, setScheduleRound] = (0, import_react.useState)("Technical Round");
	const [scheduleInterviewer, setScheduleInterviewer] = (0, import_react.useState)("");
	const [scheduleDate, setScheduleDate] = (0, import_react.useState)("");
	const [scheduleTime, setScheduleTime] = (0, import_react.useState)("10:00");
	const [scheduleLink, setScheduleLink] = (0, import_react.useState)("https://meet.google.com/abc-xyz-123");
	const [scheduling, setScheduling] = (0, import_react.useState)(false);
	const [offerSalary, setOfferSalary] = (0, import_react.useState)("800000");
	const [offerJoiningDate, setOfferJoiningDate] = (0, import_react.useState)("");
	const [releasingOffer, setReleasingOffer] = (0, import_react.useState)(false);
	if (!candidate) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: ["Candidate not found. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard/recruitment/candidates",
			className: "underline",
			children: "Back to list"
		})]
	});
	if (candidate && !emailSubject) {
		setEmailSubject(`Aurix Job Application Update - ${candidate.appliedPosition}`);
		setEmailBody(`Dear ${candidate.name},\n\nThank you for taking the time to apply for the ${candidate.appliedPosition} role at Aurix.\n\nWe have reviewed your application and would love to move you forward to the next stage of our recruitment process.\n\nBest regards,\nRecruitment Team\nAurix`);
	}
	function move(s) {
		if (candidate.applicationId) {
			moveStage(candidate.applicationId, s);
			toast.success(`Candidate moved to ${STAGE_LABEL[s]} stage.`);
		} else toast.error("This candidate has no active application linked.");
	}
	function addNote() {
		if (note.trim()) {
			saveNote(candidate.id, note.trim());
			setNote("");
			toast.success("Private note saved successfully.");
		}
	}
	const handleSendEmail = async (e) => {
		e.preventDefault();
		setSendingEmail(true);
		try {
			await new Promise((r) => setTimeout(r, 1e3));
			toast.success(`Email dispatched to ${candidate.email} successfully!`);
			setShowEmailModal(false);
		} catch (err) {
			toast.error("Failed to send email. Please try again.");
		} finally {
			setSendingEmail(false);
		}
	};
	const handleScheduleInterview = async (e) => {
		e.preventDefault();
		if (!scheduleInterviewer || !scheduleDate) {
			toast.error("Please fill in all required interview details.");
			return;
		}
		setScheduling(true);
		try {
			await upsertInterview({
				id: newId("iv"),
				candidateId: candidate.id,
				candidateName: candidate.name,
				jobTitle: candidate.appliedPosition,
				interviewer: scheduleInterviewer,
				round: scheduleRound,
				date: `${scheduleDate}T${scheduleTime}:00Z`,
				durationMins: 45,
				meetingLink: scheduleLink,
				status: "scheduled"
			});
			if (candidate.applicationId) await moveStage(candidate.applicationId, "interview");
			toast.success("Interview slot booked and calendar invite dispatched!");
			setShowScheduleModal(false);
		} catch (err) {
			toast.error("Failed to schedule interview.");
		} finally {
			setScheduling(false);
		}
	};
	const handleReleaseOffer = async (e) => {
		e.preventDefault();
		if (!offerJoiningDate) {
			toast.error("Please specify a joining date.");
			return;
		}
		setReleasingOffer(true);
		try {
			await upsertOffer({
				id: newId("o"),
				applicationId: candidate.applicationId,
				candidateId: candidate.id,
				candidateName: candidate.name,
				jobId: candidate.jobId,
				jobTitle: candidate.appliedPosition,
				salary: Number(offerSalary),
				currency: "INR",
				joiningDate: offerJoiningDate,
				benefits: [
					"Health Insurance",
					"Stock Options",
					"Remote Allowance"
				],
				status: "sent",
				approvals: []
			});
			if (candidate.applicationId) await moveStage(candidate.applicationId, "offer");
			toast.success("Job offer generated, signed, and dispatched to candidate!");
			setShowOfferModal(false);
		} catch (err) {
			toast.error("Failed to release offer.");
		} finally {
			setReleasingOffer(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: candidate.name,
			description: `${candidate.appliedPosition} · Applied ${fmtDate(candidate.appliedAt)}`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setShowEmailModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mr-2 h-4 w-4" }), "Email"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setShowScheduleModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-4 w-4" }), "Schedule"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowOfferModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), "Send Offer"]
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-5 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
										name: candidate.name,
										size: 64
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-lg font-semibold",
												children: candidate.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													candidate.currentRole,
													" @ ",
													candidate.currentCompany
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBadge, { stage: candidate.stage })
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
										value: displayAts,
										size: 64
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: Mail,
										text: candidate.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: Phone,
										text: candidate.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: MapPin,
										text: candidate.location
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: Earth,
										text: `${candidate.yearsExperience}y exp`
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-1.5",
								children: candidate.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "mr-1 h-3 w-3" }), t]
								}, t))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold",
								children: "Move to stage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => move(s),
								className: `rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ring-1 transition-all ${candidate.stage === s ? "bg-foreground text-background ring-foreground" : "bg-card text-muted-foreground ring-border hover:bg-accent"}`,
								children: STAGE_LABEL[s]
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 font-display text-sm font-semibold",
								children: "Match insights"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
										label: "ATS Score",
										value: displayAts
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
										label: "Skill Match",
										value: displayJobMatch
									}),
									displaySkillCoverage !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
										label: "Skills Coverage",
										value: displaySkillCoverage
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-xl border border-border bg-background/40 p-3 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "AI summary:"
									}),
									" ",
									candidate.summary
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 font-display text-sm font-semibold",
								children: "Compensation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Expected",
								value: fmtMoney(candidate.expectedSalary || 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Notice period",
								value: `${candidate.noticeDays} days`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Source",
								value: candidate.source
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 inline-flex rounded-md border border-border bg-card/60 p-1",
						children: [
							{
								k: "resume",
								l: "Resume",
								i: FileText
							},
							{
								k: "timeline",
								l: "Timeline",
								i: Activity
							},
							{
								k: "feedback",
								l: "Feedback",
								i: Star
							},
							{
								k: "notes",
								l: "Notes",
								i: MessageSquare
							},
							{
								k: "documents",
								l: "Documents",
								i: Download
							}
						].map((t) => {
							const Icon = t.i;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setTab(t.k),
								className: `inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${tab === t.k ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), t.l]
							}, t.k);
						})
					}),
					tab === "resume" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeView, { candidate }) : null,
					tab === "timeline" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "relative space-y-4 border-l border-border pl-5",
							children: candidate.timeline.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full text-brand-foreground shadow-glow",
										style: { background: "var(--gradient-brand)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-2.5 w-2.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: t.title
									}),
									t.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: t.detail
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											fmtDate(t.at),
											" · ",
											t.actor ?? "system"
										]
									})
								]
							}, t.id))
						})
					}) : null,
					tab === "feedback" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: candidate.feedback.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground",
							children: "No interview feedback yet."
						}) : candidate.feedback.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: f.interviewer
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										f.round,
										" · ",
										fmtDate(f.date)
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex",
									children: Array.from({ length: 5 }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 ${j < f.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}` }, j))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: f.notes
							})]
						}, i))
					}) : null,
					tab === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Add a private note about this candidate…",
								rows: 3
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: addNote,
									children: "Add note"
								})
							})]
						}), candidate.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card/60 p-3 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: n.author
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(n.at) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: n.text
							})]
						}, n.id))]
					}) : null,
					tab === "documents" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
						children: candidate.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3 backdrop-blur-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: d.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: d.type
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
								})
							]
						}, d.name))
					}) : null
				]
			})]
		}),
		showEmailModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
						onClick: () => setShowEmailModal(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold mb-1",
						children: "Compose Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mb-4",
						children: [
							"Send a transactional application update to ",
							candidate.name,
							" (",
							candidate.email,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSendEmail,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Subject"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: emailSubject,
									onChange: (e) => setEmailSubject(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Message Body"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: emailBody,
									onChange: (e) => setEmailBody(e.target.value),
									rows: 8,
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setShowEmailModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: sendingEmail,
									children: sendingEmail ? "Sending..." : "Send Email"
								})]
							})
						]
					})
				]
			})
		}),
		showScheduleModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
						onClick: () => setShowScheduleModal(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold mb-1",
						children: "Schedule Interview Round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mb-4",
						children: ["Set up an interview invite for ", candidate.name]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleScheduleInterview,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Interview Round"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: scheduleRound,
									onChange: (e) => setScheduleRound(e.target.value),
									className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Screening",
											children: "Screening Round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Technical Round",
											children: "Technical Round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Manager Round",
											children: "Manager Round"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "HR Round",
											children: "HR Round"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Interviewer Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: scheduleInterviewer,
									onChange: (e) => setScheduleInterviewer(e.target.value),
									placeholder: "e.g. John Doe (Engineering Manager)",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium",
										children: "Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: scheduleDate,
										onChange: (e) => setScheduleDate(e.target.value),
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium",
										children: "Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: scheduleTime,
										onChange: (e) => setScheduleTime(e.target.value),
										required: true
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Meeting Link (Google Meet / Zoom)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: scheduleLink,
									onChange: (e) => setScheduleLink(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setShowScheduleModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: scheduling,
									children: scheduling ? "Scheduling..." : "Schedule Interview"
								})]
							})
						]
					})
				]
			})
		}),
		showOfferModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground",
						onClick: () => setShowOfferModal(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold mb-1",
						children: "Release Job Offer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mb-4",
						children: ["Generate and release a formal job offer to ", candidate.name]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReleaseOffer,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Offered CTC (INR per annum)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: offerSalary,
									onChange: (e) => setOfferSalary(e.target.value),
									placeholder: "e.g. 1200000",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Joining Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: offerJoiningDate,
									onChange: (e) => setOfferJoiningDate(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium",
									children: "Offered Benefits Included"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs space-y-1.5 pl-1 pt-1 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2",
											children: "✓ Standard OFC360 Health Insurance (Group Plan)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2",
											children: "✓ Equity / Employee Stock Options (ESOPs)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2",
											children: "✓ Remote Home-Office Setup Allowance"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setShowOfferModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: releasingOffer,
									children: releasingOffer ? "Releasing..." : "Release Offer"
								})]
							})
						]
					})
				]
			})
		})
	] });
}
function Info$1({ icon: Icon, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-1.5 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: text
		})]
	});
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-border/60 py-1.5 text-sm last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: value
		})]
	});
}
function ScoreRow({ label, value }) {
	const hasScore = value != null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-center justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: hasScore ? `${value}%` : "—"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: hasScore ? value : 0 })] });
}
function ResumeView({ candidate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl font-semibold",
					children: candidate.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						candidate.email,
						" · ",
						candidate.phone,
						" · ",
						candidate.location
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), candidate.resumeName]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Summary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm",
					children: candidate.summary
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Skills"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: candidate.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: s
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3 w-3" }), "Experience"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: candidate.experience.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-background/40 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-medium",
								children: [
									e.role,
									" · ",
									e.company
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									e.start,
									" – ",
									e.end
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 list-inside list-disc text-xs text-muted-foreground",
							children: e.highlights.map((h, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: h }, j))
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-3 w-3" }), "Education"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: candidate.education.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border bg-background/40 p-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: e.degree
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								e.school,
								" · ",
								e.start,
								"–",
								e.end
							]
						})]
					}, i))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3 w-3" }), "Certifications & Languages"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Certifications:"
						}),
						" ",
						candidate.certifications.join(", ") || "—"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Languages:"
						}),
						" ",
						candidate.languages.join(", ")
					] })]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Projects"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: candidate.projects.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border bg-background/40 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: p.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-wrap gap-1",
								children: p.tech.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: t
								}, t))
							})
						]
					}, i))
				})]
			})
		]
	});
}
//#endregion
export { CandidateProfilePage };
