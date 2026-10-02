import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Q as Send, a as X, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { c as fmtMoney, s as fmtDate, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OffersPage-D3ZCkX-T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OffersPage() {
	const offers = useRecruitment((s) => s.offers);
	const [selected, setSelected] = (0, import_react.useState)(offers[0]?.id ?? null);
	const active = offers.find((o) => o.id === selected) ?? offers[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), "New Offer"] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 lg:col-span-1",
			children: offers.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setSelected(o.id),
				className: `flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${active?.id === o.id ? "border-foreground/40 bg-accent/40" : "border-border bg-card/60 hover:bg-accent/30"} backdrop-blur-xl`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
						name: o.candidateName,
						size: 36
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: o.candidateName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs text-muted-foreground",
							children: o.jobTitle
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: o.status })
				]
			}, o.id))
		}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: "Offer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: active.candidateName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/recruitment/candidates/$candidateId",
								params: { candidateId: active.candidateId },
								className: "text-xs text-muted-foreground hover:underline",
								children: active.jobTitle
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: active.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Base Salary",
								value: fmtMoney(active.salary, active.currency)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Joining Date",
								value: fmtDate(active.joiningDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Sent",
								value: active.sentAt ? fmtDate(active.sentAt) : "—"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-xs uppercase tracking-wider text-muted-foreground",
							children: "Benefits"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: active.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: b
							}, b))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 font-display text-sm font-semibold",
					children: "Approval Timeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "relative space-y-4 border-l border-border pl-5",
					children: active.approvals.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full ${a.status === "approved" ? "bg-emerald-500 text-white" : a.status === "rejected" ? "bg-rose-500 text-white" : "bg-muted text-muted-foreground"}`,
								children: a.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2.5 w-2.5" }) : a.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-2.5 w-2.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: a.stage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									a.by,
									" · ",
									fmtDate(a.at),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: a.status
									})
								]
							})
						]
					}, i))
				})]
			})]
		}) : null]
	})] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-background/40 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-base font-semibold",
			children: value
		})]
	});
}
function StatusPill({ status }) {
	const cls = {
		"accepted": "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
		"declined": "bg-rose-500/15 text-rose-600 ring-rose-500/20",
		"expired": "bg-muted text-muted-foreground ring-border",
		"sent": "bg-sky-500/15 text-sky-600 ring-sky-500/20",
		"draft": "bg-muted text-muted-foreground ring-border",
		"pending-approval": "bg-amber-500/15 text-amber-700 ring-amber-500/20"
	}[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${cls}`,
		children: status.replace("-", " ")
	});
}
//#endregion
export { OffersPage };
