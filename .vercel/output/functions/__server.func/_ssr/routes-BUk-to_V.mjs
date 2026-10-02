import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { H as Sparkles, in as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { B as getSafeRedirectUrl, V as hasValidAccessToken, nt as useAuthReady } from "./auth-bootstrap-CR9kF6gO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BUk-to_V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	const navigate = useNavigate();
	const authReady = useAuthReady();
	(0, import_react.useEffect)(() => {
		if (!authReady) return;
		const workspace = aurix.get();
		if (!workspace.user || !hasValidAccessToken()) navigate({
			to: "/login",
			replace: true
		});
		else {
			const params = new URLSearchParams(window.location.search);
			navigate({
				to: getSafeRedirectUrl(params.get("redirect") || params.get("callbackUrl"), workspace.user),
				replace: true
			});
		}
	}, [authReady, navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-4 shadow-elegant backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 font-display text-base font-semibold tracking-tight",
				children: ["Opening OFC360 Workspace", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading your workspace dashboard…"
			})] })]
		})
	});
}
//#endregion
export { Index as component };
