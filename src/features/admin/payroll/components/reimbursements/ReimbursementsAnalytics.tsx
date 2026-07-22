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
import { ReimbursementClaim } from "./reimbursementsTypes";

interface ReimbursementsAnalyticsProps {
  claims: ReimbursementClaim[];
}

export const ReimbursementsAnalytics: React.FC<ReimbursementsAnalyticsProps> = ({ claims }) => {
  // Category Breakdown Data
  const categoryData = [
    { name: "Travel & Flight", value: 48500, color: "#4F7CFF" },
    { name: "Client Meeting", value: 18400, color: "#F59E0B" },
    { name: "Fuel & Conveyance", value: 6500, color: "#10B981" },
    { name: "Internet & Telecom", value: 2999, color: "#8B5CF6" },
  ];

  // Dept Spend Data
  const deptData = [
    { name: "Engineering", spend: 51.5 },
    { name: "Sales & BD", spend: 18.4 },
    { name: "Operations", spend: 6.5 },
    { name: "Finance & HR", spend: 4.2 },
  ];

  // Monthly Trend
  const monthlyTrend = [
    { month: "Feb 26", amount: 42.0 },
    { month: "Mar 26", amount: 48.5 },
    { month: "Apr 26", amount: 54.0 },
    { month: "May 26", amount: 62.5 },
    { month: "Jun 26", amount: 71.0 },
    { month: "Jul 26", amount: 76.4 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Category Breakdown */}
      <div className="reimb-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Expense Category Allocation</span>
          <span className="text-[10px] text-blue-400 font-normal">July Payout</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
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
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}:</span>
              <span className="font-mono font-bold text-white ml-auto">₹{(item.value / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dept Spend Bar */}
      <div className="reimb-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Department Reimbursement Spend (₹k)</span>
          <span className="text-[10px] text-slate-400 font-normal">Headcount Allocation</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Bar dataKey="spend" name="Spend (₹k)" fill="#4F7CFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Area */}
      <div className="reimb-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Monthly Expense Claim Payout Trend (₹k)</span>
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
              <Area type="monotone" dataKey="amount" name="Reimbursement Value" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
