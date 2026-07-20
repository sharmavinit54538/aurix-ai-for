import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Users, Banknote, BarChart3, FileText } from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/ai/chat-assistant")({
  head: () => ({ meta: [{ title: "AI Chat Assistant — Aurix" }] }),
  component: () => <Page />,
});

const SUGGESTIONS = [
  { icon: Users, q: "Show employees at risk of leaving." },
  { icon: BarChart3, q: "Who has the highest overtime this month?" },
  { icon: FileText, q: "Generate attendance report." },
  { icon: Banknote, q: "What's the projected payroll for next month?" },
];

type Msg = { role: "user" | "ai"; text: string };

function Page() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi 👋 I'm Aurix AI. Ask me about employees, payroll, attendance, reports or analytics." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function ask(q: string) {
    if (!q.trim()) return;
    setMsgs((m) => [
      ...m,
      { role: "user", text: q },
      { role: "ai", text: "Here's what I found for: \"" + q + "\". I queried the latest workforce data and prepared a summary with relevant insights and metrics for you to review." },
    ]);
    setInput("");
  }
  return (
    <div>
      <AIHero icon={MessageSquare} eyebrow="AI Chat Assistant" title="Ask anything about your workforce" description="ChatGPT-style assistant for HR, payroll, employees, reports and analytics — grounded in your data." lastAnalysis="Live" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3 flex h-[560px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-foreground text-background" : "bg-accent text-foreground"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 border-t border-border p-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Aurix AI… (e.g. show top performers in Sales)" />
            <Button type="submit" className="gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90"><Send className="h-3.5 w-3.5" /> Send</Button>
          </form>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Suggested</div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.q} onClick={() => ask(s.q)} className="flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-3 text-left text-xs hover:border-foreground/20 hover:bg-accent/60">
                    <Icon className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                    <span>{s.q}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Page as ChatAssistantPage };

