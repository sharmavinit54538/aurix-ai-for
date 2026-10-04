import { useEffect, useState } from "react";
import type { Message } from "../types";
import { connectApi } from "../connectApi";
import { MessageItem } from "./MessageItem";
import { MessageComposer } from "./MessageComposer";
import { X, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface ThreadSidebarProps {
  parentMessage: Message;
  currentUserId?: string;
  onClose: () => void;
  onReplyCountUpdated?: (parentMessageId: string, count: number) => void;
}

export function ThreadSidebar({
  parentMessage,
  currentUserId,
  onClose,
  onReplyCountUpdated,
}: ThreadSidebarProps) {
  const [replies, setReplies] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    connectApi
      .getMessageThread(parentMessage.id)
      .then((items) => {
        setReplies(items);
        onReplyCountUpdated?.(parentMessage.id, items.length);
      })
      .catch(() => {
        toast.error("Failed to load thread replies");
        setReplies([]);
      })
      .finally(() => setLoading(false));
  }, [parentMessage.id]);

  const handleSendReply = async ({ content }: { content: string }) => {
    if (!content.trim()) return;
    try {
      const newReply = await connectApi.postThreadReply(parentMessage.id, content);
      setReplies((prev) => {
        const next = [...prev, newReply];
        onReplyCountUpdated?.(parentMessage.id, next.length);
        return next;
      });
    } catch {
      toast.error("Failed to post reply. Please retry.");
    }
  };

  return (
    <div className="flex h-full w-80 md:w-96 flex-col border-l border-border bg-card/60 backdrop-blur-md animate-in slide-in-from-right-5 duration-200">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Thread</h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 cursor-pointer"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Parent Message Highlight */}
        <div className="rounded-lg border border-border/80 bg-muted/30 p-2">
          <MessageItem message={parentMessage} currentUserId={currentUserId} />
        </div>

        <div className="flex items-center gap-2 px-2">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading replies...</span>
          </div>
        ) : replies.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No replies yet. Start the thread conversation below.
          </div>
        ) : (
          replies.map((reply) => (
            <MessageItem
              key={reply.id}
              message={reply}
              currentUserId={currentUserId}
              onDeleted={(id) => {
                setReplies((prev) => prev.filter((r) => r.id !== id));
              }}
            />
          ))
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-border bg-card">
        <MessageComposer
          placeholder="Reply in thread..."
          onSend={handleSendReply}
        />
      </div>
    </div>
  );
}
