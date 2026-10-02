import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GeminiIcon-7yNPSnS8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GeminiIcon({ className = "h-5 w-5", gradient = false, ...props }) {
	const gradientId = `gemini-grad-${import_react.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 296 298",
		className,
		fill: gradient ? `url(#${gradientId})` : "currentColor",
		xmlns: "http://www.w3.org/2000/svg",
		"aria-hidden": "true",
		...props,
		children: [gradient && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
			id: gradientId,
			x1: "0%",
			y1: "100%",
			x2: "100%",
			y2: "0%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "#1B96FF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "32%",
					stopColor: "#7B61FF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "68%",
					stopColor: "#E25595"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "#FF8F50"
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: gradient ? `url(#${gradientId})` : "currentColor",
			d: "M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z"
		})]
	});
}
//#endregion
export { GeminiIcon as t };
