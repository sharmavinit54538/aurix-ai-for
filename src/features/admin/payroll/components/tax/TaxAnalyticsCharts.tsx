import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart2, PieChart as PieIcon } from "lucide-react";
import { TaxSummaryMetrics, AdminTaxItem } from "@/services/taxApi";

interface TaxAnalyticsChartsProps {
  summary?: TaxSummaryMetrics;
  items?: AdminTaxItem[];
  isLoading?: boolean;
}

const REGIME_COLORS = ["#818cf8", "#c084fc"];
const STATUS_COLORS = ["#34d399", "#f59e0b", "#f472b6"];

const formatCurrencyShort = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString()}`;

export const TaxAnalyticsCharts: React.FC<TaxAnalyticsChartsProps> = ({
  summary,
  items = [],
  isLoading = false,
}) => {
  const totalEmployees = summary?.total_employees || items.length;
  const hasData = !isLoading && totalEmployees > 0 && summary && (summary.total_tax > 0 || items.length > 0);

  // Prepare Regime Breakdown Data from API
  const regimeData = summary?.regime_breakdown
    ? [
        { name: "New Tax Regime", value: summary.regime_breakdown.new_regime },
        { name: "Old Tax Regime", value: summary.regime_breakdown.old_regime },
      ].filter((d) => d.value > 0)
    : [
        { name: "New Tax Regime", value: items.filter((i) => i.tax_regime === "NEW").length },
        { name: "Old Tax Regime", value: items.filter((i) => i.tax_regime === "OLD").length },
      ].filter((d) => d.value > 0);

  // Prepare Department Tax Liability Data from API
  const deptMap: Record<string, { total_tax: number; count: number }> = {};
  items.forEach((item) => {
    const dept = item.department || "General";
    if (!deptMap[dept]) {
      deptMap[dept] = { total_tax: 0, count: 0 };
    }
    deptMap[dept].total_tax += item.net_tax || 0;
    deptMap[dept].count += 1;
  });

  const departmentData = Object.keys(deptMap).map((dept) => ({
    department: dept,
    tax: deptMap[dept].total_tax,
    employees: deptMap[dept].count,
  }));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 rounded-2xl bg-card/40 border border-border/50 animate-pulse p-4" />
        <div className="h-64 rounded-2xl bg-card/40 border border-border/50 animate-pulse p-4" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-8 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg text-center space-y-2">
        <div className="h-10 w-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <BarChart2 className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">No data available.</h4>
        <p className="text-xs text-muted-foreground">
          Tax analytics and regime distribution charts will render here once payroll tax calculations exist in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Tax Regime Distribution */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-indigo-400" />
          Tax Regime Adoption Breakdown
        </h3>
        {regimeData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-xs text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={regimeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                dataKey="value"
                nameKey="name"
                paddingAngle={4}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {regimeData.map((_, idx) => (
                  <Cell key={idx} fill={REGIME_COLORS[idx % REGIME_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => [`${val} Employees`, "Count"]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 2. Department Tax Liability */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-emerald-400" />
          Department Tax Liability (API Data)
        </h3>
        {departmentData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-xs text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="department" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={55} />
              <Tooltip formatter={(val: number) => [formatCurrencyShort(val), "Annual Net Tax"]} />
              <Bar dataKey="tax" fill="#34d399" radius={[6, 6, 0, 0]} name="Annual Tax" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
