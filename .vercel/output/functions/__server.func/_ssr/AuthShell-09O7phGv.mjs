import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { H as Sparkles } from "../_libs/lucide-react.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthShell-09O7phGv.js
var import_jsx_runtime = require_jsx_runtime();
function AuthShell({ title, subtitle, children, footer }) {
	useAurix();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 -z-10",
				style: { background: "var(--gradient-hero)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute -left-32 top-1/3 -z-10 h-96 w-96 rounded-full opacity-30 blur-3xl",
				style: { background: "var(--gradient-brand)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "px-6 py-6 sm:px-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow",
						style: { background: "var(--gradient-brand)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "OFC360"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex min-h-[calc(100vh-120px)] items-center justify-center px-6 pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .4,
						ease: "easeOut"
					},
					className: "w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-card/70 p-8 shadow-elegant backdrop-blur-xl",
						style: { borderColor: "var(--glass-border)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-semibold tracking-tight",
								children: title
							}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: subtitle
							}) : null]
						}), children]
					}), footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: footer
					}) : null]
				})
			}),
			null
		]
	});
}
//#endregion
export { AuthShell as t };
