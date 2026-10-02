import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { a as resolveRbacRole, t as AccessDeniedView } from "./AccessDeniedView-ZOkMszu2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings.roles-permissions-CZORl6eJ.js
var import_jsx_runtime = require_jsx_runtime();
function RolesPermissionsRestrictedPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-4xl mx-auto py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedView, {
			title: "Roles & Permissions Configuration Restricted",
			message: "System roles governance is restricted and managed globally by the platform SUPER ADMIN. To configure employee department designations and access, use the Employees section.",
			currentRole: resolveRbacRole(useAurix().user?.role),
			returnUrl: "/dashboard/settings"
		})
	});
}
//#endregion
export { RolesPermissionsRestrictedPage as component };
