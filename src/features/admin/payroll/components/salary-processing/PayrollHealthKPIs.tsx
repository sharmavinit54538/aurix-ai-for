import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserX,
  TrendingUp,
  Banknote,
  Building,
  Percent,
} from "lucide-react";

interface HealthMetric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  colorClass: string;
  borderClass: string;
  trend?: string;
  trendPositive?: boolean;
}

interface PayrollHealthKPIsProps {
  accuracy: number;
  completedPercent: number;
  pendingCount: number;
  errorCount: number;
  warningCount: number;
  blockedCount: number;
  salaryVariance: string;
  netPayroll: number;
  employerCost: number;
}

export const PayrollHealthKPIs: React.FC<PayrollHealthKPIsProps> = ({
  accuracy,
  completedPercent,
  pendingCount,
  errorCount,
  warningCount,
  blockedCount,
  salaryVariance,
  netPayroll,
  employerCost,
}) => {
  const metrics: HealthMetric[] = [
    {
      id: "accuracy",
      label: "Payroll Accuracy",
      value: `${accuracy}%`,
      subtext: "0 calculation mismatches",
      icon: ShieldCheck,
      colorClass: "text-emerald-400 bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
      trend: "+0.2% vs last mo",
      trendPositive: true,
    },
    {
      id: "completed",
      label: "Calculation Progress",
      value: `${completedPercent}%`,
      subtext: "236 / 248 processed",
      icon: CheckCircle2,
      colorClass: "text-indigo-400 bg-indigo-500/10",
      borderClass: "border-indigo-500/20",
    },
    {
      id: "pending",
      label: "Pending Reviews",
      value: `${pendingCount}`,
      subtext: "Awaiting HR validation",
      icon: AlertTriangle,
      colorClass: "text-amber-400 bg-amber-500/10",
      borderClass: "border-amber-500/20",
    },
    {
      id: "errors",
      label: "Critical Errors",
      value: `${errorCount}`,
      subtext: "Requires immediate fix",
      icon: XCircle,
      colorClass: "text-rose-400 bg-rose-500/10",
      borderClass: "border-rose-500/20",
    },
    {
      id: "blocked",
      label: "Blocked Employees",
      value: `${blockedCount}`,
      subtext: "Missing PAN / Bank",
      icon: UserX,
      colorClass: "text-purple-400 bg-purple-500/10",
      borderClass: "border-purple-500/20",
    },
    {
      id: "variance",
      label: "Salary Variance",
      value: salaryVariance,
      subtext: "vs Previous Month",
      icon: TrendingUp,
      colorClass: "text-blue-400 bg-blue-500/10",
      borderClass: "border-blue-500/20",
      trend: "Normal threshold",
      trendPositive: true,
    },
    {
      id: "net_payroll",
      label: "Net Disbursement",
      value: `₹${(netPayroll / 100000).toFixed(2)}L`,
      subtext: "Direct employee credit",
      icon: Banknote,
      colorClass: "text-cyan-400 bg-cyan-500/10",
      borderClass: "border-cyan-500/20",
    },
    {
      id: "employer_cost",
      label: "Employer Stat Cost",
      value: `₹${(employerCost / 100000).toFixed(2)}L`,
      subtext: "PF (12%) + ESI (3.25%)",
      icon: Building,
      colorClass: "text-teal-400 bg-teal-500/10",
      borderClass: "border-teal-500/20",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Payroll Health & Financial Control
        </h3>
        <span className="text-[11px] text-slate-500">Live system audit checks</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {metrics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`sp-card sp-card-hover flex flex-col justify-between p-3.5 ${item.borderClass}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {item.trend && (
                  <span className="text-[9px] font-semibold text-emerald-400">
                    {item.trend}
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-0.5">
                <div className="text-lg font-extrabold tracking-tight text-white">
                  {item.value}
                </div>
                <div className="truncate text-[11px] font-semibold text-slate-300">
                  {item.label}
                </div>
                <div className="truncate text-[10px] text-slate-500">
                  {item.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
