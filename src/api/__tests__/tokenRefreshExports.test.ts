import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setTokens,
  getTokens,
  clearTokens,
  refreshAccessToken,
  hasSessionHint,
  setSessionHint,
  clearSessionHint,
} from "@/api/tokens";
import { realtimeClient } from "@/features/connect/services/realtimeClient";

describe("Token Refresh & Export Integrity", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearTokens();
    clearSessionHint();
  });

  it("exports refreshAccessToken and token functions as named exports from @/api/tokens", () => {
    expect(typeof refreshAccessToken).toBe("function");
    expect(typeof getAccessToken).toBe("function");
    expect(typeof setAccessToken).toBe("function");
    expect(typeof getRefreshToken).toBe("function");
    expect(typeof setRefreshToken).toBe("function");
    expect(typeof getTokens).toBe("function");
    expect(typeof setTokens).toBe("function");
    expect(typeof clearTokens).toBe("function");
  });

  it("successfully refreshes token and updates in-memory access and refresh tokens", async () => {
    setSessionHint();
    setTokens({ accessToken: "old-token", refreshToken: "old-refresh" });

    vi.spyOn(axios, "post").mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          access_token: "refreshed-access-token",
          refresh_token: "refreshed-refresh-token",
        },
      },
    });

    const token = await refreshAccessToken();
    expect(token).toBe("refreshed-access-token");
    expect(getAccessToken()).toBe("refreshed-access-token");
    expect(getRefreshToken()).toBe("refreshed-refresh-token");
  });

  it("shares a single-flight in-flight promise when called concurrently from @/api/tokens", async () => {
    setSessionHint();
    let postCallCount = 0;

    vi.spyOn(axios, "post").mockImplementation(async () => {
      postCallCount++;
      await new Promise((r) => setTimeout(r, 50));
      return {
        status: 200,
        data: {
          data: {
            access_token: "concurrency-token",
          },
        },
      };
    });

    const results = await Promise.all([
      refreshAccessToken(),
      refreshAccessToken(),
      refreshAccessToken(),
    ]);

    expect(results).toEqual([
      "concurrency-token",
      "concurrency-token",
      "concurrency-token",
    ]);
    expect(postCallCount).toBe(1);
  });

  it("realtimeClient can access getAccessToken and has a valid instance", () => {
    expect(realtimeClient).toBeDefined();
    expect(typeof realtimeClient.connect).toBe("function");
    expect(typeof realtimeClient.disconnect).toBe("function");
  });
});
