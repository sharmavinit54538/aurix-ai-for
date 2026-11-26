import React from "react";
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
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs animate-pulse space-y-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="h-3 w-28 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="text-[13px] font-medium text-muted-foreground">
            {kpi.title}
          </span>
          <h3 className="font-display text-2xl font-semibold mt-1 text-foreground tracking-tight tabular-nums">
            {kpi.value}
          </h3>
        </div>

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5 text-xs">
        <span
          className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full border ${
            kpi.isPositive
              ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
              : "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25"
          }`}
        >
          {kpi.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {kpi.change}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
          {kpi.subtext}
        </span>
      </div>
    </div>
  );
}
