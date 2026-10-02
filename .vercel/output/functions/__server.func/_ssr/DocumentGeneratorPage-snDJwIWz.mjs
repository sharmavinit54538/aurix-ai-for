import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Bn as FilePlusCorner, Jr as Briefcase, Ln as FileText, T as TriangleAlert, Ut as LogOut, er as Download, oi as Award, u as WandSparkles, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as AIHero } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DocumentGeneratorPage-snDJwIWz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATES = [
	{
		id: "offer",
		title: "Offer Letter",
		icon: FileText,
		tone: "from-sky-500/20 to-cyan-500/10"
	},
	{
		id: "appointment",
		title: "Appointment Letter",
		icon: Briefcase,
		tone: "from-violet-500/20 to-purple-500/10"
	},
	{
		id: "experience",
		title: "Experience Letter",
		icon: FileText,
		tone: "from-emerald-500/20 to-teal-500/10"
	},
	{
		id: "promotion",
		title: "Promotion Letter",
		icon: Award,
		tone: "from-amber-500/20 to-orange-500/10"
	},
	{
		id: "warning",
		title: "Warning Letter",
		icon: TriangleAlert,
		tone: "from-rose-500/20 to-red-500/10"
	},
	{
		id: "relieving",
		title: "Relieving Letter",
		icon: LogOut,
		tone: "from-indigo-500/20 to-blue-500/10"
	},
	{
		id: "termination",
		title: "Termination Letter",
		icon: CircleX,
		tone: "from-rose-500/20 to-red-500/10"
	}
];
function DocumentGeneratorPage() {
	const [selected, setSelected] = (0, import_react.useState)("offer");
	const [name, setName] = (0, import_react.useState)("Aanya Sharma");
	const [role, setRole] = (0, import_react.useState)("Senior Engineer");
	const [draft, setDraft] = (0, import_react.useState)(null);
	function generate() {
		const t = TEMPLATES.find((x) => x.id === selected);
		setDraft(`${t.title}

Dear ${name},

We are pleased to inform you regarding your ${t.title.toLowerCase()} as ${role} at OFC360 Inc.
This letter confirms the terms and conditions of your engagement, effective from the joining date discussed.

Sincerely,
HR Team — OFC360 Inc.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIHero, {
		icon: FilePlusCorner,
		eyebrow: "AI Document Generator",
		title: "Draft HR documents in seconds",
		description: "Generate offers, appointment, experience, promotion, warning, relieving and termination letters.",
		lastAnalysis: "30 min ago"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 lg:col-span-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-sm font-semibold",
					children: "Select template"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-2",
					children: TEMPLATES.map((t) => {
						const Icon = t.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(t.id),
							className: `relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 text-left text-sm transition-colors ${selected === t.id ? "border-foreground/30 bg-accent" : "border-border bg-background/40 hover:bg-accent/60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${t.tone} blur-2xl` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative grid h-8 w-8 place-items-center rounded-lg bg-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative font-medium",
									children: t.title
								})
							]
						}, t.id);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-sm font-semibold",
					children: "Recipient"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Full name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: role,
							onChange: (e) => setRole(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: generate,
							className: "w-full gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" }), " Generate with AI"]
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-[560px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: !draft,
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Download"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-auto p-6",
					children: draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap font-display text-sm leading-relaxed",
						children: draft
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-center text-sm text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
							}),
							"Select a template and click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: "Generate with AI"
							}),
							" to draft a document."
						] })
					})
				})]
			})
		})]
	})] });
}
//#endregion
export { DocumentGeneratorPage as default };
