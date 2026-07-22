import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  Banknote,
  DollarSign,
  TrendingUp,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { BankTransferDashboardMetrics } from "@/services/bankTransfersApi";

interface BankTransfersSummaryCardsProps {
  metrics: BankTransferDashboardMetrics;
}

export const BankTransfersSummaryCards: React.FC<BankTransfersSummaryCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: "Total Employees",
      value: metrics.total_employees.toString(),
      subtitle: "Active Payout Roster",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
    },
    {
      title: "Ready for Payment",
      value: metrics.ready_for_payment.toString(),
      subtitle: "Verified Bank Accounts",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Processing",
      value: metrics.transfer_processing.toString(),
      subtitle: "Queued at Gateway",
      icon: RefreshCw,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Successful Transfers",
      value: metrics.successful_transfers.toString(),
      subtitle: "Confirmed Bank Settlement",
      icon: ShieldCheck,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/30",
    },
    {
      title: "Failed / Rejected",
      value: metrics.failed_transfers.toString(),
      subtitle: "IFSC or Account Errors",
      icon: AlertTriangle,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
    },
    {
      title: "Total Net Salary",
      value: `₹${(metrics.total_salary_amount / 100000).toFixed(2)}L`,
      subtitle: "Gross Payable Pool",
      icon: Banknote,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
    },
    {
      title: "Transferred Amount",
      value: `₹${(metrics.transferred_amount / 100000).toFixed(2)}L`,
      subtitle: "Disbursed to Accounts",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "Pending Amount",
      value: `₹${(metrics.pending_amount / 100000).toFixed(2)}L`,
      subtitle: "Awaiting Initiation",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Rejected Amount",
      value: `₹${(metrics.rejected_amount / 1000).toFixed(1)}k`,
      subtitle: "Requires Retry / Fix",
      icon: XCircle,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
    },
    {
      title: "Reconciliation",
      value: "100%",
      subtitle: "Bank Advice Synced",
      icon: CheckCircle2,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            className="p-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-md hover:border-border transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground truncate">{card.title}</span>
              <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${card.bg}`}>
                <Icon className={`h-3 w-3 ${card.color}`} />
              </div>
            </div>

            <div>
              <div className="text-base font-bold tracking-tight text-foreground">{card.value}</div>
              <p className="text-[9px] text-muted-foreground/80 truncate mt-0.5">{card.subtitle}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
