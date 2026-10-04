import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import { soundService } from "../services/soundService";
import type { CallSession, CallStatus, CallType, IceServerConfig, SignalPayload } from "../types";
import { aurix } from "@/lib/aurix-store";
import { toast } from "sonner";

// UNVERIFIED - backend value nahi mila
export const CALL_RINGING_TIMEOUT_MS = 45000; // 45s
export const ICE_DISCONNECT_GRACE_MS = 5000; // 5s

/**
 * Normalizes incoming offer into explicit RTCSessionDescriptionInit.
 * Returns null if offer is missing, empty, or invalid.
 */
export function normalizeSdpOffer(rawOffer: unknown): { type: "offer"; sdp: string } | null {
  if (!rawOffer) return null;

  // Case 1: Plain SDP string
  if (typeof rawOffer === "string" && rawOffer.trim().length > 0) {
    const sdp = rawOffer.trim();
    if (sdp.includes("v=") || sdp.includes("m=")) {
      return { type: "offer", sdp };
    }
    return null;
  }

  // Case 2: Object { type: "offer", sdp: string } or { sdp: string } or nested
  if (typeof rawOffer === "object" && rawOffer !== null) {
    const obj = rawOffer as Record<string, unknown>;

    if (obj.offer && typeof obj.offer === "object") {
      return normalizeSdpOffer(obj.offer);
    }
    if (obj.sdp_offer && typeof obj.sdp_offer === "object") {
      return normalizeSdpOffer(obj.sdp_offer);
    }
    if (obj.signal && typeof obj.signal === "object") {
      return normalizeSdpOffer(obj.signal);
    }

    const sdpVal =
      typeof obj.sdp === "string"
        ? obj.sdp
        : typeof obj.sdp_offer === "string"
        ? obj.sdp_offer
        : typeof obj.sdpOffer === "string"
        ? obj.sdpOffer
        : "";

    if (sdpVal && (sdpVal.includes("v=") || sdpVal.includes("m="))) {
      return { type: "offer", sdp: sdpVal.trim() };
    }
  }

  return null;
}

/**
 * Maps WebRTC and media errors into user-friendly typed messages.
 */
export function mapCallError(err: unknown, fallback = "Call failed"): string {
  if (typeof window !== "undefined" && window.isSecureContext === false) {
    return "WebRTC calls require HTTPS or a secure context.";
  }

  if (err && typeof err === "object") {
    const errorObj = err as { name?: string; message?: string };
    const name = errorObj.name || "";
    const msg = errorObj.message || "";

    if (name === "SecurityError") {
      return "WebRTC calls require HTTPS or a secure context.";
    }

    if (
      name === "NotAllowedError" ||
      name === "PermissionDeniedError" ||
      msg.toLowerCase().includes("permission")
    ) {
      return "Microphone / camera access was denied. Please check browser permissions.";
    }
    if (
      name === "NotFoundError" ||
      name === "DevicesNotFoundError" ||
      msg.toLowerCase().includes("not found")
    ) {
      return "No microphone or camera device detected.";
    }
    if (name === "NotSupportedError") {
      return "Media capture is not supported in this browser environment.";
    }
    if (msg.includes("ICE server") || msg.includes("ice-servers")) {
      return "Failed to retrieve ICE relay configuration. Calls cannot be established without ICE servers.";
    }
    if (msg.includes("initiate")) {
      return "Failed to initiate call with recipient.";
    }
    if (msg.includes("signaling")) {
      return "WebRTC signaling exchange failed.";
    }
    if (msg.includes("ICE")) {
      return "ICE candidate negotiation failed.";
    }
    if (msg) return msg;
  }

  return fallback;
}

/**
 * Extracts only URL schemes (e.g. stun, turn, turns) from ICE servers for DEV diagnostics.
 * Never exposes credentials or full URLs.
 */
export function extractIceSchemes(servers: IceServerConfig[]): string[] {
  const schemes = new Set<string>();
  for (const s of servers) {
    const urls = Array.isArray(s.urls) ? s.urls : [s.urls];
    for (const u of urls) {
      if (typeof u === "string") {
        const scheme = u.split(":")[0];
        if (scheme) schemes.add(scheme.toLowerCase());
      }
    }
  }
  return Array.from(schemes);
}

class CallManager {
  private activeSession: CallSession | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private iceServers: IceServerConfig[] = []; // No hardcoded STUN fallback!
  private subscribers = new Set<() => void>();
  private pendingLocalCandidates: SignalPayload[] = [];
  private pendingRemoteCandidates: RTCIceCandidateInit[] = [];
  private isMuted = false;
  private isCameraOff = false;
  private isInitialized = false;
  private ringingTimer: ReturnType<typeof setTimeout> | null = null;
  private iceDisconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private localCandidateCount = 0;
  private remoteCandidateCount = 0;
  private selectedCandidatePairType = "unknown";

  public init(): void {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    // Preload ICE servers (without hardcoded fallback)
    this.ensureIceServers().catch((err) => {
      if (import.meta.env.DEV) {
        console.warn("[callStore] Preload ICE servers failed:", err);
      }
    });

    // Listen for incoming calls (supports both call.incoming and call.invite)
    const handleIncoming = (data: any) => {
      const callId = String(data?.call_id || data?.id || "");
      if (!callId) return;

      const isOngoing =
        this.activeSession &&
        (this.activeSession.status === "initiating" ||
          this.activeSession.status === "ringing" ||
          this.activeSession.status === "accepted" ||
          this.activeSession.status === "reconnecting");

      if (isOngoing) {
        connectApi.updateCallStatus(callId, "busy").catch((err) => {
          if (import.meta.env.DEV) {
            console.warn("[callStore] Send busy status failed:", err);
          }
        });
        return;
      }

      const rawOffer = data.offer || data.sdp_offer || data.sdpOffer || data.signal;
      const normalizedOffer = normalizeSdpOffer(rawOffer);

      if (!normalizedOffer) {
        const failureReason = "Incoming call had no valid offer";
        connectApi.updateCallStatus(callId, "failed", failureReason).catch((err) => {
          if (import.meta.env.DEV) {
            console.warn("[callStore] Failed status sync failed:", err);
          }
        });

        this.activeSession = {
          callId,
          callerId: String(data.caller_id || data.callerId || ""),
          callerName: data.caller_name || data.callerName || "Colleague",
          callerAvatar: data.caller_avatar || data.callerAvatar || null,
          recipientId: String(data.recipient_id || data.recipientId || ""),
          callType: (data.call_type || data.callType as CallType) || "audio",
          status: "failed",
          failureReason,
          startedAt: new Date().toISOString(),
        };
        this.notify();
        toast.error(failureReason);
        return;
      }

      this.activeSession = {
        callId,
        callerId: String(data.caller_id || data.callerId || ""),
        callerName: data.caller_name || data.callerName || "Colleague",
        callerAvatar: data.caller_avatar || data.callerAvatar || null,
        recipientId: String(data.recipient_id || data.recipientId || ""),
        callType: (data.call_type || data.callType as CallType) || "audio",
        status: "ringing",
        sdpOffer: normalizedOffer,
        startedAt: new Date().toISOString(),
      };

      soundService.startIncomingCallRing();
      this.startRingingTimer(callId, "recipient");
      this.notify();
    };

    realtimeClient.on("call.incoming", handleIncoming);
    realtimeClient.on("call.invite", handleIncoming);

    // Listen for incoming WebRTC signals (supports both call.signaling and call.signal)
    const handleSignal = (data: any) => {
      this.handleIncomingSignal(data);
    };
    realtimeClient.on("call.signaling", handleSignal);
    realtimeClient.on("call.signal", handleSignal);

    // Listen for remote call status changes
    realtimeClient.on("call.status", (data: any) => {
      const callId = data?.call_id || data?.id;
      if (callId && this.activeSession?.callId === String(callId)) {
        const nextStatus = data.status as CallStatus;
        if (
          nextStatus === "rejected" ||
          nextStatus === "busy" ||
          nextStatus === "ended" ||
          nextStatus === "missed" ||
          nextStatus === "failed"
        ) {
          this.terminateCallLocally(nextStatus, data.reason);
        }
      }
    });
  }

  public async ensureIceServers(): Promise<IceServerConfig[]> {
    if (this.iceServers.length > 0) {
      return this.iceServers;
    }
    try {
      const servers = await connectApi.getIceServers();
      if (!servers || servers.length === 0) {
        throw new Error("No ICE servers returned");
      }
      this.iceServers = servers;
      return servers;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[callStore] Failed to fetch ICE servers:", err);
      }
      throw new Error(
        "Failed to retrieve ICE relay configuration. Calls cannot be established without ICE servers."
      );
    }
  }

  public getSession(): CallSession | null {
    return this.activeSession;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
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

  // ── Outgoing Call ──────────────────────────────────────────

  public async startCall(
    recipient: { id: string; name: string; avatar?: string | null },
    callType: CallType
  ): Promise<void> {
    const isOngoing =
      this.activeSession &&
      (this.activeSession.status === "initiating" ||
        this.activeSession.status === "ringing" ||
        this.activeSession.status === "accepted" ||
        this.activeSession.status === "reconnecting");
    if (isOngoing) {
      return;
    }

    // Reset counters & candidate buffers
    this.localCandidateCount = 0;
    this.remoteCandidateCount = 0;
    this.pendingLocalCandidates = [];
    this.pendingRemoteCandidates = [];
    this.selectedCandidatePairType = "unknown";

    try {
      // 1. Ensure ICE servers first (fails immediately if not available)
      const iceServers = await this.ensureIceServers();

      // 2. Acquire local media
      this.localStream = await this.acquireUserMedia(callType);
      this.isMuted = false;
      this.isCameraOff = false;

      // 3. Set up peer connection
      this.peerConnection = this.createPeerConnection(iceServers);

      // 4. Add local tracks
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // 5. Create and set local offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // 6. Real user fields (no hardcoded "me" / "Me" placeholder)
      const currentUser = aurix.get().user;
      const callerId = currentUser?.id || "current-user";
      const callerName = currentUser?.fullName || currentUser?.email || "Colleague";

      // 7. Initiate via backend REST contract
      const initResult = await connectApi.initiateCall(recipient.id, callType, {
        type: "offer",
        sdp: offer.sdp || "",
      });
      const callId = initResult?.callId || (initResult as any)?.id || "";

      this.activeSession = {
        callId,
        callerId,
        callerName,
        recipientId: recipient.id,
        recipientName: recipient.name,
        recipientAvatar: recipient.avatar,
        callType,
        status: "initiating",
        startedAt: new Date().toISOString(),
      };

      this.startRingingTimer(callId, "caller");
      this.notify();

      // 8. Flush buffered local candidates now that callId is established
      await this.flushPendingLocalCandidates(callId);
    } catch (err: unknown) {
      const reason = mapCallError(err);
      toast.error(reason);
      this.terminateCallWithFailure(reason);
      throw err;
    }
  }

  // ── Accept Incoming Call ───────────────────────────────────

  public async acceptIncomingCall(): Promise<void> {
    if (!this.activeSession || this.activeSession.status !== "ringing") return;
    soundService.stopIncomingCallRing();
    this.clearRingingTimer();

    const sdpOffer = this.activeSession.sdpOffer;
    if (!sdpOffer) {
      const reason = "Incoming call had no valid offer";
      toast.error(reason);
      this.terminateCallWithFailure(reason);
      return;
    }

    try {
      // 1. Ensure ICE servers
      const iceServers = await this.ensureIceServers();

      // 2. Acquire local media
      this.localStream = await this.acquireUserMedia(this.activeSession.callType);
      this.isMuted = false;
      this.isCameraOff = false;

      // 3. Set up peer connection
      this.peerConnection = this.createPeerConnection(iceServers);

      // 4. Add local tracks
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // 5. Set remote description from offer
      await this.peerConnection.setRemoteDescription(sdpOffer);
      await this.drainPendingRemoteCandidates();

      // 6. Create and set local answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // 7. Transmit answer via REST signaling
      await connectApi.sendCallSignal(this.activeSession.callId, {
        type: "answer",
        sdp: answer.sdp,
      });

      // 8. Flush any local candidates gathered during answer creation
      await this.flushPendingLocalCandidates(this.activeSession.callId);

      // 9. Update status to accepted
      await connectApi.updateCallStatus(this.activeSession.callId, "accepted");

      this.activeSession.status = "accepted";
      soundService.playCallConnectedTone();
      this.notify();
    } catch (err: unknown) {
      const reason = mapCallError(err);
      toast.error(reason);
      this.rejectIncomingCall();
    }
  }

  // ── Reject Incoming Call ───────────────────────────────────

  public async rejectIncomingCall(): Promise<void> {
    soundService.stopIncomingCallRing();
    this.clearRingingTimer();
    if (!this.activeSession) return;

    const callId = this.activeSession.callId;
    connectApi.updateCallStatus(callId, "rejected").catch((err) => {
      if (import.meta.env.DEV) {
        console.warn("[callStore] Update call status to rejected failed:", err);
      }
    });
    this.terminateCallLocally("rejected");
  }

  // ── End Active Call ────────────────────────────────────────

  public async endCall(): Promise<void> {
    soundService.stopIncomingCallRing();
    this.clearRingingTimer();
    this.clearIceDisconnectTimer();
    if (!this.activeSession) return;

    const callId = this.activeSession.callId;
    connectApi.updateCallStatus(callId, "ended").catch((err) => {
      if (import.meta.env.DEV) {
        console.warn("[callStore] Update call status to ended failed:", err);
      }
    });
    this.terminateCallLocally("ended");
  }

  // ── In-Call Controls ───────────────────────────────────────

  public toggleMute(): void {
    if (!this.localStream) return;
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.isMuted = !audioTrack.enabled;
      this.notify();
    }
  }

  public toggleCamera(): void {
    if (!this.localStream) return;
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.isCameraOff = !videoTrack.enabled;
      this.notify();
    }
  }

  // ── Diagnostics ────────────────────────────────────────────

  public async updateDiagnosticsStats(): Promise<void> {
    if (!this.peerConnection) return;
    try {
      const stats = await this.peerConnection.getStats();
      stats.forEach((report: any) => {
        if (report.type === "candidate-pair" && report.state === "succeeded") {
          const localCand = stats.get(report.localCandidateId);
          if (localCand) {
            this.selectedCandidatePairType = localCand.candidateType || "unknown";
          }
        }
      });
    } catch {}
  }

  public getDiagnostics() {
    return {
      connectionState: this.peerConnection?.connectionState || "new",
      iceConnectionState: this.peerConnection?.iceConnectionState || "new",
      signalingState: this.peerConnection?.signalingState || "stable",
      localCandidateCount: this.localCandidateCount,
      remoteCandidateCount: this.remoteCandidateCount,
      selectedCandidatePairType: this.selectedCandidatePairType,
      iceSchemes: extractIceSchemes(this.iceServers),
    };
  }

  // ── WebRTC Internals ───────────────────────────────────────

  private createPeerConnection(iceServers: IceServerConfig[]): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers,
    });

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      this.localCandidateCount++;

      const payload: SignalPayload = {
        type: "candidate",
        candidate: {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        },
      };

      const callId = this.activeSession?.callId;
      if (callId) {
        connectApi.sendCallSignal(callId, payload).catch((err) => {
          if (import.meta.env.DEV) {
            console.warn("[callStore] Send ICE candidate signal failed:", err);
          }
        });
      } else {
        // Buffer local candidates until callId is available
        this.pendingLocalCandidates.push(payload);
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        if (this.activeSession) {
          this.activeSession.status = "accepted";
        }
        this.notify();
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        soundService.playCallConnectedTone();
        this.clearIceDisconnectTimer();
      } else if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        this.terminateCallLocally("ended");
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "disconnected") {
        this.handleIceDisconnected();
      } else if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        this.clearIceDisconnectTimer();
      } else if (pc.iceConnectionState === "failed") {
        const reason = "ICE candidate negotiation failed.";
        toast.error(reason);
        this.terminateCallWithFailure(reason);
      }
    };

    return pc;
  }

  private async flushPendingLocalCandidates(callId: string): Promise<void> {
    const list = [...this.pendingLocalCandidates];
    this.pendingLocalCandidates = [];
    for (const payload of list) {
      try {
        await connectApi.sendCallSignal(callId, payload);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[callStore] Flush pending local candidate failed:", err);
        }
      }
    }
  }

  private async drainPendingRemoteCandidates(): Promise<void> {
    if (!this.peerConnection || !this.peerConnection.remoteDescription) return;
    while (this.pendingRemoteCandidates.length > 0) {
      const cand = this.pendingRemoteCandidates.shift();
      if (cand) {
        try {
          await this.peerConnection.addIceCandidate(cand);
          this.remoteCandidateCount++;
        } catch (err) {
          if (import.meta.env.DEV) {
            console.warn("[callStore] Drain pending remote candidate failed:", err);
          }
        }
      }
    }
  }

  private async acquireUserMedia(callType: CallType): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: callType === "video" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  private async handleIncomingSignal(data: any): Promise<void> {
    if (!data) return;

    try {
      if (data.type === "candidate" && data.candidate) {
        const candidateInit: RTCIceCandidateInit = {
          candidate: data.candidate.candidate || data.candidate,
          sdpMid: data.candidate.sdpMid ?? null,
          sdpMLineIndex: data.candidate.sdpMLineIndex ?? null,
        };
        if (this.peerConnection && this.peerConnection.remoteDescription) {
          await this.peerConnection.addIceCandidate(candidateInit);
          this.remoteCandidateCount++;
        } else {
          this.pendingRemoteCandidates.push(candidateInit);
        }
        return;
      }

      if (!this.peerConnection) return;

      if (data.type === "answer" && data.sdp) {
        await this.peerConnection.setRemoteDescription({ type: "answer", sdp: data.sdp });
        this.clearRingingTimer();
        await this.drainPendingRemoteCandidates();
        if (this.activeSession) {
          this.activeSession.status = "accepted";
          this.notify();
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[callStore] Signaling handler error:", err);
      }
    }
  }

  private startRingingTimer(callId: string, role: "caller" | "recipient"): void {
    this.clearRingingTimer();
    this.ringingTimer = setTimeout(() => {
      this.ringingTimer = null;
      if (
        this.activeSession &&
        (this.activeSession.status === "initiating" || this.activeSession.status === "ringing")
      ) {
        const failureReason = "No answer";
        connectApi.updateCallStatus(callId, "missed", failureReason).catch((err) => {
          if (import.meta.env.DEV) {
            console.warn("[callStore] updateCallStatus on timeout failed:", err);
          }
        });
        toast.error(`Call ended: ${failureReason}`);
        this.terminateCallWithFailure(failureReason, "missed");
      }
    }, CALL_RINGING_TIMEOUT_MS);
  }

  private clearRingingTimer(): void {
    if (this.ringingTimer) {
      clearTimeout(this.ringingTimer);
      this.ringingTimer = null;
    }
  }

  private handleIceDisconnected(): void {
    if (this.activeSession?.status !== "accepted") return;
    this.activeSession.status = "reconnecting";
    this.notify();

    if (this.iceDisconnectTimer) return;
    this.iceDisconnectTimer = setTimeout(() => {
      this.iceDisconnectTimer = null;
      if (this.activeSession?.status === "reconnecting") {
        const reason = "Call disconnected: ICE connection lost";
        toast.error(reason);
        this.terminateCallWithFailure(reason, "failed");
      }
    }, ICE_DISCONNECT_GRACE_MS);
  }

  private clearIceDisconnectTimer(): void {
    if (this.iceDisconnectTimer) {
      clearTimeout(this.iceDisconnectTimer);
      this.iceDisconnectTimer = null;
    }
    if (this.activeSession?.status === "reconnecting") {
      this.activeSession.status = "accepted";
      this.notify();
    }
  }

  private terminateCallWithFailure(reason: string, status: CallStatus = "failed"): void {
    soundService.stopIncomingCallRing();
    this.cleanupMedia();
    if (this.activeSession) {
      this.activeSession.status = status;
      this.activeSession.failureReason = reason;
      this.notify();
    } else {
      this.activeSession = {
        callId: "",
        callerId: aurix.get().user?.id || "caller",
        callerName: aurix.get().user?.fullName || "Caller",
        recipientId: "",
        recipientName: "Colleague",
        callType: "audio",
        status,
        failureReason: reason,
        startedAt: new Date().toISOString(),
      };
      this.notify();
    }
    setTimeout(() => {
      if (this.activeSession?.status === status) {
        this.activeSession = null;
        this.notify();
      }
    }, 3000);
  }

  private terminateCallLocally(status: CallStatus, reason?: string): void {
    soundService.stopIncomingCallRing();
    if (this.activeSession && this.activeSession.status === "accepted") {
      soundService.playCallEndedTone();
    }
    this.cleanupMedia();
    if (this.activeSession) {
      this.activeSession.status = status;
      if (reason) this.activeSession.failureReason = reason;
      this.notify();
      setTimeout(() => {
        if (this.activeSession?.status === status) {
          this.activeSession = null;
          this.notify();
        }
      }, 1500);
    }
  }

  private cleanupMedia(): void {
    this.clearRingingTimer();
    this.clearIceDisconnectTimer();

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      this.remoteStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = null;
      this.peerConnection.ontrack = null;
      this.peerConnection.onconnectionstatechange = null;
      this.peerConnection.oniceconnectionstatechange = null;
      try {
        this.peerConnection.close();
      } catch {}
      this.peerConnection = null;
    }
    this.pendingLocalCandidates = [];
    this.pendingRemoteCandidates = [];
  }

  private notify(): void {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch {}
    });
  }
}

export const callManager = new CallManager();
