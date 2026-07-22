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
} from "recharts";
import { DeductionRule } from "./deductionsTypes";

interface DeductionsAnalyticsProps {
  deductions: DeductionRule[];
}

export const DeductionsAnalytics: React.FC<DeductionsAnalyticsProps> = ({ deductions }) => {
  // Deduction Category Breakdown
  const categoryBreakdown = [
    { name: "Statutory (EPF/ESI/PT)", value: 742000, color: "#8B5CF6" },
    { name: "Voluntary Insurance", value: 420000, color: "#4F7CFF" },
    { name: "Loan & Advance Recovery", value: 245000, color: "#F59E0B" },
    { name: "Penalties & Asset Recovery", value: 78000, color: "#EF4444" },
  ];

  // Dept-wise Deductions
  const deptData = [
    { name: "Engineering", deduction: 6.8, headcount: 142 },
    { name: "Sales & BD", deduction: 4.2, headcount: 88 },
    { name: "Operations", deduction: 3.1, headcount: 310 },
    { name: "Finance & HR", deduction: 0.75, headcount: 45 },
  ];

  // Monthly Deduction Trend Area Chart
  const monthlyTrend = [
    { month: "Feb 26", amount: 12.4 },
    { month: "Mar 26", amount: 13.1 },
    { month: "Apr 26", amount: 13.8 },
    { month: "May 26", amount: 14.2 },
    { month: "Jun 26", amount: 14.5 },
    { month: "Jul 26", amount: 14.85 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Donut Chart: Category Breakdown */}
      <div className="ded-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Deduction Category Breakdown</span>
          <span className="text-[10px] text-rose-400 font-normal">Monthly Cut</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
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
          {categoryBreakdown.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}:</span>
              <span className="font-mono font-bold text-white ml-auto">₹{(item.value / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Dept Comparison */}
      <div className="ded-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Department-wise Monthly Deductions (₹ Lakhs)</span>
          <span className="text-[10px] text-slate-400 font-normal">Headcount Ratio</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Bar dataKey="deduction" name="Deduction (₹L)" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: Monthly Trend */}
      <div className="ded-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Monthly Total Deduction Trend (₹ Lakhs)</span>
          <span className="text-[10px] text-emerald-400 font-normal">6 Months</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend}>
              <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Area type="monotone" dataKey="amount" name="Deduction Total" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
