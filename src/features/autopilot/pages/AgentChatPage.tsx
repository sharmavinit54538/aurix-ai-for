import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Loader2,
  Plus,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AgentToolCallCard } from "../components/AgentToolCallCard";
import { useAgentChat, AGENT_SUGGESTIONS } from "../hooks/useAgentChat";

export default function AgentChatPage() {
  const {
    messages,
    isSending,
    backendUnavailable,
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

  const handleSuggestionClick = (cmd: string) => {
    void sendMessage(cmd);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ── Chat Container ──────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-md overflow-hidden flex flex-col h-[650px]">
        {/* Chat Header Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-card/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="p-2 rounded-xl bg-primary/10 text-primary h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
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
                  <div className="p-2 rounded-xl bg-foreground/10 text-foreground h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 justify-start">
              <div className="p-2 rounded-xl bg-primary/10 text-primary h-8 w-8 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl p-4 bg-accent/70 text-foreground border border-border/60 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Evaluating policies and preparing action...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-2.5 border-t border-border/40 bg-background/50 flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 shrink-0 mr-1">
            <Sparkles className="h-3 w-3 text-primary" /> Try:
          </span>
          {AGENT_SUGGESTIONS.map((cmd, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(cmd)}
              disabled={isSending}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-background/80 hover:bg-accent border border-border/60 text-foreground transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border/60 bg-card/80 backdrop-blur-md flex items-end gap-2.5">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell the agent what to do (e.g. 'apply 2 days casual leave from Monday', 'send my payslip')..."
            className="min-h-[44px] max-h-32 rounded-2xl resize-none py-3 text-xs bg-background/80 border-border/70 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!input.trim() || isSending}
            className="rounded-2xl h-11 w-11 p-0 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
