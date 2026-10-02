import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { X as Settings, at as Save } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CioSettingsPage-DY2qMj_g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CioSettingsPage() {
	const [apiKey, setApiKey] = (0, import_react.useState)("");
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
								children: "Enterprise IT Infrastructure Settings"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Multi-Cloud Provider Credentials & Security Policies"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 max-w-2xl",
							children: "AWS/Azure/GCP API Keys, IAM user roles & permissions, automated backup frequency settings, and security policy rules."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: true,
						className: "bg-blue-600/50 text-white/70 text-xs cursor-not-allowed opacity-70",
						title: "Coming soon (Backend API pending)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-3.5 w-3.5" }), "Save Configuration (Coming soon)"]
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "keys",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "keys",
							className: "text-xs font-semibold",
							children: "API Keys & Tokens"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "providers",
							className: "text-xs font-semibold",
							children: "Cloud Providers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "policies",
							className: "text-xs font-semibold",
							children: "Security Policies"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "backups",
							className: "text-xs font-semibold",
							children: "Backup Settings"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "keys",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Enterprise Master API Token"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] text-amber-500/90 border-amber-500/30",
								children: "Backend API Pending"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground block mb-1",
								children: "Master Telemetry Key"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								autoComplete: "off",
								disabled: true,
								value: apiKey,
								onChange: (e) => setApiKey(e.target.value),
								placeholder: "e.g. aurix_live_cio_key_...",
								className: "bg-slate-900/60 font-mono text-xs text-cyan-400 opacity-60 cursor-not-allowed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground/80 mt-1.5",
								children: "API key persistence and multi-cloud credential storage is pending backend API implementation."
							})
						] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "providers",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
						children: "No cloud service providers connected."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "policies",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
						children: "No custom security policy overrides defined."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "backups",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
						children: "No automated backup schedules configured."
					})
				})
			]
		})]
	});
}
//#endregion
export { CioSettingsPage, CioSettingsPage as default };
