import React, { useState } from "react";
import { BookOpen, Sparkles, ShieldCheck, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const RightPolicyPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Welcome! I am your Aurix AI Deduction Copilot. Ask me about EPF capping, ESI salary thresholds, or Section 7 recovery limits.",
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
        `Aurix AI: Under EPF Act 1952, standard employee contribution is 12% on Basic Pay up to ₹15,000 ceiling. Under Payment of Wages Act, total monthly recoveries cannot exceed 50% of gross salary.`,
      ]);
    }, 600);
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 h-fit text-xs space-y-4">
      {/* Policy Guide */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-rose-400" />
          Statutory Deduction Rules
        </h4>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 text-slate-300 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-rose-300">Statutory Compliance Slabs:</p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-3">
            <li>EPF: 12% of Basic Pay (Cap at ₹15,000).</li>
            <li>ESI: 0.75% for Gross &lt;= ₹21,000.</li>
            <li>PT: State Slab (₹200/mo in Karnataka).</li>
          </ul>
        </div>
      </div>

      {/* Compliance Notes */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Recovery Ceiling Limits
        </h4>
        <div className="space-y-1 text-[11px]">
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">Max Recovery Cap:</span>
            <span className="font-mono text-emerald-400">50% Gross Limit</span>
          </div>
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">Minimum Take-Home:</span>
            <span className="font-mono text-cyan-400">&gt;= 50% Net Pay</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Chat */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          AI Deduction Assistant
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
          <Button type="submit" size="sm" className="h-7 w-7 p-0 bg-rose-600 hover:bg-rose-500 text-white">
            <Send className="w-3 h-3" />
          </Button>
        </form>
      </div>
    </div>
  );
};
