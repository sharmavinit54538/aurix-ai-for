import React, { useState, useMemo } from "react";
import { Calculator, CheckCircle2, AlertTriangle, Sparkles, Play, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VisualFormulaBuilderProps {
  initialFormula?: string;
  onFormulaChange?: (formula: string) => void;
  componentCode?: string;
}

export const VisualFormulaBuilder: React.FC<VisualFormulaBuilderProps> = ({
  initialFormula = "BASIC * 0.50",
  onFormulaChange,
  componentCode = "HRA",
}) => {
  const [formulaStr, setFormulaStr] = useState(initialFormula);
  const [sampleCtc, setSampleCtc] = useState(3600000);
  const [sampleBasic, setSampleBasic] = useState(150000);
  const [sampleGross, setSampleGross] = useState(282000);

  const variables = [
    { code: "CTC", label: "Total CTC", desc: "Annual / Monthly CTC" },
    { code: "BASIC", label: "Basic Pay", desc: "Monthly Basic Pay" },
    { code: "GROSS", label: "Gross Salary", desc: "Total Monthly Earnings" },
    { code: "LOP_DAYS", label: "LOP Days", desc: "Loss of Pay Days in cycle" },
    { code: "TENURE_YEARS", label: "Tenure", desc: "Years of Service" },
  ];

  const operators = ["*", "/", "+", "-", "(", ")", ",", "%"];

  const functions = [
    { name: "IF(cond, trueVal, falseVal)", insert: "IF(GROSS > 50000, 200, 150)" },
    { name: "MIN(val1, val2)", insert: "MIN(BASIC, 15000)" },
    { name: "MAX(val1, val2)", insert: "MAX(BASIC * 0.12, 1800)" },
    { name: "ROUND(val)", insert: "ROUND(BASIC * 0.50)" },
  ];

  const handleInsertToken = (token: string) => {
    const nextStr = formulaStr ? `${formulaStr} ${token}` : token;
    setFormulaStr(nextStr);
    if (onFormulaChange) onFormulaChange(nextStr);
  };

  const handleClear = () => {
    setFormulaStr("");
    if (onFormulaChange) onFormulaChange("");
  };

  // Evaluate Expression Safely for Live Preview
  const evaluatedResult = useMemo(() => {
    try {
      if (!formulaStr.trim()) return 0;
      let expr = formulaStr
        .replace(/\bCTC\b/g, String(sampleCtc / 12))
        .replace(/\bBASIC\b/g, String(sampleBasic))
        .replace(/\bGROSS\b/g, String(sampleGross))
        .replace(/\bLOP_DAYS\b/g, "0")
        .replace(/\bTENURE_YEARS\b/g, "5");

      // Replace MIN / MAX / IF
      expr = expr.replace(/MIN\(([^,]+),([^)]+)\)/gi, "Math.min($1, $2)");
      expr = expr.replace(/MAX\(([^,]+),([^)]+)\)/gi, "Math.max($1, $2)");
      expr = expr.replace(/ROUND\(([^)]+)\)/gi, "Math.round($1)");
      expr = expr.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/gi, "($1 ? $2 : $3)");

      // Evaluate safely
      const fn = new Function(`return ${expr}`);
      const val = fn();
      return typeof val === "number" && !isNaN(val) ? Math.round(val) : "Invalid Result";
    } catch {
      return "Expression Error";
    }
  }, [formulaStr, sampleCtc, sampleBasic, sampleGross]);

  const isValid = typeof evaluatedResult === "number";

  return (
    <div className="salary-card p-4 space-y-4 border border-blue-500/20 bg-slate-900/90">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-semibold text-white">Visual Formula Editor ({componentCode})</h4>
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

      {/* Formula Code Input Display */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Expression Builder</span>
          <button onClick={handleClear} className="text-rose-400 hover:underline">
            Clear Formula
          </button>
        </div>
        <Input
          value={formulaStr}
          onChange={(e) => {
            setFormulaStr(e.target.value);
            if (onFormulaChange) onFormulaChange(e.target.value);
          }}
          placeholder="e.g. BASIC * 0.50 or MIN(BASIC, 15000) * 0.12"
          className="font-mono text-xs bg-slate-950 border-blue-500/40 text-blue-300 h-10 focus:ring-blue-500"
        />
      </div>

      {/* Insert Token Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-slate-400">Click to Insert Variables & Functions:</div>

        {/* Variables */}
        <div className="flex flex-wrap gap-1.5">
          {variables.map((v) => (
            <span
              key={v.code}
              onClick={() => handleInsertToken(v.code)}
              className="formula-chip formula-chip-var"
              title={v.desc}
            >
              + {v.code}
            </span>
          ))}
        </div>

        {/* Operators */}
        <div className="flex flex-wrap gap-1">
          {operators.map((op) => (
            <span
              key={op}
              onClick={() => handleInsertToken(op)}
              className="formula-chip formula-chip-op"
            >
              {op}
            </span>
          ))}
        </div>

        {/* Functions */}
        <div className="flex flex-wrap gap-1.5">
          {functions.map((fn, idx) => (
            <span
              key={idx}
              onClick={() => handleInsertToken(fn.insert)}
              className="formula-chip formula-chip-fn"
            >
              {fn.name}
            </span>
          ))}
        </div>
      </div>

      {/* Live Calculator Simulation */}
      <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            Live Preview Calculation
          </span>
          <span className="font-mono text-emerald-400 text-sm font-bold">
            {typeof evaluatedResult === "number" ? `₹${evaluatedResult.toLocaleString("en-IN")} / pm` : evaluatedResult}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px]">
          <div>
            <label className="text-slate-500">Test Basic Pay:</label>
            <Input
              type="number"
              value={sampleBasic}
              onChange={(e) => setSampleBasic(Number(e.target.value))}
              className="h-7 text-[11px] bg-slate-900 border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-500">Test Gross Pay:</label>
            <Input
              type="number"
              value={sampleGross}
              onChange={(e) => setSampleGross(Number(e.target.value))}
              className="h-7 text-[11px] bg-slate-900 border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-500">Test Annual CTC:</label>
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
