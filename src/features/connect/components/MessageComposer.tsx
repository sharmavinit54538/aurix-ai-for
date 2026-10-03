import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import type { MessageAttachment, MessageSendInput } from "../types";
import {
  Send,
  Paperclip,
  Smile,
  Sparkles,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface MessageComposerProps {
  channelId?: string;
  conversationId?: string;
  placeholder?: string;
  onSend: (input: MessageSendInput) => Promise<void>;
  disabled?: boolean;
}

const EMOJI_PALETTE = ["👍", "❤️", "😊", "🎉", "🔥", "🚀", "💡", "✅", "🙌", "👀"];

export function MessageComposer({
  channelId,
  conversationId,
  placeholder = "Type a message...",
  onSend,
  disabled = false,
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [aiTransforming, setAiTransforming] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Dispatch typing events with 2s debounce
  const handleContentChange = (val: string) => {
    setContent(val);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      realtimeClient.sendTyping({
        channelId,
        conversationId,
        isTyping: true,
      });
    }

    typingTimeoutRef.current = setTimeout(() => {
      realtimeClient.sendTyping({
        channelId,
        conversationId,
        isTyping: false,
      });
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed && attachments.length === 0) return;

    const attachmentIds = attachments.map((a) => a.fileId);
    setContent("");
    setAttachments([]);

    try {
      await onSend({
        content: trimmed,
        attachments: attachmentIds,
      });
    } catch {
      toast.error("Failed to deliver message. Please retry.");
      setContent(trimmed);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;
    setUploading(true);

    try {
      const uploaded = await connectApi.uploadSharedFile(file);
      setAttachments((prev) => [...prev, uploaded]);
      toast.success(`Attached ${uploaded.name}`);
    } catch {
      toast.error("File upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (fileId: string) => {
    setAttachments((prev) => prev.filter((a) => a.fileId !== fileId));
  };

  const handleAiTransform = async (mode: "rephrase" | "summarize" | "professional") => {
    if (!content.trim()) {
      toast.info("Type a draft message first to use AI assistant.");
      return;
    }
    setAiTransforming(true);
    try {
      const res = await connectApi.aiTransform(content, mode);
      if (res?.transformed) {
        setContent(res.transformed);
        toast.success(`Message refined (${mode})`);
      }
    } catch {
      toast.error("AI assistant unavailable.");
    } finally {
      setAiTransforming(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-2.5 transition-all focus-within:ring-1 focus-within:ring-brand/40">
      {/* Attached Files Previews */}
      {attachments.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.fileId}
              className="flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2 py-1 text-xs text-foreground"
            >
              <FileText className="h-3.5 w-3.5 text-brand" />
              <span className="truncate max-w-[140px]">{att.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(att.fileId)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Main Textarea */}
      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || uploading}
        rows={2}
        className="min-h-[44px] max-h-36 resize-none border-0 p-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60 bg-transparent"
      />

      {/* Bottom Action Bar */}
      <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
        <div className="flex items-center gap-1">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
            title="Attach file"
            disabled={uploading || disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>

          {/* Quick Emoji Picker */}
          <div className="relative">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
              title="Insert emoji"
              onClick={() => setShowEmojiPicker((v) => !v)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            {showEmojiPicker ? (
              <div className="absolute left-0 bottom-10 z-30 flex items-center gap-1 rounded-lg border border-border bg-card p-1.5 shadow-xl animate-in fade-in duration-150">
                {EMOJI_PALETTE.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setContent((c) => c + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="rounded p-1 hover:bg-muted text-base cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* AI Transform Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs gap-1.5 cursor-pointer text-brand hover:text-brand"
                disabled={aiTransforming || !content.trim()}
                title="AI Writing Assistant"
              >
                {aiTransforming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>AI Refine</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem
                onClick={() => handleAiTransform("professional")}
                className="text-xs cursor-pointer"
              >
                Make Professional
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAiTransform("rephrase")}
                className="text-xs cursor-pointer"
              >
                Rephrase Clearly
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAiTransform("summarize")}
                className="text-xs cursor-pointer"
              >
                Summarize
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Send Button */}
        <Button
          type="button"
          size="sm"
          disabled={(!content.trim() && attachments.length === 0) || disabled || uploading}
          onClick={handleSend}
          className="h-8 px-3 gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
        >
          <span>Send</span>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
