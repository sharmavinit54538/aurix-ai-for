import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import { soundService } from "../services/soundService";
import type { CallSession, CallStatus, CallType, IceServerConfig, SignalPayload } from "../types";

class CallManager {
  private activeSession: CallSession | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private iceServers: IceServerConfig[] = [{ urls: "stun:stun.l.google.com:19302" }];
  private subscribers = new Set<() => void>();
  private pendingCandidates: RTCIceCandidateInit[] = [];
  private isMuted = false;
  private isCameraOff = false;
  private isInitialized = false;

  public init(): void {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    // Preload ICE servers
    connectApi.getIceServers().then((servers) => {
      if (servers && servers.length > 0) {
        this.iceServers = servers;
      }
    }).catch((err) => {
      // Best-effort ICE server preload (Group b)
      if (import.meta.env.DEV) {
        console.warn("[callStore] Preload ICE servers failed:", err);
      }
    });

    // Listen for incoming calls
    realtimeClient.on("call.incoming", (data: any) => {
      if (!data?.call_id) return;
      if (this.activeSession && this.activeSession.status !== "ended") {
        // Send busy if already in another call
        connectApi.updateCallStatus(String(data.call_id), "busy").catch((err) => {
          // Best-effort busy status broadcast (Group b)
          if (import.meta.env.DEV) {
            console.warn("[callStore] Send busy status failed:", err);
          }
        });
        return;
      }

      this.activeSession = {
        callId: String(data.call_id),
        callerId: String(data.caller_id || ""),
        callerName: data.caller_name || "Colleague",
        callerAvatar: data.caller_avatar || null,
        recipientId: String(data.recipient_id || ""),
        callType: (data.call_type as CallType) || "audio",
        status: "ringing",
        sdpOffer: data.offer || data.sdp_offer,
        startedAt: new Date().toISOString(),
      };

      soundService.startIncomingCallRing();
      this.notify();
    });

    // Listen for incoming WebRTC signals
    realtimeClient.on("call.signaling", (data: any) => {
      this.handleIncomingSignal(data);
    });

    // Listen for remote call status changes
    realtimeClient.on("call.status", (data: any) => {
      if (data?.call_id && this.activeSession?.callId === String(data.call_id)) {
        const nextStatus = data.status as CallStatus;
        if (nextStatus === "rejected" || nextStatus === "busy" || nextStatus === "ended" || nextStatus === "missed") {
          this.terminateCallLocally(nextStatus);
        }
      }
    });
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

  public async startCall(recipient: { id: string; name: string; avatar?: string | null }, callType: CallType): Promise<void> {
    if (this.activeSession && this.activeSession.status !== "ended") {
      return;
    }

    try {
      // 1. Acquire local media
      this.localStream = await this.acquireUserMedia(callType);
      this.isMuted = false;
      this.isCameraOff = false;

      // 2. Set up peer connection
      this.peerConnection = this.createPeerConnection();

      // 3. Add local tracks
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // 4. Create and set local offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // 5. Initiate via backend REST contract
      const initResult = await connectApi.initiateCall(recipient.id, callType, {
        type: "offer",
        sdp: offer.sdp || "",
      });

      this.activeSession = {
        callId: initResult.callId,
        callerId: "me",
        callerName: "Me",
        recipientId: recipient.id,
        recipientName: recipient.name,
        recipientAvatar: recipient.avatar,
        callType,
        status: "initiating",
        startedAt: new Date().toISOString(),
      };

      this.notify();
    } catch (err: any) {
      this.cleanupMedia();
      throw err;
    }
  }

  // ── Accept Incoming Call ───────────────────────────────────

  public async acceptIncomingCall(): Promise<void> {
    if (!this.activeSession || this.activeSession.status !== "ringing") return;
    soundService.stopIncomingCallRing();

    try {
      // 1. Acquire local media
      this.localStream = await this.acquireUserMedia(this.activeSession.callType);
      this.isMuted = false;
      this.isCameraOff = false;

      // 2. Set up peer connection
      this.peerConnection = this.createPeerConnection();

      // 3. Add local tracks
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // 4. Set remote description from offer
      if (this.activeSession.sdpOffer) {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(this.activeSession.sdpOffer)
        );
        await this.drainPendingCandidates();
      }

      // 5. Create and set local answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // 6. Transmit answer via REST signaling
      await connectApi.sendCallSignal(this.activeSession.callId, {
        type: "answer",
        sdp: answer.sdp,
      });

      // 7. Update status to accepted
      await connectApi.updateCallStatus(this.activeSession.callId, "accepted");

      this.activeSession.status = "accepted";
      soundService.playCallConnectedTone();
      this.notify();
    } catch {
      this.rejectIncomingCall();
    }
  }

  // ── Reject Incoming Call ───────────────────────────────────

  public async rejectIncomingCall(): Promise<void> {
    soundService.stopIncomingCallRing();
    if (!this.activeSession) return;

    const callId = this.activeSession.callId;
    connectApi.updateCallStatus(callId, "rejected").catch((err) => {
      // Best-effort reject status sync (Group b)
      if (import.meta.env.DEV) {
        console.warn("[callStore] Update call status to rejected failed:", err);
      }
    });
    this.terminateCallLocally("rejected");
  }

  // ── End Active Call ────────────────────────────────────────

  public async endCall(): Promise<void> {
    soundService.stopIncomingCallRing();
    if (!this.activeSession) return;

    const callId = this.activeSession.callId;
    connectApi.updateCallStatus(callId, "ended").catch((err) => {
      // Best-effort end call status sync (Group b)
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

  // ── WebRTC Internals ───────────────────────────────────────

  private createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: this.iceServers,
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && this.activeSession?.callId) {
        const payload: SignalPayload = {
          type: "candidate",
          candidate: {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
          },
        };
        connectApi.sendCallSignal(this.activeSession.callId, payload).catch((err) => {
          // Best-effort candidate signaling (Group b)
          if (import.meta.env.DEV) {
            console.warn("[callStore] Send ICE candidate signal failed:", err);
          }
        });
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
      } else if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        this.terminateCallLocally("ended");
      }
    };

    return pc;
  }

  private async acquireUserMedia(callType: CallType): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: callType === "video" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  private async handleIncomingSignal(data: any): Promise<void> {
    if (!this.peerConnection || !data) return;

    try {
      if (data.type === "answer" && data.sdp) {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription({ type: "answer", sdp: data.sdp })
        );
        await this.drainPendingCandidates();
        if (this.activeSession) {
          this.activeSession.status = "accepted";
          this.notify();
        }
      } else if (data.type === "candidate" && data.candidate) {
        const candidateInit: RTCIceCandidateInit = {
          candidate: data.candidate.candidate || data.candidate,
          sdpMid: data.candidate.sdpMid ?? null,
          sdpMLineIndex: data.candidate.sdpMLineIndex ?? null,
        };
        if (this.peerConnection.remoteDescription) {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateInit));
        } else {
          this.pendingCandidates.push(candidateInit);
        }
      }
    } catch {
      // Safe catch for signaling race conditions
    }
  }

  private async drainPendingCandidates(): Promise<void> {
    if (!this.peerConnection || !this.peerConnection.remoteDescription) return;
    while (this.pendingCandidates.length > 0) {
      const cand = this.pendingCandidates.shift();
      if (cand) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(cand));
        } catch {}
      }
    }
  }

  private terminateCallLocally(status: CallStatus): void {
    soundService.stopIncomingCallRing();
    if (this.activeSession && this.activeSession.status === "accepted") {
      soundService.playCallEndedTone();
    }
    this.cleanupMedia();
    if (this.activeSession) {
      this.activeSession.status = status;
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
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((t) => t.stop());
      this.remoteStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.pendingCandidates = [];
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
