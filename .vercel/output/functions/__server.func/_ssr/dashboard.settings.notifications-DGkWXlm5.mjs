import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as SettingsLayout } from "./SettingsLayout-CtnalRxw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings.notifications-DGkWXlm5.js
var import_jsx_runtime = require_jsx_runtime();
function NotificationSettingsRoutePage() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full min-w-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsLayout, {
			initialSection: "notifications",
			onSectionChange: (section) => {
				if (!section) navigate({ to: "/dashboard/settings" });
				else navigate({
					to: "/dashboard/settings",
					search: { section }
				});
			}
		})
	});
}
//#endregion
export { NotificationSettingsRoutePage as component };
