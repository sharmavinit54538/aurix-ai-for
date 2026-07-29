import React, { useState } from "react";
import { HandCoins, DollarSign, TrendingUp, TrendingDown, FileText, PieChart, Wallet, CreditCard, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CeoFinancePage() {
  const financeData = [
    { month: "Jan", revenue: 1.1, expenses: 0.82, profit: 0.28, payroll: 0.45 },
    { month: "Feb", revenue: 1.25, expenses: 0.93, profit: 0.32, payroll: 0.48 },
    { month: "Mar", revenue: 1.4, expenses: 1.02, profit: 0.38, payroll: 0.52 },
    { month: "Apr", revenue: 1.6, expenses: 1.16, profit: 0.44, payroll: 0.55 },
    { month: "May", revenue: 1.85, expenses: 1.33, profit: 0.52, payroll: 0.58 },
    { month: "Jun", revenue: 2.1, expenses: 1.49, profit: 0.61, payroll: 0.62 },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <HandCoins className="h-4 w-4" />
              </span>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase">
                Corporate Finance & Cash Flow
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Financial Performance & Profit & Loss Statement
            </h1>
            <p className="text-xs text-amber-200/70 max-w-2xl">
              ARR revenue, monthly expenses, profit & loss, payroll expenditure, operating cash reserve, tax compliance, and 12-month financial forecasting.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Annual Run Rate (ARR)", val: "$14.2M", sub: "+24.8% YoY", color: "text-emerald-400" },
          { label: "Monthly Expenses", val: "$1.49M", sub: "Operational costs", color: "text-rose-400" },
          { label: "Net Operating Margin", val: "29.0%", sub: "High profitability", color: "text-amber-400" },
          { label: "Monthly Payroll Cost", val: "$620,000", sub: "248 Employees", color: "text-indigo-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Revenue vs Operating Expenses ($M)</h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue ($M)" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Monthly Payroll Cost Trajectory ($M)</h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="payroll" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} name="Payroll ($M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CeoFinancePage;
