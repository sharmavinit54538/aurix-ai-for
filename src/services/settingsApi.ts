import apiInstance from "@/api/apiInstance";
import type {
  AuditLogResponse,
  BillingData,
  CompanySettings,
  GeneralSettings,
  IntegrationItem,
  NotificationSettings,
  PermissionItem,
  ProfileSettings,
  Role,
  SecuritySettings,
} from "@/store/settings/settingsTypes";

export const settingsApi = {
  // General
  async getGeneralSettings(): Promise<GeneralSettings> {
    const res = await apiInstance.get("/settings/general");
    return res.data?.data ?? res.data;
  },
  async updateGeneralSettings(payload: Partial<GeneralSettings>): Promise<GeneralSettings> {
    const res = await apiInstance.put("/settings/general", payload);
    return res.data?.data ?? res.data;
  },

  // Company
  async getCompanySettings(): Promise<CompanySettings> {
    const res = await apiInstance.get("/settings/company");
    return res.data?.data ?? res.data;
  },
  async updateCompanySettings(payload: Partial<CompanySettings>): Promise<CompanySettings> {
    const res = await apiInstance.put("/settings/company", payload);
    return res.data?.data ?? res.data;
  },

  // Roles & Permissions
  async getRoles(): Promise<Role[]> {
    const res = await apiInstance.get("/settings/roles");
    return res.data?.data ?? res.data ?? [];
  },
  async createRole(payload: { name: string; description?: string; permissions?: string[] }): Promise<Role> {
    const res = await apiInstance.post("/settings/roles", payload);
    return res.data?.data ?? res.data;
  },
  async updateRole(id: string, payload: { name: string; description?: string; permissions?: string[] }): Promise<Role> {
    const res = await apiInstance.put(`/settings/roles/${id}`, payload);
    return res.data?.data ?? res.data;
  },
  async deleteRole(id: string): Promise<void> {
    await apiInstance.delete(`/settings/roles/${id}`);
  },
  async getPermissions(): Promise<PermissionItem[]> {
    const res = await apiInstance.get("/settings/permissions");
    return res.data?.data ?? res.data ?? [];
  },

  // Audit Logs
  async getAuditLogs(params?: { page?: number; limit?: number; search?: string; module?: string }): Promise<AuditLogResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.module && params.module !== "all") searchParams.set("module", params.module);

    const res = await apiInstance.get(`/settings/audit-logs?${searchParams.toString()}`);
    return res.data?.data ?? res.data;
  },

  // Billing
  async getBilling(): Promise<BillingData> {
    const res = await apiInstance.get("/settings/billing");
    return res.data?.data ?? res.data;
  },
  async updateBilling(payload: Record<string, unknown>): Promise<BillingData> {
    const res = await apiInstance.put("/settings/billing", payload);
    return res.data?.data ?? res.data;
  },

  // Security
  async getSecurity(): Promise<SecuritySettings> {
    const res = await apiInstance.get("/settings/security");
    return res.data?.data ?? res.data;
  },
  async updateSecurity(payload: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const res = await apiInstance.put("/settings/security", payload);
    return res.data?.data ?? res.data;
  },

  // Notifications
  async getNotifications(): Promise<NotificationSettings> {
    const res = await apiInstance.get("/settings/notifications");
    return res.data?.data ?? res.data;
  },
  async updateNotifications(payload: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const res = await apiInstance.put("/settings/notifications", payload);
    return res.data?.data ?? res.data;
  },

  // Integrations
  async getIntegrations(): Promise<IntegrationItem[]> {
    const res = await apiInstance.get("/settings/integrations");
    return res.data?.data ?? res.data ?? [];
  },
  async toggleIntegration(payload: { id: string; connected: boolean }): Promise<IntegrationItem[]> {
    const res = await apiInstance.put("/settings/integrations", payload);
    return res.data?.data ?? res.data ?? [];
  },

  // Profile
  async getProfile(): Promise<ProfileSettings> {
    const res = await apiInstance.get("/settings/profile");
    return res.data?.data ?? res.data;
  },
  async updateProfile(payload: Partial<ProfileSettings>): Promise<ProfileSettings> {
    const res = await apiInstance.put("/settings/profile", payload);
    return res.data?.data ?? res.data;
  },
};

export default settingsApi;
