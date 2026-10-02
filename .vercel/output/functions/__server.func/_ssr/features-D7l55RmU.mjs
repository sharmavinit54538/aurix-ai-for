import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Dn as GitBranch, Gt as Lock, H as Sparkles, Ir as ChartColumn, It as MessageSquare, an as Layers, ar as Cpu, i as Zap, ni as Bell, s as Workflow, xn as Globe } from "../_libs/lucide-react.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
import { t as CTA } from "./CTA-CtJUg4T2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/features-D7l55RmU.js
var import_jsx_runtime = require_jsx_runtime();
var detailed = [
	{
		icon: Workflow,
		title: "Unified planning",
		desc: "Roadmaps, sprints, and quarterly goals — connected by default. No more reconciling four tools."
	},
	{
		icon: Sparkles,
		title: "OFC360",
		desc: "Drafts updates, summarizes threads, and triages issues. Trained on your team's context, not the internet."
	},
	{
		icon: ChartColumn,
		title: "Insights",
		desc: "Velocity, cycle time, and team health — out of the box. No dashboards to build."
	},
	{
		icon: GitBranch,
		title: "Deep code integrations",
		desc: "Bi-directional sync with GitHub, GitLab, and Linear. Issues update from PR titles automatically."
	},
	{
		icon: MessageSquare,
		title: "Threaded discussions",
		desc: "Discuss in context. Decisions are linked to the work — not lost in Slack."
	},
	{
		icon: Calendar,
		title: "Smart scheduling",
		desc: "OFC360 learns your team's rhythm and suggests realistic timelines."
	}
];
var capabilities = [
	{
		icon: Zap,
		title: "100ms everything",
		desc: "Local-first architecture. Optimistic UI. Keyboard shortcuts for every action."
	},
	{
		icon: Search,
		title: "Universal search",
		desc: "Find anything across projects, docs, comments, and files in milliseconds."
	},
	{
		icon: Bell,
		title: "Calm notifications",
		desc: "Smart batching. You decide what's worth interrupting you."
	},
	{
		icon: Layers,
		title: "Custom views",
		desc: "Slice your data by any field, save as a view, share with your team."
	},
	{
		icon: Lock,
		title: "Granular permissions",
		desc: "Project, document, and field-level access — without becoming an admin headache."
	},
	{
		icon: Cpu,
		title: "API & webhooks",
		desc: "Build on top of OFC360 with a clean, fully documented REST and GraphQL API."
	}
];
var integrations = [
	"GitHub",
	"GitLab",
	"Slack",
	"Figma",
	"Linear",
	"Notion",
	"Jira",
	"Zoom",
	"Google Drive",
	"Loom",
	"Datadog",
	"Sentry"
];
function FeaturesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-hero-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				className: "relative text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Features"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight",
						children: [
							"One workspace. ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient",
								children: "Infinite leverage"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-lg text-muted-foreground max-w-2xl mx-auto",
						children: "OFC360 is engineered to make every step from idea to shipped feel effortless. Here's how."
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Core",
			title: "The work surface, redesigned"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 grid md:grid-cols-2 gap-5",
			children: detailed.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group glass rounded-3xl p-8 hover:shadow-elegant transition-all relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-10 blur-3xl group-hover:opacity-30 transition-opacity" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5 text-brand-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl font-bold mb-2",
						children: f.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground leading-relaxed",
						children: f.desc
					})
				]
			}, f.title))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Capabilities",
			title: "Power in every detail",
			subtitle: "The small things that compound into a product your team won't want to leave."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5",
			children: capabilities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl p-6 border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "h-5 w-5 text-brand mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold mb-2",
						children: c.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: c.desc
					})
				]
			}, c.title))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "In action",
			title: "See it work"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 bg-gradient-brand opacity-30 blur-3xl rounded-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative glass rounded-3xl p-2 shadow-elegant",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl bg-card border border-border overflow-hidden min-h-[480px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-12 h-full min-h-[480px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-3 border-r border-border p-4 hidden md:flex flex-col gap-1",
							children: [
								"Inbox",
								"Today",
								"Projects",
								"Roadmap",
								"Docs",
								"Insights"
							].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `px-3 py-2 rounded-lg text-sm ${i === 2 ? "bg-secondary" : "text-muted-foreground"}`,
								children: s
							}, s))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 md:col-span-9 p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Projects"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl font-bold",
									children: "All work"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-32 rounded-lg bg-gradient-brand opacity-80" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid sm:grid-cols-3 gap-3",
								children: [
									1,
									2,
									3,
									4,
									5,
									6
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4 hover:bg-secondary/40 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 w-12 rounded-full mb-3 ${i % 3 === 0 ? "bg-chart-2" : i % 3 === 1 ? "bg-brand" : "bg-chart-4"}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm font-medium",
											children: ["Project ", i]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground mt-1",
											children: [
												12 + i * 3,
												" tasks · ",
												Math.floor(40 + i * 8),
												"%"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 h-1.5 rounded-full bg-secondary overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-gradient-brand",
												style: { width: `${40 + i * 8}%` }
											})
										})
									]
								}, i))
							})]
						})]
					})
				})
			})]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Integrations",
			title: "Plays nicely with your stack",
			subtitle: "Connect OFC360 to the tools your team already uses."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4",
			children: integrations.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-5 text-center hover:shadow-elegant transition-all",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 rounded-lg bg-gradient-brand mx-auto mb-3 opacity-80 grid place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5 text-brand-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: name
				})]
			}, name))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {})
	] });
}
//#endregion
export { FeaturesPage as component };
