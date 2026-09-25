import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { superAdminApi } from "../superAdminApi";
import type {
  AiUsageData,
  AnnouncementRecord,
  AuditLogListParams,
  AuditLogRecord,
  BillingRecord,
  CancelAccessPayload,
  CreateAnnouncementPayload,
  CreateHrAdminPayload,
  CreateOrganizationPayload,
  CreatePlanPayload,
  CreateUserPayload,
  EntitlementsData,
  ExtendAccessPayload,
  GrantAccessPayload,
  HrAdminRecord,
  OnboardingDetail,
  OnboardingRecord,
  OrganizationDetail,
  OrganizationListParams,
  OrganizationRecord,
  PlanRecord,
  PlatformAnalyticsData,
  PlatformSettings,
  PlatformUserDetail,
  PlatformUserRecord,
  PruneAuditLogsResponse,
  ReactivateAccessPayload,
  SecurityEventRecord,
  SecurityOverview,
  SecuritySessionRecord,
  SubscriptionDetail,
  SubscriptionRecord,
  SuperAdminStatisticsResponse,
  SuspendAccessPayload,
  SystemHealthData,
  UpdateAnnouncementPayload,
  UpdateEntitlementsPayload,
  UpdateHrAdminPayload,
  UpdateOrganizationPayload,
  UpdatePlanPayload,
  UpdateSubscriptionPayload,
  UpdateUserPayload,
  UserListParams,
} from "../types";

function getErrorMessage(err: unknown, defaultMessage = "Operation failed"): string {
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message;
  }
  if (typeof err === "string") return err;
  return defaultMessage;
}

// ─── Async Thunks ────────────────────────────────────────────────────────────

// 1. Dashboard & Statistics
export const fetchSuperAdminStatistics = createAsyncThunk<
  SuperAdminStatisticsResponse,
  void,
  { rejectValue: string }
>("superAdmin/fetchStatistics", async (_, { rejectWithValue }) => {
  try {
    return await superAdminApi.getSuperAdminStatistics();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch platform statistics"));
  }
});

// 2. Organizations
export const fetchOrganizations = createAsyncThunk<
  OrganizationRecord[],
  OrganizationListParams | undefined,
  { rejectValue: string }
>("superAdmin/fetchOrganizations", async (params, { rejectWithValue }) => {
  try {
    return await superAdminApi.listOrganizations(params);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch organizations"));
  }
});

export const fetchOrganization = createAsyncThunk<
  OrganizationDetail,
  string,
  { rejectValue: string }
>("superAdmin/fetchOrganization", async (orgId, { rejectWithValue }) => {
  try {
    return await superAdminApi.getOrganization(orgId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch organization details"));
  }
});

export const createOrganization = createAsyncThunk<
  OrganizationRecord,
  CreateOrganizationPayload,
  { rejectValue: string }
>("superAdmin/createOrganization", async (payload, { rejectWithValue }) => {
  try {
    return await superAdminApi.createOrganization(payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to create organization"));
  }
});

export const updateOrganization = createAsyncThunk<
  { orgId: string; payload: UpdateOrganizationPayload; message: string },
  { orgId: string; payload: UpdateOrganizationPayload },
  { rejectValue: string }
>("superAdmin/updateOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.updateOrganization(orgId, payload);
    return { orgId, payload, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update organization"));
  }
});

export const deleteOrganization = createAsyncThunk<
  { orgId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/deleteOrganization", async (orgId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.deleteOrganization(orgId);
    return { orgId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to deactivate organization"));
  }
});

export const grantOrganizationAccess = createAsyncThunk<
  { orgId: string; plan?: string; message: string },
  { orgId: string; payload?: GrantAccessPayload },
  { rejectValue: string }
>("superAdmin/grantOrganizationAccess", async ({ orgId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.grantOrganizationAccess(orgId, payload);
    return { orgId, plan: payload?.plan, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to grant organization access"));
  }
});

export const extendOrganizationAccess = createAsyncThunk<
  { orgId: string; days?: number; message: string },
  { orgId: string; payload?: ExtendAccessPayload },
  { rejectValue: string }
>("superAdmin/extendOrganizationAccess", async ({ orgId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.extendOrganizationAccess(orgId, payload);
    return { orgId, days: payload?.days, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to extend organization access"));
  }
});

export const suspendOrganization = createAsyncThunk<
  { orgId: string; message: string },
  { orgId: string; payload?: SuspendAccessPayload },
  { rejectValue: string }
>("superAdmin/suspendOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.suspendOrganization(orgId, payload);
    return { orgId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to suspend organization"));
  }
});

export const cancelOrganization = createAsyncThunk<
  { orgId: string; message: string },
  { orgId: string; payload?: CancelAccessPayload },
  { rejectValue: string }
>("superAdmin/cancelOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.cancelOrganization(orgId, payload);
    return { orgId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to cancel organization access"));
  }
});

export const reactivateOrganization = createAsyncThunk<
  { orgId: string; message: string },
  { orgId: string; payload?: ReactivateAccessPayload },
  { rejectValue: string }
>("superAdmin/reactivateOrganization", async ({ orgId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.reactivateOrganization(orgId, payload);
    return { orgId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to reactivate organization"));
  }
});

// 3. Platform Users
export const fetchPlatformUsers = createAsyncThunk<
  PlatformUserRecord[],
  UserListParams | undefined,
  { rejectValue: string }
>("superAdmin/fetchPlatformUsers", async (params, { rejectWithValue }) => {
  try {
    return await superAdminApi.listPlatformUsers(params);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch platform users"));
  }
});

export const fetchPlatformUser = createAsyncThunk<
  PlatformUserDetail,
  string,
  { rejectValue: string }
>("superAdmin/fetchPlatformUser", async (userId, { rejectWithValue }) => {
  try {
    return await superAdminApi.getPlatformUser(userId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch user details"));
  }
});

export const createPlatformUser = createAsyncThunk<
  PlatformUserRecord,
  CreateUserPayload,
  { rejectValue: string }
>("superAdmin/createPlatformUser", async (payload, { rejectWithValue }) => {
  try {
    return await superAdminApi.createPlatformUser(payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to create user"));
  }
});

export const updatePlatformUser = createAsyncThunk<
  { userId: string; payload: UpdateUserPayload; message: string },
  { userId: string; payload: UpdateUserPayload },
  { rejectValue: string }
>("superAdmin/updatePlatformUser", async ({ userId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.updatePlatformUser(userId, payload);
    return { userId, payload, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update user"));
  }
});

export const deletePlatformUser = createAsyncThunk<
  { userId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/deletePlatformUser", async (userId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.deletePlatformUser(userId);
    return { userId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to delete user"));
  }
});

export const activatePlatformUser = createAsyncThunk<
  { userId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/activatePlatformUser", async (userId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.activatePlatformUser(userId);
    return { userId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to activate user"));
  }
});

export const deactivatePlatformUser = createAsyncThunk<
  { userId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/deactivatePlatformUser", async (userId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.deactivatePlatformUser(userId);
    return { userId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to deactivate user"));
  }
});

export const togglePlatformUserStatus = createAsyncThunk<
  { userId: string; is_active: boolean; message: string },
  string,
  { rejectValue: string }
>("superAdmin/togglePlatformUserStatus", async (userId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.togglePlatformUserStatus(userId);
    return { userId, is_active: res.is_active, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to toggle user status"));
  }
});

export const resetPlatformUserPassword = createAsyncThunk<
  { userId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/resetPlatformUserPassword", async (userId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.resetPlatformUserPassword(userId);
    return { userId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to reset password"));
  }
});

// 4. HR Admins
export const fetchHrAdmins = createAsyncThunk<
  HrAdminRecord[],
  { search?: string; status?: string } | undefined,
  { rejectValue: string }
>("superAdmin/fetchHrAdmins", async (params, { rejectWithValue }) => {
  try {
    return await superAdminApi.listHrAdmins(params);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch HR admins"));
  }
});

export const createHrAdmin = createAsyncThunk<
  HrAdminRecord,
  CreateHrAdminPayload,
  { rejectValue: string }
>("superAdmin/createHrAdmin", async (payload, { rejectWithValue }) => {
  try {
    return await superAdminApi.createHrAdmin(payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to create HR admin"));
  }
});

export const updateHrAdmin = createAsyncThunk<
  { adminId: string; payload: UpdateHrAdminPayload; message: string },
  { adminId: string; payload: UpdateHrAdminPayload },
  { rejectValue: string }
>("superAdmin/updateHrAdmin", async ({ adminId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.updateHrAdmin(adminId, payload);
    return { adminId, payload, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update HR admin"));
  }
});

export const deleteHrAdmin = createAsyncThunk<
  { adminId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/deleteHrAdmin", async (adminId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.deleteHrAdmin(adminId);
    return { adminId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to delete HR admin"));
  }
});

export const assignHrAdmin = createAsyncThunk<
  { adminId: string; companyId: string; message: string },
  { adminId: string; payload: { companyId: string } },
  { rejectValue: string }
>("superAdmin/assignHrAdmin", async ({ adminId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.assignHrAdmin(adminId, payload);
    return { adminId, companyId: payload.companyId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to assign HR admin"));
  }
});

export const removeHrAdminOrganization = createAsyncThunk<
  { adminId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/removeHrAdminOrganization", async (adminId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.removeHrAdminOrganization(adminId);
    return { adminId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to remove HR admin organization assignment"));
  }
});

// 5. Subscriptions
export const fetchSubscriptions = createAsyncThunk<
  SubscriptionRecord[],
  void,
  { rejectValue: string }
>("superAdmin/fetchSubscriptions", async (_, { rejectWithValue }) => {
  try {
    return await superAdminApi.listSubscriptions();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch subscriptions"));
  }
});

export const fetchSubscription = createAsyncThunk<
  SubscriptionDetail,
  string,
  { rejectValue: string }
>("superAdmin/fetchSubscription", async (subId, { rejectWithValue }) => {
  try {
    return await superAdminApi.getSubscription(subId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch subscription detail"));
  }
});

export const updateSubscription = createAsyncThunk<
  { subOrOrgId: string; payload: UpdateSubscriptionPayload; message: string },
  { subOrOrgId: string; payload: UpdateSubscriptionPayload },
  { rejectValue: string }
>("superAdmin/updateSubscription", async ({ subOrOrgId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.updateSubscription(subOrOrgId, payload);
    return { subOrOrgId, payload, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update subscription"));
  }
});

// 6. Plans
export const fetchPlans = createAsyncThunk<PlanRecord[], void, { rejectValue: string }>(
  "superAdmin/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.listPlans();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch subscription plans"));
    }
  },
);

export const createPlan = createAsyncThunk<
  { plan: PlanRecord; message: string },
  CreatePlanPayload,
  { rejectValue: string }
>("superAdmin/createPlan", async (payload, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.createPlan(payload);
    return { plan: res.plan, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to create plan"));
  }
});

export const updatePlan = createAsyncThunk<
  { planId: string; payload: UpdatePlanPayload; message: string },
  { planId: string; payload: UpdatePlanPayload },
  { rejectValue: string }
>("superAdmin/updatePlan", async ({ planId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.updatePlan(planId, payload);
    return { planId, payload, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update plan"));
  }
});

export const deletePlan = createAsyncThunk<
  { planId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/deletePlan", async (planId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.deletePlan(planId);
    return { planId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to delete plan"));
  }
});

// 7. Entitlements
export const fetchEntitlements = createAsyncThunk<EntitlementsData, void, { rejectValue: string }>(
  "superAdmin/fetchEntitlements",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.getEntitlements();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch entitlements"));
    }
  },
);

export const updateEntitlements = createAsyncThunk<
  { payload: UpdateEntitlementsPayload; message: string },
  UpdateEntitlementsPayload,
  { rejectValue: string }
>("superAdmin/updateEntitlements", async (payload, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.updateEntitlements(payload);
    return { payload, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update entitlements"));
  }
});

// 8. Billing
export const fetchBilling = createAsyncThunk<BillingRecord[], void, { rejectValue: string }>(
  "superAdmin/fetchBilling",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.listBilling();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch billing transactions"));
    }
  },
);

// 9. Security
export const fetchSecurity = createAsyncThunk<SecurityOverview, void, { rejectValue: string }>(
  "superAdmin/fetchSecurity",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.getSecurityOverview();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch security posture"));
    }
  },
);

export const fetchSecurityEvents = createAsyncThunk<SecurityEventRecord[], void, { rejectValue: string }>(
  "superAdmin/fetchSecurityEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.listSecurityEvents();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch security events"));
    }
  },
);

export const fetchSecurityAlerts = createAsyncThunk<SecurityEventRecord[], void, { rejectValue: string }>(
  "superAdmin/fetchSecurityAlerts",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.listSecurityAlerts();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch security alerts"));
    }
  },
);

export const resolveSecurityEvent = createAsyncThunk<
  { eventId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/resolveSecurityEvent", async (eventId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.resolveSecurityEvent(eventId);
    return { eventId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to resolve security event"));
  }
});

export const blockIp = createAsyncThunk<
  { ip: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/blockIp", async (ip, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.blockIp(ip);
    return { ip, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to block IP"));
  }
});

export const unblockIp = createAsyncThunk<
  { ip: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/unblockIp", async (ip, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.unblockIp(ip);
    return { ip, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to unblock IP"));
  }
});

export const fetchActiveSessions = createAsyncThunk<SecuritySessionRecord[], void, { rejectValue: string }>(
  "superAdmin/fetchActiveSessions",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.listActiveSessions();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch active sessions"));
    }
  },
);

export const terminateSession = createAsyncThunk<
  { sessionId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/terminateSession", async (sessionId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.terminateSession(sessionId);
    return { sessionId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to terminate session"));
  }
});

export const terminateAllSessions = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>("superAdmin/terminateAllSessions", async (_, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.terminateAllSessions();
    return { message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to terminate all sessions"));
  }
});

// 10. Audit Logs
export const fetchAuditLogs = createAsyncThunk<
  AuditLogRecord[],
  AuditLogListParams | undefined,
  { rejectValue: string }
>("superAdmin/fetchAuditLogs", async (params, { rejectWithValue }) => {
  try {
    return await superAdminApi.listAuditLogs(params);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch audit logs"));
  }
});

export const pruneAuditLogs = createAsyncThunk<
  PruneAuditLogsResponse,
  void,
  { rejectValue: string }
>("superAdmin/pruneAuditLogs", async (_, { rejectWithValue }) => {
  try {
    return await superAdminApi.pruneAuditLogs();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to prune audit logs"));
  }
});

// 11. System Health
export const fetchSystemHealth = createAsyncThunk<SystemHealthData, void, { rejectValue: string }>(
  "superAdmin/fetchSystemHealth",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.getRawSystemHealth();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch system health telemetry"));
    }
  },
);

// 12. Settings
export const fetchPlatformSettings = createAsyncThunk<PlatformSettings, void, { rejectValue: string }>(
  "superAdmin/fetchPlatformSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.getPlatformSettings();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch platform settings"));
    }
  },
);

export const updatePlatformSettings = createAsyncThunk<
  PlatformSettings,
  PlatformSettings,
  { rejectValue: string }
>("superAdmin/updatePlatformSettings", async (changes, { rejectWithValue }) => {
  try {
    return await superAdminApi.updatePlatformSettings(changes);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to save platform settings"));
  }
});

// 13. Onboarding
export const fetchOnboarding = createAsyncThunk<OnboardingRecord[], void, { rejectValue: string }>(
  "superAdmin/fetchOnboarding",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.listOnboarding();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch onboarding pipeline"));
    }
  },
);

export const fetchOrganizationOnboarding = createAsyncThunk<
  OnboardingDetail,
  string,
  { rejectValue: string }
>("superAdmin/fetchOrganizationOnboarding", async (orgId, { rejectWithValue }) => {
  try {
    return await superAdminApi.getOrganizationOnboarding(orgId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch organization onboarding details"));
  }
});

export const fastTrackOnboarding = createAsyncThunk<
  { orgId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/fastTrackOnboarding", async (orgId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.fastTrackOnboarding(orgId);
    return { orgId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fast track onboarding"));
  }
});

// 14. Analytics
export const fetchPlatformAnalytics = createAsyncThunk<
  PlatformAnalyticsData,
  void,
  { rejectValue: string }
>("superAdmin/fetchPlatformAnalytics", async (_, { rejectWithValue }) => {
  try {
    return await superAdminApi.getPlatformAnalytics();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch platform analytics"));
  }
});

export const fetchAiUsage = createAsyncThunk<AiUsageData, void, { rejectValue: string }>(
  "superAdmin/fetchAiUsage",
  async (_, { rejectWithValue }) => {
    try {
      return await superAdminApi.getAiUsage();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch AI usage telemetry"));
    }
  },
);

// 15. Announcements
export const fetchAnnouncements = createAsyncThunk<
  AnnouncementRecord[],
  void,
  { rejectValue: string }
>("superAdmin/fetchAnnouncements", async (_, { rejectWithValue }) => {
  try {
    return await superAdminApi.listAnnouncements();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch announcements"));
  }
});

export const createAnnouncement = createAsyncThunk<
  AnnouncementRecord,
  CreateAnnouncementPayload,
  { rejectValue: string }
>("superAdmin/createAnnouncement", async (payload, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.createAnnouncement(payload);
    return res.announcement;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to create announcement"));
  }
});

export const updateAnnouncement = createAsyncThunk<
  AnnouncementRecord,
  { annId: string; payload: UpdateAnnouncementPayload },
  { rejectValue: string }
>("superAdmin/updateAnnouncement", async ({ annId, payload }, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.updateAnnouncement(annId, payload);
    return res.announcement;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to update announcement"));
  }
});

export const deleteAnnouncement = createAsyncThunk<
  { annId: string; message: string },
  string,
  { rejectValue: string }
>("superAdmin/deleteAnnouncement", async (annId, { rejectWithValue }) => {
  try {
    const res = await superAdminApi.deleteAnnouncement(annId);
    return { annId, message: res.message };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to delete announcement"));
  }
});

// ─── Super Admin Redux State Structure (Section 22) ──────────────────────────

export interface SuperAdminState {
  statistics: {
    data: SuperAdminStatisticsResponse | null;
    loading: boolean;
    error: string | null;
  };
  organizations: {
    items: OrganizationRecord[];
    selected: OrganizationDetail | null;
    loading: boolean;
    error: string | null;
  };
  users: {
    items: PlatformUserRecord[];
    selected: PlatformUserDetail | null;
    loading: boolean;
    error: string | null;
  };
  hrAdmins: {
    items: HrAdminRecord[];
    loading: boolean;
    error: string | null;
  };
  subscriptions: {
    items: SubscriptionRecord[];
    selected: SubscriptionDetail | null;
    loading: boolean;
    error: string | null;
  };
  plans: {
    items: PlanRecord[];
    loading: boolean;
    error: string | null;
  };
  entitlements: {
    data: EntitlementsData | null;
    loading: boolean;
    error: string | null;
  };
  billing: {
    items: BillingRecord[];
    loading: boolean;
    error: string | null;
  };
  security: {
    overview: SecurityOverview | null;
    events: SecurityEventRecord[];
    alerts: SecurityEventRecord[];
    sessions: SecuritySessionRecord[];
    loading: boolean;
    error: string | null;
  };
  auditLogs: {
    items: AuditLogRecord[];
    loading: boolean;
    error: string | null;
  };
  systemHealth: {
    data: SystemHealthData | null;
    loading: boolean;
    error: string | null;
  };
  settings: {
    data: PlatformSettings | null;
    loading: boolean;
    error: string | null;
  };
  onboarding: {
    items: OnboardingRecord[];
    selected: OnboardingDetail | null;
    loading: boolean;
    error: string | null;
  };
  analytics: {
    data: PlatformAnalyticsData | null;
    aiUsage: AiUsageData | null;
    loading: boolean;
    error: string | null;
  };
  announcements: {
    items: AnnouncementRecord[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: SuperAdminState = {
  statistics: { data: null, loading: false, error: null },
  organizations: { items: [], selected: null, loading: false, error: null },
  users: { items: [], selected: null, loading: false, error: null },
  hrAdmins: { items: [], loading: false, error: null },
  subscriptions: { items: [], selected: null, loading: false, error: null },
  plans: { items: [], loading: false, error: null },
  entitlements: { data: null, loading: false, error: null },
  billing: { items: [], loading: false, error: null },
  security: { overview: null, events: [], alerts: [], sessions: [], loading: false, error: null },
  auditLogs: { items: [], loading: false, error: null },
  systemHealth: { data: null, loading: false, error: null },
  settings: { data: null, loading: false, error: null },
  onboarding: { items: [], selected: null, loading: false, error: null },
  analytics: { data: null, aiUsage: null, loading: false, error: null },
  announcements: { items: [], loading: false, error: null },
};

export const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    clearSuperAdminError: (state, action: PayloadAction<keyof SuperAdminState | undefined>) => {
      if (action.payload) {
        state[action.payload].error = null;
      } else {
        Object.keys(state).forEach((key) => {
          (state as any)[key].error = null;
        });
      }
    },
    setSelectedOrganization: (state, action: PayloadAction<OrganizationDetail | null>) => {
      state.organizations.selected = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<PlatformUserDetail | null>) => {
      state.users.selected = action.payload;
    },
    setSelectedSubscription: (state, action: PayloadAction<SubscriptionDetail | null>) => {
      state.subscriptions.selected = action.payload;
    },
    setSelectedOnboarding: (state, action: PayloadAction<OnboardingDetail | null>) => {
      state.onboarding.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ─── 1. Statistics ───
    builder
      .addCase(fetchSuperAdminStatistics.pending, (state) => {
        state.statistics.loading = true;
        state.statistics.error = null;
      })
      .addCase(fetchSuperAdminStatistics.fulfilled, (state, action) => {
        state.statistics.loading = false;
        state.statistics.data = action.payload;
      })
      .addCase(fetchSuperAdminStatistics.rejected, (state, action) => {
        state.statistics.loading = false;
        state.statistics.error = action.payload ?? "Failed to fetch statistics";
      });

    // ─── 2. Organizations ───
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.organizations.loading = true;
        state.organizations.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.organizations.loading = false;
        state.organizations.items = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.organizations.loading = false;
        state.organizations.error = action.payload ?? "Failed to fetch organizations";
      })
      .addCase(fetchOrganization.pending, (state) => {
        state.organizations.loading = true;
        state.organizations.error = null;
      })
      .addCase(fetchOrganization.fulfilled, (state, action) => {
        state.organizations.loading = false;
        state.organizations.selected = action.payload;
      })
      .addCase(fetchOrganization.rejected, (state, action) => {
        state.organizations.loading = false;
        state.organizations.error = action.payload ?? "Failed to fetch organization";
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.organizations.items.unshift(action.payload);
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        const { orgId, payload } = action.payload;
        const index = state.organizations.items.findIndex((o) => o.id === orgId);
        if (index !== -1) {
          state.organizations.items[index] = {
            ...state.organizations.items[index],
            ...payload,
            name: payload.name ?? state.organizations.items[index].name,
            plan: payload.plan ?? state.organizations.items[index].plan,
            status: payload.status ?? state.organizations.items[index].status,
          };
        }
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        const { orgId } = action.payload;
        const index = state.organizations.items.findIndex((o) => o.id === orgId);
        if (index !== -1) {
          state.organizations.items[index].status = "Deactivated";
          state.organizations.items[index].access_status = "DEACTIVATED";
        }
      })
      .addCase(grantOrganizationAccess.fulfilled, (state, action) => {
        const { orgId, plan } = action.payload;
        const index = state.organizations.items.findIndex((o) => o.id === orgId);
        if (index !== -1) {
          state.organizations.items[index].status = "Active";
          state.organizations.items[index].access_status = "ACTIVE";
          if (plan) state.organizations.items[index].plan = plan;
        }
      })
      .addCase(suspendOrganization.fulfilled, (state, action) => {
        const { orgId } = action.payload;
        const index = state.organizations.items.findIndex((o) => o.id === orgId);
        if (index !== -1) {
          state.organizations.items[index].status = "Suspended";
          state.organizations.items[index].access_status = "SUSPENDED";
        }
      })
      .addCase(cancelOrganization.fulfilled, (state, action) => {
        const { orgId } = action.payload;
        const index = state.organizations.items.findIndex((o) => o.id === orgId);
        if (index !== -1) {
          state.organizations.items[index].status = "Cancelled";
          state.organizations.items[index].access_status = "CANCELLED";
        }
      })
      .addCase(reactivateOrganization.fulfilled, (state, action) => {
        const { orgId } = action.payload;
        const index = state.organizations.items.findIndex((o) => o.id === orgId);
        if (index !== -1) {
          state.organizations.items[index].status = "Active";
          state.organizations.items[index].access_status = "ACTIVE";
        }
      });

    // ─── 3. Platform Users ───
    builder
      .addCase(fetchPlatformUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchPlatformUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.items = action.payload;
      })
      .addCase(fetchPlatformUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload ?? "Failed to fetch users";
      })
      .addCase(fetchPlatformUser.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchPlatformUser.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.selected = action.payload;
      })
      .addCase(fetchPlatformUser.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload ?? "Failed to fetch user";
      })
      .addCase(createPlatformUser.fulfilled, (state, action) => {
        state.users.items.unshift(action.payload);
      })
      .addCase(updatePlatformUser.fulfilled, (state, action) => {
        const { userId, payload } = action.payload;
        const index = state.users.items.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.users.items[index] = {
            ...state.users.items[index],
            ...payload,
            name: payload.name ?? state.users.items[index].name,
            phone: payload.phone ?? state.users.items[index].phone,
            role: payload.role ?? state.users.items[index].role,
            status: payload.status ?? state.users.items[index].status,
            is_active: payload.status ? payload.status.toLowerCase() === "active" : state.users.items[index].is_active,
          };
        }
      })
      .addCase(deletePlatformUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.users.items = state.users.items.filter((u) => u.id !== userId);
      })
      .addCase(activatePlatformUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        const index = state.users.items.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.users.items[index].is_active = true;
          state.users.items[index].status = "Active";
        }
      })
      .addCase(deactivatePlatformUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        const index = state.users.items.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.users.items[index].is_active = false;
          state.users.items[index].status = "Inactive";
        }
      })
      .addCase(togglePlatformUserStatus.fulfilled, (state, action) => {
        const { userId, is_active } = action.payload;
        const index = state.users.items.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.users.items[index].is_active = is_active;
          state.users.items[index].status = is_active ? "Active" : "Inactive";
        }
      });

    // ─── 4. HR Admins ───
    builder
      .addCase(fetchHrAdmins.pending, (state) => {
        state.hrAdmins.loading = true;
        state.hrAdmins.error = null;
      })
      .addCase(fetchHrAdmins.fulfilled, (state, action) => {
        state.hrAdmins.loading = false;
        state.hrAdmins.items = action.payload;
      })
      .addCase(fetchHrAdmins.rejected, (state, action) => {
        state.hrAdmins.loading = false;
        state.hrAdmins.error = action.payload ?? "Failed to fetch HR admins";
      })
      .addCase(createHrAdmin.fulfilled, (state, action) => {
        state.hrAdmins.items.unshift(action.payload);
      })
      .addCase(deleteHrAdmin.fulfilled, (state, action) => {
        state.hrAdmins.items = state.hrAdmins.items.filter((a) => a.id !== action.payload.adminId);
      });

    // ─── 5. Subscriptions ───
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.subscriptions.loading = true;
        state.subscriptions.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.subscriptions.loading = false;
        state.subscriptions.items = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.subscriptions.loading = false;
        state.subscriptions.error = action.payload ?? "Failed to fetch subscriptions";
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.subscriptions.selected = action.payload;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const { subOrOrgId, payload } = action.payload;
        const index = state.subscriptions.items.findIndex(
          (s) => s.id === subOrOrgId || s.companyId === subOrOrgId,
        );
        if (index !== -1) {
          state.subscriptions.items[index] = {
            ...state.subscriptions.items[index],
            ...payload,
            plan: payload.plan ?? state.subscriptions.items[index].plan,
            amount: payload.amount ?? state.subscriptions.items[index].amount,
            status: payload.status ?? state.subscriptions.items[index].status,
          };
        }
      });

    // ─── 6. Plans ───
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.plans.loading = true;
        state.plans.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans.loading = false;
        state.plans.items = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.plans.loading = false;
        state.plans.error = action.payload ?? "Failed to fetch plans";
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.items.push(action.payload.plan);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const { planId, payload } = action.payload;
        const index = state.plans.items.findIndex((p) => p.id === planId);
        if (index !== -1) {
          state.plans.items[index] = {
            ...state.plans.items[index],
            ...payload,
          };
        }
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans.items = state.plans.items.filter((p) => p.id !== action.payload.planId);
      });

    // ─── 7. Entitlements ───
    builder
      .addCase(fetchEntitlements.pending, (state) => {
        state.entitlements.loading = true;
        state.entitlements.error = null;
      })
      .addCase(fetchEntitlements.fulfilled, (state, action) => {
        state.entitlements.loading = false;
        state.entitlements.data = action.payload;
      })
      .addCase(fetchEntitlements.rejected, (state, action) => {
        state.entitlements.loading = false;
        state.entitlements.error = action.payload ?? "Failed to fetch entitlements";
      })
      .addCase(updateEntitlements.fulfilled, (state, action) => {
        if (state.entitlements.data) {
          state.entitlements.data = {
            ...state.entitlements.data,
            ...action.payload.payload,
          } as EntitlementsData;
        }
      });

    // ─── 8. Billing ───
    builder
      .addCase(fetchBilling.pending, (state) => {
        state.billing.loading = true;
        state.billing.error = null;
      })
      .addCase(fetchBilling.fulfilled, (state, action) => {
        state.billing.loading = false;
        state.billing.items = action.payload;
      })
      .addCase(fetchBilling.rejected, (state, action) => {
        state.billing.loading = false;
        state.billing.error = action.payload ?? "Failed to fetch billing transactions";
      });

    // ─── 9. Security ───
    builder
      .addCase(fetchSecurity.pending, (state) => {
        state.security.loading = true;
        state.security.error = null;
      })
      .addCase(fetchSecurity.fulfilled, (state, action) => {
        state.security.loading = false;
        state.security.overview = action.payload;
      })
      .addCase(fetchSecurity.rejected, (state, action) => {
        state.security.loading = false;
        state.security.error = action.payload ?? "Failed to fetch security posture";
      })
      .addCase(fetchSecurityEvents.fulfilled, (state, action) => {
        state.security.events = action.payload;
      })
      .addCase(fetchSecurityAlerts.fulfilled, (state, action) => {
        state.security.alerts = action.payload;
      })
      .addCase(resolveSecurityEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        const evIndex = state.security.events.findIndex((e) => e.id === eventId);
        if (evIndex !== -1) {
          state.security.events[evIndex].status = "Resolved";
        }
      })
      .addCase(fetchActiveSessions.fulfilled, (state, action) => {
        state.security.sessions = action.payload;
      })
      .addCase(terminateSession.fulfilled, (state, action) => {
        state.security.sessions = state.security.sessions.filter(
          (s) => s.id !== action.payload.sessionId,
        );
      })
      .addCase(terminateAllSessions.fulfilled, (state) => {
        state.security.sessions = [];
      });

    // ─── 10. Audit Logs ───
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.auditLogs.loading = true;
        state.auditLogs.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs.loading = false;
        state.auditLogs.items = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.auditLogs.loading = false;
        state.auditLogs.error = action.payload ?? "Failed to fetch audit logs";
      })
      .addCase(pruneAuditLogs.fulfilled, (state) => {
        // Preserves compliance logs as per backend
      });

    // ─── 11. System Health ───
    builder
      .addCase(fetchSystemHealth.pending, (state) => {
        state.systemHealth.loading = true;
        state.systemHealth.error = null;
      })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.systemHealth.loading = false;
        state.systemHealth.data = action.payload;
      })
      .addCase(fetchSystemHealth.rejected, (state, action) => {
        state.systemHealth.loading = false;
        state.systemHealth.error = action.payload ?? "Failed to fetch system health";
      });

    // ─── 12. Settings ───
    builder
      .addCase(fetchPlatformSettings.pending, (state) => {
        state.settings.loading = true;
        state.settings.error = null;
      })
      .addCase(fetchPlatformSettings.fulfilled, (state, action) => {
        state.settings.loading = false;
        state.settings.data = action.payload;
      })
      .addCase(fetchPlatformSettings.rejected, (state, action) => {
        state.settings.loading = false;
        state.settings.error = action.payload ?? "Failed to fetch platform settings";
      })
      .addCase(updatePlatformSettings.fulfilled, (state, action) => {
        state.settings.data = action.payload;
      });

    // ─── 13. Onboarding ───
    builder
      .addCase(fetchOnboarding.pending, (state) => {
        state.onboarding.loading = true;
        state.onboarding.error = null;
      })
      .addCase(fetchOnboarding.fulfilled, (state, action) => {
        state.onboarding.loading = false;
        state.onboarding.items = action.payload;
      })
      .addCase(fetchOnboarding.rejected, (state, action) => {
        state.onboarding.loading = false;
        state.onboarding.error = action.payload ?? "Failed to fetch onboarding items";
      })
      .addCase(fetchOrganizationOnboarding.fulfilled, (state, action) => {
        state.onboarding.selected = action.payload;
      })
      .addCase(fastTrackOnboarding.fulfilled, (state, action) => {
        const { orgId } = action.payload;
        const item = state.onboarding.items.find((i) => i.id === orgId);
        if (item) {
          item.status = "Active";
          item.progressPercentage = 100;
          item.currentStep = "Complete";
        }
      });

    // ─── 14. Analytics ───
    builder
      .addCase(fetchPlatformAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.data = action.payload;
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error = action.payload ?? "Failed to fetch platform analytics";
      })
      .addCase(fetchAiUsage.fulfilled, (state, action) => {
        state.analytics.aiUsage = action.payload;
      });

    // ─── 15. Announcements ───
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.announcements.loading = true;
        state.announcements.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.announcements.loading = false;
        state.announcements.items = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.announcements.loading = false;
        state.announcements.error = action.payload ?? "Failed to fetch announcements";
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.announcements.items.unshift(action.payload);
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.items.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.announcements.items[index] = action.payload;
        }
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements.items = state.announcements.items.filter(
          (a) => a.id !== action.payload.annId,
        );
      });
  },
});

export const {
  clearSuperAdminError,
  setSelectedOrganization,
  setSelectedUser,
  setSelectedSubscription,
  setSelectedOnboarding,
} = superAdminSlice.actions;

export default superAdminSlice.reducer;
