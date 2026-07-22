import React from "react";
import {
  Gift,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Building,
  UserCheck,
  Wallet,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { BonusesSummaryKPIs } from "./bonusesTypes";

interface BonusesKPIsProps {
  kpis: BonusesSummaryKPIs;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
}

export const BonusesKPIs: React.FC<BonusesKPIsProps> = ({
  kpis,
  activeStatusFilter,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: "BUDGET",
      label: "Total Bonus Budget",
      value: `₹${(kpis.totalBonusBudget / 100000).toFixed(2)}L`,
      unit: "FY27 Allocation",
      icon: Wallet,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "Approved Board Pool",
      statusKey: "ALL",
    },
    {
      id: "ALLOCATED",
      label: "Allocated Bonus",
      value: `₹${(kpis.allocatedBonus / 100000).toFixed(2)}L`,
      unit: "Committed",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "44% of budget pool",
      statusKey: "ALL",
    },
    {
      id: "PENDING",
      label: "Pending Approval",
      value: kpis.pendingApproval,
      unit: "Awaiting Sign-off",
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Requires CFO review",
      statusKey: "PENDING_CFO",
    },
    {
      id: "APPROVED",
      label: "Approved Bonuses",
      value: kpis.approvedBonuses,
      unit: "Governance Passed",
      icon: CheckCircle2,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      delta: "Ready for payroll",
      statusKey: "APPROVED",
    },
    {
      id: "PAID",
      label: "Paid Bonuses",
      value: kpis.paidBonuses,
      unit: "Disbursed",
      icon: CheckCircle2,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      delta: "Salary credits done",
      statusKey: "ALL",
    },
    {
      id: "OUTSTANDING",
      label: "Outstanding Payout",
      value: `₹${(kpis.outstandingBonus / 100000).toFixed(2)}L`,
      unit: "Scheduled",
      icon: Gift,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      delta: "July payroll run",
      statusKey: "ALL",
    },
    {
      id: "AVG_BONUS",
      label: "Average Bonus",
      value: `₹${(kpis.averageBonus / 1000).toFixed(1)}k`,
      unit: "per employee",
      icon: TrendingUp,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "+12.4% vs FY26",
      statusKey: "ALL",
    },
    {
      id: "TOP_DEPT",
      label: "Top Department",
      value: kpis.topRewardedDepartment,
      unit: "45% Allocation",
      icon: Building,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "High tech achievements",
      statusKey: "ALL",
    },
    {
      id: "TOP_EMP",
      label: "Top Employee Payout",
      value: kpis.topRewardedEmployee,
      unit: "₹2.40L (Sales)",
      icon: UserCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "140% target hit",
      statusKey: "ALL",
    },
    {
      id: "BUDGET_REMAINING",
      label: "Budget Remaining",
      value: `₹${(kpis.budgetRemaining / 100000).toFixed(2)}L`,
      unit: "Unallocated Pool",
      icon: Sparkles,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "56% pool available",
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
            className={`bns-card kpi-bns-card p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
              isSelected ? "ring-2 ring-amber-500 bg-slate-800/80" : ""
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
