import React from "react";
import {
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Building,
  ArrowUpRight,
} from "lucide-react";
import { ReimbursementsSummaryKPIs } from "./reimbursementsTypes";

interface ReimbursementsKPIsProps {
  kpis: ReimbursementsSummaryKPIs;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
}

export const ReimbursementsKPIs: React.FC<ReimbursementsKPIsProps> = ({
  kpis,
  activeStatusFilter,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: "ALL",
      label: "Total Claims",
      value: kpis.totalClaims,
      unit: "Claims",
      icon: Receipt,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "+18% vs last month",
      statusKey: "ALL",
    },
    {
      id: "SUBMITTED",
      label: "Pending Approval",
      value: kpis.pendingApproval,
      unit: "Awaiting Sign-off",
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "4 critical reviews",
      statusKey: "SUBMITTED",
    },
    {
      id: "PAYROLL_APPROVED",
      label: "Approved Claims",
      value: kpis.approved,
      unit: "Ready for Disbursal",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "100% policy verified",
      statusKey: "PAYROLL_APPROVED",
    },
    {
      id: "REJECTED",
      label: "Rejected Claims",
      value: kpis.rejected,
      unit: "Declined",
      icon: XCircle,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "Policy violation",
      statusKey: "REJECTED",
    },
    {
      id: "PROCESSING",
      label: "In Processing",
      value: kpis.processing,
      unit: "Salary Queue",
      icon: RefreshCw,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      delta: "July payroll cycle",
      statusKey: "ALL",
    },
    {
      id: "PAID",
      label: "Total Paid",
      value: kpis.paid,
      unit: "Disbursed",
      icon: DollarSign,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      delta: "Bank transfers clear",
      statusKey: "ALL",
    },
    {
      id: "TOTAL_AMOUNT",
      label: "Total Claim Value",
      value: `₹${(kpis.totalAmount / 1000).toFixed(1)}k`,
      unit: "INR",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      delta: "+8.4% YoY",
      statusKey: "ALL",
    },
    {
      id: "AVG_CLAIM",
      label: "Average Claim Size",
      value: `₹${kpis.averageClaim.toLocaleString("en-IN")}`,
      unit: "per submission",
      icon: Receipt,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Within travel caps",
      statusKey: "ALL",
    },
    {
      id: "MONTHLY_EXPENSE",
      label: "Monthly Expense",
      value: `₹${(kpis.monthlyExpense / 1000).toFixed(1)}k`,
      unit: "July 2026 Payout",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "Budget on track",
      statusKey: "ALL",
    },
    {
      id: "DEPT_EXPENSE",
      label: "Top Dept Spend",
      value: `₹${(kpis.departmentExpense / 1000).toFixed(1)}k`,
      unit: "Engineering",
      icon: Building,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "45% of total spend",
      statusKey: "ALL",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatusFilter === card.statusKey;

        return (
          <div
            key={card.id}
            onClick={() => onFilterStatus(card.statusKey)}
            className={`reimb-card kpi-reimb-card p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
              isSelected ? "ring-2 ring-blue-500 bg-slate-800/80" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-medium text-slate-400">{card.label}</span>
              <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.color} ${card.borderColor} border`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">{card.value}</span>
              <span className="text-[10px] font-medium text-slate-400">{card.unit}</span>
            </div>

            <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                {card.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
