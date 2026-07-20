import apiInstance from "@/api/apiInstance";
import type { SidebarPermissionsResponse } from "@/store/sidebar/sidebarTypes";

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    "overview.view",
    "workforce.view",
    "workforce.people",
    "workforce.departments",
    "workforce.attendance",
    "workforce.timesheets",
    "workforce.leaves",
    "talent.view",
    "talent.recruitment",
    "talent.performance",
    "payroll.view",
    "payroll.expenses",
    "payroll.travel",
    "hrops.view",
    "hrops.dashboard",
    "hrops.timeline",
    "hrops.visitors",
    "hrops.onboarding",
    "hrops.offboarding",
    "hrops.exit",
    "resources.view",
    "resources.documents",
    "resources.assets",
    "resources.asset_management",
    "analytics.view",
    "analytics.reports",
    "analytics.ai_insights",
    "ai.view",
    "ai.hub",
    "ai.document_generator",
    "ai.assistant",
    "ai.automation",
    "settings.view",
    "settings.general",
    "settings.company",
    "settings.roles_permissions",
    "settings.audit_logs",
    "settings.billing",
    "settings.security",
    "settings.notifications",
    "settings.integrations",
    "settings.profile",
  ],
  hr: [
    "overview.view",
    "workforce.view",
    "workforce.people",
    "workforce.departments",
    "workforce.attendance",
    "workforce.timesheets",
    "workforce.leaves",
    "talent.view",
    "talent.recruitment",
    "talent.performance",
    "payroll.view",
    "payroll.expenses",
    "payroll.travel",
    "hrops.view",
    "hrops.dashboard",
    "hrops.timeline",
    "hrops.visitors",
    "hrops.onboarding",
    "hrops.offboarding",
    "hrops.exit",
    "resources.view",
    "resources.documents",
    "resources.assets",
    "resources.asset_management",
    "analytics.view",
    "analytics.reports",
    "analytics.ai_insights",
    "ai.view",
    "ai.hub",
    "ai.document_generator",
    "ai.assistant",
    "ai.automation",
    "settings.view",
    "settings.security",
    "settings.notifications",
    "settings.profile",
  ],
  manager: [
    "overview.view",
    "workforce.view",
    "workforce.people",
    "workforce.attendance",
    "workforce.timesheets",
    "workforce.leaves",
    "talent.view",
    "talent.recruitment",
    "talent.performance",
    "payroll.expenses",
    "payroll.travel",
    "hrops.view",
    "hrops.onboarding",
    "resources.view",
    "resources.documents",
    "resources.assets",
    "analytics.view",
    "analytics.reports",
    "analytics.ai_insights",
    "ai.view",
    "ai.hub",
    "ai.document_generator",
    "ai.assistant",
    "ai.automation",
    "settings.view",
    "settings.security",
    "settings.notifications",
    "settings.profile",
  ],
  employee: [
    "overview.view",
    "workforce.view",
    "workforce.attendance",
    "workforce.timesheets",
    "workforce.leaves",
    "talent.view",
    "talent.performance",
    "payroll.view",
    "payroll.expenses",
    "payroll.travel",
    "resources.view",
    "resources.documents",
    "resources.assets",
    "ai.view",
    "ai.hub",
    "ai.document_generator",
    "ai.assistant",
    "settings.view",
    "settings.security",
    "settings.notifications",
    "settings.profile",
  ],
};

export const sidebarApi = {
  async getPermissions(userRole?: string): Promise<SidebarPermissionsResponse> {
    try {
      const response = await apiInstance.get("/sidebar/permissions");
      const data = response.data?.data ?? response.data;
      if (data && Array.isArray(data.permissions)) {
        return {
          role: data.role || userRole,
          permissions: data.permissions,
        };
      }
      if (Array.isArray(data)) {
        return {
          role: userRole,
          permissions: data,
        };
      }
    } catch {
      // Fallback permissions based on user role when API endpoint returns error or dev mock
    }

    const fallbackRole = userRole || "admin";
    const permissions = DEFAULT_ROLE_PERMISSIONS[fallbackRole] || DEFAULT_ROLE_PERMISSIONS.admin;
    return {
      role: fallbackRole,
      permissions,
    };
  },
};

export default sidebarApi;
