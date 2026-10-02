import { a as normalizeRole, i as isSuperAdmin, r as isHrAdmin } from "./aurix-store-BcCbMqU4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sidebarSelectors-Crjhx3nM.js
var selectExpandedSections = (state) => state.sidebar?.expandedSections ?? {};
var selectUserPermissions = (state) => state.sidebar?.userPermissions ?? [];
/**
* Filter navigation sections and items based on role and backend permissions.
* Strictly separates Super Admin platform navigation from normal company roles.
*/
function filterNavTree(sections, role, userPermissions = []) {
	const normalizedRole = normalizeRole(role);
	const isSuperAdmin$1 = isSuperAdmin(normalizedRole);
	const isHrAdmin$1 = isHrAdmin(normalizedRole);
	const isAllowedByRole = (roles) => {
		if (!roles || roles.length === 0) return true;
		if (!normalizedRole) return false;
		return roles.some((r) => {
			return normalizeRole(r) === normalizedRole;
		});
	};
	const isAllowedByPerm = (perm) => {
		if (!perm) return true;
		if (userPermissions.includes("*")) return true;
		if (userPermissions.includes(perm)) return true;
		if (isHrAdmin$1 && !perm.startsWith("platform.")) return true;
		if (isSuperAdmin$1 && perm.startsWith("platform.")) return true;
		if (userPermissions.length === 0) return true;
		return false;
	};
	return sections.filter((section) => isAllowedByRole(section.roles)).map((section) => ({
		...section,
		items: section.items.filter((item) => isAllowedByRole(item.roles) && isAllowedByPerm(item.permission)).map((item) => {
			if ("children" in item) {
				const parent = item;
				const filteredChildren = parent.children.filter((child) => isAllowedByRole(child.roles) && isAllowedByPerm(child.permission));
				return {
					...parent,
					children: filteredChildren.length > 0 ? filteredChildren : parent.children
				};
			}
			return item;
		})
	})).filter((section) => section.items.length > 0);
}
//#endregion
export { selectExpandedSections as n, selectUserPermissions as r, filterNavTree as t };
