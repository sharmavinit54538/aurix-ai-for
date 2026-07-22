import React from "react";
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
  // Chart 1: Component Distribution Data
  const componentDistribution = [
    { name: "Basic Pay", value: 50, color: "#4F7CFF" },
    { name: "HRA", value: 25, color: "#10B981" },
    { name: "Special Allowance", value: 15, color: "#F59E0B" },
    { name: "Retirement & PF", value: 6, color: "#8B5CF6" },
    { name: "Perks & Benefits", value: 4, color: "#06B6D4" },
  ];

  // Chart 2: Department CTC & Employer Cost
  const deptData = [
    { name: "Engineering", ctc: 36, employerCost: 2.8, headcount: 142 },
    { name: "Sales & BD", ctc: 24, employerCost: 2.1, headcount: 88 },
    { name: "Operations", ctc: 12, employerCost: 1.2, headcount: 310 },
    { name: "Finance & HR", ctc: 18, employerCost: 1.6, headcount: 45 },
    { name: "Executive", ctc: 96, employerCost: 8.4, headcount: 12 },
  ];

  // Chart 3: Annual Budget Trend
  const budgetTrend = [
    { month: "Apr 26", budget: 1.2, actual: 1.15 },
    { month: "May 26", budget: 1.25, actual: 1.22 },
    { month: "Jun 26", budget: 1.3, actual: 1.28 },
    { month: "Jul 26", budget: 1.4, actual: 1.39 },
    { month: "Aug 26", budget: 1.45, actual: 1.42 },
    { month: "Sep 26", budget: 1.5, actual: 1.48 },
  ];

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
