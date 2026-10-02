import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Loader-Cc5dgb_b.js
var import_jsx_runtime = require_jsx_runtime();
var iconSizes = {
	sm: "h-4 w-4",
	md: "h-5 w-5",
	lg: "h-6 w-6"
};
function Loader({ label = "Loading...", variant = "inline", size = "md", skeletonRows = 4, className }) {
	const iconClass = iconSizes[size];
	if (variant === "overlay") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/60 backdrop-blur-sm", className),
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-3 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: cn(iconClass, "animate-spin text-primary") }), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted-foreground",
				children: label
			}) : null]
		})
	});
	if (variant === "panel") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-4 p-8", className),
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: cn(iconClass, "animate-spin") }), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: label
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: Array.from({ length: skeletonRows }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, index))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2 text-muted-foreground", className),
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: cn(iconClass, "animate-spin") }), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: label
		}) : null]
	});
}
//#endregion
export { Loader as t };
