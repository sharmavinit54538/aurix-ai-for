import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { StrictMode } from "react";
import { render, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider, type InfiniteData } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import recruitmentReducer, { clearRecruitment } from "@/features/admin/recruitment/recruitmentSlice";
import { fetchRecruitmentData } from "@/features/admin/recruitment/recruitmentThunk";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { recruitmentApi } from "@/services/recruitmentApi";
import { extractItems } from "@/features/admin/recruitment/utils/apiMappers";
import {
  notificationsApi,
  isUnreadCountCircuitBroken,
  resetUnreadCountCircuitBreaker,
  type NotificationListData,
} from "@/services/notificationsApi";
import { useUnreadCount, notificationKeys } from "@/features/notifications/hooks";
import apiInstance, {
  refreshAccessToken,
  handleSessionExpired,
  resetSessionExpiredFlag,
} from "@/api/apiInstance";
import { getRefreshToken, setTokens, setRefreshToken } from "@/api/tokens";
import { bootstrapAuth } from "@/lib/auth-bootstrap";
import { aurix } from "@/lib/aurix-store";
import { safeStorage } from "@/lib/safe-storage";

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Production Fixes Test Suite", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    resetUnreadCountCircuitBreaker();
    resetSessionExpiredFlag();
    setTokens(null);
    aurix.reset();
    safeStorage.clear();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─────────────────────────────────────────────────────────────
  // 1. Recruitment Dedupe Tests
  // ─────────────────────────────────────────────────────────────
  describe("1. Recruitment Fetch Deduplication", () => {
    function createStore() {
      return configureStore({
        reducer: {
          recruitment: recruitmentReducer,
        },
      });
    }

    it("triggers only 1 fetch when 3 components mount simultaneously (and under StrictMode)", async () => {
      const store = createStore();
      const fetchSpy = vi
        .spyOn(recruitmentApi, "fetchRecruitmentDashboardData")
        .mockResolvedValue({
          jobs: [{ id: "j-1", title: "Dev" } as any],
          candidates: [],
          interviews: [],
          offers: [],
        });

      function TestCompA() {
        useRecruitment();
        return <div>Component A</div>;
      }
      function TestCompB() {
        useRecruitment();
        return <div>Component B</div>;
      }
      function TestCompC() {
        useRecruitment();
        return <div>Component C</div>;
      }

      // Render 3 components inside Redux Provider and React StrictMode
      render(
        <StrictMode>
          <Provider store={store}>
            <TestCompA />
            <TestCompB />
            <TestCompC />
          </Provider>
        </StrictMode>,
      );

      await waitFor(() => {
        expect(store.getState().recruitment.loading).toBe(false);
        expect(store.getState().recruitment.jobs.length).toBe(1);
      });

      // Exactly 1 network fetch should have been initiated across all 3 components & StrictMode remounts
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("skips fetchRecruitmentData when already loading or fetched within 30s, unless force is true", async () => {
      const store = createStore();
      const fetchSpy = vi
        .spyOn(recruitmentApi, "fetchRecruitmentDashboardData")
        .mockResolvedValue({
          jobs: [],
          candidates: [],
          interviews: [],
          offers: [],
        });

      // First fetch: executes
      await store.dispatch(fetchRecruitmentData());
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Second fetch within 30s: condition returns false, skipped
      const skippedResult = await store.dispatch(fetchRecruitmentData());
      expect(skippedResult.meta.requestStatus).toBe("rejected");
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Forced fetch: condition allows it through
      const forcedResult = await store.dispatch(fetchRecruitmentData({ force: true }));
      expect(forcedResult.meta.requestStatus).toBe("fulfilled");
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Notifications 404 Circuit Breaker Tests
  // ─────────────────────────────────────────────────────────────
  describe("2. Notifications 404 Circuit Breaker & Fallback", () => {
    it("trips circuit breaker on 404 and does not hammer the backend again", async () => {
      const axiosError: any = new Error("Request failed with status code 404");
      axiosError.isAxiosError = true;
      axiosError.response = { status: 404 };

      const getSpy = vi.spyOn(apiInstance, "get").mockRejectedValue(axiosError);
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(isUnreadCountCircuitBroken()).toBe(false);

      // 1. First call encounters 404
      await expect(notificationsApi.getUnreadCount()).rejects.toThrow("Unread count endpoint unavailable (404)");
      expect(isUnreadCountCircuitBroken()).toBe(true);

      // 2. Second call should fail fast without sending another network request
      await expect(notificationsApi.getUnreadCount()).rejects.toThrow("Unread count endpoint unavailable (circuit broken)");

      // Only one network attempt was made
      expect(getSpy).toHaveBeenCalledTimes(1);
      // Logged only once
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it("derives unread count from the notifications list in cache when circuit breaker is tripped", async () => {
      const mockUserId = "u-404-test";
      aurix.set({
        user: {
          id: mockUserId,
          fullName: "User",
          email: "user@test.com",
          phone: "123",
          role: "hr_admin",
          companyId: "c-1",
          emailVerified: true,
          onboardingComplete: true,
          createdAt: new Date().toISOString(),
        },
      });

      // Seed notification list into TanStack Query cache with 2 unread items
      const listData: InfiniteData<NotificationListData, string | null> = {
        pages: [
          {
            items: [
              {
                id: "notif-1",
                type: "task",
                category: "recruitment",
                module: "recruitment",
                priority: "normal",
                title: "Job Requisition Approved",
                body: "Frontend role is open",
                link: "/recruitment",
                createdAt: new Date().toISOString(),
                readAt: null, // UNREAD
              },
              {
                id: "notif-2",
                type: "task",
                category: "payroll",
                module: "payroll",
                priority: "high",
                title: "Payroll cycle ready",
                body: "Review cycle",
                link: "/payroll",
                createdAt: new Date().toISOString(),
                readAt: null, // UNREAD
              },
              {
                id: "notif-3",
                type: "task",
                category: "payroll",
                module: "payroll",
                priority: "low",
                title: "Old archived notif",
                body: "Review cycle",
                link: "/payroll",
                createdAt: new Date().toISOString(),
                readAt: new Date().toISOString(), // READ
              },
            ],
            nextCursor: null,
            hasMore: false,
            totalUnread: 2,
          },
        ],
        pageParams: [null],
      };

      queryClient.setQueryData(
        notificationKeys.lists(mockUserId),
        listData,
      );

      // Trip the circuit breaker before mounting useUnreadCount
      const axiosError: any = new Error("Not Found");
      axiosError.isAxiosError = true;
      axiosError.response = { status: 404 };
      vi.spyOn(apiInstance, "get").mockRejectedValue(axiosError);
      await notificationsApi.getUnreadCount().catch(() => {});
      expect(isUnreadCountCircuitBroken()).toBe(true);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useUnreadCount(), { wrapper });

      // Count is derived from the list cache: 2 unread items
      expect(result.current.unreadCount).toBe(2);
      expect(result.current.byCategory.recruitment).toBe(1);
      expect(result.current.byCategory.payroll).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Auth Refresh Single-Flight & Session Tests
  // ─────────────────────────────────────────────────────────────
  describe("3. Auth Refresh Single-Flight & Clean Session Handling", () => {
    it("shares a single refresh promise for concurrent 401s and sends refresh_token in body", async () => {
      const storedRefreshToken = "test-stored-refresh-token-xyz";
      safeStorage.setItem("aurix:refresh_token", storedRefreshToken);
      setRefreshToken(storedRefreshToken);

      let refreshPostCalls = 0;
      let capturedBody: any = null;

      vi.spyOn(axios, "post").mockImplementation(async (url: string, body: any) => {
        if (url.includes("/auth/refresh")) {
          refreshPostCalls++;
          capturedBody = body;
          // Simulate latency to test single-flight dedupe
          await new Promise((resolve) => setTimeout(resolve, 30));
          return {
            status: 200,
            data: {
              access_token: "new-access-token-123",
              refresh_token: "rotated-refresh-token-456",
            },
          };
        }
        return { status: 200, data: {} };
      });

      // Fire 4 concurrent refresh requests
      const promises = [
        refreshAccessToken(),
        refreshAccessToken(),
        refreshAccessToken(),
        refreshAccessToken(),
      ];

      const results = await Promise.all(promises);

      // All 4 callers receive the new token
      expect(results).toEqual([
        "new-access-token-123",
        "new-access-token-123",
        "new-access-token-123",
        "new-access-token-123",
      ]);

      // Exactly 1 POST /auth/refresh was fired
      expect(refreshPostCalls).toBe(1);

      // Request body contained the refresh_token
      expect(capturedBody).toEqual({
        refresh_token: storedRefreshToken,
        refreshToken: storedRefreshToken,
      });

      // Rotated refresh token is persisted in storage
      expect(getRefreshToken()).toBe("rotated-refresh-token-456");
    });

    it("logs user out cleanly exactly once and shows toast on failed refresh", async () => {
      safeStorage.setItem("aurix:refresh_token", "invalid-token");

      const error401: any = new Error("Invalid or missing refresh token");
      error401.response = { status: 401 };

      vi.spyOn(axios, "post").mockRejectedValue(error401);

      // Run concurrent refresh attempts that fail
      const results = await Promise.allSettled([
        refreshAccessToken(),
        refreshAccessToken(),
        refreshAccessToken(),
      ]);

      expect(results.every((r) => r.status === "rejected")).toBe(true);

      // Toast error displayed exactly once
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith("Session expired. Please sign in again.");

      // Storage and memory tokens cleared
      expect(getRefreshToken()).toBeNull();
      expect(aurix.get().user).toBeNull();
    });

    it("does NOT call /auth/refresh on boot when there is no stored session", async () => {
      const postSpy = vi.spyOn(axios, "post");

      // Verify no stored user or tokens
      expect(aurix.get().user).toBeNull();
      expect(getRefreshToken()).toBeNull();

      await bootstrapAuth();

      // Ensure no /auth/refresh call was made
      expect(postSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("/auth/refresh"),
        expect.anything(),
        expect.anything(),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Paginated & Direct Array Response Extraction Tests
  // ─────────────────────────────────────────────────────────────
  describe("4. Paginated List Response Compatibility", () => {
    it("extracts items from paginated object { items, total, page, limit }", () => {
      const paginatedResult = {
        status: "fulfilled" as const,
        value: {
          items: [
            { id: "c1", first_name: "Alice", last_name: "Smith" },
            { id: "c2", first_name: "Bob", last_name: "Jones" },
          ],
          total: 2,
          page: 1,
          limit: 10,
        },
      };

      const extracted = extractItems(paginatedResult);
      expect(extracted).toHaveLength(2);
      expect(extracted[0].first_name).toBe("Alice");
      expect(extracted[1].first_name).toBe("Bob");
    });

    it("extracts items from direct array response shape [...]", () => {
      const directArrayResult = {
        status: "fulfilled" as const,
        value: [
          { id: "j1", title: "Staff Architect" },
          { id: "j2", title: "Principal Engineer" },
        ],
      };

      const extracted = extractItems(directArrayResult);
      expect(extracted).toHaveLength(2);
      expect(extracted[0].title).toBe("Staff Architect");
    });

    it("extracts items from nested { data: { items: [...] } } shape", () => {
      const nestedResult = {
        status: "fulfilled" as const,
        value: {
          data: {
            items: [{ id: "off-1", salary: 2500000 }],
            total: 1,
          },
        },
      };

      const extracted = extractItems(nestedResult);
      expect(extracted).toHaveLength(1);
      expect(extracted[0].salary).toBe(2500000);
    });
  });
});
