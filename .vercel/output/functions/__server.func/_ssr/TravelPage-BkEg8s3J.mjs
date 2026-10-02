import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Bt as MapPin, Sr as CircleCheck, _t as Plane, d as Wallet, ht as Plus, qr as Building2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard, s as SearchBox, u as StatusBadge } from "./Shared-C_skH1kb.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TravelPage-BkEg8s3J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"draft",
	"manager-review",
	"hr-review",
	"finance-review",
	"approved",
	"rejected"
];
var STAGE_TONE = {
	draft: "muted",
	"manager-review": "warning",
	"hr-review": "warning",
	"finance-review": "info",
	approved: "success",
	rejected: "danger"
};
var NEXT_STAGE = {
	draft: "manager-review",
	"manager-review": "hr-review",
	"hr-review": "finance-review",
	"finance-review": "approved",
	approved: null,
	rejected: null
};
function emptyTravel() {
	return {
		id: newId("tr"),
		employee: "",
		type: "domestic",
		purpose: "",
		destination: "",
		travelDate: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
		returnDate: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
		budget: 0,
		currency: "INR",
		status: "draft",
		history: [{
			stage: "draft",
			at: (/* @__PURE__ */ new Date()).toISOString()
		}],
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function TravelPage() {
	const travel = useHrms((s) => s.travel);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(emptyTravel());
	const stats = (0, import_react.useMemo)(() => ({
		total: travel.length,
		pending: travel.filter((t) => !["approved", "rejected"].includes(t.status)).length,
		approved: travel.filter((t) => t.status === "approved").length,
		budget: travel.reduce((s, t) => s + t.budget, 0)
	}), [travel]);
	const filtered = (0, import_react.useMemo)(() => travel.filter((t) => filter === "all" ? true : t.status === filter).filter((t) => query.trim() === "" ? true : `${t.employee} ${t.destination} ${t.purpose}`.toLowerCase().includes(query.toLowerCase())), [
		travel,
		filter,
		query
	]);
	function submit() {
		if (!draft.employee || !draft.destination) return;
		hrms.upsertTravel({
			...draft,
			status: "manager-review",
			history: [...draft.history, {
				stage: "manager-review",
				at: (/* @__PURE__ */ new Date()).toISOString()
			}]
		});
		setOpen(false);
		setDraft(emptyTravel());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Travel Requests",
			description: "Domestic and international travel approvals.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setDraft(emptyTravel());
					setOpen(true);
				},
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New request"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total",
					value: stats.total,
					icon: Plane
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In review",
					value: stats.pending,
					icon: Building2,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Approved",
					value: stats.approved,
					icon: CircleCheck,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Budgeted",
					value: `₹${stats.budget.toLocaleString()}`,
					icon: Wallet,
					accent: "brand"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
				value: query,
				onChange: setQuery,
				placeholder: "Search by employee, destination…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: filter,
				onChange: (e) => setFilter(e.target.value),
				className: "h-9 rounded-md border border-border bg-background px-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All"
				}), STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: filtered.map((t) => {
				const next = NEXT_STAGE[t.status];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-medium",
										children: t.employee
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
										status: t.type,
										tone: "muted"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
										status: t.status,
										tone: STAGE_TONE[t.status]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-sm text-muted-foreground inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
									" ",
									t.destination
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: t.purpose
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Travel: ", new Date(t.travelDate).toLocaleDateString()] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Return: ", new Date(t.returnDate).toLocaleDateString()] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Budget: ₹", t.budget.toLocaleString()] }),
									t.hotel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Hotel: ", t.hotel] }) : null,
									t.transportation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Transport: ", t.transportation] }) : null
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col items-end gap-2",
						children: next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => hrms.advanceTravel(t.id, next),
							children: ["Advance → ", next.replace(/-/g, " ")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => hrms.advanceTravel(t.id, "rejected", "Rejected at " + t.status),
							children: "Reject"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Final"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Approval timeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "flex flex-wrap gap-2 text-xs",
						children: t.history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-1.5 w-1.5 rounded-full",
									style: { background: "var(--gradient-brand)" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize",
									children: h.stage.replace(/-/g, " ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["· ", new Date(h.at).toLocaleDateString()]
								})
							]
						}, i))
					})]
				})] }, t.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New travel request" }) }),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: draft.type,
								onChange: (e) => setDraft({
									...draft,
									type: e.target.value
								}),
								className: "h-9 w-full rounded-md border border-border bg-background px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "domestic",
									children: "Domestic"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "international",
									children: "International"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purpose" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: draft.purpose,
									onChange: (e) => setDraft({
										...draft,
										purpose: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Destination" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.destination,
									onChange: (e) => setDraft({
										...draft,
										destination: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Travel date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.travelDate.slice(0, 10),
								onChange: (e) => setDraft({
									...draft,
									travelDate: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Return date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.returnDate.slice(0, 10),
								onChange: (e) => setDraft({
									...draft,
									returnDate: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hotel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.hotel ?? "",
								onChange: (e) => setDraft({
									...draft,
									hotel: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Transportation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.transportation ?? "",
								onChange: (e) => setDraft({
									...draft,
									transportation: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Budget (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: draft.budget,
									onChange: (e) => setDraft({
										...draft,
										budget: Number(e.target.value)
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
						onClick: submit,
						children: "Submit for approval"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { TravelPage, TravelPage as default };
