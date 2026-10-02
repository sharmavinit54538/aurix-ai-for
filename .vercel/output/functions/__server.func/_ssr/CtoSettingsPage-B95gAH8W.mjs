import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { X as Settings, at as Save } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CtoSettingsPage-B95gAH8W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CtoSettingsPage() {
	const [githubOrg, setGithubOrg] = (0, import_react.useState)("");
	const [awsAccount, setAwsAccount] = (0, import_react.useState)("");
	const [qdrantHost, setQdrantHost] = (0, import_react.useState)("");
	const [orgName, setOrgName] = (0, import_react.useState)("");
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
								children: "CTO Organization & Platform Settings"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Engineering Platform & Integration Settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 max-w-2xl",
							children: "Git VCS integrations, cloud providers credentials (AWS, Azure, GCP), automated backup schedules, security policies, and billing overview."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: true,
						className: "bg-indigo-600/50 text-white/70 text-xs cursor-not-allowed opacity-70",
						title: "Coming soon (Backend API pending)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-3.5 w-3.5" }), "Save Configuration (Coming soon)"]
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "general",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "general",
							className: "text-xs font-semibold",
							children: "General"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "git",
							className: "text-xs font-semibold",
							children: "Git Integrations"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "cloud",
							className: "text-xs font-semibold",
							children: "Cloud Providers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "notifications",
							className: "text-xs font-semibold",
							children: "Notifications"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "security",
							className: "text-xs font-semibold",
							children: "Security Policies"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "billing",
							className: "text-xs font-semibold",
							children: "Billing & Cloud Cost"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "backup",
							className: "text-xs font-semibold",
							children: "Automated Backup"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "general",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-foreground",
									children: "General Platform Configuration"
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
									children: "Organization Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									disabled: true,
									value: orgName,
									onChange: (e) => setOrgName(e.target.value),
									placeholder: "e.g. Your Company Name",
									className: "bg-slate-900/60 text-xs opacity-60 cursor-not-allowed"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground block mb-1",
									children: "Primary Vector DB Endpoint"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									disabled: true,
									value: qdrantHost,
									onChange: (e) => setQdrantHost(e.target.value),
									placeholder: "e.g. qdrant.internal:6333",
									className: "bg-slate-900/60 font-mono text-xs text-indigo-400 opacity-60 cursor-not-allowed"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground/80",
								children: "Platform configuration persistence is pending backend CTO settings endpoint implementation."
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "git",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Version Control (GitHub / GitLab Integration)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] text-amber-500/90 border-amber-500/30",
								children: "Backend API Pending"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground block mb-1",
								children: "GitHub Enterprise Organization"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								disabled: true,
								value: githubOrg,
								onChange: (e) => setGithubOrg(e.target.value),
								placeholder: "e.g. github-organization-slug",
								className: "bg-slate-900/60 font-mono text-xs text-indigo-400 opacity-60 cursor-not-allowed"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-muted text-muted-foreground border-border text-[10px]",
								children: "Pending Backend Integration"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "cloud",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-foreground",
								children: "Cloud Account & Infrastructure Connection"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] text-amber-500/90 border-amber-500/30",
								children: "Backend API Pending"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground block mb-1",
								children: "AWS Production Account ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								disabled: true,
								value: awsAccount,
								onChange: (e) => setAwsAccount(e.target.value),
								placeholder: "e.g. 123456789012",
								className: "bg-slate-900/60 font-mono text-xs text-sky-400 opacity-60 cursor-not-allowed"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-muted text-muted-foreground border-border text-[10px]",
								children: "Pending IAM OIDC Integration"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "notifications",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
						children: "No notification channels configured. Add Slack, PagerDuty, or Webhook destinations."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "security",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
						children: "Default security baseline active. Configure SSO, SAML, and IP whitelists."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "billing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground",
						children: "No cloud billing account linked. Connect AWS Cost Explorer or GCP Billing API."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "backup",
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
export { CtoSettingsPage, CtoSettingsPage as default };
