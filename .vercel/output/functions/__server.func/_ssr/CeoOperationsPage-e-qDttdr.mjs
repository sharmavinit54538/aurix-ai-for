import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { gr as ClipboardCheck } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CeoOperationsPage() {
	const approvals = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold uppercase",
									children: "Business Operations & Approvals"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "Business Operations Health & Executive Signoffs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-sky-200/70 max-w-2xl",
								children: "Operational productivity, resource allocation, pending high-value executive approvals, procurement contracts, and business process compliance."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Operational Health",
						val: "—",
						sub: "Pending integration",
						color: "text-sky-400"
					},
					{
						label: "Pending Signoffs",
						val: "0",
						sub: "No pending signoffs",
						color: "text-amber-400"
					},
					{
						label: "Resource Utilization",
						val: "—",
						sub: "Pending integration",
						color: "text-emerald-400"
					},
					{
						label: "SOC2 Compliance",
						val: "—",
						sub: "Pending audit sync",
						color: "text-indigo-400"
					}
				].map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/80 bg-card/60 p-4 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-semibold uppercase",
							children: k.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-2xl font-bold font-display ${k.color}`,
							children: k.val
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: k.sub
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-sm text-foreground",
					children: "Pending Executive Approvals"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: approvals.length > 0 ? approvals.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sky-400 font-bold text-xs",
									children: app.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-xs text-foreground",
									children: app.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Requester: ",
									app.requester,
									" • Amount: ",
									app.amount
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs",
							children: app.status
						})]
					}, app.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground",
						children: "No pending executive approvals."
					})
				})]
			})
		]
	});
}
//#endregion
export { CeoOperationsPage, CeoOperationsPage as default };
