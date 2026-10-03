import { useEffect, useState, useRef } from "react";
import { callManager } from "../stores/callStore";
import type { CallSession } from "../types";
import { Button } from "@/components/ui/button";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  User,
  Volume2,
} from "lucide-react";

export function GlobalCallOverlay() {
  const [session, setSession] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    callManager.init();
    const unsubscribe = callManager.subscribe(() => {
      setSession(callManager.getSession());
      setIsMuted(callManager.getIsMuted());
      setIsCameraOff(callManager.getIsCameraOff());
    });
    return unsubscribe;
  }, []);

  // Attach local and remote media streams to video elements
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = callManager.getLocalStream();
    }
  }, [session?.status, isCameraOff]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = callManager.getRemoteStream();
    }
  }, [session?.status]);

  // Duration counter when call is accepted
  useEffect(() => {
    if (session?.status !== "accepted") {
      setDuration(0);
      return;
    }
    const interval = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [session?.status]);

  if (!session) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  // ── 1. Incoming Call Prompt ──────────────────────────────
  if (session.status === "ringing" && session.callerId !== "me") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-glow animate-pulse">
            {session.callerAvatar ? (
              <img
                src={session.callerAvatar}
                alt={session.callerName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-primary" />
            )}
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {session.callerName}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Volume2 className="h-4 w-4 animate-bounce text-brand" />
            Incoming {session.callType === "video" ? "Video" : "Audio"} Call...
          </p>

          <div className="mt-8 flex items-center justify-center gap-6">
            <Button
              size="lg"
              variant="destructive"
              className="h-14 w-14 rounded-full p-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => callManager.rejectIncomingCall()}
              title="Decline"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white p-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => callManager.acceptIncomingCall()}
              title="Accept"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Outgoing Initiating Prompt ────────────────────────
  if (session.status === "initiating") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-glow animate-pulse">
            <User className="h-10 w-10 text-primary" />
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {session.recipientName || "Colleague"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Calling ({session.callType})...
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              variant="destructive"
              className="h-14 w-14 rounded-full p-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => callManager.endCall()}
              title="Cancel"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── 3. Active Call Window ────────────────────────────────
  if (session.status === "accepted") {
    const isVideo = session.callType === "video";

    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-2.5 bg-muted/40">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold truncate text-foreground">
              {session.callerId === "me" ? session.recipientName : session.callerName}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Media Frame */}
        <div className="relative aspect-video bg-neutral-900 flex items-center justify-center overflow-hidden">
          {isVideo ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              {/* Picture-in-Picture Local Video */}
              <div className="absolute top-2 right-2 h-20 w-28 rounded-lg overflow-hidden border border-white/20 shadow-md bg-black">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${isCameraOff ? "hidden" : ""}`}
                />
                {isCameraOff ? (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-muted-foreground">
                    Camera Off
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <div className="h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center text-primary shadow-glow">
                <User className="h-8 w-8" />
              </div>
              <p className="text-xs font-medium text-neutral-300">
                Audio Call Connected
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 p-3 bg-card">
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "secondary"}
            className="rounded-full p-2.5 h-10 w-10 cursor-pointer"
            onClick={() => callManager.toggleMute()}
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {isVideo ? (
            <Button
              size="sm"
              variant={isCameraOff ? "destructive" : "secondary"}
              className="rounded-full p-2.5 h-10 w-10 cursor-pointer"
              onClick={() => callManager.toggleCamera()}
              title={isCameraOff ? "Turn Video On" : "Turn Video Off"}
            >
              {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
          ) : null}

          <Button
            size="sm"
            variant="destructive"
            className="rounded-full p-2.5 h-10 w-10 cursor-pointer bg-red-600 hover:bg-red-700"
            onClick={() => callManager.endCall()}
            title="End Call"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Ended flash state
  if (session.status === "rejected" || session.status === "busy" || session.status === "ended") {
    return (
      <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-2.5 shadow-lg flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-150">
        <PhoneOff className="h-4 w-4 text-destructive" />
        <span>Call {session.status}.</span>
      </div>
    );
  }

  return null;
}
