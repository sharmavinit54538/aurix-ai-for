import apiInstance from "@/api/apiInstance";
import type {
  AuditLog,
  AuditLogExportParams,
  AuditLogParams,
  AuditLogResponse,
  BillingData,
  BrandingSettings,
  CancelSubscriptionPayload,
  CompanySettings,
  GeneralSettings,
  IntegrationItem,
  NotificationSettings,
  PermissionItem,
  ProfileSettings,
  Role,
  SecuritySettings,
  SubscriptionPlan,
  TestEmailPayload,
  TestSmsPayload,
  UpgradeSubscriptionPayload,
} from "@/store/settings/settingsTypes";

function extractData<T>(res: unknown, fallback?: T): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined) ? r.data : res;

  if (body == null) return fallback as T;

  if (typeof body === "object") {
    const b = body as Record<string, unknown>;
    if ("data" in b && b.data !== undefined) return b.data as T;
    if ("result" in b && b.result !== undefined) return b.result as T;
  }

  return (body ?? fallback) as T;
}

export const settingsApi = {
  // ── Security Settings ──────────────────────────────────────────
  async getSecuritySettings(): Promise<SecuritySettings> {
    const res = await apiInstance.get("/settings/security");
    return extractData<SecuritySettings>(res);
  },

  async updateSecuritySettings(payload: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const res = await apiInstance.patch("/settings/security", payload);
    return extractData<SecuritySettings>(res);
  },

  // ── Notification Settings ──────────────────────────────────────
  async getNotificationSettings(): Promise<NotificationSettings> {
    const res = await apiInstance.get("/settings/notifications");
    return extractData<NotificationSettings>(res);
  },

  async updateNotificationSettings(
    payload: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    const res = await apiInstance.patch("/settings/notifications", payload);
    return extractData<NotificationSettings>(res);
  },

  // ── Branding Settings ──────────────────────────────────────────
  async getBrandingSettings(): Promise<BrandingSettings> {
    const res = await apiInstance.get("/settings/branding");
    return extractData<BrandingSettings>(res);
  },

  async updateBrandingSettings(payload: Partial<BrandingSettings>): Promise<BrandingSettings> {
    const res = await apiInstance.patch("/settings/branding", payload);
    return extractData<BrandingSettings>(res);
  },

  // ── Integration Settings ───────────────────────────────────────
  async getIntegrationSettings(): Promise<IntegrationItem[]> {
    const res = await apiInstance.get("/settings/integrations");
    const data = extractData<
      IntegrationItem[] | { items?: IntegrationItem[]; integrations?: IntegrationItem[] }
    >(res, []);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.integrations)) return data.integrations;
    }
    return [];
  },

  async updateIntegrationSettings(
    payload:
      | { id?: string; connected?: boolean; integrations?: IntegrationItem[] }
      | Partial<IntegrationItem>,
  ): Promise<IntegrationItem[]> {
    const res = await apiInstance.patch("/settings/integrations", payload);
    const data = extractData<
      IntegrationItem[] | { items?: IntegrationItem[]; integrations?: IntegrationItem[] }
    >(res, []);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.integrations)) return data.integrations;
    }
    return [];
  },

  // ── Billing Settings ───────────────────────────────────────────
  async getBillingSettings(): Promise<BillingData> {
    const res = await apiInstance.get("/settings/billing");
    return extractData<BillingData>(res);
  },

  async updateBillingSettings(
    payload: Partial<BillingData> | Record<string, unknown>,
  ): Promise<BillingData> {
    const res = await apiInstance.patch("/settings/billing", payload);
    return extractData<BillingData>(res);
  },

  // ── Subscription Plans & Actions ──────────────────────────────
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const res = await apiInstance.get("/settings/subscription/plans");
    const data = extractData<
      SubscriptionPlan[] | { plans?: SubscriptionPlan[]; items?: SubscriptionPlan[] }
    >(res, []);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      if (Array.isArray(data.plans)) return data.plans;
      if (Array.isArray(data.items)) return data.items;
    }
    return [];
  },

  async upgradeSubscription(payload: UpgradeSubscriptionPayload): Promise<BillingData> {
    const res = await apiInstance.post("/settings/subscription/upgrade", payload);
    return extractData<BillingData>(res);
  },

  async cancelSubscription(payload?: CancelSubscriptionPayload): Promise<BillingData> {
    const res = await apiInstance.post("/settings/subscription/cancel", payload ?? {});
    return extractData<BillingData>(res);
  },

  // ── Audit Logs & Export ────────────────────────────────────────
  async getAuditLogs(params?: AuditLogParams): Promise<AuditLogResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.module && params.module !== "all") searchParams.set("module", params.module);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);

    const query = searchParams.toString();
    const res = await apiInstance.get(`/settings/audit-logs${query ? `?${query}` : ""}`);
    const data = extractData<AuditLogResponse | AuditLog[]>(res);
    if (data && "items" in data && Array.isArray(data.items)) {
      return {
        items: data.items,
        total: data.total ?? data.items.length,
        page: data.page ?? params?.page ?? 1,
        limit: data.limit ?? params?.limit ?? 10,
        pages: data.pages ?? Math.ceil((data.total ?? data.items.length) / (params?.limit ?? 10)),
      };
    }
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        pages: Math.ceil(data.length / (params?.limit ?? 10)),
      };
    }
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      pages: 1,
    };
  },

  async exportAuditLogs(params?: AuditLogExportParams): Promise<Blob> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.module && params.module !== "all") searchParams.set("module", params.module);
    if (params?.format) searchParams.set("format", params.format);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);

    const query = searchParams.toString();
    const res = await apiInstance.get<Blob>(
      `/settings/audit-logs/export${query ? `?${query}` : ""}`,
      {
        responseType: "blob",
      },
    );
    return res.data;
  },

  // ── Email & SMS Configuration Tests ───────────────────────────
  async testEmail(payload?: TestEmailPayload): Promise<{ success: boolean; message: string }> {
    const res = await apiInstance.post("/settings/email/test", payload ?? {});
    return extractData<{ success: boolean; message: string }>(res, {
      success: true,
      message: "Test email sent successfully",
    });
  },

  async testSms(payload?: TestSmsPayload): Promise<{ success: boolean; message: string }> {
    const res = await apiInstance.post("/settings/sms/test", payload ?? {});
    return extractData<{ success: boolean; message: string }>(res, {
      success: true,
      message: "Test SMS sent successfully",
    });
  },

  // ── Compatibility Aliases & Legacy Methods ─────────────────────
  async getSecurity(): Promise<SecuritySettings> {
    return this.getSecuritySettings();
  },
  async updateSecurity(payload: Partial<SecuritySettings>): Promise<SecuritySettings> {
    return this.updateSecuritySettings(payload);
  },

  async getNotifications(): Promise<NotificationSettings> {
    return this.getNotificationSettings();
  },
  async updateNotifications(payload: Partial<NotificationSettings>): Promise<NotificationSettings> {
    return this.updateNotificationSettings(payload);
  },

  async getBilling(): Promise<BillingData> {
    return this.getBillingSettings();
  },
  async updateBilling(payload: Record<string, unknown>): Promise<BillingData> {
    return this.updateBillingSettings(payload);
  },

  async getIntegrations(): Promise<IntegrationItem[]> {
    return this.getIntegrationSettings();
  },
  async toggleIntegration(payload: { id: string; connected: boolean }): Promise<IntegrationItem[]> {
    return this.updateIntegrationSettings(payload);
  },

  async getGeneralSettings(): Promise<GeneralSettings> {
    const res = await apiInstance.get("/settings/general");
    return extractData<GeneralSettings>(res);
  },
  async updateGeneralSettings(payload: Partial<GeneralSettings>): Promise<GeneralSettings> {
    const res = await apiInstance.put("/settings/general", payload);
    return extractData<GeneralSettings>(res);
  },

  async getCompanySettings(): Promise<CompanySettings> {
    const res = await apiInstance.get("/settings/company");
    return extractData<CompanySettings>(res);
  },
  async updateCompanySettings(payload: Partial<CompanySettings>): Promise<CompanySettings> {
    const res = await apiInstance.put("/settings/company", payload);
    return extractData<CompanySettings>(res);
  },

  async getRoles(): Promise<Role[]> {
    const res = await apiInstance.get("/settings/roles");
    return extractData<Role[]>(res, []);
  },
  async createRole(payload: {
    name: string;
    description?: string;
    permissions?: string[];
  }): Promise<Role> {
    const res = await apiInstance.post("/settings/roles", payload);
    return extractData<Role>(res);
  },
  async updateRole(
    id: string,
    payload: { name: string; description?: string; permissions?: string[] },
  ): Promise<Role> {
    const res = await apiInstance.put(`/settings/roles/${id}`, payload);
    return extractData<Role>(res);
  },
  async deleteRole(id: string): Promise<void> {
    await apiInstance.delete(`/settings/roles/${id}`);
  },
  async getPermissions(): Promise<PermissionItem[]> {
    const res = await apiInstance.get("/settings/permissions");
    return extractData<PermissionItem[]>(res, []);
  },

  async getProfile(): Promise<ProfileSettings> {
    const res = await apiInstance.get("/settings/profile");
    return extractData<ProfileSettings>(res);
  },
  async updateProfile(payload: Partial<ProfileSettings>): Promise<ProfileSettings> {
    const res = await apiInstance.put("/settings/profile", payload);
    return extractData<ProfileSettings>(res);
  },
};

export default settingsApi;
