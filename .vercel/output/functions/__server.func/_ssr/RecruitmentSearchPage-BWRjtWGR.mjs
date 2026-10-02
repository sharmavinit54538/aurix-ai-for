import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, H as Sparkles, Jr as Briefcase, Ln as FileText, On as Gift, Zr as Bookmark, at as Save, p as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentSearchPage-BWRjtWGR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function matchBoolean(text, query) {
	if (!query.trim()) return true;
	try {
		const t = text.toLowerCase();
		const expr = query.replace(/\bAND\b/g, "&&").replace(/\bOR\b/g, "||").replace(/\bNOT\b/g, "!").replace(/"([^"]+)"/g, (_, w) => `t.includes(${JSON.stringify(w.toLowerCase())})`).replace(/([A-Za-z0-9_+#.-]+)/g, (m) => /^(\&\&|\|\||!|true|false|t|includes)$/.test(m) ? m : `t.includes(${JSON.stringify(m.toLowerCase())})`);
		return new Function("t", `return ${expr};`)(t);
	} catch {
		return text.toLowerCase().includes(query.toLowerCase());
	}
}
function RecruitmentSearchPage() {
	const { candidates, jobs, interviews, offers } = useRecruitment((s) => s);
	const [q, setQ] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)([
		"React AND (Senior OR Lead) NOT Manager",
		"TypeScript AND remote",
		"Designer AND Figma"
	]);
	const cs = (0, import_react.useMemo)(() => candidates.filter((c) => matchBoolean(`${c.name} ${c.email} ${c.skills.join(" ")} ${c.appliedPosition} ${c.location} ${c.tags.join(" ")}`, q)).slice(0, 12), [candidates, q]);
	const js = (0, import_react.useMemo)(() => jobs.filter((j) => matchBoolean(`${j.title} ${j.department} ${j.skills.join(" ")} ${j.location}`, q)).slice(0, 8), [jobs, q]);
	const is = (0, import_react.useMemo)(() => interviews.filter((i) => matchBoolean(`${i.candidateName} ${i.jobTitle} ${i.interviewer} ${i.round}`, q)).slice(0, 6), [interviews, q]);
	const os = (0, import_react.useMemo)(() => offers.filter((o) => matchBoolean(`${o.candidateName} ${o.jobTitle}`, q)).slice(0, 6), [offers, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Enterprise Search",
			description: "Boolean queries across candidates, jobs, interviews, offers, referrals, vendors."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Try: React AND (Senior OR Lead) NOT Manager",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => q && setSaved((a) => [q, ...a.filter((x) => x !== q)].slice(0, 8)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 h-3.5 w-3.5" }), "Save"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-muted-foreground",
					children: "Saved:"
				}), saved.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setQ(s),
					className: "inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-0.5 text-[11px] hover:bg-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-3 w-3" }), s]
				}, s))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
							" Candidates ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: cs.length
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [cs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/recruitment/candidates/$candidateId",
							params: { candidateId: c.id },
							className: "flex items-center gap-2 rounded-md p-2 text-sm hover:bg-accent/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
									name: c.name,
									size: 26
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate text-[11px] text-muted-foreground",
										children: [
											c.appliedPosition,
											" · ",
											c.skills.slice(0, 3).join(", ")
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: c.atsScore
								})
							]
						}, c.id)), cs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 text-xs text-muted-foreground",
							children: "No matches."
						}) : null]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" }),
							" Jobs ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: js.length
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [js.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/recruitment/jobs/$jobId",
							params: { jobId: j.id },
							className: "block rounded-md p-2 text-sm hover:bg-accent/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: j.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									j.department,
									" · ",
									j.workMode,
									" · ",
									j.skills.slice(0, 3).join(", ")
								]
							})]
						}, j.id)), js.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 text-xs text-muted-foreground",
							children: "No matches."
						}) : null]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }),
							" Interviews ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: is.length
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [is.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md p-2 text-sm hover:bg-accent/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium",
								children: [
									i.candidateName,
									" — ",
									i.round
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									new Date(i.date).toLocaleString(),
									" · ",
									i.interviewer
								]
							})]
						}, i.id)), is.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 text-xs text-muted-foreground",
							children: "No matches."
						}) : null]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
							" Offers / ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-4 w-4" }),
							" Referrals ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: os.length
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [os.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md p-2 text-sm hover:bg-accent/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: o.candidateName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									o.jobTitle,
									" · ",
									o.status,
									" · ",
									new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: o.currency,
										maximumFractionDigits: 0
									}).format(o.salary)
								]
							})]
						}, o.id)), os.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 text-xs text-muted-foreground",
							children: "No matches."
						}) : null]
					})]
				})
			]
		})
	] });
}
//#endregion
export { RecruitmentSearchPage };
