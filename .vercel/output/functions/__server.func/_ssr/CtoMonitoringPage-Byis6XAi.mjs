import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { mi as Activity } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CtoMonitoringPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase",
								children: "Monitoring & Observability"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Live System Metrics & Application Logs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-emerald-200/70 max-w-2xl",
							children: "Real-time CPU, RAM, Disk, GPU metrics, latency tracking, API error rate monitoring, and live application logs."
						})
					]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-3 gap-4",
			children: [
				{
					name: "CPU Utilization",
					val: "—",
					status: "Telemetry pending",
					color: "text-emerald-400"
				},
				{
					name: "RAM Memory Load",
					val: "—",
					status: "Telemetry pending",
					color: "text-indigo-400"
				},
				{
					name: "GPU Cluster Load",
					val: "—",
					status: "Cluster offline",
					color: "text-purple-400"
				}
			].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/80 bg-card/60 p-4 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground font-semibold uppercase",
						children: m.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `text-3xl font-bold font-display ${m.color}`,
						children: m.val
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px] border-border text-muted-foreground",
						children: m.status
					})
				]
			}, i))
		})]
	});
}
//#endregion
export { CtoMonitoringPage, CtoMonitoringPage as default };
