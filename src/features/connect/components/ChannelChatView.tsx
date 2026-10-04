import { useEffect, useState, useRef, useCallback } from "react";
import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import { soundService } from "../services/soundService";
import type { Channel, Message, MessageSendInput } from "../types";
import { MessageItem } from "./MessageItem";
import { MessageComposer } from "./MessageComposer";
import { ThreadSidebar } from "./ThreadSidebar";
import {
  Hash,
  Lock,
  Users,
  Archive,
  LogOut,
  Loader2,
  ChevronDown,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { aurix } from "@/lib/aurix-store";

interface ChannelChatViewProps {
  channelId: string;
}

export function ChannelChatView({ channelId }: ChannelChatViewProps) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThreadMessage, setActiveThreadMessage] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentUser = aurix.get().user;
  const navigate = useNavigate();

  // Load channel & message history
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [channelData, messagesResult] = await Promise.all([
        connectApi.getChannel(channelId),
        connectApi.getChannelMessages(channelId, { limit: 50 }),
      ]);
      setChannel(channelData);
      setMessages(messagesResult.items);
    } catch {
      toast.error("Failed to load channel messages");
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    loadData();
    setActiveThreadMessage(null);
  }, [channelId, loadData]);

  // Realtime listeners
  useEffect(() => {
    const unbindMessage = realtimeClient.on("message.created", (newMsg: any) => {
      if (newMsg && String(newMsg.channel_id || newMsg.channelId) === channelId) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.id === String(newMsg.id))) return prev;
          return [
            ...prev,
            {
              id: String(newMsg.id),
              channelId,
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

        // Play chime if message from someone else
        if (currentUser && String(newMsg.sender_id || newMsg.senderId) !== currentUser.id) {
          soundService.playMessageChime();
        }
      }
    });

    const unbindTyping = realtimeClient.on("typing.indicator", (data: any) => {
      if (data && String(data.channel_id || data.channelId) === channelId) {
        const name = data.user_name || "Someone";
        if (data.is_typing) {
          setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
        } else {
          setTypingUsers((prev) => prev.filter((n) => n !== name));
        }
      }
    });

    const unbindReconnect = realtimeClient.onReconnect(() => {
      // Re-synchronize on connection restore
      connectApi.getChannelMessages(channelId, { limit: 50 }).then((res) => {
        setMessages(res.items);
      }).catch((err) => {
        // Background sync on reconnect (Group b)
        if (import.meta.env.DEV) {
          console.warn("[ChannelChatView] Reconnect history sync failed:", err);
        }
      });
    });

    return () => {
      unbindMessage();
      unbindTyping();
      unbindReconnect();
    };
  }, [channelId, currentUser]);

  // Scroll to bottom on messages change if user is near bottom
  useEffect(() => {
    if (!scrollRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    if (isNearBottom) {
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
    const sent = await connectApi.sendChannelMessage(channelId, input);
    setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleLeaveChannel = async () => {
    try {
      await connectApi.leaveChannel(channelId);
      toast.success("Left channel");
      navigate({ to: "/dashboard/connect" });
    } catch {
      toast.error("Failed to leave channel");
    }
  };

  const handleArchiveChannel = async () => {
    try {
      await connectApi.archiveChannel(channelId);
      toast.success("Channel archived");
      navigate({ to: "/dashboard/connect" });
    } catch {
      toast.error("Failed to archive channel");
    }
  };

  if (loading && !channel) {
    return (
      <div className="flex h-full flex-1 items-center justify-center p-8 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        <span className="text-sm">Loading #{channelId}...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 min-w-0 overflow-hidden bg-background">
      {/* Main Channel Area */}
      <div className="flex h-full flex-1 flex-col min-w-0">
        {/* Channel Top Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4 bg-card/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {channel?.isPrivate ? (
              <Lock className="h-4 w-4 text-brand shrink-0" />
            ) : (
              <Hash className="h-4 w-4 text-brand shrink-0" />
            )}
            <h2 className="font-semibold text-base tracking-tight text-foreground truncate">
              {channel?.name || "Channel"}
            </h2>
            {channel?.topic ? (
              <>
                <span className="text-border">|</span>
                <span className="text-xs text-muted-foreground truncate hidden md:inline">
                  {channel.topic}
                </span>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
              <Users className="h-3.5 w-3.5" />
              <span>{channel?.memberCount || 1}</span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              title="Leave Channel"
              onClick={handleLeaveChannel}
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Leave</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              title="Archive Channel"
              onClick={handleArchiveChannel}
            >
              <Archive className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Message Feed Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto p-4 space-y-3"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <div className="h-12 w-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-3">
                <Hash className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Welcome to #{channel?.name}!
              </h3>
              <p className="mt-1 text-xs max-w-sm">
                This is the start of the #{channel?.name} channel. Be the first to share an announcement, question, or note.
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

          {/* Typing Indicator */}
          {typingUsers.length > 0 ? (
            <div className="flex items-center gap-1.5 px-4 py-1 text-xs text-muted-foreground italic">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              <span>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </span>
            </div>
          ) : null}

          {/* Floating Scroll to Bottom Button */}
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

        {/* Message Composer Area */}
        <div className="p-3 border-t border-border bg-card/30">
          <MessageComposer
            channelId={channelId}
            placeholder={`Message #${channel?.name || "channel"}...`}
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
