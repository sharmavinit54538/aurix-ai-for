import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, type InfiniteData } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { useMarkRead, notificationKeys } from "../hooks";
import type { NotificationListData, UnreadCountData, NotificationItem } from "@/services/notificationsApi";
import { aurix } from "@/lib/aurix-store";

describe("Optimistic Mark-Read & Rollback on Error", () => {
  let queryClient: QueryClient;
  const mockUserId = "test-user-123";

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    aurix.set({
      user: {
        id: mockUserId,
        fullName: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        role: "hr_admin",
        companyId: "c-1",
        emailVerified: true,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("optimistically marks item as read and rolls back on API failure", async () => {
    // 1. Seed query cache with initial unread notification
    const sampleItem: NotificationItem = {
      id: "notif-99",
      type: "leave.requested",
      category: "leave",
      module: "core_hr",
      priority: "high",
      title: "Pending Leave Approval",
      body: "Employee requested 2 days of annual leave.",
      link: "/dashboard/leaves",
      createdAt: new Date().toISOString(),
      readAt: null, // UNREAD
      archivedAt: null,
    };

    const initialListData: InfiniteData<NotificationListData, string | null> = {
      pages: [
        {
          items: [sampleItem],
          nextCursor: null,
          hasMore: false,
          totalUnread: 1,
        },
      ],
      pageParams: [null],
    };

    const initialUnreadCount: UnreadCountData = {
      total: 1,
      byCategory: { leave: 1 },
    };

    queryClient.setQueryData(notificationKeys.list(mockUserId), initialListData);
    queryClient.setQueryData(notificationKeys.unreadCount(mockUserId), initialUnreadCount);

    // 2. Configure MSW to reject markRead with HTTP 500 after a short delay
    server.use(
      http.post("*/api/v1/notifications/notif-99/read", async () => {
        await new Promise((res) => setTimeout(res, 80));
        return HttpResponse.json(
          { success: false, message: "Database failure occurred" },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useMarkRead(), { wrapper });

    // 3. Trigger markRead mutation
    act(() => {
      result.current.mutate("notif-99");
    });

    // 4. Verify OPTIMISTIC update happened while mutation is pending
    await waitFor(() => {
      const optimisticList = queryClient.getQueryData<InfiniteData<NotificationListData, string | null>>(
        notificationKeys.list(mockUserId),
      );
      expect(optimisticList?.pages[0].items[0].readAt).toBeTruthy();
    });

    const optimisticUnread = queryClient.getQueryData<UnreadCountData>(
      notificationKeys.unreadCount(mockUserId),
    );
    expect(optimisticUnread?.total).toBe(0);

    // 5. Wait for mutation failure and verify ROLLBACK restored original unread state
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    await waitFor(() => {
      const rolledBackList = queryClient.getQueryData<InfiniteData<NotificationListData, string | null>>(
        notificationKeys.list(mockUserId),
      );
      // Notification must be rolled back to readAt: null
      expect(rolledBackList?.pages[0].items[0].readAt).toBeNull();
    });

    const rolledBackUnread = queryClient.getQueryData<UnreadCountData>(
      notificationKeys.unreadCount(mockUserId),
    );
    // Total unread count must be restored to 1
    expect(rolledBackUnread?.total).toBe(1);
  });
});
