import React from "react";
import {
  Timer,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  Sun,
  Moon,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { OvertimeSummaryKPIs } from "./overtimeTypes";

interface OvertimeKPIsProps {
  kpis: OvertimeSummaryKPIs;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
}

export const OvertimeKPIs: React.FC<OvertimeKPIsProps> = ({
  kpis,
  activeStatusFilter,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: "TOTAL_HRS",
      label: "Total Overtime Hours",
      value: `${kpis.totalOvertimeHours} hrs`,
      unit: "Logged OT",
      icon: Timer,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delta: "July 2026 Cycle",
      statusKey: "ALL",
    },
    {
      id: "APPROVED_HRS",
      label: "Approved OT Hours",
      value: `${kpis.approvedHours} hrs`,
      unit: "Payroll Mapped",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "Verified OT hours",
      statusKey: "APPROVED",
    },
    {
      id: "PENDING_REQ",
      label: "Pending Requests",
      value: kpis.pendingRequests,
      unit: "Awaiting Finance",
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Requires sign-off",
      statusKey: "PENDING_FINANCE",
    },
    {
      id: "REJECTED_REQ",
      label: "Rejected Requests",
      value: kpis.rejectedRequests,
      unit: "Disapproved",
      icon: XCircle,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "Unapproved OT punches",
      statusKey: "REJECTED",
    },
    {
      id: "TOTAL_COST",
      label: "Total Overtime Cost",
      value: `₹${(kpis.totalOvertimeCost / 1000).toFixed(1)}k`,
      unit: "July Pay Cut",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delta: "1.5x / 2.0x / 3.0x",
      statusKey: "ALL",
    },
    {
      id: "AVG_HRS",
      label: "Average OT Hours",
      value: `${kpis.averageOtHours} hrs`,
      unit: "per employee",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      delta: "Within 12h weekly limit",
      statusKey: "ALL",
    },
    {
      id: "WEEKEND_OT",
      label: "Weekend Overtime",
      value: `${kpis.weekendOvertimeHours} hrs`,
      unit: "2.0x Multiplier",
      icon: Sun,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Double pay rate",
      statusKey: "ALL",
    },
    {
      id: "HOLIDAY_OT",
      label: "Holiday Overtime",
      value: `${kpis.holidayOvertimeHours} hrs`,
      unit: "3.0x Multiplier",
      icon: Sun,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      delta: "Triple pay rate",
      statusKey: "ALL",
    },
    {
      id: "NIGHT_SHIFT",
      label: "Night Shift Hours",
      value: `${kpis.nightShiftHours} hrs`,
      unit: "Shift Differential",
      icon: Moon,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      delta: "Night bonus added",
      statusKey: "ALL",
    },
    {
      id: "COMPLIANCE_ALERTS",
      label: "Compliance Alerts",
      value: kpis.complianceAlerts,
      unit: "Fatigue Warning",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      delta: "Overtime limit check",
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
            className={`ot-card kpi-ot-card p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
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
