import React, { useState, useMemo } from "react";
import { Code, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VisualFormulaBuilderProps {
  initialFormula?: string;
  onFormulaChange?: (formula: string) => void;
}

export const VisualFormulaBuilder: React.FC<VisualFormulaBuilderProps> = ({
  initialFormula = "BASIC * 1.20",
  onFormulaChange,
}) => {
  const [formulaStr, setFormulaStr] = useState(initialFormula);
  const [sampleBasic, setSampleBasic] = useState(150000);
  const [sampleCtc, setSampleCtc] = useState(300000);
  const [sampleRating, setSampleRating] = useState(4.8);

  const variables = [
    { code: "BASIC", label: "Basic Pay", desc: "Monthly Basic Salary" },
    { code: "GROSS", label: "Gross Salary", desc: "Monthly Gross Salary" },
    { code: "CTC", label: "Total CTC", desc: "Monthly CTC" },
    { code: "PERF_RATING", label: "Performance Rating", desc: "Out of 5.0" },
    { code: "SALES_TARGET", label: "Target %", desc: "Achievement Ratio" },
  ];

  const operators = ["*", "/", "+", "-", "(", ")", ",", "%"];

  const functions = [
    { name: "IF(cond, trueVal, falseVal)", insert: "IF(PERF_RATING >= 4.5, BASIC * 1.20, BASIC * 0.50)" },
    { name: "MIN(val1, val2)", insert: "MIN(BASIC * 0.50, 50000)" },
    { name: "MAX(val1, val2)", insert: "MAX(BASIC * 0.20, 10000)" },
  ];

  const handleInsertToken = (token: string) => {
    const nextStr = formulaStr ? `${formulaStr} ${token}` : token;
    setFormulaStr(nextStr);
    if (onFormulaChange) onFormulaChange(nextStr);
  };

  const evaluatedResult = useMemo(() => {
    try {
      if (!formulaStr.trim()) return 0;
      let expr = formulaStr
        .replace(/\bBASIC\b/g, String(sampleBasic))
        .replace(/\bGROSS\b/g, String(sampleBasic * 1.8))
        .replace(/\bCTC\b/g, String(sampleCtc))
        .replace(/\bPERF_RATING\b/g, String(sampleRating))
        .replace(/\bSALES_TARGET\b/g, "1.4");

      expr = expr.replace(/MIN\(([^,]+),([^)]+)\)/gi, "Math.min($1, $2)");
      expr = expr.replace(/MAX\(([^,]+),([^)]+)\)/gi, "Math.max($1, $2)");
      expr = expr.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/gi, "($1 ? $2 : $3)");

      const fn = new Function(`return ${expr}`);
      const val = fn();
      return typeof val === "number" && !isNaN(val) ? Math.round(val) : "Invalid Result";
    } catch {
      return "Expression Error";
    }
  }, [formulaStr, sampleBasic, sampleCtc, sampleRating]);

  const isValid = typeof evaluatedResult === "number";

  return (
    <div className="bns-card p-4 space-y-4 border border-amber-500/20 bg-slate-900/90">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-semibold text-white">Visual Bonus Formula Engine</h4>
        </div>
        {isValid ? (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Valid Expression
          </Badge>
        ) : (
          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1 text-[10px]">
            <AlertTriangle className="w-3 h-3" /> Syntax Error
          </Badge>
        )}
      </div>

      <div className="space-y-1.5">
        <Input
          value={formulaStr}
          onChange={(e) => {
            setFormulaStr(e.target.value);
            if (onFormulaChange) onFormulaChange(e.target.value);
          }}
          placeholder="e.g. BASIC * 1.20 or IF(PERF_RATING >= 4.5, BASIC * 1.5, BASIC * 0.8)"
          className="font-mono text-xs bg-slate-950 border-amber-500/40 text-amber-300 h-10 focus:ring-amber-500"
        />
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-medium text-slate-400">Click to Insert Variables:</div>

        <div className="flex flex-wrap gap-1.5">
          {variables.map((v) => (
            <span
              key={v.code}
              onClick={() => handleInsertToken(v.code)}
              className="formula-chip-bns bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
              title={v.desc}
            >
              + {v.code}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {operators.map((op) => (
            <span
              key={op}
              onClick={() => handleInsertToken(op)}
              className="formula-chip-bns bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700"
            >
              {op}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {functions.map((fn, idx) => (
            <span
              key={idx}
              onClick={() => handleInsertToken(fn.insert)}
              className="formula-chip-bns bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
            >
              {fn.name}
            </span>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            Formula Test Preview
          </span>
          <span className="font-mono text-emerald-400 text-sm font-bold">
            {typeof evaluatedResult === "number" ? `₹${evaluatedResult.toLocaleString("en-IN")}` : evaluatedResult}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px]">
          <div>
            <label className="text-slate-500">Test Basic:</label>
            <Input
              type="number"
              value={sampleBasic}
              onChange={(e) => setSampleBasic(Number(e.target.value))}
              className="h-7 text-[11px] bg-slate-900 border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-500">Test Rating:</label>
            <Input
              type="number"
              step="0.1"
              value={sampleRating}
              onChange={(e) => setSampleRating(Number(e.target.value))}
              className="h-7 text-[11px] bg-slate-900 border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-500">Test CTC:</label>
            <Input
              type="number"
              value={sampleCtc}
              onChange={(e) => setSampleCtc(Number(e.target.value))}
              className="h-7 text-[11px] bg-slate-900 border-white/10 text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
