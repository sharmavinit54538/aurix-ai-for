import type { RootState } from "@/redux/store";
import type { SidebarNavSection } from "./sidebarTypes";

const DEFAULT_PERMISSIONS: string[] = ["*"];
const EMPTY_SECTIONS: Record<string, boolean> = {};

export const selectUserPermissions = (state: RootState) =>
  state.sidebar?.userPermissions ?? DEFAULT_PERMISSIONS;

export const selectUserRole = (state: RootState) =>
  state.sidebar?.userRole ?? "super_admin";

export const selectSidebarOpen = (state: RootState) =>
  state.sidebar?.sidebarOpen ?? true;

export const selectExpandedSections = (state: RootState) =>
  state.sidebar?.expandedSections ?? EMPTY_SECTIONS;

export const hasRoleAccess = (roles?: string[], userRole?: string | null) => {
  if (!roles || roles.length === 0) return true;
  if (!userRole) return false;
  const normalizedRole = userRole.toLowerCase().trim();
  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "super_admin" ||
    normalizedRole === "superadmin" ||
    normalizedRole === "hr_admin" ||
    normalizedRole === "hradmin" ||
    normalizedRole.includes("admin");
  return isAdmin || roles.includes(normalizedRole);
};

export const hasPermission = (perm: string, userPermissions: string[] = []) => {
  if (userPermissions.length === 0 || userPermissions.includes("*")) return true;
  return userPermissions.includes(perm);
};

export const filterNavTree = (
  sections: SidebarNavSection[],
  userRole?: string | null,
  _userPermissions: string[] = []
) => {
  return sections
    .map((section) => {
      if (!hasRoleAccess(section.roles, userRole)) return null;

      const filteredItems = section.items
        .map((item) => {
          if ("children" in item) {
            const filteredChildren = item.children.filter((child) =>
              hasRoleAccess(child.roles, userRole)
            );
            if (filteredChildren.length === 0) return null;
            return { ...item, children: filteredChildren };
          } else {
            if (!hasRoleAccess(item.roles, userRole)) return null;
            return item;
          }
        })
        .filter(Boolean) as unknown[];

      if (filteredItems.length === 0) return null;
      return { ...section, items: filteredItems };
    })
    .filter(Boolean) as SidebarNavSection[];
};
