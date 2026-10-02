import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Dr as ChevronRight, Gt as Lock } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var PAYROLL_LIFECYCLE_STEPS = [
	{
		id: "period",
		stepNumber: 1,
		label: "Period",
		description: "Cycle Setup & Dates",
		getPath: () => "/dashboard/payroll/periods"
	},
	{
		id: "run",
		stepNumber: 2,
		label: "Run",
		description: "Calculation Engine",
		getPath: (runId) => runId ? `/dashboard/payroll/runs/${runId}/processing` : "/dashboard/payroll"
	},
	{
		id: "validation",
		stepNumber: 3,
		label: "Validation",
		description: "Rule & Error Check",
		getPath: (runId) => runId ? `/dashboard/payroll/runs/${runId}/validation` : "/dashboard/payroll"
	},
	{
		id: "preview",
		stepNumber: 4,
		label: "Preview",
		description: "Provisional Numbers",
		getPath: (runId) => runId ? `/dashboard/payroll/runs/${runId}/preview` : "/dashboard/payroll"
	},
	{
		id: "employee_detail",
		stepNumber: 5,
		label: "Employee Detail",
		description: "Salary Breakdown",
		getPath: (runId, empId) => runId && empId ? `/dashboard/payroll/runs/${runId}/employees/${empId}` : runId ? `/dashboard/payroll/runs/${runId}/preview` : "/dashboard/payroll"
	},
	{
		id: "review_approval",
		stepNumber: 6,
		label: "Review & Approval",
		description: "Governance Sign-off",
		getPath: (runId) => runId ? `/dashboard/payroll/runs/${runId}/approval` : "/dashboard/payroll"
	},
	{
		id: "finalization",
		stepNumber: 7,
		label: "Finalization",
		description: "Lock & Seal Pay Run",
		getPath: (runId) => runId ? `/dashboard/payroll/runs/${runId}/finalize` : "/dashboard/payroll"
	},
	{
		id: "payslips",
		stepNumber: 8,
		label: "Payslips",
		description: "Generation & Delivery",
		getPath: (runId, empId) => runId && empId ? `/dashboard/payroll/runs/${runId}/employees/${empId}/payslip` : "/dashboard/payroll/payslips"
	},
	{
		id: "payment",
		stepNumber: 9,
		label: "Payment",
		description: "Disbursement & Bank",
		getPath: (runId, _empId, batchId) => batchId ? `/dashboard/payroll/payments/${batchId}` : runId ? `/dashboard/payroll/runs/${runId}/payment` : "/dashboard/payroll/payments"
	}
];
function PayrollStepper({ currentStep, runId, employeeId, batchId, runStatus, onStepClick, className }) {
	const navigate = useNavigate();
	const currentIndex = PAYROLL_LIFECYCLE_STEPS.findIndex((s) => s.id === currentStep);
	const normalizedStatus = (runStatus || "").toLowerCase();
	const isFinalizedOrPaid = normalizedStatus.includes("final") || normalizedStatus.includes("lock") || normalizedStatus.includes("paid");
	const isApproved = isFinalizedOrPaid || normalizedStatus.includes("approv");
	const getStepState = (index, stepId) => {
		if (!runId && index > 0) return "disabled";
		if (stepId === "payment" && !isFinalizedOrPaid) return "disabled";
		if (stepId === "finalization" && !isApproved) return "disabled";
		if (index < currentIndex) return "completed";
		if (index === currentIndex) return "active";
		return "upcoming";
	};
	const handleStepClick = (stepId, route, state) => {
		if (state === "disabled") return;
		if (onStepClick) {
			onStepClick(stepId, route);
			return;
		}
		if (route) navigate({ to: route });
	};
	const handleKeyDown = (e, stepId, route, state) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleStepClick(stepId, route, state);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Payroll Lifecycle Progress",
		className: cn("w-full rounded-2xl border border-border/60 bg-background/80 p-3 sm:p-4 backdrop-blur-xl shadow-sm", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			role: "list",
			className: "flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-0.5",
			children: PAYROLL_LIFECYCLE_STEPS.map((step, idx) => {
				const state = getStepState(idx, step.id);
				const route = step.getPath(runId, employeeId, batchId);
				const isClickable = state === "completed" || state === "active";
				const isCurrent = state === "active";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					role: "listitem",
					className: "flex items-center gap-1 sm:gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						id: `payroll-stepper-${step.id}`,
						disabled: !isClickable,
						onClick: () => handleStepClick(step.id, route, state),
						onKeyDown: (e) => handleKeyDown(e, step.id, route, state),
						"aria-current": isCurrent ? "step" : void 0,
						"aria-disabled": !isClickable,
						tabIndex: isClickable ? 0 : -1,
						className: cn("group flex items-center gap-2 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", isClickable ? "cursor-pointer hover:bg-muted/70 hover:shadow-xs active:scale-[0.98]" : "cursor-not-allowed opacity-55", isCurrent && "bg-primary/10 text-primary font-medium ring-1 ring-primary/30 shadow-xs"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors duration-200", state === "completed" && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30", state === "active" && "bg-primary text-primary-foreground shadow-sm shadow-primary/25", state === "upcoming" && "bg-muted text-muted-foreground ring-1 ring-border/80", state === "disabled" && "bg-muted/50 text-muted-foreground/60"),
							children: state === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "h-4 w-4 stroke-[2.5]",
								"aria-hidden": "true"
							}) : state === "disabled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
								className: "h-3.5 w-3.5 opacity-60",
								"aria-hidden": "true"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.stepNumber })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-xs font-medium tracking-tight whitespace-nowrap", isCurrent ? "text-primary font-semibold" : state === "completed" ? "text-foreground" : "text-muted-foreground"),
								children: step.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden xl:inline text-[10px] text-muted-foreground/75 whitespace-nowrap",
								children: step.description
							})]
						})]
					}), idx < PAYROLL_LIFECYCLE_STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
						className: cn("h-3.5 w-3.5 shrink-0 transition-colors", idx < currentIndex ? "text-emerald-500/60" : "text-muted-foreground/30"),
						"aria-hidden": "true"
					})]
				}, step.id);
			})
		})
	});
}
//#endregion
export { PayrollStepper as t };
