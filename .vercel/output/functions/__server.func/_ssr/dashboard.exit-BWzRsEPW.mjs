import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Br as Calendar, Jr as Briefcase, Ln as FileText, Sr as CircleCheck, Ut as LogOut, ht as Plus, pr as Clock, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { i as PrintButton, l as StatCard, n as EmptyState, s as SearchBox, u as StatusBadge } from "./Shared-C_skH1kb.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.exit-BWzRsEPW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"resignation",
	"notice",
	"interview",
	"assets",
	"hr",
	"manager",
	"it",
	"finance",
	"settled"
];
function newExit() {
	return {
		id: newId("ex"),
		employee: "",
		role: "",
		resignedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		noticeDays: 60,
		lastWorkingDay: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 60).toISOString().slice(0, 10),
		reason: "",
		stage: "resignation",
		checklist: [
			{
				key: "assets",
				label: "Asset return",
				done: false
			},
			{
				key: "kt",
				label: "Knowledge transfer",
				done: false
			},
			{
				key: "manager",
				label: "Manager approval",
				done: false
			},
			{
				key: "hr",
				label: "HR approval",
				done: false
			},
			{
				key: "it",
				label: "IT clearance",
				done: false
			},
			{
				key: "finance",
				label: "Finance clearance",
				done: false
			}
		],
		documents: [
			{
				name: "Experience Letter",
				issued: false
			},
			{
				name: "Relieving Letter",
				issued: false
			},
			{
				name: "Final Settlement",
				issued: false
			}
		]
	};
}
function ExitPage() {
	const exits = useHrms((s) => s.exits);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(newExit());
	const [search, setSearch] = (0, import_react.useState)("");
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: exits.length,
			inProgress: exits.filter((e) => e.stage !== "settled").length,
			settled: exits.filter((e) => e.stage === "settled").length,
			docsIssued: exits.reduce((s, e) => s + e.documents.filter((d) => d.issued).length, 0)
		};
	}, [exits]);
	const filteredExits = (0, import_react.useMemo)(() => {
		if (!search.trim()) return exits;
		const q = search.toLowerCase();
		return exits.filter((e) => e.employee.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.stage.toLowerCase().includes(q) || e.reason && e.reason.toLowerCase().includes(q));
	}, [exits, search]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Exit Management",
			description: "Resignations, clearances, and final settlements.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setDraft(newExit());
					setOpen(true);
				},
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New exit case"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total cases",
					value: stats.total,
					icon: LogOut
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In progress",
					value: stats.inProgress,
					icon: ShieldCheck,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Settled",
					value: stats.settled,
					icon: CircleCheck,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Documents issued",
					value: stats.docsIssued,
					icon: FileText,
					accent: "brand"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
				value: search,
				onChange: setSearch,
				placeholder: "Search by employee, role, or stage…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					"Showing ",
					filteredExits.length,
					" of ",
					exits.length,
					" case",
					exits.length === 1 ? "" : "s"
				]
			})]
		}),
		filteredExits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No exit cases found",
			description: search ? `No exit records match "${search}".` : "There are currently no exit cases recorded.",
			icon: LogOut
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 lg:grid-cols-2",
			children: filteredExits.map((e) => {
				const done = e.checklist.filter((c) => c.done).length;
				const totalChecklist = e.checklist.length;
				const pct = totalChecklist > 0 ? Math.round(done / totalChecklist * 100) : 0;
				const docsIssuedCount = e.documents.filter((d) => d.issued).length;
				const stageIdx = STAGES.indexOf(e.stage);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 backdrop-blur-xl shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md space-y-4 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border border-violet-500/30 text-foreground font-bold text-sm shadow-sm",
									children: e.employee ? e.employee.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "EX"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-base text-foreground tracking-tight",
												children: e.employee || "Unnamed Employee"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
												status: e.stage,
												tone: e.stage === "settled" ? "success" : e.stage === "resignation" ? "warning" : "info"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 font-medium text-foreground/80",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3 w-3 text-muted-foreground" }), e.role || "Employee"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground/40",
													children: "•"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3 text-muted-foreground" }),
														"LWD: ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium text-foreground/90",
															children: new Date(e.lastWorkingDay).toLocaleDateString()
														})
													]
												}),
												e.noticeDays ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground/40",
													children: "•"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 text-muted-foreground" }),
														e.noticeDays,
														"d notice"
													]
												})] }) : null
											]
										}),
										e.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground border border-border/40",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium text-foreground/70",
														children: "Reason:"
													}),
													" ",
													e.reason
												]
											})
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-0.5 shrink-0 bg-muted/20 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Clearance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-display text-2xl font-bold tracking-tight ${pct === 100 ? "text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
										children: [pct, "%"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground",
										children: [
											"(",
											done,
											"/",
											totalChecklist,
											")"
										]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clearance Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: pct === 100 ? "text-emerald-500 font-medium" : "",
									children: pct === 100 ? "All requirements cleared" : `${totalChecklist - done} item${totalChecklist - done === 1 ? "" : "s"} pending`
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-muted/50 border border-border/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all duration-300",
									style: {
										width: `${pct}%`,
										background: pct === 100 ? "linear-gradient(90deg, #10b981 0%, #059669 100%)" : "linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)"
									}
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), "Department Clearance Checklist"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground font-mono",
								children: [
									done,
									"/",
									totalChecklist,
									" Done"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: e.checklist.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => hrms.toggleExitChecklist(e.id, c.key),
								className: `group flex items-center justify-between gap-2 rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer ${c.done ? "border-emerald-500/30 bg-emerald-500/5 text-foreground hover:bg-emerald-500/10" : "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all ${c.done ? "border-emerald-500 bg-emerald-500 text-white shadow-sm" : "border-border bg-background group-hover:border-primary/60"}`,
										children: c.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 stroke-[3]" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `truncate font-medium ${c.done ? "line-through text-muted-foreground" : ""}`,
										children: c.label
									})]
								}), c.doneAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[10px] text-muted-foreground/80 bg-background/80 px-1.5 py-0.5 rounded border border-border/40 font-mono",
									children: new Date(c.doneAt).toLocaleDateString()
								})]
							}, c.key))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Exit Workflow Stage" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-medium capitalize text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20",
									children: ["Current: ", e.stage]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-muted/30 border border-border/40",
								children: STAGES.map((s, idx) => {
									const isCurrent = e.stage === s;
									const isPast = idx < stageIdx;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => hrms.upsertExit({
											...e,
											stage: s
										}),
										title: `Set stage to ${s}`,
										className: `group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${isCurrent ? "bg-primary text-primary-foreground font-semibold shadow-sm ring-1 ring-primary/40" : isPast ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15" : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-accent/60 border border-transparent"}`,
										children: [isPast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 shrink-0 text-emerald-500" }) : isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary-foreground animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
									}, s);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Settlement & Exit Documents" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground font-mono",
									children: [
										docsIssuedCount,
										"/",
										e.documents.length,
										" Issued"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
								children: e.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: d.issued ? "default" : "outline",
									size: "sm",
									onClick: () => hrms.issueExitDoc(e.id, d.name),
									className: `h-9 w-full justify-between gap-1.5 px-3 text-xs font-medium transition-all ${d.issued ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm" : "border-border/80 hover:bg-accent hover:border-primary/40 text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: `h-3.5 w-3.5 shrink-0 ${d.issued ? "text-white" : "text-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: d.name
										})]
									}), d.issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-0.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-semibold shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2.5 w-2.5" }), " Issued"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground shrink-0 uppercase tracking-wider",
										children: "Issue"
									})]
								}, d.name))
							})]
						})
					]
				}, e.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New exit case" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.employee,
							onChange: (e) => setDraft({
								...draft,
								employee: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.role,
							onChange: (e) => setDraft({
								...draft,
								role: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Resigned on" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: draft.resignedAt.slice(0, 10),
							onChange: (e) => setDraft({
								...draft,
								resignedAt: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notice days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: draft.noticeDays,
							onChange: (e) => setDraft({
								...draft,
								noticeDays: Number(e.target.value)
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Last working day" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.lastWorkingDay.slice(0, 10),
								onChange: (e) => setDraft({
									...draft,
									lastWorkingDay: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draft.reason,
								onChange: (e) => setDraft({
									...draft,
									reason: e.target.value
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						if (!draft.employee) return;
						hrms.upsertExit(draft);
						setOpen(false);
						setDraft(newExit());
					},
					children: "Create"
				})] })
			] })
		})
	] });
}
//#endregion
export { ExitPage as component };
