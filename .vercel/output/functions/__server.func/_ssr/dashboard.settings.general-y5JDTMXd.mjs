import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { a as resolveRbacRole, t as AccessDeniedView } from "./AccessDeniedView-ZOkMszu2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings.general-y5JDTMXd.js
var import_jsx_runtime = require_jsx_runtime();
function GeneralRestrictedPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-4xl mx-auto py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedView, {
			title: "General Settings Not Available",
			message: "System backend parameters are not part of the OFC360 Organization Settings. Please use the Company section for organizational identity, localization, and fiscal year settings.",
			currentRole: resolveRbacRole(useAurix().user?.role),
			returnUrl: "/dashboard/settings"
		})
	});
}
//#endregion
export { GeneralRestrictedPage as component };
