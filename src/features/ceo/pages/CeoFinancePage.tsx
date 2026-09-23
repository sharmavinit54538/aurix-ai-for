import React, { useState } from "react";
import { HandCoins, DollarSign, TrendingUp, TrendingDown, FileText, PieChart, Wallet, CreditCard, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CeoFinancePage() {
  const financeData: any[] = [];

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
          { label: "Annual Run Rate (ARR)", val: "—", sub: "Live data pending", color: "text-emerald-400" },
          { label: "Monthly Expenses", val: "—", sub: "Live data pending", color: "text-rose-400" },
          { label: "Net Operating Margin", val: "—", sub: "Live data pending", color: "text-amber-400" },
          { label: "Monthly Payroll Cost", val: "—", sub: "Live data pending", color: "text-indigo-400" },
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
          <div className="h-56 w-full pt-2 flex items-center justify-center">
            {financeData.length > 0 ? (
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
            ) : (
              <p className="text-xs text-muted-foreground">No financial data available. Backend API integration pending.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground">Monthly Payroll Cost Trajectory ($M)</h3>
          <div className="h-56 w-full pt-2 flex items-center justify-center">
            {financeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="payroll" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} name="Payroll ($M)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No payroll trajectory data available. Backend API integration pending.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CeoFinancePage;
