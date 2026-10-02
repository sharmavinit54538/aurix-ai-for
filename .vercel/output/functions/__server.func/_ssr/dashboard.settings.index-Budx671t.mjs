import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as Route$155 } from "./auth-bootstrap-CR9kF6gO.mjs";
import { t as SettingsLayout } from "./SettingsLayout-CtnalRxw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings.index-Budx671t.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsIndexPage() {
	const search = Route$155.useSearch();
	const navigate = useNavigate({ from: "/dashboard/settings/" });
	const handleSectionChange = (section) => {
		navigate({
			search: section ? { section } : {},
			replace: false
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full min-w-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsLayout, {
			initialSection: search.section,
			onSectionChange: handleSectionChange
		})
	});
}
//#endregion
export { SettingsIndexPage as component };
