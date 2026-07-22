import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Clock,
  AlertTriangle,
  Receipt,
  Percent,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { ComplianceDashboardData } from "@/services/complianceApi";

interface ComplianceSummaryCardsProps {
  data: ComplianceDashboardData;
}

export const ComplianceSummaryCards: React.FC<ComplianceSummaryCardsProps> = ({ data }) => {
  const cards = [
    {
      title: "Compliance Score",
      value: `${data.overall_score}%`,
      subtitle: "Labor Law Health Rating",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Employees Covered",
      value: data.employees_covered.toString(),
      subtitle: "Active PF/ESI Enrolled",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
    },
    {
      title: "Pending Filings",
      value: data.pending_filings.toString(),
      subtitle: "ECR & ESI Challans Due",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Compliance Alerts",
      value: data.compliance_alerts.toString(),
      subtitle: "Missing UAN / PAN flags",
      icon: AlertTriangle,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
    },
    {
      title: "PF Remittance",
      value: `₹${(data.total_pf_amount / 1000).toFixed(1)}k`,
      subtitle: "Employer + Employee PF",
      icon: Receipt,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      title: "ESI Remittance",
      value: `₹${(data.total_esi_amount / 1000).toFixed(1)}k`,
      subtitle: "Medical Insurance Contribution",
      icon: Percent,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "TDS Liability",
      value: `₹${(data.total_tds_amount / 100000).toFixed(2)}L`,
      subtitle: "Monthly Income Tax TDS",
      icon: TrendingUp,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
    },
    {
      title: "Monthly Status",
      value: data.monthly_status,
      subtitle: "Statutory Filings Sync",
      icon: CheckCircle2,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className="p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-md hover:border-border transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-muted-foreground truncate">{card.title}</span>
              <div className={`h-6 w-6 rounded-lg border flex items-center justify-center ${card.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight text-foreground">{card.value}</div>
              <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5">{card.subtitle}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
