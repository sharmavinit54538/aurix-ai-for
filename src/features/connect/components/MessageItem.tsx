import { useState } from "react";
import type { Message } from "../types";
import { connectApi } from "../connectApi";
import {
  Smile,
  MessageSquare,
  Pin,
  Trash2,
  FileText,
  Download,
  MoreVertical,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
  currentUserId?: string;
  onOpenThread?: (message: Message) => void;
  onDeleted?: (messageId: string) => void;
  onUpdated?: (message: Message) => void;
}

const COMMON_EMOJIS = ["👍", "❤️", "🎉", "🔥", "🚀", "👀"];

export function MessageItem({
  message,
  currentUserId,
  onOpenThread,
  onDeleted,
  onUpdated,
}: MessageItemProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isOwn = currentUserId ? message.senderId === currentUserId : false;

  const handleToggleReaction = async (emoji: string) => {
    try {
      await connectApi.toggleReaction(message.id, emoji);
      // Optimistic update
      const existing = message.reactions.find((r) => r.emoji === emoji);
      let updatedReactions = [...message.reactions];
      if (existing) {
        if (existing.userIds.includes(currentUserId || "")) {
          existing.count = Math.max(0, existing.count - 1);
          existing.userIds = existing.userIds.filter((id) => id !== currentUserId);
        } else {
          existing.count += 1;
          if (currentUserId) existing.userIds.push(currentUserId);
        }
        updatedReactions = updatedReactions.filter((r) => r.count > 0);
      } else {
        updatedReactions.push({
          emoji,
          count: 1,
          userIds: currentUserId ? [currentUserId] : [],
        });
      }
      onUpdated?.({ ...message, reactions: updatedReactions });
    } catch {
      toast.error("Failed to update reaction");
    }
    setShowEmojiPicker(false);
  };

  const handleTogglePin = async () => {
    const nextPin = !message.isPinned;
    try {
      await connectApi.pinMessage(message.id, nextPin);
      onUpdated?.({ ...message, isPinned: nextPin });
    } catch {
      toast.error("Failed to update pinned status");
    }
  };

  const handleDelete = async () => {
    try {
      await connectApi.deleteMessage(message.id);
      onDeleted?.(message.id);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`group relative flex gap-3 px-4 py-2 hover:bg-muted/40 transition-colors rounded-lg ${
        message.isPinned ? "bg-amber-500/5 border-l-2 border-amber-500" : ""
      }`}
    >
      {/* Avatar */}
      <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary text-xs uppercase overflow-hidden mt-0.5">
        {message.senderAvatar ? (
          <img
            src={message.senderAvatar}
            alt={message.senderName}
            className="h-full w-full object-cover"
          />
        ) : (
          message.senderName.slice(0, 2)
        )}
      </div>

      {/* Message Body Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {message.senderName}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>
          {message.isPinned ? (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
              <Pin className="h-2.5 w-2.5" />
              Pinned
            </span>
          ) : null}
          {message.isEdited ? (
            <span className="text-[10px] text-muted-foreground">(edited)</span>
          ) : null}
        </div>

        {/* Text Content */}
        <div className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <a
                key={att.fileId}
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors shadow-sm"
              >
                <FileText className="h-4 w-4 text-brand shrink-0" />
                <span className="truncate max-w-[180px] font-medium">{att.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  ({Math.round(att.size / 1024)} KB)
                </span>
                <Download className="h-3 w-3 text-muted-foreground ml-1" />
              </a>
            ))}
          </div>
        ) : null}

        {/* Reactions List */}
        {message.reactions && message.reactions.length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {message.reactions.map((r) => {
              const hasReacted = currentUserId ? r.userIds.includes(currentUserId) : false;
              return (
                <button
                  key={r.emoji}
                  onClick={() => handleToggleReaction(r.emoji)}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition-colors cursor-pointer ${
                    hasReacted
                      ? "border-brand/40 bg-brand/10 text-brand font-medium"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="text-[11px]">{r.count}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Thread Replies Button */}
        {message.replyCount > 0 ? (
          <button
            onClick={() => onOpenThread?.(message)}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand hover:underline cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>
              {message.replyCount} {message.replyCount === 1 ? "reply" : "replies"}
            </span>
          </button>
        ) : null}
      </div>

      {/* Floating Action Menu on Hover */}
      <div className="absolute right-4 top-2 hidden group-hover:flex items-center gap-0.5 rounded-lg border border-border bg-card shadow-sm p-0.5">
        {/* Quick Emoji Reaction Popover */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
            title="Add Reaction"
            onClick={() => setShowEmojiPicker((v) => !v)}
          >
            <Smile className="h-3.5 w-3.5" />
          </Button>

          {showEmojiPicker ? (
            <div className="absolute right-0 top-8 z-30 flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-lg animate-in fade-in duration-150">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleToggleReaction(emoji)}
                  className="rounded p-1 text-base hover:bg-muted cursor-pointer transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Reply in thread */}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
          title="Reply in thread"
          onClick={() => onOpenThread?.(message)}
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </Button>

        {/* Pin message */}
        <Button
          size="sm"
          variant="ghost"
          className={`h-7 w-7 p-0 cursor-pointer hover:text-foreground ${
            message.isPinned ? "text-amber-500" : "text-muted-foreground"
          }`}
          title={message.isPinned ? "Unpin message" : "Pin message"}
          onClick={handleTogglePin}
        >
          <Pin className="h-3.5 w-3.5" />
        </Button>

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={handleTogglePin} className="text-xs cursor-pointer">
              <Pin className="h-3.5 w-3.5 mr-2" />
              {message.isPinned ? "Unpin message" : "Pin to channel"}
            </DropdownMenuItem>
            {isOwn ? (
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-xs text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete message
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
