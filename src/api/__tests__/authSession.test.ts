import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { toast } from "sonner";
import {
  refreshAccessToken,
  handleSessionExpired,
  resetSessionExpiredFlag,
} from "../apiInstance";
import {
  setTokens,
  getTokens,
  getAccessToken,
  clearTokens,
  setSessionHint,
  clearSessionHint,
  hasSessionHint,
  SESSION_HINT_KEY,
} from "../tokens";
import { bootstrapAuth, logout } from "@/lib/auth-bootstrap";
import { aurix } from "@/lib/aurix-store";
import { safeStorage } from "@/lib/safe-storage";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("F-01: Auth and Session Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearTokens();
    clearSessionHint();
    resetSessionExpiredFlag();
    aurix.set({ user: null, company: null, isRestoring: false });
    safeStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reload restores session with HttpOnly cookie mock", async () => {
    // Set hint as if previous session was active before reload
    setSessionHint();
    expect(hasSessionHint()).toBe(true);

    const postSpy = vi.spyOn(axios, "post").mockImplementation(async (url: string) => {
      if (url.includes("/auth/refresh")) {
        return {
          status: 200,
          data: {
            success: true,
            data: {
              access_token: "mock-access-token-123",
              token_type: "Bearer",
              expires_in: 900,
            },
          },
        };
      }
      return { status: 200, data: {} };
    });

    const token = await refreshAccessToken();

    expect(token).toBe("mock-access-token-123");
    expect(getAccessToken()).toBe("mock-access-token-123");
    // Verify it was called with withCredentials: true and empty body (since no in-memory refresh token existed)
    expect(postSpy).toHaveBeenCalledWith(
      expect.stringContaining("/auth/refresh"),
      {},
      expect.objectContaining({ withCredentials: true }),
    );
    expect(hasSessionHint()).toBe(true);
  });

  it("does not call refresh without session hint on boot", async () => {
    expect(hasSessionHint()).toBe(false);
    const postSpy = vi.spyOn(axios, "post");

    // bootstrapAuth checks hasSessionHint()
    await bootstrapAuth();

    // Refresh should NOT have been called
    expect(postSpy).not.toHaveBeenCalled();
    expect(aurix.get().user).toBeNull();
  });

  it("concurrent 401s share ONE single-flight refresh call", async () => {
    setSessionHint();

    let refreshCallCount = 0;
    vi.spyOn(axios, "post").mockImplementation(async (url: string) => {
      if (url.includes("/auth/refresh")) {
        refreshCallCount++;
        // Small delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {
          status: 200,
          data: {
            success: true,
            data: {
              access_token: "concurrent-fresh-token",
            },
          },
        };
      }
      return { status: 200, data: {} };
    });

    // Fire 3 simultaneous refresh calls
    const [token1, token2, token3] = await Promise.all([
      refreshAccessToken(),
      refreshAccessToken(),
      refreshAccessToken(),
    ]);

    expect(token1).toBe("concurrent-fresh-token");
    expect(token2).toBe("concurrent-fresh-token");
    expect(token3).toBe("concurrent-fresh-token");
    expect(refreshCallCount).toBe(1);
  });

  it("failed refresh logs user out cleanly and triggers session expired toast", async () => {
    setSessionHint();
    setTokens({ accessToken: "old-expired-token" });

    vi.spyOn(axios, "post").mockImplementation(async (url: string) => {
      if (url.includes("/auth/refresh")) {
        const error: any = new Error("Unauthorized");
        error.response = { status: 401, data: { detail: "Refresh token expired" } };
        throw error;
      }
      return { status: 200, data: {} };
    });

    await expect(refreshAccessToken()).rejects.toThrow("Failed to refresh session");

    // Hint and tokens must be cleared
    expect(hasSessionHint()).toBe(false);
    expect(getTokens()).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("Session expired. Please sign in again.");
  });

  it("logout clears session hint, tokens, and storage cleanly", async () => {
    setSessionHint();
    setTokens({ accessToken: "active-token" });
    expect(hasSessionHint()).toBe(true);

    vi.spyOn(axios, "post").mockResolvedValue({ status: 200, data: { success: true } });

    await logout({ redirect: false });

    expect(hasSessionHint()).toBe(false);
    expect(getTokens()).toBeNull();
    expect(safeStorage.getItem(SESSION_HINT_KEY)).toBeNull();
    expect(safeStorage.getItem("aurix:refresh_token")).toBeNull();
  });

  it("parseLoginResponse parses standard login response with access_token", async () => {
    const { parseLoginResponse } = await import("@/features/auth/utils/parseLoginResponse");

    const mockResponse = {
      data: {
        access_token: "jwt-access-token",
        refresh_token: "jwt-refresh-token",
        user: {
          id: "u-101",
          email: "hr@ofc360.com",
          name: "HR Admin",
          role: "hr_admin",
        },
      },
    };

    const result = parseLoginResponse(mockResponse);
    expect(result).not.toBeNull();
    expect(result?.status).toBe("authenticated");
    if (result?.status === "authenticated") {
      expect(result.accessToken).toBe("jwt-access-token");
      expect(result.refreshToken).toBe("jwt-refresh-token");
      expect(result.user.email).toBe("hr@ofc360.com");
    }
  });

  it("parseLoginResponse parses 200 OK verification_required challenge without throwing errors", async () => {
    const { parseLoginResponse } = await import("@/features/auth/utils/parseLoginResponse");

    // Case 1: Backend returns requires_verification flag
    const challengeRes1 = {
      requires_verification: true,
      message: "Verify your OFC360 login",
      data: {
        email: "unverified@company.com",
        user_id: "u-202",
      },
    };

    const result1 = parseLoginResponse(challengeRes1);
    expect(result1).not.toBeNull();
    expect(result1?.status).toBe("verification_required");
    if (result1?.status === "verification_required") {
      expect(result1.email).toBe("unverified@company.com");
      expect(result1.userId).toBe("u-202");
    }

    // Case 2: Backend returns status: "verification_required" with message
    const challengeRes2 = {
      status: "verification_required",
      detail: "Login requires email verification",
      email: "staff@company.com",
    };

    const result2 = parseLoginResponse(challengeRes2);
    expect(result2).not.toBeNull();
    expect(result2?.status).toBe("verification_required");
    if (result2?.status === "verification_required") {
      expect(result2.email).toBe("staff@company.com");
      expect(result2.message).toBe("Login requires email verification");
    }
  });
});
