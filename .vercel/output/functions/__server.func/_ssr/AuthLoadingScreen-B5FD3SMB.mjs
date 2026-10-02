import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { qt as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthLoadingScreen-B5FD3SMB.js
var import_jsx_runtime = require_jsx_runtime();
function AuthLoadingScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-4 shadow-elegant backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 font-display text-base font-semibold tracking-tight",
				children: "Verifying session..."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Please wait while we restore your secure session."
			})] })]
		})
	});
}
//#endregion
export { AuthLoadingScreen as t };
