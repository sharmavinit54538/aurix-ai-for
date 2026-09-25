import type { AppRole } from "@/lib/roles";

export interface SuperAdminUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  hrAdmins: number;
  managers: number;
  employees: number;
  itAdmins: number;
  executives: number;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  organizationId: string;
  role: AppRole;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin: string;
}

export interface PlatformOrganization {
  id: string;
  name: string;
  domain: string;
  plan: "Enterprise" | "Business Pro" | "Starter";
  totalUsers: number;
  activeUsers: number;
  storageUsed: string;
  status: "active" | "trial" | "suspended";
  createdAt: string;
}

export interface PlatformSystemActivity {
  id: string;
  timestamp: string;
  user: string;
  organization: string;
  action: string;
  ipAddress: string;
  status: "success" | "warning" | "error";
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  organization: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationMode: "closed" | "invite_only" | "public_company_only";
  sessionTimeoutMinutes: number;
  maxOrganizations: number;
  requireMfaForAdmins: boolean;
  auditLogRetentionDays: number;
  singleInstanceOwnerEmail: string;
}

export interface PlatformSystemHealth {
  status: "healthy" | "degraded" | "down";
  uptime: string;
  databaseLatencyMs: number;
  apiLatencyMs: number;
  memoryUsagePercent: number;
  cpuLoadPercent: number;
  activeConnections: number;
  version: string;
}
