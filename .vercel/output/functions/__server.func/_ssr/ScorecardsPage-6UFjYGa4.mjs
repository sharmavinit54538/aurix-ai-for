import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { gr as ClipboardCheck, ht as Plus, k as Trash2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ScorecardsPage-6UFjYGa4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var seed = [];
function ScorecardsPage() {
	const [items, setItems] = (0, import_react.useState)(seed);
	const [active, setActive] = (0, import_react.useState)("");
	const current = items.find((s) => s.id === active) ?? items[0] ?? null;
	const update = (patch) => {
		if (!current) return;
		setItems((arr) => arr.map((s) => s.id === current.id ? {
			...s,
			...patch
		} : s));
	};
	const setComp = (i, patch) => {
		if (!current) return;
		update({ competencies: current.competencies.map((c, idx) => idx === i ? {
			...c,
			...patch
		} : c) });
	};
	const total = current ? current.competencies.reduce((a, c) => a + c.weight, 0) : 0;
	function addNewScorecard() {
		const newId = `sc_${Date.now()}`;
		const newSc = {
			id: newId,
			name: "New Scorecard Template",
			role: "Engineering",
			round: "Technical",
			usedIn: 0,
			competencies: [{
				name: "Technical Fit",
				weight: 50
			}, {
				name: "Cultural Fit",
				weight: 50
			}]
		};
		setItems((arr) => [...arr, newSc]);
		setActive(newId);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Interview Scorecards",
		description: "Structured rubrics ensure consistent, bias-aware interview decisions.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: addNewScorecard,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New Scorecard"]
		})
	}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "No scorecards available"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: "Create a custom interview scorecard template to start structural candidate assessments."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: addNewScorecard,
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Create Scorecard"]
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 lg:col-span-1",
			children: items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setActive(s.id),
				className: `flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all backdrop-blur-xl ${current && current.id === s.id ? "border-foreground/40 bg-accent/40" : "border-border bg-card/60 hover:bg-accent/30"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "mt-0.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-sm font-medium",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-2 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px]",
								children: s.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.round }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"· ",
								s.usedIn,
								" interviews"
							] })
						]
					})]
				})]
			}, s.id))
		}), current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: current.name,
						onChange: (e) => update({ name: e.target.value }),
						className: "max-w-md text-base font-semibold"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: total === 100 ? "default" : "destructive",
						children: [
							"Weight: ",
							total,
							"%"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [current.competencies.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: c.name,
								onChange: (e) => setComp(i, { name: e.target.value }),
								className: "flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 100,
									step: 5,
									value: c.weight,
									onChange: (e) => setComp(i, { weight: Number(e.target.value) }),
									className: "w-32"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-10 text-right text-xs tabular-nums",
									children: [c.weight, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => update({ competencies: current.competencies.filter((_, idx) => idx !== i) }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => update({ competencies: [...current.competencies, {
							name: "New competency",
							weight: 10
						}] }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-3.5 w-3.5" }), "Add competency"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground",
					children: "Interviewers rate each competency 1–5. Weighted score auto-calculates and rolls up into the candidate's overall rating."
				})
			]
		})]
	})] });
}
//#endregion
export { ScorecardsPage };
