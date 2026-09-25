import apiInstance from "@/api/apiInstance";
import { normalizeRole } from "@/lib/rbac";
import type { SidebarPermissionsResponse } from "@/store/sidebar/sidebarTypes";

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],
  admin: ["*"],
  hr_admin: [
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
    "payroll.view",
    "payroll.process",
    "payroll.approve",
    "payroll.finalize",
    "payroll.disburse",
    "payroll.reports",
    "payroll.compensation.view",
    "payroll.compensation.edit",
    "payroll.statutory",
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
    "payroll.view",
    "payroll.process",
    "payroll.disburse",
    "payroll.reports",
    "payroll.compensation.view",
    "payroll.compensation.edit",
    "payroll.statutory",
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
  it_admin: [
    "overview.view",
    "resources.view",
    "resources.assets",
    "settings.view",
    "settings.security",
  ],
  executive: [
    "overview.view",
    "analytics.view",
    "analytics.reports",
  ],
};

DEFAULT_ROLE_PERMISSIONS.hradmin = DEFAULT_ROLE_PERMISSIONS.hr_admin;
DEFAULT_ROLE_PERMISSIONS["hr-admin"] = DEFAULT_ROLE_PERMISSIONS.hr_admin;

export const sidebarApi = {
  async getPermissions(userRole?: string): Promise<SidebarPermissionsResponse> {
    const normalized = normalizeRole(userRole);
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
          role: normalized,
          permissions: data.filter((permission: unknown): permission is string => typeof permission === "string"),
        };
      }
    } catch {
      // Fallback to canonical default role permissions when backend endpoint is unavailable
    }

    return {
      role: normalized,
      permissions: DEFAULT_ROLE_PERMISSIONS[normalized] || DEFAULT_ROLE_PERMISSIONS[userRole || ""] || [],
    };
  },
};

export default sidebarApi;
