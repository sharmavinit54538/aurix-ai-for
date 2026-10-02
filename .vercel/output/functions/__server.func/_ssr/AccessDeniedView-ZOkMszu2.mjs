import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { J as ShieldAlert, di as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { a as normalizeRole } from "./aurix-store-BcCbMqU4.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var RBAC_ROLE_LABELS = {
	super_admin: "SUPER ADMIN",
	hr_admin: "HR ADMIN",
	manager: "MANAGER",
	it_admin: "IT ADMIN",
	executive: "EXECUTIVE",
	employee: "EMPLOYEE",
	recruiter: "RECRUITER"
};
function getRbacRoleLabel(role) {
	return RBAC_ROLE_LABELS[role] ?? "EMPLOYEE";
}
/**
* Normalizes any role representation from backend/auth tokens into the 6 standard OFC360 roles.
*/
function resolveRbacRole(roleString) {
	return normalizeRole(roleString) ?? "employee";
}
var RBAC_PERMISSIONS = {
	super_admin: {
		company: "denied",
		profile: "edit",
		employees: "denied",
		attendance: "denied",
		leave: "denied",
		payroll: "denied",
		documents: "denied",
		assets: "denied",
		notifications: "edit"
	},
	hr_admin: {
		company: "edit",
		profile: "edit",
		employees: "edit",
		attendance: "edit",
		leave: "edit",
		payroll: "edit",
		documents: "edit",
		assets: "edit",
		notifications: "edit"
	},
	manager: {
		company: "denied",
		profile: "edit",
		employees: "view",
		attendance: "view",
		leave: "view",
		payroll: "denied",
		documents: "view",
		assets: "view",
		notifications: "edit"
	},
	it_admin: {
		company: "denied",
		profile: "edit",
		employees: "denied",
		attendance: "denied",
		leave: "denied",
		payroll: "denied",
		documents: "view",
		assets: "edit",
		notifications: "edit"
	},
	executive: {
		company: "view",
		profile: "edit",
		employees: "view",
		attendance: "view",
		leave: "view",
		payroll: "view",
		documents: "view",
		assets: "view",
		notifications: "edit"
	},
	employee: {
		company: "denied",
		profile: "edit",
		employees: "denied",
		attendance: "denied",
		leave: "denied",
		payroll: "denied",
		documents: "denied",
		assets: "denied",
		notifications: "view"
	},
	recruiter: {
		company: "denied",
		profile: "edit",
		employees: "view",
		attendance: "denied",
		leave: "view",
		payroll: "denied",
		documents: "view",
		assets: "denied",
		notifications: "edit"
	}
};
function getSectionPermission(role, section) {
	return RBAC_PERMISSIONS[role]?.[section] ?? "denied";
}
function canAccessSection(role, section) {
	return getSectionPermission(role, section) !== "denied";
}
function canEditSection(role, section) {
	return getSectionPermission(role, section) === "edit";
}
function AccessDeniedView({ title = "Access Restricted", message = "You do not have the required permissions to view or configure this settings section.", currentRole, requiredRoles, returnUrl = "/dashboard/settings" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-base font-semibold tracking-tight text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground",
				children: message
			}),
			currentRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Your Role:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: currentRole
				})]
			}),
			requiredRoles && requiredRoles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[11px] text-muted-foreground",
				children: [
					"Permitted roles:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: requiredRoles.join(", ")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					asChild: true,
					className: "gap-2 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: returnUrl,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Back to Settings Overview"]
					})
				})
			})
		]
	});
}
//#endregion
export { resolveRbacRole as a, getRbacRoleLabel as i, canAccessSection as n, canEditSection as r, AccessDeniedView as t };
