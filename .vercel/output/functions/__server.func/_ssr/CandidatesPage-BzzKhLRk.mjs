import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, er as Download, ht as Plus, jn as Funnel, p as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { n as EmptyState } from "./Shared-C_skH1kb.mjs";
import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
import { n as CandidateRow } from "./Bits-BEiUi0-S.mjs";
import { t as AddCandidateDialog } from "./AddCandidateDialog-D_6Agw5O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CandidatesPage-BzzKhLRk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CandidatesPage() {
	const { candidates, jobs } = useRecruitment();
	const [q, setQ] = (0, import_react.useState)("");
	const [stage, setStage] = (0, import_react.useState)("all");
	const [minScore, setMinScore] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [showAddModal, setShowAddModal] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		return candidates.filter((c) => {
			if (stage !== "all" && c.stage !== stage) return false;
			if ((c.atsScore ?? 0) < minScore) return false;
			if (q && !`${c.name} ${c.appliedPosition} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [
		candidates,
		q,
		stage,
		minScore
	]);
	const activeJobs = (0, import_react.useMemo)(() => jobs.filter((j) => j.status === "active" || j.status === "draft"), [jobs]);
	function toggle(id) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Export"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setShowAddModal(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Add Candidate"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-w-[240px] flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search by name, role, skill, tag…",
					className: "h-9 pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-2 py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Stage:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: stage,
						onChange: (e) => setStage(e.target.value),
						className: "bg-transparent text-xs capitalize outline-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							className: "bg-background",
							children: "All"
						}), STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							className: "bg-background",
							children: STAGE_LABEL[s]
						}, s))]
					})
				]
			})]
		}),
		selected.size > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2 rounded-xl border border-border bg-card/80 p-2 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [selected.size, " selected"] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					children: "Move to stage"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					children: "Tag"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					children: "Email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => setSelected(/* @__PURE__ */ new Set()),
					children: "Clear"
				})
			]
		}) : null,
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No candidates match",
			description: "Adjust filters or add a candidate.",
			icon: Users
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: selected.has(c.id),
					onChange: () => toggle(c.id),
					className: "h-4 w-4 accent-foreground"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateRow, { c })
				})]
			}, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddCandidateDialog, {
			open: showAddModal,
			onOpenChange: setShowAddModal,
			jobs: activeJobs,
			stage: "applied"
		})
	] });
}
//#endregion
export { CandidatesPage };
