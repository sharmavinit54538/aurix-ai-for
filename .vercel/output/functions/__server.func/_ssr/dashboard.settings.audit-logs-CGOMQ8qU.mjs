import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { a as resolveRbacRole, t as AccessDeniedView } from "./AccessDeniedView-ZOkMszu2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings.audit-logs-CGOMQ8qU.js
var import_jsx_runtime = require_jsx_runtime();
function AuditLogsRestrictedPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-4xl mx-auto py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedView, {
			title: "Audit Logs Restricted",
			message: "System audit logs and platform security telemetry are restricted and not part of the OFC360 Organization HR Settings scope. Please contact your system administrator.",
			currentRole: resolveRbacRole(useAurix().user?.role),
			returnUrl: "/dashboard/settings"
		})
	});
}
//#endregion
export { AuditLogsRestrictedPage as component };
