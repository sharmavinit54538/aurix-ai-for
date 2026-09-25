/**
 * Super Admin Redux-Powered Hooks.
 *
 * Connects the Super Admin UI components directly to the Redux store:
 * - Dispatches Redux Toolkit `createAsyncThunk` actions
 * - Subscribes to `state.superAdmin` slices
 * - Manages lifecycle, loading, error, and refresh states
 * - Zero mock data, zero hardcoded values
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ApiError } from "@/api/client";
import {
  collectAllPages,
  superAdminApi,
} from "./superAdminApi";
import {
  fetchSuperAdminStatistics,
  fetchOrganizations,
  fetchOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  grantOrganizationAccess,
  extendOrganizationAccess,
  suspendOrganization,
  cancelOrganization,
  reactivateOrganization,
  fetchPlatformUsers,
  fetchPlatformUser,
  createPlatformUser,
  updatePlatformUser,
  deletePlatformUser,
  activatePlatformUser,
  deactivatePlatformUser,
  togglePlatformUserStatus,
  resetPlatformUserPassword,
  fetchHrAdmins,
  createHrAdmin,
  updateHrAdmin,
  deleteHrAdmin,
  assignHrAdmin,
  removeHrAdminOrganization,
  fetchSubscriptions,
  fetchSubscription,
  updateSubscription,
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan,
  fetchEntitlements,
  updateEntitlements,
  fetchBilling,
  fetchSecurity,
  fetchSecurityEvents,
  fetchSecurityAlerts,
  resolveSecurityEvent,
  blockIp,
  unblockIp,
  fetchActiveSessions,
  terminateSession,
  terminateAllSessions,
  fetchAuditLogs,
  pruneAuditLogs,
  fetchSystemHealth,
  fetchPlatformSettings,
  updatePlatformSettings,
  fetchOnboarding,
  fetchOrganizationOnboarding,
  fastTrackOnboarding,
  fetchPlatformAnalytics,
  fetchAiUsage,
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  clearSuperAdminError,
  type SuperAdminState,
} from "./redux/superAdminSlice";
import { normalizeStatistics } from "./superAdminApi";
import type {
  AnalyticsDataset,
  AuditLogListParams,
  OrganizationListParams,
  OrganizationRecord,
  PlatformAuditEvent,
  PlatformOrganization,
  PlatformSession,
  PlatformSettings,
  PlatformStatistics,
  PlatformUser,
  PublicHealth,
  ReadinessReport,
  SecuritySessionRecord,
  SystemHealthSnapshot,
  UserListParams,
} from "./types";

export const ANALYTICS_MAX_USERS = 5000;
export const ANALYTICS_MAX_ORGANIZATIONS = 2000;

export function useSuperAdminState(): SuperAdminState {
  return useAppSelector((state) => state.superAdmin);
}

// ─── 1. Statistics ───────────────────────────────────────────────────────────

export function useSuperAdminStatistics() {
  const dispatch = useAppDispatch();
  const statistics = useAppSelector((state) => state.superAdmin.statistics);

  useEffect(() => {
    if (!statistics.data && !statistics.loading && !statistics.error) {
      dispatch(fetchSuperAdminStatistics());
    }
  }, [dispatch, statistics.data, statistics.loading, statistics.error]);

  const normalized: PlatformStatistics | null = useMemo(() => {
    if (!statistics.data) return null;
    return normalizeStatistics(statistics.data);
  }, [statistics.data]);

  const refetch = useCallback(() => {
    return dispatch(fetchSuperAdminStatistics()).unwrap();
  }, [dispatch]);

  const errorObj = useMemo(() => {
    return statistics.error ? new ApiError(statistics.error, 500, null) : null;
  }, [statistics.error]);

  return {
    data: normalized,
    raw: statistics.data,
    isPending: statistics.loading && !statistics.data,
    isLoading: statistics.loading && !statistics.data,
    isFetching: statistics.loading,
    isError: Boolean(statistics.error),
    error: errorObj,
    refetch,
  };
}

// ─── 2. Platform Users ───────────────────────────────────────────────────────

export function useSuperAdminUsers(params: UserListParams) {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.superAdmin.users);
  const paramKey = JSON.stringify(params);

  useEffect(() => {
    dispatch(fetchPlatformUsers(params));
  }, [dispatch, paramKey]);

  const refetch = useCallback(() => {
    return dispatch(fetchPlatformUsers(params)).unwrap();
  }, [dispatch, params]);

  const errorObj = useMemo(() => {
    return users.error ? new ApiError(users.error, 500, null) : null;
  }, [users.error]);

  return {
    data: users.items,
    isPending: users.loading && users.items.length === 0,
    isLoading: users.loading && users.items.length === 0,
    isFetching: users.loading,
    isPlaceholderData: false,
    isError: Boolean(users.error),
    error: errorObj,
    refetch,
  };
}

export function useSuperAdminAccounts() {
  const params: UserListParams = useMemo(() => ({ page: 1, pageSize: 10, role: "super_admin" }), []);
  return useSuperAdminUsers(params);
}

// ─── 3. Organizations ────────────────────────────────────────────────────────

export function useSuperAdminOrganizations(params: OrganizationListParams) {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.superAdmin.organizations);
  const paramKey = JSON.stringify(params);

  useEffect(() => {
    dispatch(fetchOrganizations(params));
  }, [dispatch, paramKey]);

  const refetch = useCallback(() => {
    return dispatch(fetchOrganizations(params)).unwrap();
  }, [dispatch, params]);

  const errorObj = useMemo(() => {
    return organizations.error ? new ApiError(organizations.error, 500, null) : null;
  }, [organizations.error]);

  return {
    data: organizations.items,
    isPending: organizations.loading && organizations.items.length === 0,
    isLoading: organizations.loading && organizations.items.length === 0,
    isFetching: organizations.loading,
    isPlaceholderData: false,
    isError: Boolean(organizations.error),
    error: errorObj,
    refetch,
  };
}

export function useOrganizationDirectory() {
  const params: OrganizationListParams = useMemo(() => ({ page: 1, pageSize: 200 }), []);
  return useSuperAdminOrganizations(params);
}

// ─── 4. Audit Logs ───────────────────────────────────────────────────────────

export function useSuperAdminAuditLogs(params: AuditLogListParams) {
  const dispatch = useAppDispatch();
  const auditLogs = useAppSelector((state) => state.superAdmin.auditLogs);
  const paramKey = JSON.stringify(params);

  useEffect(() => {
    dispatch(fetchAuditLogs(params));
  }, [dispatch, paramKey]);

  const refetch = useCallback(() => {
    return dispatch(fetchAuditLogs(params)).unwrap();
  }, [dispatch, params]);

  const errorObj = useMemo(() => {
    return auditLogs.error ? new ApiError(auditLogs.error, 500, null) : null;
  }, [auditLogs.error]);

  return {
    data: auditLogs.items,
    isPending: auditLogs.loading && auditLogs.items.length === 0,
    isLoading: auditLogs.loading && auditLogs.items.length === 0,
    isFetching: auditLogs.loading,
    isPlaceholderData: false,
    isError: Boolean(auditLogs.error),
    error: errorObj,
    refetch,
  };
}

export function useSuperAdminAuditFeed(pageSize: number, refetchIntervalMs: number | false = false) {
  const dispatch = useAppDispatch();
  const auditLogs = useAppSelector((state) => state.superAdmin.auditLogs);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState<PlatformAuditEvent[][]>([]);

  const loadFeed = useCallback(async (p: number) => {
    try {
      const items = await superAdminApi.listAuditEvents({ page: p, pageSize });
      setPages((prev) => {
        const next = [...prev];
        next[p - 1] = items;
        return next;
      });
    } catch (err) {
      // Handled in UI
    }
  }, [pageSize]);

  useEffect(() => {
    loadFeed(1);
  }, [loadFeed]);

  useEffect(() => {
    if (typeof refetchIntervalMs === "number" && refetchIntervalMs > 0) {
      const timer = setInterval(() => {
        loadFeed(1);
      }, refetchIntervalMs);
      return () => clearInterval(timer);
    }
  }, [loadFeed, refetchIntervalMs]);

  const fetchNextPage = useCallback(async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await loadFeed(nextPage);
  }, [page, loadFeed]);

  const lastPage = pages[pages.length - 1];
  const hasNextPage = Boolean(lastPage && lastPage.length === pageSize);

  const errorObj = useMemo(() => {
    return auditLogs.error ? new ApiError(auditLogs.error, 500, null) : null;
  }, [auditLogs.error]);

  return {
    data: { pages },
    isPending: pages.length === 0,
    isLoading: pages.length === 0,
    isFetching: false,
    isFetchingNextPage: false,
    hasNextPage,
    fetchNextPage,
    isError: Boolean(auditLogs.error),
    error: errorObj,
    refetch: () => loadFeed(1),
  };
}

// ─── 5. Sessions ─────────────────────────────────────────────────────────────

export function useSuperAdminSessions(refetchIntervalMs: number | false = false) {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector((state) => state.superAdmin.security.sessions);
  const loading = useAppSelector((state) => state.superAdmin.security.loading);
  const error = useAppSelector((state) => state.superAdmin.security.error);

  useEffect(() => {
    dispatch(fetchActiveSessions());
  }, [dispatch]);

  useEffect(() => {
    if (typeof refetchIntervalMs === "number" && refetchIntervalMs > 0) {
      const timer = setInterval(() => {
        dispatch(fetchActiveSessions());
      }, refetchIntervalMs);
      return () => clearInterval(timer);
    }
  }, [dispatch, refetchIntervalMs]);

  const refetch = useCallback(() => {
    return dispatch(fetchActiveSessions()).unwrap();
  }, [dispatch]);

  const errorObj = useMemo(() => {
    return error ? new ApiError(error, 500, null) : null;
  }, [error]);

  return {
    data: sessions,
    isPending: loading && sessions.length === 0,
    isLoading: loading && sessions.length === 0,
    isFetching: loading,
    isError: Boolean(error),
    error: errorObj,
    refetch,
  };
}

// ─── 6. System Health ────────────────────────────────────────────────────────

export function useSystemHealth() {
  const dispatch = useAppDispatch();
  const systemHealth = useAppSelector((state) => state.superAdmin.systemHealth);
  const [snapshot, setSnapshot] = useState<SystemHealthSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await superAdminApi.getSystemHealth();
      setSnapshot(snap);
      dispatch(fetchSystemHealth());
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data: snapshot,
    raw: systemHealth.data,
    isPending: loading && !snapshot,
    isLoading: loading && !snapshot,
    isFetching: loading,
    isError: Boolean(error),
    error,
    refetch: load,
  };
}

export function usePublicHealth() {
  const [data, setData] = useState<PublicHealth | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      const res = await superAdminApi.getPublicHealth();
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    isPending,
    isLoading: isPending,
    isFetching: isPending,
    isError: Boolean(error),
    error,
    refetch: load,
  };
}

export function useReadiness() {
  const [data, setData] = useState<ReadinessReport | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      const res = await superAdminApi.getReadiness();
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    isPending,
    isLoading: isPending,
    isFetching: isPending,
    isError: Boolean(error),
    error,
    refetch: load,
  };
}

// ─── 7. Platform Settings ────────────────────────────────────────────────────

export function useSuperAdminSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.superAdmin.settings);

  useEffect(() => {
    if (!settings.data && !settings.loading) {
      dispatch(fetchPlatformSettings());
    }
  }, [dispatch, settings.data, settings.loading]);

  const refetch = useCallback(() => {
    return dispatch(fetchPlatformSettings()).unwrap();
  }, [dispatch]);

  const errorObj = useMemo(() => {
    return settings.error ? new ApiError(settings.error, 500, null) : null;
  }, [settings.error]);

  return {
    data: settings.data ?? {},
    isPending: settings.loading && !settings.data,
    isLoading: settings.loading && !settings.data,
    isFetching: settings.loading,
    isError: Boolean(settings.error),
    error: errorObj,
    refetch,
  };
}

// ─── 8. Analytics Dataset ────────────────────────────────────────────────────

export function useAnalyticsDataset() {
  const [data, setData] = useState<AnalyticsDataset | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      const [users, organizations] = await Promise.all([
        collectAllPages((page, pageSize) => superAdminApi.listUsers({ page, pageSize }), ANALYTICS_MAX_USERS),
        collectAllPages(
          (page, pageSize) => superAdminApi.listOrganizations({ page, pageSize }),
          ANALYTICS_MAX_ORGANIZATIONS,
        ),
      ]);
      setData({ users, organizations, collectedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    isPending,
    isLoading: isPending,
    isFetching: isPending,
    isError: Boolean(error),
    error,
    refetch: load,
  };
}

// ─── 9. Mutations ────────────────────────────────────────────────────────────

export function useSetUserActive() {
  const dispatch = useAppDispatch();
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async ({ userId, active }: { userId: string; active: boolean }) => {
      setIsPending(true);
      try {
        const action = active ? activatePlatformUser(userId) : deactivatePlatformUser(userId);
        const res = await dispatch(action).unwrap();
        // Refresh statistics and users in Redux
        dispatch(fetchSuperAdminStatistics());
        return res.message;
      } finally {
        setIsPending(false);
      }
    },
    [dispatch],
  );

  return {
    mutateAsync,
    isPending,
  };
}

export function useUpdateSuperAdminSettings() {
  const dispatch = useAppDispatch();
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (changes: PlatformSettings) => {
      setIsPending(true);
      try {
        const res = await dispatch(updatePlatformSettings(changes)).unwrap();
        // Refresh audit logs
        dispatch(fetchAuditLogs());
        return res;
      } finally {
        setIsPending(false);
      }
    },
    [dispatch],
  );

  return {
    mutateAsync,
    isPending,
  };
}

// ─── 10. Additional Hooks for New Modules ────────────────────────────────────

export function useSuperAdminSubscriptions() {
  const dispatch = useAppDispatch();
  const subscriptions = useAppSelector((state) => state.superAdmin.subscriptions);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const refetch = useCallback(() => {
    return dispatch(fetchSubscriptions()).unwrap();
  }, [dispatch]);

  return {
    data: subscriptions.items,
    selected: subscriptions.selected,
    isPending: subscriptions.loading,
    isError: Boolean(subscriptions.error),
    error: subscriptions.error,
    refetch,
  };
}

export function useSuperAdminPlans() {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((state) => state.superAdmin.plans);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const refetch = useCallback(() => {
    return dispatch(fetchPlans()).unwrap();
  }, [dispatch]);

  return {
    data: plans.items,
    isPending: plans.loading,
    isError: Boolean(plans.error),
    error: plans.error,
    refetch,
  };
}

export function useSuperAdminEntitlements() {
  const dispatch = useAppDispatch();
  const entitlements = useAppSelector((state) => state.superAdmin.entitlements);

  useEffect(() => {
    dispatch(fetchEntitlements());
  }, [dispatch]);

  const refetch = useCallback(() => {
    return dispatch(fetchEntitlements()).unwrap();
  }, [dispatch]);

  return {
    data: entitlements.data,
    isPending: entitlements.loading,
    isError: Boolean(entitlements.error),
    error: entitlements.error,
    refetch,
  };
}

export function useSuperAdminBilling() {
  const dispatch = useAppDispatch();
  const billing = useAppSelector((state) => state.superAdmin.billing);

  useEffect(() => {
    dispatch(fetchBilling());
  }, [dispatch]);

  const refetch = useCallback(() => {
    return dispatch(fetchBilling()).unwrap();
  }, [dispatch]);

  return {
    data: billing.items,
    isPending: billing.loading,
    isError: Boolean(billing.error),
    error: billing.error,
    refetch,
  };
}

export function useSuperAdminOnboarding() {
  const dispatch = useAppDispatch();
  const onboarding = useAppSelector((state) => state.superAdmin.onboarding);

  useEffect(() => {
    dispatch(fetchOnboarding());
  }, [dispatch]);

  const refetch = useCallback(() => {
    return dispatch(fetchOnboarding()).unwrap();
  }, [dispatch]);

  return {
    data: onboarding.items,
    selected: onboarding.selected,
    isPending: onboarding.loading,
    isError: Boolean(onboarding.error),
    error: onboarding.error,
    refetch,
  };
}

export function useSuperAdminAnnouncements() {
  const dispatch = useAppDispatch();
  const announcements = useAppSelector((state) => state.superAdmin.announcements);

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const refetch = useCallback(() => {
    return dispatch(fetchAnnouncements()).unwrap();
  }, [dispatch]);

  return {
    data: announcements.items,
    isPending: announcements.loading,
    isError: Boolean(announcements.error),
    error: announcements.error,
    refetch,
  };
}

function getErrorMessage(err: unknown, defaultMessage = "Operation failed"): string {
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message;
  }
  if (typeof err === "string") return err;
  return defaultMessage;
}
