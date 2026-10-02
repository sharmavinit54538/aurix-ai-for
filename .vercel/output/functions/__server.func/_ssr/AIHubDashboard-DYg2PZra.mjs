import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { An as Gauge, Bn as FilePlusCorner, Fr as ChartLine, It as MessageSquare, Jr as Briefcase, Ln as FileText, P as Target, Yr as Brain, ei as BookOpen, f as Video, gn as HeartPulse, pr as Clock, q as ShieldCheck, ri as Banknote } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AIHubDashboard-DYg2PZra.js
var import_jsx_runtime = require_jsx_runtime();
var AI_MODULES_LIST = [
	{
		id: "workforce-insights",
		title: "Workforce Insights",
		description: "Analyze team composition, skill maps, and talent pipelines.",
		icon: Brain,
		to: "/ai/workforce-insights",
		color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "recruiter",
		title: "Recruiter",
		description: "Auto-screen resumes, match candidates to JDs, and generate behavioral questions.",
		icon: Briefcase,
		to: "/ai/recruiter",
		color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "attendance-monitor",
		title: "Attendance Monitor",
		description: "Detect attendance anomalies, late punch trends, and schedule shifts.",
		icon: Clock,
		to: "/ai/attendance-monitor",
		color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30"
	},
	{
		id: "leave-assistant",
		title: "Leave Assistant",
		description: "Forecast leave requests, analyze patterns, and streamline approvals.",
		icon: FileText,
		to: "/ai/leave-assistant",
		color: "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30"
	},
	{
		id: "performance-coach",
		title: "Performance Coach",
		description: "Generate SMART goals, align department OKRs, and outline training recommendations.",
		icon: Gauge,
		to: "/ai/performance-coach",
		color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30"
	},
	{
		id: "payroll-insights",
		title: "Payroll Insights",
		description: "Benchmark salaries, detect variance anomalies, and run tax audits.",
		icon: Banknote,
		to: "/ai/payroll-insights",
		color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30"
	},
	{
		id: "workforce-planning",
		title: "Workforce Planning",
		description: "Optimize headcount forecasts and forecast future workforce costs.",
		icon: Target,
		to: "/ai/workforce-planning",
		color: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30"
	},
	{
		id: "employee-health",
		title: "Employee Health",
		description: "Monitor burnout risk indices, organization wellness score, and sentiment trends.",
		icon: HeartPulse,
		to: "/ai/employee-health",
		color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30"
	},
	{
		id: "policy-assistant",
		title: "Policy Assistant",
		description: "Resolve compliance queries and audit handbook contracts against labor laws.",
		icon: BookOpen,
		to: "/ai/policy-assistant",
		color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30"
	},
	{
		id: "document-generator",
		title: "Document Generator",
		description: "Generate NDAs, offer letters, and contracts using smart placeholders.",
		icon: FilePlusCorner,
		to: "/ai/document-generator",
		color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30"
	},
	{
		id: "meeting-intelligence",
		title: "Meeting Intelligence",
		description: "Extract key decisions, meeting action items, and live summaries.",
		icon: Video,
		to: "/ai/meeting-intelligence",
		color: "from-fuchsia-500/20 to-violet-500/20 text-fuchsia-400 border-fuchsia-500/30"
	},
	{
		id: "compliance-monitor",
		title: "Compliance Monitor",
		description: "Scan statutory compliance requirements and log SOC-2 checklist scores.",
		icon: ShieldCheck,
		to: "/ai/compliance-monitor",
		color: "from-green-500/20 to-teal-500/20 text-green-400 border-green-500/30"
	},
	{
		id: "chat-assistant",
		title: "Chat Assistant",
		description: "Conversational assistant for company policy and employee handbook Q&A.",
		icon: MessageSquare,
		to: "/ai/chat-assistant",
		color: "from-indigo-500/20 to-cyan-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "analytics-center",
		title: "Analytics Center",
		description: "Run executive data summaries, attrition predictions, and diversity analytics.",
		icon: ChartLine,
		to: "/ai/analytics-center",
		color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30"
	}
];
function AIHubDashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6 animate-in fade-in duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: AI_MODULES_LIST.map((module) => {
					const Icon = module.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: module.to,
						className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400",
									children: module.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-normal",
									children: module.description
								})]
							})]
						})
					}, module.id);
				})
			})
		})
	});
}
//#endregion
export { AIHubDashboard, AIHubDashboard as default, AI_MODULES_LIST };
