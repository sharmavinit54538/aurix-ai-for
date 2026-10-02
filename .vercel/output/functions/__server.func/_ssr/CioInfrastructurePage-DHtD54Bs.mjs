import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Kr as Building } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CioInfrastructurePage() {
	const dataCenters = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold uppercase",
									children: "Global Infrastructure & Data Centers"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "Data Centers, Bare-Metal Servers & Disaster Recovery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-cyan-200/70 max-w-2xl",
								children: "Worldwide data center clusters, hypervisor virtual machines, SAN storage capacity, automated backup snapshots, and RTO/RPO disaster recovery."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Infrastructure Health",
						val: "—",
						sub: "Monitoring unconfigured",
						color: "text-cyan-400"
					},
					{
						label: "Compute Utilization",
						val: "—",
						sub: "No telemetry recorded",
						color: "text-indigo-400"
					},
					{
						label: "Storage SAN Capacity",
						val: "—",
						sub: "SAN storage unlinked",
						color: "text-emerald-400"
					},
					{
						label: "Backup RPO SLA",
						val: "—",
						sub: "No backup policy tracked",
						color: "text-purple-400"
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
					children: "Global Data Center Hubs"
				}), dataCenters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-xs text-muted-foreground",
					children: "No data centers or bare-metal server clusters connected."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: dataCenters.map((dc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-xs text-foreground",
								children: dc.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Cluster Size: ",
									dc.nodes,
									" • Compute Load: ",
									dc.load
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono",
							children: [dc.uptime, " Uptime"]
						})]
					}, idx))
				})]
			})
		]
	});
}
//#endregion
export { CioInfrastructurePage, CioInfrastructurePage as default };
