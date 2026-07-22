import React from "react";
import { ArrowDown, DollarSign, TrendingUp, MinusCircle, Building, Wallet, ShieldCheck } from "lucide-react";
import { SalaryStructure } from "./salaryStructureTypes";

interface SalaryBreakdownFlowProps {
  structure: SalaryStructure;
}

export const SalaryBreakdownFlow: React.FC<SalaryBreakdownFlowProps> = ({ structure }) => {
  const ctcMonthly = Math.round(structure.annualCtc / 12);
  const basic = Math.round(ctcMonthly * 0.50);
  const hra = Math.round(basic * 0.50);
  const specialAllow = Math.round(ctcMonthly * 0.25);
  const gross = basic + hra + specialAllow;
  
  const pf = Math.round(Math.min(basic, 15000) * 0.12);
  const pt = 200;
  const tds = Math.round(gross * 0.10);
  const totalDeductions = pf + pt + tds;

  const employerPf = pf;
  const gratuity = Math.round(basic * 0.0481);
  const totalEmployerCost = employerPf + gratuity;

  const netSalary = gross - totalDeductions;

  return (
    <div className="salary-card p-6 space-y-6 bg-slate-900/80 border border-white/10">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            Interactive Compensation Waterfall Flow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual step-down calculation flow for template:{" "}
            <span className="text-blue-300 font-semibold">{structure.name}</span>
          </p>
        </div>
        <div className="text-right font-mono">
          <span className="text-xs text-slate-400">Annual CTC:</span>
          <div className="text-lg font-bold text-emerald-400">
            ₹{(structure.annualCtc / 100000).toFixed(2)} Lakhs
          </div>
        </div>
      </div>

      {/* Waterfall Flow Nodes */}
      <div className="space-y-3 max-w-2xl mx-auto">
        {/* Step 1: Total Cost to Company (CTC) */}
        <div className="flow-node bg-blue-950/30 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 font-bold">1</div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Total CTC (Monthly)</h4>
                <p className="text-[11px] text-slate-400">Total Employer Financial Commitment</p>
              </div>
            </div>
            <div className="text-right font-mono font-bold text-base text-blue-400">
              ₹{ctcMonthly.toLocaleString("en-IN")} / pm
            </div>
          </div>
        </div>

        <div className="flow-arrow">
          <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
        </div>

        {/* Step 2: Gross Salary */}
        <div className="flow-node bg-emerald-950/30 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">2</div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gross Salary (Earnings)</h4>
                <p className="text-[11px] text-slate-400">Basic ({Math.round(basic).toLocaleString("en-IN")}) + HRA ({Math.round(hra).toLocaleString("en-IN")}) + Special ({Math.round(specialAllow).toLocaleString("en-IN")})</p>
              </div>
            </div>
            <div className="text-right font-mono font-bold text-base text-emerald-400">
              ₹{gross.toLocaleString("en-IN")} / pm
            </div>
          </div>
        </div>

        <div className="flow-arrow">
          <ArrowDown className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Step 3: Employee Deductions */}
        <div className="flow-node bg-rose-950/30 border-rose-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 font-bold">3</div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Statutory Deductions</h4>
                <p className="text-[11px] text-slate-400">EPF ({pf}) + Professional Tax ({pt}) + TDS Withholding ({tds})</p>
              </div>
            </div>
            <div className="text-right font-mono font-bold text-base text-rose-400">
              - ₹{totalDeductions.toLocaleString("en-IN")} / pm
            </div>
          </div>
        </div>

        <div className="flow-arrow">
          <ArrowDown className="w-4 h-4 text-rose-400" />
        </div>

        {/* Step 4: Employer Contributions */}
        <div className="flow-node bg-purple-950/30 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 font-bold">4</div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Employer Statutory Benefit Cost</h4>
                <p className="text-[11px] text-slate-400">Employer EPF ({employerPf}) + Gratuity Provision ({gratuity})</p>
              </div>
            </div>
            <div className="text-right font-mono font-bold text-base text-purple-400">
              ₹{totalEmployerCost.toLocaleString("en-IN")} / pm
            </div>
          </div>
        </div>

        <div className="flow-arrow">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </div>

        {/* Step 5: Net Take-Home Pay */}
        <div className="flow-node bg-cyan-950/50 border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Net Take-Home Salary</h4>
                <p className="text-[11px] text-slate-300">Final Credit to Employee Bank Account</p>
              </div>
            </div>
            <div className="text-right font-mono font-extrabold text-lg text-cyan-300">
              ₹{netSalary.toLocaleString("en-IN")} / pm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
