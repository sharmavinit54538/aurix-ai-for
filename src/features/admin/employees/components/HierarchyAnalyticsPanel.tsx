import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  GitFork,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Award,
} from "lucide-react";
import type { BackendHierarchyNode } from "@/store/employeeHierarchy/employeeHierarchyTypes";

export interface HierarchyAnalyticsPanelProps {
  trees: BackendHierarchyNode[];
  onClose?: () => void;
}

function calculateHierarchyMetrics(trees: BackendHierarchyNode[]) {
  let totalEmployees = 0;
  let totalManagers = 0;
  const departments = new Set<string>();
  let maxDepth = 0;
  let maxTeamSize = 0;
  let largestTeamManager = "";
  const overloadedManagers: { name: string; count: number }[] = [];
  const missingManagers: string[] = [];

  function traverse(node: BackendHierarchyNode, depth: number) {
    totalEmployees += 1;
    if (node.department) departments.add(node.department);
    if (depth > maxDepth) maxDepth = depth;

    const directCount = node.children ? node.children.length : 0;
    if (directCount > 0) {
      totalManagers += 1;
      if (directCount > maxTeamSize) {
        maxTeamSize = directCount;
        largestTeamManager = `${node.first_name} ${node.last_name}`;
      }
      if (directCount >= 5) {
        overloadedManagers.push({
          name: `${node.first_name} ${node.last_name}`,
          count: directCount,
        });
      }
    }

    if (!node.reporting_to && !node.designation?.toLowerCase().includes("ceo")) {
      missingManagers.push(`${node.first_name} ${node.last_name}`);
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, depth + 1));
    }
  }

  trees.forEach((t) => traverse(t, 1));

  const avgSpanOfControl = totalManagers > 0 ? (totalEmployees / totalManagers).toFixed(1) : "0.0";

  return {
    totalEmployees,
    totalManagers,
    totalDepartments: departments.size,
    maxDepth,
    maxTeamSize,
    largestTeamManager,
    avgSpanOfControl,
    overloadedManagers,
    missingManagers,
  };
}

export function HierarchyAnalyticsPanel({ trees }: HierarchyAnalyticsPanelProps) {
  const metrics = calculateHierarchyMetrics(trees);

  const kpis = [
    {
      label: "Total Workforce",
      value: metrics.totalEmployees.toString(),
      sub: "Active Employees in Database",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Leadership & Managers",
      value: metrics.totalManagers.toString(),
      sub: "Active Reporting Managers",
      icon: UserCheck,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Org Depth",
      value: `${metrics.maxDepth} Levels`,
      sub: "Max Hierarchy Chain Depth",
      icon: Layers,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Span of Control",
      value: `${metrics.avgSpanOfControl} Reports`,
      sub: "Average Reports / Manager",
      icon: GitFork,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`rounded-xl border ${kpi.bg} bg-card/60 p-3.5 backdrop-blur-md text-left shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mt-1 text-foreground">{kpi.value}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* AI Intelligence Insights Alerts Box */}
      <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 backdrop-blur-md text-left space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
            <Sparkles className="h-4 w-4 text-brand" />
            <span>AI Organizational Health & Optimization Insights</span>
          </div>
          <span className="text-[10px] font-mono bg-brand/10 text-brand px-2 py-0.5 rounded-full border border-brand/20">
            Real-Time Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Overloaded Managers Warning */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Overloaded Manager Span ({metrics.overloadedManagers.length})</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {metrics.overloadedManagers.length > 0
                ? `Managers like ${metrics.overloadedManagers[0]?.name} lead ${metrics.overloadedManagers[0]?.count} direct reports. Consider delegating to Team Leads.`
                : "All manager reporting spans are well-balanced within target parameters (<= 5 reports)."}
            </p>
          </div>

          {/* Unassigned Manager Links */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Reporting Continuity & Succession</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {metrics.missingManagers.length > 0
                ? `${metrics.missingManagers.length} active employee(s) require reporting manager assignment.`
                : "100% of non-executive workforce records are attached to valid reporting managers."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
