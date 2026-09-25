import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "@/api/client";
import { collectAllPages, superAdminApi } from "./superAdminApi";
import type {
  AnalyticsDataset,
  AuditLogListParams,
  OrganizationListParams,
  PlatformSettings,
  UserListParams,
} from "./types";

/** Record caps for client-side aggregation on the analytics screen (see `collectAllPages`). */
export const ANALYTICS_MAX_USERS = 5000;
export const ANALYTICS_MAX_ORGANIZATIONS = 2000;

export const superAdminKeys = {
  all: ["super-admin"] as const,
  statistics: () => [...superAdminKeys.all, "statistics"] as const,
  users: (params: UserListParams) => [...superAdminKeys.all, "users", params] as const,
  superAdminAccounts: () => [...superAdminKeys.all, "super-admin-accounts"] as const,
  organizations: (params: OrganizationListParams) => [...superAdminKeys.all, "organizations", params] as const,
  organizationDirectory: () => [...superAdminKeys.all, "organization-directory"] as const,
  auditLogs: (params: AuditLogListParams) => [...superAdminKeys.all, "audit-logs", params] as const,
  auditFeed: (pageSize: number) => [...superAdminKeys.all, "audit-feed", pageSize] as const,
  sessions: () => [...superAdminKeys.all, "sessions"] as const,
  systemHealth: () => [...superAdminKeys.all, "system-health"] as const,
  publicHealth: () => [...superAdminKeys.all, "public-health"] as const,
  readiness: () => [...superAdminKeys.all, "readiness"] as const,
  settings: () => [...superAdminKeys.all, "settings"] as const,
  analyticsDataset: () => [...superAdminKeys.all, "analytics-dataset"] as const,
};

/** Never retry authorization/validation failures; retry transient failures once. */
export function shouldRetrySuperAdminQuery(failureCount: number, error: unknown): boolean {
  const status = error instanceof ApiError ? error.status : 0;
  if (status >= 400 && status < 500) return false;
  return failureCount < 1;
}

/** Every mount and every Refresh re-reads the backend; no stale-time window. */
const liveQueryOptions = {
  staleTime: 0,
  refetchOnWindowFocus: false,
  retry: shouldRetrySuperAdminQuery,
} as const;

export function useSuperAdminStatistics() {
  return useQuery({
    queryKey: superAdminKeys.statistics(),
    queryFn: () => superAdminApi.getStatistics(),
    ...liveQueryOptions,
  });
}

export function useSuperAdminUsers(params: UserListParams) {
  return useQuery({
    queryKey: superAdminKeys.users(params),
    queryFn: () => superAdminApi.listUsers(params),
    placeholderData: keepPreviousData,
    ...liveQueryOptions,
  });
}

/** Super Admin accounts stored in the users table (used to verify the single-owner constraint). */
export function useSuperAdminAccounts() {
  return useQuery({
    queryKey: superAdminKeys.superAdminAccounts(),
    queryFn: () => superAdminApi.listUsers({ page: 1, pageSize: 10, role: "super_admin" }),
    ...liveQueryOptions,
  });
}

export function useSuperAdminOrganizations(params: OrganizationListParams) {
  return useQuery({
    queryKey: superAdminKeys.organizations(params),
    queryFn: () => superAdminApi.listOrganizations(params),
    placeholderData: keepPreviousData,
    ...liveQueryOptions,
  });
}

/** Newest 200 tenants — used for "recent organizations" and to label audit events by tenant name. */
export function useOrganizationDirectory() {
  return useQuery({
    queryKey: superAdminKeys.organizationDirectory(),
    queryFn: () => superAdminApi.listOrganizations({ page: 1, pageSize: 200 }),
    ...liveQueryOptions,
  });
}

export function useSuperAdminAuditLogs(params: AuditLogListParams) {
  return useQuery({
    queryKey: superAdminKeys.auditLogs(params),
    queryFn: () => superAdminApi.listAuditEvents(params),
    placeholderData: keepPreviousData,
    ...liveQueryOptions,
  });
}

/** Chronological audit feed with "load older" pagination and optional polling. */
export function useSuperAdminAuditFeed(pageSize: number, refetchIntervalMs: number | false) {
  return useInfiniteQuery({
    queryKey: superAdminKeys.auditFeed(pageSize),
    queryFn: ({ pageParam }) => superAdminApi.listAuditEvents({ page: pageParam, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === pageSize ? allPages.length + 1 : undefined),
    refetchInterval: refetchIntervalMs,
    ...liveQueryOptions,
  });
}

export function useSuperAdminSessions(refetchIntervalMs: number | false = false) {
  return useQuery({
    queryKey: superAdminKeys.sessions(),
    queryFn: () => superAdminApi.listActiveSessions(),
    refetchInterval: refetchIntervalMs,
    ...liveQueryOptions,
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: superAdminKeys.systemHealth(),
    queryFn: () => superAdminApi.getSystemHealth(),
    ...liveQueryOptions,
  });
}

export function usePublicHealth() {
  return useQuery({
    queryKey: superAdminKeys.publicHealth(),
    queryFn: () => superAdminApi.getPublicHealth(),
    ...liveQueryOptions,
  });
}

export function useReadiness() {
  return useQuery({
    queryKey: superAdminKeys.readiness(),
    queryFn: () => superAdminApi.getReadiness(),
    ...liveQueryOptions,
  });
}

export function useSuperAdminSettings() {
  return useQuery({
    queryKey: superAdminKeys.settings(),
    queryFn: () => superAdminApi.getSettings(),
    ...liveQueryOptions,
  });
}

/** Walks the users and organizations endpoints (bounded) so charts can aggregate real records. */
export function useAnalyticsDataset() {
  return useQuery({
    queryKey: superAdminKeys.analyticsDataset(),
    queryFn: async (): Promise<AnalyticsDataset> => {
      const [users, organizations] = await Promise.all([
        collectAllPages((page, pageSize) => superAdminApi.listUsers({ page, pageSize }), ANALYTICS_MAX_USERS),
        collectAllPages(
          (page, pageSize) => superAdminApi.listOrganizations({ page, pageSize }),
          ANALYTICS_MAX_ORGANIZATIONS,
        ),
      ]);
      return { users, organizations, collectedAt: new Date().toISOString() };
    },
    ...liveQueryOptions,
  });
}

export function useSetUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, active }: { userId: string; active: boolean }) =>
      superAdminApi.setUserActive(userId, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: superAdminKeys.all }),
  });
}

export function useUpdateSuperAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (changes: PlatformSettings) => superAdminApi.updateSettings(changes),
    onSuccess: (saved) => {
      queryClient.setQueryData(superAdminKeys.settings(), saved);
      void queryClient.invalidateQueries({ queryKey: [...superAdminKeys.all, "audit-logs"] });
      void queryClient.invalidateQueries({ queryKey: [...superAdminKeys.all, "audit-feed"] });
    },
  });
}
