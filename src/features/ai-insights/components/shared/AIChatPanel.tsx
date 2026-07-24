import { memo, useMemo, useState } from "react";
import { Brain, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = { role: "user" | "ai"; text: string };

export const AIChatPanel = memo(function AIChatPanel({ recommendations }: { recommendations: string[] }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "Hi! I'm Aurix AI. Ask me about workforce metrics, attrition, burnout, or hiring forecasts." },
  ]);

  const examples = useMemo(() => recommendations.slice(0, 4), [recommendations]);

  function send(value?: string) {
    const query = (value ?? text).trim();
    if (!query) return;

    setText("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: query },
      { role: "ai", text: `Querying workforce intelligence backend for: "${query}"...` },
    ]);
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="grid h-7 w-7 place-items-center rounded-lg text-brand-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Brain className="h-3.5 w-3.5" />
          </div>
          <div className="text-sm font-medium">Aurix AI Assistant</div>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          Live
        </Badge>
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto p-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                message.role === "user" ? "bg-foreground text-background" : "bg-accent/70 text-foreground"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border/60 p-3">
        <div className="flex flex-wrap gap-1.5">
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => send(example)}
              className="max-w-[280px] truncate rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ask Aurix AI anything..."
            className="h-9"
          />
          <Button type="submit" size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
});
