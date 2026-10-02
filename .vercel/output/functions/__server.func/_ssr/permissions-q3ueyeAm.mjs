import { a as normalizeRole } from "./aurix-store-BcCbMqU4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/permissions-q3ueyeAm.js
function canDo(roleInput, action, context) {
	switch (normalizeRole(roleInput)) {
		case "super_admin":
		case "hr_admin": return true;
		case "executive": return action === "view" || action === "download";
		case "manager": return action === "view" || action === "download";
		case "employee":
			if (action === "view" || action === "download") return true;
			if (action === "upload") return true;
			if (action === "delete") {
				if (context?.source === "company") return false;
				const isOwn = context?.isOwnDocument ?? true;
				const isVerified = context?.isVerified === true || context?.status === "VERIFIED" || context?.status === "Verified";
				return isOwn && !isVerified;
			}
			return false;
		default: return false;
	}
}
/** Check if the given role is allowed to access the /dashboard/resources/documents route at all */
function canAccessDocumentsRoute(roleInput) {
	const role = normalizeRole(roleInput);
	if (!role) return false;
	return [
		"super_admin",
		"hr_admin",
		"executive",
		"manager",
		"employee"
	].includes(role);
}
//#endregion
export { canDo as n, canAccessDocumentsRoute as t };
