import React from "react";
import { BarChart3, PieChart as PieIcon, TrendingUp, Layers } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import {
  CostTrendPoint,
  DeptCostPoint,
  ComponentBreakdownPoint,
  SalaryProcessingAnalyticsData,
} from "@/services/salaryProcessingApi";

interface SalaryProcessingAnalyticsProps {
  analyticsData?: SalaryProcessingAnalyticsData;
  isLoading?: boolean;
}

export const SalaryProcessingAnalytics: React.FC<SalaryProcessingAnalyticsProps> = ({
  analyticsData,
  isLoading = false,
}) => {
  const costTrend = analyticsData?.costTrend || [];
  const deptCost = analyticsData?.deptCost || [];
  const componentBreakdown = analyticsData?.componentBreakdown || [];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* 1. Monthly Payroll Cost Trend */}
      <div className="sp-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Payroll Cost Trend (₹ Lakhs)
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">+2.4% MoM</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: "#121a2f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="cost" fill="#4f7cff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Department-wise Cost Distribution */}
      <div className="sp-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Department Cost Allocation
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">{deptCost.length} Departments</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptCost} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} />
              <YAxis dataKey="dept" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: "#121a2f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="cost" fill="#a855f7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Salary Component Breakdown Pie */}
      <div className="sp-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Salary Component Share
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">CTC Composition</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="h-44 w-44 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={componentBreakdown} innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                  {componentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#121a2f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            {componentBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
