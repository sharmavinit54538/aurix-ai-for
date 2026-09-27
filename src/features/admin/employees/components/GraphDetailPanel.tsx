import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Building2,
  FolderKanban,
  Lightbulb,
  Target,
  Shield,
  Workflow,
  ChevronRight,
  MapPin,
  Briefcase,
  Sparkles,
  Network,
  ExternalLink,
  User,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  OrgGraphNodeDetails,
  OrgGraphNode,
  OrgGraphRelationship,
  OrgGraphNodeType,
} from "@/store/employeeHierarchy/organizationalGraphTypes";

interface GraphDetailPanelProps {
  details: OrgGraphNodeDetails;
  onClose: () => void;
  onFocusNode: (nodeId: string) => void;
  onExplore: () => void;
  explorerActive: boolean;
}

const nodeTypeConfig: Record<
  OrgGraphNodeType,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  employee: { icon: User, color: "text-blue-400", bg: "bg-blue-500/15", label: "Employee" },
  manager: { icon: Crown, color: "text-amber-400", bg: "bg-amber-500/15", label: "Manager" },
  team: { icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/15", label: "Team" },
  department: { icon: Building2, color: "text-violet-400", bg: "bg-violet-500/15", label: "Department" },
  project: { icon: FolderKanban, color: "text-emerald-400", bg: "bg-emerald-500/15", label: "Project" },
  skill: { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/15", label: "Skill" },
  goal: { icon: Target, color: "text-rose-400", bg: "bg-rose-500/15", label: "Goal" },
  policy: { icon: Shield, color: "text-indigo-400", bg: "bg-indigo-500/15", label: "Policy" },
  workflow: { icon: Workflow, color: "text-teal-400", bg: "bg-teal-500/15", label: "Workflow" },
};

function NodeTypeBadge({ type }: { type: OrgGraphNodeType }) {
  const config = nodeTypeConfig[type];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${config.bg} ${config.color} border-current/20`}
    >
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </span>
  );
}

function ConnectionCard({
  rel,
  connectedNode,
  onFocus,
}: {
  rel: OrgGraphRelationship;
  connectedNode: OrgGraphNode;
  onFocus: () => void;
}) {
  const config = nodeTypeConfig[connectedNode.type];
  const Icon = config.icon;

  return (
    <motion.button
      type="button"
      whileHover={{ x: 3 }}
      onClick={onFocus}
      className="flex items-center justify-between gap-2 w-full rounded-lg border border-border/60 bg-card/80 p-2 hover:border-primary/50 cursor-pointer transition-colors text-left group"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className={`grid h-7 w-7 place-items-center rounded-lg ${config.bg} ${config.color} shrink-0`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-foreground truncate">
            {connectedNode.label}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {rel.label} — {connectedNode.subtitle || config.label}
          </p>
        </div>
      </div>
      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
    </motion.button>
  );
}

export function GraphDetailPanel({
  details,
  onClose,
  onFocusNode,
  onExplore,
  explorerActive,
}: GraphDetailPanelProps) {
  const { node, directConnections, connectedNodes } = details;
  const config = nodeTypeConfig[node.type];
  const Icon = config.icon;

  // Group connections by relationship type
  const groupedConnections = new Map<string, { rel: OrgGraphRelationship; node: OrgGraphNode }[]>();
  directConnections.forEach((rel) => {
    const connectedId =
      rel.sourceNodeId === node.id ? rel.targetNodeId : rel.sourceNodeId;
    const connNode = connectedNodes.find((n) => n.id === connectedId);
    if (!connNode) return;

    const group = groupedConnections.get(rel.type) || [];
    group.push({ rel, node: connNode });
    groupedConnections.set(rel.type, group);
  });

  // Employee-specific metadata
  const isEmployee = node.type === "employee" || node.type === "manager";
  const meta = node.metadata || {};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 right-6 z-40 max-w-md w-full rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl text-left animate-in slide-in-from-right duration-200 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${config.bg} ${config.color} shrink-0`}>
              {isEmployee && meta.profilePhotoUrl ? (
                <img
                  src={String(meta.profilePhotoUrl)}
                  alt={node.label}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-sm font-bold text-foreground truncate">{node.label}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <NodeTypeBadge type={node.type} />
                {node.subtitle && (
                  <span className="text-[10px] text-muted-foreground truncate">{node.subtitle}</span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mt-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-auto p-4 space-y-4 text-xs">
          {/* Metadata Grid (employee-specific) */}
          {isEmployee && (
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-accent/20 p-3">
              {meta.employeeId && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Employee ID</span>
                  <p className="font-mono font-medium text-foreground">{String(meta.employeeId)}</p>
                </div>
              )}
              {meta.department && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Department</span>
                  <p className="font-medium text-foreground">{String(meta.department)}</p>
                </div>
              )}
              {meta.designation && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Designation</span>
                  <p className="font-medium text-foreground">{String(meta.designation)}</p>
                </div>
              )}
              {meta.reportingManagerName && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Manager</span>
                  <p className="font-medium text-foreground">{String(meta.reportingManagerName)}</p>
                </div>
              )}
              {meta.branch && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Location</span>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                    {String(meta.branch)}
                  </p>
                </div>
              )}
              {meta.employmentType && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Employment</span>
                  <p className="font-medium text-foreground capitalize">
                    {String(meta.employmentType).replace(/_/g, " ")}
                  </p>
                </div>
              )}
              {meta.directReportsCount != null && Number(meta.directReportsCount) > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Direct Reports</span>
                  <p className="font-medium text-foreground">{String(meta.directReportsCount)}</p>
                </div>
              )}
              {meta.joiningDate && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Joined</span>
                  <p className="font-medium text-foreground">{String(meta.joiningDate)}</p>
                </div>
              )}
            </div>
          )}

          {/* Department-specific metadata */}
          {node.type === "department" && (
            <div className="rounded-xl border border-border bg-accent/20 p-3 space-y-1">
              {meta.managerName && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Department Head</span>
                  <p className="font-medium text-foreground">{String(meta.managerName)}</p>
                </div>
              )}
              {meta.employeeCount != null && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Team Size</span>
                  <p className="font-medium text-foreground">{String(meta.employeeCount)} members</p>
                </div>
              )}
            </div>
          )}

          {/* Connected Relationships */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Connected Relationships ({directConnections.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onExplore}
                className={`text-[10px] h-6 px-2 gap-1 cursor-pointer ${
                  explorerActive ? "text-brand" : "text-muted-foreground"
                }`}
              >
                <Network className="h-3 w-3" />
                {explorerActive ? "Close Explorer" : "Explore Connections"}
              </Button>
            </div>

            {directConnections.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/10 p-3 text-center">
                <p className="text-[11px] text-muted-foreground">No relationships configured for this node.</p>
              </div>
            ) : (
              Array.from(groupedConnections.entries()).map(([relType, items]) => (
                <div key={relType} className="space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider block">
                    {relType.replace(/_/g, " ")} ({items.length})
                  </span>
                  <div className="space-y-1">
                    {items.map(({ rel, node: connNode }) => (
                      <ConnectionCard
                        key={rel.id}
                        rel={rel}
                        connectedNode={connNode}
                        onFocus={() => onFocusNode(connNode.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
