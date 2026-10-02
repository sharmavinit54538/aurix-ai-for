import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as useAurix, t as aurix } from "./aurix-store-BcCbMqU4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employee-onboarding-B3ANVRby.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeeOnboardingRedirect() {
	const ws = useAurix();
	(0, import_react.useEffect)(() => {
		if (ws.user && !ws.user.onboardingComplete) aurix.set({ user: {
			...ws.user,
			onboardingComplete: true
		} });
	}, [ws.user]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/dashboard",
		replace: true
	});
}
//#endregion
export { EmployeeOnboardingRedirect as component };
