import { useMemo } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  notificationsApi,
  isUnreadCountCircuitBroken,
  type NotificationItem,
  type NotificationListData,
  type NotificationListParams,
  type UnreadCountData,
} from "@/services/notificationsApi";
import { useAurix } from "@/lib/aurix-store";

// ─────────────────────────────────────────────────────────────
// 1. Query Keys
// ─────────────────────────────────────────────────────────────

export const notificationKeys = {
  all: (userId: string) => ["notifications", userId] as const,
  lists: (userId: string) => ["notifications", userId, "list"] as const,
  list: (userId: string, filters?: NotificationListParams) =>
    ["notifications", userId, "list", filters ?? {}] as const,
  unreadCount: (userId: string) => ["notifications", userId, "unread-count"] as const,
};

// ─────────────────────────────────────────────────────────────
// 2. Cache Helpers for Optimistic Updates
// ─────────────────────────────────────────────────────────────

function updateItemInInfiniteData(
  oldData: InfiniteData<NotificationListData, string | null> | undefined,
  id: string,
  updater: (item: NotificationItem) => NotificationItem | null,
): InfiniteData<NotificationListData, string | null> | undefined {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      items: page.items
        .map((item) => (item.id === id ? updater(item) : item))
        .filter((item): item is NotificationItem => item !== null),
    })),
  };
}

function markAllInInfiniteData(
  oldData: InfiniteData<NotificationListData, string | null> | undefined,
  category?: string,
): InfiniteData<NotificationListData, string | null> | undefined {
  if (!oldData) return oldData;
  const now = new Date().toISOString();
  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => {
        if (!category || item.category === category) {
          return { ...item, readAt: item.readAt ?? now };
        }
        return item;
      }),
      totalUnread: category
        ? Math.max(
            0,
            (page.totalUnread ?? 0) -
              page.items.filter((i) => i.category === category && !i.readAt).length,
          )
        : 0,
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Hooks
// ─────────────────────────────────────────────────────────────

/**
 * Cursor-paginated infinite notifications query.
 */
export function useNotifications(filters?: NotificationListParams) {
  const { user } = useAurix();
  const userId = user?.id || "anonymous";

  const query = useInfiniteQuery<
    NotificationListData,
    Error,
    InfiniteData<NotificationListData, string | null>,
    ReturnType<typeof notificationKeys.list>,
    string | null
  >({
    queryKey: notificationKeys.list(userId, filters),
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      return notificationsApi.getNotifications({
        ...filters,
        cursor: pageParam,
      });
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    staleTime: 1000 * 30, // 30 seconds
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  const totalUnread = query.data?.pages[0]?.totalUnread ?? 0;

  return {
    ...query,
    items,
    totalUnread,
  };
}

/**
 * Real-time unread count query.
 * Polling no more often than every 60s, refetchIntervalInBackground: false.
 * If 404 occurs, session circuit breaker stops polling and derives count from notifications list.
 */
export function useUnreadCount() {
  const { user } = useAurix();
  const userId = user?.id || "anonymous";
  const queryClient = useQueryClient();
  const isCircuitBroken = isUnreadCountCircuitBroken();

  const query = useQuery<UnreadCountData, Error>({
    queryKey: notificationKeys.unreadCount(userId),
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: !isCircuitBroken,
    refetchInterval: isCircuitBroken ? false : 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: !isCircuitBroken,
    staleTime: 1000 * 30,
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  // Derive unread count from notifications list if circuit breaker is tripped or query failed
  const derivedFromList = useMemo(() => {
    const listQueries = queryClient.getQueriesData<InfiniteData<NotificationListData, string | null>>({
      queryKey: notificationKeys.lists(userId),
    });
    let count = 0;
    const byCategory: Record<string, number> = {};
    for (const [, data] of listQueries) {
      if (!data?.pages) continue;
      for (const page of data.pages) {
        for (const item of page.items || []) {
          if (!item.readAt && !item.archivedAt) {
            count++;
            if (item.category) {
              byCategory[item.category] = (byCategory[item.category] || 0) + 1;
            }
          }
        }
        if (typeof page.totalUnread === "number" && page.totalUnread > count) {
          count = page.totalUnread;
        }
      }
      return { total: count, byCategory };
    }
    return { total: 0, byCategory };
  }, [queryClient, userId, query.data, query.isError, isCircuitBroken]);

  const effectiveTotal = isCircuitBroken || query.isError
    ? derivedFromList.total
    : (query.data?.total ?? derivedFromList.total);

  const effectiveByCategory = isCircuitBroken || query.isError
    ? derivedFromList.byCategory
    : (query.data?.byCategory ?? derivedFromList.byCategory);

  return {
    ...query,
    unreadCount: effectiveTotal,
    byCategory: effectiveByCategory,
  };
}

/**
 * Optimistic mutation to mark a notification as read.
 */
export function useMarkRead() {
  const queryClient = useQueryClient();
  const { user } = useAurix();
  const userId = user?.id || "anonymous";

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });

      const previousLists = queryClient.getQueriesData<
        InfiniteData<NotificationListData, string | null>
      >({
        queryKey: notificationKeys.lists(userId),
      });

      const previousUnread = queryClient.getQueryData<UnreadCountData>(
        notificationKeys.unreadCount(userId),
      );

      // Optimistically update list queries
      queryClient.setQueriesData<InfiniteData<NotificationListData, string | null>>(
        { queryKey: notificationKeys.lists(userId) },
        (old) =>
          updateItemInInfiniteData(old, id, (item) => ({
            ...item,
            readAt: item.readAt ?? new Date().toISOString(),
          })),
      );

      // Optimistically decrement unread count
      queryClient.setQueryData<UnreadCountData>(
        notificationKeys.unreadCount(userId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            total: Math.max(0, old.total - 1),
          };
        },
      );

      return { previousLists, previousUnread };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, val]) => {
          queryClient.setQueryData(key, val);
        });
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(userId),
          context.previousUnread,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
    },
  });
}

/**
 * Optimistic mutation to mark a notification as unread.
 */
export function useMarkUnread() {
  const queryClient = useQueryClient();
  const { user } = useAurix();
  const userId = user?.id || "anonymous";

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markUnread(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });

      const previousLists = queryClient.getQueriesData<
        InfiniteData<NotificationListData, string | null>
      >({
        queryKey: notificationKeys.lists(userId),
      });

      const previousUnread = queryClient.getQueryData<UnreadCountData>(
        notificationKeys.unreadCount(userId),
      );

      queryClient.setQueriesData<InfiniteData<NotificationListData, string | null>>(
        { queryKey: notificationKeys.lists(userId) },
        (old) => updateItemInInfiniteData(old, id, (item) => ({ ...item, readAt: null })),
      );

      queryClient.setQueryData<UnreadCountData>(
        notificationKeys.unreadCount(userId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            total: old.total + 1,
          };
        },
      );

      return { previousLists, previousUnread };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, val]) => {
          queryClient.setQueryData(key, val);
        });
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(userId),
          context.previousUnread,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
    },
  });
}

/**
 * Optimistic mutation to mark all notifications (or all in a category) as read.
 */
export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const { user } = useAurix();
  const userId = user?.id || "anonymous";

  return useMutation({
    mutationFn: (category?: string) => notificationsApi.markAllRead(category),
    onMutate: async (category?: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });

      const previousLists = queryClient.getQueriesData<
        InfiniteData<NotificationListData, string | null>
      >({
        queryKey: notificationKeys.lists(userId),
      });

      const previousUnread = queryClient.getQueryData<UnreadCountData>(
        notificationKeys.unreadCount(userId),
      );

      queryClient.setQueriesData<InfiniteData<NotificationListData, string | null>>(
        { queryKey: notificationKeys.lists(userId) },
        (old) => markAllInInfiniteData(old, category),
      );

      queryClient.setQueryData<UnreadCountData>(
        notificationKeys.unreadCount(userId),
        (old) => {
          if (!old) return old;
          if (category) {
            const catCount = old.byCategory?.[category] ?? 0;
            return {
              ...old,
              total: Math.max(0, old.total - catCount),
              byCategory: { ...old.byCategory, [category]: 0 },
            };
          }
          return { total: 0, byCategory: {} };
        },
      );

      return { previousLists, previousUnread };
    },
    onError: (_err, _cat, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, val]) => {
          queryClient.setQueryData(key, val);
        });
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(userId),
          context.previousUnread,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
    },
  });
}

/**
 * Optimistic mutation to archive a notification.
 */
export function useArchive() {
  const queryClient = useQueryClient();
  const { user } = useAurix();
  const userId = user?.id || "anonymous";

  return useMutation({
    mutationFn: (id: string) => notificationsApi.archive(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });

      const previousLists = queryClient.getQueriesData<
        InfiniteData<NotificationListData, string | null>
      >({
        queryKey: notificationKeys.lists(userId),
      });

      const previousUnread = queryClient.getQueryData<UnreadCountData>(
        notificationKeys.unreadCount(userId),
      );

      let wasUnread = false;

      // Optimistically remove from list (or mark archived)
      queryClient.setQueriesData<InfiniteData<NotificationListData, string | null>>(
        { queryKey: notificationKeys.lists(userId) },
        (old) =>
          updateItemInInfiniteData(old, id, (item) => {
            if (!item.readAt) wasUnread = true;
            return {
              ...item,
              archivedAt: new Date().toISOString(),
            };
          }),
      );

      if (wasUnread) {
        queryClient.setQueryData<UnreadCountData>(
          notificationKeys.unreadCount(userId),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              total: Math.max(0, old.total - 1),
            };
          },
        );
      }

      return { previousLists, previousUnread };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, val]) => {
          queryClient.setQueryData(key, val);
        });
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(userId),
          context.previousUnread,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
    },
  });
}
