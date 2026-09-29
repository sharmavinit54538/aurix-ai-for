import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building2,
  FolderKanban,
  Lightbulb,
  Target,
  Shield,
  Workflow,
  User,
  Crown,
  ChevronDown,
  ChevronRight,
  MapPin,
  Briefcase,
  Network,
} from "lucide-react";
import type {
  OrgGraphNode,
  OrgGraphRelationship,
  OrgGraphNodeType,
  OrgGraphFilterCategory,
} from "@/store/employeeHierarchy/organizationalGraphTypes";

// ── Node type visual config ──────────────────────────────────────
const nodeTypeConfig: Record<
  OrgGraphNodeType,
  { icon: React.ElementType; color: string; bg: string; ringColor: string; gradient: string }
> = {
  employee: {
    icon: User,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    ringColor: "ring-blue-500/40",
    gradient: "from-blue-600/20 to-blue-500/5",
  },
  manager: {
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    ringColor: "ring-amber-500/40",
    gradient: "from-amber-600/20 to-amber-500/5",
  },
  team: {
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    ringColor: "ring-cyan-500/40",
    gradient: "from-cyan-600/20 to-cyan-500/5",
  },
  department: {
    icon: Building2,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    ringColor: "ring-violet-500/40",
    gradient: "from-violet-600/20 to-violet-500/5",
  },
  project: {
    icon: FolderKanban,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    ringColor: "ring-emerald-500/40",
    gradient: "from-emerald-600/20 to-emerald-500/5",
  },
  skill: {
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    ringColor: "ring-yellow-500/40",
    gradient: "from-yellow-600/20 to-yellow-500/5",
  },
  goal: {
    icon: Target,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    ringColor: "ring-rose-500/40",
    gradient: "from-rose-600/20 to-rose-500/5",
  },
  policy: {
    icon: Shield,
    color: "text-indigo-400",
    bg: "bg-indigo-500/15",
    ringColor: "ring-indigo-500/40",
    gradient: "from-indigo-600/20 to-indigo-500/5",
  },
  workflow: {
    icon: Workflow,
    color: "text-teal-400",
    bg: "bg-teal-500/15",
    ringColor: "ring-teal-500/40",
    gradient: "from-teal-600/20 to-teal-500/5",
  },
};

// ── Category to node type mapping ────────────────────────────────
const categoryNodeTypes: Record<OrgGraphFilterCategory, OrgGraphNodeType[]> = {
  people: ["employee", "manager"],
  teams: ["team", "department"],
  projects: ["project"],
  skills: ["skill"],
  goals: ["goal"],
  policies: ["policy"],
  workflows: ["workflow"],
};

// ── Graph Node Card ─────────────────────────────────────────────
interface GraphNodeCardProps {
  node: OrgGraphNode;
  isSelected: boolean;
  isHighlighted: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  connectionCount: number;
  onClick: () => void;
}

const GraphNodeCard = React.memo(function GraphNodeCard({
  node,
  isSelected,
  isHighlighted,
  isConnected,
  isDimmed,
  connectionCount,
  onClick,
}: GraphNodeCardProps) {
  const config = nodeTypeConfig[node.type];
  const Icon = config.icon;
  const isEmployee = node.type === "employee" || node.type === "manager";
  const meta = node.metadata || {};

  const initials = node.label
    ? node.label
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border bg-card/85 shadow-lg backdrop-blur-xl transition-all duration-200 p-3 w-[220px] text-left group ${
        isSelected
          ? `border-primary ring-2 ring-primary/50 shadow-xl bg-card/95`
          : isHighlighted
          ? `border-brand-accent ring-2 ${config.ringColor} shadow-lg`
          : isConnected
          ? `border-border/80 ring-1 ${config.ringColor}`
          : isDimmed
          ? "border-border/40 opacity-40 hover:opacity-70"
          : "border-border/80 hover:border-foreground/40 hover:shadow-xl"
      }`}
    >
      {/* Gradient accent */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${config.gradient} pointer-events-none`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="relative shrink-0">
            {isEmployee && meta.profilePhotoUrl ? (
              <img
                src={String(meta.profilePhotoUrl)}
                alt={node.label}
                className="h-9 w-9 rounded-lg object-cover ring-1 ring-border/60"
              />
            ) : (
              <div
                className={`grid h-9 w-9 place-items-center rounded-lg ${config.bg} ${config.color} text-xs font-bold shadow-sm`}
              >
                {isEmployee ? initials : <Icon className="h-4 w-4" />}
              </div>
            )}
            {connectionCount > 0 && (
              <span
                className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow"
                title={`${connectionCount} connections`}
              >
                {connectionCount > 9 ? "9+" : connectionCount}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
              {node.label}
            </h4>
            {node.subtitle && (
              <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                {node.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/30">
          <span
            className={`inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${config.bg} ${config.color}`}
          >
            <Icon className="h-2 w-2" />
            {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
          </span>

          {isEmployee && Boolean(meta.department) && (
            <span className="text-[9px] text-muted-foreground truncate max-w-[100px]">
              {String(meta.department)}
            </span>
          )}

          {node.type === "department" && meta.employeeCount != null && (
            <span className="text-[9px] text-muted-foreground">
              {String(meta.employeeCount)} members
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// ── Main Graph Canvas ───────────────────────────────────────────
export interface OrganizationalGraphCanvasProps {
  nodes: OrgGraphNode[];
  relationships: OrgGraphRelationship[];
  activeCategories: OrgGraphFilterCategory[];
  focusedNodeId: string | null;
  highlightedPath: string[];
  zoomLevel: number;
  onSelectNode: (nodeId: string) => void;
}

export function OrganizationalGraphCanvas({
  nodes,
  relationships,
  activeCategories,
  focusedNodeId,
  highlightedPath,
  zoomLevel,
  onSelectNode,
}: OrganizationalGraphCanvasProps) {
  const scale = useMemo(() => zoomLevel / 100, [zoomLevel]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filter nodes by active categories
  const visibleNodeTypes = useMemo(() => {
    const types = new Set<OrgGraphNodeType>();
    activeCategories.forEach((cat) => {
      categoryNodeTypes[cat].forEach((t) => types.add(t));
    });
    return types;
  }, [activeCategories]);

  const filteredNodes = useMemo(
    () => nodes.filter((n) => visibleNodeTypes.has(n.type)),
    [nodes, visibleNodeTypes]
  );

  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes]
  );

  // Count connections per node
  const connectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    relationships.forEach((r) => {
      if (filteredNodeIds.has(r.sourceNodeId) && filteredNodeIds.has(r.targetNodeId)) {
        counts.set(r.sourceNodeId, (counts.get(r.sourceNodeId) || 0) + 1);
        counts.set(r.targetNodeId, (counts.get(r.targetNodeId) || 0) + 1);
      }
    });
    return counts;
  }, [relationships, filteredNodeIds]);

  // Highlighted node IDs
  const highlightedSet = useMemo(
    () => new Set(highlightedPath),
    [highlightedPath]
  );

  // Focused node's direct connections
  const focusedConnections = useMemo(() => {
    if (!focusedNodeId) return new Set<string>();
    const connected = new Set<string>();
    relationships.forEach((r) => {
      if (r.sourceNodeId === focusedNodeId) connected.add(r.targetNodeId);
      if (r.targetNodeId === focusedNodeId) connected.add(r.sourceNodeId);
    });
    return connected;
  }, [focusedNodeId, relationships]);

  // Group nodes by type for layout
  const groupedNodes = useMemo(() => {
    const groups = new Map<OrgGraphNodeType, OrgGraphNode[]>();
    filteredNodes.forEach((n) => {
      const list = groups.get(n.type) || [];
      list.push(n);
      groups.set(n.type, list);
    });
    return groups;
  }, [filteredNodes]);

  // Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
    },
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const typeOrder: OrgGraphNodeType[] = [
    "manager",
    "employee",
    "department",
    "team",
    "project",
    "skill",
    "goal",
    "policy",
    "workflow",
  ];

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl min-h-[650px] ${
        isDragging ? "cursor-grabbing select-none" : "cursor-grab"
      }`}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Canvas transform wrapper */}
      <div
        className="transition-transform duration-150 origin-center py-8 px-8"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        {filteredNodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Network className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No nodes match current filters</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Adjust the category filters above to show organizational entities.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {typeOrder.map((nodeType) => {
              const group = groupedNodes.get(nodeType);
              if (!group || group.length === 0) return null;

              const config = nodeTypeConfig[nodeType];
              const Icon = config.icon;

              return (
                <div key={nodeType} className="space-y-3">
                  {/* Section header */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`grid h-6 w-6 place-items-center rounded-lg ${config.bg} ${config.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {nodeType === "employee" || nodeType === "manager"
                        ? `${nodeType}s`
                        : `${nodeType}s`}{" "}
                      ({group.length})
                    </span>
                    <div className={`flex-1 h-px ${config.bg}`} />
                  </div>

                  {/* Node cards */}
                  <div className="flex flex-wrap gap-3">
                    {group.map((node) => (
                      <GraphNodeCard
                        key={node.id}
                        node={node}
                        isSelected={focusedNodeId === node.id}
                        isHighlighted={highlightedSet.has(node.id)}
                        isConnected={focusedConnections.has(node.id)}
                        isDimmed={
                          focusedNodeId !== null &&
                          focusedNodeId !== node.id &&
                          !focusedConnections.has(node.id) &&
                          !highlightedSet.has(node.id)
                        }
                        connectionCount={connectionCounts.get(node.id) || 0}
                        onClick={() => onSelectNode(node.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
