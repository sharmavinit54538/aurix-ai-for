import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { B as useRouter, l as useLocation, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { di as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
/**
* Routes where the global BackButton should NOT be rendered.
* Easy to extend with new paths or RegExp patterns.
*/
var EXCLUDED_BACK_BUTTON_ROUTES = [
	"/",
	"/dashboard",
	"/dashboard/",
	"/dashboard/employee",
	"/dashboard/manager",
	"/dashboard/executive/ceo",
	"/dashboard/executive/cio",
	"/dashboard/executive/cto",
	"/dashboard/recruitment/templates",
	"/dashboard/recruitment/templates/",
	"/login",
	"/register",
	"/forgot-password",
	"/reset-password",
	"/verify-email",
	"/verify-reset-otp",
	"/onboarding",
	"/employee-onboarding",
	"/about",
	"/pricing",
	"/features",
	"/faq",
	"/contact",
	"/privacy",
	"/terms",
	"/blog",
	"/blog/"
];
function isRouteExcluded(pathname, _search, excludedList = EXCLUDED_BACK_BUTTON_ROUTES) {
	if (!pathname) return true;
	const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
	return excludedList.some((item) => {
		if (typeof item === "string") return normalized === (item.length > 1 ? item.replace(/\/+$/, "") : item);
		if (item instanceof RegExp) return item.test(pathname) || item.test(normalized);
		return false;
	});
}
function getSensibleFallback(pathname) {
	if (!pathname) return "/";
	if (pathname.startsWith("/dashboard/settings")) return "/dashboard";
	if (pathname.startsWith("/dashboard")) return "/dashboard";
	if (pathname.startsWith("/blog/")) return "/blog";
	return "/";
}
var BackButton = ({ label = "Back", showLabel = true, fallbackTo, className, onClick, excludedRoutes = EXCLUDED_BACK_BUTTON_ROUTES }) => {
	const router = useRouter();
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location?.pathname ?? "";
	const search = location?.search ?? {};
	const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
	if (isRouteExcluded(pathname, search, excludedRoutes)) return null;
	const hasSectionParam = Boolean(search && typeof search === "object" ? search.section : typeof search === "string" ? search.includes("section=") : false);
	const isSettingsSection = normalizedPath.startsWith("/dashboard/settings/") && normalizedPath !== "/dashboard/settings/" || normalizedPath === "/dashboard/settings" && hasSectionParam;
	const effectiveLabel = label === "Back" && isSettingsSection ? "Back to Settings" : label;
	const canGoBackInApp = () => {
		if (typeof window === "undefined") return false;
		try {
			if (typeof router?.history?.canGoBack === "function") return router.history.canGoBack();
			const tsrIndex = (router?.history?.location?.state)?.__TSR_index ?? (window.history?.state)?.__TSR_index;
			if (typeof tsrIndex === "number") return tsrIndex > 0;
			return (window.history?.length ?? 0) > 1;
		} catch {
			return false;
		}
	};
	const handleClick = (e) => {
		e.preventDefault();
		if (onClick) {
			onClick();
			return;
		}
		try {
			if (isSettingsSection) {
				navigate({
					to: "/dashboard/settings",
					search: {}
				});
				return;
			}
			if (normalizedPath === "/dashboard/settings") {
				navigate({ to: "/dashboard" });
				return;
			}
			if (canGoBackInApp()) router.history.back();
			else navigate({ to: fallbackTo || getSensibleFallback(pathname) });
		} catch (error) {
			console.error("BackButton navigation error:", error);
			try {
				navigate({ to: fallbackTo || getSensibleFallback(pathname) });
			} catch {
				if (typeof window !== "undefined") window.location.href = fallbackTo || getSensibleFallback(pathname);
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "sm",
			onClick: handleClick,
			className: "group -ml-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground cursor-pointer",
			"aria-label": effectiveLabel,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 transition-transform group-hover:-translate-x-0.5" }), showLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: effectiveLabel })]
		})
	});
};
//#endregion
export { BackButton as t };
