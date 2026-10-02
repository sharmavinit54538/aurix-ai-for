import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { li as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as Section } from "./Section-DJoe2-ib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CTA-CtJUg4T2.js
var import_jsx_runtime = require_jsx_runtime();
function CTA({ title = "Ready to ship faster?", subtitle = "Join thousands of teams using OFC360 to build, launch, and scale their products." }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-3xl border border-border p-8 sm:p-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-brand opacity-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[600px] bg-gradient-brand blur-3xl opacity-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl sm:text-5xl font-bold tracking-tight",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-muted-foreground max-w-xl mx-auto",
						children: subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/register",
							className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity",
							children: ["Get started free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "inline-flex items-center justify-center px-6 py-3 rounded-xl glass font-medium hover:bg-secondary transition-colors",
							children: "Talk to sales"
						})]
					})
				]
			})
		]
	}) });
}
//#endregion
export { CTA as t };
