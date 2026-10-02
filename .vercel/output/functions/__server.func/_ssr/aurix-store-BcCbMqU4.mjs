import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as safeStorage } from "./safe-storage-DInQCreU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aurix-store-BcCbMqU4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Maps every legacy/synonym string to exactly one canonical AppRole.
* Case-insensitive, trims whitespace.
* Returns null if unrecognized — never silently defaults to a privileged role.
*/
function normalizeRole(raw) {
	if (!raw || typeof raw !== "string") return null;
	switch (raw.trim().toLowerCase().replace(/[\s-]+/g, "_")) {
		case "super_admin":
		case "superadmin":
		case "platform_admin":
		case "owner": return "super_admin";
		case "hr_admin":
		case "hradmin":
		case "hr":
		case "hr_manager":
		case "hrmanager":
		case "hr_executive":
		case "hrexecutive":
		case "human_resources": return "hr_admin";
		case "executive":
		case "ceo":
		case "cto":
		case "cio":
		case "cfo":
		case "coo":
		case "cmo": return "executive";
		case "manager":
		case "manager_admin":
		case "hiring_manager":
		case "hiringmanager": return "manager";
		case "employee":
		case "staff":
		case "user":
		case "member": return "employee";
		case "it_admin":
		case "itadmin":
		case "sysadmin":
		case "sys_admin":
		case "system_admin":
		case "it": return "it_admin";
		case "recruiter":
		case "recruitment":
		case "talent_acquisition":
		case "ta":
		case "recruiting": return "recruiter";
		default: return null;
	}
}
/**
* Reads the role ONLY from the authenticated user state (aurix store: ws.user.role).
* NEVER reads from localStorage.getItem("user_role") or any client-writable source.
*/
function useCurrentRole() {
	return normalizeRole(useAurix().user?.role);
}
/** Returns true if the role is the sole platform owner (SUPER_ADMIN). */
function isSuperAdmin(role) {
	return normalizeRole(role) === "super_admin";
}
/** Returns true if the role is an HR Administrator for a company. */
function isHrAdmin(role) {
	return normalizeRole(role) === "hr_admin";
}
/**
* Checks if the role has payroll management privileges (HR Admin).
* Super Admin does not manage company payroll runs.
*/
function canManagePayroll(role) {
	return normalizeRole(role) === "hr_admin";
}
var KEY = "aurix:workspace:v1";
var REMEMBER_KEY = "aurix:remember";
var defaultState = {
	user: null,
	company: null,
	hrs: [],
	employees: [],
	managers: [],
	documents: [],
	documentActivities: [],
	isRestoring: false
};
var state = defaultState;
var listeners = /* @__PURE__ */ new Set();
function load() {
	const raw = safeStorage.getItem(KEY);
	if (raw) try {
		const parsed = JSON.parse(raw);
		delete parsed.documents;
		delete parsed.documentActivities;
		state = {
			...defaultState,
			...parsed,
			user: parsed.user ? {
				...parsed.user,
				role: normalizeRole(parsed.user.role) || "employee"
			} : null
		};
	} catch {
		state = { ...defaultState };
	}
	if (state.user) state.isRestoring = true;
}
load();
function persist() {
	const toSave = { ...state };
	delete toSave.isRestoring;
	delete toSave.documents;
	delete toSave.documentActivities;
	safeStorage.setItem(KEY, JSON.stringify(toSave));
}
function emit() {
	listeners.forEach((l) => l());
}
var aurix = {
	get: () => state,
	set: (partial) => {
		state = {
			...state,
			...partial,
			user: partial.user !== void 0 ? partial.user ? {
				...partial.user,
				role: normalizeRole(partial.user.role) || "employee"
			} : null : state.user
		};
		persist();
		emit();
	},
	reset: () => {
		state = defaultState;
		persist();
		emit();
	},
	switchRole: (role) => {
		if (state.user) {
			state = {
				...state,
				user: {
					...state.user,
					role
				}
			};
			persist();
			emit();
		}
	},
	subscribe: (l) => {
		listeners.add(l);
		return () => listeners.delete(l);
	}
};
function useAurix() {
	return (0, import_react.useSyncExternalStore)(aurix.subscribe, () => state, () => defaultState);
}
function useMounted() {
	const [m, setM] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setM(true), []);
	return m;
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
var rememberStore = {
	get: () => {
		return safeStorage.getItem(REMEMBER_KEY) || "";
	},
	set: (email) => {
		safeStorage.setItem(REMEMBER_KEY, email);
	},
	clear: () => {
		safeStorage.removeItem(REMEMBER_KEY);
	}
};
//#endregion
export { normalizeRole as a, useAurix as c, isSuperAdmin as i, useCurrentRole as l, canManagePayroll as n, rememberStore as o, isHrAdmin as r, uid as s, aurix as t, useMounted as u };
