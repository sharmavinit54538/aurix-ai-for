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
import { SalaryAdvanceRequest } from "./advancesTypes";

interface AdvancesAnalyticsProps {
  advances: SalaryAdvanceRequest[];
}

export const AdvancesAnalytics: React.FC<AdvancesAnalyticsProps> = ({ advances }) => {
  // Recovery Status Distribution
  const recoveryDistribution = [
    { name: "Recovered Amount", value: 72500, color: "#10B981" },
    { name: "Outstanding EMI", value: 172500, color: "#F59E0B" },
    { name: "Unpaid / Pending", value: 75000, color: "#4F7CFF" },
  ];

  // Dept-wise Advances
  const deptData = [
    { name: "Engineering", amount: 1.2, count: 1 },
    { name: "Sales & BD", amount: 0.5, count: 1 },
    { name: "Operations", amount: 0.75, count: 1 },
  ];

  // Monthly Recovery Trend Area Chart
  const monthlyTrend = [
    { month: "Feb 26", amount: 24.0 },
    { month: "Mar 26", amount: 28.5 },
    { month: "Apr 26", amount: 30.0 },
    { month: "May 26", amount: 32.5 },
    { month: "Jun 26", amount: 32.5 },
    { month: "Jul 26", amount: 32.5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Donut Chart: Recovery Status */}
      <div className="adv-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Advance Liquidity Breakdown</span>
          <span className="text-[10px] text-cyan-400 font-normal">FY27 Pool</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={recoveryDistribution}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {recoveryDistribution.map((entry, index) => (
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
          {recoveryDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}:</span>
              <span className="font-mono font-bold text-white ml-auto">₹{(item.value / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Dept Comparison */}
      <div className="adv-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Department Advance Value (₹ Lakhs)</span>
          <span className="text-[10px] text-slate-400 font-normal">Active Loans</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Bar dataKey="amount" name="Advance Amount (₹L)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: Monthly Recovery Trend */}
      <div className="adv-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Monthly Advance Recovery Trend (₹k)</span>
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
              <Area type="monotone" dataKey="amount" name="Recovered EMI (₹k)" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
