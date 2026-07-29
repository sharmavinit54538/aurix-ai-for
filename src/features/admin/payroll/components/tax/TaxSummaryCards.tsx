import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  Coins,
  ShieldCheck,
  Building2,
  Receipt,
  FileCheck,
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
  const formatCurrency = (val?: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val ?? 0);

  const formatNumber = (val?: number) => (val ?? 0).toLocaleString();

  const s = summary;

  const cards = [
    {
      title: "Total Tax",
      value: formatCurrency(s?.total_tax ?? s?.total_tds ?? 0),
      subtext: "Annual income tax liability",
      icon: IndianRupee,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    },
    {
      title: "TDS Collected",
      value: formatCurrency(s?.tds_collected ?? s?.tax_collected ?? 0),
      subtext: "Deducted via monthly payroll",
      icon: Coins,
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400",
    },
    {
      title: "Professional Tax",
      value: formatCurrency(s?.professional_tax ?? 0),
      subtext: "State statutory PT liability",
      icon: Building2,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
    },
    {
      title: "Taxable Employees",
      value: formatNumber(s?.taxable_employees ?? s?.total_employees ?? 0),
      subtext: "Employees subject to TDS",
      icon: Users,
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400",
    },
    {
      title: "Exemptions",
      value: formatCurrency(s?.exemptions ?? 0),
      subtext: "Standard & declared exemptions",
      icon: FileCheck,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Pending Tax Filings",
      value: formatNumber(s?.pending_tax_filings ?? s?.pending_declaration ?? 0),
      subtext: "Declarations awaiting verification",
      icon: Clock,
      color: "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400",
    },
    {
      title: "Financial Year Summary",
      value: `FY ${s?.financial_year || "2026-2027"}`,
      subtext: `Compliance Readiness: ${s?.compliance_score ?? 0}%`,
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
            transition={{ duration: 0.3, delay: idx * 0.04 }}
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
