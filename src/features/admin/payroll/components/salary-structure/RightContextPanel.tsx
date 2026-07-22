import React, { useState } from "react";
import { BookOpen, Sparkles, AlertTriangle, ShieldCheck, HelpCircle, Send, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const RightContextPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Welcome! I am your Aurix AI Compensation Assistant. Ask me anything about Code on Wages 2026, PF ceiling rules, or HRA tax exemptions.",
  ]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setMessages((prev) => [...prev, `User: ${userText}`]);
    setQuery("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        `Aurix AI: Based on statutory rules, Basic Pay should be at least 40-50% of Total CTC to comply with Code on Wages. Special Allowance absorbs residual balance.`,
      ]);
    }, 600);
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 h-fit text-xs space-y-4">
      {/* Documentation Tips */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          Compensation Rules & Docs
        </h4>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 text-slate-300 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-blue-300">Code on Wages 2026:</p>
          <p className="text-[11px] text-slate-400">
            Basic Pay + DA must constitute minimum 50% of employee CTC to avoid excess PF & Gratuity penalty calculations.
          </p>
        </div>
      </div>

      {/* Statutory Matrix */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Statutory Dependency Matrix
        </h4>
        <div className="space-y-1 text-[11px]">
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">EPF Ceiling:</span>
            <span className="font-mono text-emerald-400">₹15,000 / pm</span>
          </div>
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">ESI Wage Ceiling:</span>
            <span className="font-mono text-purple-400">₹21,000 / pm</span>
          </div>
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">Gratuity Accrual:</span>
            <span className="font-mono text-cyan-400">4.81% of Basic</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Chat */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          AI Copilot Assistant
        </h4>

        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-white/5 space-y-2 max-h-48 overflow-y-auto font-sans text-[11px]">
          {messages.map((m, i) => (
            <div key={i} className={`p-2 rounded ${m.startsWith("User:") ? "bg-blue-950/40 text-blue-200 text-right" : "bg-slate-900 text-slate-300"}`}>
              {m}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendQuery} className="flex gap-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI assistant..."
            className="bg-slate-950 border-white/10 text-xs text-white h-7"
          />
          <Button type="submit" size="sm" className="h-7 w-7 p-0 bg-blue-600 hover:bg-blue-500 text-white">
            <Send className="w-3 h-3" />
          </Button>
        </form>
      </div>
    </div>
  );
};
