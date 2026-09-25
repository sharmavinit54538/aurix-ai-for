import { api } from "@/api";
import { safeStorage } from "@/lib/safe-storage";
import { getSingleSuperAdmin } from "@/lib/platform-owner";
import type {
  SuperAdminUserStats,
  PlatformUser,
  PlatformOrganization,
  PlatformSystemActivity,
  PlatformAuditLog,
  PlatformSettings,
  PlatformSystemHealth,
} from "./types";

const USERS_STORAGE_KEY = "ofc360:platform_users:v1";
const SETTINGS_STORAGE_KEY = "ofc360:platform_settings:v1";

const DEFAULT_USERS: PlatformUser[] = [
  {
    id: "usr_001",
    name: "Arjun Verma",
    email: "arjun.verma@acmecorp.com",
    organization: "Acme Corporation",
    organizationId: "org_acme_1",
    role: "hr_admin",
    status: "active",
    createdAt: "2026-01-10T08:30:00Z",
    lastLogin: "2026-09-24T14:22:00Z",
  },
  {
    id: "usr_002",
    name: "Priya Sharma",
    email: "priya.sharma@acmecorp.com",
    organization: "Acme Corporation",
    organizationId: "org_acme_1",
    role: "manager",
    status: "active",
    createdAt: "2026-01-15T09:10:00Z",
    lastLogin: "2026-09-25T08:15:00Z",
  },
  {
    id: "usr_003",
    name: "Rohan Gupta",
    email: "rohan.gupta@acmecorp.com",
    organization: "Acme Corporation",
    organizationId: "org_acme_1",
    role: "employee",
    status: "active",
    createdAt: "2026-02-01T11:00:00Z",
    lastLogin: "2026-09-24T18:40:00Z",
  },
  {
    id: "usr_004",
    name: "Vikram Malhotra",
    email: "vikram.m@acmecorp.com",
    organization: "Acme Corporation",
    organizationId: "org_acme_1",
    role: "it_admin",
    status: "active",
    createdAt: "2026-01-12T10:00:00Z",
    lastLogin: "2026-09-25T07:50:00Z",
  },
  {
    id: "usr_005",
    name: "Ananya Iyer",
    email: "ananya.iyer@acmecorp.com",
    organization: "Acme Corporation",
    organizationId: "org_acme_1",
    role: "executive",
    status: "active",
    createdAt: "2026-01-05T08:00:00Z",
    lastLogin: "2026-09-24T16:10:00Z",
  },
  {
    id: "usr_006",
    name: "Dev Patel",
    email: "dev.patel@globex.io",
    organization: "Globex Technologies",
    organizationId: "org_globex_2",
    role: "hr_admin",
    status: "active",
    createdAt: "2026-02-14T09:30:00Z",
    lastLogin: "2026-09-23T11:20:00Z",
  },
  {
    id: "usr_007",
    name: "Meera Nair",
    email: "meera.n@globex.io",
    organization: "Globex Technologies",
    organizationId: "org_globex_2",
    role: "employee",
    status: "inactive",
    createdAt: "2026-03-01T10:15:00Z",
    lastLogin: "2026-08-10T12:00:00Z",
  },
  {
    id: "usr_008",
    name: "Siddharth Rao",
    email: "siddharth.r@initech.com",
    organization: "Initech Solutions",
    organizationId: "org_initech_3",
    role: "manager",
    status: "active",
    createdAt: "2026-04-10T08:45:00Z",
    lastLogin: "2026-09-25T06:30:00Z",
  },
];

const DEFAULT_ORGANIZATIONS: PlatformOrganization[] = [
  {
    id: "org_acme_1",
    name: "Acme Corporation",
    domain: "acmecorp.com",
    plan: "Enterprise",
    totalUsers: 142,
    activeUsers: 138,
    storageUsed: "42.8 GB",
    status: "active",
    createdAt: "2026-01-05T08:00:00Z",
  },
  {
    id: "org_globex_2",
    name: "Globex Technologies",
    domain: "globex.io",
    plan: "Business Pro",
    totalUsers: 68,
    activeUsers: 62,
    storageUsed: "18.4 GB",
    status: "active",
    createdAt: "2026-02-14T09:30:00Z",
  },
  {
    id: "org_initech_3",
    name: "Initech Solutions",
    domain: "initech.com",
    plan: "Starter",
    totalUsers: 24,
    activeUsers: 22,
    storageUsed: "4.1 GB",
    status: "active",
    createdAt: "2026-04-10T08:45:00Z",
  },
];

function getStoredUsers(): PlatformUser[] {
  const raw = safeStorage.getItem(USERS_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
  }
  safeStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function saveUsers(users: PlatformUser[]): void {
  safeStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const superAdminApi = {
  /**
   * Retrieves overall platform statistics.
   */
  async getStats(): Promise<SuperAdminUserStats> {
    try {
      const res = await api.get<any>("/api/super-admin/overview");
      if (res?.data?.stats) return res.data.stats;
    } catch {
      // Use local state
    }

    const users = getStoredUsers();
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      inactiveUsers: users.filter((u) => u.status !== "active").length,
      hrAdmins: users.filter((u) => u.role === "hr_admin").length,
      managers: users.filter((u) => u.role === "manager").length,
      employees: users.filter((u) => u.role === "employee").length,
      itAdmins: users.filter((u) => u.role === "it_admin").length,
      executives: users.filter((u) => u.role === "executive").length,
    };
  },

  /**
   * Retrieves all users registered across all organizations.
   */
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    organization?: string;
  }): Promise<PlatformUser[]> {
    try {
      const res = await api.get<any>("/api/super-admin/users", {
        headers: filters ? { "x-filters": JSON.stringify(filters) } : undefined,
      });
      if (res?.data?.users) return res.data.users;
    } catch {
      // Fallback to local store
    }

    let users = getStoredUsers();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.organization.toLowerCase().includes(q),
      );
    }

    if (filters?.role && filters.role !== "ALL") {
      const targetRole = filters.role.toLowerCase();
      users = users.filter((u) => u.role === targetRole);
    }

    if (filters?.status && filters.status !== "ALL") {
      users = users.filter((u) => u.status === filters.status?.toLowerCase());
    }

    if (filters?.organization && filters.organization !== "ALL") {
      users = users.filter((u) => u.organization === filters.organization);
    }

    return users;
  },

  /**
   * Toggles the active/inactive status of a platform user.
   */
  async toggleUserStatus(userId: string, newStatus: "active" | "inactive"): Promise<PlatformUser> {
    try {
      const res = await api.post<any>("/api/super-admin/users/status", {
        userId,
        status: newStatus,
      });
      if (res?.data?.user) return res.data.user;
    } catch {
      // Update local storage
    }

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      throw new Error("User not found");
    }

    const updated: PlatformUser = {
      ...users[idx],
      status: newStatus,
    };
    users[idx] = updated;
    saveUsers(users);
    return updated;
  },

  /**
   * Retrieves all registered company accounts / organizations.
   */
  async getOrganizations(): Promise<PlatformOrganization[]> {
    try {
      const res = await api.get<any>("/api/super-admin/organizations");
      if (res?.data?.organizations) return res.data.organizations;
    } catch {
      // Local fallback
    }
    return DEFAULT_ORGANIZATIONS;
  },

  /**
   * Retrieves platform-wide audit logs.
   */
  async getAuditLogs(): Promise<PlatformAuditLog[]> {
    try {
      const res = await api.get<any>("/api/super-admin/audit-logs");
      if (res?.data?.logs) return res.data.logs;
    } catch {
      // Local fallback
    }

    return [
      {
        id: "aud_01",
        timestamp: "2026-09-25T08:35:10Z",
        actor: "owner@ofc360.com (Super Admin)",
        action: "PLATFORM_CONFIG_UPDATE",
        resource: "System Settings",
        organization: "Platform Wide",
        details: "Updated session timeout to 60 minutes",
        severity: "info",
      },
      {
        id: "aud_02",
        timestamp: "2026-09-25T07:12:00Z",
        actor: "owner@ofc360.com (Super Admin)",
        action: "USER_DEACTIVATED",
        resource: "User usr_007",
        organization: "Globex Technologies",
        details: "Deactivated Meera Nair upon compliance flag",
        severity: "warning",
      },
      {
        id: "aud_03",
        timestamp: "2026-09-24T18:20:45Z",
        actor: "arjun.verma@acmecorp.com (HR Admin)",
        action: "PAYROLL_CYCLE_LOCKED",
        resource: "Payroll Cycle Sep-2026",
        organization: "Acme Corporation",
        details: "Locked monthly payroll run for verification",
        severity: "info",
      },
      {
        id: "aud_04",
        timestamp: "2026-09-24T12:05:18Z",
        actor: "system@ofc360.com (Automated)",
        action: "SECURITY_FAILED_LOGINS_EXCEEDED",
        resource: "Auth Service",
        organization: "Initech Solutions",
        details: "IP 198.51.100.22 temporarily throttled after 5 failed attempts",
        severity: "critical",
      },
    ];
  },

  /**
   * Retrieves real-time platform system activity.
   */
  async getSystemActivity(): Promise<PlatformSystemActivity[]> {
    try {
      const res = await api.get<any>("/api/super-admin/activity");
      if (res?.data?.activities) return res.data.activities;
    } catch {
      // Local fallback
    }

    return [
      {
        id: "act_101",
        timestamp: "Just now",
        user: "Arjun Verma",
        organization: "Acme Corporation",
        action: "Exported Attendance Summary CSV",
        ipAddress: "103.21.144.2",
        status: "success",
      },
      {
        id: "act_102",
        timestamp: "5 mins ago",
        user: "Platform Owner",
        organization: "Platform",
        action: "Super Admin Platform Login (Google SSO)",
        ipAddress: "14.139.12.90",
        status: "success",
      },
      {
        id: "act_103",
        timestamp: "18 mins ago",
        user: "Vikram Malhotra",
        organization: "Acme Corporation",
        action: "Rotated SAML Certificate",
        ipAddress: "103.21.144.15",
        status: "success",
      },
      {
        id: "act_104",
        timestamp: "42 mins ago",
        user: "Dev Patel",
        organization: "Globex Technologies",
        action: "Created Department 'Artificial Intelligence'",
        ipAddress: "49.207.180.4",
        status: "success",
      },
    ];
  },

  /**
   * Retrieves system health and diagnostics.
   */
  async getSystemHealth(): Promise<PlatformSystemHealth> {
    return {
      status: "healthy",
      uptime: "99.98% (Last 90 days)",
      databaseLatencyMs: 14,
      apiLatencyMs: 42,
      memoryUsagePercent: 38,
      cpuLoadPercent: 19,
      activeConnections: 124,
      version: "OFC360 Enterprise v2.4.0",
    };
  },

  /**
   * Retrieves platform configuration settings.
   */
  async getSettings(): Promise<PlatformSettings> {
    const raw = safeStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }

    const owner = getSingleSuperAdmin();
    const defaults: PlatformSettings = {
      platformName: "OFC360 Enterprise Cloud",
      supportEmail: "support@ofc360.com",
      maintenanceMode: false,
      registrationMode: "public_company_only",
      sessionTimeoutMinutes: 60,
      maxOrganizations: 1000,
      requireMfaForAdmins: true,
      auditLogRetentionDays: 365,
      singleInstanceOwnerEmail: owner.email,
    };
    safeStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  },

  /**
   * Updates platform configuration settings.
   */
  async updateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const current = await this.getSettings();
    const updated: PlatformSettings = {
      ...current,
      ...settings,
    };
    safeStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
