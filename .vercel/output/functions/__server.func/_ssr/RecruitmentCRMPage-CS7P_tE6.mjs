import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, $r as BookmarkCheck, Br as Calendar, Dr as ChevronRight, It as MessageSquare, L as StickyNote, Vt as Mail, Zr as Bookmark, a as X, en as Link2, fn as Inbox, ht as Plus, ni as Bell, p as Users, pr as Clock, vt as Phone } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { o as StageBadge, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentCRMPage-CS7P_tE6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CH = {
	email: {
		label: "Email",
		Icon: Mail,
		color: "text-sky-500",
		bg: "bg-sky-500/10"
	},
	call: {
		label: "Call",
		Icon: Phone,
		color: "text-emerald-500",
		bg: "bg-emerald-500/10"
	},
	sms: {
		label: "SMS",
		Icon: MessageSquare,
		color: "text-violet-500",
		bg: "bg-violet-500/10"
	},
	linkedin: {
		label: "LinkedIn",
		Icon: Link2,
		color: "text-blue-500",
		bg: "bg-blue-500/10"
	},
	note: {
		label: "Note",
		Icon: StickyNote,
		color: "text-amber-500",
		bg: "bg-amber-500/10"
	}
};
function fmtTs(d) {
	return new Date(d).toLocaleString("en-IN", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function fmtDate(d) {
	return new Date(d).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function RecruitmentCRMPage() {
	const candidates = useRecruitment((s) => s.candidates);
	const [search, setSearch] = (0, import_react.useState)("");
	const [activeId, setActiveId] = (0, import_react.useState)(candidates[0]?.id ?? "");
	(0, import_react.useEffect)(() => {
		if ((!activeId || !candidates.some((c) => c.id === activeId)) && candidates.length > 0) setActiveId(candidates[0].id);
	}, [candidates, activeId]);
	const [watchSet, setWatchSet] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return /* @__PURE__ */ new Set();
		try {
			const saved = JSON.parse(localStorage.getItem("crm.watch") ?? "[]");
			const clean = (Array.isArray(saved) ? saved : []).filter((id) => ![
				"cand-1",
				"cand-101",
				"cand-201"
			].includes(id));
			return new Set(clean);
		} catch {
			return /* @__PURE__ */ new Set();
		}
	});
	(0, import_react.useEffect)(() => {
		if (candidates.length > 0) setWatchSet((prev) => {
			const clean = new Set([...prev].filter((id) => candidates.some((c) => c.id === id)));
			if (clean.size !== prev.size) {
				localStorage.setItem("crm.watch", JSON.stringify([...clean]));
				return clean;
			}
			return prev;
		});
	}, [candidates]);
	const [filterWatch, setFilterWatch] = (0, import_react.useState)(false);
	const [channel, setChannel] = (0, import_react.useState)("note");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [followDate, setFollowDate] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [localNotes, setLocalNotes] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return {};
		try {
			const saved = localStorage.getItem("ofc360:crm_notes");
			return saved ? JSON.parse(saved) : {};
		} catch {
			return {};
		}
	});
	const [apiNotes, setApiNotes] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const active = (0, import_react.useMemo)(() => candidates.find((c) => c.id === activeId), [candidates, activeId]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = candidates;
		if (filterWatch) list = list.filter((c) => watchSet.has(c.id));
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter((c) => c.name.toLowerCase().includes(q) || c.appliedPosition.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
		}
		return list.slice(0, 60);
	}, [
		candidates,
		search,
		filterWatch,
		watchSet
	]);
	(0, import_react.useEffect)(() => {
		if (!activeId || apiNotes[activeId] !== void 0) return;
		setLoading(true);
		api.get(`/crm/notes/${activeId}`).then((res) => {
			const list = res?.data ?? [];
			setApiNotes((n) => ({
				...n,
				[activeId]: list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			}));
		}).catch(() => setApiNotes((n) => ({
			...n,
			[activeId]: []
		}))).finally(() => setLoading(false));
	}, [activeId, apiNotes]);
	const notes = (0, import_react.useMemo)(() => {
		const combined = {};
		candidates.forEach((cand) => {
			const list = [];
			if (apiNotes[cand.id]) list.push(...apiNotes[cand.id]);
			if (localNotes[cand.id]) localNotes[cand.id].forEach((ln) => {
				if (!list.some((existing) => existing.id === ln.id)) list.push(ln);
			});
			if (Array.isArray(cand.notes)) cand.notes.forEach((n) => {
				const noteId = n.id || `cand-note-${n.at}`;
				if (!list.some((existing) => existing.id === noteId)) list.push({
					id: noteId,
					candidate_id: cand.id,
					author_id: n.author || "Recruiter",
					channel: "note",
					subject: "Candidate Note",
					note_text: n.text,
					follow_up_date: null,
					created_at: n.at || (/* @__PURE__ */ new Date()).toISOString()
				});
			});
			if (Array.isArray(cand.timeline)) cand.timeline.forEach((tl) => {
				const tlId = tl.id || `tl-${tl.at}`;
				if (!list.some((existing) => existing.id === tlId)) list.push({
					id: tlId,
					candidate_id: cand.id,
					author_id: tl.actor || "System",
					channel: tl.kind === "email" ? "email" : tl.kind === "interview" ? "call" : "note",
					subject: tl.title,
					note_text: tl.detail || tl.title,
					follow_up_date: null,
					created_at: tl.at || (/* @__PURE__ */ new Date()).toISOString()
				});
			});
			combined[cand.id] = list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
		});
		return combined;
	}, [
		candidates,
		apiNotes,
		localNotes
	]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("crm.watch", JSON.stringify([...watchSet]));
	}, [watchSet]);
	function toggleWatch(id) {
		setWatchSet((s) => {
			const n = new Set(s);
			n.has(id) ? n.delete(id) : n.add(id);
			return n;
		});
	}
	async function logActivity() {
		if (!active || !body.trim()) return;
		setSaving(true);
		const updatedCandidateNotes = [{
			id: `crm-${Date.now()}`,
			candidate_id: active.id,
			author_id: "Recruiter",
			channel,
			subject: subject.trim() || null,
			note_text: body.trim(),
			follow_up_date: followDate || null,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}, ...localNotes[active.id] ?? []];
		const updatedLocal = {
			...localNotes,
			[active.id]: updatedCandidateNotes
		};
		setLocalNotes(updatedLocal);
		try {
			localStorage.setItem("ofc360:crm_notes", JSON.stringify(updatedLocal));
		} catch {}
		try {
			await api.post("/crm/notes", {
				candidate_id: active.id,
				channel,
				subject: subject.trim() || null,
				note_text: body.trim(),
				follow_up_date: followDate || null
			});
			toast.success("Activity touchpoint logged");
		} catch {
			toast.success("Activity logged and saved");
		} finally {
			setSubject("");
			setBody("");
			setFollowDate("");
			setSaving(false);
		}
	}
	const grouped = (0, import_react.useMemo)(() => {
		const list = notes[activeId] ?? [];
		const g = {};
		for (const n of list) {
			const day = new Date(n.created_at).toDateString();
			(g[day] ??= []).push(n);
		}
		return Object.entries(g);
	}, [notes, activeId]);
	const followUps = (0, import_react.useMemo)(() => {
		(/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		return Object.entries(notes).flatMap(([cid, arr]) => {
			const cand = candidates.find((c) => c.id === cid);
			if (!cand) return [];
			return arr.filter((n) => n.follow_up_date).map((n) => ({
				n,
				cand
			}));
		}).sort((a, b) => (a.n.follow_up_date ?? "").localeCompare(b.n.follow_up_date ?? ""));
	}, [notes, candidates]);
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: "No candidates yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: "Add candidates to your pipeline to start tracking CRM outreach."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/recruitment/candidates",
					children: "Go to Candidates"
				})
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_280px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search…",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "pl-8 h-9 text-sm"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: filterWatch ? "default" : "outline",
							className: "h-9 px-3",
							onClick: () => setFilterWatch((v) => !v),
							title: "Watchlist",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-3.5 w-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card/60 py-2 px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: candidates.length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Candidates"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card/60 py-2 px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: watchSet.size
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Watching"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[calc(100vh-300px)] overflow-y-auto divide-y divide-border/40",
							children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center text-xs text-muted-foreground",
								children: "No results."
							}) : filtered.map((c) => {
								const isActive = c.id === activeId;
								const watched = watchSet.has(c.id);
								const cnt = notes[c.id]?.length ?? 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveId(c.id),
									className: `group flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/40"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
											name: c.name,
											size: 30
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate text-sm font-medium",
													children: c.name
												}), watched && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-2.5 w-2.5 fill-foreground shrink-0" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-[10px] text-muted-foreground",
												children: c.appliedPosition
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-end gap-1 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBadge, { stage: c.stage }), cnt > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[9px] text-muted-foreground",
												children: [cnt, " notes"]
											})]
										})
									]
								}, c.id);
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex flex-col gap-4 min-w-0",
				children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
								name: active.name,
								size: 52
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-lg font-semibold",
										children: active.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											active.appliedPosition,
											" · ",
											active.email
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBadge, { stage: active.stage }), active.skills.slice(0, 4).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[9px]",
											children: s
										}, s))]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 items-end shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: watchSet.has(active.id) ? "default" : "outline",
									onClick: () => toggleWatch(active.id),
									className: "h-8 gap-1.5",
									children: watchSet.has(active.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-3.5 w-3.5" }), "Watching"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-3.5 w-3.5" }), "Watch"] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									asChild: true,
									className: "h-8 gap-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/dashboard/recruitment/candidates/$candidateId",
										params: { candidateId: active.id },
										children: ["Profile ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 text-sm font-semibold",
								children: "Log Activity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex flex-wrap gap-1.5",
								children: Object.keys(CH).map((ch) => {
									const { label, Icon, color } = CH[ch];
									const sel = channel === ch;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setChannel(ch),
										className: `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${sel ? "border-transparent bg-foreground text-background shadow" : "border-border bg-background/40 hover:bg-accent/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3.5 w-3.5 ${sel ? "" : color}` }), label]
									}, ch);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Subject / summary (optional)",
								value: subject,
								onChange: (e) => setSubject(e.target.value),
								className: "mb-2 h-9 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								placeholder: `${CH[channel].label} notes…`,
								rows: 3,
								value: body,
								onChange: (e) => setBody(e.target.value),
								className: "text-sm resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: followDate,
										onChange: (e) => setFollowDate(e.target.value),
										className: "h-8 text-xs flex-1",
										title: "Follow-up date (optional)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: logActivity,
									disabled: !body.trim() || saving,
									className: "h-8 gap-1.5",
									children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Log"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Communication Timeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: [notes[activeId]?.length ?? 0, " activities"]
							})]
						}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), "Loading…"]
						}) : grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "mb-2 h-6 w-6 opacity-40" }),
								"No activities yet.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 text-[10px]",
									children: "Use the form above to log the first touchpoint."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: grouped.map(([day, dayNotes]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-medium text-muted-foreground",
										children: new Date(day).toLocaleDateString("en-IN", {
											day: "2-digit",
											month: "short",
											year: "numeric"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: dayNotes.map((n) => {
									const { Icon, color, bg, label } = CH[n.channel in CH ? n.channel : "note"];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 rounded-xl border border-border bg-background/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `mt-0.5 shrink-0 grid h-7 w-7 place-items-center rounded-lg ${bg}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3.5 w-3.5 ${color}` })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-sm font-medium",
															children: n.subject || label
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "text-[9px] capitalize",
															children: label
														}),
														n.follow_up_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-medium text-amber-600 dark:text-amber-400",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-2.5 w-2.5" }),
																"Follow-up: ",
																fmtDate(n.follow_up_date)
															]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 whitespace-pre-wrap text-xs text-muted-foreground",
													children: n.note_text
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1.5 text-[10px] text-muted-foreground/60",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mr-1 inline h-2.5 w-2.5" }), fmtTs(n.created_at)]
												})
											]
										})]
									}, n.id);
								})
							})] }, day))
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-3 h-8 w-8 opacity-30" }), "Select a candidate to view their CRM timeline."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-amber-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: "Follow-ups"
								}),
								followUps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400",
									children: followUps.length
								})
							]
						}), followUps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 text-center text-[11px] text-muted-foreground",
							children: [
								"No follow-ups yet.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px]",
									children: "Set a follow-up date when logging an activity."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 max-h-64 overflow-y-auto",
							children: followUps.map(({ n, cand }) => {
								const { Icon, color } = CH[n.channel in CH ? n.channel : "note"];
								const isToday = n.follow_up_date === today;
								const isOverdue = n.follow_up_date < today;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActiveId(cand.id),
									className: "flex w-full items-start gap-2.5 rounded-xl border border-border bg-background/40 p-2.5 text-left hover:bg-accent/50 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
										name: cand.name,
										size: 26
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate text-xs font-medium",
													children: cand.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3 w-3 shrink-0 ${color}` })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-[10px] text-muted-foreground",
												children: n.subject || n.note_text.slice(0, 35)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `mt-0.5 text-[10px] font-medium ${isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-muted-foreground"}`,
												children: [isOverdue ? "⚠ Overdue · " : isToday ? "📅 Today · " : "", fmtDate(n.follow_up_date)]
											})
										]
									})]
								}, n.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4 text-violet-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: "Watchlist"
								}),
								watchSet.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-500",
									children: watchSet.size
								})
							]
						}), watchSet.size === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 text-center text-[11px] text-muted-foreground",
							children: [
								"No candidates on watchlist.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px]",
									children: "Click Watch on a candidate to pin them here."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5",
							children: [...watchSet].map((id) => {
								const c = candidates.find((x) => x.id === id);
								if (!c) return null;
								const cnt = notes[id]?.length ?? 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setActiveId(id),
										className: "flex flex-1 items-center gap-2 rounded-lg border border-border bg-background/40 p-2 text-left text-xs hover:bg-accent/50 transition-colors min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
											name: c.name,
											size: 24
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-medium",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground",
												children: [cnt, " activities"]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleWatch(id),
										className: "shrink-0 rounded-md border border-border p-1.5 text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-colors",
										title: "Remove",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})]
								}, id);
							})
						})]
					}),
					active && (notes[active.id]?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 text-sm font-semibold",
							children: "Activity Breakdown"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5",
							children: Object.keys(CH).map((ch) => {
								const count = (notes[active.id] ?? []).filter((n) => n.channel === ch).length;
								if (count === 0) return null;
								const { Icon, color, label } = CH[ch];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-1.5 ${color}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), label]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-muted px-2 py-0.5 font-medium tabular-nums",
										children: count
									})]
								}, ch);
							})
						})]
					})
				]
			})
		]
	}) });
}
//#endregion
export { RecruitmentCRMPage };
