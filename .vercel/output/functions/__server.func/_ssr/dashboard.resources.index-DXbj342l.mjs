import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Mn as Folder, o as Wrench, on as Laptop } from "../_libs/lucide-react.mjs";
import { t as ModuleHubView } from "./ModuleHubView-DR9XGfmj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.resources.index-DXbj342l.js
var import_jsx_runtime = require_jsx_runtime();
var RESOURCES_MODULES = [
	{
		id: "documents",
		title: "Document Vault",
		description: "Central repository for company policies, employee handbooks, contracts, and legal templates.",
		icon: Folder,
		to: "/dashboard/resources/documents",
		color: "from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30"
	},
	{
		id: "assets",
		title: "Asset Inventory",
		description: "IT hardware inventory, laptops, monitors, mobile devices, and warranty tracking.",
		icon: Laptop,
		to: "/dashboard/resources/assets",
		color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30"
	},
	{
		id: "asset-management",
		title: "Asset Management & QR",
		description: "Manage asset allocations, check-ins, return handovers, maintenance, and QR sticker generation.",
		icon: Wrench,
		to: "/dashboard/resources/asset-management",
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	}
];
function ResourcesHubPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleHubView, { modules: RESOURCES_MODULES });
}
//#endregion
export { ResourcesHubPage as component };
