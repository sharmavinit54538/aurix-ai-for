import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Sr as CircleCheck, Vn as FilePenLine, ht as Plus, pr as Clock, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RequisitionsPage-B0OhRnam.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var seed = [];
var STATUS_TONE = {
	draft: "bg-muted text-muted-foreground ring-border",
	pending: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
	approved: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
	rejected: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300"
};
function RequisitionsPage() {
	const [items, setItems] = (0, import_react.useState)(seed);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const filtered = items.filter((i) => filter === "all" || i.status === filter);
	const counts = {
		all: items.length,
		draft: items.filter((i) => i.status === "draft").length,
		pending: items.filter((i) => i.status === "pending").length,
		approved: items.filter((i) => i.status === "approved").length,
		rejected: items.filter((i) => i.status === "rejected").length
	};
	const decide = (id, status) => setItems((arr) => arr.map((r) => r.id === id ? {
		...r,
		status
	} : r));
	function createRequisition() {
		const newReq = {
			id: `req-${Math.floor(1e3 + Math.random() * 9e3)}`,
			title: "Senior Product Designer",
			department: "Design",
			raisedBy: "Company Admin",
			budget: "$120k–$150k",
			headcount: 1,
			priority: "Medium",
			status: "pending",
			raisedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			reason: "Hiring for product scaling",
			approvers: [{
				name: "Finance Manager",
				role: "Finance",
				status: "pending"
			}]
		};
		setItems((arr) => [newReq, ...arr]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: createRequisition,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New Requisition"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex flex-wrap gap-2",
			children: [
				"all",
				"draft",
				"pending",
				"approved",
				"rejected"
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFilter(s),
				className: `rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 transition-colors ${filter === s ? "bg-foreground text-background ring-foreground" : "ring-border hover:bg-accent/40"}`,
				children: [
					s,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 opacity-70",
						children: counts[s]
					})
				]
			}, s))
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No hiring requisitions available"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm text-muted-foreground",
					children: "Raise a hiring requisition to initiate the headcount approval process."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: createRequisition,
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Create Requisition"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "h-4 w-4 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display font-semibold",
										children: r.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[11px] capitalize ring-1 ${STATUS_TONE[r.status]}`,
										children: r.status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: r.priority
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									r.id,
									" · ",
									r.department,
									" · ",
									r.headcount,
									" headcount · ",
									r.budget,
									" · raised by ",
									r.raisedBy,
									" on ",
									r.raisedAt
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 max-w-2xl text-sm",
								children: r.reason
							})
						]
					}), r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => decide(r.id, "rejected"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1 h-3.5 w-3.5" }), "Reject"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => decide(r.id, "approved"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3.5 w-3.5" }), "Approve"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2 border-t border-border pt-3",
					children: r.approvers.map((a, i) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2 py-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.status === "approved" ? CircleCheck : a.status === "rejected" ? CircleX : Clock, { className: `h-3.5 w-3.5 ${a.status === "approved" ? "text-emerald-600" : a.status === "rejected" ? "text-rose-600" : "text-amber-600"}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: a.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["· ", a.role]
								})
							]
						}, i);
					})
				})]
			}, r.id))
		})
	] });
}
//#endregion
export { RequisitionsPage };
