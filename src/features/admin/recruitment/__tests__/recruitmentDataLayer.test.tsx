import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import recruitmentReducer from "../recruitmentSlice";
import { useRecruitment } from "../hooks/useRecruitment";
import { recruitmentApi } from "@/services/recruitmentApi";
import { parseListResponse } from "@/api/utils";
import {
  notificationsApi,
  resetUnreadCountCircuitBreaker,
  isUnreadCountCircuitBroken,
} from "@/services/notificationsApi";
import apiInstance from "@/api/apiInstance";

function createTestStore() {
  return configureStore({
    reducer: {
      recruitment: recruitmentReducer,
    },
  });
}

function TestConsumer() {
  const { jobs, candidates, loading } = useRecruitment();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="jobs-count">{jobs.length}</span>
      <span data-testid="candidates-count">{candidates.length}</span>
    </div>
  );
}

describe("F-02: Data Layer — Request Deduplication, Circuit Breaker, Pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetUnreadCountCircuitBreaker();
  });

  it("F-02.1: 3 components mounting simultaneously trigger only 1 aggregated fetch", async () => {
    const store = createTestStore();

    let fetchCount = 0;
    const fetchSpy = vi.spyOn(recruitmentApi, "fetchRecruitmentDashboardData").mockImplementation(async () => {
      fetchCount++;
      await new Promise((r) => setTimeout(r, 20));
      return {
        jobs: [{
          id: "job-1",
          title: "Software Engineer",
          department: "Engineering",
          employmentType: "Full-time",
          experience: "2-4 yrs",
          skills: [],
          salaryMin: 0,
          salaryMax: 0,
          currency: "INR",
          vacancies: 1,
          location: "BLR",
          workMode: "Onsite",
          description: "",
          responsibilities: [],
          requirements: [],
          benefits: [],
          hiringManager: "Manager",
          recruiter: "Recruiter",
          publishedAt: new Date().toISOString(),
          closingAt: new Date().toISOString(),
          applicants: 0,
          status: "active",
        }],
        candidates: [],
        interviews: [],
        offers: [],
      };
    });

    // Render 3 sibling components simultaneously
    render(
      <Provider store={store}>
        <div>
          <TestConsumer />
          <TestConsumer />
          <TestConsumer />
        </div>
      </Provider>,
    );

    await waitFor(() => {
      expect(store.getState().recruitment.jobs.length).toBe(1);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchCount).toBe(1);
  });

  it("F-02.2: Notifications unread-count trips circuit breaker on 404 and stops polling", async () => {
    expect(isUnreadCountCircuitBroken()).toBe(false);

    const apiGetSpy = vi.spyOn(apiInstance, "get").mockImplementation(async (url: string) => {
      if (url.includes("/notifications/unread-count")) {
        const error: any = new Error("Not Found");
        error.isAxiosError = true;
        error.response = { status: 404, data: { detail: "Not found" } };
        throw error;
      }
      return { status: 200, data: { success: true, data: { items: [], totalUnread: 0 } } } as any;
    });

    await expect(notificationsApi.getUnreadCount()).rejects.toThrow("Unread count endpoint unavailable");
    expect(isUnreadCountCircuitBroken()).toBe(true);

    // Second call should immediately throw without making another network request
    apiGetSpy.mockClear();
    await expect(notificationsApi.getUnreadCount()).rejects.toThrow("circuit broken");
    expect(apiGetSpy).not.toHaveBeenCalled();
  });

  it("F-02.4: parseListResponse supports both { items, total, page, limit } and old array shape", () => {
    // 1. New object contract shape
    const objectResponse = {
      items: [{ id: "1" }, { id: "2" }],
      total: 42,
      page: 2,
      limit: 20,
    };
    const parsedObject = parseListResponse(objectResponse);
    expect(parsedObject.items).toEqual([{ id: "1" }, { id: "2" }]);
    expect(parsedObject.total).toBe(42);
    expect(parsedObject.page).toBe(2);
    expect(parsedObject.limit).toBe(20);

    // 2. Legacy direct array shape
    const arrayResponse = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const parsedArray = parseListResponse(arrayResponse, 1, 50);
    expect(parsedArray.items).toEqual([{ id: "a" }, { id: "b" }, { id: "c" }]);
    expect(parsedArray.total).toBe(3);
    expect(parsedArray.page).toBe(1);
    expect(parsedArray.limit).toBe(50);
  });
});
