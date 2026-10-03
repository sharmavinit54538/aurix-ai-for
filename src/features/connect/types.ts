import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// 1. Enums & Primitive Schemas
// ─────────────────────────────────────────────────────────────

export const PresenceStatusSchema = z.enum(["online", "away", "offline"]);
export type PresenceStatus = z.infer<typeof PresenceStatusSchema>;

export const CallStatusSchema = z.enum([
  "initiating",
  "ringing",
  "accepted",
  "rejected",
  "busy",
  "missed",
  "ended",
]);
export type CallStatus = z.infer<typeof CallStatusSchema>;

export const CallTypeSchema = z.enum(["audio", "video"]);
export type CallType = z.infer<typeof CallTypeSchema>;

// ─────────────────────────────────────────────────────────────
// 2. Colleague & User Directory
// ─────────────────────────────────────────────────────────────

export const ColleagueSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  department: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  presence: PresenceStatusSchema.optional().default("offline"),
  lastActive: z.string().nullable().optional(),
});
export type Colleague = z.infer<typeof ColleagueSchema>;

// ─────────────────────────────────────────────────────────────
// 3. Channels & Members
// ─────────────────────────────────────────────────────────────

export const ChannelMemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  role: z.enum(["owner", "admin", "member"]).optional().default("member"),
  joinedAt: z.string().optional(),
});
export type ChannelMember = z.infer<typeof ChannelMemberSchema>;

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  isPrivate: z.boolean().default(false),
  memberCount: z.number().default(0),
  unreadCount: z.number().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Channel = z.infer<typeof ChannelSchema>;

export interface ChannelCreateInput {
  name: string;
  description?: string;
  topic?: string;
  isPrivate?: boolean;
  memberIds?: string[];
}

export interface ChannelUpdateInput {
  name?: string;
  description?: string;
  topic?: string;
  isPrivate?: boolean;
}

// ─────────────────────────────────────────────────────────────
// 4. Messages & Threads
// ─────────────────────────────────────────────────────────────

export const MessageReactionSchema = z.object({
  emoji: z.string(),
  count: z.number().default(1),
  userIds: z.array(z.string()).default([]),
});
export type MessageReaction = z.infer<typeof MessageReactionSchema>;

export const MessageAttachmentSchema = z.object({
  fileId: z.string(),
  url: z.string(),
  name: z.string(),
  size: z.number(),
  mimeType: z.string(),
});
export type MessageAttachment = z.infer<typeof MessageAttachmentSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  channelId: z.string().nullable().optional(),
  conversationId: z.string().nullable().optional(),
  parentMessageId: z.string().nullable().optional(),
  senderId: z.string(),
  senderName: z.string(),
  senderAvatar: z.string().nullable().optional(),
  content: z.string(),
  isPinned: z.boolean().default(false),
  isEdited: z.boolean().default(false),
  attachments: z.array(MessageAttachmentSchema).optional().default([]),
  reactions: z.array(MessageReactionSchema).optional().default([]),
  replyCount: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export interface MessageSendInput {
  content: string;
  attachments?: string[];
  mentions?: string[];
}

// ─────────────────────────────────────────────────────────────
// 5. Direct Conversations
// ─────────────────────────────────────────────────────────────

export const DirectConversationSchema = z.object({
  id: z.string(),
  participant: ColleagueSchema,
  lastMessage: z
    .object({
      content: z.string(),
      createdAt: z.string(),
      senderId: z.string().optional(),
    })
    .nullable()
    .optional(),
  unreadCount: z.number().default(0),
  updatedAt: z.string().optional(),
});
export type DirectConversation = z.infer<typeof DirectConversationSchema>;

// ─────────────────────────────────────────────────────────────
// 6. 1:1 Calls & WebRTC Signaling
// ─────────────────────────────────────────────────────────────

export const IceServerConfigSchema = z.object({
  urls: z.union([z.string(), z.array(z.string())]),
  username: z.string().optional(),
  credential: z.string().optional(),
});
export type IceServerConfig = z.infer<typeof IceServerConfigSchema>;

export interface SignalPayload {
  type: "offer" | "answer" | "candidate";
  sdp?: string;
  candidate?: {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
  };
}

export interface CallSession {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string | null;
  recipientId: string;
  recipientName?: string;
  recipientAvatar?: string | null;
  callType: CallType;
  status: CallStatus;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  sdpOffer?: { type: "offer"; sdp: string };
}

export interface CallHistoryItem {
  id: string;
  caller: { id: string; name: string; avatar?: string | null };
  recipient: { id: string; name: string; avatar?: string | null };
  callType: CallType;
  status: CallStatus;
  startedAt: string;
  durationSeconds: number;
}

// ─────────────────────────────────────────────────────────────
// 7. Meetings
// ─────────────────────────────────────────────────────────────

export const MeetingParticipantSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  joinedAt: z.string(),
  isMuted: z.boolean().default(false),
  isVideoOff: z.boolean().default(false),
});
export type MeetingParticipant = z.infer<typeof MeetingParticipantSchema>;

export const MeetingSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  meetingUrl: z.string().optional(),
  hostId: z.string(),
  hostName: z.string(),
  status: z.enum(["scheduled", "active", "ended"]).default("scheduled"),
  scheduledAt: z.string().nullable().optional(),
  createdAt: z.string(),
  participants: z.array(MeetingParticipantSchema).default([]),
});
export type MeetingSession = z.infer<typeof MeetingSessionSchema>;

export interface MeetingCreateInput {
  title: string;
  scheduledAt?: string;
  isInstant?: boolean;
  participantIds?: string[];
}

export interface MeetingChatMessage {
  id: string;
  meetingId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// 8. Connect Notifications & Sound Preferences
// ─────────────────────────────────────────────────────────────

export interface ConnectNotification {
  id: string;
  type: "message" | "mention" | "call" | "meeting";
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SoundSettings {
  incomingCall: boolean;
  messageAlert: boolean;
  notificationChime: boolean;
  volume: number; // 0 to 100
}
