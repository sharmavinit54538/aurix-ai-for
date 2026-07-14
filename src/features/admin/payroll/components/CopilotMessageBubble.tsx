import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";

export function CopilotMessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isUser ? "bg-foreground text-background" : "text-brand-foreground"}`}
        style={isUser ? undefined : { background: "var(--gradient-brand)" }}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${isUser ? "bg-foreground text-background" : "bg-accent/60 text-foreground"}`}
      >
        {text || <span className="text-muted-foreground">…</span>}
      </div>
    </div>
  );
}
