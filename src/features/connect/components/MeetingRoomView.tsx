import { useEffect, useState, useRef } from "react";
import { meetingManager } from "../stores/meetingStore";
import type { MeetingSession } from "../types";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  Send,
  Loader2,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { aurix } from "@/lib/aurix-store";

interface MeetingRoomViewProps {
  meetingId: string;
}

export function MeetingRoomView({ meetingId }: MeetingRoomViewProps) {
  const [meeting, setMeeting] = useState<MeetingSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatList, setChatList] = useState(meetingManager.getChatMessages());
  const [connecting, setConnecting] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const currentUser = aurix.get().user;

  useEffect(() => {
    meetingManager.init();

    setConnecting(true);
    meetingManager
      .joinMeeting(meetingId)
      .then(() => {
        setMeeting(meetingManager.getActiveMeeting());
        setIsMuted(meetingManager.getIsMuted());
        setIsCameraOff(meetingManager.getIsCameraOff());
      })
      .catch((err) => {
        toast.error("Could not join meeting. Check permissions.");
        navigate({ to: "/dashboard/meetings" });
      })
      .finally(() => setConnecting(false));

    const unsubscribe = meetingManager.subscribe(() => {
      setMeeting(meetingManager.getActiveMeeting());
      setIsMuted(meetingManager.getIsMuted());
      setIsCameraOff(meetingManager.getIsCameraOff());
      setChatList([...meetingManager.getChatMessages()]);
    });

    return () => {
      unsubscribe();
      meetingManager.leaveMeeting();
    };
  }, [meetingId, navigate]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = meetingManager.getLocalStream();
    }
  }, [connecting, isCameraOff]);

  const handleLeave = async () => {
    await meetingManager.leaveMeeting();
    toast.success("Left meeting");
    navigate({ to: "/dashboard/meetings" });
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const txt = chatMessage.trim();
    setChatMessage("");
    await meetingManager.sendMessage(txt);
  };

  if (connecting) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-950 text-white gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <h2 className="text-base font-semibold">Joining meeting room...</h2>
        <p className="text-xs text-neutral-400">Negotiating audio and video channels</p>
      </div>
    );
  }

  const remoteStreams = meetingManager.getRemoteStreams();
  const remoteUserIds = Array.from(remoteStreams.keys());

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-neutral-950 text-white rounded-xl">
      {/* Main Video Arena */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Meeting Title Bar */}
        <div className="flex h-12 items-center justify-between border-b border-white/10 px-4 bg-neutral-900/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-semibold truncate">
              {meeting?.title || "OFC360 Connect Meeting"}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Users className="h-3.5 w-3.5" />
            <span>{(meeting?.participants.length || 0) + 1} participant(s)</span>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 grid gap-4 p-4 auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
          {/* Local Participant Tile */}
          <div className="relative aspect-video rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-lg flex items-center justify-center">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${isCameraOff ? "hidden" : ""}`}
            />
            {isCameraOff ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center text-primary font-bold text-lg">
                  {currentUser?.fullName ? currentUser.fullName.slice(0, 2) : "Me"}
                </div>
                <span className="text-xs text-neutral-400">Camera Off</span>
              </div>
            ) : null}

            {/* Label Overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs backdrop-blur-sm">
              <span>{currentUser?.fullName || "You"} (You)</span>
              {isMuted ? <MicOff className="h-3 w-3 text-destructive" /> : null}
            </div>
          </div>

          {/* Remote Participants Tiles */}
          {remoteUserIds.map((userId) => {
            const stream = remoteStreams.get(userId);
            const partInfo = meeting?.participants.find((p) => p.userId === userId);

            return (
              <RemoteVideoTile
                key={userId}
                userId={userId}
                stream={stream}
                name={partInfo?.name || "Participant"}
              />
            );
          })}
        </div>

        {/* Bottom Meeting Controls Bar */}
        <div className="flex h-16 items-center justify-center gap-3 border-t border-white/10 bg-neutral-900/90 px-4 backdrop-blur-md">
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "secondary"}
            className="h-11 w-11 rounded-full p-0 cursor-pointer shadow-md"
            onClick={() => meetingManager.toggleMute()}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button
            size="sm"
            variant={isCameraOff ? "destructive" : "secondary"}
            className="h-11 w-11 rounded-full p-0 cursor-pointer shadow-md"
            onClick={() => meetingManager.toggleCamera()}
            title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </Button>

          <Button
            size="sm"
            variant={showChat ? "default" : "secondary"}
            className="h-11 w-11 rounded-full p-0 cursor-pointer shadow-md relative"
            onClick={() => setShowChat((v) => !v)}
            title="Meeting Chat"
          >
            <MessageSquare className="h-4 w-4" />
            {chatList.length > 0 && !showChat ? (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand text-[10px] flex items-center justify-center font-bold">
                {chatList.length}
              </span>
            ) : null}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="h-11 px-5 rounded-full font-semibold gap-1.5 cursor-pointer bg-red-600 hover:bg-red-700 shadow-md ml-2"
            onClick={handleLeave}
          >
            <PhoneOff className="h-4 w-4" />
            <span>Leave</span>
          </Button>
        </div>
      </div>

      {/* Slide-over Meeting Chat Drawer */}
      {showChat ? (
        <div className="w-80 border-l border-white/10 bg-neutral-900 flex flex-col h-full animate-in slide-in-from-right duration-200">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              In-Meeting Chat
            </h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatList.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No chat messages in this meeting yet.
              </div>
            ) : (
              chatList.map((c) => (
                <div key={c.id} className="rounded-lg bg-white/5 p-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span className="font-semibold text-white">{c.senderName}</span>
                    <span className="text-[10px]">
                      {new Date(c.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-neutral-200 break-words">{c.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-white/10 flex gap-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Send message to everyone..."
              className="bg-neutral-800 border-neutral-700 text-xs text-white"
            />
            <Button size="sm" type="submit" className="h-9 px-3 shrink-0">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function RemoteVideoTile({
  userId,
  stream,
  name,
}: {
  userId: string;
  stream?: MediaStream;
  name: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-lg flex items-center justify-center">
      {stream ? (
        <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center text-primary font-bold text-lg">
            {name.slice(0, 2)}
          </div>
          <span className="text-xs text-neutral-400">Connecting video...</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs backdrop-blur-sm">
        {name}
      </div>
    </div>
  );
}
