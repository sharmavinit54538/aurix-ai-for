import React from "react";
import {
  HandCoins,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { AdvancesSummaryKPIs } from "./advancesTypes";

interface AdvancesKPIsProps {
  kpis: AdvancesSummaryKPIs;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
}

export const AdvancesKPIs: React.FC<AdvancesKPIsProps> = ({
  kpis,
  activeStatusFilter,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: "TOTAL",
      label: "Total Advance Requests",
      value: kpis.totalRequests,
      unit: "Requests",
      icon: HandCoins,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "FY27 Advance Pool",
      statusKey: "ALL",
    },
    {
      id: "PENDING",
      label: "Pending Approval",
      value: kpis.pendingApproval,
      unit: "Awaiting Finance",
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Requires sign-off",
      statusKey: "PENDING_FINANCE",
    },
    {
      id: "APPROVED",
      label: "Approved Advances",
      value: kpis.approved,
      unit: "Ready to Disburse",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "Governance passed",
      statusKey: "APPROVED",
    },
    {
      id: "REJECTED",
      label: "Rejected Requests",
      value: kpis.rejected,
      unit: "Out of Policy",
      icon: XCircle,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "Exceeded budget limit",
      statusKey: "REJECTED",
    },
    {
      id: "DISBURSED",
      label: "Disbursed Advances",
      value: kpis.disbursed,
      unit: "Transferred to Bank",
      icon: CreditCard,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      delta: "Bank transfers complete",
      statusKey: "ALL",
    },
    {
      id: "RECOVERED",
      label: "Total Recovered",
      value: `₹${(kpis.recovered / 100000).toFixed(2)}L`,
      unit: "Pay Run Cuts",
      icon: CheckCircle2,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      delta: "Auto-deducted from salary",
      statusKey: "ALL",
    },
    {
      id: "OUTSTANDING",
      label: "Outstanding Balance",
      value: `₹${(kpis.outstandingBalance / 100000).toFixed(2)}L`,
      unit: "Pending Recovery",
      icon: Wallet,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Active EMI plans",
      statusKey: "ALL",
    },
    {
      id: "MONTHLY_RECOVERY",
      label: "Monthly Recovery",
      value: `₹${(kpis.monthlyRecovery / 1000).toFixed(1)}k`,
      unit: "July Cut",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "July payroll run",
      statusKey: "ALL",
    },
    {
      id: "AVG_ADVANCE",
      label: "Average Advance",
      value: `₹${(kpis.averageAdvance / 1000).toFixed(1)}k`,
      unit: "per employee",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      delta: "Within 2x basic salary",
      statusKey: "ALL",
    },
    {
      id: "RECOVERY_RATE",
      label: "Recovery Rate",
      value: `${kpis.recoveryRate}%`,
      unit: "On-Time Repay",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "Zero default rate",
      statusKey: "ALL",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatusFilter === card.statusKey && card.statusKey !== "ALL";

        return (
          <div
            key={card.id}
            onClick={() => onFilterStatus(card.statusKey)}
            className={`adv-card kpi-adv-card p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
              isSelected ? "ring-2 ring-cyan-500 bg-slate-800/80" : ""
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
