import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  Coins,
  ArrowDownRight,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { TaxSummaryMetrics } from "@/services/taxApi";

interface TaxSummaryCardsProps {
  summary?: TaxSummaryMetrics;
  isLoading?: boolean;
}

export const TaxSummaryCards: React.FC<TaxSummaryCardsProps> = ({
  summary,
  isLoading = false,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const cards = [
    {
      title: "Total Employees",
      value: summary ? summary.total_employees.toLocaleString() : "0",
      subtext: "Eligible for TDS assessment",
      icon: Users,
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400",
    },
    {
      title: "Tax Filed / Approved",
      value: summary ? summary.tax_filed.toLocaleString() : "0",
      subtext: "Declarations verified & approved",
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Pending Declarations",
      value: summary ? summary.pending_declaration.toLocaleString() : "0",
      subtext: "Awaiting employee proof upload",
      icon: Clock,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
    },
    {
      title: "Total Projected TDS",
      value: summary ? formatCurrency(summary.total_tds) : "₹0",
      subtext: "Annual income tax liability",
      icon: IndianRupee,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    },
    {
      title: "Tax Collected (YTD)",
      value: summary ? formatCurrency(summary.tax_collected) : "₹0",
      subtext: "Deducted via monthly payroll",
      icon: Coins,
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400",
    },
    {
      title: "Tax Refund Due",
      value: summary ? formatCurrency(summary.tax_refund) : "₹0",
      subtext: "Excess TDS to be refunded",
      icon: ArrowDownRight,
      color: "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400",
    },
    {
      title: "Average Tax Liability",
      value: summary ? formatCurrency(summary.average_tax) : "₹0",
      subtext: "Per employee annual tax",
      icon: TrendingUp,
      color: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400",
    },
    {
      title: "Statutory Compliance",
      value: summary ? `${summary.compliance_score}%` : "100%",
      subtext: "Form 16 & TDS filing readiness",
      icon: ShieldCheck,
      color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`p-4 rounded-xl bg-card/70 border backdrop-blur-md relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/40`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {card.title}
              </span>
              <div
                className={`h-8 w-8 rounded-lg bg-gradient-to-br border flex items-center justify-center ${card.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5">
              {isLoading ? (
                <div className="h-7 w-28 bg-muted/50 rounded animate-pulse" />
              ) : (
                <div className="text-xl font-bold tracking-tight">
                  {card.value}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {card.subtext}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
