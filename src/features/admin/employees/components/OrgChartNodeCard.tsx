import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  MapPin,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Shield,
  Crown,
  Laptop,
  Briefcase,
  Building,
  UserCheck,
} from "lucide-react";
import type { BackendHierarchyNode } from "@/store/employeeHierarchy/employeeHierarchyTypes";

export interface OrgChartNodeCardProps {
  node: BackendHierarchyNode;
  isExpanded: boolean;
  isSelected: boolean;
  isMatched: boolean;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelect: (node: BackendHierarchyNode) => void;
  layout?: "vertical" | "horizontal" | "radial" | "compact";
}

function getRoleBadge(designation: string = "", role: string = "") {
  const d = designation.toLowerCase();
  const r = role.toLowerCase();

  if (d.includes("ceo") || d.includes("chief executive") || d.includes("founder")) {
    return { label: "CEO / Founder", bg: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: Crown };
  }
  if (d.includes("vice president") || d.includes("vp") || d.includes("director")) {
    return { label: "Executive / VP", bg: "bg-purple-500/20 text-purple-300 border-purple-500/40", icon: Shield };
  }
  if (d.includes("manager") || d.includes("lead") || d.includes("head")) {
    return { label: "Team Leader", bg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40", icon: UserCheck };
  }
  if (r.includes("hr") || d.includes("hr")) {
    return { label: "HR Admin", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: Briefcase };
  }
  if (d.includes("contractor") || d.includes("freelance")) {
    return { label: "Contractor", bg: "bg-sky-500/20 text-sky-300 border-sky-500/40", icon: Laptop };
  }
  if (d.includes("intern")) {
    return { label: "Intern", bg: "bg-rose-500/20 text-rose-300 border-rose-500/40", icon: Building };
  }
  return null;
}

function getStatusInfo(status: string = "") {
  const s = status.toLowerCase();
  if (s === "on_leave" || s === "leave") {
    return { label: "On Leave", color: "bg-amber-500", text: "text-amber-400" };
  }
  if (s === "inactive" || s === "offline") {
    return { label: "Offline", color: "bg-slate-400", text: "text-slate-400" };
  }
  return { label: "Online", color: "bg-emerald-500", text: "text-emerald-400" };
}

export const OrgChartNodeCard = React.memo(function OrgChartNodeCard({
  node,
  isExpanded,
  isSelected,
  isMatched,
  onToggleExpand,
  onSelect,
  layout = "vertical",
}: OrgChartNodeCardProps) {
  const hasChildren = node.children && node.children.length > 0;
  const directReportsCount = node.children ? node.children.length : 0;
  const statusInfo = getStatusInfo(node.status || node.employment_status || "active");
  const roleBadge = getRoleBadge(node.designation, node.role);

  const fullName = `${node.first_name} ${node.last_name}`.trim();
  const initials = fullName
    ? fullName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "EX";

  // AI Insight check (e.g. manager with > 5 direct reports or missing manager)
  const isOverloadedManager = directReportsCount >= 5;
  const isMissingManager = !node.reporting_to && !node.designation?.toLowerCase().includes("ceo");
  const hasAiWarning = isOverloadedManager || isMissingManager;

  const isHorizontal = layout === "horizontal";
  const isCompact = layout === "compact";

  return (
    <div className={`relative group/node flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"}`}>
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ duration: 0.15 }}
        id={`node-${node.id}`}
        onClick={() => onSelect(node)}
        className={`relative ${
          isCompact ? "w-[240px] p-3" : "w-[280px] p-4"
        } cursor-pointer rounded-2xl border bg-card/85 shadow-lg backdrop-blur-xl transition-all duration-200 hover:shadow-2xl text-left ${
          isSelected
            ? "border-primary ring-2 ring-primary/50 shadow-glow bg-card/95"
            : isMatched
            ? "border-brand-accent ring-2 ring-brand-accent/60 shadow-brand-accent/20 animate-pulse"
            : "border-border/80 hover:border-foreground/40"
        }`}
      >
        {/* Top Header Pill Row */}
        <div className="flex items-center justify-between gap-1.5 border-b border-border/50 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-accent/60 px-2 py-0.5 rounded">
              {node.employee_id || "EMP"}
            </span>

            {/* Role Badge */}
            {roleBadge && (
              <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${roleBadge.bg}`}>
                <roleBadge.icon className="h-2.5 w-2.5" />
                {roleBadge.label}
              </span>
            )}
          </div>

          {/* Status Dot */}
          <div className="flex items-center gap-1.5">
            {hasAiWarning && (
              <span
                className="grid h-5 w-5 place-items-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"
                title={isOverloadedManager ? "AI Alert: Overloaded Manager" : "AI Alert: Unassigned Manager"}
              >
                <Sparkles className="h-3 w-3 animate-pulse" />
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
              <span className="hidden sm:inline">{statusInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Profile Avatar & Metadata */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {node.profile_photo_url ? (
              <img
                src={node.profile_photo_url}
                alt={fullName}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-border/80"
              />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-brand-foreground shadow-sm">
                {initials}
              </div>
            )}
            {directReportsCount > 0 && (
              <span
                className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow"
                title={`${directReportsCount} Direct Reports`}
              >
                {directReportsCount}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-display text-sm font-bold tracking-tight text-foreground truncate group-hover/node:text-primary transition-colors">
              {fullName}
            </h4>
            <p className="text-xs font-semibold text-muted-foreground truncate">{node.designation || "Staff"}</p>
            <p className="text-[11px] text-muted-foreground/80 truncate">{node.department || "General"}</p>
          </div>
        </div>

        {/* Footer Info Row */}
        {!isCompact && (
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/50 pt-2 text-left text-[11px] text-muted-foreground">
            <div className="truncate">
              <span className="text-[9px] uppercase font-semibold text-muted-foreground/60 block">Manager</span>
              <span className="font-medium text-foreground truncate block">
                {node.reporting_manager_name || "Executive Board"}
              </span>
            </div>
            <div className="truncate">
              <span className="text-[9px] uppercase font-semibold text-muted-foreground/60 block">Location</span>
              <span className="font-medium text-foreground truncate inline-flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                {node.branch || "Headquarters"}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Expand/Collapse Control Button */}
      {hasChildren && (
        <button
          type="button"
          onClick={(e) => onToggleExpand(node.id, e)}
          className={`relative z-10 grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-foreground shadow-md transition-transform duration-200 hover:scale-110 hover:border-primary hover:bg-accent cursor-pointer ${
            isHorizontal ? "ml-2" : "mt-2"
          }`}
          title={isExpanded ? "Collapse Direct Reports" : "Expand Direct Reports"}
        >
          {isExpanded ? (
            isHorizontal ? (
              <ChevronDown className="h-4 w-4 text-primary" />
            ) : (
              <ChevronDown className="h-4 w-4 text-primary" />
            )
          ) : isHorizontal ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  );
});
