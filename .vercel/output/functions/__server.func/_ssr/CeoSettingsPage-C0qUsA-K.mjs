import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { X as Settings, at as Save } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CeoSettingsPage-C0qUsA-K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CeoSettingsPage() {
	const [compName, setCompName] = (0, import_react.useState)("");
	const [taxId, setTaxId] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-slate-800 text-slate-200 border border-slate-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold uppercase",
								children: "CEO Corporate & Enterprise Settings"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Corporate Entity & Executive Governance Settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 max-w-2xl",
							children: "Company legal entity profile, billing & enterprise tier, executive permissions, custom branding, and audit security policies."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: true,
						className: "bg-amber-600/50 text-white/70 text-xs cursor-not-allowed opacity-70",
						title: "Coming soon (Backend API pending)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-3.5 w-3.5" }), "Save Changes (Coming soon)"]
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "profile",
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "profile",
						className: "text-xs font-semibold",
						children: "Company Profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "billing",
						className: "text-xs font-semibold",
						children: "Billing & Tier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "users",
						className: "text-xs font-semibold",
						children: "Executive Users"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "security",
						className: "text-xs font-semibold",
						children: "Security & Audit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "branding",
						className: "text-xs font-semibold",
						children: "Branding"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "profile",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Corporate Legal Entity Profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] text-amber-500/90 border-amber-500/30",
								children: "Backend API Pending"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground block mb-1",
								children: "Company Legal Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								disabled: true,
								value: compName,
								onChange: (e) => setCompName(e.target.value),
								placeholder: "Enter company legal name",
								className: "bg-slate-900/60 text-xs opacity-60 cursor-not-allowed"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground block mb-1",
								children: "Tax ID / Employer Identification Number (EIN)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								disabled: true,
								value: taxId,
								onChange: (e) => setTaxId(e.target.value),
								placeholder: "Enter Tax ID / EIN",
								className: "bg-slate-900/60 font-mono text-xs text-amber-400 opacity-60 cursor-not-allowed"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground/80",
							children: "Corporate legal entity profile persistence is pending backend CEO settings endpoint implementation."
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { CeoSettingsPage, CeoSettingsPage as default };
