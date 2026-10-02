import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { h as formatRoleLabel } from "./SuperAdminStates-C68AaNca.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Badges-BovbKWqK.js
var import_jsx_runtime = require_jsx_runtime();
var ROLE_TONES = [
	{
		roles: ["super_admin"],
		className: "bg-purple-500/10 text-purple-400 border-purple-500/30"
	},
	{
		roles: [
			"hr_admin",
			"admin",
			"company_admin",
			"hr_manager"
		],
		className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
	},
	{
		roles: ["manager"],
		className: "bg-blue-500/10 text-blue-400 border-blue-500/30"
	},
	{
		roles: ["employee", "intern"],
		className: "bg-sky-500/10 text-sky-400 border-sky-500/30"
	},
	{
		roles: ["it_admin"],
		className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
	},
	{
		roles: [
			"executive",
			"ceo",
			"cto",
			"cfo",
			"coo",
			"cmo",
			"clo",
			"ciso",
			"cio"
		],
		className: "bg-amber-500/10 text-amber-400 border-amber-500/30"
	}
];
function RoleBadge({ role }) {
	const key = role?.trim().toLowerCase() ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase", ROLE_TONES.find((entry) => entry.roles.includes(key))?.className ?? "bg-muted text-foreground border-border"),
		children: formatRoleLabel(role)
	});
}
function AccountStatusBadge({ isActive }) {
	if (isActive === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[11px] text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold", isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border-rose-500/30"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-400" : "bg-rose-400") }), isActive ? "Active" : "Inactive"]
	});
}
/** Tenant status as derived by the backend from onboarding + subscription state. */
function OrganizationStatusBadge({ status }) {
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[11px] text-muted-foreground",
		children: "—"
	});
	const normalized = status.toLowerCase();
	const tone = normalized === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : normalized === "trial" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-rose-500/10 text-rose-400 border-rose-500/30";
	const dot = normalized === "active" ? "bg-emerald-400" : normalized === "trial" ? "bg-amber-400" : "bg-rose-400";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize", tone),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", dot) }), normalized]
	});
}
function ServiceStatusBadge({ state, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase", {
			online: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
			degraded: "text-amber-400 border-amber-500/30 bg-amber-500/10",
			offline: "text-rose-400 border-rose-500/30 bg-rose-500/10",
			unknown: "text-muted-foreground border-border bg-muted/40"
		}[state]),
		children: label ?? {
			online: "Online",
			degraded: "Degraded",
			offline: "Offline",
			unknown: "Unknown"
		}[state]
	});
}
function ServiceDot({ state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 shrink-0 rounded-full", {
		online: "bg-emerald-500",
		degraded: "bg-amber-500",
		offline: "bg-rose-500",
		unknown: "bg-muted-foreground/50"
	}[state]) });
}
//#endregion
export { ServiceStatusBadge as a, ServiceDot as i, OrganizationStatusBadge as n, RoleBadge as r, AccountStatusBadge as t };
