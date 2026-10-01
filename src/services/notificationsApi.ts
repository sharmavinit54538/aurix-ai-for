import axios from "axios";
import { z } from "zod";
import apiInstance from "@/api/apiInstance";

// ─────────────────────────────────────────────────────────────
// 1. Core Zod Schemas & Types
// ─────────────────────────────────────────────────────────────

export const NotificationPrioritySchema = z.enum(["low", "normal", "high", "critical"]);
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;

export const NotificationCategorySchema = z.enum([
  "attendance",
  "leave",
  "payroll",
  "documents",
  "assets",
  "recruitment",
  "onboarding_exit",
  "approvals",
  "security",
  "system",
  "ai_insights",
]);
export type NotificationCategory = z.infer<typeof NotificationCategorySchema>;

export const NotificationModuleSchema = z.enum([
  "core_hr",
  "workforce",
  "payroll",
  "recruitment",
  "security",
  "compliance",
  "system",
]);
export type NotificationModule = z.infer<typeof NotificationModuleSchema>;

export const NotificationActorSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.string().optional(),
});
export type NotificationActor = z.infer<typeof NotificationActorSchema>;

export const NotificationEntitySchema = z.object({
  type: z.string(),
  id: z.string(),
});
export type NotificationEntity = z.infer<typeof NotificationEntitySchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  category: NotificationCategorySchema,
  module: NotificationModuleSchema,
  priority: NotificationPrioritySchema,
  title: z.string().max(200),
  body: z.string().max(1000),
  link: z.string().startsWith("/"),
  entity: NotificationEntitySchema.optional(),
  actor: NotificationActorSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  dedupeKey: z.string().optional(),
  createdAt: z.string(),
  readAt: z.string().nullable().optional(),
  archivedAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});
export type NotificationItem = z.infer<typeof NotificationSchema>;

export const NotificationListResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    items: z.array(NotificationSchema),
    nextCursor: z.string().nullable(),
    hasMore: z.boolean(),
    totalUnread: z.number().int().nonnegative().optional(),
  }),
});

export const UnreadCountResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    total: z.number().int().nonnegative(),
    byCategory: z.record(NotificationCategorySchema, z.number().int().nonnegative()).optional(),
  }),
});

// ─────────────────────────────────────────────────────────────
// 2. Query Params & Response Interfaces
// ─────────────────────────────────────────────────────────────

export interface NotificationListParams {
  cursor?: string | null;
  limit?: number;
  unread?: boolean;
  category?: string;
  priority?: string;
  module?: string;
  includeArchived?: boolean;
}

export interface NotificationListData {
  items: NotificationItem[];
  nextCursor: string | null;
  hasMore: boolean;
  totalUnread?: number;
}

export interface UnreadCountData {
  total: number;
  byCategory?: Record<string, number>;
}

// ─────────────────────────────────────────────────────────────
// 3. Helper Functions
// ─────────────────────────────────────────────────────────────

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

function isNotFoundOrNetworkError(err: unknown): boolean {
  if (axios.isAxiosError(err)) {
    return !err.response || err.response.status === 404;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────
// 4. Notifications API Client & Circuit Breaker
// ─────────────────────────────────────────────────────────────

// Session-level circuit breaker for /notifications/unread-count 404
let unreadCount404Breaker = false;
let hasLogged404Once = false;

export function isUnreadCountCircuitBroken(): boolean {
  return unreadCount404Breaker;
}

export function resetUnreadCountCircuitBreaker(): void {
  unreadCount404Breaker = false;
  hasLogged404Once = false;
}

export const notificationsApi = {
  /**
   * GET /notifications
   * Cursor-paginated notifications with optional filtering.
   */
  async getNotifications(params?: NotificationListParams): Promise<NotificationListData> {
    try {
      const res = await apiInstance.get("/notifications", { params });
      const data = extractData<NotificationListData>(res, {
        items: [],
        nextCursor: null,
        hasMore: false,
        totalUnread: 0,
      });

      return {
        items: Array.isArray(data?.items) ? data.items : [],
        nextCursor: data?.nextCursor ?? null,
        hasMore: Boolean(data?.hasMore),
        totalUnread: typeof data?.totalUnread === "number" ? data.totalUnread : 0,
      };
    } catch (err: unknown) {
      if (isNotFoundOrNetworkError(err)) {
        return { items: [], nextCursor: null, hasMore: false, totalUnread: 0 };
      }
      throw err;
    }
  },

  /**
   * GET /notifications/unread-count
   * Total unread count and category breakdown.
   * If endpoint returns 404, trips session circuit breaker and throws 404.
   */
  async getUnreadCount(): Promise<UnreadCountData> {
    if (unreadCount404Breaker) {
      const err = new Error("Unread count endpoint unavailable (404)");
      (err as any).status = 404;
      throw err;
    }

    try {
      const res = await apiInstance.get("/notifications/unread-count");
      const data = extractData<UnreadCountData>(res, { total: 0, byCategory: {} });
      return {
        total: typeof data?.total === "number" ? data.total : 0,
        byCategory: data?.byCategory || {},
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        unreadCount404Breaker = true;
        if (!hasLogged404Once) {
          hasLogged404Once = true;
          if (import.meta.env.DEV) {
            console.warn(
              "[Notifications] GET /notifications/unread-count returned 404. Circuit breaker tripped: polling disabled for this session. Deriving unread count from list.",
            );
          }
        }
        const notFoundErr = new Error("Unread count endpoint unavailable (404)");
        (notFoundErr as any).status = 404;
        throw notFoundErr;
      }
      throw err;
    }
  },

  /**
   * POST /notifications/{id}/read
   * Mark a single notification as read.
   */
  async markRead(id: string): Promise<{ id: string; readAt: string | null }> {
    try {
      const res = await apiInstance.post(`/notifications/${id}/read`);
      return extractData<{ id: string; readAt: string | null }>(res, {
        id,
        readAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (isNotFoundOrNetworkError(err)) {
        return { id, readAt: new Date().toISOString() };
      }
      throw err;
    }
  },

  /**
   * POST /notifications/{id}/unread
   * Mark a single notification as unread.
   */
  async markUnread(id: string): Promise<{ id: string; readAt: null }> {
    try {
      const res = await apiInstance.post(`/notifications/${id}/unread`);
      return extractData<{ id: string; readAt: null }>(res, { id, readAt: null });
    } catch (err: unknown) {
      if (isNotFoundOrNetworkError(err)) {
        return { id, readAt: null };
      }
      throw err;
    }
  },

  /**
   * POST /notifications/{id}/archive
   * Archive a single notification.
   */
  async archive(id: string): Promise<{ id: string; archivedAt: string | null }> {
    try {
      const res = await apiInstance.post(`/notifications/${id}/archive`);
      return extractData<{ id: string; archivedAt: string | null }>(res, {
        id,
        archivedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (isNotFoundOrNetworkError(err)) {
        return { id, archivedAt: new Date().toISOString() };
      }
      throw err;
    }
  },

  /**
   * POST /notifications/read
   * Bulk mark multiple notifications as read.
   */
  async bulkMarkRead(ids: string[]): Promise<{ updatedCount: number; readAt: string | null }> {
    try {
      const res = await apiInstance.post("/notifications/read", { ids });
      return extractData<{ updatedCount: number; readAt: string | null }>(res, {
        updatedCount: ids.length,
        readAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (isNotFoundOrNetworkError(err)) {
        return { updatedCount: ids.length, readAt: new Date().toISOString() };
      }
      throw err;
    }
  },

  /**
   * POST /notifications/read-all
   * Mark all notifications (or all in a category) as read.
   */
  async markAllRead(category?: string): Promise<{ updatedCount: number; readAt: string | null }> {
    try {
      const res = await apiInstance.post(
        "/notifications/read-all",
        category ? { category } : {},
      );
      return extractData<{ updatedCount: number; readAt: string | null }>(res, {
        updatedCount: 0,
        readAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (isNotFoundOrNetworkError(err)) {
        return { updatedCount: 0, readAt: new Date().toISOString() };
      }
      throw err;
    }
  },
};
