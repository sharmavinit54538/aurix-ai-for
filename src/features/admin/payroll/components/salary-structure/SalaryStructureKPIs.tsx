import React from "react";
import {
  Layers,
  CheckCircle2,
  FileEdit,
  Archive,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { SalaryStructureSummaryKPIs } from "./salaryStructureTypes";

interface SalaryStructureKPIsProps {
  kpis: SalaryStructureSummaryKPIs;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
}

export const SalaryStructureKPIs: React.FC<SalaryStructureKPIsProps> = ({
  kpis,
  activeStatusFilter,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: "ALL",
      label: "Total Salary Structures",
      value: kpis.totalStructures,
      unit: "Templates",
      icon: Layers,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "+2 this FY",
      statusKey: "ALL",
    },
    {
      id: "ACTIVE",
      label: "Active Structures",
      value: kpis.activeStructures,
      unit: "Published",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "100% compliant",
      statusKey: "ACTIVE",
    },
    {
      id: "DRAFT",
      label: "Draft Structures",
      value: kpis.draftStructures,
      unit: "In Review",
      icon: FileEdit,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Needs completion",
      statusKey: "DRAFT",
    },
    {
      id: "ARCHIVED",
      label: "Archived Structures",
      value: kpis.archivedStructures,
      unit: "Legacy",
      icon: Archive,
      color: "text-slate-400",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20",
      delta: "Historical audit",
      statusKey: "ARCHIVED",
    },
    {
      id: "ASSIGNED",
      label: "Employees Assigned",
      value: kpis.employeesAssigned.toLocaleString("en-IN"),
      unit: "Headcount",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      delta: "96.4% coverage",
      statusKey: "ALL",
    },
    {
      id: "AVG_CTC",
      label: "Average CTC",
      value: `₹${(kpis.averageCtc / 100000).toFixed(2)}L`,
      unit: "per annum",
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      delta: "+5.2% vs prev year",
      statusKey: "ALL",
    },
    {
      id: "EMPLOYER_COST",
      label: "Employer Cost (Monthly)",
      value: `₹${(kpis.totalEmployerCostMonthly / 100000).toFixed(2)}L`,
      unit: "PF/ESI/Benefits",
      icon: DollarSign,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      delta: "Statutory contribution",
      statusKey: "ALL",
    },
    {
      id: "PENDING_APPROVAL",
      label: "Pending Approvals",
      value: kpis.pendingApprovals,
      unit: "Awaiting CFO",
      icon: Clock,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "Action required",
      statusKey: "PENDING_APPROVAL",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatusFilter === card.statusKey;

        return (
          <div
            key={card.id}
            onClick={() => onFilterStatus(card.statusKey)}
            className={`salary-card kpi-card p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
              isSelected ? "ring-2 ring-blue-500 bg-slate-800/80" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-slate-400">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color} ${card.borderColor} border`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{card.value}</span>
              <span className="text-[11px] font-medium text-slate-400">{card.unit}</span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                {card.delta}
              </span>
              <span className="text-blue-400 hover:underline font-medium text-[10px]">Filter →</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
