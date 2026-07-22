import React, { useState } from "react";
import { BookOpen, Sparkles, ShieldCheck, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const RightPolicyPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Welcome! I am your Aurix AI Overtime & Shift Copilot. Ask me about Factories Act OT multipliers, night shift differentials, or weekly OT limits.",
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
        `Aurix AI: Under Statutory Factories Act Section 59, overtime hours worked beyond 9 hours/day or 48 hours/week must be compensated at 2.0x basic hourly rate. Weekend OT applies 2.0x, and National Holidays 3.0x.`,
      ]);
    }, 600);
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 h-fit text-xs space-y-4">
      {/* Policy Guide */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          Overtime Policy & Statutory Limits
        </h4>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 text-slate-300 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-blue-300">Factories Act & Statutory Caps:</p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-3">
            <li>Daily Limit: Max 2 OT hrs / day.</li>
            <li>Weekly Limit: Max 12 OT hrs / week.</li>
            <li>Monthly Cap: Max 50 OT hrs / month.</li>
            <li>Regular OT: 1.5x Hourly Rate.</li>
            <li>Weekend OT: 2.0x Double Pay.</li>
            <li>Holiday OT: 3.0x Triple Pay.</li>
          </ul>
        </div>
      </div>

      {/* Compliance Helper */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Attendance Biometric Sync
        </h4>
        <div className="space-y-1 text-[11px]">
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">Biometric Sync SLA:</span>
            <span className="font-mono text-emerald-400">Real-time Turnstile</span>
          </div>
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">Shift Differential:</span>
            <span className="font-mono text-blue-400">+15% Night Bonus</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Chat */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          AI Overtime Copilot
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
