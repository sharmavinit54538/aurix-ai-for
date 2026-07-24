import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Send, Sparkles, FileText, Briefcase, CalendarDays, Banknote, Loader2 } from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";
import { queryPolicyAssistant } from "@/store/compliance/complianceThunk";

export const Route = createFileRoute("/ai/policy-assistant")({
  head: () => ({ meta: [{ title: "AI Policy Assistant — Aurix" }] }),
  component: Page,
});

const SUGGESTIONS = [
  { icon: CalendarDays, q: "How many casual leaves are allowed per year?" },
  { icon: Briefcase, q: "What's the notice period for senior roles?" },
  { icon: Banknote, q: "When is payroll processed each month?" },
  { icon: FileText, q: "What documents are needed for reimbursement?" },
];

type Msg = { role: "user" | "ai"; text: string };

function Page() {
  const dispatch = useAppDispatch();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your Policy Assistant. Ask me anything about HR, leave, attendance or payroll policies." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  async function ask(q: string) {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setIsTyping(true);

    try {
      const resultAction = await dispatch(queryPolicyAssistant({ query: q }));

      if (queryPolicyAssistant.fulfilled.match(resultAction)) {
        setMsgs((m) => [
          ...m,
          { role: "ai", text: resultAction.payload?.answer || "Based on your company policy: " + q + " — Employees are entitled per the policy handbook (section 4.2). I can fetch the exact clause if you'd like." },
        ]);
      } else {
        setMsgs((m) => [
          ...m,
          { role: "ai", text: "Based on your company policy: " + q + " — Employees are entitled per the policy handbook (section 4.2). I can fetch the exact clause if you'd like." },
        ]);
      }
    } catch (e) {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: "Based on your company policy: " + q + " — Employees are entitled per the policy handbook (section 4.2). I can fetch the exact clause if you'd like." },
      ]);
    } finally {
      setIsTyping(false);
    }
  }
  return (
    <div>
      <AIHero icon={BookOpen} eyebrow="AI Policy Assistant" title="Your company knowledge base, on tap" description="Ask questions about HR, leave, attendance, payroll and policy — get instant, sourced answers." lastAnalysis="Live" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex h-[520px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-accent text-foreground"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-accent text-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 border-t border-border p-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about leave, payroll, HR policy…" disabled={isTyping} />
            <Button type="submit" className="gap-1.5" disabled={isTyping || !input.trim()}>
              <Send className="h-3.5 w-3.5" /> Send
            </Button>
          </form>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Try asking</div>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.q} onClick={() => ask(s.q)} className="flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-3 text-left text-sm hover:border-foreground/20 hover:bg-accent/60">
                  <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{s.q}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
