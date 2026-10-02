import { v as Navigate, x as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payroll.runs._runId.validation-BKFHxfdL.js
var import_jsx_runtime = require_jsx_runtime();
function PayrollValidationRedirect() {
	const { runId } = useParams({ strict: false });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: `/dashboard/payroll/runs/${runId || ""}/validation`,
		replace: true
	});
}
//#endregion
export { PayrollValidationRedirect as component };
