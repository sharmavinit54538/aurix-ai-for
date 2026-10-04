import apiInstance from "@/api/apiInstance";
import { aurix } from "@/lib/aurix-store";
import type {
  Channel,
  ChannelCreateInput,
  ChannelMember,
  ChannelUpdateInput,
  Colleague,
  ConnectNotification,
  DirectConversation,
  IceServerConfig,
  MeetingChatMessage,
  MeetingCreateInput,
  MeetingSession,
  Message,
  MessageAttachment,
  MessageSendInput,
  PresenceStatus,
  SignalPayload,
  SoundSettings,
} from "./types";

/**
 * Normalizes an API response envelope.
 * Unwraps `res.data.data` or `res.data` safely.
 */
function unwrapData<T>(res: unknown): T {
  const r = res as { data?: { data?: unknown } | unknown };
  if (r?.data && typeof r.data === "object" && "data" in (r.data as object)) {
    return (r.data as { data: T }).data;
  }
  if (r?.data !== undefined) return r.data as T;
  return res as T;
}

// ─────────────────────────────────────────────────────────────
// Colleague & Presence Mapping Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Verified name fallback chain:
 * full_name -> fullName -> name -> first_name + last_name -> display_name -> email -> "Unnamed user"
 * In DEV, warns with key names only when no name or email could be found.
 */
export function extractColleagueName(u: Record<string, unknown> | null | undefined): string {
  if (!u) {
    if (import.meta.env.DEV) {
      console.warn("[Connect] Colleague missing, empty payload");
    }
    return "Unnamed user";
  }

  // 1. full_name / fullName / name (excluding legacy fallback "Unknown Colleague")
  const fullName = typeof u.full_name === "string" ? u.full_name.trim() : "";
  if (fullName) return fullName;

  const camelFullName = typeof u.fullName === "string" ? u.fullName.trim() : "";
  if (camelFullName) return camelFullName;

  const rawName = typeof u.name === "string" ? u.name.trim() : "";
  if (rawName && rawName !== "Unknown Colleague") return rawName;

  // 2. first_name + last_name
  const firstName =
    typeof u.first_name === "string"
      ? u.first_name.trim()
      : typeof u.firstName === "string"
      ? u.firstName.trim()
      : "";
  const lastName =
    typeof u.last_name === "string"
      ? u.last_name.trim()
      : typeof u.lastName === "string"
      ? u.lastName.trim()
      : "";
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;

  // 3. display_name / displayName
  const displayName =
    typeof u.display_name === "string"
      ? u.display_name.trim()
      : typeof u.displayName === "string"
      ? u.displayName.trim()
      : "";
  if (displayName) return displayName;

  // 4. email / user_email
  const email =
    typeof u.email === "string"
      ? u.email.trim()
      : typeof u.user_email === "string"
      ? u.user_email.trim()
      : "";
  if (email) return email;

  // 5. Fallback: log keys only in DEV mode
  if (import.meta.env.DEV) {
    console.warn("[Connect] Colleague missing name, available keys:", Object.keys(u));
  }
  return "Unnamed user";
}

/**
 * Extracts presence status from verified backend keys:
 * presence_status | presenceStatus | presence | status.
 * If unknown or not provided, returns undefined (never defaults to "offline").
 */
export function extractPresence(u: Record<string, unknown> | null | undefined): PresenceStatus | undefined {
  if (!u) return undefined;
  const raw = String(
    u.presence_status || u.presenceStatus || u.presence || u.status || ""
  )
    .toLowerCase()
    .trim();

  if (raw === "online") return "online";
  if (raw === "away") return "away";
  if (raw === "offline") return "offline";
  return undefined;
}

/**
 * Canonical colleague mapper from backend shapes.
 */
export function mapColleague(u: Record<string, unknown> | null | undefined): Colleague {
  const safeObj = u || {};
  const id = String(safeObj.user_id || safeObj.userId || safeObj.id || "");
  const name = extractColleagueName(safeObj);
  const email = String(safeObj.email || safeObj.user_email || safeObj.userEmail || "");
  const department = (safeObj.department || safeObj.dept || null) as string | null;
  const designation = (safeObj.designation || safeObj.title || safeObj.role || null) as string | null;
  const avatar = (safeObj.avatar || safeObj.avatar_url || safeObj.avatarUrl || safeObj.profile_picture || null) as string | null;
  const presence = extractPresence(safeObj);
  const lastActive = (safeObj.last_active || safeObj.lastActive || null) as string | null;

  return {
    id,
    name,
    email,
    department,
    designation,
    avatar,
    presence,
    lastActive,
  };
}

// ── In-Memory Colleagues Directory Cache ───────────────────────
let colleaguesCache: Map<string, Colleague> | null = null;
let colleaguesPromise: Promise<Map<string, Colleague>> | null = null;

export function clearColleaguesCache(): void {
  colleaguesCache = null;
  colleaguesPromise = null;
}

export async function getColleaguesCacheMap(): Promise<Map<string, Colleague>> {
  if (colleaguesCache) return colleaguesCache;
  if (colleaguesPromise) return colleaguesPromise;

  colleaguesPromise = (async () => {
    try {
      const list = await connectApi.getColleagues();
      const map = new Map<string, Colleague>();
      for (const c of list) {
        if (c.id) {
          map.set(String(c.id), c);
        }
      }
      colleaguesCache = map;
      return map;
    } catch {
      return new Map<string, Colleague>();
    } finally {
      colleaguesPromise = null;
    }
  })();

  return colleaguesPromise;
}

/**
 * Extracts the other peer participant from a conversation payload,
 * filtering out the current user when a participants list is provided.
 */
export function extractPeerParticipant(
  c: Record<string, unknown>,
  currentUserId: string | null
): Record<string, unknown> {
  // 1. If participants array is provided
  if (Array.isArray(c.participants) && c.participants.length > 0) {
    if (currentUserId) {
      const nonSelf = c.participants.find((p: unknown) => {
        if (!p || typeof p !== "object") return false;
        const pObj = p as Record<string, unknown>;
        const pId = String(pObj.user_id || pObj.userId || pObj.id || "");
        return pId && pId !== currentUserId;
      });
      if (nonSelf && typeof nonSelf === "object") {
        return nonSelf as Record<string, unknown>;
      }
    }
    // If no other user found (or self-conversation), take first participant
    const first = c.participants[0];
    if (first && typeof first === "object") {
      return first as Record<string, unknown>;
    }
  }

  // 2. Direct object candidates
  const candidate =
    c.participant ||
    c.recipient ||
    c.other_user ||
    c.otherUser ||
    c.target_user ||
    c.targetUser ||
    c.user;
  if (candidate && typeof candidate === "object") {
    return candidate as Record<string, unknown>;
  }

  // 3. Fallback: conversation itself might contain participant / recipient ID
  const stubId = String(
    c.recipient_id ||
    c.recipientId ||
    c.user_id ||
    c.userId ||
    c.participant_id ||
    c.participantId ||
    ""
  );

  return stubId ? { id: stubId } : {};
}

// ─────────────────────────────────────────────────────────────
// Connect API Service (100% Contract-backed)
// ─────────────────────────────────────────────────────────────

export const connectApi = {
  // ── Channels ───────────────────────────────────────────────

  async listChannels(params?: { type?: string; page?: number; limit?: number }): Promise<Channel[]> {
    const res = await apiInstance.get("/api/v1/connect/channels", { params });
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    return items
      .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === "object"))
      .map((c) => ({
        id: String(c.id),
        name: (c.name as string) || "Untitled Channel",
        description: (c.description as string) ?? null,
        topic: (c.topic as string) ?? null,
        isPrivate: Boolean(c.is_private ?? c.isPrivate),
        memberCount: Number(c.member_count ?? c.members_count ?? c.memberCount ?? 0),
        unreadCount: Number(c.unread_count ?? c.unreadCount ?? 0),
        createdAt: (c.created_at ?? c.createdAt) as string | undefined,
        updatedAt: (c.updated_at ?? c.updatedAt) as string | undefined,
      }));
  },

  async createChannel(input: ChannelCreateInput): Promise<Channel> {
    const res = await apiInstance.post("/api/v1/connect/channels", {
      name: input.name,
      description: input.description,
      topic: input.topic,
      is_private: input.isPrivate ?? false,
      member_ids: input.memberIds || [],
    });
    const c = unwrapData<Record<string, unknown>>(res) || {};
    return {
      id: String(c.id),
      name: (c.name as string) || input.name,
      description: (c.description as string) ?? null,
      topic: (c.topic as string) ?? null,
      isPrivate: Boolean(c.is_private ?? c.isPrivate),
      memberCount: Number(c.member_count ?? c.memberCount ?? 1),
      unreadCount: 0,
      createdAt: (c.created_at ?? c.createdAt) as string | undefined,
      updatedAt: (c.updated_at ?? c.updatedAt) as string | undefined,
    };
  },

  async getChannel(channelId: string): Promise<Channel> {
    const res = await apiInstance.get(`/api/v1/connect/channels/${channelId}`);
    const c = unwrapData<Record<string, unknown>>(res) || {};
    return {
      id: String(c.id),
      name: (c.name as string) || "",
      description: (c.description as string) ?? null,
      topic: (c.topic as string) ?? null,
      isPrivate: Boolean(c.is_private ?? c.isPrivate),
      memberCount: Number(c.member_count ?? c.memberCount ?? 0),
      unreadCount: Number(c.unread_count ?? c.unreadCount ?? 0),
      createdAt: (c.created_at ?? c.createdAt) as string | undefined,
      updatedAt: (c.updated_at ?? c.updatedAt) as string | undefined,
    };
  },

  async updateChannel(channelId: string, input: ChannelUpdateInput): Promise<Channel> {
    const res = await apiInstance.patch(`/api/v1/connect/channels/${channelId}`, {
      name: input.name,
      description: input.description,
      topic: input.topic,
      is_private: input.isPrivate,
    });
    const c = unwrapData<Record<string, unknown>>(res) || {};
    return {
      id: String(c.id),
      name: (c.name as string) || "",
      description: (c.description as string) ?? null,
      topic: (c.topic as string) ?? null,
      isPrivate: Boolean(c.is_private ?? c.isPrivate),
      memberCount: Number(c.member_count ?? c.memberCount ?? 0),
      unreadCount: 0,
      createdAt: (c.created_at ?? c.createdAt) as string | undefined,
      updatedAt: (c.updated_at ?? c.updatedAt) as string | undefined,
    };
  },

  async deleteChannel(channelId: string): Promise<void> {
    await apiInstance.delete(`/api/v1/connect/channels/${channelId}`);
  },

  async getChannelMembers(channelId: string): Promise<ChannelMember[]> {
    const res = await apiInstance.get(`/api/v1/connect/channels/${channelId}/members`);
    const raw = unwrapData<unknown>(res);
    const list = Array.isArray(raw)
      ? raw
      : (raw as { items?: unknown[]; members?: unknown[] })?.items ||
        (raw as { members?: unknown[] })?.members ||
        [];
    return list
      .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === "object"))
      .map((m) => {
        const colleague = mapColleague(m);
        return {
          userId: colleague.id,
          name: colleague.name,
          avatar: colleague.avatar,
          role: (m.role as "owner" | "admin" | "member") || "member",
          joinedAt: (m.joined_at ?? m.joinedAt) as string | undefined,
        };
      });
  },

  async addChannelMembers(channelId: string, userIds: string[]): Promise<void> {
    await apiInstance.post(`/api/v1/connect/channels/${channelId}/members`, {
      user_ids: userIds,
    });
  },

  async removeChannelMember(channelId: string, userId: string): Promise<void> {
    await apiInstance.delete(`/api/v1/connect/channels/${channelId}/members/${userId}`);
  },

  async leaveChannel(channelId: string): Promise<void> {
    await apiInstance.post(`/api/v1/connect/channels/${channelId}/leave`);
  },

  async archiveChannel(channelId: string): Promise<void> {
    await apiInstance.patch(`/api/v1/connect/channels/${channelId}/archive`);
  },

  async getChannelMessages(
    channelId: string,
    params?: { limit?: number; before?: string; cursor?: string }
  ): Promise<{ items: Message[]; hasMore: boolean }> {
    const res = await apiInstance.get(`/api/v1/connect/channels/${channelId}/messages`, { params });
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    const validItems = items
      .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === "object"))
      .map(mapMessage);
    const hasMore = Boolean(
      (raw as { has_more?: boolean; hasMore?: boolean })?.has_more ??
      (raw as { has_more?: boolean; hasMore?: boolean })?.hasMore ??
      validItems.length >= (params?.limit || 50)
    );
    return {
      items: validItems,
      hasMore,
    };
  },

  async sendChannelMessage(channelId: string, input: MessageSendInput): Promise<Message> {
    const res = await apiInstance.post(`/api/v1/connect/channels/${channelId}/messages`, {
      content: input.content,
      attachments: input.attachments || [],
      mentions: input.mentions || [],
    });
    return mapMessage(unwrapData<Record<string, unknown>>(res));
  },

  // ── Direct Conversations ───────────────────────────────────

  async listConversations(): Promise<DirectConversation[]> {
    const res = await apiInstance.get("/api/v1/connect/conversations");
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw)
      ? raw
      : (raw as { items?: unknown[] })?.items || [];

    const currentUserId = aurix.get().user?.id ? String(aurix.get().user?.id) : null;
    const parsedConvs: DirectConversation[] = [];
    let needsCacheLookup = false;

    for (const rawItem of items) {
      if (!rawItem || typeof rawItem !== "object") continue;
      const c = rawItem as Record<string, unknown>;
      const peerRaw = extractPeerParticipant(c, currentUserId);
      const participant = mapColleague(peerRaw);

      if (
        participant.id &&
        (participant.name === "Unnamed user" || !participant.name || participant.name === participant.id)
      ) {
        needsCacheLookup = true;
      }

      const lastMsgRaw = (c.last_message || c.lastMessage) as Record<string, unknown> | undefined;
      const lastMessage = lastMsgRaw
        ? {
            content: String(lastMsgRaw.content || ""),
            createdAt: String(lastMsgRaw.created_at || lastMsgRaw.createdAt || ""),
            senderId: lastMsgRaw.sender_id
              ? String(lastMsgRaw.sender_id)
              : lastMsgRaw.senderId
              ? String(lastMsgRaw.senderId)
              : undefined,
          }
        : null;

      parsedConvs.push({
        id: String(c.id || ""),
        participant,
        lastMessage,
        unreadCount: Number(c.unread_count ?? c.unreadCount ?? 0),
        updatedAt: (c.updated_at || c.updatedAt) as string | undefined,
      });
    }

    // Enrich missing names from colleagues directory cache if needed
    if (needsCacheLookup) {
      const cacheMap = await getColleaguesCacheMap();
      for (const conv of parsedConvs) {
        if (
          conv.participant.id &&
          (conv.participant.name === "Unnamed user" || !conv.participant.name || conv.participant.name === conv.participant.id)
        ) {
          const cached = cacheMap.get(conv.participant.id);
          if (cached) {
            conv.participant.name = cached.name;
            if (!conv.participant.email && cached.email) conv.participant.email = cached.email;
            if (!conv.participant.avatar && cached.avatar) conv.participant.avatar = cached.avatar;
            if (!conv.participant.department && cached.department) conv.participant.department = cached.department;
            if (!conv.participant.designation && cached.designation) conv.participant.designation = cached.designation;
            if (!conv.participant.presence && cached.presence) conv.participant.presence = cached.presence;
          }
        }
      }
    }

    // Deduplicate conversations by participant.id: keep most recent activity
    parsedConvs.sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });

    const deduplicated: DirectConversation[] = [];
    const seenParticipantIds = new Set<string>();

    for (const conv of parsedConvs) {
      const pId = conv.participant.id;
      if (pId) {
        if (seenParticipantIds.has(pId)) {
          continue;
        }
        seenParticipantIds.add(pId);
      }
      deduplicated.push(conv);
    }

    return deduplicated;
  },

  async createConversation(recipientId: string): Promise<DirectConversation> {
    const res = await apiInstance.post("/api/v1/connect/conversations", {
      recipient_id: recipientId,
    });
    const c = unwrapData<Record<string, unknown>>(res) || {};
    const currentUserId = aurix.get().user?.id ? String(aurix.get().user?.id) : null;
    const peerRaw = extractPeerParticipant(c, currentUserId);
    if (!peerRaw.id && !peerRaw.user_id && !peerRaw.userId) {
      peerRaw.id = recipientId;
    }

    let participant = mapColleague(peerRaw);
    if (
      participant.id &&
      (participant.name === "Unnamed user" || !participant.name || participant.name === participant.id)
    ) {
      const cacheMap = await getColleaguesCacheMap();
      const cached = cacheMap.get(participant.id);
      if (cached) {
        participant = { ...cached };
      }
    }

    return {
      id: String(c.id || ""),
      participant,
      lastMessage: null,
      unreadCount: 0,
      updatedAt: (c.updated_at || c.updatedAt) as string | undefined,
    };
  },

  async getConversationMessages(
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<{ items: Message[]; hasMore: boolean }> {
    const res = await apiInstance.get(`/api/v1/connect/conversations/${conversationId}/messages`, { params });
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    const validItems = items
      .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === "object"))
      .map(mapMessage);
    const hasMore = Boolean(
      (raw as { has_more?: boolean; hasMore?: boolean })?.has_more ??
      (raw as { has_more?: boolean; hasMore?: boolean })?.hasMore ??
      validItems.length >= (params?.limit || 50)
    );
    return {
      items: validItems,
      hasMore,
    };
  },

  async sendConversationMessage(conversationId: string, input: MessageSendInput): Promise<Message> {
    const res = await apiInstance.post(`/api/v1/connect/conversations/${conversationId}/messages`, {
      content: input.content,
      attachments: input.attachments || [],
      mentions: input.mentions || [],
    });
    return mapMessage(unwrapData<Record<string, unknown>>(res));
  },

  // ── Message Operations ─────────────────────────────────────

  async toggleReaction(messageId: string, emoji: string): Promise<void> {
    await apiInstance.post(`/api/v1/connect/messages/${messageId}/reactions`, { emoji });
  },

  async pinMessage(messageId: string, isPinned: boolean): Promise<void> {
    await apiInstance.patch(`/api/v1/connect/messages/${messageId}/pin`, {
      is_pinned: isPinned,
    });
  },

  async deleteMessage(messageId: string): Promise<void> {
    await apiInstance.delete(`/api/v1/connect/messages/${messageId}`);
  },

  async getMessageThread(parentMessageId: string): Promise<Message[]> {
    const res = await apiInstance.get(`/api/v1/connect/messages/${parentMessageId}/thread`);
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    return items
      .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === "object"))
      .map(mapMessage);
  },

  async postThreadReply(parentMessageId: string, content: string): Promise<Message> {
    const res = await apiInstance.post(`/api/v1/connect/messages/${parentMessageId}/thread`, {
      content,
    });
    return mapMessage(unwrapData<Record<string, unknown>>(res));
  },

  // ── Colleagues & Search ────────────────────────────────────

  async getColleagues(): Promise<Colleague[]> {
    const res = await apiInstance.get("/api/v1/connect/colleagues");
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    const colleagues = items
      .filter((u): u is Record<string, unknown> => Boolean(u && typeof u === "object"))
      .map(mapColleague);

    // Prime the colleagues cache
    if (!colleaguesCache) {
      colleaguesCache = new Map<string, Colleague>();
    }
    for (const col of colleagues) {
      if (col.id) {
        colleaguesCache.set(String(col.id), col);
      }
    }

    return colleagues;
  },

  async unifiedSearch(q: string, type?: string): Promise<Record<string, unknown>> {
    const res = await apiInstance.get("/api/v1/connect/search", { params: { q, type } });
    const data = unwrapData<Record<string, unknown>>(res);
    if (data && typeof data === "object") {
      if (Array.isArray(data.colleagues)) {
        data.colleagues = data.colleagues
          .filter((u): u is Record<string, unknown> => Boolean(u && typeof u === "object"))
          .map(mapColleague);
      }
      if (Array.isArray(data.users)) {
        data.users = data.users
          .filter((u): u is Record<string, unknown> => Boolean(u && typeof u === "object"))
          .map(mapColleague);
      }
      if (Array.isArray(data.items) && type === "colleagues") {
        data.items = data.items
          .filter((u): u is Record<string, unknown> => Boolean(u && typeof u === "object"))
          .map(mapColleague);
      }
    }
    return data;
  },

  // ── Files ──────────────────────────────────────────────────

  async getSharedFiles(): Promise<MessageAttachment[]> {
    const res = await apiInstance.get("/api/v1/connect/files");
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    return items
      .filter((f): f is Record<string, unknown> => Boolean(f && typeof f === "object"))
      .map((f) => ({
        fileId: String(f.id || f.file_id),
        url: (f.url as string) || "",
        name: (f.name || f.filename || "file") as string,
        size: Number(f.size || 0),
        mimeType: (f.mime_type || f.mimeType || "application/octet-stream") as string,
      }));
  },

  async uploadSharedFile(file: File): Promise<MessageAttachment> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post("/api/v1/connect/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const f = unwrapData<Record<string, unknown>>(res) || {};
    return {
      fileId: String(f.id || f.file_id || ""),
      url: (f.url as string) || "",
      name: (f.name || f.filename || file.name) as string,
      size: Number(f.size || file.size),
      mimeType: (f.mime_type || f.mimeType || file.type) as string,
    };
  },

  async deleteSharedFile(fileId: string): Promise<void> {
    await apiInstance.delete(`/api/v1/connect/files/${fileId}`);
  },

  // ── Presence ───────────────────────────────────────────────

  async updatePresence(status: PresenceStatus, customStatus?: string): Promise<void> {
    await apiInstance.put("/api/v1/connect/presence", {
      status,
      custom_status: customStatus,
    });
  },

  async getBatchPresence(userIds: string[]): Promise<Record<string, { status: PresenceStatus; lastActive?: string }>> {
    if (userIds.length === 0) return {};
    const res = await apiInstance.post("/api/v1/connect/presence/batch", {
      user_ids: userIds,
    });
    return unwrapData<Record<string, { status: PresenceStatus; lastActive?: string }>>(res) || {};
  },

  // ── 1:1 Calls ──────────────────────────────────────────────

  async getIceServers(): Promise<IceServerConfig[]> {
    const res = await apiInstance.get("/api/v1/connect/calls/ice-servers");
    const raw = unwrapData<Record<string, unknown>>(res);
    const servers = raw?.iceServers || raw?.ice_servers || raw;
    if (Array.isArray(servers)) {
      return servers
        .filter((s): s is Record<string, unknown> => Boolean(s && typeof s === "object"))
        .map((s) => ({
          urls: (s.urls || s.url) as string | string[],
          username: s.username as string | undefined,
          credential: s.credential as string | undefined,
        }));
    }
    return [{ urls: "stun:stun.l.google.com:19302" }];
  },

  async initiateCall(
    recipientId: string,
    callType: "audio" | "video",
    sdpOffer?: { type: "offer"; sdp: string }
  ): Promise<{ callId: string; status: string }> {
    const res = await apiInstance.post("/api/v1/connect/calls/initiate", {
      recipient_id: recipientId,
      call_type: callType,
      sdp_offer: sdpOffer,
    });
    const data = unwrapData<Record<string, unknown>>(res) || {};
    return {
      callId: String(data.call_id || data.id || data.callId || ""),
      status: (data.status as string) || "ringing",
    };
  },

  async sendCallSignal(callId: string, signal: SignalPayload): Promise<void> {
    await apiInstance.post(`/api/v1/connect/calls/${callId}/signal`, signal);
  },

  async updateCallStatus(callId: string, status: string, reason?: string): Promise<void> {
    await apiInstance.patch(`/api/v1/connect/calls/${callId}/status`, {
      status,
      reason,
    });
  },

  async getCallHistory(): Promise<unknown[]> {
    const res = await apiInstance.get("/api/v1/connect/calls/history");
    const raw = unwrapData<unknown>(res);
    return Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
  },

  async getCallDetail(callId: string): Promise<unknown> {
    const res = await apiInstance.get(`/api/v1/connect/calls/${callId}`);
    return unwrapData<unknown>(res);
  },

  // ── Meetings ───────────────────────────────────────────────

  async listMeetings(): Promise<MeetingSession[]> {
    const res = await apiInstance.get("/api/v1/connect/meetings");
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    return items
      .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === "object"))
      .map((m) => ({
        id: String(m.id),
        title: (m.title as string) || "Meeting",
        meetingUrl: (m.meeting_url || m.meetingUrl) as string | undefined,
        hostId: String(m.host_id || m.hostId || ""),
        hostName: (m.host_name || m.hostName || "Host") as string,
        status: (m.status as string) || "scheduled",
        scheduledAt: (m.scheduled_at || m.scheduledAt) as string | undefined,
        createdAt: ((m.created_at || m.createdAt) as string) || new Date().toISOString(),
        participants: Array.isArray(m.participants)
          ? m.participants
              .filter((p): p is Record<string, unknown> => Boolean(p && typeof p === "object"))
              .map((p) => ({
                userId: String(p.user_id || p.userId || ""),
                name: (p.name as string) || "Participant",
                avatar: p.avatar as string | undefined,
                joinedAt: ((p.joined_at || p.joinedAt) as string) || new Date().toISOString(),
                isMuted: Boolean(p.is_muted ?? p.isMuted),
                isVideoOff: Boolean(p.is_video_off ?? p.isVideoOff),
              }))
          : [],
      }));
  },

  async createMeeting(input: MeetingCreateInput): Promise<MeetingSession> {
    const res = await apiInstance.post("/api/v1/connect/meetings", {
      title: input.title,
      scheduled_at: input.scheduledAt,
      is_instant: input.isInstant ?? true,
      participant_ids: input.participantIds || [],
    });
    const m = unwrapData<Record<string, unknown>>(res) || {};
    return {
      id: String(m.id || ""),
      title: (m.title as string) || input.title,
      meetingUrl: (m.meeting_url || m.meetingUrl) as string | undefined,
      hostId: String(m.host_id || m.hostId || ""),
      hostName: (m.host_name || m.hostName || "Host") as string,
      status: (m.status as string) || "active",
      scheduledAt: (m.scheduled_at || m.scheduledAt) as string | undefined,
      createdAt: ((m.created_at || m.createdAt) as string) || new Date().toISOString(),
      participants: [],
    };
  },

  async getMeetingDetail(meetingId: string): Promise<MeetingSession> {
    const res = await apiInstance.get(`/api/v1/connect/meetings/${meetingId}`);
    const m = unwrapData<Record<string, unknown>>(res) || {};
    return {
      id: String(m.id || ""),
      title: (m.title as string) || "Meeting",
      meetingUrl: (m.meeting_url || m.meetingUrl) as string | undefined,
      hostId: String(m.host_id || m.hostId || ""),
      hostName: (m.host_name || m.hostName || "Host") as string,
      status: (m.status as string) || "active",
      scheduledAt: (m.scheduled_at || m.scheduledAt) as string | undefined,
      createdAt: ((m.created_at || m.createdAt) as string) || new Date().toISOString(),
      participants: Array.isArray(m.participants)
        ? m.participants
            .filter((p): p is Record<string, unknown> => Boolean(p && typeof p === "object"))
            .map((p) => ({
              userId: String(p.user_id || p.userId || ""),
              name: (p.name as string) || "Participant",
              avatar: p.avatar as string | undefined,
              joinedAt: ((p.joined_at || p.joinedAt) as string) || new Date().toISOString(),
              isMuted: Boolean(p.is_muted ?? p.isMuted),
              isVideoOff: Boolean(p.is_video_off ?? p.isVideoOff),
            }))
        : [],
    };
  },

  async joinMeeting(meetingId: string, mediaCapabilities?: { audio: boolean; video: boolean }): Promise<void> {
    await apiInstance.post(`/api/v1/connect/meetings/${meetingId}/join`, {
      media_capabilities: mediaCapabilities || { audio: true, video: true },
    });
  },

  async leaveMeeting(meetingId: string): Promise<void> {
    await apiInstance.post(`/api/v1/connect/meetings/${meetingId}/leave`);
  },

  async sendMeetingMessage(meetingId: string, content: string): Promise<MeetingChatMessage> {
    const res = await apiInstance.post(`/api/v1/connect/meetings/${meetingId}/messages`, {
      content,
    });
    const msg = unwrapData<Record<string, unknown>>(res) || {};
    return {
      id: String(msg.id || Date.now()),
      meetingId,
      senderId: String(msg.sender_id || msg.senderId || ""),
      senderName: (msg.sender_name || msg.senderName || "User") as string,
      content: (msg.content as string) || content,
      timestamp: (msg.timestamp || msg.created_at || new Date().toISOString()) as string,
    };
  },

  // ── Notifications ──────────────────────────────────────────

  async getConnectNotifications(): Promise<ConnectNotification[]> {
    const res = await apiInstance.get("/api/v1/connect/notifications");
    const raw = unwrapData<unknown>(res);
    const items = Array.isArray(raw) ? raw : (raw as { items?: unknown[] })?.items || [];
    return items
      .filter((n): n is Record<string, unknown> => Boolean(n && typeof n === "object"))
      .map((n) => ({
        id: String(n.id),
        type: (n.type as string) || "message",
        title: (n.title as string) || "Notification",
        body: (n.body || n.message || "") as string,
        link: n.link as string | undefined,
        isRead: Boolean(n.is_read ?? n.isRead),
        createdAt: ((n.created_at || n.createdAt) as string) || new Date().toISOString(),
      }));
  },

  async clearConnectNotifications(): Promise<void> {
    await apiInstance.delete("/api/v1/connect/notifications");
  },

  async markConnectNotificationRead(notificationId: string): Promise<void> {
    await apiInstance.patch(`/api/v1/connect/notifications/${notificationId}/read`);
  },

  // ── Sound Settings ─────────────────────────────────────────

  async getSoundSettings(): Promise<SoundSettings> {
    const res = await apiInstance.get("/api/v1/connect/settings/sound");
    const s = unwrapData<Record<string, unknown>>(res);
    return {
      incomingCall: Boolean(s?.incoming_call ?? s?.incomingCall ?? true),
      messageAlert: Boolean(s?.message_alert ?? s?.messageAlert ?? true),
      notificationChime: Boolean(s?.notification_chime ?? s?.notificationChime ?? true),
      volume: typeof s?.volume === "number" ? s.volume : 80,
    };
  },

  async updateSoundSettings(settings: SoundSettings): Promise<SoundSettings> {
    const res = await apiInstance.put("/api/v1/connect/settings/sound", {
      incoming_call: settings.incomingCall,
      message_alert: settings.messageAlert,
      notification_chime: settings.notificationChime,
      volume: settings.volume,
    });
    const s = unwrapData<Record<string, unknown>>(res);
    return {
      incomingCall: Boolean(s?.incoming_call ?? s?.incomingCall ?? settings.incomingCall),
      messageAlert: Boolean(s?.message_alert ?? s?.messageAlert ?? settings.messageAlert),
      notificationChime: Boolean(s?.notification_chime ?? s?.notificationChime ?? settings.notificationChime),
      volume: typeof s?.volume === "number" ? s.volume : settings.volume,
    };
  },

  // ── AI Transform & Mail Dispatch ───────────────────────────

  async aiTransform(text: string, mode: "rephrase" | "summarize" | "professional"): Promise<{ transformed: string }> {
    const res = await apiInstance.post("/api/v1/connect/ai/transform", { text, mode });
    return unwrapData<{ transformed: string }>(res);
  },

  async dispatchMail(data: { recipient_email: string; subject: string; body: string }): Promise<void> {
    await apiInstance.post("/api/v1/connect/mail/dispatch", data);
  },
};

// ─────────────────────────────────────────────────────────────
// Message Mapper
// ─────────────────────────────────────────────────────────────

function mapMessage(m: Record<string, unknown>): Message {
  return {
    id: String(m.id || ""),
    channelId: (m.channel_id ?? m.channelId ?? null) as string | null,
    conversationId: (m.conversation_id ?? m.conversationId ?? null) as string | null,
    parentMessageId: (m.parent_message_id ?? m.parentMessageId ?? null) as string | null,
    senderId: String(m.sender_id ?? m.senderId ?? ""),
    senderName: (m.sender_name ?? m.senderName ?? "Unknown User") as string,
    senderAvatar: (m.sender_avatar ?? m.senderAvatar ?? null) as string | null,
    content: String(m.content || ""),
    isPinned: Boolean(m.is_pinned ?? m.isPinned),
    isEdited: Boolean(m.is_edited ?? m.isEdited),
    attachments: Array.isArray(m.attachments)
      ? m.attachments
          .filter((a): a is Record<string, unknown> => Boolean(a && typeof a === "object"))
          .map((a) => ({
            fileId: String(a.file_id ?? a.fileId ?? a.id ?? ""),
            url: String(a.url || ""),
            name: String(a.name || a.filename || "file"),
            size: Number(a.size || 0),
            mimeType: String(a.mime_type || a.mimeType || "application/octet-stream"),
          }))
      : [],
    reactions: Array.isArray(m.reactions)
      ? m.reactions
          .filter((r): r is Record<string, unknown> => Boolean(r && typeof r === "object"))
          .map((r) => ({
            emoji: String(r.emoji || ""),
            count: Number(r.count || 1),
            userIds: Array.isArray(r.user_ids || r.userIds)
              ? (r.user_ids || r.userIds).map(String)
              : [],
          }))
      : [],
    replyCount: Number(m.reply_count ?? m.replyCount ?? 0),
    createdAt: (m.created_at ?? m.createdAt ?? new Date().toISOString()) as string,
    updatedAt: (m.updated_at ?? m.updatedAt) as string | undefined,
  };
}
