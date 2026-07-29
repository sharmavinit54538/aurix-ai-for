import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  UserCheck,
  CreditCard,
  Target,
  ShieldCheck,
  Zap,
  Code,
  GitPullRequest,
  Server,
  Cpu,
  Wallet,
  Percent,
  FileCheck,
  BadgeCheck,
  Laptop,
  ShieldAlert,
  TicketCheck,
  PackageCheck,
  Database,
  Workflow,
  Palmtree,
  Globe,
  Filter,
} from "lucide-react";
import type { KpiMetric } from "../types/executiveTypes";

const ICON_MAP: Record<string, any> = {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  UserCheck,
  CreditCard,
  Target,
  ShieldCheck,
  Zap,
  Code,
  GitPullRequest,
  Server,
  Cpu,
  Wallet,
  Percent,
  FileCheck,
  BadgeCheck,
  Laptop,
  ShieldAlert,
  TicketCheck,
  PackageCheck,
  Database,
  Workflow,
  Palmtree,
  Globe,
  Filter,
};

export interface ExecutiveKpiCardProps {
  kpi: KpiMetric;
  loading?: boolean;
}

export function ExecutiveKpiCard({ kpi, loading }: ExecutiveKpiCardProps) {
  const Icon = ICON_MAP[kpi.iconName] || TrendingUp;

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-md animate-pulse space-y-3">
        <div className="h-4 w-24 bg-muted/60 rounded" />
        <div className="h-8 w-32 bg-muted/80 rounded" />
        <div className="h-3 w-28 bg-muted/40 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 text-left"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {kpi.title}
          </span>
          <h3 className="font-display text-2xl font-bold mt-1 text-foreground tracking-tight">
            {kpi.value}
          </h3>
        </div>

        <div className={`p-2.5 rounded-xl bg-accent/40 ${kpi.color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs">
        <span
          className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-full border ${
            kpi.isPositive
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {kpi.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {kpi.change}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[140px]">
          {kpi.subtext}
        </span>
      </div>
    </motion.div>
  );
}
