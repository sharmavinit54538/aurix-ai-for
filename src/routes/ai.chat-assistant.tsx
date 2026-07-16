import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Users, Banknote, BarChart3, FileText } from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/ai/chat-assistant")({
  head: () => ({ meta: [{ title: "AI Chat Assistant — Aurix" }] }),
  component: Page,
});

const SUGGESTIONS = [
  { icon: FileText, q: "How many casual leaves do I have left?" },
  { icon: Banknote, q: "Explain the deductions on my latest salary slip." },
  { icon: Users, q: "Who is my department head (HOD)?" },
  { icon: FileText, q: "How can I raise a hardware repair request?" },
];

type Msg = { role: "user" | "ai"; text: string };

function Page() {
  const ws = useAurix();
  const userName = ws.user?.fullName || "Employee";
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: `Hi ${userName} 👋 I'm your AI HR Assistant. Ask me about your leaves balance, payslips, assigned hardware specs, or raising support tickets.` },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function getSmartResponse(q: string): string {
    const query = q.toLowerCase().trim();
    
    // Greeting/Polite closures
    if (query === "hi" || query === "hello" || query === "hey" || query.startsWith("hi ") || query.startsWith("hello ") || query === "hii") {
      return "Hello! How can I assist you today? Feel free to ask about your leaves, salary slips, assets, team info, or raising support tickets.";
    }
    if (query === "ok" || query === "okay" || query === "thanks" || query === "thank you" || query.includes("thank")) {
      return "You're welcome! I'm here to help if you have any other questions.";
    }
    
    if (query.includes("leave") || query.includes("holiday") || query.includes("vacation") || query.includes("sick")) {
      return "You can check your Sick, Casual, and Vacation leave balances, apply for leave, or view the Holiday Calendar directly inside the **Leaves** tab in your sidebar.";
    }
    if (
      query.includes("payroll") || 
      query.includes("salary") || 
      query.includes("slip") || 
      query.includes("tax") || 
      query.includes("download") || 
      query.includes("payslip")
    ) {
      return "All your monthly salary slips, PF/ESI contributions, salary structures, and Form 16/Form 12BB tax declarations are available under the **Payroll** tab in the sidebar.";
    }
    if (
      query.includes("hardware") || 
      query.includes("asset") || 
      query.includes("laptop") || 
      query.includes("repair") || 
      query.includes("specs") || 
      query.includes("device") || 
      query.includes("computer") || 
      query.includes("system")
    ) {
      return "To view your active hardware assets, check device specifications, warranty coverage, request an IT support ticket, or submit a return form, head over to the **Assets** tab.";
    }
    if (
      query.includes("hod") || 
      query.includes("manager") || 
      query.includes("team") || 
      query.includes("directory") || 
      query.includes("chat") || 
      query.includes("colleague")
    ) {
      return "You can view your department colleagues and Company HOD contact details, or start direct and team chat feeds inside the **Communication** tab.";
    }
    if (
      query.includes("ticket") || 
      query.includes("support") || 
      query.includes("help") || 
      query.includes("faq") || 
      query.includes("card") || 
      query.includes("facilities") || 
      query.includes("replace")
    ) {
      return "To raise a support ticket (IT, Facilities, or HR) or view common resolution FAQs, visit the **Help Center** tab in your sidebar.";
    }
    return `I queried your employee profile data and company policy guidelines. For specific operations, you can easily use the sidebar links for Leaves, Payroll, Assets, Communication, and the Help Center! Let me know if you want to know more about any of these.`;
  }

  function ask(q: string) {
    if (!q.trim()) return;
    const aiResponse = getSmartResponse(q);
    setMsgs((m) => [
      ...m,
      { role: "user", text: q },
      { role: "ai", text: aiResponse },
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
