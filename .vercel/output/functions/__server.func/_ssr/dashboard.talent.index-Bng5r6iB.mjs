import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Jr as Briefcase, P as Target } from "../_libs/lucide-react.mjs";
import { t as ModuleHubView } from "./ModuleHubView-DR9XGfmj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.talent.index-Bng5r6iB.js
var import_jsx_runtime = require_jsx_runtime();
var TALENT_MODULES = [{
	id: "recruitment",
	title: "Recruitment (ATS)",
	description: "End-to-end applicant tracking, job requisitions, candidate screening, and interview scheduling.",
	icon: Briefcase,
	to: "/dashboard/talent/recruitment",
	color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30"
}, {
	id: "performance",
	title: "Performance & Goals",
	description: "360-degree feedback reviews, OKR goal setting, performance appraisals, and employee scorecards.",
	icon: Target,
	to: "/dashboard/talent/performance",
	color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30"
}];
function TalentHubPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleHubView, { modules: TALENT_MODULES });
}
//#endregion
export { TalentHubPage as component };
