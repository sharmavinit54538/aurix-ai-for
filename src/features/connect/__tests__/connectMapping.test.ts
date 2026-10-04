import { describe, it, expect, vi, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import {
  mapColleague,
  extractColleagueName,
  extractPresence,
  connectApi,
  clearColleaguesCache,
} from "../connectApi";
import { aurix } from "@/lib/aurix-store";

describe("Connect API - Colleague Mapping & Conversation Enrichment", () => {
  beforeEach(() => {
    clearColleaguesCache();
    vi.restoreAllMocks();
    // Configure current user in aurix store
    aurix.set({
      user: {
        id: "current-user-id",
        name: "Current User",
        email: "current@aurix.local",
        role: "admin",
      } as any,
    });
  });

  describe("mapColleague() & Name Fallback Chain", () => {
    it("maps full real backend colleague shape accurately", () => {
      const backendUser = {
        user_id: "user_789",
        full_name: "Priya Patel",
        email: "priya@example.com",
        presence_status: "online",
        avatar_url: "https://aurix.local/avatars/priya.png",
        department: "Product",
        designation: "Product Lead",
        last_active: "2026-10-04T08:00:00Z",
      };

      const colleague = mapColleague(backendUser);

      expect(colleague).toEqual({
        id: "user_789",
        name: "Priya Patel",
        email: "priya@example.com",
        presence: "online",
        avatar: "https://aurix.local/avatars/priya.png",
        department: "Product",
        designation: "Product Lead",
        lastActive: "2026-10-04T08:00:00Z",
      });
    });

    it("follows verified name fallback chain: full_name -> first_name+last_name -> display_name -> email -> Unnamed user", () => {
      // 1. full_name
      expect(
        extractColleagueName({
          full_name: "Rahul Verma",
          first_name: "Rahul",
          last_name: "V",
          email: "r@example.com",
        })
      ).toBe("Rahul Verma");

      // 2. first_name + last_name
      expect(
        extractColleagueName({
          first_name: "Vikram",
          last_name: "Singh",
          email: "vikram@example.com",
        })
      ).toBe("Vikram Singh");

      // 3. first_name only
      expect(
        extractColleagueName({
          first_name: "Anjali",
          email: "anjali@example.com",
        })
      ).toBe("Anjali");

      // 4. display_name
      expect(
        extractColleagueName({
          display_name: "DevGuru",
          email: "guru@example.com",
        })
      ).toBe("DevGuru");

      // 5. email fallback
      expect(
        extractColleagueName({
          email: "engineering-lead@aurix.local",
        })
      ).toBe("engineering-lead@aurix.local");

      // 6. Complete absence of name/email -> "Unnamed user" (never "Unknown Colleague")
      expect(
        extractColleagueName({
          user_id: "anon-42",
        })
      ).toBe("Unnamed user");
    });

    it("logs console.warn with ONLY key names in DEV mode when name is completely missing", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const payload = {
        user_id: "secret-id-99",
        arbitrary_custom_field: "sensitive_val",
      };

      const name = extractColleagueName(payload);

      expect(name).toBe("Unnamed user");
      expect(warnSpy).toHaveBeenCalled();
      const warnArgs = warnSpy.mock.calls[0];
      // Check that only keys are printed, not the sensitive value
      expect(warnArgs[0]).toContain("[Connect]");
      expect(warnArgs[1]).toEqual(["user_id", "arbitrary_custom_field"]);
    });

    it("ignores legacy 'Unknown Colleague' string if returned by backend and falls back to email or Unnamed user", () => {
      expect(
        extractColleagueName({
          name: "Unknown Colleague",
          email: "real-email@example.com",
        })
      ).toBe("real-email@example.com");

      expect(
        extractColleagueName({
          name: "Unknown Colleague",
        })
      ).toBe("Unnamed user");
    });
  });

  describe("extractPresence() mapping", () => {
    it("maps verified status values properly", () => {
      expect(extractPresence({ presence_status: "online" })).toBe("online");
      expect(extractPresence({ presenceStatus: "away" })).toBe("away");
      expect(extractPresence({ presence: "offline" })).toBe("offline");
      expect(extractPresence({ status: "ONLINE" })).toBe("online");
    });

    it("returns undefined for unknown, null, or missing presence (never defaults to offline)", () => {
      expect(extractPresence({ presence_status: "busy" })).toBeUndefined();
      expect(extractPresence({ presence_status: null })).toBeUndefined();
      expect(extractPresence({})).toBeUndefined();
      expect(extractPresence(undefined)).toBeUndefined();
    });
  });

  describe("listConversations() & Peer Resolution", () => {
    it("excludes current user from participants array to find peer participant", async () => {
      server.use(
        http.get("*/api/v1/connect/conversations", () => {
          return HttpResponse.json({
            success: true,
            data: [
              {
                id: "conv-1",
                participants: [
                  {
                    user_id: "current-user-id",
                    full_name: "Current User",
                    presence_status: "online",
                  },
                  {
                    user_id: "peer-user-2",
                    full_name: "Sneha Roy",
                    presence_status: "away",
                    avatar_url: "https://aurix.local/avatar-sneha.png",
                  },
                ],
                last_message: {
                  id: "msg-1",
                  content: "Hey there!",
                  created_at: "2026-10-04T08:15:00Z",
                },
                unread_count: 2,
                updated_at: "2026-10-04T08:15:00Z",
              },
            ],
          });
        })
      );

      const convs = await connectApi.listConversations();

      expect(convs).toHaveLength(1);
      expect(convs[0].participant.id).toBe("peer-user-2");
      expect(convs[0].participant.name).toBe("Sneha Roy");
      expect(convs[0].participant.presence).toBe("away");
      expect(convs[0].participant.avatar).toBe("https://aurix.local/avatar-sneha.png");
      expect(convs[0].lastMessage?.content).toBe("Hey there!");
      expect(convs[0].unreadCount).toBe(2);
    });

    it("enriches participant name and avatar from /api/v1/connect/colleagues cache when conversation only provides user_id", async () => {
      server.use(
        http.get("*/api/v1/connect/colleagues", () => {
          return HttpResponse.json({
            success: true,
            data: [
              {
                user_id: "id-only-peer",
                full_name: "Karan Malhotra",
                email: "karan@aurix.local",
                presence_status: "online",
                avatar_url: "https://aurix.local/avatar-karan.png",
              },
            ],
          });
        }),
        http.get("*/api/v1/connect/conversations", () => {
          return HttpResponse.json({
            success: true,
            data: [
              {
                id: "conv-stub-peer",
                participants: [
                  {
                    user_id: "current-user-id",
                  },
                  {
                    user_id: "id-only-peer",
                    // Name and presence missing in conversation response
                  },
                ],
                updated_at: "2026-10-04T08:20:00Z",
              },
            ],
          });
        })
      );

      const convs = await connectApi.listConversations();

      expect(convs).toHaveLength(1);
      expect(convs[0].participant.id).toBe("id-only-peer");
      expect(convs[0].participant.name).toBe("Karan Malhotra");
      expect(convs[0].participant.email).toBe("karan@aurix.local");
      expect(convs[0].participant.presence).toBe("online");
      expect(convs[0].participant.avatar).toBe("https://aurix.local/avatar-karan.png");
    });

    it("deduplicates conversations by participant.id keeping the newest conversation", async () => {
      server.use(
        http.get("*/api/v1/connect/conversations", () => {
          return HttpResponse.json({
            success: true,
            data: [
              {
                id: "conv-older",
                participants: [
                  {
                    user_id: "same-peer",
                    full_name: "Same Colleague",
                  },
                ],
                updated_at: "2026-10-04T07:00:00Z",
                last_message: {
                  id: "msg-old",
                  content: "Older message",
                  created_at: "2026-10-04T07:00:00Z",
                },
              },
              {
                id: "conv-newer",
                participants: [
                  {
                    user_id: "same-peer",
                    full_name: "Same Colleague",
                  },
                ],
                updated_at: "2026-10-04T08:00:00Z",
                last_message: {
                  id: "msg-new",
                  content: "Newer message",
                  created_at: "2026-10-04T08:00:00Z",
                },
              },
            ],
          });
        })
      );

      const convs = await connectApi.listConversations();

      expect(convs).toHaveLength(1);
      expect(convs[0].id).toBe("conv-newer");
      expect(convs[0].lastMessage?.content).toBe("Newer message");
    });
  });

  describe("Channel Members & Unified Search Mapping", () => {
    it("getChannelMembers maps member shapes using mapColleague", async () => {
      server.use(
        http.get("*/api/v1/connect/channels/:channelId/members", () => {
          return HttpResponse.json({
            success: true,
            data: [
              {
                user_id: "member-1",
                full_name: "Deepak Joshi",
                avatar_url: "https://aurix.local/deepak.png",
                role: "owner",
                joined_at: "2026-09-01T00:00:00Z",
              },
            ],
          });
        })
      );

      const members = await connectApi.getChannelMembers("chan-1");
      expect(members).toEqual([
        {
          userId: "member-1",
          name: "Deepak Joshi",
          avatar: "https://aurix.local/deepak.png",
          role: "owner",
          joinedAt: "2026-09-01T00:00:00Z",
        },
      ]);
    });

    it("unifiedSearch correctly maps colleagues and users using mapColleague", async () => {
      server.use(
        http.get("*/api/v1/connect/search", () => {
          return HttpResponse.json({
            success: true,
            data: {
              colleagues: [
                {
                  user_id: "u-search-1",
                  full_name: "Rohit Sharma",
                  presence_status: "online",
                },
              ],
            },
          });
        })
      );

      const result = await connectApi.unifiedSearch("Rohit");
      const colleagues = result.colleagues as any[];
      expect(colleagues).toBeDefined();
      expect(colleagues[0].id).toBe("u-search-1");
      expect(colleagues[0].name).toBe("Rohit Sharma");
      expect(colleagues[0].presence).toBe("online");
    });
  });
});
