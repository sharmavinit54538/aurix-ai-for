import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CtoAnalyticsPage() {
	const analyticsData = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
			children: [
				{
					label: "Deployment Frequency",
					val: "—",
					sub: "No deployments recorded"
				},
				{
					label: "Lead Time to PR Merge",
					val: "—",
					sub: "VCS integration pending"
				},
				{
					label: "Cycle Time (Commit→Deploy)",
					val: "—",
					sub: "No telemetry recorded"
				},
				{
					label: "Bug Escape Rate",
					val: "—",
					sub: "No incident data recorded"
				}
			].map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4 space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground font-semibold uppercase",
						children: k.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold font-display text-foreground",
						children: k.val
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: k.sub
					})
				]
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-sm text-foreground",
					children: "Sprint Velocity Trend"
				}), analyticsData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 w-full flex items-center justify-center text-xs text-muted-foreground",
					children: "No velocity history recorded. Sprint tracking integration pending."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 w-full pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: analyticsData,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "rgba(255,255,255,0.05)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "#888888",
									fontSize: 10
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888888",
									fontSize: 10
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									backgroundColor: "#0f172a",
									borderColor: "#334155",
									borderRadius: "8px"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "velocity",
									stroke: "#10b981",
									fill: "#10b981",
									fillOpacity: .2,
									name: "Story Points"
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-sm text-foreground",
					children: "Deployment Frequency vs Bug Count"
				}), analyticsData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 w-full flex items-center justify-center text-xs text-muted-foreground",
					children: "No deployment or bug metrics recorded."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 w-full pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: analyticsData,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "rgba(255,255,255,0.05)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "#888888",
									fontSize: 10
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888888",
									fontSize: 10
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									backgroundColor: "#0f172a",
									borderColor: "#334155",
									borderRadius: "8px"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "deploys",
									fill: "#6366f1",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Deploys"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "bugs",
									fill: "#f43f5e",
									radius: [
										4,
										4,
										0,
										0
									],
									name: "Production Bugs"
								})
							]
						})
					})
				})]
			})]
		})]
	});
}
//#endregion
export { CtoAnalyticsPage, CtoAnalyticsPage as default };
