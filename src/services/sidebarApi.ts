import apiInstance from "@/api/apiInstance";
import { normalizeRole } from "@/lib/rbac";
import type { SidebarPermissionsResponse } from "@/store/sidebar/sidebarTypes";

/**
 * Sidebar permissions belong to the authenticated backend identity. On a
 * failed or malformed response we intentionally grant no inferred permissions.
 */
export const sidebarApi = {
  async getPermissions(userRole?: string): Promise<SidebarPermissionsResponse> {
    try {
      const response = await apiInstance.get("/sidebar/permissions");
      const data = response.data?.data ?? response.data;
      if (data && Array.isArray(data.permissions)) {
        return {
          role: normalizeRole(typeof data.role === "string" ? data.role : userRole),
          permissions: data.permissions.filter((permission: unknown): permission is string => typeof permission === "string"),
        };
      }
      if (Array.isArray(data)) {
        return {
          role: normalizeRole(userRole),
          permissions: data.filter((permission: unknown): permission is string => typeof permission === "string"),
        };
      }
    } catch {
      // Route guards continue to enforce canonical role access.
    }

    return { role: normalizeRole(userRole), permissions: [] };
  },
};

export default sidebarApi;
