import { api } from "@/api/client";

export interface SidebarPermissionsResponse {
  role: string;
  permissions: string[];
}

export const sidebarApi = {
  getPermissions: async (userRole?: string): Promise<SidebarPermissionsResponse> => {
    try {
      return await api.get<SidebarPermissionsResponse>(`/sidebar/permissions?role=${userRole || "super_admin"}`);
    } catch {
      return {
        role: userRole || "super_admin",
        permissions: ["*"],
      };
    }
  },
};

export default sidebarApi;
