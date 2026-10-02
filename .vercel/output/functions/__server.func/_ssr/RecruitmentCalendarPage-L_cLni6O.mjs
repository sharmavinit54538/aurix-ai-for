import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, Dr as ChevronRight, Or as ChevronLeft, f as Video, ht as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as useRecruitment, t as newId } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentCalendarPage-L_cLni6O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function startOfWeek(d) {
	const x = new Date(d);
	x.setDate(x.getDate() - x.getDay());
	x.setHours(0, 0, 0, 0);
	return x;
}
function RecruitmentCalendarPage() {
	const { interviews, candidates, moveStage, upsertInterview, refreshAll } = useRecruitment();
	const [anchor, setAnchor] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [showScheduleModal, setShowScheduleModal] = (0, import_react.useState)(false);
	const [scheduleForm, setScheduleForm] = (0, import_react.useState)({
		candidateId: "",
		round: "Technical Round",
		interviewer: "",
		date: "",
		time: "10:00",
		duration: "45",
		meetingLink: "https://meet.google.com/abc-xyz-123"
	});
	const week = startOfWeek(anchor);
	const days = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(week);
		d.setDate(week.getDate() + i);
		return d;
	});
	const byDay = (0, import_react.useMemo)(() => {
		const m = {};
		interviews.forEach((iv) => {
			const key = new Date(iv.date).toDateString();
			(m[key] ||= []).push(iv);
		});
		return m;
	}, [interviews]);
	async function onDrop(e, day) {
		e.preventDefault();
		const id = e.dataTransfer.getData("text/iv");
		const iv = interviews.find((x) => x.id === id);
		if (!iv) return;
		const next = new Date(iv.date);
		next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
		const updatedIv = {
			...iv,
			date: next.toISOString()
		};
		try {
			await upsertInterview(updatedIv);
			toast.success(`Rescheduled ${iv.candidateName}'s interview to ${day.toLocaleDateString([], {
				month: "short",
				day: "numeric"
			})}`);
		} catch (err) {
			toast.error("Failed to reschedule interview.");
		}
	}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Interview Calendar",
			description: "Drag-and-drop scheduling. Connect Google Calendar, Outlook, Zoom, Google Meet.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => toast.success("Redirecting to Zoom Integration authorization..."),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "mr-2 h-4 w-4" }), "Connect Zoom"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => toast.success("Syncing Google Calendar with OFC360..."),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-4 w-4" }), "Sync Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowScheduleModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Schedule"]
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setAnchor((d) => {
							const n = new Date(d);
							n.setDate(n.getDate() - 7);
							return n;
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-lg font-semibold",
						children: [
							days[0].toLocaleDateString("en-US", {
								month: "short",
								day: "numeric"
							}),
							" – ",
							days[6].toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setAnchor((d) => {
							const n = new Date(d);
							n.setDate(n.getDate() + 7);
							return n;
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setAnchor(/* @__PURE__ */ new Date()),
						children: "Today"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				children: [interviews.length, " interviews"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-7 gap-2",
			children: days.map((d) => {
				const list = byDay[d.toDateString()] ?? [];
				const today = d.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onDragOver: (e) => e.preventDefault(),
					onDrop: (e) => onDrop(e, d),
					className: `min-h-[340px] rounded-xl border ${today ? "border-foreground/40 bg-card/85 ring-1 ring-foreground/15" : "border-border bg-card/60"} p-2 backdrop-blur-xl transition-colors hover:border-foreground/20`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-baseline justify-between px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: d.toLocaleDateString("en-US", { weekday: "short" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-base font-semibold ${today ? "text-primary font-bold" : ""}`,
							children: d.getDate()
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: list.sort((a, b) => +new Date(a.date) - +new Date(b.date)).map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							draggable: true,
							onDragStart: (e) => e.dataTransfer.setData("text/iv", iv.id),
							className: "cursor-grab rounded-md border border-border bg-background/60 p-1.5 text-[11px] shadow-sm transition-all hover:bg-accent/20 active:cursor-grabbing",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium leading-tight text-primary",
									children: new Date(iv.date).toLocaleTimeString([], {
										hour: "numeric",
										minute: "2-digit"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/recruitment/candidates/$candidateId",
									params: { candidateId: iv.candidateId },
									className: "truncate font-semibold hover:underline block cursor-pointer text-foreground",
									children: iv.candidateName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[10px] text-muted-foreground",
									children: iv.round
								})
							]
						}, iv.id))
					})]
				}, d.toISOString());
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showScheduleModal,
			onOpenChange: setShowScheduleModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Schedule Interview Round" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Set up a new interview slot for a candidate." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
								placeholder: "e.g. John Doe",
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
		})
	] });
}
//#endregion
export { RecruitmentCalendarPage };
