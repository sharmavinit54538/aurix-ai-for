import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Banknote,
  TrendingUp,
  TrendingDown,
  Users,
  Gift,
  Clock,
  Receipt,
  ShieldCheck,
  HeartPulse,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ReportsDashboardKPIs } from "@/services/payrollReportsApi";

interface ReportsSummaryCardsProps {
  kpis: ReportsDashboardKPIs;
}

export const ReportsSummaryCards: React.FC<ReportsSummaryCardsProps> = ({ kpis }) => {
  const fmtLakh = (v: number) => `₹${(v / 100000).toFixed(2)}L`;
  const fmtK = (v: number) => `₹${(v / 1000).toFixed(0)}k`;

  const cards = [
    {
      title: "Total Payroll Cost",
      value: fmtLakh(kpis.total_payroll_cost),
      trend: "+3.2%",
      trendUp: true,
      icon: DollarSign,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
    },
    {
      title: "Net Salary Paid",
      value: fmtLakh(kpis.net_salary_paid),
      trend: "+2.8%",
      trendUp: true,
      icon: Banknote,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Gross Salary",
      value: fmtLakh(kpis.gross_salary),
      trend: "+3.0%",
      trendUp: true,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
    },
    {
      title: "Total Deductions",
      value: fmtLakh(kpis.total_deductions),
      trend: "+1.5%",
      trendUp: true,
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
    },
    {
      title: "Employer Contributions",
      value: fmtLakh(kpis.employer_contributions),
      trend: "+2.1%",
      trendUp: true,
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Bonuses Paid",
      value: fmtLakh(kpis.bonuses_paid),
      trend: "+12%",
      trendUp: true,
      icon: Gift,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Overtime Paid",
      value: fmtLakh(kpis.overtime_paid),
      trend: "-4.2%",
      trendUp: false,
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/30",
    },
    {
      title: "Tax Deducted (TDS)",
      value: fmtLakh(kpis.tax_deducted),
      trend: "+2.4%",
      trendUp: true,
      icon: Receipt,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      title: "PF Contributions",
      value: fmtLakh(kpis.pf_contributions),
      trend: "+1.8%",
      trendUp: true,
      icon: ShieldCheck,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/30",
    },
    {
      title: "ESI Contributions",
      value: fmtK(kpis.esi_contributions),
      trend: "+0.5%",
      trendUp: true,
      icon: HeartPulse,
      color: "text-pink-400",
      bg: "bg-pink-500/10 border-pink-500/30",
    },
    {
      title: "Pending Payroll",
      value: kpis.pending_payroll === 0 ? "₹0" : fmtLakh(kpis.pending_payroll),
      trend: "Cleared",
      trendUp: true,
      icon: AlertCircle,
      color: kpis.pending_payroll === 0 ? "text-emerald-400" : "text-amber-400",
      bg: kpis.pending_payroll === 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Payroll Accuracy",
      value: `${kpis.accuracy_percentage}%`,
      trend: "Excellent",
      trendUp: true,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-md hover:border-border/80 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {card.title}
              </span>
              <div className={`h-6 w-6 rounded-lg border flex items-center justify-center ${card.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`h-3 w-3 ${card.color}`} />
              </div>
            </div>
            <div className="text-lg font-bold tracking-tight text-foreground">{card.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[10px] font-medium ${card.trendUp ? "text-emerald-400" : "text-rose-400"}`}>
                {card.trend}
              </span>
              <span className="text-[9px] text-muted-foreground/60">vs last month</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
