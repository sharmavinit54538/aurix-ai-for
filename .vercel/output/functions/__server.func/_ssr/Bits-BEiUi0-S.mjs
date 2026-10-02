import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Bt as MapPin, H as Sparkles, Jr as Briefcase, R as Star, p as Users } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as STAGE_LABEL } from "./types-CxbMeuye.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Bits-BEiUi0-S.js
var import_jsx_runtime = require_jsx_runtime();
var STAGE_TONE = {
	applied: "bg-slate-500/15 text-slate-600 ring-slate-500/20 dark:text-slate-300",
	screening: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
	assessment: "bg-indigo-500/15 text-indigo-600 ring-indigo-500/20 dark:text-indigo-300",
	interview: "bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300",
	technical: "bg-fuchsia-500/15 text-fuchsia-600 ring-fuchsia-500/20 dark:text-fuchsia-300",
	hr: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
	offer: "bg-orange-500/15 text-orange-600 ring-orange-500/20 dark:text-orange-300",
	hired: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
	rejected: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300"
};
function StageBadge({ stage }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${STAGE_TONE[stage]}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-70" }), STAGE_LABEL[stage]]
	});
}
function ScoreRing({ value, label = "ATS", size = 56 }) {
	const hasScore = value !== null && value !== void 0;
	const safeValue = hasScore ? value : 0;
	const r = (size - 8) / 2;
	const c = 2 * Math.PI * r;
	const offset = c - safeValue / 100 * c;
	const color = !hasScore ? "oklch(0.55 0.03 240)" : safeValue >= 85 ? "oklch(0.7 0.18 150)" : safeValue >= 70 ? "oklch(0.74 0.16 80)" : "oklch(0.65 0.18 25)";
	const textSize = size < 50 ? "text-xs" : "text-sm";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative inline-grid place-items-center",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				stroke: "currentColor",
				className: "text-muted/40",
				strokeWidth: 4,
				fill: "none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				stroke: color,
				strokeWidth: 4,
				fill: "none",
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: offset,
				style: { transition: "stroke-dashoffset 600ms ease" }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center leading-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `font-display font-semibold ${textSize}`,
					children: hasScore ? safeValue : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[9px] uppercase tracking-wider text-muted-foreground",
					children: label
				})]
			})
		})]
	});
}
function JobCard({ job }) {
	const toneCls = {
		success: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
		muted: "bg-muted text-muted-foreground ring-border",
		danger: "bg-rose-500/15 text-rose-600 ring-rose-500/20",
		warning: "bg-amber-500/15 text-amber-700 ring-amber-500/20"
	}[job.status === "active" ? "success" : job.status === "draft" ? "muted" : job.status === "closed" ? "danger" : "warning"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/dashboard/recruitment/jobs/$jobId",
		params: { jobId: job.id },
		className: "group relative block overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 place-items-center rounded-lg text-brand-foreground shadow-glow",
					style: { background: "var(--gradient-brand)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${toneCls}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-70" }), job.status]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-display text-base font-semibold tracking-tight",
				children: job.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: [
					job.department,
					" • ",
					job.employmentType
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-1.5",
				children: [job.skills.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "text-[10px]",
					children: s
				}, s)), job.skills.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] text-muted-foreground",
					children: ["+", job.skills.length - 3]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-4 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
						job.workMode,
						" · ",
						job.location.split(",")[0]
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }), job.applicants]
				})]
			})
		]
	});
}
function CandidateAvatar({ name, size = 36 }) {
	const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
	const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid shrink-0 place-items-center rounded-full text-xs font-semibold text-white shadow-inner",
		style: {
			width: size,
			height: size,
			background: `linear-gradient(135deg, oklch(0.62 0.18 ${hue}), oklch(0.5 0.2 ${(hue + 60) % 360}))`
		},
		children: initials
	});
}
function CandidateRow({ c, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/dashboard/recruitment/candidates/$candidateId",
		params: { candidateId: c.id },
		onClick,
		className: "flex items-center gap-4 rounded-xl border border-border bg-card/40 p-3 backdrop-blur-xl transition-colors hover:bg-accent/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, { name: c.name }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBadge, { stage: c.stage })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 truncate text-xs text-muted-foreground",
					children: [
						c.appliedPosition,
						" · ",
						c.location,
						" · ",
						c.yearsExperience,
						"y"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden flex-wrap gap-1 sm:flex",
				children: c.skills.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "text-[10px]",
					children: s
				}, s))
			})
		]
	});
}
function KanbanCard({ c, onDragStart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		draggable: true,
		onDragStart: (e) => onDragStart(e, c.id),
		className: "cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:shadow-elegant active:cursor-grabbing hover:bg-accent/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
					name: c.name,
					size: 28
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/recruitment/candidates/$candidateId",
						params: { candidateId: c.id },
						className: "truncate text-sm font-medium hover:underline block font-semibold text-foreground cursor-pointer",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[10px] text-muted-foreground",
						children: c.appliedPosition
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: c.skills.slice(0, 2).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "text-[9px]",
					children: s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center justify-between text-[10px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
						" ",
						c.jobMatch != null ? `${c.jobMatch}% match` : "—"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" }),
						" ",
						c.atsScore ?? "—"
					]
				})]
			})
		]
	});
}
function fmtMoney(n, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(n);
}
function fmtDate(iso) {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
//#endregion
export { ScoreRing as a, fmtMoney as c, KanbanCard as i, CandidateRow as n, StageBadge as o, JobCard as r, fmtDate as s, CandidateAvatar as t };
