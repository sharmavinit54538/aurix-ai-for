import React from "react";
import { motion } from "framer-motion";
import { PayslipSummary } from "@/services/payslipsApi";
import {
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Download,
  AlertCircle,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

interface PayslipsSummaryCardsProps {
  summary?: PayslipSummary;
  isLoading?: boolean;
}

export const PayslipsSummaryCards: React.FC<PayslipsSummaryCardsProps> = ({
  summary,
  isLoading = false,
}) => {
  const formatCurrency = (val: number = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: "Total Payslips",
      value: summary?.total_payslips ?? 0,
      subtext: `${summary?.generated ?? 0} generated, ${summary?.pending_generation ?? 0} pending`,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Generated",
      value: summary?.generated ?? 0,
      subtext: `${summary?.total_payslips ? Math.round(((summary?.generated ?? 0) / summary.total_payslips) * 100) : 0}% of total`,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Pending Generation",
      value: summary?.pending_generation ?? 0,
      subtext: "Awaiting calculation",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Sent & Delivered",
      value: summary?.sent ?? 0,
      subtext: "Emailed to employees",
      icon: Send,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Downloaded",
      value: summary?.downloaded ?? 0,
      subtext: "Viewed / saved by staff",
      icon: Download,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Failed / Hold",
      value: summary?.failed ?? 0,
      subtext: "Requires review",
      icon: AlertCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
    {
      title: "Total Payroll Amount",
      value: formatCurrency(summary?.total_payroll_amount ?? 0),
      subtext: "Net disbursement volume",
      icon: IndianRupee,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      isCurrency: true,
    },
    {
      title: "Average Net Salary",
      value: formatCurrency(summary?.average_net_salary ?? 0),
      subtext: "Per employee net pay",
      icon: TrendingUp,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      isCurrency: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className={`relative overflow-hidden rounded-xl border ${card.borderColor} bg-card/60 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-xl font-bold font-display mt-1 text-foreground tracking-tight">
                  {isLoading ? (
                    <span className="inline-block h-6 w-24 animate-pulse rounded bg-muted/60" />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-2 flex items-center gap-1">
              {card.subtext}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
