import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Gn as FileCheck } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CioItGovernancePage() {
	const policies = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase",
									children: "IT Governance & Regulatory Compliance"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "IT Policies, Audit Logs & Technology Roadmap"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-purple-200/70 max-w-2xl",
								children: "ISO27001 & SOC2 Type II compliance audit trails, SaaS vendor license management, risk assessment matrix, and IT capital budget allocation."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Compliance Score",
						val: "—",
						sub: "Audit scan pending",
						color: "text-purple-400"
					},
					{
						label: "Vendor Risk Audits",
						val: "—",
						sub: "No vendors cataloged",
						color: "text-indigo-400"
					},
					{
						label: "Software Licenses",
						val: "—",
						sub: "License tracking pending",
						color: "text-emerald-400"
					},
					{
						label: "Audit Logs Retention",
						val: "—",
						sub: "Retention policy unlinked",
						color: "text-cyan-400"
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
					children: "Approved IT Enterprise Governance Policies"
				}), policies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-xs text-muted-foreground",
					children: "No enterprise IT policies or compliance frameworks registered."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: policies.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-xs text-foreground",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: ["Next Review Window: ", p.review]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs",
							children: p.status
						})]
					}, idx))
				})]
			})
		]
	});
}
//#endregion
export { CioItGovernancePage, CioItGovernancePage as default };
