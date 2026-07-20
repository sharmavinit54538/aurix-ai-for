import React from "react";
import { Users, MapPin, ChevronDown, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { BackendHierarchyNode } from "@/store/employeeHierarchy/employeeHierarchyTypes";

export interface OrgChartNodeCardProps {
  node: BackendHierarchyNode;
  isExpanded: boolean;
  isSelected: boolean;
  isMatched: boolean;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelect: (node: BackendHierarchyNode) => void;
}

function getStatusBadge(status: string) {
  const s = status ? status.toLowerCase() : "active";
  switch (s) {
    case "active":
      return {
        label: "Active",
        bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
      };
    case "probation":
      return {
        label: "Probation",
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: Clock,
      };
    case "on_leave":
      return {
        label: "On Leave",
        bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        icon: AlertCircle,
      };
    default:
      return {
        label: s.replace("_", " "),
        bg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        icon: CheckCircle2,
      };
  }
}

export const OrgChartNodeCard = React.memo(function OrgChartNodeCard({
  node,
  isExpanded,
  isSelected,
  isMatched,
  onToggleExpand,
  onSelect,
}: OrgChartNodeCardProps) {
  const hasChildren = node.children && node.children.length > 0;
  const statusInfo = getStatusBadge(node.status || node.employment_status || "active");
  const StatusIcon = statusInfo.icon;
  const fullName = `${node.first_name} ${node.last_name}`.trim();

  const initials = fullName
    ? fullName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "EX";

  const teamSize = node.children ? node.children.length : 0;

  return (
    <div className="relative group/node flex flex-col items-center">
      <div
        id={`node-${node.id}`}
        onClick={() => onSelect(node)}
        className={`relative w-[280px] cursor-pointer rounded-2xl border bg-card/85 p-4 shadow-lg backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl text-left ${
          isSelected
            ? "border-primary ring-2 ring-primary/40 shadow-glow"
            : isMatched
            ? "border-brand-accent ring-2 ring-brand-accent/50 shadow-brand-accent/20 animate-pulse"
            : "border-border/80 hover:border-foreground/30"
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5 mb-3">
          <span className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-accent/60 px-2 py-0.5 rounded">
            {node.employee_id || "EMP"}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.bg}`}
          >
            <StatusIcon className="h-3 w-3" />
            <span className="capitalize">{statusInfo.label}</span>
          </span>
        </div>

        {/* Profile Row */}
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
            {teamSize > 0 && (
              <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow">
                {teamSize}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-display text-sm font-bold tracking-tight text-foreground truncate group-hover/node:text-primary transition-colors">
              {fullName}
            </h4>
            <p className="text-xs font-medium text-muted-foreground truncate">{node.designation || "Staff"}</p>
            <p className="text-[11px] text-muted-foreground/80 truncate">{node.department || "General"}</p>
          </div>
        </div>

        {/* Details Footer Row */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/50 pt-2.5 text-left text-[11px] text-muted-foreground">
          <div className="truncate">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Manager</span>
            <span className="font-medium text-foreground truncate block">
              {node.reporting_manager_name || "Board / Executive"}
            </span>
          </div>
          <div className="truncate">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Location</span>
            <span className="font-medium text-foreground truncate inline-flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
              {node.branch || "Headquarters"}
            </span>
          </div>
        </div>
      </div>

      {/* Expand / Collapse Trigger */}
      {hasChildren && (
        <button
          type="button"
          onClick={(e) => onToggleExpand(node.id, e)}
          className="mt-2 relative z-10 grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-foreground shadow-md transition-transform duration-200 hover:scale-110 hover:border-primary hover:bg-accent cursor-pointer"
          title={isExpanded ? "Collapse Direct Reports" : "Expand Direct Reports"}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-primary" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  );
});
