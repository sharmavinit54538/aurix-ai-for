import { useEffect, useState, useRef, useCallback } from "react";
import { connectApi } from "../connectApi";
import { realtimeClient, useIsRealtimeOpen } from "../services/realtimeClient";
import { soundService } from "../services/soundService";
import { callManager } from "../stores/callStore";
import { usePresence } from "../stores/presenceStore";
import type { DirectConversation, Message, MessageSendInput, PresenceStatus } from "../types";
import { MessageItem } from "./MessageItem";
import { MessageComposer } from "./MessageComposer";
import { ThreadSidebar } from "./ThreadSidebar";
import {
  Phone,
  Video,
  User,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { aurix } from "@/lib/aurix-store";

interface DirectMessageViewProps {
  conversationId: string;
}

export function DirectMessageView({ conversationId }: DirectMessageViewProps) {
  const [conversation, setConversation] = useState<DirectConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThreadMessage, setActiveThreadMessage] = useState<Message | null>(null);
  const isRealtimeOpen = useIsRealtimeOpen();
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentUser = aurix.get().user;
  const livePresence = usePresence(conversation?.participant.id);
  const currentPresence = livePresence ?? conversation?.participant.presence;

  // Load conversation and messages
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [allConvs, messagesResult] = await Promise.all([
        connectApi.listConversations(),
        connectApi.getConversationMessages(conversationId, { limit: 50 }),
      ]);
      const matched = allConvs.find((c) => c.id === conversationId);
      if (matched) {
        setConversation(matched);
      }
      setMessages(messagesResult.items);
    } catch {
      toast.error("Failed to load direct message history");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadData();
    setActiveThreadMessage(null);
  }, [conversationId, loadData]);

  // Realtime listeners
  useEffect(() => {
    const unbindMessage = realtimeClient.on("message.created", (newMsg: any) => {
      if (newMsg && String(newMsg.conversation_id || newMsg.conversationId) === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === String(newMsg.id))) return prev;
          return [
            ...prev,
            {
              id: String(newMsg.id),
              conversationId,
              senderId: String(newMsg.sender_id || newMsg.senderId),
              senderName: newMsg.sender_name || newMsg.senderName || "Colleague",
              senderAvatar: newMsg.sender_avatar || newMsg.senderAvatar || null,
              content: newMsg.content || "",
              isPinned: false,
              isEdited: false,
              attachments: newMsg.attachments || [],
              reactions: [],
              replyCount: 0,
              createdAt: newMsg.created_at || newMsg.createdAt || new Date().toISOString(),
            },
          ];
        });

        if (currentUser && String(newMsg.sender_id || newMsg.senderId) !== currentUser.id) {
          soundService.playMessageChime();
        }
      }
    });

    const unbindTyping = realtimeClient.on("typing.indicator", (data: any) => {
      if (data && String(data.conversation_id || data.conversationId) === conversationId) {
        setIsPeerTyping(Boolean(data.is_typing));
      }
    });

    const unbindReconnect = realtimeClient.onReconnect(() => {
      connectApi.getConversationMessages(conversationId, { limit: 50 }).then((res) => {
        setMessages(res.items);
      }).catch((err) => {
        // Background sync on reconnect (Group b)
        if (import.meta.env.DEV) {
          console.warn("[DirectMessageView] Reconnect history sync failed:", err);
        }
      });
    });

    return () => {
      unbindMessage();
      unbindTyping();
      unbindReconnect();
    };
  }, [conversationId, currentUser]);

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop - clientHeight < 150) {
      scrollRef.current.scrollTop = scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 200);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  const handleSendMessage = async (input: MessageSendInput) => {
    const sent = await connectApi.sendConversationMessage(conversationId, input);
    setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const startCall = (type: "audio" | "video") => {
    if (!conversation || !isRealtimeOpen) return;
    callManager.startCall(conversation.participant, type).catch((err) => {
      toast.error(err?.message || `Could not initiate ${type} call.`);
    });
  };

  const getStatusBadge = (st?: PresenceStatus) => {
    switch (st) {
      case "online":
        return <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Online</span>;
      case "away":
        return <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Away</span>;
      case "offline":
        return <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />Offline</span>;
      default:
        return null;
    }
  };

  if (loading && !conversation) {
    return (
      <div className="flex h-full flex-1 items-center justify-center p-8 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        <span className="text-sm">Loading direct conversation...</span>
      </div>
    );
  }

  const participant = conversation?.participant;

  return (
    <div className="flex h-full flex-1 min-w-0 overflow-hidden bg-background">
      {/* Main Conversation Feed */}
      <div className="flex h-full flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4 bg-card/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs overflow-hidden shrink-0">
              {participant?.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-sm text-foreground truncate">
                {participant?.name || (participant?.email ? participant.email : "Unnamed user")}
              </h2>
              <div>{getStatusBadge(currentPresence)}</div>
            </div>
          </div>

          {/* Quick Call Action Triggers */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isRealtimeOpen}
              onClick={() => startCall("audio")}
              title={isRealtimeOpen ? "Start Audio Call" : "Realtime connection not available"}
            >
              <Phone className="h-3.5 w-3.5 text-brand" />
              <span className="hidden sm:inline">Audio</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isRealtimeOpen}
              onClick={() => startCall("video")}
              title={isRealtimeOpen ? "Start Video Call" : "Realtime connection not available"}
            >
              <Video className="h-3.5 w-3.5 text-brand" />
              <span className="hidden sm:inline">Video</span>
            </Button>
          </div>
        </div>

        {/* Messages List */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto p-4 space-y-3"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <div className="h-12 w-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
                <User className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Chat with {participant?.name}
              </h3>
              <p className="mt-1 text-xs max-w-sm">
                This is the beginning of your direct conversation history.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                currentUserId={currentUser?.id}
                onOpenThread={(parent) => setActiveThreadMessage(parent)}
                onDeleted={(deletedId) =>
                  setMessages((prev) => prev.filter((m) => m.id !== deletedId))
                }
                onUpdated={(updated) =>
                  setMessages((prev) =>
                    prev.map((m) => (m.id === updated.id ? updated : m))
                  )
                }
              />
            ))
          )}

          {/* Peer Typing Indicator */}
          {isPeerTyping ? (
            <div className="flex items-center gap-1.5 px-4 py-1 text-xs text-muted-foreground italic">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              <span>{participant?.name || "Colleague"} is typing...</span>
            </div>
          ) : null}

          {showScrollBottom ? (
            <button
              onClick={scrollToBottom}
              className="sticky bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1 text-xs font-semibold text-foreground shadow-lg backdrop-blur-sm hover:bg-accent cursor-pointer transition-all"
            >
              <span>Scroll to recent</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {/* Composer */}
        <div className="p-3 border-t border-border bg-card/30">
          <MessageComposer
            conversationId={conversationId}
            placeholder={`Message ${participant?.name || "colleague"}...`}
            onSend={handleSendMessage}
          />
        </div>
      </div>

      {/* Slide-over Thread Sidebar */}
      {activeThreadMessage ? (
        <ThreadSidebar
          parentMessage={activeThreadMessage}
          currentUserId={currentUser?.id}
          onClose={() => setActiveThreadMessage(null)}
          onReplyCountUpdated={(id, count) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === id ? { ...m, replyCount: count } : m))
            );
          }}
        />
      ) : null}
    </div>
  );
}
