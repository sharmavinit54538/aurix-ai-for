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

const ROLES_NAV: { role: ExecutiveRole; label: string; icon: any; color: string }[] = [
  { role: "ceo", label: "CEO Dashboard", icon: Crown, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { role: "cto", label: "CTO Dashboard", icon: Code2, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { role: "cfo", label: "CFO Dashboard", icon: DollarSign, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { role: "cio", label: "CIO Dashboard", icon: Server, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { role: "coo", label: "COO Dashboard", icon: Workflow, color: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  { role: "cmo", label: "CMO Dashboard", icon: Megaphone, color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
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
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/dashboard/executive" className="hover:text-foreground transition-colors">
          Executive Control Center
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground capitalize">{role.toUpperCase()} Dashboard</span>
      </div>

      {/* Main Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-56 w-56 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">


              <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${currentRoleObj.color}`}>
                <RoleIcon className="h-3.5 w-3.5" />
                {role.toUpperCase()} Executive Command
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Health Score: {healthScore}%
              </div>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Action Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Date Range Selector */}
            <div className="flex items-center gap-1 bg-accent/30 border border-border/60 rounded-lg p-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
              {(["today", "week", "month", "quarter", "year"] as DateRangeType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-2 py-1 rounded-md capitalize font-medium transition-all cursor-pointer ${
                    dateRange === r
                      ? "bg-brand text-brand-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Export Dropdown */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs gap-1.5 border-border/60 hover:bg-accent cursor-pointer"
                onClick={() => handleExport("pdf")}
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" /> Export PDF
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs gap-1.5 border-border/60 hover:bg-accent cursor-pointer"
                onClick={() => handleExport("excel")}
              >
                <Download className="h-3.5 w-3.5 text-blue-400" /> Excel
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-border/60 hover:bg-accent cursor-pointer"
                onClick={() => handleExport("print")}
                title="Print Report"
              >
                <Printer className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-border/60 hover:bg-accent cursor-pointer"
                onClick={onRefresh || (() => toast.success("Refreshed executive dataset."))}
                title="Refresh Dataset"
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
              onClick={() => navigate({ to: `/dashboard/executive/${nav.role}` as any })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isActive
                  ? `${nav.color} shadow-sm border-brand/50`
                  : "border-border/40 bg-card/40 text-muted-foreground hover:bg-accent/40 hover:text-foreground"
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
