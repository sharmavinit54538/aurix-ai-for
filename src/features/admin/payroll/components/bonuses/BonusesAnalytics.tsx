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
import { BonusAward } from "./bonusesTypes";

interface BonusesAnalyticsProps {
  bonuses: BonusAward[];
}

export const BonusesAnalytics: React.FC<BonusesAnalyticsProps> = ({ bonuses }) => {
  // Bonus Type Distribution
  const bonusTypeDistribution = [
    { name: "Performance Bonus", value: 180000, color: "#F59E0B" },
    { name: "Sales Incentive", value: 240000, color: "#4F7CFF" },
    { name: "Project Milestone", value: 90000, color: "#10B981" },
    { name: "Spot Award", value: 25000, color: "#8B5CF6" },
  ];

  // Dept Comparison
  const deptData = [
    { name: "Engineering", bonus: 2.7, headcount: 142 },
    { name: "Sales & BD", bonus: 2.4, headcount: 88 },
    { name: "Operations", bonus: 0.25, headcount: 310 },
    { name: "Finance & HR", bonus: 0.4, headcount: 45 },
  ];

  // Budget Utilization Area Chart
  const budgetData = [
    { quarter: "Q1 FY27", budget: 6.0, allocated: 4.8 },
    { quarter: "Q2 FY27", budget: 12.0, allocated: 5.35 },
    { quarter: "Q3 FY27 (Est)", budget: 18.0, allocated: 11.2 },
    { quarter: "Q4 FY27 (Est)", budget: 25.0, allocated: 19.8 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Donut Chart: Bonus Distribution */}
      <div className="bns-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Bonus Category Distribution</span>
          <span className="text-[10px] text-amber-400 font-normal">Q2 Payouts</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bonusTypeDistribution}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {bonusTypeDistribution.map((entry, index) => (
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
          {bonusTypeDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}:</span>
              <span className="font-mono font-bold text-white ml-auto">₹{(item.value / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Dept Comparison */}
      <div className="bns-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Department Bonus Allocation (₹ Lakhs)</span>
          <span className="text-[10px] text-slate-400 font-normal">FY27 Pool</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Bar dataKey="bonus" name="Bonus Pool (₹L)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: Budget Utilization */}
      <div className="bns-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Cumulative Bonus Budget Utilization (₹ Lakhs)</span>
          <span className="text-[10px] text-emerald-400 font-normal">FY27 Progress</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={budgetData}>
              <XAxis dataKey="quarter" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Area type="monotone" dataKey="budget" name="Approved Ceiling" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
              <Area type="monotone" dataKey="allocated" name="Allocated Payouts" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
