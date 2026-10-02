import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { yn as HandCoins } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CeoFinancePage() {
	const financeData = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase",
									children: "Corporate Finance & Cash Flow"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "Financial Performance & Profit & Loss Statement"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-amber-200/70 max-w-2xl",
								children: "ARR revenue, monthly expenses, profit & loss, payroll expenditure, operating cash reserve, tax compliance, and 12-month financial forecasting."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Annual Run Rate (ARR)",
						val: "—",
						sub: "Live data pending",
						color: "text-emerald-400"
					},
					{
						label: "Monthly Expenses",
						val: "—",
						sub: "Live data pending",
						color: "text-rose-400"
					},
					{
						label: "Net Operating Margin",
						val: "—",
						sub: "Live data pending",
						color: "text-amber-400"
					},
					{
						label: "Monthly Payroll Cost",
						val: "—",
						sub: "Live data pending",
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
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-foreground",
						children: "Revenue vs Operating Expenses ($M)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full pt-2 flex items-center justify-center",
						children: financeData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: financeData,
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
										dataKey: "revenue",
										fill: "#10b981",
										radius: [
											4,
											4,
											0,
											0
										],
										name: "Revenue ($M)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "expenses",
										fill: "#f43f5e",
										radius: [
											4,
											4,
											0,
											0
										],
										name: "Expenses ($M)"
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No financial data available. Backend API integration pending."
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-foreground",
						children: "Monthly Payroll Cost Trajectory ($M)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full pt-2 flex items-center justify-center",
						children: financeData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: financeData,
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
										dataKey: "payroll",
										stroke: "#818cf8",
										fill: "#818cf8",
										fillOpacity: .2,
										name: "Payroll ($M)"
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No payroll trajectory data available. Backend API integration pending."
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { CeoFinancePage, CeoFinancePage as default };
