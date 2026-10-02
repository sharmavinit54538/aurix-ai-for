import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ModuleHubView-DR9XGfmj.js
var import_jsx_runtime = require_jsx_runtime();
function ModuleHubView({ eyebrow, title, description, headerIcon: HeaderIcon, modules }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [Boolean(eyebrow || title || description || HeaderIcon) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col min-w-0 gap-2 text-left",
			children: [eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
				children: eyebrow
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-3",
				children: [HeaderIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderIcon, { className: "h-5 w-5" })
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold tracking-tight text-foreground",
						children: title
					}) : null, description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: description
					}) : null]
				})]
			})]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: modules.map((m) => {
				const Icon = m.icon;
				const gradient = m.color || "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: m.to,
					className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl hover:bg-accent/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${gradient} transition-transform duration-200 group-hover:scale-105`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
									children: m.title
								}), m.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
									children: m.badge
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground leading-relaxed",
								children: m.description
							})]
						})]
					})
				}, m.id);
			})
		})]
	});
}
//#endregion
export { ModuleHubView as t };
