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
import { OvertimeRecord } from "./overtimeTypes";

interface OvertimeAnalyticsProps {
  records: OvertimeRecord[];
}

export const OvertimeAnalytics: React.FC<OvertimeAnalyticsProps> = ({ records }) => {
  // Category Cost Breakdown
  const categoryCost = [
    { name: "Regular Overtime (1.5x)", value: 2250, color: "#3B82F6" },
    { name: "Weekend Overtime (2.0x)", value: 4800, color: "#F59E0B" },
    { name: "Night Shift Differential", value: 1838, color: "#8B5CF6" },
  ];

  // Department Comparison (OT Hours)
  const deptData = [
    { name: "Engineering", hours: 14.5, cost: 8.5 },
    { name: "Sales & BD", hours: 9.0, cost: 5.4 },
    { name: "Operations", hours: 12.0, cost: 6.2 },
  ];

  // Monthly Overtime Trend (Hours)
  const monthlyTrend = [
    { month: "Feb 26", hours: 22.0 },
    { month: "Mar 26", hours: 28.5 },
    { month: "Apr 26", hours: 34.0 },
    { month: "May 26", hours: 31.0 },
    { month: "Jun 26", hours: 36.5 },
    { month: "Jul 26", hours: 35.5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Donut Chart: Category Cost */}
      <div className="ot-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Overtime Expenditure by Category</span>
          <span className="text-[10px] text-blue-400 font-normal">July Pay Run</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryCost}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryCost.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 gap-1 pt-1 text-[11px]">
          {categoryCost.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}:</span>
              <span className="font-mono font-bold text-white ml-auto">₹{item.value.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Department Comparison */}
      <div className="ot-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Department Overtime Hours</span>
          <span className="text-[10px] text-slate-400 font-normal">Active Cycle</span>
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1527", borderColor: "rgba(255,255,255,0.1)", fontSize: "11px", borderRadius: "8px" }}
              />
              <Bar dataKey="hours" name="OT Hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: Monthly Overtime Trend */}
      <div className="ot-card p-4 space-y-3 bg-slate-900/80 border border-white/10">
        <h4 className="text-xs font-semibold text-white flex items-center justify-between">
          <span>Monthly Overtime Hours Trend</span>
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
              <Area type="monotone" dataKey="hours" name="OT Hours" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
