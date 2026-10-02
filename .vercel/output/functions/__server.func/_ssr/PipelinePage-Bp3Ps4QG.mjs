import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, jn as Funnel, rn as LayoutGrid } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
import { i as KanbanCard } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PipelinePage-Bp3Ps4QG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PipelinePage() {
	const { candidates, jobs, moveStage } = useRecruitment();
	const [dragging, setDragging] = (0, import_react.useState)(null);
	const [over, setOver] = (0, import_react.useState)(null);
	const [selectedJobId, setSelectedJobId] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const filteredCandidates = (0, import_react.useMemo)(() => {
		return candidates.filter((c) => {
			if (selectedJobId !== "all" && c.jobId !== selectedJobId) return false;
			if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
			return true;
		});
	}, [
		candidates,
		selectedJobId,
		searchQuery
	]);
	function onDragStart(e, id) {
		e.dataTransfer.setData("text/plain", id);
		setDragging(id);
	}
	function onDrop(e, stage) {
		const id = e.dataTransfer.getData("text/plain");
		if (id) {
			const cand = candidates.find((c) => c.id === id);
			const name = cand ? cand.name : "Candidate";
			moveStage(id, stage);
			toast.success(`Moved ${name} to ${STAGE_LABEL[stage]}`);
		}
		setDragging(null);
		setOver(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Recruitment Pipeline",
			description: "Drag candidates between stages to update their progress.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" }), "Kanban view"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-w-[240px] flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					placeholder: "Search candidates by name...",
					className: "h-9 pl-9 bg-card/40"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Job Requisition:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedJobId,
						onChange: (e) => setSelectedJobId(e.target.value),
						className: "bg-transparent text-xs outline-none text-foreground cursor-pointer font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							className: "bg-background",
							children: "All Jobs"
						}), jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: j.id,
							className: "bg-background",
							children: [
								j.title,
								" (",
								j.department,
								")"
							]
						}, j.id))]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-3",
				style: { minWidth: STAGES.length * 280 },
				children: STAGES.map((s) => {
					const inStage = filteredCandidates.filter((c) => c.stage === s);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onDragOver: (e) => {
							e.preventDefault();
							setOver(s);
						},
						onDragLeave: () => setOver((cur) => cur === s ? null : cur),
						onDrop: (e) => onDrop(e, s),
						className: `flex w-[280px] shrink-0 flex-col rounded-2xl border bg-card/40 p-3 backdrop-blur-xl transition-colors ${over === s ? "border-foreground/40 bg-accent/40" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 rounded-full",
									style: { background: stageColor(s) }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm font-semibold",
									children: STAGE_LABEL[s]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
								children: inStage.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [inStage.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanCard, {
								c,
								onDragStart
							}, c.id)), inStage.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-dashed border-border/70 p-6 text-center text-[11px] text-muted-foreground",
								children: "Drop candidates here"
							}) : null]
						})]
					}, s);
				})
			})
		})
	] });
}
function stageColor(s) {
	return {
		applied: "oklch(0.7 0.04 260)",
		screening: "oklch(0.7 0.18 220)",
		assessment: "oklch(0.65 0.2 270)",
		interview: "oklch(0.65 0.22 290)",
		technical: "oklch(0.66 0.22 320)",
		hr: "oklch(0.75 0.18 80)",
		offer: "oklch(0.72 0.2 50)",
		hired: "oklch(0.72 0.18 150)",
		rejected: "oklch(0.7 0.2 20)"
	}[s];
}
//#endregion
export { PipelinePage };
