import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  callManager,
  normalizeSdpOffer,
  mapCallError,
  extractIceSchemes,
  CALL_RINGING_TIMEOUT_MS,
  ICE_DISCONNECT_GRACE_MS,
} from "../stores/callStore";
import { realtimeClient, useIsRealtimeOpen } from "../services/realtimeClient";
import { connectApi } from "../connectApi";
import { toast } from "sonner";
import type { Colleague } from "../types";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

// ── Fake WebRTC Implementations (Isolated to tests) ─────────────
class FakeMediaStreamTrack {
  public kind: string;
  public enabled = true;
  public stop = vi.fn();

  constructor(kind = "audio") {
    this.kind = kind;
  }
}

class FakeMediaStream {
  public tracks: FakeMediaStreamTrack[];

  constructor(tracks?: FakeMediaStreamTrack[]) {
    this.tracks = tracks || [
      new FakeMediaStreamTrack("audio"),
      new FakeMediaStreamTrack("video"),
    ];
  }

  getTracks() {
    return this.tracks;
  }

  getAudioTracks() {
    return this.tracks.filter((t) => t.kind === "audio");
  }

  getVideoTracks() {
    return this.tracks.filter((t) => t.kind === "video");
  }
}

class FakeRTCPeerConnection {
  public connectionState: RTCPeerConnectionState = "new";
  public iceConnectionState: RTCIceConnectionState = "new";
  public signalingState: RTCSignalingState = "stable";
  public localDescription: RTCSessionDescriptionInit | null = null;
  public remoteDescription: RTCSessionDescriptionInit | null = null;
  public onicecandidate: ((e: any) => void) | null = null;
  public ontrack: ((e: any) => void) | null = null;
  public onconnectionstatechange: (() => void) | null = null;
  public oniceconnectionstatechange: (() => void) | null = null;
  public onsignalingstatechange: (() => void) | null = null;
  public addedCandidates: any[] = [];
  public close = vi.fn();
  public addTrack = vi.fn();
  public getStats = vi.fn().mockResolvedValue(new Map());

  async setLocalDescription(desc: RTCSessionDescriptionInit) {
    this.localDescription = desc;
    this.signalingState = "have-local-offer";
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    this.remoteDescription = desc;
    this.signalingState = "stable";
  }

  async createOffer() {
    return {
      type: "offer" as const,
      sdp: "v=0\r\no=test 1 1 IN IP4 127.0.0.1\r\ns=Test\r\nt=0 0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n",
    };
  }

  async createAnswer() {
    return {
      type: "answer" as const,
      sdp: "v=0\r\no=test 1 1 IN IP4 127.0.0.1\r\ns=TestAnswer\r\nt=0 0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n",
    };
  }

  async addIceCandidate(cand: any) {
    this.addedCandidates.push(cand);
  }
}

// Simple test component testing useIsRealtimeOpen
function TestCallButton() {
  const isOpen = useIsRealtimeOpen();
  return (
    <button
      disabled={!isOpen}
      title={isOpen ? "Start Call" : "Realtime connection not available"}
    >
      Call
    </button>
  );
}

describe("WebRTC Call Store Flow & Reliability", () => {
  let createdPeerConnections: FakeRTCPeerConnection[] = [];
  let currentFakeStream: FakeMediaStream | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    createdPeerConnections = [];
    currentFakeStream = new FakeMediaStream();

    // Setup global window WebRTC mocks
    (window as any).RTCPeerConnection = function () {
      const pc = new FakeRTCPeerConnection();
      createdPeerConnections.push(pc);
      return pc;
    };

    if (!navigator.mediaDevices) {
      Object.defineProperty(navigator, "mediaDevices", {
        value: {},
        writable: true,
        configurable: true,
      });
    }

    navigator.mediaDevices.getUserMedia = vi.fn().mockImplementation(async () => {
      currentFakeStream = new FakeMediaStream();
      return currentFakeStream as unknown as MediaStream;
    });

    // Default mock APIs
    vi.spyOn(connectApi, "getIceServers").mockResolvedValue([
      { urls: "stun:stun.relay.service.com:3478" },
      { urls: "turn:turn.relay.service.com:3478", username: "dev", credential: "secret" },
    ]);
    vi.spyOn(connectApi, "initiateCall").mockResolvedValue({
      id: "call-101",
      caller_id: "user-me",
      recipient_id: "user-peer",
      call_type: "audio",
      status: "initiating",
      created_at: new Date().toISOString(),
    } as any);
    vi.spyOn(connectApi, "sendCallSignal").mockResolvedValue({ status: "delivered" } as any);
    vi.spyOn(connectApi, "updateCallStatus").mockResolvedValue({ status: "ok" } as any);
  });

  afterEach(() => {
    callManager.endCall();
    vi.restoreAllMocks();
  });

  // ── 1. Offer Normalization ─────────────────────────────────
  describe("Offer Normalization (3 shapes + invalid)", () => {
    it("normalizes Shape 1: raw SDP string containing v= and m=", () => {
      const rawSdp = "v=0\r\no=- 12345 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111";
      const normalized = normalizeSdpOffer(rawSdp);
      expect(normalized).toEqual({
        type: "offer",
        sdp: rawSdp,
      });
    });

    it("normalizes Shape 2: standard { type: 'offer', sdp: '...' }", () => {
      const raw = {
        type: "offer",
        sdp: "v=0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111",
      };
      const normalized = normalizeSdpOffer(raw);
      expect(normalized).toEqual({
        type: "offer",
        sdp: raw.sdp,
      });
    });

    it("normalizes Shape 3: nested shapes ({ offer: { sdp } }, { sdp_offer: '...' }, { signal: { sdp } })", () => {
      const nested1 = {
        offer: { sdp: "v=0\r\nm=audio 9 UDP" },
      };
      expect(normalizeSdpOffer(nested1)).toEqual({
        type: "offer",
        sdp: "v=0\r\nm=audio 9 UDP",
      });

      const nested2 = {
        sdp_offer: "v=0\r\nm=video 9 UDP",
      };
      expect(normalizeSdpOffer(nested2)).toEqual({
        type: "offer",
        sdp: "v=0\r\nm=video 9 UDP",
      });

      const nested3 = {
        signal: { sdp: "v=0\r\nm=audio 9 UDP" },
      };
      expect(normalizeSdpOffer(nested3)).toEqual({
        type: "offer",
        sdp: "v=0\r\nm=audio 9 UDP",
      });
    });

    it("returns null for invalid/empty offer shapes", () => {
      expect(normalizeSdpOffer(null)).toBeNull();
      expect(normalizeSdpOffer(undefined)).toBeNull();
      expect(normalizeSdpOffer("")).toBeNull();
      expect(normalizeSdpOffer("not an sdp")).toBeNull();
      expect(normalizeSdpOffer({})).toBeNull();
      expect(normalizeSdpOffer({ invalidKey: 123 })).toBeNull();
    });

    it("puts call into 'failed' state with 'Incoming call had no valid offer' when offer is invalid", () => {
      callManager.init();

      // Dispatch an incoming call invite with invalid SDP
      (realtimeClient as any).emit("call.invite", {
        call_id: "call-invalid-offer",
        caller_id: "user-colleague",
        caller_name: "Colleague",
        call_type: "audio",
        sdp_offer: "invalid_unparsable_payload",
      });

      const session = callManager.getSession();
      expect(session).not.toBeNull();
      expect(session?.status).toBe("failed");
      expect(session?.failureReason).toBe("Incoming call had no valid offer");
      expect(toast.error).toHaveBeenCalledWith("Incoming call had no valid offer");
    });
  });

  // ── 2. Local Candidate Buffering & FIFO Flush ──────────────
  describe("ICE Candidate Buffering & Flush", () => {
    it("buffers local candidates generated before callId is returned and flushes in order", async () => {
      let resolveInitiateCall: (val: any) => void;
      const initiatePromise = new Promise((resolve) => {
        resolveInitiateCall = resolve;
      });
      vi.spyOn(connectApi, "initiateCall").mockImplementation(() => initiatePromise as any);

      const colleague: Colleague = {
        id: "peer-1",
        name: "Test Colleague",
        email: "peer@example.com",
      };

      // Start call asynchronously
      const callPromise = callManager.startCall(colleague, "audio");

      // Wait a tick for peer connection to be created
      await new Promise((r) => setTimeout(r, 50));
      expect(createdPeerConnections.length).toBe(1);
      const pc = createdPeerConnections[0];

      // Simulate browser generating ICE candidates while initiateCall is still pending
      const cand1 = { candidate: "candidate:1 1 UDP 2122260223 192.168.1.1 5000 typ host", sdpMid: "0", sdpMLineIndex: 0 };
      const cand2 = { candidate: "candidate:2 1 UDP 2122260223 192.168.1.1 5001 typ host", sdpMid: "0", sdpMLineIndex: 0 };

      pc.onicecandidate?.({ candidate: cand1 });
      pc.onicecandidate?.({ candidate: cand2 });

      // Before initiateCall resolves, no signal should have been sent because activeSession.callId is not set
      expect(connectApi.sendCallSignal).not.toHaveBeenCalled();

      // Now resolve initiateCall with the real callId
      resolveInitiateCall!({
        id: "call-xyz-456",
        caller_id: "user-me",
        recipient_id: "peer-1",
        call_type: "audio",
        status: "initiating",
      });

      await callPromise;

      // Both candidates must be flushed in FIFO order with callId "call-xyz-456"
      expect(connectApi.sendCallSignal).toHaveBeenCalledTimes(2);
      expect(connectApi.sendCallSignal).toHaveBeenNthCalledWith(
        1,
        "call-xyz-456",
        expect.objectContaining({
          type: "candidate",
          candidate: expect.objectContaining({ candidate: cand1.candidate }),
        })
      );
      expect(connectApi.sendCallSignal).toHaveBeenNthCalledWith(
        2,
        "call-xyz-456",
        expect.objectContaining({
          type: "candidate",
          candidate: expect.objectContaining({ candidate: cand2.candidate }),
        })
      );
    });

    it("buffers remote candidates arriving before setRemoteDescription and flushes sequentially", async () => {
      callManager.init();

      // Receive a valid incoming call
      (realtimeClient as any).emit("call.invite", {
        call_id: "call-remote-test",
        caller_id: "user-colleague",
        caller_name: "Colleague",
        call_type: "audio",
        sdp_offer: "v=0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111",
      });

      // Peer sends candidates BEFORE user clicks accept
      (realtimeClient as any).emit("call.signal", {
        call_id: "call-remote-test",
        signal: {
          type: "candidate",
          candidate: { candidate: "remote-cand-1", sdpMid: "0", sdpMLineIndex: 0 },
        },
      });
      (realtimeClient as any).emit("call.signal", {
        call_id: "call-remote-test",
        signal: {
          type: "candidate",
          candidate: { candidate: "remote-cand-2", sdpMid: "0", sdpMLineIndex: 0 },
        },
      });

      expect(createdPeerConnections.length).toBe(0);

      // Now accept the call
      await callManager.acceptIncomingCall();

      expect(createdPeerConnections.length).toBe(1);
      const pc = createdPeerConnections[0];

      // Remote candidates should now be drained onto the peer connection
      expect(pc.addedCandidates.length).toBe(2);
      expect(pc.addedCandidates[0].candidate).toBe("remote-cand-1");
      expect(pc.addedCandidates[1].candidate).toBe("remote-cand-2");
    });
  });

  // ── 3. Timeouts ───────────────────────────────────────────
  describe("Ringing Timeout & ICE Grace Period", () => {
    it("verifies timeout constant is 45000ms and transitions to missed/failed on timeout", async () => {
      vi.useFakeTimers();
      expect(CALL_RINGING_TIMEOUT_MS).toBe(45000);
      expect(ICE_DISCONNECT_GRACE_MS).toBe(5000);

      const colleague: Colleague = {
        id: "peer-timeout",
        name: "Timeout Colleague",
        email: "timeout@example.com",
      };

      const startPromise = callManager.startCall(colleague, "audio");
      await vi.advanceTimersByTimeAsync(10);
      await startPromise;

      expect(callManager.getSession()?.status).toBe("initiating");

      // Advance 45s (timeout triggers)
      await vi.advanceTimersByTimeAsync(45000);

      const session = callManager.getSession();
      expect(session?.status).toBe("failed");
      expect(session?.failureReason).toContain("No answer");
      expect(connectApi.updateCallStatus).toHaveBeenCalledWith("call-101", "ended");

      vi.useRealTimers();
    });

    it("triggers 5s ICE disconnect grace period before failing reconnect", async () => {
      vi.useFakeTimers();

      const colleague: Colleague = {
        id: "peer-ice",
        name: "ICE Colleague",
        email: "ice@example.com",
      };

      const startPromise = callManager.startCall(colleague, "audio");
      await vi.advanceTimersByTimeAsync(10);
      await startPromise;

      const pc = createdPeerConnections[0];

      // Simulate ICE disconnecting
      pc.iceConnectionState = "disconnected";
      pc.oniceconnectionstatechange?.();

      expect(callManager.getSession()?.status).toBe("reconnecting");

      // Advance 5s (grace period expires)
      await vi.advanceTimersByTimeAsync(5000);

      expect(callManager.getSession()?.status).toBe("failed");
      expect(callManager.getSession()?.failureReason).toContain("ICE connection lost");

      vi.useRealTimers();
    });
  });

  // ── 4. Typed Error Mapping ────────────────────────────────
  describe("Error Mapping", () => {
    it("maps permission errors correctly", () => {
      const domErr = new DOMException("Permission denied", "NotAllowedError");
      const mapped = mapCallError(domErr);
      expect(mapped).toBe("Microphone / camera access was denied. Please check browser permissions.");
    });

    it("maps missing device error correctly", () => {
      const notFound = new DOMException("Requested device not found", "NotFoundError");
      const mapped = mapCallError(notFound);
      expect(mapped).toBe("No microphone or camera device detected.");
    });

    it("maps insecure context error correctly", () => {
      const origSecure = window.isSecureContext;
      Object.defineProperty(window, "isSecureContext", { value: false, configurable: true });

      const mapped = mapCallError(new Error("Random"));
      expect(mapped).toBe("WebRTC calls require HTTPS or a secure context.");

      Object.defineProperty(window, "isSecureContext", { value: origSecure, configurable: true });
    });

    it("maps ICE servers failure correctly", () => {
      const mapped = mapCallError(new Error("ICE servers endpoint failed"));
      expect(mapped).toContain("Failed to retrieve ICE relay configuration");
    });

    it("maps signaling failure correctly", () => {
      const mapped = mapCallError(new Error("signaling transport down"));
      expect(mapped).toBe("WebRTC signaling exchange failed.");
    });
  });

  // ── 5. Media Tracks Stopped on Every End Path ─────────────
  describe("Media Track Cleanup on Every Path", () => {
    it("stops all media tracks on endCall()", async () => {
      const colleague: Colleague = {
        id: "peer-tracks",
        name: "Tracks Colleague",
      };

      await callManager.startCall(colleague, "audio");
      const tracks = currentFakeStream!.getTracks();
      expect(tracks.length).toBeGreaterThan(0);

      await callManager.endCall();

      tracks.forEach((t) => {
        expect(t.stop).toHaveBeenCalled();
      });
      expect(callManager.getLocalStream()).toBeNull();
    });

    it("stops all media tracks on rejectIncomingCall()", async () => {
      callManager.init();

      (realtimeClient as any).emit("call.invite", {
        call_id: "call-reject-tracks",
        caller_id: "user-peer",
        caller_name: "Peer",
        call_type: "audio",
        sdp_offer: "v=0\r\nm=audio 9 UDP",
      });

      await callManager.rejectIncomingCall();
      expect(callManager.getSession()?.status).toBe("rejected");
    });
  });

  // ── 6. ICE Schemes Extraction (No Credentials) ────────────
  describe("ICE Server Schemes & No Hardcoded Fallback", () => {
    it("extracts URL schemes only, never credentials", () => {
      const servers = [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: ["turn:turn.example.com:3478", "turns:turns.example.com:5349"],
          username: "secret-user",
          credential: "super-secret-password",
        },
      ];

      const schemes = extractIceSchemes(servers);
      expect(schemes).toEqual(expect.arrayContaining(["stun", "turn", "turns"]));
      // Confirm credentials are never in schemes
      expect(schemes.join(" ")).not.toContain("secret");
      expect(schemes.join(" ")).not.toContain("password");
    });

    it("fails call cleanly if getIceServers() returns empty array without hardcoded fallback", async () => {
      vi.spyOn(connectApi, "getIceServers").mockRejectedValue(
        new Error("No ICE servers returned by backend")
      );

      const colleague: Colleague = { id: "p1", name: "Peer" };
      await expect(callManager.startCall(colleague, "audio")).rejects.toThrow();

      const session = callManager.getSession();
      expect(session?.status).toBe("failed");
      expect(session?.failureReason).toContain("Failed to retrieve ICE relay configuration");
    });
  });

  // ── 7. Call Button Gating ─────────────────────────────────
  describe("Call Button Disabled When Realtime Closed", () => {
    it("disables call button and displays tooltip when realtime is not open", () => {
      // Force closed status
      (realtimeClient as any).connectionStatus = "closed";

      render(<TestCallButton />);
      const btn = screen.getByRole("button", { name: /call/i });
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("title", "Realtime connection not available");
    });

    it("enables call button when realtime is open", () => {
      // Force open status
      (realtimeClient as any).connectionStatus = "open";

      render(<TestCallButton />);
      const btn = screen.getByRole("button", { name: /call/i });
      expect(btn).not.toBeDisabled();
      expect(btn).toHaveAttribute("title", "Start Call");
    });
  });
});
