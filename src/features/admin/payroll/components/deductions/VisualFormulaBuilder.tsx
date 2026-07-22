import React, { useState, useMemo } from "react";
import { Code, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VisualFormulaBuilderProps {
  initialFormula?: string;
  onFormulaChange?: (formula: string) => void;
}

export const VisualFormulaBuilder: React.FC<VisualFormulaBuilderProps> = ({
  initialFormula = "MIN(BASIC, 15000) * 0.12",
  onFormulaChange,
}) => {
  const [formulaStr, setFormulaStr] = useState(initialFormula);
  const [sampleBasic, setSampleBasic] = useState(25000);
  const [sampleGross, setSampleGross] = useState(45000);
  const [sampleLop, setSampleLop] = useState(2);

  const variables = [
    { code: "BASIC", label: "Basic Salary", desc: "Monthly Basic Pay" },
    { code: "GROSS", label: "Gross Salary", desc: "Monthly Gross Salary" },
    { code: "CTC", label: "Cost to Company", desc: "Monthly Total CTC" },
    { code: "LOP_DAYS", label: "Loss of Pay Days", desc: "Unpaid Leave Days" },
    { code: "LOAN_BALANCE", label: "Loan Principal", desc: "Remaining Loan Amount" },
  ];

  const operators = ["*", "/", "+", "-", "(", ")", ",", "%"];

  const functions = [
    { name: "MIN(val1, val2)", insert: "MIN(BASIC, 15000) * 0.12" },
    { name: "MAX(val1, val2)", insert: "MAX(GROSS * 0.05, 500)" },
    { name: "IF(cond, trueVal, falseVal)", insert: "IF(GROSS <= 21000, GROSS * 0.0075, 0)" },
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
        .replace(/\bGROSS\b/g, String(sampleGross))
        .replace(/\bCTC\b/g, String(sampleGross * 1.2))
        .replace(/\bLOP_DAYS\b/g, String(sampleLop))
        .replace(/\bLOAN_BALANCE\b/g, "150000");

      expr = expr.replace(/MIN\(([^,]+),([^)]+)\)/gi, "Math.min($1, $2)");
      expr = expr.replace(/MAX\(([^,]+),([^)]+)\)/gi, "Math.max($1, $2)");
      expr = expr.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/gi, "($1 ? $2 : $3)");

      const fn = new Function(`return ${expr}`);
      const val = fn();
      return typeof val === "number" && !isNaN(val) ? Math.round(val) : "Invalid Result";
    } catch {
      return "Expression Error";
    }
  }, [formulaStr, sampleBasic, sampleGross, sampleLop]);

  const isValid = typeof evaluatedResult === "number";

  return (
    <div className="ded-card p-4 space-y-4 border border-rose-500/20 bg-slate-900/90">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs font-semibold text-white">Visual Deduction Formula Engine</h4>
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
          placeholder="e.g. MIN(BASIC, 15000) * 0.12 or IF(GROSS <= 21000, GROSS * 0.0075, 0)"
          className="font-mono text-xs bg-slate-950 border-rose-500/40 text-rose-300 h-10 focus:ring-rose-500"
        />
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-medium text-slate-400">Click to Insert Variables:</div>

        <div className="flex flex-wrap gap-1.5">
          {variables.map((v) => (
            <span
              key={v.code}
              onClick={() => handleInsertToken(v.code)}
              className="formula-chip-bns bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20"
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
            Formula Test Calculation Result
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
            <label className="text-slate-500">Test Gross:</label>
            <Input
              type="number"
              value={sampleGross}
              onChange={(e) => setSampleGross(Number(e.target.value))}
              className="h-7 text-[11px] bg-slate-900 border-white/10 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-500">Test LOP Days:</label>
            <Input
              type="number"
              value={sampleLop}
              onChange={(e) => setSampleLop(Number(e.target.value))}
              className="h-7 text-[11px] bg-slate-900 border-white/10 text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
