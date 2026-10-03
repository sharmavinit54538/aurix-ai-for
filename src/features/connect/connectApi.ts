import apiInstance from "@/api/apiInstance";
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
function unwrapData<T>(res: any): T {
  if (res?.data?.data !== undefined) return res.data.data as T;
  if (res?.data !== undefined) return res.data as T;
  return res as T;
}

// ─────────────────────────────────────────────────────────────
// Connect API Service (100% Contract-backed by openapi.json)
// ─────────────────────────────────────────────────────────────

export const connectApi = {
  // ── Channels (openapi.json:10961-11063) ────────────────────

  async listChannels(params?: { type?: string; page?: number; limit?: number }): Promise<Channel[]> {
    const res = await apiInstance.get("/api/v1/connect/channels", { params });
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map((c: any) => ({
      id: String(c.id),
      name: c.name || "Untitled Channel",
      description: c.description ?? null,
      topic: c.topic ?? null,
      isPrivate: Boolean(c.is_private ?? c.isPrivate),
      memberCount: Number(c.member_count ?? c.members_count ?? c.memberCount ?? 0),
      unreadCount: Number(c.unread_count ?? c.unreadCount ?? 0),
      createdAt: c.created_at ?? c.createdAt,
      updatedAt: c.updated_at ?? c.updatedAt,
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
    const c = unwrapData<any>(res);
    return {
      id: String(c.id),
      name: c.name,
      description: c.description ?? null,
      topic: c.topic ?? null,
      isPrivate: Boolean(c.is_private ?? c.isPrivate),
      memberCount: Number(c.member_count ?? c.memberCount ?? 1),
      unreadCount: 0,
      createdAt: c.created_at ?? c.createdAt,
      updatedAt: c.updated_at ?? c.updatedAt,
    };
  },

  async getChannel(channelId: string): Promise<Channel> {
    const res = await apiInstance.get(`/api/v1/connect/channels/${channelId}`);
    const c = unwrapData<any>(res);
    return {
      id: String(c.id),
      name: c.name,
      description: c.description ?? null,
      topic: c.topic ?? null,
      isPrivate: Boolean(c.is_private ?? c.isPrivate),
      memberCount: Number(c.member_count ?? c.memberCount ?? 0),
      unreadCount: Number(c.unread_count ?? c.unreadCount ?? 0),
      createdAt: c.created_at ?? c.createdAt,
      updatedAt: c.updated_at ?? c.updatedAt,
    };
  },

  async updateChannel(channelId: string, input: ChannelUpdateInput): Promise<Channel> {
    const res = await apiInstance.patch(`/api/v1/connect/channels/${channelId}`, {
      name: input.name,
      description: input.description,
      topic: input.topic,
      is_private: input.isPrivate,
    });
    const c = unwrapData<any>(res);
    return {
      id: String(c.id),
      name: c.name,
      description: c.description ?? null,
      topic: c.topic ?? null,
      isPrivate: Boolean(c.is_private ?? c.isPrivate),
      memberCount: Number(c.member_count ?? c.memberCount ?? 0),
      unreadCount: 0,
      createdAt: c.created_at ?? c.createdAt,
      updatedAt: c.updated_at ?? c.updatedAt,
    };
  },

  async deleteChannel(channelId: string): Promise<void> {
    await apiInstance.delete(`/api/v1/connect/channels/${channelId}`);
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
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return {
      items: items.map(mapMessage),
      hasMore: Boolean(raw?.has_more ?? raw?.hasMore ?? (items.length >= (params?.limit || 50))),
    };
  },

  async sendChannelMessage(channelId: string, input: MessageSendInput): Promise<Message> {
    const res = await apiInstance.post(`/api/v1/connect/channels/${channelId}/messages`, {
      content: input.content,
      attachments: input.attachments || [],
      mentions: input.mentions || [],
    });
    return mapMessage(unwrapData<any>(res));
  },

  // ── Direct Conversations (openapi.json:10868-10898) ───────

  async listConversations(): Promise<DirectConversation[]> {
    const res = await apiInstance.get("/api/v1/connect/conversations");
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map((c: any) => ({
      id: String(c.id),
      participant: mapColleague(c.participant || c.recipient || {}),
      lastMessage: c.last_message || c.lastMessage
        ? {
            content: (c.last_message || c.lastMessage).content || "",
            createdAt: (c.last_message || c.lastMessage).created_at || (c.last_message || c.lastMessage).createdAt || "",
            senderId: (c.last_message || c.lastMessage).sender_id || (c.last_message || c.lastMessage).senderId,
          }
        : null,
      unreadCount: Number(c.unread_count ?? c.unreadCount ?? 0),
      updatedAt: c.updated_at ?? c.updatedAt,
    }));
  },

  async createConversation(recipientId: string): Promise<DirectConversation> {
    const res = await apiInstance.post("/api/v1/connect/conversations", {
      recipient_id: recipientId,
    });
    const c = unwrapData<any>(res);
    return {
      id: String(c.id),
      participant: mapColleague(c.participant || c.recipient || { id: recipientId }),
      lastMessage: null,
      unreadCount: 0,
      updatedAt: c.updated_at ?? c.updatedAt,
    };
  },

  async getConversationMessages(
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<{ items: Message[]; hasMore: boolean }> {
    const res = await apiInstance.get(`/api/v1/connect/conversations/${conversationId}/messages`, { params });
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return {
      items: items.map(mapMessage),
      hasMore: Boolean(raw?.has_more ?? raw?.hasMore ?? (items.length >= (params?.limit || 50))),
    };
  },

  async sendConversationMessage(conversationId: string, input: MessageSendInput): Promise<Message> {
    const res = await apiInstance.post(`/api/v1/connect/conversations/${conversationId}/messages`, {
      content: input.content,
      attachments: input.attachments || [],
      mentions: input.mentions || [],
    });
    return mapMessage(unwrapData<any>(res));
  },

  // ── Message Operations (openapi.json:10908-10951) ──────────

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
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map(mapMessage);
  },

  async postThreadReply(parentMessageId: string, content: string): Promise<Message> {
    const res = await apiInstance.post(`/api/v1/connect/messages/${parentMessageId}/thread`, {
      content,
    });
    return mapMessage(unwrapData<any>(res));
  },

  // ── Colleagues & Search (openapi.json:10846-10857) ──────────

  async getColleagues(): Promise<Colleague[]> {
    const res = await apiInstance.get("/api/v1/connect/colleagues");
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map(mapColleague);
  },

  async unifiedSearch(q: string, type?: string): Promise<any> {
    const res = await apiInstance.get("/api/v1/connect/search", { params: { q, type } });
    return unwrapData<any>(res);
  },

  // ── Files (openapi.json:11204-11226) ───────────────────────

  async getSharedFiles(): Promise<MessageAttachment[]> {
    const res = await apiInstance.get("/api/v1/connect/files");
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map((f: any) => ({
      fileId: String(f.id || f.file_id),
      url: f.url,
      name: f.name || f.filename,
      size: Number(f.size || 0),
      mimeType: f.mime_type || f.mimeType || "application/octet-stream",
    }));
  },

  async uploadSharedFile(file: File): Promise<MessageAttachment> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post("/api/v1/connect/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const f = unwrapData<any>(res);
    return {
      fileId: String(f.id || f.file_id),
      url: f.url,
      name: f.name || f.filename || file.name,
      size: Number(f.size || file.size),
      mimeType: f.mime_type || f.mimeType || file.type,
    };
  },

  async deleteSharedFile(fileId: string): Promise<void> {
    await apiInstance.delete(`/api/v1/connect/files/${fileId}`);
  },

  // ── Presence (openapi.json:11237-11248) ────────────────────

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

  // ── 1:1 Calls (openapi.json:11074-11129) ───────────────────

  async getIceServers(): Promise<IceServerConfig[]> {
    const res = await apiInstance.get("/api/v1/connect/calls/ice-servers");
    const raw = unwrapData<any>(res);
    const servers = raw?.iceServers || raw?.ice_servers || raw;
    if (Array.isArray(servers)) {
      return servers.map((s: any) => ({
        urls: s.urls || s.url,
        username: s.username,
        credential: s.credential,
      }));
    }
    // Fallback standard STUN servers if empty
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
    const data = unwrapData<any>(res);
    return {
      callId: String(data.call_id || data.id || data.callId),
      status: data.status || "ringing",
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

  async getCallHistory(): Promise<any[]> {
    const res = await apiInstance.get("/api/v1/connect/calls/history");
    const raw = unwrapData<any>(res);
    return Array.isArray(raw) ? raw : raw?.items || [];
  },

  async getCallDetail(callId: string): Promise<any> {
    const res = await apiInstance.get(`/api/v1/connect/calls/${callId}`);
    return unwrapData<any>(res);
  },

  // ── Meetings (openapi.json:11140-11193) ────────────────────

  async listMeetings(): Promise<MeetingSession[]> {
    const res = await apiInstance.get("/api/v1/connect/meetings");
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map((m: any) => ({
      id: String(m.id),
      title: m.title || "Meeting",
      meetingUrl: m.meeting_url || m.meetingUrl,
      hostId: String(m.host_id || m.hostId),
      hostName: m.host_name || m.hostName || "Host",
      status: m.status || "scheduled",
      scheduledAt: m.scheduled_at || m.scheduledAt,
      createdAt: m.created_at || m.createdAt || new Date().toISOString(),
      participants: (m.participants || []).map((p: any) => ({
        userId: String(p.user_id || p.userId),
        name: p.name || "Participant",
        avatar: p.avatar,
        joinedAt: p.joined_at || p.joinedAt || new Date().toISOString(),
        isMuted: Boolean(p.is_muted ?? p.isMuted),
        isVideoOff: Boolean(p.is_video_off ?? p.isVideoOff),
      })),
    }));
  },

  async createMeeting(input: MeetingCreateInput): Promise<MeetingSession> {
    const res = await apiInstance.post("/api/v1/connect/meetings", {
      title: input.title,
      scheduled_at: input.scheduledAt,
      is_instant: input.isInstant ?? true,
      participant_ids: input.participantIds || [],
    });
    const m = unwrapData<any>(res);
    return {
      id: String(m.id),
      title: m.title || input.title,
      meetingUrl: m.meeting_url || m.meetingUrl,
      hostId: String(m.host_id || m.hostId || ""),
      hostName: m.host_name || m.hostName || "Host",
      status: m.status || "active",
      scheduledAt: m.scheduled_at || m.scheduledAt,
      createdAt: m.created_at || m.createdAt || new Date().toISOString(),
      participants: [],
    };
  },

  async getMeetingDetail(meetingId: string): Promise<MeetingSession> {
    const res = await apiInstance.get(`/api/v1/connect/meetings/${meetingId}`);
    const m = unwrapData<any>(res);
    return {
      id: String(m.id),
      title: m.title || "Meeting",
      meetingUrl: m.meeting_url || m.meetingUrl,
      hostId: String(m.host_id || m.hostId),
      hostName: m.host_name || m.hostName || "Host",
      status: m.status || "active",
      scheduledAt: m.scheduled_at || m.scheduledAt,
      createdAt: m.created_at || m.createdAt || new Date().toISOString(),
      participants: (m.participants || []).map((p: any) => ({
        userId: String(p.user_id || p.userId),
        name: p.name || "Participant",
        avatar: p.avatar,
        joinedAt: p.joined_at || p.joinedAt || new Date().toISOString(),
        isMuted: Boolean(p.is_muted ?? p.isMuted),
        isVideoOff: Boolean(p.is_video_off ?? p.isVideoOff),
      })),
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
    const msg = unwrapData<any>(res);
    return {
      id: String(msg.id || Date.now()),
      meetingId,
      senderId: String(msg.sender_id || msg.senderId),
      senderName: msg.sender_name || msg.senderName || "User",
      content: msg.content || content,
      timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
    };
  },

  // ── Notifications (openapi.json:11259-11279) ───────────────

  async getConnectNotifications(): Promise<ConnectNotification[]> {
    const res = await apiInstance.get("/api/v1/connect/notifications");
    const raw = unwrapData<any>(res);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map((n: any) => ({
      id: String(n.id),
      type: n.type || "message",
      title: n.title || "Notification",
      body: n.body || n.message || "",
      link: n.link,
      isRead: Boolean(n.is_read ?? n.isRead),
      createdAt: n.created_at || n.createdAt || new Date().toISOString(),
    }));
  },

  async clearConnectNotifications(): Promise<void> {
    await apiInstance.delete("/api/v1/connect/notifications");
  },

  async markConnectNotificationRead(notificationId: string): Promise<void> {
    await apiInstance.patch(`/api/v1/connect/notifications/${notificationId}/read`);
  },

  // ── Sound Settings (openapi.json:11290-11300) ──────────────

  async getSoundSettings(): Promise<SoundSettings> {
    const res = await apiInstance.get("/api/v1/connect/settings/sound");
    const s = unwrapData<any>(res);
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
    const s = unwrapData<any>(res);
    return {
      incomingCall: Boolean(s?.incoming_call ?? s?.incomingCall ?? settings.incomingCall),
      messageAlert: Boolean(s?.message_alert ?? s?.messageAlert ?? settings.messageAlert),
      notificationChime: Boolean(s?.notification_chime ?? s?.notificationChime ?? settings.notificationChime),
      volume: typeof s?.volume === "number" ? s.volume : settings.volume,
    };
  },

  // ── AI Transform & Mail Dispatch (openapi.json:11310-11321) ─

  async aiTransform(text: string, mode: "rephrase" | "summarize" | "professional"): Promise<{ transformed: string }> {
    const res = await apiInstance.post("/api/v1/connect/ai/transform", { text, mode });
    return unwrapData<{ transformed: string }>(res);
  },

  async dispatchMail(data: { recipient_email: string; subject: string; body: string }): Promise<void> {
    await apiInstance.post("/api/v1/connect/mail/dispatch", data);
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function mapMessage(m: any): Message {
  return {
    id: String(m.id),
    channelId: m.channel_id ?? m.channelId ?? null,
    conversationId: m.conversation_id ?? m.conversationId ?? null,
    parentMessageId: m.parent_message_id ?? m.parentMessageId ?? null,
    senderId: String(m.sender_id ?? m.senderId ?? ""),
    senderName: m.sender_name ?? m.senderName ?? "Unknown User",
    senderAvatar: m.sender_avatar ?? m.senderAvatar ?? null,
    content: m.content || "",
    isPinned: Boolean(m.is_pinned ?? m.isPinned),
    isEdited: Boolean(m.is_edited ?? m.isEdited),
    attachments: (m.attachments || []).map((a: any) => ({
      fileId: String(a.file_id ?? a.fileId ?? a.id),
      url: a.url,
      name: a.name || a.filename || "file",
      size: Number(a.size || 0),
      mimeType: a.mime_type || a.mimeType || "application/octet-stream",
    })),
    reactions: (m.reactions || []).map((r: any) => ({
      emoji: r.emoji,
      count: Number(r.count || 1),
      userIds: (r.user_ids || r.userIds || []).map(String),
    })),
    replyCount: Number(m.reply_count ?? m.replyCount ?? 0),
    createdAt: m.created_at ?? m.createdAt ?? new Date().toISOString(),
    updatedAt: m.updated_at ?? m.updatedAt,
  };
}

function mapColleague(u: any): Colleague {
  return {
    id: String(u.id || ""),
    name: u.name || "Unknown Colleague",
    email: u.email || "",
    department: u.department ?? null,
    designation: u.designation ?? null,
    avatar: u.avatar ?? null,
    presence: u.presence === "online" || u.presence === "away" ? u.presence : "offline",
    lastActive: u.last_active ?? u.lastActive ?? null,
  };
}
