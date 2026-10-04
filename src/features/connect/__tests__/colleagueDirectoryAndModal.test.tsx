import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { connectApi, clearColleaguesCache, extractListFromResponse } from "../connectApi";
import { ColleagueSearchModal } from "../components/ColleagueSearchModal";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Connect Directory & ColleagueSearchModal", () => {
  beforeEach(() => {
    clearColleaguesCache();
    vi.clearAllMocks();
  });

  describe("getColleagues() & extractListFromResponse() Shape Variants", () => {
    it("extracts from raw array [...]", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json([
            { user_id: "u-raw-1", full_name: "Raw Colleague" },
          ]);
        })
      );

      const result = await connectApi.getColleagues();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("u-raw-1");
      expect(result[0].name).toBe("Raw Colleague");
    });

    it("extracts from { items: [...] }", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json({
            items: [{ user_id: "u-items-1", full_name: "Items Colleague" }],
          });
        })
      );

      const result = await connectApi.getColleagues();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("u-items-1");
      expect(result[0].name).toBe("Items Colleague");
    });

    it("extracts from { data: [...] }", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json({
            data: [{ user_id: "u-data-1", full_name: "Data Colleague" }],
          });
        })
      );

      const result = await connectApi.getColleagues();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("u-data-1");
      expect(result[0].name).toBe("Data Colleague");
    });

    it("extracts from { colleagues: [...] }", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json({
            colleagues: [{ user_id: "u-col-1", full_name: "Colleague Object" }],
          });
        })
      );

      const result = await connectApi.getColleagues();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("u-col-1");
      expect(result[0].name).toBe("Colleague Object");
    });

    it("extracts from { users: [...] }", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json({
            users: [{ user_id: "u-usr-1", full_name: "User Object" }],
          });
        })
      );

      const result = await connectApi.getColleagues();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("u-usr-1");
      expect(result[0].name).toBe("User Object");
    });

    it("extracts from { results: [...] }", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json({
            results: [{ user_id: "u-res-1", full_name: "Results Colleague" }],
          });
        })
      );

      const result = await connectApi.getColleagues();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("u-res-1");
      expect(result[0].name).toBe("Results Colleague");
    });

    it("handles authentic empty list [] (200 OK)", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json([]);
        })
      );

      const result = await connectApi.getColleagues();
      expect(result).toEqual([]);
    });

    it("throws on 403 Forbidden with response status", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json(
            { message: "Access denied to colleague directory" },
            { status: 403 }
          );
        })
      );

      await expect(connectApi.getColleagues()).rejects.toThrow();
    });

    it("throws on 500 Internal Server Error", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json(
            { detail: "Internal database connection failure" },
            { status: 500 }
          );
        })
      );

      await expect(connectApi.getColleagues()).rejects.toThrow();
    });

    it("throws Unexpected response error when response does not contain any list", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json({
            status_code: 200,
            some_arbitrary_key: "not-a-list",
          });
        })
      );

      await expect(connectApi.getColleagues()).rejects.toThrow(
        /Unexpected response shape/
      );
    });

    it("extractListFromResponse DEV warning prints ONLY top-level key names (no values/PII)", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const payload = {
        data: {
          items: [{ user_id: "u-safe" }],
        },
        sensitive_token: "secret_value_123",
        user_phone: "9999999999",
      };

      const list = extractListFromResponse(payload, "/api/v1/connect/colleagues");
      expect(list).toHaveLength(1);

      expect(warnSpy).toHaveBeenCalled();
      const warnArgs = warnSpy.mock.calls[0];
      expect(warnArgs[0]).toContain("/api/v1/connect/colleagues");
      // Check that only keys are passed: ["data", "sensitive_token", "user_phone"]
      expect(warnArgs[1]).toEqual(["data", "sensitive_token", "user_phone"]);
      // Confirm sensitive values are NOT in the warn call
      expect(JSON.stringify(warnArgs)).not.toContain("secret_value_123");
      expect(JSON.stringify(warnArgs)).not.toContain("9999999999");
    });
  });

  describe("ColleagueSearchModal Component States", () => {
    it("renders loading state when fetching colleagues", async () => {
      let resolvePromise: (val: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      server.use(
        http.get("*/api/v1/connect/colleagues", async () => {
          await pendingPromise;
          return HttpResponse.json([]);
        })
      );

      render(
        <ColleagueSearchModal open={true} onOpenChange={vi.fn()} />
      );

      expect(screen.getByText(/Loading colleagues/i)).toBeInTheDocument();
      resolvePromise!(null);
      await waitFor(() => {
        expect(screen.queryByText(/Loading colleagues/i)).not.toBeInTheDocument();
      });
    });

    it("renders error state with status, message, and Retry button on API failure", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json(
            { detail: "Directory service unavailable" },
            { status: 503 }
          );
        })
      );

      render(
        <ColleagueSearchModal open={true} onOpenChange={vi.fn()} />
      );

      await waitFor(() => {
        expect(screen.getByTestId("colleagues-error")).toBeInTheDocument();
      });

      expect(screen.getByText(/Failed to load directory/i)).toBeInTheDocument();
      expect(screen.getByText(/503/)).toBeInTheDocument();
      expect(screen.getByText(/Directory service unavailable/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
    });

    it("allows retrying from error state and renders colleagues when retry succeeds", async () => {
      let failFirst = true;

      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          if (failFirst) {
            failFirst = false;
            return HttpResponse.json({ message: "Network flaked" }, { status: 500 });
          }
          return HttpResponse.json([
            { user_id: "retry-user", full_name: "Recovered Colleague", email: "rec@aurix.local" },
          ]);
        })
      );

      render(
        <ColleagueSearchModal open={true} onOpenChange={vi.fn()} />
      );

      // Verify initial error
      await waitFor(() => {
        expect(screen.getByTestId("colleagues-error")).toBeInTheDocument();
      });

      // Click Retry
      fireEvent.click(screen.getByRole("button", { name: /Retry/i }));

      // Verify recovery
      await waitFor(() => {
        expect(screen.getByText("Recovered Colleague")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("colleagues-error")).not.toBeInTheDocument();
    });

    it("renders empty state only when API returns 2xx with an empty list", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json([]);
        })
      );

      render(
        <ColleagueSearchModal open={true} onOpenChange={vi.fn()} />
      );

      await waitFor(() => {
        expect(screen.getByTestId("colleagues-empty")).toBeInTheDocument();
      });
      expect(screen.getByText("No colleagues found.")).toBeInTheDocument();
      expect(screen.queryByTestId("colleagues-error")).not.toBeInTheDocument();
    });

    it("handleStartDm shows toast.error and keeps modal open when createConversation fails", async () => {
      const handleOpenChange = vi.fn();

      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json([
            { user_id: "dm-target", full_name: "Target Peer", email: "target@aurix.local" },
          ]);
        }),
        http.get("*/api/v1/connect/conversations", () => {
          return HttpResponse.json({ data: [] });
        }),
        http.post("*/api/v1/connect/conversations", () => {
          return HttpResponse.json(
            { detail: "Cannot create conversation with inactive user" },
            { status: 400 }
          );
        })
      );

      render(
        <ColleagueSearchModal open={true} onOpenChange={handleOpenChange} />
      );

      await waitFor(() => {
        expect(screen.getByText("Target Peer")).toBeInTheDocument();
      });

      // Click chat button to start DM
      const chatBtn = screen.getByRole("button", { name: /Chat/i });
      fireEvent.click(chatBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining("Cannot create conversation with inactive user")
        );
      });

      // Crucial: Modal was NOT closed on failure!
      expect(handleOpenChange).not.toHaveBeenCalledWith(false);
    });
  });
});
