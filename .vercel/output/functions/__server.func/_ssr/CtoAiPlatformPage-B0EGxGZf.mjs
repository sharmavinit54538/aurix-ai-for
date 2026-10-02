import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Xr as Bot, ht as Plus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CtoAiPlatformPage() {
	const models = [];
	const agents = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-violet-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px] font-bold uppercase",
									children: "Enterprise AI & LLM Platform"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
								children: "AI Agents, LLM Models & Vector Database Center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-violet-200/70 max-w-2xl",
								children: "AI Models registry, autonomous AI agents, prompt analytics, Qdrant vector database, embedding pipelines, token usage, and AI inference cost control."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => toast.info("AI Agent deployment integration pending."),
							className: "bg-violet-600 hover:bg-violet-500 text-white text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-3.5 w-3.5" }), "Deploy AI Agent"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
				children: [
					{
						label: "Active LLM Models",
						val: "—",
						sub: "No models deployed",
						color: "text-violet-400"
					},
					{
						label: "Daily Token Consumption",
						val: "—",
						sub: "Token metering pending",
						color: "text-emerald-400"
					},
					{
						label: "Avg Inference Latency",
						val: "—",
						sub: "Latency telemetry pending",
						color: "text-cyan-400"
					},
					{
						label: "Vector Search Index",
						val: "—",
						sub: "Vector DB offline",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "models",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "models",
								className: "text-xs font-semibold",
								children: "AI Models"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "agents",
								className: "text-xs font-semibold",
								children: "AI Agents"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "prompt",
								className: "text-xs font-semibold",
								children: "Prompt Analytics"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "vector",
								className: "text-xs font-semibold",
								children: "Vector Database"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "cost",
								className: "text-xs font-semibold",
								children: "Cost Analytics"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "models",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Model Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Model Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "GPU Allocation"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Inference Latency"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Status"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/40",
									children: models.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 5,
										className: "p-8 text-center text-xs text-muted-foreground",
										children: "No active AI models or LLMs registered."
									}) }) : models.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-accent/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-bold text-foreground",
												children: m.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-muted-foreground",
												children: m.type
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-purple-400",
												children: m.gpu
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 font-mono text-emerald-400",
												children: m.latency
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													className: "text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
													children: m.status
												})
											})
										]
									}, idx))
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "agents",
						children: agents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No autonomous AI agents registered or running."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-4",
							children: agents.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-card/60 p-4 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-foreground",
											children: a.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
											children: a.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: a.role
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] font-mono text-violet-400 pt-2 border-t border-border/40",
										children: ["Base LLM: ", a.model]
									})
								]
							}, i))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "prompt",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No prompt telemetry or query logs available."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "vector",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "Vector database collection telemetry offline or unconfigured."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "cost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
							children: "No AI token consumption or cost breakdown records available."
						})
					})
				]
			})
		]
	});
}
//#endregion
export { CtoAiPlatformPage, CtoAiPlatformPage as default };
