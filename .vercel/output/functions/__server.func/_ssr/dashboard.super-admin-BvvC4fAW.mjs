import { p as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { t as AccessDeniedState } from "./SuperAdminStates-C68AaNca.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin-BvvC4fAW.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Layout for every /dashboard/super-admin/* page.
*
* Route-level `beforeLoad` in /dashboard already redirects non-super-admin roles; this component
* re-checks the role verified by `/auth/me` on every render so no Super Admin page (and no Super
* Admin API call) mounts for another role. The backend independently enforces `require_super_admin`
* on every /api/v1/super-admin endpoint.
*/
function SuperAdminLayout() {
	if (useCurrentRole() !== "super_admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
//#endregion
export { SuperAdminLayout as component };
