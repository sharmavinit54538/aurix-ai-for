import type { RootState } from "@/redux/store";
import type { SidebarNavParent, SidebarNavSection } from "./sidebarTypes";
import { normalizeRole, isSuperAdmin as checkSuperAdmin, isHrAdmin as checkHrAdmin } from "@/lib/roles";

export const selectSidebarState = (state: RootState) => state.sidebar;

export const selectExpandedSections = (state: RootState) =>
  state.sidebar?.expandedSections ?? {};

export const selectIsSectionExpanded = (sectionKey: string) => (state: RootState) =>
  Boolean(state.sidebar?.expandedSections?.[sectionKey]);

export const selectSelectedMenu = (state: RootState) =>
  state.sidebar?.selectedMenu;

export const selectActiveRoute = (state: RootState) =>
  state.sidebar?.activeRoute;

export const selectUserPermissions = (state: RootState) =>
  state.sidebar?.userPermissions ?? [];

export const selectIsPermissionsLoading = (state: RootState) =>
  state.sidebar?.permissionsLoading ?? false;

export const selectUserRole = (state: RootState) =>
  state.sidebar?.userRole;

/**
 * Filter navigation sections and items based on role and backend permissions.
 * Strictly separates Super Admin platform navigation from normal company roles.
 */
export function filterNavTree(
  sections: SidebarNavSection[],
  role?: string,
  userPermissions: string[] = []
): SidebarNavSection[] {
  const normalizedRole = normalizeRole(role);
  const isSuperAdmin = checkSuperAdmin(normalizedRole);
  const isHrAdmin = checkHrAdmin(normalizedRole);

  const isAllowedByRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) {
      // If no explicit roles declared, general items are allowed for company roles,
      // but platform owner has their own dedicated nav sections.
      return true;
    }
    if (!normalizedRole) return false;
    return roles.some((r) => {
      const normR = normalizeRole(r);
      return normR === normalizedRole;
    });
  };

  const isAllowedByPerm = (perm?: string) => {
    if (!perm) return true;
    if (userPermissions.includes("*")) return true;
    if (userPermissions.includes(perm)) return true;
    // HR Admin has full operational access to HRMS items if permissions not loaded from backend
    if (isHrAdmin && !perm.startsWith("platform.")) return true;
    // Super Admin has full platform access to platform items
    if (isSuperAdmin && perm.startsWith("platform.")) return true;
    // If userPermissions is empty (permissions not loaded or backend endpoint unavailable),
    // default to allowing items so navigation does not completely disappear.
    if (userPermissions.length === 0) return true;
    return false;
  };

  const filtered = sections
    .filter((section) => isAllowedByRole(section.roles))
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => isAllowedByRole(item.roles) && isAllowedByPerm(item.permission))
        .map((item) => {
          if ("children" in item) {
            const parent = item as SidebarNavParent;
            const filteredChildren = parent.children.filter(
              (child) => isAllowedByRole(child.roles) && isAllowedByPerm(child.permission)
            );
            return {
              ...parent,
              children: filteredChildren.length > 0 ? filteredChildren : parent.children,
            };
          }
          return item;
        }),
    }))
    .filter((section) => section.items.length > 0);

  return filtered;
}
