import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  GitFork,
  Layers,
  UserCheck,
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
    </div>
  );
}
