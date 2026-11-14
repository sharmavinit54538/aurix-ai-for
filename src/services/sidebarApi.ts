import { api } from "@/api/client";

export interface SidebarPermissionsResponse {
  role: string;
  permissions: string[];
}

export const sidebarApi = {
  getPermissions: async (
    userRole?: string,
  ): Promise<SidebarPermissionsResponse> => {
    const roleParam = userRole ? `?role=${encodeURIComponent(userRole)}` : "";
    const res = await api.get<any>(`/sidebar/permissions${roleParam}`);
    const d = res?.data ?? res ?? {};
    return {
      role: String(d.role || userRole || ""),
      permissions: Array.isArray(d.permissions) ? d.permissions : [],
    };
  },
};

export default sidebarApi;
