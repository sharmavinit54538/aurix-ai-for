import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as EmployeeHierarchyView } from "./EmployeeHierarchyView-CpQnyYVH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.hierarchy-BnWKT3of.js
var import_jsx_runtime = require_jsx_runtime();
function HierarchyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Organizational Graph",
			description: "Interactive, relationship-aware organizational intelligence layer with real-time reporting paths, department mapping, skill analysis, and AI-powered insights."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeHierarchyView, {})]
	});
}
//#endregion
export { HierarchyPage as component };
