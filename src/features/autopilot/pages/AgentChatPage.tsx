import { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  Loader2,
  Plus,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { AgentToolCallCard } from "../components/AgentToolCallCard";
import { useAgentChat } from "../hooks/useAgentChat";

export default function AgentChatPage() {
  const {
    messages,
    isSending,
    sendMessage,
    confirmAction,
    cancelAction,
    undoAction,
    resetChat,
  } = useAgentChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ── Chat Container ──────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-md overflow-hidden flex flex-col h-[650px]">
        {/* Chat Header Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-card/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500/15 via-violet-500/15 to-rose-500/15 border border-violet-500/25 flex items-center justify-center shadow-2xs">
              <GeminiIcon gradient className="h-4 w-4" />
            </div>
            <span className="font-semibold text-xs text-foreground">HR Agent Chat</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetChat}
            className="rounded-xl h-7 gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            New Conversation
          </Button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500/15 via-violet-500/15 to-rose-500/15 border border-violet-500/25 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <GeminiIcon gradient className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    isUser
                      ? "bg-foreground text-background font-medium shadow-xs"
                      : "bg-accent/70 text-foreground border border-border/60 shadow-2xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Render Tool Call Card if Agent Proposed / Executed an Action */}
                  {msg.toolCall && (
                    <div className="mt-2 text-foreground">
                      <AgentToolCallCard
                        toolCall={msg.toolCall}
                        onConfirm={confirmAction}
                        onCancel={cancelAction}
                        onUndo={undoAction}
                      />
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="p-2 rounded-full bg-foreground/10 text-foreground h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500/15 via-violet-500/15 to-rose-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
                <GeminiIcon gradient className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-2xl p-4 bg-accent/70 text-foreground border border-border/60 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Evaluating policies and preparing action...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ChatGPT-style Composer Bar */}
        <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-card/90 via-card/60 to-transparent">
          <div className="mx-auto max-w-3xl rounded-[26px] border border-border/80 bg-muted/40 dark:bg-muted/30 px-4 py-2 shadow-sm transition-colors focus-within:border-foreground/30 focus-within:bg-background/80">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask HR Agent anything..."
                className="flex-1 max-h-40 min-h-[40px] resize-none border-0 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
              />
              <Button
                type="button"
                aria-label="Send message"
                onClick={() => void handleSend()}
                disabled={!input.trim() || isSending}
                className="mb-0.5 h-9 w-9 shrink-0 rounded-full bg-foreground p-0 text-background hover:bg-foreground/90 disabled:opacity-30 cursor-pointer transition-opacity"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
