import React from "react";
import { ArrowDown, DollarSign, ShieldAlert, CheckCircle2, MinusCircle, PlusCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PayrollImpactWaterfallProps {
  grossSalary?: number;
  allowances?: number;
  pfDeduction?: number;
  ptDeduction?: number;
  loanEmiDeduction?: number;
  insuranceDeduction?: number;
}

export const PayrollImpactWaterfall: React.FC<PayrollImpactWaterfallProps> = ({
  grossSalary = 85000,
  allowances = 25000,
  pfDeduction = 1800,
  ptDeduction = 200,
  loanEmiDeduction = 12500,
  insuranceDeduction = 1500,
}) => {
  const totalStatutory = pfDeduction + ptDeduction;
  const totalVoluntaryAndRecovery = loanEmiDeduction + insuranceDeduction;
  const totalDeductions = totalStatutory + totalVoluntaryAndRecovery;
  const netSalary = grossSalary - totalDeductions;
  const deductionRatio = Math.round((totalDeductions / grossSalary) * 100);

  const isExcessive = deductionRatio > 50;

  return (
    <div className="ded-card p-5 space-y-4 bg-slate-900/90 border border-white/10">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Payroll Impact Waterfall Calculation Engine
          </h3>
          <p className="text-xs text-slate-400">Before vs After take-home salary flow simulation.</p>
        </div>
        <Badge className={isExcessive ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}>
          Deduction Ratio: {deductionRatio}% of Gross
        </Badge>
      </div>

      {/* Waterfall Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
        {/* 1. Gross Salary */}
        <div className="waterfall-node border-emerald-500/30">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
            <span>1. Gross Salary</span>
            <PlusCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-bold font-mono text-white mt-1">₹{grossSalary.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">Basic + Allowances</span>
        </div>

        {/* 2. Statutory Deductions */}
        <div className="waterfall-node border-rose-500/30">
          <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold uppercase">
            <span>2. Statutory Cuts</span>
            <MinusCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-bold font-mono text-rose-400 mt-1">₹{totalStatutory.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">EPF: ₹{pfDeduction} | PT: ₹{ptDeduction}</span>
        </div>

        {/* 3. Loan & Voluntary */}
        <div className="waterfall-node border-amber-500/30">
          <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase">
            <span>3. Recovery & Voluntary</span>
            <MinusCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-bold font-mono text-amber-400 mt-1">₹{totalVoluntaryAndRecovery.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">Loan: ₹{loanEmiDeduction} | Ins: ₹{insuranceDeduction}</span>
        </div>

        {/* 4. Employer EPF / ESI */}
        <div className="waterfall-node border-purple-500/30">
          <div className="flex items-center justify-between text-[10px] text-purple-400 font-bold uppercase">
            <span>4. Employer Match</span>
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-bold font-mono text-purple-300 mt-1">₹{pfDeduction.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">PF Employer Match</span>
        </div>

        {/* 5. Net Salary */}
        <div className="waterfall-node border-emerald-500/50 bg-emerald-950/20">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
            <span>5. Net Take-Home</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">₹{netSalary.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-300">Final Salary Disbursal</span>
        </div>
      </div>

      {isExcessive && (
        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>Warning: Total deduction ratio ({deductionRatio}%) exceeds 50% statutory threshold limits. Requires HR sign-off.</span>
        </div>
      )}
    </div>
  );
};
