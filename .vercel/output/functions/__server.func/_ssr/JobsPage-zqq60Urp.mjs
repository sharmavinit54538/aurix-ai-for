import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Jr as Briefcase, Jt as List, ht as Plus, jn as Funnel, rn as LayoutGrid } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { n as EmptyState } from "./Shared-C_skH1kb.mjs";
import { c as fmtMoney, r as JobCard, s as fmtDate } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JobsPage-zqq60Urp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"all",
	"active",
	"draft",
	"closed",
	"archived"
];
function JobsPage() {
	const jobs = useRecruitment((s) => s.jobs);
	const [view, setView] = (0, import_react.useState)("grid");
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [dept, setDept] = (0, import_react.useState)("all");
	const departments = (0, import_react.useMemo)(() => Array.from(new Set(jobs.map((j) => j.department))), [jobs]);
	const filtered = (0, import_react.useMemo)(() => {
		return jobs.filter((j) => {
			if (status !== "all" && j.status !== status) return false;
			if (dept !== "all" && j.department !== dept) return false;
			if (q && !`${j.title} ${j.department} ${j.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [
		jobs,
		q,
		status,
		dept
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/recruitment/jobs/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New job"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-[220px] flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search jobs, skills…",
						className: "h-9 pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					label: "Status",
					options: STATUSES.map((s) => ({
						value: s,
						label: s
					})),
					value: status,
					onChange: (v) => setStatus(v)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					label: "Department",
					options: [{
						value: "all",
						label: "all"
					}, ...departments.map((d) => ({
						value: d,
						label: d
					}))],
					value: dept,
					onChange: setDept
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto inline-flex rounded-md border border-border bg-card/60 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setView("grid"),
						className: `grid h-7 w-7 place-items-center rounded ${view === "grid" ? "bg-accent" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setView("table"),
						className: `grid h-7 w-7 place-items-center rounded ${view === "table" ? "bg-accent" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-4 w-4" })
					})]
				})
			]
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No jobs match those filters",
			description: "Try clearing filters or post a new role.",
			icon: Briefcase
		}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: filtered.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, { job: j }, j.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Salary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Applicants"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Closes"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border hover:bg-accent/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard/recruitment/jobs/$jobId",
								params: { jobId: j.id },
								className: "font-medium hover:underline",
								children: j.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									j.employmentType,
									" · ",
									j.workMode
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: j.department
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: j.location
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: [
								fmtMoney(j.salaryMin, j.currency),
								"–",
								fmtMoney(j.salaryMax, j.currency)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: j.applicants
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "capitalize",
								children: j.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: fmtDate(j.closingAt)
						})
					]
				}, j.id)) })]
			})
		})
	] });
}
function Pill({ label, options, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-2 py-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [label, ":"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value,
				onChange: (e) => onChange(e.target.value),
				className: "bg-transparent text-xs capitalize outline-none",
				children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: o.value,
					className: "bg-background capitalize",
					children: o.label
				}, o.value))
			})
		]
	});
}
//#endregion
export { JobsPage };
