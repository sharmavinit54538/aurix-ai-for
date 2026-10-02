import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-DXKaDkGw.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
	className: "text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl font-bold",
		children: "Article not found"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/blog",
		className: "mt-6 inline-block text-brand",
		children: "Back to blog"
	})]
}) });
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
