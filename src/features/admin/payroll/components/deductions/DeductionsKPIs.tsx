import React from "react";
import {
  MinusCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  CreditCard,
  Building,
  TrendingDown,
  DollarSign,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { DeductionsSummaryKPIs } from "./deductionsTypes";

interface DeductionsKPIsProps {
  kpis: DeductionsSummaryKPIs;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
}

export const DeductionsKPIs: React.FC<DeductionsKPIsProps> = ({
  kpis,
  activeStatusFilter,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: "TOTAL",
      label: "Total Deduction Rules",
      value: kpis.totalDeductionRules,
      unit: "Configured Rules",
      icon: MinusCircle,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "100% Policy Mapped",
      statusKey: "ALL",
    },
    {
      id: "ACTIVE",
      label: "Active Rules",
      value: kpis.activeRules,
      unit: "In Payroll Processing",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "Active in July Run",
      statusKey: "ACTIVE",
    },
    {
      id: "INACTIVE",
      label: "Inactive Rules",
      value: kpis.inactiveRules,
      unit: "Disabled",
      icon: XCircle,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "Requires review",
      statusKey: "INACTIVE",
    },
    {
      id: "STATUTORY",
      label: "Statutory Deductions",
      value: kpis.statutoryDeductions,
      unit: "PF, ESI, PT, TDS",
      icon: ShieldCheck,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      delta: "Mandatory statutory",
      statusKey: "ALL",
    },
    {
      id: "CUSTOM",
      label: "Custom & Voluntary",
      value: kpis.customDeductions,
      unit: "Insurance, NPS, Assets",
      icon: Building,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Employee opted",
      statusKey: "ALL",
    },
    {
      id: "LOANS",
      label: "Loan Recoveries",
      value: kpis.loanRecoveries,
      unit: "Active Loan EMIs",
      icon: CreditCard,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      delta: "Monthly principal recovery",
      statusKey: "ALL",
    },
    {
      id: "ADVANCE",
      label: "Advance Recoveries",
      value: kpis.advanceRecoveries,
      unit: "Salary Advance",
      icon: TrendingDown,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      delta: "Recovered at payroll run",
      statusKey: "ALL",
    },
    {
      id: "MONTHLY_AMT",
      label: "Monthly Deduction Amount",
      value: `₹${(kpis.monthlyDeductionAmount / 100000).toFixed(2)}L`,
      unit: "July Payroll Cut",
      icon: DollarSign,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "Statutory + Recovery",
      statusKey: "ALL",
    },
    {
      id: "ANNUAL_AMT",
      label: "Annual Deduction Amount",
      value: `₹${(kpis.annualDeductionAmount / 100000).toFixed(2)}L`,
      unit: "FY27 Projected",
      icon: DollarSign,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Full year projection",
      statusKey: "ALL",
    },
    {
      id: "COMPLIANCE_SCORE",
      label: "Compliance Score",
      value: `${kpis.complianceScore}%`,
      unit: "Audit Grade A+",
      icon: Award,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "Zero statutory breach",
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
            className={`ded-card kpi-ded-card p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
              isSelected ? "ring-2 ring-rose-500 bg-slate-800/80" : ""
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
