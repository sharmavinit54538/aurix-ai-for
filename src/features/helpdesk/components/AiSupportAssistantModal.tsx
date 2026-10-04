import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, Bot, User, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { helpdeskApi, getHelpdeskErrorMessage } from "../helpdeskApi";
import type { HelpdeskCategory, HelpdeskPriority } from "../types";

interface AiSupportAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDraftTicket?: (draft: { title: string; category: HelpdeskCategory; priority: HelpdeskPriority }) => void;
}

export function AiSupportAssistantModal({
  open,
  onOpenChange,
  onDraftTicket,
}: AiSupportAssistantModalProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I am your OFC360 Support Assistant. Describe any issue you are facing with IT hardware, software, VPN, leaves, or payroll, and I will search real documentation for immediate answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedDraft, setSuggestedDraft] = useState<{
    title: string;
    category: HelpdeskCategory;
    priority: HelpdeskPriority;
  } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    const newHistory = [...messages, { role: "user" as const, content: userText }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await helpdeskApi.executeAiChat({
        query: userText,
        conversation_history: newHistory,
      });

      if (res.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
      }

      if (res.suggested_ticket_draft) {
        setSuggestedDraft(res.suggested_ticket_draft);
      }
    } catch (err) {
      toast.error(getHelpdeskErrorMessage(err, "AI Assistant is currently unavailable."));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered an error connecting to the support intelligence service. You can submit a regular ticket using the 'Create Ticket' button.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-card">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            AI Support Assistant
          </DialogTitle>
          <DialogDescription className="text-xs">
            Instant troubleshooting powered by OFC360 knowledge base
          </DialogDescription>
        </DialogHeader>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[50vh]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 text-sm ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-xs"
                    : "bg-muted/50 border border-border text-foreground rounded-tl-xs whitespace-pre-wrap"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 text-sm items-center text-muted-foreground">
              <div className="h-7 w-7 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <span className="text-xs">Finding solutions in knowledge base...</span>
            </div>
          )}

          {/* Suggested Ticket Draft Banner */}
          {suggestedDraft && onDraftTicket && (
            <div className="p-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-xs space-y-2 mt-2">
              <div className="flex items-center gap-1.5 font-semibold text-violet-900 dark:text-violet-200">
                <FileText className="h-4 w-4 text-violet-500" />
                <span>Need agent escalation? I drafted a ticket for you:</span>
              </div>
              <div className="text-foreground">
                <strong>Subject:</strong> {suggestedDraft.title}
              </div>
              <Button
                size="sm"
                className="w-full text-xs gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => {
                  onDraftTicket(suggestedDraft);
                  onOpenChange(false);
                }}
              >
                <span>Open Create Ticket with this Draft</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2">
          <Input
            placeholder="Ask a question or describe your problem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="text-sm h-9"
          />
          <Button type="submit" size="sm" disabled={loading || !input.trim()} className="gap-1.5 h-9">
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
