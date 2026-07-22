import React from "react";
import { BookOpen, ShieldCheck } from "lucide-react";

export const RightContextPanel: React.FC = () => {
  return (
    <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 h-fit text-xs space-y-4">
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
    </div>
  );
};
