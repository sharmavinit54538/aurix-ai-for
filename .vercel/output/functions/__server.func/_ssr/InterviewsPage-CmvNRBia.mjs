import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, R as Star, Sr as CircleCheck, f as Video, h as User, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useRecruitment, t as newId } from "./useRecruitment-Cuznx8sx.mjs";
import { t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/InterviewsPage-CmvNRBia.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InterviewsPage() {
	const { interviews, candidates, moveStage, upsertInterview, refreshAll } = useRecruitment();
	const [tab, setTab] = (0, import_react.useState)("upcoming");
	const [showScheduleModal, setShowScheduleModal] = (0, import_react.useState)(false);
	const [showFeedbackModal, setShowFeedbackModal] = (0, import_react.useState)(false);
	const [showRescheduleModal, setShowRescheduleModal] = (0, import_react.useState)(false);
	const [showCancelModal, setShowCancelModal] = (0, import_react.useState)(false);
	const [showReminderModal, setShowReminderModal] = (0, import_react.useState)(false);
	const [selectedIv, setSelectedIv] = (0, import_react.useState)(null);
	const [rescheduleDate, setRescheduleDate] = (0, import_react.useState)("");
	const [rescheduleTime, setRescheduleTime] = (0, import_react.useState)("14:00");
	const [cancelReason, setCancelReason] = (0, import_react.useState)("");
	const [scheduleForm, setScheduleForm] = (0, import_react.useState)({
		candidateId: "",
		round: "Technical Round",
		interviewer: "",
		date: "",
		time: "10:00",
		duration: "45",
		meetingLink: "https://meet.google.com/abc-xyz-123"
	});
	const [feedbackForm, setFeedbackForm] = (0, import_react.useState)({
		recommendation: "PASS",
		rating: "4",
		feedback: "",
		interviewer: ""
	});
	const handleRescheduleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedIv || !rescheduleDate) return;
		await upsertInterview({
			...selectedIv,
			date: `${rescheduleDate}T${rescheduleTime}:00Z`,
			notes: `${selectedIv.notes || ""} [Rescheduled to ${rescheduleDate} ${rescheduleTime}]`
		});
		toast.success(`Interview with ${selectedIv.candidateName} rescheduled to ${rescheduleDate}!`);
		setShowRescheduleModal(false);
	};
	const handleCancelSubmit = async (e) => {
		e.preventDefault();
		if (!selectedIv) return;
		await upsertInterview({
			...selectedIv,
			status: "cancelled",
			notes: `${selectedIv.notes || ""} [Cancelled: ${cancelReason}]`
		});
		toast.info(`Interview with ${selectedIv.candidateName} cancelled.`);
		setShowCancelModal(false);
		setCancelReason("");
	};
	const upcoming = (0, import_react.useMemo)(() => interviews.filter((i) => i.status === "scheduled").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [interviews]);
	const completed = (0, import_react.useMemo)(() => interviews.filter((i) => i.status === "completed"), [interviews]);
	const days = (0, import_react.useMemo)(() => {
		const arr = [];
		for (let i = 0; i < 14; i++) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() + i);
			d.setHours(0, 0, 0, 0);
			const items = interviews.filter((iv) => {
				const id = new Date(iv.date);
				id.setHours(0, 0, 0, 0);
				return id.getTime() === d.getTime();
			});
			arr.push({
				date: d,
				items
			});
		}
		return arr;
	}, [interviews]);
	const handleScheduleSubmit = async (e) => {
		e.preventDefault();
		if (!scheduleForm.candidateId || !scheduleForm.interviewer || !scheduleForm.date) {
			toast.error("Please fill in all required details.");
			return;
		}
		const cand = candidates.find((c) => c.id === scheduleForm.candidateId);
		if (!cand) return;
		const newIv = {
			id: newId("iv"),
			candidateId: cand.id,
			candidateName: cand.name,
			jobTitle: cand.appliedPosition || "Position",
			interviewer: scheduleForm.interviewer,
			round: scheduleForm.round,
			date: `${scheduleForm.date}T${scheduleForm.time}:00Z`,
			durationMins: Number(scheduleForm.duration),
			meetingLink: scheduleForm.meetingLink,
			status: "scheduled"
		};
		try {
			if (cand.applicationId) {
				await apiInstance.post(`/applications/${cand.applicationId}/send-interview?round_names=${encodeURIComponent(scheduleForm.round)}`);
				moveStage(cand.applicationId, "interview");
			}
			await upsertInterview(newIv);
			toast.success("Interview scheduled successfully!");
			setShowScheduleModal(false);
			await refreshAll();
		} catch (err) {
			await upsertInterview(newIv);
			toast.success("Interview scheduled successfully (saved locally)!");
			setShowScheduleModal(false);
		}
	};
	const handleSubmitFeedback = async (e) => {
		e.preventDefault();
		if (!feedbackForm.interviewer || !feedbackForm.feedback) {
			toast.error("Interviewer Name and Feedback are required.");
			return;
		}
		const updatedIv = {
			...selectedIv,
			status: "completed",
			interviewer: feedbackForm.interviewer,
			rating: Number(feedbackForm.rating),
			feedback: feedbackForm.feedback
		};
		try {
			if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedIv.id)) {
				const decision = feedbackForm.recommendation.toLowerCase();
				const payload = {
					feedback: feedbackForm.feedback,
					score: `${feedbackForm.rating}/5`,
					interviewer_name: feedbackForm.interviewer
				};
				await apiInstance.patch(`/interviews/rounds/${selectedIv.id}/${decision}`, payload);
				toast.success(`Interview marked as completed (${feedbackForm.recommendation})!`);
			} else {
				await upsertInterview(updatedIv);
				toast.success("Feedback submitted successfully!");
			}
			setShowFeedbackModal(false);
			await refreshAll();
		} catch (err) {
			await upsertInterview(updatedIv);
			toast.success("Feedback submitted successfully (saved locally)!");
			setShowFeedbackModal(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setShowScheduleModal(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-4 w-4" }), "Schedule"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 inline-flex rounded-md border border-border bg-card/60 p-1",
			children: [
				{
					k: "upcoming",
					l: "Upcoming",
					c: upcoming.length
				},
				{
					k: "completed",
					l: "Completed",
					c: completed.length
				},
				{
					k: "calendar",
					l: "Calendar",
					c: interviews.length
				}
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setTab(t.k),
				className: `inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium cursor-pointer ${tab === t.k ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`,
				children: [t.l, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-muted px-1.5 text-[10px]",
					children: t.c
				})]
			}, t.k))
		}),
		tab !== "calendar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [(tab === "upcoming" ? upcoming : completed).map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
							name: iv.candidateName,
							size: 40
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/recruitment/candidates/$candidateId",
								params: { candidateId: iv.candidateId },
								className: "text-sm font-medium hover:underline",
								children: iv.candidateName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									iv.jobTitle,
									" · ",
									iv.round
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), new Date(iv.date).toLocaleString([], {
										month: "short",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-muted-foreground",
									children: [
										"· ",
										iv.durationMins,
										"m"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-muted-foreground" }), iv.interviewer]
								})
							]
						}),
						iv.status === "completed" && iv.rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex",
							children: Array.from({ length: 5 }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 ${j < (iv.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}` }, j))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "capitalize",
							children: iv.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [iv.status === "scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7 text-xs px-2",
									onClick: () => {
										setSelectedIv(iv);
										setFeedbackForm({
											recommendation: "PASS",
											rating: "4",
											feedback: iv.feedback || "",
											interviewer: iv.interviewer
										});
										setShowFeedbackModal(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3 text-emerald-500" }), "Feedback"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7 text-xs px-2",
									onClick: () => {
										setSelectedIv(iv);
										setShowRescheduleModal(true);
									},
									children: "Reschedule"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7 text-xs px-2 text-rose-600 hover:bg-rose-500/10",
									onClick: () => {
										setSelectedIv(iv);
										setShowCancelModal(true);
									},
									children: "Cancel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-7 text-xs px-2",
									onClick: () => {
										setSelectedIv(iv);
										setShowReminderModal(true);
									},
									children: "Reminder"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7 text-xs px-2",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: iv.meetingLink,
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "mr-1 h-3 w-3" }), "Join"]
								})
							})]
						})
					]
				}), iv.status === "completed" && iv.feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-background/40 p-3 text-xs text-muted-foreground border border-border/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground block mb-1",
						children: "Interviewer Feedback Note:"
					}), iv.feedback]
				})]
			}, iv.id)), !(tab === "upcoming" ? upcoming : completed).length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground",
				children: [
					"No ",
					tab,
					" interviews found."
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7",
			children: days.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `min-h-[140px] rounded-xl border border-border bg-card/60 p-3 backdrop-blur-xl ${d.items.length ? "ring-1 ring-foreground/10" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: d.date.toLocaleDateString([], { weekday: "short" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-sm font-semibold",
						children: d.date.getDate()
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: d.items.map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "block rounded-md bg-accent/60 px-2 py-1 text-[10px] group relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: new Date(iv.date).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/recruitment/candidates/$candidateId",
								params: { candidateId: iv.candidateId },
								className: "truncate block font-semibold hover:underline",
								children: iv.candidateName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-muted-foreground",
								children: iv.round
							})
						]
					}, iv.id))
				})]
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showScheduleModal,
			onOpenChange: setShowScheduleModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Schedule Interview Round" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Set up a new interview slot for a candidate in the pipeline." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleScheduleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sched-cand",
								children: "Select Candidate *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "sched-cand",
								value: scheduleForm.candidateId,
								onChange: (e) => setScheduleForm({
									...scheduleForm,
									candidateId: e.target.value
								}),
								className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "-- Choose Candidate --"
								}), candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [
										c.name,
										" (",
										c.appliedPosition || "No Position",
										")"
									]
								}, c.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sched-round",
								children: "Interview Round"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "sched-round",
								value: scheduleForm.round,
								onChange: (e) => setScheduleForm({
									...scheduleForm,
									round: e.target.value
								}),
								className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Screening Round",
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sched-interviewer",
								children: "Interviewer Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sched-interviewer",
								placeholder: "e.g. John Doe (Tech Lead)",
								value: scheduleForm.interviewer,
								onChange: (e) => setScheduleForm({
									...scheduleForm,
									interviewer: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sched-date",
									children: "Date *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sched-date",
									type: "date",
									value: scheduleForm.date,
									onChange: (e) => setScheduleForm({
										...scheduleForm,
										date: e.target.value
									}),
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sched-time",
									children: "Time *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sched-time",
									type: "time",
									value: scheduleForm.time,
									onChange: (e) => setScheduleForm({
										...scheduleForm,
										time: e.target.value
									}),
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sched-duration",
									children: "Duration (Minutes)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sched-duration",
									type: "number",
									min: "15",
									max: "180",
									value: scheduleForm.duration,
									onChange: (e) => setScheduleForm({
										...scheduleForm,
										duration: e.target.value
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sched-mode",
									children: "Interview Mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: "ONLINE",
									disabled: true
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sched-link",
								children: "Meeting Link (Google Meet / Zoom)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sched-link",
								value: scheduleForm.meetingLink,
								onChange: (e) => setScheduleForm({
									...scheduleForm,
									meetingLink: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowScheduleModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Schedule Interview"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showFeedbackModal,
			onOpenChange: setShowFeedbackModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Submit Interview Feedback" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Record the feedback, ratings, and recommendation for ",
					selectedIv?.candidateName,
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmitFeedback,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "feed-interviewer",
								children: "Interviewer Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "feed-interviewer",
								placeholder: "Interviewer's name",
								value: feedbackForm.interviewer,
								onChange: (e) => setFeedbackForm({
									...feedbackForm,
									interviewer: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "feed-rec",
									children: "Recommendation *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "feed-rec",
									value: feedbackForm.recommendation,
									onChange: (e) => setFeedbackForm({
										...feedbackForm,
										recommendation: e.target.value
									}),
									className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
									required: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "PASS",
											children: "Pass / Move Forward"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "REJECT",
											children: "Reject Candidate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "HOLD",
											children: "Put on Hold"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "feed-rating",
									children: "Rating (1 to 5 Stars) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "feed-rating",
									value: feedbackForm.rating,
									onChange: (e) => setFeedbackForm({
										...feedbackForm,
										rating: e.target.value
									}),
									className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
									required: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "5",
											children: "5 - Excellent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "4",
											children: "4 - Strong Match"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "3",
											children: "3 - Good"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2",
											children: "2 - Weak Match"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "1",
											children: "1 - Do Not Hire"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "feed-notes",
								children: "Evaluation Notes *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "feed-notes",
								placeholder: "Detailed notes on key strengths, technical skills, areas of concern, culture fit...",
								rows: 5,
								value: feedbackForm.feedback,
								onChange: (e) => setFeedbackForm({
									...feedbackForm,
									feedback: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowFeedbackModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Submit Feedback"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showRescheduleModal,
			onOpenChange: setShowRescheduleModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRescheduleSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold",
							children: "Reschedule Interview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Select a new date and time for ",
							selectedIv?.candidateName,
							" (",
							selectedIv?.round,
							")."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "New Date *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								className: "mt-1 h-9 text-xs",
								value: rescheduleDate,
								onChange: (e) => setRescheduleDate(e.target.value),
								required: true
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "New Time *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								className: "mt-1 h-9 text-xs",
								value: rescheduleTime,
								onChange: (e) => setRescheduleTime(e.target.value),
								required: true
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setShowRescheduleModal(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Confirm Reschedule"
						})] })
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showCancelModal,
			onOpenChange: setShowCancelModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCancelSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold text-rose-600",
							children: "Cancel Interview Session"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"State the cancellation reason for ",
							selectedIv?.candidateName,
							"."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-3 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Cancellation Reason *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1 text-xs",
								rows: 3,
								placeholder: "e.g. Candidate accepted another role / Interviewer unavailable",
								value: cancelReason,
								onChange: (e) => setCancelReason(e.target.value),
								required: true
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setShowCancelModal(false),
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "destructive",
							children: "Confirm Cancellation"
						})] })
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showReminderModal,
			onOpenChange: setShowReminderModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base font-bold",
						children: "Interview Reminder Notification"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Preview automated notification to be delivered 24h prior." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3 py-2 text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl border border-border bg-muted/30 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground",
								children: "Email / SMS Dispatch:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground leading-relaxed whitespace-pre-line",
								children: [
									"Hi ",
									selectedIv?.candidateName,
									", this is a reminder for your upcoming ",
									selectedIv?.round,
									" interview scheduled with ",
									selectedIv?.interviewer,
									" on ",
									selectedIv?.date ? new Date(selectedIv.date).toLocaleString([], {
										dateStyle: "medium",
										timeStyle: "short"
									}) : "scheduled time",
									".",
									"\n",
									"Join via: ",
									selectedIv?.meetingLink
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setShowReminderModal(false),
						children: "Close"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							toast.info(`Reminder preview prepared for ${selectedIv?.candidateName || "candidate"}. Dispatch endpoint pending backend support.`);
							setShowReminderModal(false);
						},
						children: "Send Reminder Now"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { InterviewsPage };
