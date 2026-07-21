import type { RootState } from "@/redux/store";
import type { SidebarNavParent, SidebarNavSection } from "./sidebarTypes";

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
 */
export function filterNavTree(
  sections: SidebarNavSection[],
  role: string,
  userPermissions: string[]
): SidebarNavSection[] {
  const normalizedRole = (role || "").toLowerCase();
  const isAdmin = normalizedRole === "admin" || normalizedRole === "super_admin" || !role;

  const isAllowedByRole = (roles?: string[]) =>
    isAdmin || !roles || roles.length === 0 || roles.includes(normalizedRole);
  const isAllowedByPerm = (perm?: string) =>
    isAdmin ||
    !perm ||
    userPermissions.length === 0 ||
    userPermissions.includes(perm) ||
    userPermissions.includes("*");

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

  if (filtered.length === 0 && sections.length > 0) {
    return sections;
  }

  return filtered;
}
