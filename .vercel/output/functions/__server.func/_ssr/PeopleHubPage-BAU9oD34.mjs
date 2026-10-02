import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { At as Network, Zt as ListFilter, _ as UserPlus, on as Laptop, p as Users, rr as Crown } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as EmployeeHierarchyView } from "./EmployeeHierarchyView-CpQnyYVH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PeopleHubPage-BAU9oD34.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PEOPLE_MODULES_LIST = [
	{
		id: "employees",
		title: "Employees",
		description: "Manage employee profiles, emergency contacts, job details, and status logs.",
		icon: Users,
		to: "/dashboard/employees",
		color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "managers",
		title: "Managers",
		description: "Assign direct reports, update department management, and review operations.",
		icon: UserPlus,
		to: "/dashboard/managers",
		color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "it-admin",
		title: "IT Admin",
		description: "Manage system administrators, technical infrastructure access, and IT credentials.",
		icon: Laptop,
		to: "/dashboard/it-admin",
		color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30"
	},
	{
		id: "executive",
		title: "Executive",
		description: "Manage C-suite leadership, corporate officers, board designations, and governance.",
		icon: Crown,
		to: "/dashboard/executives",
		color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
	}
];
function PeopleHubPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("directory");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center rounded-lg border border-border/80 bg-card/65 p-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: activeTab === "directory" ? "secondary" : "ghost",
					size: "sm",
					onClick: () => setActiveTab("directory"),
					className: "h-8 gap-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, { className: "h-3.5 w-3.5" }), "Employee Directory"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: activeTab === "hierarchy" ? "secondary" : "ghost",
					size: "sm",
					onClick: () => setActiveTab("hierarchy"),
					className: "h-8 gap-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-3.5 w-3.5 text-primary" }), "Employee Hierarchy"]
				})]
			})
		}), activeTab === "directory" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6 animate-in fade-in duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: PEOPLE_MODULES_LIST.map((module) => {
					const Icon = module.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: module.to,
						className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400",
									children: module.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-normal",
									children: module.description
								})]
							})]
						})
					}, module.id);
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-in fade-in duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeHierarchyView, {})
		})]
	});
}
//#endregion
export { PEOPLE_MODULES_LIST, PeopleHubPage, PeopleHubPage as default };
