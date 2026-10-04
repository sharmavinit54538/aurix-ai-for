import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import type { MeetingChatMessage, MeetingParticipant, MeetingSession } from "../types";

class MeetingManager {
  private activeMeeting: MeetingSession | null = null;
  private localStream: MediaStream | null = null;
  private remoteStreams = new Map<string, MediaStream>(); // userId -> remoteStream
  private peerConnections = new Map<string, RTCPeerConnection>(); // userId -> RTCPeerConnection
  private chatMessages: MeetingChatMessage[] = [];
  private isMuted = false;
  private isCameraOff = false;
  private subscribers = new Set<() => void>();
  private isInitialized = false;

  public init(): void {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    // Realtime: participant joined
    realtimeClient.on("meeting.participant_joined", (data: any) => {
      if (this.activeMeeting && String(data?.meeting_id) === this.activeMeeting.id) {
        const newPart: MeetingParticipant = {
          userId: String(data.user_id),
          name: data.name || "Participant",
          avatar: data.avatar,
          joinedAt: new Date().toISOString(),
          isMuted: false,
          isVideoOff: false,
        };
        // Avoid duplicate
        if (!this.activeMeeting.participants.some((p) => p.userId === newPart.userId)) {
          this.activeMeeting.participants.push(newPart);
          this.notify();
        }
      }
    });

    // Realtime: participant left
    realtimeClient.on("meeting.participant_left", (data: any) => {
      if (this.activeMeeting && String(data?.meeting_id) === this.activeMeeting.id) {
        const uid = String(data.user_id);
        this.activeMeeting.participants = this.activeMeeting.participants.filter(
          (p) => p.userId !== uid
        );
        this.closePeerConnection(uid);
        this.notify();
      }
    });

    // Realtime: meeting chat message
    realtimeClient.on("meeting.chat", (data: any) => {
      if (this.activeMeeting && String(data?.meeting_id) === this.activeMeeting.id) {
        this.chatMessages.push({
          id: String(data.id || Date.now()),
          meetingId: this.activeMeeting.id,
          senderId: String(data.sender_id),
          senderName: data.sender_name || "User",
          content: data.content || "",
          timestamp: data.timestamp || new Date().toISOString(),
        });
        this.notify();
      }
    });
  }

  public getActiveMeeting(): MeetingSession | null {
    return this.activeMeeting;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStreams(): Map<string, MediaStream> {
    return this.remoteStreams;
  }

  public getChatMessages(): MeetingChatMessage[] {
    return this.chatMessages;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsCameraOff(): boolean {
    return this.isCameraOff;
  }

  public subscribe(cb: () => void): () => void {
    this.subscribers.add(cb);
    return () => {
      this.subscribers.delete(cb);
    };
  }

  // ── Join Meeting ───────────────────────────────────────────

  public async joinMeeting(meetingId: string, opts?: { audio?: boolean; video?: boolean }): Promise<void> {
    const audioEnabled = opts?.audio ?? true;
    const videoEnabled = opts?.video ?? true;

    try {
      // 1. Acquire media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      this.isMuted = !audioEnabled;
      this.isCameraOff = !videoEnabled;

      this.localStream.getAudioTracks().forEach((t) => (t.enabled = audioEnabled));
      this.localStream.getVideoTracks().forEach((t) => (t.enabled = videoEnabled));

      // 2. Fetch meeting details and register join on backend
      const details = await connectApi.getMeetingDetail(meetingId);
      await connectApi.joinMeeting(meetingId, { audio: audioEnabled, video: videoEnabled });

      this.activeMeeting = details;
      this.chatMessages = [];
      this.notify();
function mapMeetingError(err: any): Error {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return new Error("Microphone and camera access requires a secure context (HTTPS or localhost).");
  }
  const name = err?.name || "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return new Error("Microphone or camera access was denied by the browser.");
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return new Error("No microphone or camera device found on this system.");
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return new Error("Microphone or camera is currently in use by another application.");
  }
  if (err?.message) {
    return new Error(err.message);
  }
  return new Error("Failed to join meeting.");
}

    } catch (err: any) {
      this.leaveMeeting();
      const mapped = mapMeetingError(err);
      if (import.meta.env.DEV) {
        console.warn("[meetingStore] Join meeting failed:", mapped.message, err);
      }
      throw mapped;
    }
  }

  // ── Leave Meeting ──────────────────────────────────────────

  public async leaveMeeting(): Promise<void> {
    if (this.activeMeeting) {
      const mid = this.activeMeeting.id;
      connectApi.leaveMeeting(mid).catch((err) => {
        // Best-effort leave meeting notification (Group b)
        if (import.meta.env.DEV) {
          console.warn("[meetingStore] Leave meeting API failed:", err);
        }
      });
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }

    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.remoteStreams.clear();
    this.activeMeeting = null;
    this.chatMessages = [];
    this.notify();
  }

  // ── Meeting In-Room Controls ───────────────────────────────

  public toggleMute(): void {
    if (!this.localStream) return;
    const audio = this.localStream.getAudioTracks()[0];
    if (audio) {
      audio.enabled = !audio.enabled;
      this.isMuted = !audio.enabled;
      this.notify();
    }
  }

  public toggleCamera(): void {
    if (!this.localStream) return;
    const video = this.localStream.getVideoTracks()[0];
    if (video) {
      video.enabled = !video.enabled;
      this.isCameraOff = !video.enabled;
      this.notify();
    }
  }

  public async sendMessage(content: string): Promise<void> {
    if (!this.activeMeeting || !content.trim()) return;
    const sent = await connectApi.sendMeetingMessage(this.activeMeeting.id, content.trim());
    this.chatMessages.push(sent);
    this.notify();
  }

  private closePeerConnection(userId: string): void {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(userId);
    }
    this.remoteStreams.delete(userId);
  }

  private notify(): void {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch {}
    });
  }
}

export const meetingManager = new MeetingManager();
