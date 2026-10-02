import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Rt as Megaphone, Z as Server, dr as CodeXml, li as ArrowRight, q as ShieldCheck, rr as Crown, s as Workflow, tr as DollarSign } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.executive.index-YGlok3mo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXECUTIVE_CARDS = [
	{
		role: "ceo",
		title: "CEO Command Center",
		focus: "Company Overview, Revenue, ARR, Headcount & Corporate OKRs",
		icon: Crown,
		color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
		badge: "Enterprise Strategy",
		badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
	},
	{
		role: "cto",
		title: "CTO Command Center",
		focus: "Engineering Velocity, SLA Uptime, P99 Latency & AI Microservices",
		icon: CodeXml,
		color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
		badge: "Tech Architecture",
		badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
	},
	{
		role: "cfo",
		title: "CFO Command Center",
		focus: "Financial Runway, Cash Inflow, Operating Margin & Tax Filings",
		icon: DollarSign,
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
		badge: "Finance & Tax",
		badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
	},
	{
		role: "cio",
		title: "CIO Command Center",
		focus: "IT Asset MDM, ISO 27001 Security, SaaS Licenses & Helpdesk SLA",
		icon: Server,
		color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
		badge: "InfoSec & IT Ops",
		badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
	},
	{
		role: "coo",
		title: "COO Command Center",
		focus: "Operational Efficiency, Process SLAs, Capacity & Attendance",
		icon: Workflow,
		color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30",
		badge: "Workforce Ops",
		badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20"
	},
	{
		role: "cmo",
		title: "CMO Command Center",
		focus: "Lead Generation, CAC, Campaign ROI & Organic Search Funnel",
		icon: Megaphone,
		color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
		badge: "Growth & Brand",
		badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
	}
];
function ExecutiveHubPage() {
	const navigate = useNavigate();
	const rawRole = (useAurix().user?.role || localStorage.getItem("user_role") || "").toLowerCase();
	(0, import_react.useEffect)(() => {
		if ([
			"ceo",
			"cto",
			"cfo",
			"cio",
			"coo",
			"cmo"
		].includes(rawRole)) navigate({
			to: `/dashboard/executive/${rawRole}`,
			replace: true
		});
	}, [rawRole, navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-brand/10 blur-3xl pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5 text-amber-400" }), "Role-Based Executive Control Center"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground",
							children: "Executive Role-Based Dashboards"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-2xl text-sm text-muted-foreground leading-relaxed",
							children: "Separate, isolated command centers tailored for CEO, CTO, CFO, CIO, COO, and CMO leadership roles with role-based access, real-time analytics, AI insights, and OKR tracking."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Role-Based Governance" })]
					})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
			children: EXECUTIVE_CARDS.map((card, idx) => {
				const Icon = card.icon;
				const dataset = {
					kpis: [],
					healthScore: 0
				};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .25,
						delay: idx * .05
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: `/dashboard/executive/${card.role}`,
						className: "group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:bg-accent/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${card.color} transition-transform duration-200 group-hover:scale-105 shadow-sm`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[10px] font-semibold border ${card.badgeColor}`,
									children: card.badge
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: card.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
								children: card.focus
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-border/40 space-y-2",
							children: [dataset.kpis.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2 text-left",
								children: dataset.kpis.slice(0, 2).map((kpi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-accent/20 rounded-lg p-2 border border-border/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] uppercase font-semibold text-muted-foreground/70 block truncate",
										children: kpi.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-xs font-bold text-foreground truncate block",
										children: kpi.value
									})]
								}, kpi.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-accent/10 rounded-lg p-2 border border-border/20 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: "Telemetry feeds pending integration"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-semibold text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }),
										" Score: ",
										dataset.healthScore > 0 ? `${dataset.healthScore}%` : "—"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary font-semibold group-hover:underline",
									children: "Open Dashboard →"
								})]
							})]
						})]
					})
				}, card.role);
			})
		})]
	});
}
var SplitComponent = ExecutiveHubPage;
//#endregion
export { SplitComponent as component };
