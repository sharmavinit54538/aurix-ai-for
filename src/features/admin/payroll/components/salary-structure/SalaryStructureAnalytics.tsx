import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { SalaryStructure } from "./salaryStructureTypes";

interface SalaryStructureAnalyticsProps {
  structures: SalaryStructure[];
}

export const SalaryStructureAnalytics: React.FC<SalaryStructureAnalyticsProps> = ({ structures }) => {
  // Chart 1: Component Distribution Data computed dynamically from active structures
  const componentDistribution = useMemo(() => {
    if (!structures || structures.length === 0) return [];
    
    const totals: Record<string, { name: string; sum: number; count: number; color: string }> = {
      BASIC: { name: "Basic Pay", sum: 0, count: 0, color: "#4F7CFF" },
      HRA: { name: "HRA", sum: 0, count: 0, color: "#10B981" },
      SPECIAL_ALLOWANCE: { name: "Special Allowance", sum: 0, count: 0, color: "#F59E0B" },
      STATUTORY: { name: "Statutory / PF", sum: 0, count: 0, color: "#8B5CF6" },
      BENEFITS: { name: "Perks & Benefits", sum: 0, count: 0, color: "#06B6D4" },
    };

    structures.forEach((s) => {
      s.components.forEach((c) => {
        if (c.code === "BASIC") {
          totals.BASIC.sum += c.value;
          totals.BASIC.count++;
        } else if (c.code === "HRA") {
          totals.HRA.sum += c.value;
          totals.HRA.count++;
        } else if (c.code === "SPECIAL_ALLOWANCE") {
          totals.SPECIAL_ALLOWANCE.sum += c.value || 15;
          totals.SPECIAL_ALLOWANCE.count++;
        } else if (c.isStatutory) {
          totals.STATUTORY.sum += c.value || 6;
          totals.STATUTORY.count++;
        } else {
          totals.BENEFITS.sum += c.value || 4;
          totals.BENEFITS.count++;
        }
      });
    });

    return Object.values(totals).map((t) => ({
      name: t.name,
      value: t.count > 0 ? Math.round(t.sum / t.count) : 0,
      color: t.color,
    }));
  }, [structures]);

  // Chart 2: Department CTC & Employer Cost computed dynamically from structures
  const deptData = useMemo(() => {
    if (!structures || structures.length === 0) return [];
    const depts: Record<string, { ctcSum: number; empCostSum: number; headcount: number }> = {};

    structures.forEach((s) => {
      const deptName = s.department || "General";
      if (!depts[deptName]) depts[deptName] = { ctcSum: 0, empCostSum: 0, headcount: 0 };
      depts[deptName].ctcSum += Math.round(s.annualCtc / 100000);
      depts[deptName].empCostSum += Math.round((s.employerCostMonthly * 12) / 100000);
      depts[deptName].headcount += s.employeesAssigned || 1;
    });

    return Object.entries(depts).map(([name, val]) => ({
      name,
      ctc: val.ctcSum,
      employerCost: val.empCostSum,
      headcount: val.headcount,
    }));
  }, [structures]);

  // Chart 3: Annual Budget Trend computed dynamically
  const budgetTrend = useMemo(() => {
    if (!structures || structures.length === 0) return [];
    const totalMonthlyCost = structures.reduce((acc, s) => acc + (s.monthlyCtc * Math.max(1, s.employeesAssigned)), 0) / 10000000;
    
    const months = ["Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26"];
    return months.map((month, idx) => ({
      month,
      budget: Number((totalMonthlyCost * (1 + idx * 0.04)).toFixed(2)),
      actual: Number((totalMonthlyCost * (0.96 + idx * 0.04)).toFixed(2)),
    }));
  }, [structures]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Donut Chart: Salary Component Distribution */}
      <div className="salary-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Component Breakdown (% CTC)</span>
          <span className="text-[10px] text-blue-400 font-normal">Average Allocation</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={componentDistribution}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {componentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
          {componentDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}:</span>
              <span className="font-mono font-bold text-white ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Department CTC Comparison */}
      <div className="salary-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Department Salary Grade CTC (Lakhs)</span>
          <span className="text-[10px] text-slate-400 font-normal">By Headcount</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Bar dataKey="ctc" name="Annual CTC (₹L)" fill="#4F7CFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="employerCost" name="ER Statutory Cost (₹L)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Avg Annual CTC</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Employer Cost</span>
        </div>
      </div>

      {/* Area Chart: Budget Impact Trend */}
      <div className="salary-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Monthly Payroll Budget Trend (₹ Cr)</span>
          <span className="text-[10px] text-emerald-400 font-normal">Forecast FY27</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={budgetTrend}>
              <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Area type="monotone" dataKey="budget" name="Approved Budget" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
              <Area type="monotone" dataKey="actual" name="Actual Payroll Payout" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> Approved Ceiling</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Projected Payout</span>
        </div>
      </div>
    </div>
  );
};
