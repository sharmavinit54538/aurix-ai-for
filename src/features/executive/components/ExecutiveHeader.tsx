import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Download,
  Printer,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Crown,
  Code2,
  DollarSign,
  Server,
  Workflow,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ExecutiveRole, DateRangeType } from "../types/executiveTypes";

export interface ExecutiveHeaderProps {
  role: ExecutiveRole;
  title: string;
  subtitle: string;
  healthScore: number;
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
  onRefresh?: () => void;
}

const ROLES_NAV: { role: ExecutiveRole; label: string; icon: any }[] = [
  { role: "ceo", label: "CEO Dashboard", icon: Crown },
  { role: "cto", label: "CTO Dashboard", icon: Code2 },
  { role: "cfo", label: "CFO Dashboard", icon: DollarSign },
  { role: "cio", label: "CIO Dashboard", icon: Server },
  { role: "coo", label: "COO Dashboard", icon: Workflow },
  { role: "cmo", label: "CMO Dashboard", icon: Megaphone },
];

export function ExecutiveHeader({
  role,
  title,
  subtitle,
  healthScore,
  dateRange,
  setDateRange,
  onRefresh,
}: ExecutiveHeaderProps) {
  const navigate = useNavigate();

  const handleExport = (format: string) => {
    if (format === "print") {
      window.print();
      return;
    }
    toast.success(`Exporting ${role.toUpperCase()} Executive Report as ${format.toUpperCase()}...`);
  };

  const currentRoleObj = ROLES_NAV.find((r) => r.role === role) || ROLES_NAV[0];
  const RoleIcon = currentRoleObj.icon;

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/dashboard/executive" className="hover:text-foreground transition-colors">
          Executive Control Center
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground uppercase">{role} Dashboard</span>
      </div>

      {/* Main Header */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-left">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                <RoleIcon className="h-3.5 w-3.5" />
                {role.toUpperCase()} Executive Command
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/12 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Health Score: {healthScore}%
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-[26px] font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Action Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Date Range Selector */}
            <div className="flex flex-wrap items-center gap-1 bg-muted border border-border rounded-lg p-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
              {(["today", "week", "month", "quarter", "year"] as DateRangeType[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDateRange(r)}
                  className={`px-2.5 py-1 rounded-md capitalize text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    dateRange === r
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Export & Refresh Actions */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-[13px] gap-1.5 cursor-pointer"
                onClick={() => handleExport("pdf")}
              >
                <Download className="h-3.5 w-3.5 text-primary" /> Export PDF
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 text-[13px] gap-1.5 cursor-pointer"
                onClick={() => handleExport("excel")}
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" /> Excel
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 cursor-pointer"
                onClick={() => handleExport("print")}
                title="Print Report"
                aria-label="Print Report"
              >
                <Printer className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 cursor-pointer"
                onClick={onRefresh || (() => toast.success("Refreshed executive dataset."))}
                title="Refresh Dataset"
                aria-label="Refresh Dataset"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Navigation Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {ROLES_NAV.map((nav) => {
          const Icon = nav.icon;
          const isActive = nav.role === role;
          return (
            <button
              key={nav.role}
              type="button"
              onClick={() => navigate({ to: `/dashboard/executive/${nav.role}` as any })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{nav.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
