import React, { useState } from "react";
import { BookOpen, Sparkles, ShieldCheck, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const RightPolicyPanel: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Welcome! I am your Aurix AI Salary Advance Copilot. Ask me about advance limits, repayment tenure, or EMI salary ratios.",
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
        `Aurix AI: Under Company Advance Policy #ADV-2026, maximum advance is capped at 3x monthly basic salary or ₹2,00,000. Maximum recovery tenure is 6 months at 0% interest.`,
      ]);
    }, 600);
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 h-fit text-xs space-y-4">
      {/* Policy Guide */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          Salary Advance Policy Rules
        </h4>
        <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 text-slate-300 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-cyan-300">Policy Rules 2026:</p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-3">
            <li>Max Advance Limit: Up to 3x Basic Pay (Max ₹2.0L).</li>
            <li>Tenure: 1 to 6 monthly installments.</li>
            <li>Interest Rate: 0% Interest-free corporate loan.</li>
            <li>Min Service Tenure: 6 months of active service.</li>
          </ul>
        </div>
      </div>

      {/* Recovery Calculator Helper */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Recovery Threshold
        </h4>
        <div className="space-y-1 text-[11px]">
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">Max Monthly EMI:</span>
            <span className="font-mono text-emerald-400">35% Gross Limit</span>
          </div>
          <div className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-300">Approval SLA:</span>
            <span className="font-mono text-cyan-400">&lt; 24 Hours</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Chat */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          AI Advance Copilot
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
          <Button type="submit" size="sm" className="h-7 w-7 p-0 bg-cyan-600 hover:bg-cyan-500 text-white">
            <Send className="w-3 h-3" />
          </Button>
        </form>
      </div>
    </div>
  );
};
