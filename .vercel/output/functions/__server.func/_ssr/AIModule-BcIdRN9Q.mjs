import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { fi as ArrowDownRight, si as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { C as Legend, S as Tooltip, c as YAxis, d as Line, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, r as AreaChart, s as LineChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AIModule-BcIdRN9Q.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.68 0.2 290)",
	"oklch(0.72 0.18 320)",
	"oklch(0.7 0.16 200)",
	"oklch(0.78 0.18 70)"
];
var toneStyles = {
	ok: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
	warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	crit: "bg-destructive/10 text-destructive border-destructive/20",
	info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
};
function AIHero({ icon: Icon, eyebrow, title, description, lastAnalysis }) {
	if (!title && !eyebrow && !description && !Icon && !lastAnalysis) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col min-w-0 gap-2 text-left",
		children: [eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
			children: eyebrow
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-3",
				children: [Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold tracking-tight text-foreground",
						children: title
					}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: description
					}) : null]
				})]
			}), lastAnalysis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-xl",
				children: lastAnalysis
			}) : null]
		})]
	});
}
function KpiGrid({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
		children: items.map((k, i) => {
			const Icon = k.icon;
			const up = (k.trend ?? 0) >= 0;
			const positive = k.invert ? !up : up;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 6
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .3,
					delay: i * .04
				},
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-accent text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}), k.trend !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`,
							children: [
								up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3 w-3" }),
								Math.abs(k.trend),
								"%"
							]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-2xl font-semibold tracking-tight",
						children: k.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium text-muted-foreground",
						children: k.label
					}),
					k.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-xs text-muted-foreground/80",
						children: k.hint
					}) : null
				]
			}, k.label);
		})
	});
}
function ChartCard({ chart }) {
	const { type, title, description, data, xKey, series } = chart;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-semibold tracking-tight",
				children: title
			}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: description
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[260px] w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: type === "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data,
					margin: {
						top: 4,
						right: 8,
						left: -16,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: series.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: `g-${title}-${s.key}`,
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: s.color ?? COLORS[i % COLORS.length],
								stopOpacity: .5
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: s.color ?? COLORS[i % COLORS.length],
								stopOpacity: 0
							})]
						}, s.key)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: xKey,
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "var(--color-popover)",
							border: "1px solid var(--color-border)",
							borderRadius: 8,
							fontSize: 12
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
						series.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: s.key,
							name: s.label,
							stroke: s.color ?? COLORS[i % COLORS.length],
							fill: `url(#g-${title}-${s.key})`,
							strokeWidth: 2
						}, s.key))
					]
				}) : type === "bar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						top: 4,
						right: 8,
						left: -16,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: xKey,
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "var(--color-popover)",
							border: "1px solid var(--color-border)",
							borderRadius: 8,
							fontSize: 12
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
						series.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: s.key,
							name: s.label,
							fill: s.color ?? COLORS[i % COLORS.length],
							radius: [
								6,
								6,
								0,
								0
							]
						}, s.key))
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
					data,
					margin: {
						top: 4,
						right: 8,
						left: -16,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: xKey,
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							background: "var(--color-popover)",
							border: "1px solid var(--color-border)",
							borderRadius: 8,
							fontSize: 12
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
						series.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: s.key,
							name: s.label,
							stroke: s.color ?? COLORS[i % COLORS.length],
							strokeWidth: 2,
							dot: false
						}, s.key))
					]
				})
			})
		})]
	});
}
function FeatureGrid({ features }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: features.map((f, i) => {
			const Icon = f.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 6
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .3,
					delay: i * .03
				},
				className: "group flex flex-col rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-colors hover:border-foreground/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-10 w-10 place-items-center rounded-xl border ${f.tone ? toneStyles[f.tone] : "border-border bg-accent text-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}), f.metric ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold tracking-tight",
							children: f.metric
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mt-4 font-display text-sm font-semibold tracking-tight",
						children: f.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: f.description
					}),
					f.progress !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: f.progress,
							className: "h-1.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Performance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [f.progress, "%"] })]
						})]
					}) : null
				]
			}, f.title);
		})
	});
}
function SectionTitle({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 mt-8 flex items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold tracking-tight",
			children: title
		}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: description
		}) : null] }), action]
	});
}
function AIModulePage({ icon, eyebrow, title, description, lastAnalysis, kpis, charts, features, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		Boolean(icon || eyebrow || title || description || lastAnalysis) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIHero, {
			icon,
			eyebrow,
			title,
			description,
			lastAnalysis
		}) : null,
		kpis && kpis.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiGrid, { items: kpis }) : null,
		charts && charts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid grid-cols-1 gap-4 ${charts.length > 1 ? "lg:grid-cols-2" : ""}`,
			children: charts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, { chart: c }, c.title))
		}) : null,
		features && features.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			title: "Capabilities",
			description: "What this AI module can do for you."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureGrid, { features })] }) : null,
		children
	] });
}
//#endregion
export { AIModulePage as n, AIHero as t };
