import apiInstance from "@/api/apiInstance";
import { normalizeRole, type AppRole } from "@/lib/roles";
import type { SidebarPermissionsResponse } from "@/store/sidebar/sidebarTypes";

export const DEFAULT_ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  super_admin: [
    "platform.view",
    "platform.overview",
    "platform.users",
    "platform.organizations",
    "platform.analytics",
    "platform.activity",
    "platform.audit_logs",
    "platform.settings",
    "platform.config",
  ],
  superadmin: [
    "platform.view",
    "platform.overview",
    "platform.users",
    "platform.organizations",
    "platform.analytics",
    "platform.activity",
    "platform.audit_logs",
    "platform.settings",
    "platform.config",
  ],
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
    "system.view",
    "system.controls",
    "resources.view",
    "resources.assets",
    "resources.asset_management",
    "settings.view",
    "settings.security",
    "settings.audit_logs",
    "settings.integrations",
  ],
  executive: [
    "overview.view",
    "analytics.view",
    "analytics.reports",
    "analytics.ai_insights",
    "ai.view",
    "ai.hub",
  ],
};

export const sidebarApi = {
  async getPermissions(userRole?: string | null): Promise<SidebarPermissionsResponse> {
    const normalized = normalizeRole(userRole);
    // Least-privilege fallback to employee, never admin
    const effectiveRole: AppRole = normalized || "employee";

    try {
      const response = await apiInstance.get("/sidebar/permissions");
      const data = response.data?.data ?? response.data;
      if (data && Array.isArray(data.permissions)) {
        const rawRole = typeof data.role === "string" ? data.role : userRole;
        const respRole = normalizeRole(rawRole) || effectiveRole;
        return {
          role: respRole,
          permissions: data.permissions.filter(
            (permission: unknown): permission is string => typeof permission === "string"
          ),
        };
      }
      if (Array.isArray(data)) {
        return {
          role: effectiveRole,
          permissions: data.filter(
            (permission: unknown): permission is string => typeof permission === "string"
          ),
        };
      }
    } catch {
      // Fallback to canonical default role permissions when backend endpoint is unavailable
    }

    return {
      role: effectiveRole,
      permissions: DEFAULT_ROLE_PERMISSIONS[effectiveRole] || DEFAULT_ROLE_PERMISSIONS.employee,
    };
  },
};

export default sidebarApi;
