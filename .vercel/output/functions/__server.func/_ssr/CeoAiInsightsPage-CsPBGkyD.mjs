import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, H as Sparkles, Xr as Bot } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CeoAiInsightsPage() {
	const forecastData = [];
	const recommendations = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-violet-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px] font-bold uppercase",
									children: "Executive AI Intelligence Center"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "AI Business Forecasting & Decision Support"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-violet-200/70 max-w-2xl",
								children: "Predictive revenue modeling, AI smart recommendations, competitive intelligence, risk forecasting, and automated executive summaries."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-sm text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-violet-400" }), "AI Revenue Forecast ($M) — 6-Month Trajectory"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 w-full pt-2 flex items-center justify-center",
					children: forecastData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: forecastData,
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
									dataKey: "predicted",
									stroke: "#8b5cf6",
									fill: "#8b5cf6",
									fillOpacity: .2,
									name: "Predicted Revenue ($M)"
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "No forecasting data available. Backend API integration pending."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-bold text-sm text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-amber-400" }), "Smart Strategic AI Recommendations"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: recommendations.length > 0 ? recommendations.map((rec, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-xs text-foreground",
								children: rec.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-emerald-400 font-mono",
								children: ["Predicted Impact: ", rec.impact]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs font-mono",
							children: [rec.confidence, " Confidence"]
						})]
					}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground",
						children: "No AI recommendations generated yet."
					})
				})]
			})
		]
	});
}
//#endregion
export { CeoAiInsightsPage, CeoAiInsightsPage as default };
